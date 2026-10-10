# Field Trial · ADME Interop, alpha (rev 0)

The opener and the first scene of Field Trials 01, built to set the strand's style before the rest is cut. The treatment is `../treatment.html`; it still says Sea Trials and will catch up once the direction is settled. This manifest grows scene by scene into the full piece, and scenes are swapped in place as their stamps move from drawn to built.

## Choices

- Strand: Field Trials, renamed from Sea Trials. Viewers haven't met Keelson or its ship, so the identity is a field trial. The opener is a TRIAL PLAN title block (project, drawn by, under test, site, status, powered by). The closer is a TRIAL REPORT block with the same layout (as built, in work, proposed, next rev, project, powered by). Between them every board carries a FIELD TRIALS 01 · REV 0 · PLATE stamp, and the header reads OSDU · ADME INTEROP · FIELD TRIALS 01 beside a surveyor's benchmark glyph.
- Framing: an OSDU #sig-interop 15% project by Daniel Scholl at Microsoft. Keelson appears only as the "Powered by Keelson" row.
- Voice: `en-US-Harper:MAI-Voice-2.1`, no style, no pause cap, matching the Keelson tutorials (the user went back to Harper on 2026-10-09: Ethan happy paused too much and read with an odd attitude; Grant was flat). The other cuts are kept as `final.ethan.mp4` (`narr.ethan/`) and `final.grant.mp4` (`narr.grant/`, an older edit without the Field Trials bookends). Microsoft MAI voices only, no Dragon HD. Switch with the `voice:`/`style:` lines, then `tts.py .`, `plate.mjs .` and `compose.py .`.
- Title: the trial is ADME Interop and the stage is Alpha (user, 2026-10-09). The title block reads FIELD TRIAL · ADME INTEROP │ REV 0 │ ALPHA, the figtag FIELD TRIAL · ADME INTEROP (at `top: 92` so it centres on the FIELD TRIALS wordmark), and the closer card TRIAL · ALPHA. The spoken intro is "Field trial. ADME Interop." and the report ends "That's the alpha." The SEVEN PAGES board name stays, since the guide really is seven pages.
- Spoken forms: ADME is "Ad-Me" (`Ad Me` in ssml), OSDU is said as letters (`O S D U` in ssml; user, 2026-10-09), 401 is "four oh one", Azure CLI is "Azure C L I", object id is "object I D".
- Bookends: the Field Trials series opener and closer (`assets/bookends/{open,close}-field-trials.mp4`, built by `assets/bookends/source/field-trials.py`). The opener draws a theodolite sighting a pumpjack on the series sheet under FIELD TRIALS / ON PAPER, IT WORKS., holds about 3 s after the drawing, and dissolves for 1 s into the trial plan; Harper says "On paper, it works." over it. The closer is the real theodolite aimed at a nodding pumpjack at sunrise; the card reads IN THE FIELD, IT HAS TO., and Harper signs off "Field trials. On paper, it works. In the field, it has to." The figtag reads FIELD TRIAL · ADME INTEROP and the closer's title block carries a Field Trials header. The Sora candidates and verdicts are in `../bookends/` (G4 = pass 2's r2 opener + closer 3).
- Boards: the guide is rebuilt and re-sent (v14 to v16, on a badge big enough to read), one instance shared by twelve sample companies, seven pages where the three that never stay true grow and the rest step aside, and the by-hand assembly that lands in an inbox already behind. The last beat is a partner asking if she has access yet (Rachel Kim, PacRim Energy, still getting a 401, as in the rib's spec), and someone checking by hand.
- Opening: "On paper, it works." sets up the question, "A 15% project. Can AI agents do real work on a real, shared platform?", which lands at about 13.4 s after the 6.6 s opener. Dropping the spoken 15% line would bring it about 2 s earlier. `final.prev.mp4` is the cut before the reviewer round.
- Type: Inter, installed 2026-10-09 with `brew install --cask font-inter`. Earlier shorts rendered Inter requests in the system sans because the font was missing.

## Data

Everything on screen is the rib's sample cast: contoso-adme, people such as Hiro Tanaka and Lena Fischer, and the twelve `.example` organizations from the rib's design spec. The real access guide is never shown.

## Title block (2026-10-09)

The opening title block carries the official OSDU and Microsoft marks small at the right end of the PROJECT and DRAWN BY rows (`assets/logos/`, provenance in its README). Keelson moved out of the block to the corner POWERED BY mark, which fades in with the rows. The finished block holds about 2 s before "So start with one question" folds it away (`gaps: { i3: 2.6 }` on the intro board; `plate.mjs` now takes per-line gaps).

## Act I continued: Confident and wrong, The rig (2026-10-09)

Two plate boards between BY HAND and the trial report, from the treatment's arc. Confident and wrong draws the MCP server's journeys J8a (a nested search missing its inner parentheses answers 200 with zero results) and J5 (the default `totalCount` stops at 10,000 silently), then a members POST stamped DRY RUN FIRST, then "Better ground to stand on." The rig names three pieces: Keelson once, by name (the user chose this over an unnamed workbench), the ADME rib bolted under it, and the OSDU MCP server with `osdu_about` running and describe, resolve, find and read in work. The last line, "Next, the guide comes apart, page by page," hands off to Act II, which waits on the rib's sample-instance mode.

## Act II: Taken apart, filmed on sample data (2026-10-09)

Four filmed scenes between The rig and the trial report, each a guide page against the ADME tab:
Who has access (p.4, Access pulse and the funnel from invitation to data), Why 401 (p.3, Rachel Kim's
person drawer then Why 401/403: fails at users@, one-change fix, a note to send), Who can reach what
(p.5, Seismic stats, then a viewer grant for Lena on alpha previewed as a dry-run plan; Apply is
hovered, never clicked), and What's in it (Data pulse and the partition map, ending on the pilot tag
that expires in 22 days, 4 days before the pilot pass ends).

