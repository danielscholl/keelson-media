# first-run (FIG. 01)

**Concept (what, why, how):** what Keelson puts on your machine (one folder, one local server on one port), why you can trust it (local only, no Keelson account, and a doctor whose every warning names the next move), and how a turn works (command line to server to the agent and back, saved in the store, visible in the browser).

**Structure:** the lay-the-keel opener with "Figure one. First run.", then plate boards and real terminal takes interleaved: the home (board), doctor on a fresh install (terminal), the two warnings and their shared fix (board), the server and what it owns (board), start then doctor all clean (terminal), one chat turn (terminal), the path that turn took plus the recap (board), closer with SHEET 01 · ACT I.

**Capture:** a real fresh install of v0.124.0 into the neutral stage `/Users/Shared/keelson-demo` (`KEELSON_HOME`, `KEELSON_BIN_DIR`, port 7979), recorded with vhs (`source/*.tape`). Boards are `source/plate.html`, rendered by `tools/plate.mjs` with beats on real word times. Cut by `tools/compose.py` from `short.yaml`.

Staging, so the footage shows what a typical first run shows:
- The installer ran against Daniel's npm feed (the public registry is unreachable here). Afterwards the stage home got a `.npmrc` pointing at the public registry, so doctor's registry check does not print the corporate feed.
- v0.124.0's published CLI depends on `@github/copilot-sdk` only, so a fresh install has no `@github/copilot` and doctor warns `copilot CLI unresolved` even after start. `@github/copilot@1.0.88` (the version `packages/providers` pins) was added to the stage home by hand. This looks like a release bug worth fixing before this short ships.
- Every Copilot model load prints `[copilot] dropping unknown reasoning effort(s) from model …: max` to stderr (an unconditional console.warn), which lists model ids. The tapes filter only those lines in a hidden shell function.

**Weak:** the chat wait (about 10s) is cut with a dissolve; the doctor YAML is only legible where it is zoomed (the board carries the categories); the terminal wraps "sessions" mid-word in the answer; no music bed.

**Review 1:** the cold open (2.5s of the chat answer before the opener) read as a stray screenshot; removed. Now 99.3s, -16.1 LUFS.
