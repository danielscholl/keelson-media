# Capturing real footage

## A clean stage

Never record against the user's everyday instance: chat history, run history, rib names, and internal model lists all leak. For Keelson, run a throwaway instance:

```bash
H=~/keelson-demo/.keelson; mkdir -p $H/commands $H/scripts
# copy only providers/defaultProvider from ~/.keelson/config.json, plus any command or script fixtures the workflow needs
export KEELSON_HOME=$H PORT=7979 KEELSON_SERVER_URL=http://127.0.0.1:7979
keelson start            # reset between takes: keelson stop; rm -f $H/keelson.db*
```

- Its web UI is served from the same port (`http://127.0.0.1:7979`). The user's real server on 7878 is untouched.
- The smoke-test workflow needs `commands/e2e-echo-command.md` and `scripts/echo-args.js` from `~/.keelson`.
- Do a dry run first. Then reset and record the final takes in story order, so lists such as Runs show exactly what the narration claims.
- Paths print on screen (`target: cwd=...`, `log: ...`, the run view's `CWD`). Run from a short, neutral directory; scratch paths under `/private/tmp/...` look broken on camera.
- Model pickers can list internal-only model names. Keep them closed on camera.

## Terminal: vhs

`brew install vhs`. A `.tape` file is a script: `Set` lines for look, `Hide`/`Show` around setup, `Type`, `Enter`, `Sleep`.

- `Set Shell "bash"` plus a `Hide`d block that exports env vars, `cd`s, sets a short `PS1`, and clears. Add `BASH_SILENCE_DEPRECATION_WARNING=1` on macOS.
- Match the product palette with an inline `Set Theme { ... }` JSON (Keelson: background `#0d1429`, accent `#9b8eff`). `Set FontFamily "JetBrains Mono"` is installed.
- vhs font size is not pixels on the final frame. At 1920x1080, `FontSize 20` with `LineHeight 1.2` fit about 32 rows; size 25 to 28 fits about 24. Count the output lines and size so the key result is on screen at the end.
- A hidden `clear` between commands (`Hide`, `Type "clear" Enter`, `Show`) keeps each beat on one screen.
- Hidden time is cut from the output, so the visible timeline is the sum of the visible Sleeps plus typing (`TypingSpeed` times characters). Use fixed Sleeps so narration offsets are known.

## Browser: Playwright plus CDP screencast

Set up a scratch dir with `bun add playwright@<pinned>`. If its bundled browser build is missing, `chromium.launch({ channel: "chrome" })` uses the installed Chrome with a throwaway profile.

- Playwright's `recordVideo` is soft on text. Instead use `Page.startScreencast` (`format: "jpeg", quality: 92, maxWidth: 1920, maxHeight: 1080`) through `ctx.newCDPSession(page)`, saving each frame with `metadata.timestamp` and acking it. `videos/tools/frames2mp4.py` turns frames plus timestamps into a constant 30fps video. Do not feed variable frame durations to ffmpeg's concat demuxer with images: it quantizes short durations and stretches the video.
- Viewport 1600x900 at `deviceScaleFactor: 1.2` fills a 1080p frame with larger UI than a 1920 viewport.
- Inject `videos/tools/cursor.js` with `ctx.addInitScript`. Headless pages have no cursor, so the injected one (arrow plus click ripple) is the only one on screen. Move with `page.mouse.move(x, y, { steps })` toward each target's bounding box center before clicking.
- Log `Date.now()/1000` at each meaningful action into a `marks` object and save it with the frames. Screencast timestamps share that clock, so marks line up with frames.
- Prefer role and label locators taken from the source (`getByRole("radio", { name: "Runs" })`, `getByRole("button", { name: "Back to catalog" })`) over text guesses. Check the SPA source when a locator times out, and grab the last captured frame to see where it stalled.

Keelson SPA specifics: the Workflows view toggle is a radiogroup (Both, Workflows, Runs). A card's Run button opens a pre-start screen; the run begins on `Start`. Status pill text becomes `completed`. During a run the trace auto-expands rows.

## Quick GIFs

For a PR or docs GIF without narration, Claude in Chrome's `gif_creator` is faster than this pipeline.
