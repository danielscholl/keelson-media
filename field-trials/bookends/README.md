# Field Trials bookends, Sora pass 1: review

Six pairings, 22 generations, 88 s generated (cap 24 / 120 s). Every prompt got one first take and at most one retake, so nothing more can be generated in this pass.

## Review files (`review/`)

- `reel-A.mp4` … `reel-F.mp4`: each is opener, then plate intro, then plate outro, then closer; 1920x1080, 30 fps, 17.2 s.
- `all-pairings.mp4`: the six reels, each after a 1.5 s slate (112 s).
- `contact.png`: per pairing, the first, middle and last frames of the opener and of the closer.

Reel timing follows the updated brief. The opener plays at 1.0x with a 0.5 s hold, then crossfades for 0.8 s into the first 4 s of `plate.mp4`. A hard cut takes it to the last 3 s of the plate, then a 0.8 s crossfade into the closer, which is slowed 1.4x with a 1.5 s hold. Sora audio plays under the Sora parts (atempo matched), and the plate section is silent.

Two deviations: the plate's frame 0 is a one-frame poster card (OSDU header, PLATE block), so the reels start the plate at frame 1, the blank sheet. And this ffmpeg build has no `drawtext`, so the slates are rendered with PIL in Inter Bold and Medium on the plate's blank-sheet frame.

## Takes

| Take | Prompt | Verdict | Why |
|---|---|---|---|
| A-open-1 | `A-open.txt` | fail | Cream sheet, not blue-white; benchmarks render as raised coins and the last one splits in two at the end |
| A-open-2 | `A-open.v2.txt` | **pass** | Flat on the right sheet; contours, survey line, five benchmarks set down in order; ends still. The drawing sits small in the upper half |
| A-close-1 | `A-close.txt` | fail (caution) | Calm and well graded, but soft white shapes at the vanishing point could read as figures or tents |
| A-close-2 | `A-close.v2.txt` | **pass** | Brass disc on rock, a stake line to an empty horizon, golden hour; calm throughout |
| B-open-1 | `B-open.txt` | fail | Heavy vignette, and the tripod head redraws itself at 2.0–2.6 s |
| B-open-2 | `B-open.v2.txt` | **pass** | Best opener: starts blank, the theodolite draws part by part with brass fittings, the sight line reaches its target, ends still |
| B-close-1 | `B-close.txt` | **pass** | A real brass theodolite in a misty dawn field; near-static rather than an orbit, calm, no marks on the dials |
| C-open-1 | `C-open.txt` | fail | Lines render as raised wire with drop shadows; vignette; the brass layer is nowhere near the borehole |
| C-open-2 | `C-open.v2.txt` | pass (weak) | Flat and centered, borehole into a brass layer; but the sheet is cream and the brass hatch swells past its layer in the last second |
| C-close-1 | `C-close.txt` | fail | The calipers fill the frame; the core is a blur behind them |
| C-close-2 | `C-close.v2.txt` | **pass** | The banded core is the subject, sharp, slow glide, calm end; it reads warmer than the navy/brass palette |
| D-open-1 | `D-open.txt` | pass (weak) | Circuit-like lines converge on a brass center and end still; far more than twelve lines, cream sheet, and it opens mid-drawing |
| D-open-2 | `D-open.v2.txt` | fail | Starts with a frame already drawn, then grows into a dense right-angle maze; the convergence idea is lost |
| D-close-1 | `D-close.txt` | **pass** | Lines into a brass center with points of light along them, lamp and dividers, dusk window, gentle pull-back; calm. Best closer |
| E-open-1 | `E-open.txt` | fail | Brass blobs flood the sheet; ends on a brass field, not a light sheet |
| E-open-2 | `E-open.v2.txt` | fail | Ends still on a light sheet, but the traces mass into a single waveform blob that reads as audio, not layers |
| E-close-1 | `E-close.txt` | fail | The section reads as piano keys, and the camera moves hard right up to the end |
| E-close-2 | `E-close.v2.txt` | fail | Calm, but the "earth block" is a ringed brass dish; nothing reads as layers |
| F-open-1 | `F-open.txt` | fail | Contours drawn as wobbly, doubled strokes; over-dense network |
| F-open-2 | `F-open.v2.txt` | **pass** | Starts blank; contour loops, wells, a network, a brass center; clean single strokes; ends still |
| F-close-1 | `F-close.txt` | fail | The plumb bob rises out of frame instead of settling |
| F-close-2 | `F-close.v2.txt` | fail (soft) | Lands the idea exactly (the tip comes to rest over the brass mark, calm), but the defocused map behind it carries label-like smudges |

The reels use: A = A-open-2 + A-close-2, B = B-open-2 + B-close-1, C = C-open-2 + C-close-2, D = D-open-1 + D-close-1, E = E-open-2 + E-close-2 (both failed, included for completeness), F = F-open-2 + F-close-2.

## Ranking

1. **B · Instrument.** The cleanest drawing in the set, and the rhyme is exact: the drawn theodolite becomes the real one in a dawn field, calm enough for a credit card.
2. **A · Benchmark.** On palette and flat, it echoes the header's benchmark glyph, and the golden-hour disc ends warm and still; the opener's drawing is a little small.
3. **D · Shared sheet.** It has the strongest closer and the clearest "one platform, many arrivals" message, held back by a dense cream-sheet opener that starts mid-drawing.
4. **F · Plumb.** A clean opener and a closer whose settling bob is the most satisfying ending here, but those background smudges need a crop or a soft blur before it can ship.
5. **C · Core.** The real core is handsome, but the opener's cream sheet clashes with the plate, and the closer runs warm against the palette.
6. **E · Seismic.** Neither prompt produced readable layers in two tries; drop it, or rethink it as a still seismic image rather than a generated one.

