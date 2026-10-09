# first-workflow

**Concept:** the first five minutes with Keelson, compressed. Start the server, run the smoke-test workflow in the terminal, then run it again from the browser and watch the DAG fill in live.

**Choices:** linear CLI-then-web walkthrough, Sora dry-dock opener with title overlay, Harper (MAI-Voice-2.1) narration, captions on every line except title and outro, closing card with the real install one-liner.

**Capture:** isolated Keelson instance (`KEELSON_HOME=~/keelson-demo/.keelson`, `PORT=7979`) so no personal history shows. Terminal via vhs (`source/term.tape`). Browser via CDP screencast with an injected cursor (`source/rec-web.mjs`), action timestamps in `source/web-meta.json`. Compose in `source/compose.py`. Scripts reference the scratch layout they ran in (`../pilot`, `../rec`), so adjust paths before re-running.

**What to improve next time:**
- Browser UI text is small on a phone. Zoom into the DAG while it fills.
- Two quiet gaps (about 3s around the Start click, 5s before the last line). Tighten pacing or add a low music bed.
- Home paths are visible in small type (`CWD /Users/danielscholl/...`). Run from a neutral path if that matters.
- No vertical (9:16) cut yet.

## v2 (blueprint bookends)

`v2/final.mp4` (56.8s): same body, re-cut with `assets/bookends`, a `FIG. 01 · FIRST WORKFLOW` tag, captions restyled to the docs palette (navy panel, brass rule), and a new closing line ("Keelson. Lay the keel, raise the ribs.", spoken once the end card is up; the install line is on screen only). Built by `source/compose-v2.py`. The two quiet gaps in the body are unchanged. `final.mp4` is still v1.

## FIG. 04 (rig cut, 2026-10-08)

`final.mp4` (53.0s) is now cut by `tools/compose.py` from `short.yaml`; v1 moved to `v1/`, v2 stays in `v2/`. Same footage and takes; nothing re-voiced (the narration never speaks the figure number).

- Re-tagged `FIG. 04 · FIRST WORKFLOW`; the closer carries the `SHEET 04 · ACT II` title block.
- Footage sits inside the blueprint viewport (sheet, header, TERMINAL / BROWSER label) with the plate's light caption panel.
- Gaps closed by trimming the browser capture into three takes (find, run, after) joined by 0.3s dissolves: the instructions dialog before Start and the idle seconds before the node expand are gone. Longest silence in the body is now 2.3s (was 3.4s and 5.5s).
- Terminal pushes in 1.6x on the prompt, then follows the output down to `succeeded`. The browser zooms 2x into the DAG as it starts filling, pans to the trace on "You can see which model answered", and pulls back out as the run completes.
- Home paths covered with `drawbox` in the footage's own background colour: the server log path and `target: cwd=` in the terminal, `CWD` in the run header.

Weak: the DAG is mostly still queued while zoomed in (the prompt nodes take about 4s, and the narration moves to the trace before they finish), so the "lights up node by node" moment is clearest only in the pull-back. A re-capture from a neutral stage path, with the run started a beat earlier against the narration, would fix both that and the masks.
