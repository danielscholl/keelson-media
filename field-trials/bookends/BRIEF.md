# Field Trials bookends, Sora pass 1

Candidate Sora openers and closers for the Field Trials strand, first used on Field Trials 01 · Seven Pages. The user picks a pairing, or mixes an opener from one with a closer from another, from the review reels.

## Context

- Field Trials 01 is an OSDU #sig-interop 15% project by Daniel Scholl at Microsoft: can AI agents do real work on a real, shared OSDU platform (a shared ADME instance, said "Ad-Me", used by about a dozen companies). The audience is Microsoft and OSDU people who have never seen Keelson.
- The current cut is `../admeinterop/final.mp4`. It opens on a TRIAL PLAN title block drawn on a blank blueprint sheet and closes on a TRIAL REPORT block with the same layout, which ends with a "Powered by Keelson" credit row.
- Sora goes in front of the trial plan (the opener) and after the trial report as the final close.
- The style the user liked is `../../assets/intros/sora-blueprint-draws-4s.mp4` (its prompt sits beside it), built into `../../assets/bookends/open-lay-the-keel.mp4`: a flat, top-down drafting sheet where crisp navy lines draw themselves, with brass accents. Every opener keeps that drawing style. Closers vary.
- The sheet to hand off into is the plate's first frame: a pale blue-white sheet (gradient #f3f5f8 to #e6eaf0), a faint navy grid (72 px major, 18 px minor at 1080p) and crop marks in the corners. Palette: navy #1e3a5f, rib blue #2f6fb0, brass #b5803a, brass ink #8a5a1f.

## Pairings (prompts in `prompts/`)

| | Opener, drawn | Closer | Idea |
|---|---|---|---|
| A · Benchmark | contour map, a survey line, brass benchmarks set along it | a real brass benchmark disc in rock, a staked line to the horizon, golden hour | the header's benchmark glyph; from plan to field |
| B · Instrument | a theodolite on a tripod draws itself, with a sight line to a target | the real theodolite in a field at dawn, slow orbit | the Keelson pairing's shape (drawing, then the real thing) without a ship |
| C · Core | geological cross-section, a borehole, one layer fills brass | a real rock core lying on the sheet, macro dolly | the drawing predicts, the field confirms |
| D · Shared sheet | twelve lines from the edges meet at one center | the same sheet at dusk, light travelling every line, pull back to the table | a dozen companies, one platform |
| E · Seismic | one trace, then dozens, until layers emerge | the section lifts into a 3D block | seismic access is part of the story |
| F (optional) | the worker's own idea, same drawing style | its own closer | |

## Rules

- Generate with `../../tools/sora.py` as it is, for example `python3 ../../tools/sora.py prompts/A-open.txt takes/A-open-1.mp4 --seconds 4` (1280x720). Run jobs one at a time: the deployment takes about one job at a time, another session may be generating too, and sora.py retries 429s.
- First pass is one 4 s take per prompt. Retake once, from an edited copy of the prompt (`prompts/A-open.v2.txt`), only when a take fails QA. Use an 8 s take only for an opener whose drawing visibly cuts off at 4 s. Cap: 24 generations or 120 generated seconds, whichever comes first.
- Reject a take that shows any letters, numbers or glyph-like marks; people, faces or hands; ships, boats or hulls; logos; melting or warping linework; or camera shake. An opener must end on a still, flat, top-down drawing on a light sheet. A closer must end calm, so a credit card can sit over its last seconds.
- Prompts never name a real company, product or logo, and never use ship, boat, hull or keel imagery. The audience hasn't met Keelson's ship; the only Keelson mark is the credit row the plate renders.
- sora.py reads the key from the environment or fetches it with az in process. Never print the key or write it to a file, and don't copy the subscription id into any new file.
- Never open or use `~/Downloads/ADMEInterop.pdf` or anything from the real access guide.
- Write only under `field-trials/bookends/`. `admeinterop/`, `assets/` and `tools/` are read only. Don't edit the treatment, `short.yaml` or `LEDGER.md`. No git commits, no artifacts, nothing posted.

## Review deliverables (`review/`)

1. One reel per pairing, 1920x1080 at 30 fps, built the way `../../assets/bookends/source/bookends.sh` builds the series bookends (setpts slowdown, tpad hold, lanczos upscale): the opener at 1.0x (1.1x at most) with no more than a 0.5 s hold, since it only sets the atmosphere before the trial plan and the episode's question shouldn't land later than it has to; a 0.8 s crossfade into the first 4 s of `../admeinterop/raw/plate.mp4` (the blank sheet, then the trial plan starting to draw), a hard cut to the last 3 s of plate.mp4 (the finished TRIAL REPORT), and a 0.8 s crossfade into the closer slowed about 1.4x with a 1.5 s hold. Keep Sora's ambient audio under the Sora parts (atempo to match the slowdown) and silence under the plate, which has no audio stream.
2. `all-pairings.mp4`: the reels back to back, each after a 1.5 s slate on the blank sheet that reads its letter and name in navy Inter.
3. `contact.png`: one labelled row per pairing with the opener's first, middle and last frames and the closer's first, middle and last frames.
4. `README.md`: every take, its prompt file, pass or fail and why; a ranking with one sentence each; any mix-and-match pairing worth trying.
