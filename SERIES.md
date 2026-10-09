# The Keelson shorts series

The series bible. One numbered sequence of about-60-second shorts that walks the Keelson journey, in viewing order, each mapped to the docs pages it answers for. Read this before planning a figure; read `LEDGER.md` before choosing its shape.

The full proposal (rig, docs embed, hosting, phases) is the artifact at https://claude.ai/artifact/A3EqTwP7pB3wKs9u26tWRp. A copy of that page sits beside this file as `PROPOSAL.html`. This file is the part of it that production reads every day: the map, the mapping to docs, the spoken form, and the status of each figure.

## The shape

Acts follow the product, not the docs sidebar: the plate, then chat and projects, then workflows, then what the harness keeps (memory and usage), then ribs. Chat opens the demos because it is the live half the docs introduce first, and a reader with nothing installed gets a real answer back before a YAML file is mentioned.

Two forms, chosen per beat, not per video. A **plate** beat is motion graphics drawn on the blueprint sheet, for an idea. A **demo** beat is real footage of the product doing real work. A short may be all of one, or mix the two wherever a board explains a concept better than footage can, or footage proves what a board only claims. The form column in the map names the dominant form, not a rule. Every short opens on `assets/bookends/open-lay-the-keel.mp4` and close on `close-raise-the-ribs.mp4`, both carry the `FIG. NN · TITLE` tag; everything else (structure, opener, devices, music) varies per the ledger.

Viewing order is the number. The docs page is in the manifest, never implied by the number, so a tutorial stop can have two shorts and a concept page with no stop can have one.

## The map

