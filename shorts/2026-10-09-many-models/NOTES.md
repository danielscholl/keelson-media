# many-models (FIG. 07)

**Concept (what, why, how):** what: each workflow node pins its own model, by class (fast, balanced, deep) or by id, so one run uses several models. Why: strong models are wasted on grind work and fast models are careless on judgment, so instead of arguing, route each phase to the model that suits it and run the experiment. How: a class resolves through the provider's catalog to a real model; nodes hand off through markdown files in the run's artifact folder rather than shared chat history, so any phase can change models without the others noticing; the run records which model really answered each node.

**Structure:** experiment and rerun. The lay-the-keel opener with "Figure seven. Many models.", a board of the fast-to-deep scale with three pinned nodes resolving to real models, the pins and a run in the terminal, the run's trace in the browser (Haiku explored, Opus planned, Sonnet reviewed and called the plan sound), a board of the file handoff, a one-line `sed` swapping the reviewer to `gpt-6-luna`, the rerun, its trace (this reviewer called the plan unsound and named the step), then a why board and "Right model, right phase." Closer with SHEET 07 · ACT II.

**Capture:** the isolated stage `/Users/Shared/keelson-demo` (port 7979), v0.124.0, with a three-node workflow at `harbor/.keelson/workflows/tide-feature.yaml` (explore fast, plan deep, review balanced, then `gpt-6-luna`). Classes resolved to claude-haiku-4.5, claude-opus-5 and claude-sonnet-5 on the Copilot catalog. Terminal takes `source/run1.tape` and `source/swap.tape`; traces with `source/rec-web.mjs`. Earlier runs were bulk-deleted first.

This uses a small three-phase workflow on the harbor repo instead of the tutorial's ten-node frontend-mix build, which takes tens of minutes and real spend per run; the concept (per-node pins, artifact handoff, one-line swap) is the same.

Model ids are shown, not masked: they are the subject, and the docs publish the same Copilot catalog ids.

**Weak:** 124 s. The two runs differ in more than the reviewer (the plan is regenerated each run), so the different verdict is honestly "a different read", not a controlled comparison. The terminal watch waits are cut.
