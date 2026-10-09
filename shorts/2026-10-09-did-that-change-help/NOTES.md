# did-that-change-help (FIG. 18)

**Concept (what, why, how):** what: `keelson eval` runs a workflow against a YAML case set (real inputs, a grader per case, a train and test split) and `keelson eval compare` decides between two runs. Why: a workflow that runs is not a workflow that works, and a prompt or model change needs an honest before and after. How: per-case paired differences, a sign-flip permutation test, at least six moved cases before anything leaves noise, and keep only when train and test both move up (train alone reads as overfitting and reverts).

**Structure:** the lay-the-keel opener with "Figure eighteen. Did that change help?", a case-set board, the eval on the v1 triage prompt (0/12), the prompt diff, the eval on v2 (12/12), a verdict board, `eval compare` saying keep, a why board, and the closer with SHEET 18 · ACT Coda.

**Capture:** the isolated stage (port 7979), harbor project. Workflow `.keelson/workflows/triage-issue.yaml`, case set `.keelson/evals/triage-issue.eval.yaml` (t1–t6 train, t7–t12 test, exact grader). Three vhs tapes: before, fix, after. Results `before.json`/`after.json` are git-excluded in harbor.

**Weak:** 125 s. The v1 failure is stark (every answer explores the repo), so the compare is lopsided rather than a close call. The table rows wrap at 1080p.
