# Letter A Promo Final Edit

The finished promo is `assets/video/letter-a-promo-final.mp4` (1920 × 1080, 24 fps, 60 seconds). It follows the approved 13-beat script and uses the approved Teacher recordings.

## Edit choices

- The nine existing LTX clips supply scenes 01–05, 07–08, 10, and 11. Scene handoffs use 0.25-second dissolves so the visual changes feel connected while preserving the full minute.
- The app inserts use full portrait captures in a simple device frame: a genuine A tracing interaction, the uppercase A tracing screen, and the Learn ABC screen with A, apple, and Alfie. Only the clean A-tracing part of the live capture is used; it cuts to the full app screen before the original recording changes to the general Animal Friends page.
- The Find the Letter capture is excluded because it currently shows B and B/C/E/F choices. It is not presented as an A screen.
- The two-second answer pause remains between “Can you find A?” and the separate “Hooray!” scene. Teacher lines now run with only a one-frame visual breath between them. The music stays quietly present under the answer pause.
- The existing gentle instrumental app theme replaces the previous orchestral track. It sits softly under the Teacher and fades with the closing end card.
- The official ABC Friends end card remains at the end, with its app-icon slot filled by the existing A-and-Alfie animation.

## Rebuild

From the repository root, run:

```sh
python3 assets/video/letter-a-scenes/assemble_promo.py
```

The script reads only the checked-in LTX clips, promo voice tracks, and promo source media. Its temporary render files are kept under `assets/video/.letter-a-render/`.
