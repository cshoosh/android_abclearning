#!/usr/bin/env python3
"""Generate one Teacher line using the repository's locked ComfyUI/Qwen profile."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import time
import uuid
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from hashlib import sha256


PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROFILE_PATH = PROJECT_ROOT / "docs/voiceover/teacher-voice-profile.json"
REFERENCE_NAME = "abc-friends-teacher-master-reference.mp3"
POLL_INTERVAL_SECONDS = 2
MAX_WAIT_SECONDS = 1800


def request_json(url: str, *, payload: dict | None = None, timeout: int = 30) -> dict:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    headers = {} if data is None else {"Content-Type": "application/json"}
    request = Request(url, data=data, headers=headers)
    with urlopen(request, timeout=timeout) as response:
        return json.load(response)


def git_revision(path: Path) -> str:
    result = subprocess.run(
        ["git", "-C", str(path), "rev-parse", "HEAD"],
        check=True,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip()


def main() -> int:
    profile = json.loads(PROFILE_PATH.read_text(encoding="utf-8"))
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--text", required=True, help="The English Teacher line to generate")
    parser.add_argument("--output", required=True, help="Output MP3 path, relative to the project or absolute")
    parser.add_argument(
        "--comfyui-dir",
        default=os.environ.get("COMFYUI_DIR"),
        help="ComfyUI installation directory (or set COMFYUI_DIR)",
    )
    parser.add_argument(
        "--comfyui-url",
        default=os.environ.get("COMFYUI_URL", "http://127.0.0.1:8188"),
        help="ComfyUI API base URL",
    )
    args = parser.parse_args()

    if not args.comfyui_dir:
        parser.error("Set COMFYUI_DIR or pass --comfyui-dir with your ComfyUI installation folder.")
    output_path = Path(args.output).expanduser()
    if output_path.suffix.lower() != ".mp3":
        parser.error("Teacher voice output must use the .mp3 extension.")

    comfyui_dir = Path(args.comfyui_dir).expanduser().resolve()
    generator = profile["generator"]
    node_dir = comfyui_dir / "custom_nodes/ComfyUI-QwenTTS"
    try:
        pins = (
            (comfyui_dir, generator["comfyui_git_commit"], "ComfyUI"),
            (node_dir, generator["custom_node_git_commit"], "ComfyUI-QwenTTS"),
        )
        for repo, expected, label in pins:
            actual = git_revision(repo)
            if actual != expected:
                parser.error(f"{label} must be checked out at {expected}; found {actual} in {repo}")
    except (subprocess.CalledProcessError, FileNotFoundError) as error:
        parser.error(f"Could not verify the pinned ComfyUI/Qwen node Git revision: {error}")

    model_dir = comfyui_dir / "models/TTS/Qwen3-TTS/Qwen3-TTS-12Hz-1.7B-Base"
    revision_metadata = model_dir / ".cache/huggingface/download/model.safetensors.metadata"
    try:
        installed_model_revision = revision_metadata.read_text(encoding="utf-8").splitlines()[0].strip()
    except (OSError, IndexError):
        parser.error(f"Pinned Qwen model metadata is missing: {revision_metadata}")
    if installed_model_revision != generator["model_revision"]:
        parser.error(
            f"Qwen model must be revision {generator['model_revision']}; "
            f"found {installed_model_revision} in {revision_metadata}"
        )

    input_dir = comfyui_dir / "input"
    if not input_dir.is_dir():
        parser.error(f"ComfyUI input folder was not found: {input_dir}")

    reference = PROJECT_ROOT / profile["reference_audio"]
    reference_hash = sha256(reference.read_bytes()).hexdigest()
    if reference_hash != profile["reference_audio_sha256"]:
        parser.error(f"Teacher reference audio checksum mismatch: {reference}")
    target_reference = input_dir / REFERENCE_NAME
    if target_reference.exists():
        if target_reference.read_bytes() != reference.read_bytes():
            parser.error(f"A different file already exists at {target_reference}; move it before continuing.")
        copied_reference = False
    else:
        shutil.copy2(reference, target_reference)
        copied_reference = True

    inference = profile["inference"]
    workflow = {
        "1": {"class_type": "LoadAudio", "inputs": {"audio": REFERENCE_NAME}},
        "2": {
            "class_type": profile["generator"]["node"],
            "inputs": {
                "target_text": args.text,
                "model_size": inference["model_size"],
                "device": inference["device"],
                "precision": inference["precision"],
                "language": inference["language"],
                "reference_audio": ["1", 0],
                "reference_text": profile["reference_text"],
                "x_vector_only": inference["x_vector_only"],
                "max_new_tokens": inference["max_new_tokens"],
                "do_sample": inference["do_sample"],
                "top_p": inference["top_p"],
                "top_k": inference["top_k"],
                "temperature": inference["temperature"],
                "repetition_penalty": inference["repetition_penalty"],
                "attention": inference["attention"],
                "unload_models": inference["unload_models"],
                "seed": inference["seed"],
            },
        },
        "3": {
            "class_type": "SaveAudioMP3",
            "inputs": {
                "audio": ["2", 0],
                "filename_prefix": f"abc-friends/teacher/{output_path.stem}",
                "quality": inference["mp3_quality"],
            },
        },
    }

    try:
        result = request_json(
            f"{args.comfyui_url.rstrip('/')}/prompt",
            payload={"prompt": workflow, "client_id": f"abc-friends-teacher-{uuid.uuid4()}"},
        )
        prompt_id = result["prompt_id"]
        if result.get("node_errors"):
            raise RuntimeError(f"ComfyUI rejected the workflow: {result['node_errors']}")

        deadline = time.monotonic() + MAX_WAIT_SECONDS
        while time.monotonic() < deadline:
            time.sleep(POLL_INTERVAL_SECONDS)
            history = request_json(f"{args.comfyui_url.rstrip('/')}/history/{prompt_id}")
            item = history.get(prompt_id)
            if not item:
                continue
            status = item.get("status", {})
            if status.get("status_str") == "error":
                raise RuntimeError(f"ComfyUI generation failed: {status.get('messages', [])}")
            audio_outputs = item.get("outputs", {}).get("3", {}).get("audio", [])
            if not audio_outputs:
                continue

            audio = audio_outputs[0]
            view_query = urlencode(
                {
                    "filename": audio["filename"],
                    "subfolder": audio.get("subfolder", ""),
                    "type": audio.get("type", "output"),
                }
            )
            with urlopen(f"{args.comfyui_url.rstrip('/')}/view?{view_query}", timeout=60) as response:
                if not output_path.is_absolute():
                    output_path = PROJECT_ROOT / output_path
                output_path.parent.mkdir(parents=True, exist_ok=True)
                output_path.write_bytes(response.read())
            print(output_path.resolve())
            return 0

        raise TimeoutError(f"ComfyUI did not finish within {MAX_WAIT_SECONDS // 60} minutes. Prompt: {prompt_id}")
    except URLError as error:
        raise SystemExit(f"Cannot reach ComfyUI at {args.comfyui_url}: {error}") from error
    except (KeyError, RuntimeError, TimeoutError) as error:
        raise SystemExit(str(error)) from error
    finally:
        if copied_reference:
            target_reference.unlink(missing_ok=True)


if __name__ == "__main__":
    raise SystemExit(main())