- Footage is the real rib in sample-instance mode (keelson-rib-adme PR #48, `KEELSON_ADME_SAMPLE=1`),
  served from an isolated home: `KEELSON_HOME=/Users/Shared/adme-stage/.keelson PORT=7980`, rib
  symlinked to `~/keelson/keelson-rib-adme-sample`. Port 7979 belongs to another stage.
- `source/rec-act2.mjs` records all four scenes (or named ones) against `narr/durations.json`, one
  mark per line; `frames2mp4.py` makes `raw/f-*.mp4`; marks are copied to `source/f-*-marks.json`.
- Frames are `viewport` with a manifest `viewport_header` (compose now reads it) so the header reads
  FIELD TRIAL · ADME INTEROP · ALPHA instead of FIG. 01.
- Not yet filmed: Ask about it (explore into chat, canvas page) and Ask the platform (drawn, IN WORK).
- Known: the Activity chart's y-axis shows fractional people (0.63, 1.3, 1.9); a "seis-read ✓" toast
  is dismissed before recording.

## Act II: Ask about it, filmed live (2026-10-09)

- One live take on the :7980 sample stage (`source/rec-ask.mjs`): ✦ on Organizations, the seeded chat, the typed ask "Draft this week's partner update from this panel as a page.", and the canvas page GitHub Copilot publishes. Marks log events (click, reply, send, page) rather than narration, and three scenes (`f-ask1..3`) cut the model's wait.
- The dry run found the seed cut off: the board's indented JSON was 12.9 KB against a 6.8 KB cap, so the agent saw 6 of 12 organizations and said so. Fixed in keelson#1064 (compact JSON fence, 5.2 KB); the stage serves that build via `KEELSON_WEB_DIR=~/keelson/keelson-explore-seed/apps/web/dist` until it merges and releases.
- `cursor.js` injects into the page's sandboxed iframe too, which leaves two cursors on the page. The recorder injects it in the top frame only and hides it once the page opens.
- Takes are live AI output, so check every number before keeping one. Take 2 said "8 organizations have no active person" (it is 9; Pacrim Energy was left out). Take 3 is the one in the cut: "3 of 32 partner people are active; 9 of 12 organizations have none", and it flags that Baltica's bar counts one active while neither listed person is marked active. g4 is written to that ("where they don't add up, it says so"), so a reshoot needs the line checked against the new page.
- Takes 1 and 2 are kept in `raw/scout3/`.

## Act II: Ask the platform, drawn (2026-10-09)

Still drawn, because the MCP server's state hasn't changed: `WORK_STATE.md` (2026-10-08) says only `osdu_about` is registered, checks pass offline, and both owners' live logins (`oms-p9h.15`) are pending. The board (`ask`, between the live chat scenes and the trial report) draws GitHub Copilot CLI calling `osdu_about` for identity and then health, with the field names and status values from the Stage 1 projection in `docs/contracts/tools/about.md`: `effectiveCaller`, `reachability`, and five domains where audit is `not_configured` under D9. The caller `operator@cimpl.example` is a placeholder, and no group count is drawn because the contract only reports one after a real self-groups read. The terminal's title bar says DRAWN FROM THE CONTRACT, an IN WORK stamp lands on "drawn", and the title block's status cell reads IN WORK for the length of the board. Lines p1 to p4 end on "Live sign-in is next, then four more tools." Refilm this as a live take once sign-in works on CIMPL, and keep the audit line only if a live health answer still says `not_configured`.
