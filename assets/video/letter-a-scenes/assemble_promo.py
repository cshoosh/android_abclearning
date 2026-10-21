#!/usr/bin/env python3
"""Assemble the approved Letter A storyboard from its generated and app clips."""

from __future__ import annotations

import math
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
SCENES = ROOT / "assets/video/letter-a-scenes"
GENERATED = SCENES / "generated"
SOURCE = SCENES / "source-media"
VO = ROOT / "assets/voiceover/promo-scenes"
TMP = ROOT / "assets/video/.letter-a-render"
OUTPUT = ROOT / "assets/video/letter-a-promo-final.mp4"
FPS = 24
TOTAL_FRAMES = 60 * FPS


def run(args: list[str]) -> None:
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def frames_for_voice(scene: int) -> int:
    audio = VO / f"scene-{scene:02}.mp3"
    duration = float(
        subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(audio)],
            text=True,
        ).strip()
    )
    return math.ceil(duration * FPS)


def render_generated(scene: int, frames: int, outfile: Path) -> None:
    source = GENERATED / f"scene-{scene:02}.mp4"
    frame_colors = {
        1: "#BFEFFF",
        2: "#FFE9B5",
        3: "#DDF4D8",
        4: "#DCD8FF",
        5: "#FFDCCB",
        7: "#C9EFFF",
        8: "#DFF2C2",
        10: "#FFF0BB",
        11: "#E8D8FF",
    }
    filtergraph = (
        "scale=1680:945,crop=1632:918:"
        "x='(in_w-out_w)/2+8*sin(t*1.4)':y='(in_h-out_h)/2',"
        f"pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color={frame_colors[scene]},"
        f"fps={FPS},tpad=stop_mode=clone:stop_duration=3,trim=end_frame={frames},setpts=PTS-STARTPTS"
    )
    run(
        [
            "ffmpeg", "-y", "-i", str(source), "-vf", filtergraph, "-an", "-frames:v", str(frames),
            "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", str(outfile),
        ]
    )


