# Letter A Promo Final Edit

The finished 60-second promo is `assets/video/letter-a-promo-final.mp4` (1920 × 1080, 24 fps). It follows the approved 13-beat script, uses the separate Teacher recordings, and ends with the official end card.

## Edit choices

- The nine existing LTX clips supply scenes 01–05, 07–08, 10, and 11. Each is framed with a different pastel border and a gentle push-in to make the existing animation feel more active while keeping the established character art and soft blue/cream background.
- Scene 06 shows genuine A-tracing app footage and a slow move across the real tracing screen. Scene 09 uses the genuine Learn ABC screen cropped to the uppercase A, apple, and Alfie. The available Find the Letter capture shows B with B/C/E/F choices, so it is excluded from this A-only promo rather than relabelled.
- Scene 12 returns to the real uppercase-A tracing screen. Scene 13 uses the official ABC Friends name and Google Play badge; the supplied app icon is replaced with the existing A-and-Alfie clip so the lion and B/C blocks do not enter this A promo.
- The first-party ABC Friends playful theme is mixed quietly under the Teacher. Both narration and music dip to near silence for the separate two-second pause before “Hooray!”
- The narration is left at its approved speed. Scene lengths follow the recorded line durations, so the first five visual beats are a little tighter than the initial rough timing; the finished edit stays at 60 seconds.

## Rebuild

From the repository root, run:

```sh
python3 assets/video/letter-a-scenes/assemble_promo.py
```

The script reads only the checked-in LTX clips, promo voice tracks, and promo source media. Its temporary render files are kept under `assets/video/.letter-a-render/` and can be removed after rendering.
