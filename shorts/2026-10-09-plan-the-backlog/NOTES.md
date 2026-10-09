# plan-the-backlog (FIG. 13)

**Concept (what, why, how):** what: the Cosmos build seeded as eleven beads with acceptance criteria and dependencies, shown on the beads rib's board. Why: a team works a backlog, not a single ordered plan; once the work is a dependency graph, only ready units start and independent ones can run side by side, which is what agents need to work it like a team. How: the sample repo carries the plan as data (`factory/backlog.json`); `bd create --graph` files it in one transaction; ready means every bead it waits on is closed; the Beads tab ranks the next bead by what it unlocks; chat answers from `beads_ready` and `beads_blocked`.

**Structure:** the lay-the-keel opener with "Figure thirteen. Plan the backlog.", a board contrasting one plan and one order with a team's backlog, cloning `keelson-sample` into `cosmos-factory` and `bd init`, `bd create --graph` (11 issues), `bd ready` (one) and `keelson project add`, a board animating the dependency graph level by level, the Beads tab on the new tracker (next up: scaffold, unlocks 3 now and 7 more), a chat that asks what can start and gets the chain, then a why board and "Plan the graph. Let the graph say what's next." Closer with SHEET 13 · ACT IV.

**Capture:** the isolated stage `/Users/Shared/keelson-demo` (port 7979), with `cosmos-factory` cloned from the public sample and its origin removed (as the tutorial does, so FIG. 14's swarm merges locally). `bd init` prints a long list of migrations; the cut moves past it. Terminal `source/seed.tape`; browser `source/rec.mjs` (modes tab and chat), run after one off-camera board refresh so the board is measured.

**Weak:** 126 s. A "select-project" toast shows in the Beads tab. Bead rows show the git author name.
