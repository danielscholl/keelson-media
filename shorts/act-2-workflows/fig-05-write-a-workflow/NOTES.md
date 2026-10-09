# write-a-workflow (FIG. 05)

**Concept (what, why, how):** what: a workflow is a YAML file of nodes whose `depends_on` lines are the edges of a graph. Why: work that has to run the same way every time should be written down instead of improvised, and a graph can be checked before anything runs, so a broken edge never stops a run halfway after earlier steps did their work. How: `keelson workflow validate` runs the same loader the server uses (every edge lands on a real node, every `$id.output` has a source, no cycles, unknown fields only warn); the executor then starts nodes with no dependencies together and hands their output to the nodes that wait on them.

**Structure:** a mistake first. The lay-the-keel opener with "Figure five. Write a workflow.", a board where chat's improvisation gives way to a file that draws itself into a graph, the real file in the harbor repo with a typo in `depends_on`, validate naming the bad edge, a board of what validation checks with the ghost node and what a run-time failure would cost, the one-letter fix in vim, validate clean, the run streaming in dependency order, the same run as a graph in the browser with the report's output, then a why board and recap. Closer with SHEET 05 · ACT II.

**Capture:** the isolated stage `/Users/Shared/keelson-demo` (port 7979), v0.124.0, in the `harbor` repo from FIG. 03 with a project-scoped workflow at `harbor/.keelson/workflows/tide-check.yaml` (untracked in that repo). Terminal takes with vhs (`source/broken.tape`, `source/fixed.tape`, vim run with `-u NONE` so no personal vimrc shows), the run view with `source/rec-web.mjs`. Earlier runs were bulk-deleted so the Runs list holds only this one. The report prompt asks for the time "exactly as printed" because an earlier dry run converted it to the machine's local zone.

Staging: the run header and the report trace row print the resolved Copilot model id; masks cover it.

**Weak:** 122 s. vim's status line shows a stray `^[` after Escape. The mask in the browser leaves a visible dark chip. The fix is shown as a vim edit, which is a keystroke beat rather than a concept beat, so it is kept short.
