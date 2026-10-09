# ask-for-a-report (FIG. 17)

**Concept (what, why, how):** what: a canvas artifact is a designed, self-contained HTML page an agent publishes to the browser's canvas drawer with `canvas_publish`. Why: chat answers scroll away; a report, briefing or chart is something to read, keep and share. How: the chat prompt carries the authoring contract and `canvas_design_guide` serves the kit; publishing validates chart palettes by computation (contrast, color-vision separation) and rejects failures so the agent retries in the same turn; pages render in an opaque-origin sandboxed frame with `connect-src 'none'`; artifacts persist as `.html` under the home's `artifacts/` and republishing the same name updates in place.

**Structure:** the lay-the-keel opener with "Figure seventeen. Ask for a report.", a board from scrolling chat text to a page in the drawer, one chat line in the harbor project, the agent's beads tool calls, its design-guide calls, the drawer opening on the published "harbor backlog" page and a scroll through it, a "what keeps it honest" board, a why board and "Ask once. Keep the page." Closer with SHEET 17 · ACT Coda.

**Capture:** the isolated stage (port 7979), harbor project, Copilot. One browser take with `source/rec.mjs` (mode chat); the injected cursor is limited to the top frame so the sandboxed artifact frame does not get a second cursor. The published file is `artifacts/harbor-backlog.html` on the demo home.

**Weak:** 110 s. The agent's reasoning text shows expanded during the wait. The `canvas_publish` call itself is not on screen; the drawer opening is the evidence.
