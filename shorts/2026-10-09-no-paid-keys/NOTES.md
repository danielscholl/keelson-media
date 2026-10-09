# no-paid-keys (FIG. 16)

**Concept (what, why, how):** what: a gateway registers any OpenAI-compatible endpoint (local Ollama, vLLM, OpenRouter, Azure OpenAI, LiteLLM) as a named provider beside the built-ins. Why: try the harness with nothing to buy, keep a conversation on your own machine, or use the endpoint your team already runs. How: `keelson gateway add <name> <baseUrl> --model <id>` writes the config (a key, if any, goes to the keychain and only over HTTPS or loopback); the picker lists the models the endpoint reports; turns stream, but today they get no Keelson tools and no session resume; usage records the turns and marks an unpriced model unpriced, never free.

**Structure:** the lay-the-keel opener with "Figure sixteen. No paid keys.", a gateway board, `keelson gateway add ollama … --model phi4` and a keyless one-shot chat answered by phi4 on the laptop, the browser picker filtered to phi4 and a chat on it, the Usage ledger showing the local turns as unpriced, a "what it is today" board (key, streams, tools, session, cost), a why board and "Any endpoint, one more provider." Closer with SHEET 16 · ACT Coda.

**Capture:** the isolated stage (port 7979) and Daniel's local Ollama (`phi4:latest`, already pulled). Terminal `source/gw.tape`; browser `source/rec.mjs` (modes chat and usage). The `ollama` gateway stays configured on the demo home.

**Weak:** 115 s. The sheet card reads "ACT Coda". phi4 needs a few seconds per turn on this machine; the waits are cut.
