# first-workflow, re-cut (FIG. 04)

Replaces `shorts/2026-10-08-first-workflow/` as the FIG. 04 candidate; that earlier 53 s walkthrough stays in place, untouched.

**Concept (what, why, how):** what: a workflow hands the control flow from the agent to a file, and the agent still works inside it on a declared leash. Why: chat decides what happens every turn, which is wrong for work you want done the same way every time; and the run that follows is a durable record you can read and resume. How: the executor starts every node whose dependencies are met and starts the rest the moment theirs settle; nodes come in three families (agent, deterministic, control) whose mix sets how much is judgment and how much is fact; every run and node is a row with output, timing, the model it ran on, and a definition hash, and a failed run resumes from the first unfinished node.

**Structure:** the lay-the-keel opener with "Figure four. First workflow.", a board splitting chat (decided every turn) from a workflow (decided once, in the file), smoke-test from the terminal, a board of the three node families with the determinism dial, the same workflow run live in the browser with the DAG lighting up, the Runs list showing both runs, then a board of what a run records and how resume works, and the recap "The file decides. The run remembers." Closer with SHEET 04 · ACT II.

**Capture:** the isolated stage `/Users/Shared/keelson-demo` (port 7979), v0.124.0. Earlier runs were bulk-deleted first. The terminal run with vhs (`source/cli.tape`, font 21 so the whole watch stream fits), the browser run with `source/rec-web.mjs`, which sets the active project to `harbor` through localStorage so the run's CWD is the demo repo, not the default project's real home path.

**Weak:** 115 s. The terminal watch stream is small at phone size. During the live run, the caption covers the bottom node of the DAG (assert). The smoke test is an engine check rather than real work, chosen because the tutorial runs it first and it shows every node family.
