# shorts-by-keelson (FIG. 19)

**Concept (what, why, how):** what: the shorts rig itself runs as a Keelson workflow, `cut-a-short` (`.keelson/workflows/cut-a-short.yaml` in this library). Why: the machine steps (voice, boards, compose, QA) are a recipe and should run the same way every time, while whether a cut is good is a judgment a check cannot make. How: `tts.py --changed` voices only lines whose text changed since the last take (`narr/takes.json`), `plate.mjs` and `compose.py` rebuild, `review.py` runs `qa.sh` and writes a review page with the contact sheet, an approval node pauses on it, and `stage` copies the approved cut to `outbox/` for a manual upload.

**Structure:** the lay-the-keel opener with "Figure nineteen. Shorts, by Keelson.", a production-line board, FIG. 16's script edited in the terminal (n3b), the run launched from the CLI, the DAG in the browser, a "what a check can't see" board, the review canvas with the contact sheet and the approval, the staged line in the terminal, a board of all twenty figures, and the closer with SHEET 19 · ACT Coda.

**Capture:** the demo stage (port 7979) with this library registered as project `shorts` through the symlink `/Users/Shared/keelson-demo/shorts`. Two real runs of the same edit: the browser take (`source/rec.mjs`) followed run 062f569a and approved it in the canvas; the terminal take (`source/main.tape`) is run 0f752a75 after resetting n3b, approved by `source/approve.sh`. Both staged FIG. 16. The run header's CWD (the real home path) is masked in the DAG scenes.

**Rig changes this figure needed:** the approval canvas blocks `data:` images and the run-artifact route serves text only, so `review.py` links the sheet from `tools/sheet-server.py`, a loopback server on :7981 that the qa node starts and the stage node stops (it exits on its own after an hour if the gate is rejected).

**Side effect:** FIG. 16 was recut on camera; its n3b line now reads "That answer came from a model running on this laptop."

**Weak:** 131 s. Two pauses of 3.5 to 3.8 s while the canvas scrolls and the DAG composes. The two runs are cut together, not one continuous run.
