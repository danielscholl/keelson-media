# Bookends

The series sting, built from the blueprint Sora intros in `../intros`. They mirror the docs landing headline: open on the plan, close on the built hull, and the demo in between is the building.

- `open-lay-the-keel.mp4` (8.1s): the blueprint draws itself in full (keel, ribs, wheelhouse, mast), slowed 1.2x, holding about 3s on the finished drawing so viewers settle before the screen share. Title "Lay the keel." over the sheet. Ambient audio, no narration. An earlier cut dissolved into the paper-to-hull clip at 3.6s; it felt clipped because the drawing never finished.
- `close-raise-the-ribs.mp4` (8.2s): the half-built hull at dawn in San Sebastián harbor, slowed, end card "Raise the ribs." with the install line and docs URL over a navy scrim.
- Per short, overlay a `FIG. NN · <TOPIC>` tag top right during the opener (the landing's figure-tag style), so episodes are numbered like figures.

Rebuild: `../../tools/cards.mjs` renders the overlays (kinds `open-title` and `close-card`, written to `cards/`), `source/bookends.sh` cuts the videos. Per-short overlays (the fig tag on the opener, the `SHEET NN · ACT X` title block on the closer) are rendered by `tools/compose.py` for each short; these two clips never change per short. Palette and type follow `keelson/docs/STYLE.md` (navy #1e3a5f, brass #b5803a, Inter 300 letterspaced caps, JetBrains Mono).

## Field Trials

The Field Trials strand (OSDU #sig-interop) has its own pair, keyed to a sketch-then-real idea: a field trial takes something that works on paper and makes it work in the field. Tagline: "On paper, it works. In the field, it has to."

- `open-field-trials.mp4` (6.6 s): a theodolite sights a pumpjack, drawn in navy and brass. The drawing is keyed off Sora's sheet and laid at 90% on the series blueprint sheet (`cards/field-sheet.png`, the plates' own sheet and crop marks), so it dissolves into any plate without a seam. Title FIELD TRIALS / ON PAPER, IT WORKS. fades in at 0.6 s. The take animates the pumpjack after the drawing and its counterweight melts, so the clip freezes at 2.53 s and holds about 4 s: the line "On paper, it works." plus a few seconds of still frame before the first board. Pen-scratch audio under the drawing only.
- `close-field-trials.mp4` (8.8 s): from behind a brass theodolite at sunrise, its telescope on a nodding pumpjack against the sun; a slow push-in ends on the pump. The card (FIELD TRIALS / ON PAPER, IT WORKS. / IN THE FIELD, IT HAS TO.) fades in over a navy scrim at 3.6 s, after the instrument has had its moment. Low field rumble, high-passed.
- Per episode, set the figtag to `TRIAL NN · TITLE` and give the `sheet` card `series: "FIELD TRIALS · OSDU #SIG-INTEROP"` and `from: 4.2`; put the opener line on scene `open` (about 1.9 s) and the sign-off on scene `close` (about 2.4 s), and fade the first board in with `xfade: 1.0` and the closer with `bookends.xfade: 1.0`.

Rebuild: `node ../../tools/cards.mjs source/field-cards.json && python3 source/field-trials.py` (`--still open|close` writes a preview frame). Sources and their remix chains are `../intros/sora-field-survey-{draw-4s,dawn-8s}.*`; the candidates and verdicts live in `field-trials/bookends/`.

