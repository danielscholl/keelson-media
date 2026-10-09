# Motion graphics explainers

Used for FIG. 00 (`videos/shorts/2026-10-08-what-keelson-is/source/`, one continuous plate) and FIG. 01 (boards interleaved with terminal footage). `videos/tools/plate.mjs` is the shared renderer: boards declared in `short.yaml`, timed by narration, with `W(lineId, phrase)` giving real spoken times from `narr/words.json`. Read FIG. 01's `source/plate.html` for a working board page, then build a different shape.

## How it works

- One HTML page at 1920x1080: SVG stage plus HTML header and captions. Palette, type, and grid come from `keelson/docs/STYLE.md` and `docs/public/assets/keelson.css`.
- One paused GSAP timeline (`gsap@3.13.0`, `gsap.min.js` copied next to the page). Board start times come from the narration durations; beats inside a board are keyed to word positions with a helper `W(lineId, "word")` that maps character position to time.
- `render.mjs` computes the timing, calls `window.setup(T)`, then for each frame `seek(t)` and screenshots (JPEG 95). About 2,600 frames render in roughly three minutes. Encode the frames at 30 fps, then compose with narration like any other scene.
- Render stills first (`--only t1,t2,...`) and look at them before a full render.

## Gotchas

- `page.evaluate` returns whatever the function returns. `tl.seek()` returns the timeline, and serializing it hangs Playwright. Wrap it so it returns nothing.
- Use `.to` tweens and set initial state with `gsap.set` or CSS. A later `fromTo` renders its start values at build time unless `immediateRender: false`.
- Stroke drawing: `pathLength="1"`, `stroke-dasharray:1`, tween `strokeDashoffset` 1 to 0. A `marker-end` arrowhead shows even when the stroke isn't drawn yet, so hide the path until it draws.
- SVG text collapses spaces; use `style="white-space:pre"` for code. `xml:space` set through setAttribute does nothing.
- A repeating tween (a blinking caret) can outlive a later hide and turn the element back on. End repeats before hiding.
- Size for phones: captions about 40px, labels that matter 18px or more, decorative labels can be small.
- JPEG frames encode as full-range `yuvj420p`, which some players (QuickTime, social uploads) refuse or mishandle. End the compose chain with `scale=in_range=pc:out_range=tv,format=yuv420p` and check the result with ffprobe.