| Fig | Title | Form | The money shot | Docs pages | Status |
|---|---|---|---|---|---|
| **Act 0 · the plate** | | | | | |
| 00 | What Keelson is | plate | Eleven boards resolve into the hull | concepts/what-keelson-is, concepts/architecture | cut, 120.7 s, yuv420p; n6 speaks "Co Pilot" so the voice says it right (caption reads Copilot); narration approved by Daniel for now |
| **Act I · chat and projects (the live half)** | | | | | |
| 01 | First run | mixed | Cold open on the real chat answer; boards for the home, doctor's two warnings and their fix, the server, the turn's path; terminal takes for doctor, start, one chat turn | tutorials/first-run, guides/installation, guides/operating-the-server | cut, 101 s, -16.0 LUFS, real fresh v0.124.0 install; with Daniel for review |
| 02 | Chat three ways | mixed | One conversation passes script to browser to terminal and back, all three turns in one row | tutorials/talk-to-the-agent, concepts/chat | cut, 122 s, -16.2 LUFS, real turns on the demo stage; approved by Daniel |
| 03 | A place to work | mixed | A chat bound to a repo reads it, writes the notebook, and the next chat opens already knowing | concepts/projects, concepts/memory-and-state#projects-and-notebooks | cut, 122 s, -15.9 LUFS, real turns on the demo stage's harbor repo; approved by Daniel |
| **Act II · workflows (the deterministic half)** | | | | | |
| 04 | First workflow | mixed | The DAG lights up node by node in the browser | tutorials/run-a-workflow, concepts/workflows | re-cut in the 02/03/05 style, 115 s, -16.1 LUFS, with what/why/how boards; approved by Daniel |
| 05 | Write a workflow | mixed | A broken depends_on is caught by validation, fixed, and runs | tutorials/run-a-workflow, guides/authoring-workflows, reference/workflow-nodes | cut, 122 s, -16.2 LUFS, real run on the harbor repo; approved by Daniel |
| 06 | The approval gate | mixed | A chat shell call asks first; a run pauses on its gate, a human reads the plan, the run resumes | guides/governance, reference/workflow-nodes | cut, 120 s, -16.0 LUFS, real gate and tag on the harbor repo; approved by Daniel |
| 07 | Many models | mixed | One build, each phase on a different model, and a one-line swap | tutorials/frontend-mix, concepts/providers | cut, 124 s, -16.4 LUFS, three-phase harbor workflow standing in for frontend-mix; approved by Daniel |
| 08 | Issue to draft PR | mixed | A starter takes an issue to a draft PR in its own worktree; the working tree never changes | workflows/fix-issue, workflows/index, concepts/projects#worktree-isolation-for-runs | cut, 136 s, -16.1 LUFS, real fix-issue run on the private sandbox repo danielscholl/keelson-demo-harbor (issue #1, draft PR #2); approved by Daniel |
| **Act III · what the harness keeps** | | | | | |
| 09 | Make it remember | mixed | A fresh session recalls a fact only after the memory is approved | tutorials/remember-across-sessions, guides/managing-memory, concepts/memory-and-state | cut, 122 s, -16.0 LUFS, real writeback, review and recall on the harbor project; approved by Daniel |
| 10 | Where the tokens went | mixed | The source-to-model ribbon and the cost view, right after the Act II runs | concepts/usage | cut, 124 s, -16.0 LUFS, the demo stage's own Usage tab after FIG. 02 to 09; approved by Daniel |
| **Act IV · raise the ribs** | | | | | |
| 11 | The rib model | plate | A rib bolts onto the keel and three things appear: tools, a workflow, a surface | concepts/the-rib-model, concepts/snapshots-and-surfaces | cut, 139 s, -16.1 LUFS, all plate (five boards); with Daniel for review |
| 12 | Add a capability | mixed | rib add, restart, a new tab is in the browser | guides/managing-ribs, concepts/snapshots-and-surfaces | cut, 112 s, -16.0 LUFS, real beads rib install on the demo stage; with Daniel for review |
| 13 | Plan the backlog | mixed | Eleven beads with dependencies, the board says what can start now | tutorials/plan-the-backlog | cut, 126 s, -16.0 LUFS, real Cosmos backlog seeded on the demo stage; with Daniel for review |
| 14 | The software factory | mixed | A swarm drains the board in dependency order with a reviewer on every merge | tutorials/run-the-factory | cut, 155 s, -15.7 LUFS, a real Fleet factory on the demo stage (11 of 11 beads, 46 min, $11.72); with Daniel for review |
| 15 | Your agent drives it | mixed | Split screen: Claude Code calls Keelson over MCP, the run appears live | guides/using-mcp | cut, 106 s, -16.0 LUFS, Claude Code over MCP to the demo stage (sequenced, not split screen); with Daniel for review |
| **Codas · standalone, cut whenever the feature is worth showing** | | | | | |
| 16 | No paid keys | mixed | A gateway points at a local model and a chat answers with no sign-in | guides/configuration, concepts/providers | cut, 115 s, -16.0 LUFS, local Ollama phi4 through a gateway on the demo stage; with Daniel for review |
| 17 | Ask for a report | mixed | One chat line, and a designed page opens in the canvas drawer | guides/canvas-artifacts | cut, 110 s, -16.2 LUFS, a real published artifact on the demo stage; with Daniel for review |
| 18 | Did that change help? | mixed | An eval case set grades two versions and the compare verdict says keep | guides/evaluating-workflows, workflows/hillclimb | cut, 125 s, -15.9 LUFS, a real 12-case eval and compare on the demo stage; with Daniel for review |
| 19 | Shorts, by Keelson | mixed | The rig as a workflow pauses at the approval gate with the contact sheet | workflows/index | cut, 131 s, -15.9 LUFS, the real cut-a-short workflow recutting FIG. 16 on the demo stage; with Daniel for review |

Docs paths are relative to `keelson/docs/src/content/docs/docs/`.

## The acts against the docs

Each act covers one cluster of docs pages, so the Watch hub's chapters and the docs sidebar name the same things.

