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
    result = subprocess.run(args, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
    if result.returncode:
        raise RuntimeError(result.stderr[-5000:])


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
    filtergraph = (
        f"color=c={color}:s=1920x1080:r={FPS}:d={duration}[bg];"
        "[bg]null[decor];"
        f"[1:v]scale=-1:980:force_original_aspect_ratio=decrease,fps={FPS},"
        f"tpad=stop_mode=clone:stop_duration=3,trim=end_frame={frames},setpts=PTS-STARTPTS[screen];"
        "[decor]drawbox=x=710:y=50:w=500:h=1010:color=#B9D8E5@0.28:t=fill[shadow];"
        "[shadow]drawbox=x=694:y=34:w=500:h=1010:color=white:t=fill[frame];"
        "[frame][screen]overlay=(W-w)/2:(H-h)/2:shortest=1,format=yuv420p[out]"
    )
    run(
        [
            "ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c={color}:s=1920x1080:r={FPS}:d={duration}",
            "-loop", "1", "-i", str(image), "-filter_complex", filtergraph, "-map", "[out]", "-an",
            "-frames:v", str(frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18", str(outfile),
        ]
    )


def render_trace_video(frames: int, outfile: Path) -> None:
    source = SOURCE / "trace-a-gameplay.mp4"
    duration = frames / FPS
    # Lead with the real A tracing interaction, then show the complete portrait
    # app screen. The old tight crop made the app feel like a floating fragment.
    # This source capture changes to the general Animal Friends page after
    # about 2.7 seconds; use only its clean A-tracing portion.
    live_frames = min(round(2.5 * FPS), frames // 3)
    still_frames = frames - live_frames
    live = TMP / "trace-live.mp4"
    still = TMP / "trace-still.mp4"
    live_vf = (
        f"trim=start=0:duration={live_frames/FPS},setpts=PTS-STARTPTS,"
        "scale=1240:980:force_original_aspect_ratio=decrease,pad=1240:980:(ow-iw)/2:(oh-ih)/2:color=white,"
        f"fps={FPS},tpad=stop_mode=clone:stop_duration=1,trim=end_frame={live_frames},setpts=PTS-STARTPTS"
    )
    live_graph = f"color=c=#E3F6FF:s=1920x1080:r={FPS}:d={live_frames/FPS}[bg];[0:v]{live_vf}[app];[bg][app]overlay=(W-w)/2:(H-h)/2,format=yuv420p[out]"
    run(["ffmpeg", "-y", "-i", str(source), "-filter_complex", live_graph, "-map", "[out]", "-an", "-frames:v", str(live_frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", str(live)])

    still_duration = still_frames / FPS
    still_filter = (
        f"color=c=#E5F8FF:s=1920x1080:r={FPS}:d={still_duration}[bg];"
        f"[1:v]scale=-1:980:force_original_aspect_ratio=decrease,fps={FPS},"
        f"tpad=stop_mode=clone:stop_duration=3,trim=end_frame={still_frames},setpts=PTS-STARTPTS[screen];"
        "[bg]drawbox=x=710:y=50:w=500:h=1010:color=#B9D8E5@0.28:t=fill[shadow];"
        "[shadow]drawbox=x=694:y=34:w=500:h=1010:color=white:t=fill[frame];"
        "[frame][screen]overlay=(W-w)/2:(H-h)/2:shortest=1,format=yuv420p[out]"
    )
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=#E5F8FF:s=1920x1080:r={FPS}:d={still_duration}", "-loop", "1", "-i", str(SOURCE / "tracing-screen-uppercase-a.png"), "-filter_complex", still_filter, "-map", "[out]", "-an", "-frames:v", str(still_frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", str(still)])
    transition = 0.25
    graph = (
        f"[0:v]tpad=stop_mode=clone:stop_duration={transition},setpts=PTS-STARTPTS[move];"
        "[1:v]setpts=PTS-STARTPTS[screen];"
        f"[move][screen]xfade=transition=fade:duration={transition}:offset={live_frames/FPS},"
        f"trim=end_frame={frames},setpts=PTS-STARTPTS,format=yuv420p[out]"
    )
    run(["ffmpeg", "-y", "-i", str(live), "-i", str(still), "-filter_complex", graph, "-map", "[out]", "-an", "-frames:v", str(frames), "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", str(outfile)])


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
    # Keep each spoken beat moving. The saved frames extend the closing card
    # instead of creating little dead-air gaps after every line.
    holds = {1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 7: 1, 8: 1, 9: 1, 11: 1, 12: 1, 13: 63}
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
            render_color_card(SOURCE / "learn-screen-uppercase-a-apple-alligator.png", "#FFF2CC", frames, dest)
        elif scene == 12:
            render_color_card(SOURCE / "tracing-screen-uppercase-a.png", "#DDF7E5", frames, dest)
        elif scene == 13:
            render_end_card(frames, dest)
        else:
            raise AssertionError(f"Unexpected scene {scene}")
        segments.append(dest)

    answer_pause_start = sum(durations[s] for s in [1, 2, 3, 4, 5, 6, 7, 8, 9]) / FPS

    inputs: list[str] = []
    for scene in spoken_scenes:
        inputs.extend(["-i", str(VO / f"scene-{scene:02}.mp3")])
    inputs.extend(["-stream_loop", "-1", "-i", str(SOURCE / "abc-friends-gentle-loop.mp3")])
    filters: list[str] = []
    cursor = 0
    voice_labels: list[str] = []
    for index, scene in enumerate(spoken_scenes):
        label = f"v{index}"
        delay_ms = round(cursor / FPS * 1000)
        filters.append(f"[{index}:a]aresample=48000,volume=1,adelay={delay_ms}:all=1,apad=whole_dur=60[{label}]")
        voice_labels.append(f"[{label}]")
        cursor += durations[scene]
        if scene == 9:
            cursor += durations[10]
    filters.append(f"{''.join(voice_labels)}amix=inputs={len(spoken_scenes)}:duration=longest:normalize=0[voice]")
    music_input = len(spoken_scenes)
    music_volume = (
        "if(lt(t,0.6),0.14*t/0.6,"
        f"if(lt(t,{answer_pause_start}),0.14,"
        f"if(lt(t,{answer_pause_start+2}),0.08,"
        "if(lt(t,58.8),0.14,0.14*(60-t)/1.2))))"
    )
    filters.append(f"[{music_input}:a]atrim=duration=60,asetpts=PTS-STARTPTS,volume='{music_volume}':eval=frame[music]")
    filters.append("[voice][music]amix=inputs=2:duration=longest:normalize=0,alimiter=limit=0.95[aout]")

    transition = 0.25
    scene_input_start = len(spoken_scenes) + 1
    for segment in segments:
        inputs.extend(["-i", str(segment)])
    video_filters: list[str] = []
    for index in range(len(segments)):
        pad = "tpad=stop_mode=clone:stop_duration=0.25," if index < len(segments) - 1 else ""
        video_filters.append(f"[{scene_input_start + index}:v]setpts=PTS-STARTPTS,{pad}fps={FPS},format=yuv420p[v{index}]")
    current = "v0"
    accumulated = durations[1] / FPS
    for index in range(1, len(segments)):
        output_label = f"x{index}"
        video_filters.append(f"[{current}][v{index}]xfade=transition=fade:duration={transition}:offset={accumulated:.6f}[{output_label}]")
        current = output_label
        accumulated += durations[index + 1] / FPS
    video_filters.append(f"[{current}]tpad=stop_mode=clone:stop_duration=1,trim=end_frame={TOTAL_FRAMES},setpts=PTS-STARTPTS[vfinal]")
    filters.extend(video_filters)
    run(
        [
            "ffmpeg", "-y", *inputs, "-filter_complex", ";".join(filters),
            "-map", "[vfinal]", "-map", "[aout]", "-frames:v", str(TOTAL_FRAMES),
            "-t", "60", "-r", str(FPS), "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(OUTPUT),
        ]
    )
    print(OUTPUT)


if __name__ == "__main__":
    main()
