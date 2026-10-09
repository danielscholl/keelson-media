# chat-three-ways (FIG. 02)

**Concept (what, why, how):** what: the browser, the interactive terminal, and a scriptable one-shot are three ways into one conversation, not three apps. Why: each surface is good at something different (reading, staying in the shell, composing into scripts), and switching surface should never mean starting over. How: every surface is a client of the one local server, which runs the turn and writes the conversation, its messages, and the agent's session to SQLite, so the next turn continues the thread whichever way it arrives.

**Structure:** a relay. The lay-the-keel opener with "Figure two. Chat three ways.", a board for the three ways in, then one real conversation passed hand to hand: the script picks a codename (`--json`, `mode` and `conversationId` shown), a board for where it lives (clients, server, Copilot, the SQLite row with that id), the browser opens the scripted turn and asks "Why that name?", the terminal resumes with `keelson chat --conversation $(jq -r .data.conversationId turn.json)` and asks for a tagline, the browser shows all three turns, then a board for why three with the recap. Closer with SHEET 02 · ACT I.

**Capture:** the isolated stage `/Users/Shared/keelson-demo` (`KEELSON_HOME`, port 7979), v0.124.0. Conversations from FIG. 01 were deleted through the API first, so lists show only this conversation. Terminal takes with vhs (`source/script.tape`, `source/tui.tape`), browser takes with `source/rec-web.mjs` (CDP screencast, injected cursor; run it with `tools/node_modules` linked as `source/node_modules`). Boards are `source/plate.html`, rendered by `tools/plate.mjs`, scaled to sit above the caption band.

Staging: the same `dropping unknown reasoning` stderr filter as FIG. 01. The TUI status strip prints the resolved Copilot model id; a mask covers it.

**Weak:** 122 s, slightly past the two-minute ceiling; the store board carries a 19 s line. Browser text is small at phone size even zoomed. The terminal mask leaves a visible gap in the status strip. The scripted turn's wait and the browser's thinking wait are cut with short dissolves. No music bed.
