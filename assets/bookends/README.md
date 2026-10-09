# Bookends

The series sting, built from the blueprint Sora intros in `../intros`. They mirror the docs landing headline: open on the plan, close on the built hull, and the demo in between is the building.

- `open-lay-the-keel.mp4` (8.1s): the blueprint draws itself in full (keel, ribs, wheelhouse, mast), slowed 1.2x, holding about 3s on the finished drawing so viewers settle before the screen share. Title "Lay the keel." over the sheet. Ambient audio, no narration. An earlier cut dissolved into the paper-to-hull clip at 3.6s; it felt clipped because the drawing never finished.
- `close-raise-the-ribs.mp4` (8.2s): the half-built hull at dawn in San Sebastián harbor, slowed, end card "Raise the ribs." with the install line and docs URL over a navy scrim.
- Per short, overlay a `FIG. NN · <TOPIC>` tag top right during the opener (the landing's figure-tag style), so episodes are numbered like figures.

Rebuild: `../../tools/cards.mjs` renders the overlays (kinds `open-title` and `close-card`, written to `cards/`), `source/bookends.sh` cuts the videos. Per-short overlays (the fig tag on the opener, the `SHEET NN · ACT X` title block on the closer) are rendered by `tools/compose.py` for each short; these two clips never change per short. Palette and type follow `keelson/docs/STYLE.md` (navy #1e3a5f, brass #b5803a, Inter 300 letterspaced caps, JetBrains Mono).
