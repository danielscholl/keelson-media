# a-place-to-work (FIG. 03)

**Concept (what, why, how):** what: a project is a name and a root path that chats, workflow runs, and a notebook attach to. Why: you bind work to a folder once, the agent works in place on the real checkout, and the context you build up belongs to the project rather than to one conversation. How: a chat started inside the repo binds to its project, runs with the project root as its working directory, and gets the project notebook (one markdown document, appended by the `note_project` tool or edited by hand) placed in front of every turn.

**Structure:** proof by a second chat. The lay-the-keel opener with "Figure three. A place to work.", a board for what a project is, `keelson project add`, a terminal chat started in the repo that reads the real files and writes the test command and a stated decision (UTC) to the notebook, a board for how the notebook rides every turn, the notebook in the browser under Memory, a brand new chat that answers both without reading a file, then a board for why (in-place edits, worktrees for runs later, context owned by the project) and the recap. Closer with SHEET 03 · ACT I.

**Capture:** the isolated stage `/Users/Shared/keelson-demo` (port 7979), v0.124.0, with a small sample repo `harbor/` (tide tables, `bun test`) created there and committed. Conversations were cleared and the project re-registered on camera, so the notebook starts empty. Terminal takes with vhs (`source/add.tape`, `first.tape`, `second.tape`), the Memory view with `source/rec-web.mjs` (sets the active project through localStorage so the project picker, which lists the default project's root path, never opens). Boards are `source/plate.html`.

Staging: the TUI status strip prints the resolved Copilot model id once a turn runs and moves as output grows, so the first chat carries time-windowed masks; the second chat's strip still reads `auto`.

**Weak:** 122 s. Terminal text in the two chats is small at phone size (font 24 so the whole exchange fits). The second chat's strip still says "working" while the reply's usage settles. The cut from the first message to the agent's tool calls skips about three seconds of thinking.
