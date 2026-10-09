# what-keelson-is (FIG. 00)

**Concept:** the foundation figure for the series. No screen share: a motion-graphics explainer on the blueprint sheet that says what Keelson is before any demo shows it working. Grounded in `docs/concepts/what-keelson-is.mdx`.

**Structure:** the lay-the-keel opener with a `FIG. 00` tag and the line "Figure zero. What Keelson is.", then one growing drawing. The keel is laid once and stays as the floor of every board; each idea bolts onto it in eleven boards (hook, keel, chat, state, workflows, providers, three ways in, MCP access, useful on its own, ribs, reveal), then everything resolves into the hull and dissolves into the shipyard closer.

**Choices:** series opener and closer from `assets/bookends`, the problem (a chat that vanishes when the session ends) as the first board, Harper narration, captions drawn in-page. 120.6s, 16:9.

**Revisions after review:** the first cut skipped the opener (Daniel wanted it back) and went straight from state to workflows; chat now comes first, and a three-ways-in board (browser, CLI, MCP) plus an MCP access board (read only, full control by default, optional bearer token, per `docs/guides/using-mcp.mdx`) were added.

**Build:** `source/scene.html` (SVG + GSAP 3.13 timeline, every beat keyed to word positions in the narration), `source/render.mjs` (seeks the timeline per frame and screenshots, writes `source/timing.json`), `source/compose.py` (graphics + closer + narration). Re-render: copy render.mjs next to a playwright install, `node render.mjs <this dir>`, encode `raw/frames` to `raw/graphics.mp4`, then `python3 source/compose.py`.

**What to improve next time:**
- No music; the 2s pauses between lines rely on the animation to carry them. A quiet bed would help.
- The upper third of most boards is empty; the composition sits low on the keel.
- Small labels (node kinds, rib callouts, browser tabs) are decorative at phone size.
- Word timings are estimated from character position in each line, so some highlights land a beat early or late.