def render_color_card(image: Path, color: str, frames: int, outfile: Path, crop: str = "") -> None:
    duration = frames / FPS
    if crop:
        image_filter = f"crop={crop},"
    else:
        image_filter = ""
    filtergraph = (
        f"color=c={color}:s=1920x1080:r={FPS}:d={duration}[bg];"
        f"[1:v]{image_filter}scale=1500:1040:force_original_aspect_ratio=decrease,"
        "pad=1500:1040:(ow-iw)/2:(oh-ih)/2:color=white,"
        "zoompan=z='min(1.015+0.00035*on,1.055)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':"
        f"d=1:s=1500x1040:fps={FPS},trim=end_frame={frames},setpts=PTS-STARTPTS[card];"
        "[bg][card]overlay=(W-w)/2:(H-h)/2:shortest=1,format=yuv420p[out]"
    )
    run(
        [
            "ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c={color}:s=1920x1080:r={FPS}:d={duration}",
            "-loop", "1", "-i", str(image), "-filter_complex", filtergraph, "-map", "[out]", "-an",
            "-frames:v", str(frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18", str(outfile),
        ]
    )


def render_trace_video(frames: int, outfile: Path) -> None:
    source = SOURCE / "abc-friends-gameplay-preview.mp4"
    duration = frames / FPS
    # Start with the genuine on-screen A tracing interaction. Then hold the real
    # app's A-only tracing canvas as a slow push-in for the rest of this long VO.
    live_frames = 4 * FPS
    still_frames = frames - live_frames
    live = TMP / "trace-live.mp4"
    still = TMP / "trace-still.mp4"
    live_vf = (
        f"trim=start=7.3:duration={live_frames/FPS},setpts=PTS-STARTPTS,"
        "crop=960:760:60:600,scale=1920:1080:force_original_aspect_ratio=increase,"
        "crop=1920:1080:x='(in_w-out_w)/2+12*sin(t*1.5)':y='(in_h-out_h)/2',"
        f"fps={FPS},tpad=stop_mode=clone:stop_duration=1,trim=end_frame={live_frames},setpts=PTS-STARTPTS"
    )
    run(["ffmpeg", "-y", "-i", str(source), "-vf", live_vf, "-an", "-frames:v", str(live_frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", str(live)])

    still_duration = still_frames / FPS
    still_filter = (
        f"color=c=#E5F8FF:s=1920x1080:r={FPS}:d={still_duration}[bg];"
        f"[1:v]scale=1500:1040:force_original_aspect_ratio=decrease,"
        "pad=1500:1040:(ow-iw)/2:(oh-ih)/2:color=white,"
        "zoompan=z='min(1.02+0.0003*on,1.055)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':"
        f"d=1:s=1500x1040:fps={FPS},trim=end_frame={still_frames},setpts=PTS-STARTPTS[card];"
        "[bg][card]overlay=(W-w)/2:(H-h)/2:shortest=1,format=yuv420p[out]"
    )
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=#E5F8FF:s=1920x1080:r={FPS}:d={still_duration}", "-loop", "1", "-i", str(SOURCE / "trace-a-panel.png"), "-filter_complex", still_filter, "-map", "[out]", "-an", "-frames:v", str(still_frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", str(still)])
    listing = TMP / "trace-parts.txt"
    listing.write_text(f"file '{live.as_posix()}'\nfile '{still.as_posix()}'\n")
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listing), "-an", "-c", "copy", str(outfile)])


def render_end_card(frames: int, outfile: Path) -> None:
    source = SOURCE / "abc-friends-end-card.png"
    alfie_clip = GENERATED / "scene-04.mp4"
    graph = (
        "[0:v]drawbox=x=190:y=220:w=220:h=220:color=#EAF7FC:t=fill,format=yuv420p[card];"
        f"[1:v]scale=220:124,fps={FPS},trim=end_frame={frames},setpts=PTS-STARTPTS[characters];"
        "[card][characters]overlay=x=190:y=268:shortest=1,format=yuv420p[out]"
    )
    run([
        "ffmpeg", "-y", "-loop", "1", "-i", str(source), "-i", str(alfie_clip),
        "-filter_complex", graph, "-map", "[out]", "-an", "-frames:v", str(frames), "-r", str(FPS),
        "-c:v", "libx264", "-preset", "fast", "-crf", "18", str(outfile),
    ])


def main() -> None:
    TMP.mkdir(parents=True, exist_ok=True)
    generated_scenes = [1, 2, 3, 4, 5, 7, 8, 10, 11]
    spoken_scenes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13]
    voice_frames = {scene: frames_for_voice(scene) for scene in spoken_scenes}
    holds = {1: 6, 2: 6, 3: 6, 4: 6, 5: 6, 7: 5, 8: 5, 9: 5, 11: 4, 12: 6, 13: 18}
    durations = {scene: voice_frames[scene] + holds.get(scene, 0) for scene in spoken_scenes}
    durations[10] = 2 * FPS
    if sum(durations.values()) != TOTAL_FRAMES:
        raise ValueError(f"Timeline is {sum(durations.values())} frames, expected {TOTAL_FRAMES}")

    segments: list[Path] = []
    for scene in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]:
        dest = TMP / f"scene-{scene:02}.mp4"
        frames = durations[scene]
        if scene in generated_scenes:
            render_generated(scene, frames, dest)
        elif scene == 6:
            render_trace_video(frames, dest)
        elif scene == 9:
            render_color_card(SOURCE / "learn-a-panel.png", "#FFF2CC", frames, dest)
        elif scene == 12:
            render_color_card(SOURCE / "trace-a-panel.png", "#DDF7E5", frames, dest)
        elif scene == 13:
            render_end_card(frames, dest)
        else:
            raise AssertionError(f"Unexpected scene {scene}")
        segments.append(dest)

    listing = TMP / "video-parts.txt"
    listing.write_text("".join(f"file '{p.as_posix()}'\n" for p in segments))
    silent_pause_start = sum(durations[s] for s in [1, 2, 3, 4, 5, 6, 7, 8, 9]) / FPS

    inputs: list[str] = []
    for scene in spoken_scenes:
        inputs.extend(["-i", str(VO / f"scene-{scene:02}.mp3")])
    inputs.extend(["-stream_loop", "-1", "-i", str(SOURCE / "abc-friends-playful-theme-loop.mp3")])
    filters: list[str] = []
    cursor = 0
    voice_labels: list[str] = []
    for index, scene in enumerate(spoken_scenes):
        label = f"v{index}"
        delay_ms = round(cursor / FPS * 1000)
        filters.append(f"[{index + 1}:a]aresample=48000,volume=1,adelay={delay_ms}:all=1,apad=whole_dur=60[{label}]")
        voice_labels.append(f"[{label}]")
        cursor += durations[scene]
        if scene == 9:
            cursor += durations[10]
    filters.append(f"{''.join(voice_labels)}amix=inputs={len(spoken_scenes)}:duration=longest:normalize=0[voice]")
    music_input = len(spoken_scenes) + 1
    pause_end = silent_pause_start + 2
    music_volume = (
        "if(lt(t,0.5),0.20*t/0.5,"
        f"if(lt(t,{silent_pause_start-0.18}),0.20,"
        f"if(lt(t,{silent_pause_start}),0.20*({silent_pause_start}-t)/0.18,"
        f"if(lt(t,{pause_end}),0,"
        f"if(lt(t,{pause_end+0.18}),0.20*(t-{pause_end})/0.18,"
        "if(lt(t,58.6),0.20,0.20*(60-t)/1.4))))))"
    )
    filters.append(f"[{music_input}:a]atrim=duration=60,asetpts=PTS-STARTPTS,volume='{music_volume}':eval=frame[music]")
    filters.append("[voice][music]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[aout]")

    run(
        [
            "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(listing), *inputs,
            "-filter_complex", ";".join(filters), "-map", "0:v:0", "-map", "[aout]", "-frames:v", str(TOTAL_FRAMES),
            "-t", "60", "-r", str(FPS), "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(OUTPUT),
        ]
    )
    print(OUTPUT)


if __name__ == "__main__":
    main()
