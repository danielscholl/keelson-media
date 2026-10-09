# Azure voice and video

## Where

An Azure AI Foundry (AIServices) resource, so Azure Speech is built in with no deployment. The tools read its name, resource group and subscription from `AZURE_AI_RESOURCE`, `AZURE_AI_GROUP` and `AZURE_SUBSCRIPTION_ID`, from the environment or a gitignored `tools/.env.local`.

```bash
KEY=$(az cognitiveservices account keys list -g "$AZURE_AI_GROUP" -n "$AZURE_AI_RESOURCE" --subscription "$AZURE_SUBSCRIPTION_ID" --query key1 -o tsv)
```

Hold the key in a shell variable only. Never write it to a file or print it.

## Speech (narration)

- Synthesize: `POST https://eastus2.tts.speech.microsoft.com/cognitiveservices/v1` with headers `Ocp-Apim-Subscription-Key`, `Content-Type: application/ssml+xml`, `X-Microsoft-OutputFormat: riff-48khz-16bit-mono-pcm` (or `audio-24khz-96kbitrate-mono-mp3`), and a `User-Agent`. `videos/tools/tts.py` wraps it.
- List voices: `GET .../cognitiveservices/voices/list`. About 950 voices. Families worth knowing: `MAI-Voice-2.1` and `MAI-Voice-2.1-Flash` (Microsoft's newest, preview), `DragonHDLatestNeural` (GA), `DragonHDOmniLatestNeural` (expressive, preview), `*TurboMultilingualNeural` (OpenAI voices hosted in Speech).
- SSML handles pronunciation fixes (`<phoneme>`, `<sub alias="...">`), pauses (`<break time="400ms"/>`), and rate (`<prosody rate="-5%">`). Fix a misread word there rather than switching voice.
- The REST endpoint returns audio only. Word-level timings need the Speech SDK (`azure-cognitiveservices-speech`, WordBoundary events) or the batch synthesis API. Per-line clips with measured durations were enough for sentence captions.

## OpenAI models on the same resource

Endpoint `https://$AZURE_AI_RESOURCE.openai.azure.com/openai/v1/...`, header `api-key`. Deployed: `gpt-4o-mini-tts`, `gpt-audio-1.5`, `sora-2` (all GlobalStandard, pay per use, idle is free).

- `gpt-4o-mini-tts`: `POST /audio/speech` with `model`, `voice` (cedar, marin, ...), `input`, `instructions` (plain-English delivery direction), `response_format`.
- `gpt-audio-1.5`: `POST /chat/completions` with `modalities: ["text","audio"]`, `audio: {voice, format}`; a system prompt telling it to read verbatim. Base64 audio in `choices[0].message.audio.data`.
- `sora-2`: `POST /videos` with `model`, `prompt`, `seconds` ("4", "8", "12"), `size` ("1280x720", "720x1280"). Poll `GET /videos/{id}` until `status` is `completed` (about a minute for 4s), then `GET /videos/{id}/content`. Output includes an AAC ambient track. Bills per generated second, so iterate on short clips. `videos/tools/sora.py` wraps it and saves the prompt beside the clip. The deployment takes about one job at a time, so generate variants sequentially.

Prompting that matched the Keelson docs identity: name the palette by hex (navy `#1e3a5f`, brass `#b5803a`, off-white sheet), name the boat (a traditional Basque wooden fishing boat from San Sebastián), describe the build order (keel beam first, then ribs rising), and end with "No text, no letters, no logos." A flat top-down drafting-sheet prompt gives clean vector-like linework that sits next to the docs; a real shipyard prompt gives photoreal timber and harbor. Sora draws a generic hull shape rather than the docs figure's raked stem, so don't expect a match to the SVG.

Also in the eastus2 or swedencentral catalog if a short needs them: `gpt-image-2`, `FLUX.2-pro`, `MAI-Image-2.6` (swedencentral or eastus), `MAI-Transcribe-2-Streaming`.

## Deploying a model

The auto-mode safety classifier blocks `az cognitiveservices account deployment create` on a shared subscription even with the user's approval. Give the user one zsh-safe command to run with `!` (zsh does not word-split `$var`, so no `set -- $m` loops):

```
! az cognitiveservices account deployment create -g "$AZURE_AI_GROUP" -n "$AZURE_AI_RESOURCE" --subscription "$AZURE_SUBSCRIPTION_ID" --deployment-name <name> --model-name <name> --model-version <ver> --model-format OpenAI --sku-name GlobalStandard --sku-capacity <n> -o none && echo ok
```

Check versions and quota first: `az cognitiveservices model list -l eastus2` and `az cognitiveservices usage list -l eastus2`.

## Pronunciation (Harper, MAI-Voice-2.1)

Keep the caption spelling in `text` and put the spoken form in the line's `ssml`:

| Word | Harper says | Spoken form that works |
|---|---|---|
| Copilot | "co-po-lit" | `Co Pilot` (plain words). `<sub alias="co-pilot">` worked but added about two seconds of pauses to the line. |
| YAML | letters | `<sub alias="yammel">YAML</sub>` |

The same line can differ by a second between renders, so re-measure after any re-voice and re-time anything keyed to it.

## Word timing

MAI voices (Harper `MAI-Voice-2.1`) emit no word-boundary events through the Speech SDK; standard neural voices (e.g. `en-US-AvaNeural`) do. `videos/tools/tts.py` gets word times for any voice by sending each rendered WAV to fast transcription (`POST https://eastus2.api.cognitive.microsoft.com/speechtotext/transcriptions:transcribe?api-version=2024-11-15`, multipart `audio` + `definition={"locales":["en-US"]}`), then aligning the recognized words to the known line text; words it hears differently ("Kielson", "Co Pilot") are interpolated between their neighbours. `--align-only` re-times existing takes without re-voicing.
