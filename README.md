# keelson-media

The working library for the Keelson shorts series: short narrated videos of real Keelson runs, one numbered figure per concept, played in the Keelson docs. Everything needed to rework a short lives here. GitHub Pages publishes only `media/`, the web encodes the docs play.

The method lives in the `demo-shorts` skill (`skills/demo-shorts`; link it into `~/.claude/skills` to use it). Cutting a short runs as a Keelson workflow, `cut-a-short` (`.keelson/workflows/`): register this checkout as a Keelson project and run it with the short's folder as the argument. The Azure Speech and Sora tools read `AZURE_AI_RESOURCE`, `AZURE_AI_GROUP` and `AZURE_SUBSCRIPTION_ID` from the environment or a gitignored `tools/.env.local`.

```
assets/          reusable pieces: intro clips, voice auditions, anything worth using twice
shorts/<act>/fig-NN-<slug>/   one folder per act (act-0-the-plate ... act-4-raise-the-ribs, codas), one per figure inside
shorts/swarm/det-NN-<slug>/   the swarm detail series (see SWARM.md)
  final.mp4      the master cut (local only; media/ holds the web encode)
  script.json    narration lines, in order
  narr/ cards/   rendered narration clips and overlay cards
  source/        the capture and compose scripts that produced it
  raw/           scene renders before compose
  NOTES.md       the concept, the choices made, and what to improve
short.yaml       (per short) the manifest tools/compose.py cuts from
tools/           the shared production line: tts, compose, cards, qa (see tools/README.md)
LEDGER.md        one row per short: the choices, so the next one can differ
SWARM.md         the swarm series bible: ten detail sheets, acts, conventions
SERIES.md        the series bible: the figure map in viewing order, the docs page each answers for, the spoken form, phases
media/fig-NN/    what Pages serves: fig-NN.mp4, poster.jpg, captions.vtt (tools/publish.sh writes them)
media/swarm/det-NN/   the same for the swarm series (a manifest with series: swarm, prefix: det)
skills/          the demo-shorts skill
.keelson/        project workflows (cut-a-short)
PROPOSAL.html    the framework proposal the bible came from (rig, docs embed, hosting); the live copy is the claude.ai artifact linked in SERIES.md
```

Before starting a new short, pick its figure in `SERIES.md`, then read `LEDGER.md`. Pick a concept, a structure, and an opener that the last few shorts did not use.
