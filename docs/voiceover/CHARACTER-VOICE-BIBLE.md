# ABC Friends Character Voice Bible

This document is the source of truth for recurring character voices in ABC Friends promo and learning audio. Keep each profile stable across episodes. Update a profile only after the voice is reviewed and approved.

## Teacher

- **Status:** Approved. This is the canonical Teacher voice profile for all future ABC Friends voices.
- **Voice:** Female, soft, warm, and reassuring.
- **Accent:** Natural Australian English (General Australian); keep vowels and pronunciation consistent.
- **Delivery:** Clear, joyful, and excited teacher speaking to young children. Bright, lively energy with a warm smile in the voice; keep the tone soft and friendly, with clear articulation and natural pacing.
- **Avoid:** American or British accent drift, flat or sleepy delivery, harsh volume, shouting, rushed speech, exaggerated cartoon affect, singing, or a strong regional Australian accent.
- **Voice direction:** `A soft, warm adult female teacher speaking natural General Australian English. Joyful, bright, and genuinely excited to teach young children, with a warm smile in the voice. Lively and expressive while staying gentle, friendly, and clear. Natural pacing and clear Australian vowels. Avoid strong regional accent, American or British pronunciation, flat delivery, shouting, harshness, exaggerated cartoon acting, and singing.`
- **Canonical reference:** [Teacher master reference](../../assets/voiceover/teacher-master-reference.mp3), transcript: “Hello, little learners! Are you ready to meet a very special letter?” Do not replace or regenerate this reference without a new explicit voice approval.
- **Generation settings:** Always use reference-audio voice cloning with the exact reference above. Do not use voice design or a preset voice for Teacher lines. The locked ComfyUI/Qwen model, node, seed, and inference parameters are in [teacher-voice-profile.json](teacher-voice-profile.json); generate new lines with [generate_teacher_voice.py](../../scripts/voiceover/generate_teacher_voice.py).
- **Reproducibility:** The reference audio and generation profile are stored in the repository, so another Mac pulling the project can use the same voice source and settings. Use the recorded ComfyUI, Qwen node, and model revisions. The voice identity should remain consistent, although hardware and runtime differences can change the exact audio waveform or small delivery details.
- **Consistency check samples:** These five lines were cloned from the approved reference and confirmed as the same Teacher voice.
  - [1](../../assets/voiceover/teacher-samples/01-consistency.mp3) — “Hello, little learners! Let us have fun learning the letter A!”
  - [2](../../assets/voiceover/teacher-samples/02-consistency.mp3) — “A is for apple. A says ah!”
  - [3](../../assets/voiceover/teacher-samples/03-consistency.mp3) — “Can you make an uppercase A with me?”
  - [4](../../assets/voiceover/teacher-samples/04-consistency.mp3) — “Start at the top, slide down, and add a line across the middle.”
  - [5](../../assets/voiceover/teacher-samples/05-consistency.mp3) — “Fantastic work! You made an uppercase A!”

## Reproduce the Teacher voice on another Mac

The master reference, locked settings, and generation script are versioned in this project. Follow the pins in `teacher-voice-profile.json`; do not update ComfyUI, the Qwen custom node, the Qwen model revision, the reference audio, or its transcript for Teacher work.

1. Pull this project and install ComfyUI with the Qwen TTS custom node. Check both repositories out at the exact Git commits listed in `teacher-voice-profile.json`:

   ```sh
   git -C "$COMFYUI_DIR" checkout 7a28332047b6af638dc6c7f72ef3481a718769fd
   git -C "$COMFYUI_DIR/custom_nodes/ComfyUI-QwenTTS" checkout d8122a8ba835b65fd65c113d2b273b1ad1579293
   ```

2. Download `Qwen/Qwen3-TTS-12Hz-1.7B-Base` at the pinned model revision into the ComfyUI model folder. The Hugging Face `hf download` command supports a full commit revision and local directory ([official CLI docs](https://huggingface.co/docs/huggingface_hub/guides/cli)):

   ```sh
   hf download Qwen/Qwen3-TTS-12Hz-1.7B-Base \
     --revision fd4b254389122332181a7c3db7f27e918eec64e3 \
     --local-dir "$COMFYUI_DIR/models/TTS/Qwen3-TTS/Qwen3-TTS-12Hz-1.7B-Base"
   ```

   Keep its Hugging Face download metadata so the generator can verify the revision.
3. Start ComfyUI, then generate each line from the project root:

   ```sh
   python3 scripts/voiceover/generate_teacher_voice.py \
     --comfyui-dir "/path/to/ComfyUI" \
     --text "Your Teacher line goes here." \
     --output output/voiceover/teacher-new-line.mp3
   ```

   The script checks the pinned ComfyUI, Qwen node, model revision, and reference audio checksum before submitting the locked workflow. It saves the MP3 at the requested project path.

The fixed MPS/FP16 profile targets Apple Silicon Macs. Same source, revisions, reference, settings, and seed preserve the Teacher's voice identity; another Mac's hardware/runtime can still change small performance details or waveform bytes. Keep approved generated audio in the repository when an identical playback file must be used everywhere.

## Character profile template

Add a separate section for each recurring speaking character. Document voice type, accent, delivery, avoid-list, and the exact generation instruction. Do not reuse one character's profile for another character.