## Mix and match worth trying

- **B-open-2 + D-close-1**: the cleanest opener into the strongest closer. A surveyor's instrument sets the trial up, and signals arriving at one shared center close it, which is the platform story.
- **F-open-2 + D-close-1**: both are networks meeting a brass center, so this is the tightest visual rhyme in the set: drawn, then lit.
- **A-open-2 + B-close-1**: a survey line and benchmarks, then the instrument at dawn; a field-survey pair without the reprise of the same object.

## Files

- `prompts/*.txt` first-take prompts (F is new), `prompts/*.v2.txt` retake prompts.
- `takes/*.mp4` with `*.prompt.txt` beside each (model, settings, prompt).
- `work/build.py` builds the reels, slates, all-pairings and contact sheet: `python3 work/build.py A=takes/A-open-2.mp4,takes/A-close-2.mp4 …`. Swap takes in the arguments to try a mix.
- `work/gen.sh` sequential generation; `work/qa.sh` and `work/qa-*.png` per-take 3x3 QA strips.

# Pass 2: G · Field survey (B, modified)

The user picked B and asked for a modification: the surveyor's telescope looking at an old-fashioned oil pumpjack, the opener "almost like a cross between opener 1 and opener 2" (read as A × B: B's theodolite and sight line, A's brass benchmarks). Ten generations, 56 s generated. `tools/sora.py` gained `--remix VIDEO_ID` (jobs stay on the service for 24 h) and now writes the job id into each `.prompt.txt`, so a good take can be remixed instead of regenerated.

## Review files (`review/pass2/`)

- `reel-G1.mp4` … `reel-G4.mp4`: opener, plate intro, plate outro, closer, fading to black; 1920x1080, 30 fps.
- `all.mp4`: the four reels, each after a slate. `contact.png`: first, middle and last frames per pairing.
- Takes are pre-cut with `work/cut.py` (trim, optional slowdown, freeze) and built with `work/build2.py`, which takes per-reel `oslow/ohold/cslow/chold`.

## Takes

| Take | Prompt | Verdict | Why |
|---|---|---|---|
| G-open-r1 | `G-open.remix.txt`, remix of B-open-2 | fail | The best-drawn pumpjack (brass, lattice post, horsehead facing the instrument), but the camera pans right to reach it and ends with the theodolite cut in half; mild vignette |
| G-open-1 | `G-open.txt` | fail | The hill came out as layered strata (a nice subsurface nod) with brass benchmark pins, but the pumpjack is small, faces away and sits below the sight line; heavy vignette |
| G-open-r2 | `G-open.remix.v2.txt`, remix of B-open-2 | **pass (frozen)** | Locked camera, no vignette, theodolite and a full brass pumpjack in frame, sight line to the horsehead. Sora then animates the pump and the counterweight melts, so the cut freezes at 2.53 s |
| G-open-2 | `G-open.v2.txt` | fail | The complete A × B idea (strata hill, three benchmark pins, sight line), but drawn tiny in a thin band, heavy vignette, busy navy pumpjack |
| G-open-r3 | `G-open.remix.v3.txt`, remix of G-open-r2 | **pass, best opener** | Theodolite, three brass crosshair benchmarks evenly along the sight line, line ends at the horsehead; holds still from 2.0 s (motion is noise level), no vignette. The pumpjack is drawn large and cropped at the right edge, a detail view of horsehead, beam and lattice post |
| G-close-r1 | `G-close.remix.txt`, remix of B-close-1 | fail | Different instrument, scope aimed left; the pumpjack fades in from the mist at 3 s at the frame edge |
| G-close-1 | `G-close.txt`, 8 s | pass | Golden misty dawn, scope aimed at a nodding pumpjack. The instrument's two spoked circles read like film reels or a cannon as the camera arcs, and the arc drives the scope into the pumpjack after 5.5 s (cut at 5.4 s, slowed 1.25x) |
| G-close-2 | `G-close.v2.txt`, 8 s | pass (weak) | A proper brass transit, pumpjack against the sunrise; the objective lens faces left, away from the pump, and the gap closes late (cut at 4.3 s) |
| G-close-r2 | `G-close.remix.v2.txt`, remix of G-close-2 | pass (weak) | Asked to turn the telescope round; it didn't, but the drift now keeps open sky between instrument and pump to the end. Cleanest sunrise shot, still aimed away |
| G-close-3 | `G-close.v3.txt`, 8 s | **pass, best closer** | From behind the theodolite: the scope points at a nodding pumpjack with the sun behind it; a slow push-in ends with the barrel soft in the foreground and the pump sharp. Settles (motion falls off in the last second). Rose-pink sky, warmer than the palette |

## Ranking

1. **G1 = G-open-r3 + G-close-3.** The drawing's sight line becomes the real view down the telescope; the closest rhyme between plan and field in either pass.
2. **G4 = G-open-r2 (frozen) + G-close-3.** Same closer; the opener shows the whole pumpjack instead of the benchmarks, at the cost of a stylized counterweight.
3. **G2 = G-open-r3 + G-close-r2.** The cleanest sunrise frame, but the telescope looks away from the pump.
4. **G3 = G-open-r3 + G-close-1.** Golden and calm, but the instrument reads as something other than a theodolite.