| Act | Figures | Concept pages | Tutorial stops | Guides and catalog |
|---|---|---|---|---|
| 0 · The plate | 00 | what-keelson-is, architecture | | |
| I · Chat and projects | 01 to 03 | chat, projects | 1 first run, 2 talk to the agent | installation, operating the server |
| II · Workflows | 04 to 08 | workflows, providers | 3 run and author, 5 many models | authoring workflows, governance, the starter catalog, workflow-nodes reference |
| III · What the harness keeps | 09 to 10 | memory-and-state, usage | 4 make it remember | managing memory |
| IV · Raise the ribs | 11 to 15 | the-rib-model, snapshots-and-surfaces | 6 plan the backlog, 7 run the factory | managing ribs, using MCP |
| Codas | 16 to 19 | providers | | configuration, canvas artifacts, evaluating workflows, the catalog page |

The one place the series departs from the tutorial rail is memory: the rail teaches it at stop 4, the series holds it until Act III so it sits beside usage. The rail is not reordered to match.

## The spoken form

Every figure reads as one voice:

- Over the opener: "Figure N. Title." then the builder's problem in one sentence.
- Over the closer: the one-sentence answer, then the sign-off, exactly "Keelson. Lay the keel, raise the ribs."
- A sheet card, "SHEET 04 · ACT II", is rendered per short like the fig tag and overlaid on the closer. It names the sheet and the act, never a count, so a coda can be added without touching any other short. The shared closer clip and its close card (brand, "Raise the ribs.", the install line, the docs URL) stay untouched; the install line and URL are on screen only, never spoken.

Voice is Harper (`en-US-Harper:MAI-Voice-2.1`) unless the ledger says a figure should differ. Per-line SSML or spelling overrides stay available; the pronunciation table is in the demo-shorts skill, `references/azure-media.md` (YAML as "yammel", Copilot as "Co Pilot").

## Phases

| Phase | Delivers | Done when |
|---|---|---|
| 1 · The rig | This file; the `short.yaml` manifest and shared compose; the one card renderer (fig tag, sheet card, callouts, captions); word-level timing (Harper emits no word-boundary events, so `tts.py` aligns Azure fast transcription back to the known text, which works for any voice); the legibility rig; the publish step; this library under git. The shared tools live in `tools/` here (tts, compose, cards, qa); the skill keeps only the method. FIG. 00 and FIG. 04 re-cut through it. In the docs: `shorts.json`, the `<Short>` component, the Watch hub, nav entries, a Video section in STYLE.md. A YouTube channel with the two uploads. | Both existing shorts play on their docs pages from the rig's output, and a new short needs only a capture and a manifest. |
| 2 · Acts I to III | FIG. 01 to FIG. 10 less the re-cut FIG. 04, nine shorts, one per sitting, in viewing order so the hub fills from the top, each stopping for review before the next. Music beds chosen at FIG. 01. | Tutorial stops 1 to 5 each carry a short, the chat, projects, workflows, memory, and usage concept pages each carry one, and the first three acts are public playlists. |
| 3 · Act IV and codas | FIG. 11 to FIG. 19. The rig wrapped as a Keelson workflow with an approval gate before publish; FIG. 19 films that workflow cutting a short. 9:16 cuts of the three strongest figures. | The series is public end to end and a short can be cut by running a workflow and approving the result. |

## Standing rules

- Every short makes clear what the concept is, why it exists, and how it works. It is not a recipe: a viewer should leave understanding the thing, not holding a list of steps.
- Production stops after every video for Daniel's review. The next figure does not start until he has replied on the last one.
- Nothing posts anywhere without Daniel's review. Uploads stay unlisted until an act ships.
- Capture only on the isolated instance (`KEELSON_HOME=~/keelson-demo/.keelson`, port 7979), never the real one.
- The ledger's anti-sameness rule holds: each new short differs from the last few on at least three columns. The manifest fixes plumbing, never shape.
- The mp4 never enters the keelson repo; the docs hold a poster, a transcript, and an id.
