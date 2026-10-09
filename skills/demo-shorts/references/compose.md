# Composing

## Tools available

Homebrew ffmpeg here has no `drawtext` or `subtitles` filter (no freetype or libass). Render every piece of text (captions, titles, cards, callouts) as a PNG from HTML with Playwright (`omitBackground: true` for transparency) and `overlay` it. That also gives full CSS typography.

## Timeline math

- Normalize every scene first: `fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p`.
- With crossfades of length X, scene k starts at `start[k] = start[k-1] + dur[k-1] - X`; total is `start[last] + dur[last]`. Pass those as `xfade` offsets.
- Extend a scene by holding its last frame: `tpad=stop_mode=clone:stop_duration=N`. Slow a clip with `setpts=1.25*PTS` (and `atempo=0.8` for its audio).
- Narration global time = scene start + an offset relative to a logged action mark (for example, a click minus 0.3s). Assert that each line ends before the next begins, and fix the pacing rather than letting lines overlap.
- Place clips with `adelay=<ms>|<ms>`, mix with `amix=normalize=0`, then `loudnorm=I=-16:TP=-1.5:LRA=11`.
- Captions: one PNG per line, `overlay=enable='between(t,a,b)'`, with a short alpha fade (`fade=in:...:alpha=1`) on a looped image input.
- Fade in from black at the start and out at the end. Output `libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart`.

`videos/tools/compose.py` implements all of the above from `short.yaml`; FIG. 04 (`videos/shorts/2026-10-08-first-workflow/short.yaml`) is a worked manifest. The manifest fixes plumbing, never shape: borrow its fields, not its four-scene layout.

Gotchas the composer already handles, worth knowing when extending it:
- ffmpeg 9 dropped `-filter_complex_script`; pass a filter file with `-/filter_complex <file>`.
- `xfade` needs identical timebases on both inputs; end every segment chain with `settb=AVTB`.
- Source colour ranges differ (Playwright JPEG frames are full range, x264 masters are limited); scale every segment with `in_range=auto:out_range=tv` or a plate turns grey on some players.
- Private text in footage (home paths) is covered with `drawbox ... t=fill` in the footage's own background colour, windowed to the seconds it is on screen; re-capturing from a neutral path is better when there is time.

## Zoom and crop

For phone legibility, crop into the region that matters: `crop=w:h:x:y,scale=1920:1080` for a static punch-in, or a push with `zoompan`. The composer's zoom runs `zoompan` with `d=1` on a 2x upscale (less jitter), smoothstep ramps on `it`, and blends between boxes, so a zoom whose `until` equals the next zoom's `at` becomes a pan. Plan zoom targets during capture by logging the element's bounding box alongside its mark.

## Vertical

9:16 is its own layout: a 1080x1920 canvas with stacked crops (terminal on top, browser region below), or a browser recorded at a narrow viewport. Letterboxing 16:9 into 9:16 wastes most of the screen.

## QA

`[PHONE=<t>] videos/tools/qa.sh <video> <t1> <t2> ...` writes a contact sheet at the given times and prints silence gaps and integrated loudness. Look at the sheet. Gaps over about 3 seconds and anything private on screen are the usual problems.
