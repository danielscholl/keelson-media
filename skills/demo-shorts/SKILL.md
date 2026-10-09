---
name: demo-shorts
description: Make short narrated demo videos (about 60 seconds) of real software, Keelson first, from real screen and terminal footage with AI narration and optional AI-generated B-roll. Use when the user asks for a demo video, tutorial clip, short, screencast, walkthrough video, or a clip to post on X, LinkedIn, or YouTube; or wants to re-cut, re-voice, or improve an existing short. Not for slide decks, static infographics, or GIFs for a PR (Claude in Chrome's gif_creator covers those).
---

# Demo shorts

A short earns its time by showing one real thing working. Footage of the product is always the real product doing real work. Generated video is seasoning (an opener, a transition, a metaphor), never a stand-in for the product.

Concept explainers are the exception: when the point is an idea (what Keelson is, how ribs attach), build motion graphics instead of faking a demo. Draw it on the blueprint sheet and keep every claim to what the docs say ships. Method and gotchas: `references/motion.md`. The two can share one short: a drawn board to frame the idea, then real footage to prove it. Choose the form per beat, by what explains the content best.

Material lives in the videos library, `danielscholl/keelson-media`, checked out at `~/workspace/videos` (see its README). This skill is the method; that folder is the library, the record, and the tools (`videos/tools/`, versioned with the shorts in the library's git repo). A short is driven by its `short.yaml` manifest; `videos/tools/README.md` has the shape.

## The one rule against sameness

Every short starts from a concept, not from the last short's files. Before planning, read `videos/LEDGER.md`. Choose differently from the previous few on at least three of: concept angle, structure, opener, voice, aspect ratio, pacing, visual devices, music. Copy mechanics freely (helpers in `videos/tools/`, gotchas in `references/`), never the shape. When a past short's `source/` is reused, it is for a technique, not a storyboard.

If you notice the plan converging on "title card, terminal, browser, install card" again, stop and pick a different structure from `references/ideas.md` or invent one.

## Series bookends

Keelson shorts share a sting that mirrors the docs headline: an opener that lays the keel (the blueprint drawing itself) and a closer that raises the ribs (the built hull, the call to action). The demo in between is the building. A `FIG. NN` tag numbers each short the way the landing numbers figures. Built pieces and how to rebuild them: `videos/assets/bookends/`.

The closer's spoken sign-off is "Keelson. Lay the keel, raise the ribs.", said once the end card is up. Don't read the install line or URL aloud; the card carries them.

Bookends are the one thing allowed to repeat, so they must stay light:
- Every short opens on the opener itself. A cold open (footage or a payoff teaser before the sting) read as a stray screenshot to the user on FIG. 01 and was removed; put the hook in the opener's narration instead. Trim the opener hard (2 to 3 seconds) only when it isn't carrying narration.
- Vary inside the identity: new Sora takes in the same palette (night harbor, a launch, a finished boat under way), a different pairing, or a closer that teases the next figure instead of the install line. Add each new piece to `videos/assets/` with its prompt.
- A short can drop the bookends entirely when they would fight the concept (a 15-second loop, a reply clip).

## Flow

1. **Concept.** One sentence: who is watching and what they should believe after 60 seconds. Pick the single moment that proves it (the "money shot") and build backward from it. Propose two or three distinct angles to the user before building unless they have already chosen.
2. **Script, narration first.** Write lines a person would say out loud: short sentences, product terms spelled the way they should be spoken ("seventy-eight seventy-eight", "dash dash watch"). Put the lines in `short.yaml` and render them with `videos/tools/tts.py <short-dir>`: one WAV per line, durations, and real word times (`narr/words.json`). The narration durations set the pacing for every capture.
3. **Capture real footage.** Terminal with vhs, browser with a CDP screencast plus an injected cursor, each logging timestamps for its key actions. Use an isolated, clean instance so no personal data appears. Details: `references/capture.md`.
4. **Optional generated pieces.** Sora for an opener or B-roll, image models for a backdrop. Keep them short and on-theme. Details: `references/azure-media.md`.
5. **Compose.** Place each narration line against the logged action timestamps, assert lines never overlap, overlay cards and captions rendered as PNGs, crossfade scenes, normalize loudness. `videos/tools/compose.py <short-dir>` does all of this from the manifest (times are written against capture marks, and it refuses overlapping lines). Details: `references/compose.md`.
6. **QA before showing anyone.** Contact sheet of frames at key moments (look at it), silence map, integrated loudness, check that no private paths, tokens, chats, or internal model names are on screen. `PHONE=<t> videos/tools/qa.sh final.mp4 <times>` also writes one frame at 405 px wide; read it, since that is the size most viewers see.
7. **Hand it over.** Open it with `open <file>` (afplay and in-shell players are silent for the user). Say what is weak in this cut, not just what is in it.
8. **Record it.** Save to `videos/shorts/<act>/fig-NN-<slug>/` (e.g. `act-2-workflows/fig-06-the-approval-gate`, `codas/` for codas) (short.yaml, final.mp4, final.srt, narr/, cards/, source/, raw/, NOTES.md), add a LEDGER row, and commit the library (masters, raw footage, and WAVs are ignored). Reusable pieces (an intro clip, a voice audition, a music bed) go in `videos/assets/` with a note on how they were made.

## Defaults the user has chosen

- Voice: `en-US-Harper:MAI-Voice-2.1` through Azure Speech. A different voice is a legitimate variety choice; the audition reels in `videos/assets/voices/` show the options.
- Delivery target is social (X first): loudness about -16 LUFS, burned-in captions (many people watch muted). Demos run about 60 seconds; the user is fine with up to two minutes when the content needs it.
- Anything publish-facing goes past the user before it is posted. Never post on their behalf.

## Judgement calls

- Phones are the real screen. If UI text is unreadable at phone size, zoom or crop into the region that matters instead of showing the whole window.
- Silence over 2 to 3 seconds feels like a stall. Tighten the capture, add a line, or lay a quiet music bed.
- Captions should match the narration closely but can drop filler. Skip them only where on-screen text already says the same thing.
- A fake cursor helps the eye follow clicks; a cursor that moves when nothing happens is noise.
- Ending on an install command or URL is one option, not a requirement.
- Give the eye a beat before the first screen footage: about two seconds of held frame after the opener's last line, so the jump from cinematic to UI doesn't feel abrupt. The user asked for this after watching the first cut.
