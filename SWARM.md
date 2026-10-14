# Swarm, in detail

The bible for the swarm series: ten detail sheets that go deeper than FIG. 14, one part of the swarm rib per film. In a drawing set a detail is an enlarged callout of one part of the main sheet, and that is what this series is to FIG. 14. Read this before planning a film; read `LEDGER.md` before choosing its shape (one ledger for both series, so the variety rule spans them).

The storyboard (approved 2026-10-13) is the artifact at https://claude.ai/artifact/GHGYpMtUnoXXS8TBShtLRo. This file is the part production reads every day.

## Conventions

Everything in `SERIES.md` holds (standing rules, demo stage only, review after every film, what/why/how), with these differences:

- Tag `DET. NN · TITLE` over the opener; closer card `DETAIL NN · SWARM · ACT N`. Both are `cards` overrides in `short.yaml` (`figtag`, `sheet`), with `viewport_header` naming the series.
- Spoken over the opener: "Swarm detail N. Title." then the problem in one sentence. No cold open. Over the closer: "Keelson. Lay the keel, raise the ribs."
- Same bookend clips (lay-the-keel, raise-the-ribs), voice Harper, narration says "Co Pilot", 16:9 1080p, -16 LUFS, burned-in captions, 100 to 130 s.
- Folders: `shorts/swarm/det-NN-<slug>/`. The manifest carries `series: swarm` and `prefix: det` (and `thumb: <s>` to choose the thumbnail frame), so `tools/publish.sh` writes `media/swarm/det-NN/` (det-NN.mp4, poster.jpg, thumb.jpg, captions.vtt), which the swarm docs (keelson-rib-swarm) read at `https://danielscholl.github.io/keelson-media/swarm/det-NN/`.
- The demo stage needs rib-swarm 0.29 or later and its managed ClickClack. Browser tools can't type into Keelson's task box; a Playwright capture can (`det-01/source/rec-run.mjs`), or start over Keelson MCP.
- Tool names on screen still read `chat_*`; narration says "the swarm tools". Model names are read off the launcher on the day. Dollars are list price.

## The map

| Det | Title | Form | The money shot | Docs pages | Status |
|---|---|---|---|---|---|
| **Act I · the crew** | | | | | |
| 01 | What a swarm is | mostly boards | Two advocate faces appear on the card while the channel fills | concepts/agents-and-swarms, concepts/index, tutorials/your-first-swarm | cut, 121 s, -16.0 LUFS, a real Scout swarm s9s2p on the demo stage (44 s, 12 turns, $0.10); approved by Daniel |
| 02 | Read the cockpit | mostly demo | A face goes from pulsing to an amber dot as a peer addresses it, while the Map draws the edge | guides/swarms-tab | cut, 128 s, -16.1 LUFS, a real Crew swarm stsog on the demo stage (99 s, 22 turns, $0.64); approved by Daniel |
| 03 | Scout, Crew, Fleet | mixed | Two Done rows side by side: the same question, two crew sizes, two bills | guides/run-a-swarm, concepts/agents-and-swarms#which-model-runs-each-agent, reference/limits-and-statuses | cut, 124 s, -16.2 LUFS, real Scout smyqw ($0.09) and Crew s16dk ($0.27) on the same question; approved by Daniel |
| **Act II · the channel** | | | | | |
| 04 | Who wakes | mixed | Three messages in one channel light three different sets of faces | concepts/routing, design/guardrails#the-routing-table-is-a-guardrail | planned |
| 05 | Steer it, stop it | mostly demo | Your line lands in the channel and the lead's next message changes the plan | guides/steer-and-stop, tutorials/your-first-swarm#3-steer-it-once, concepts/budgets-and-stopping#a-stop-can-beat-a-conclusion | planned |
| 06 | Evidence, not guesses | mixed | An agent writes "not in the supplied context" where it could have guessed | concepts/task-context, guides/supply-task-context, tutorials/investigate-an-issue | planned |
| **Act III · the limits** | | | | | |
| 07 | Where a swarm stops | mixed | The cost meter crosses the 80% tick, the Needs-you card lands, the lead starts wrapping up | concepts/budgets-and-stopping, reference/limits-and-statuses, guides/swarms-tab#when-a-swarm-needs-you | planned; settle the post-80% conclusion call before capture |
| **Act IV · swarms that change code** | | | | | |
| 08 | Writers get worktrees | mixed | One worktree per writer, listed next to a main checkout that never changed | guides/let-agents-write, concepts/agents-and-swarms#what-an-agent-can-touch, design/guardrails | planned |
| 09 | The lead runs workflows | mixed | "Approval needed" lands in the channel while the run's graph lights beside it | guides/dispatch-workflows, reference/workflows | planned; close swarm-pilot PR 14 unmerged first |
| — | FIG. 14 · The software factory | capstone | reused from the Keelson series, not re-cut | tutorials/run-the-factory | cut |
| **Coda** | | | | | |
| 10 | A bus, not a room | all boards | One growing drawing ending on what is deferred | design/decisions, reference/durability, design/deferred | planned |

Docs paths are relative to the swarm docs' content root (keelson-rib-swarm `src/content/docs/`).

## Order and spend

| Batch | Films | Swarm runs | Ceiling spend |
|---|---|---|---|
| 1 | DET. 01 with the docs plumbing | Scout ×1 | ≤ $1 (spent $0.10) |
| 2 | DET. 02, 03 | Crew ×2, Scout ×1 | ≤ $21 |
| 3 | DET. 04, 05, 06 | Crew ×3 or 4 | ≤ $40 |
| 4 | DET. 07, 08, 09 | Scout ×1, Crew ×2 | ≤ $21 |
| 5 | DET. 10 | none | $0 |
