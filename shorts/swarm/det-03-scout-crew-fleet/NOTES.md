# scout-crew-fleet (DET. 03)

**Concept (what, why, how):** what: three plans set a swarm's seats, token and dollar ceilings, and its lead and worker models (Scout 3 / 150k / $1, Crew 5 / 1M / $10, Fleet 8 / 3M / $60, from the rib's `types.ts` and the launcher). Why: the lead plans and judges while the workers carry the volume, so the lead gets the stronger model, and the crew size should fit the question. How: the same question run on Scout and on Crew, then compared.

**Structure:** the opener with "Swarm detail three. Scout, Crew, Fleet." and the problem; a three-plans board; the launcher (separate Lead and Workers pickers, Scout started, the same task retyped on Crew); the Scout card full at three of three seats with only two reviewers; the Crew card with a reviewer per option and a seat still open; the two ended rows side by side with callouts naming the plan; each Done view (Scout's lead saying the third reviewer didn't fit; Crew's three reviewers converging); a pick-by-the-question board with a DET. 04 banner; the closer with DETAIL 03 · SWARM · ACT I.

**Capture:** the demo stage (`~/keelson-demo/.keelson`, port 7979), no project, both started from the launcher on camera by `source/rec-two.mjs`. Take 2 is the cut: Scout smyqw (10 turns, 34 s, 37k tokens, $0.0867) and Crew s16dk (10 turns, 46 s, 69k tokens, $0.2653), both on the Postgres-at-80%-CPU question. Take 1 (`raw/take1-lead-alone`, not used) asked the leads to bring in "whatever reviewers the question needs"; both leads answered alone in one turn (Scout stmu2, Crew sd5ka), so the prompt was changed to ask for one reviewer per option. Total spend across both takes about $0.40 list price.

**Weak:**
- 124 s, over the storyboard's ~115 s.
- The two answers are nearly the same, so the film's point is cost and seats, not a better answer from a bigger crew. The narration says so ("a voice, not a new answer"); a question where breadth changes the answer would make a stronger case for Crew.
- The prompt names the reviewers ("one reviewer per option"), so the leads did not choose crew size freely; take 1 showed that left alone, both leads skipped reviewers entirely. That is worth its own beat or a note in the docs.
- The rows don't name their plan on screen; callouts carry it.
- A stray cursor from the launcher iframe sits in the raw list footage; the zoom crops it.
