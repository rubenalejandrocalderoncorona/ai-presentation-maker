# AI Presentation Maker

Generate animated, interactive presentations — **React + TypeScript + Framer Motion + TailwindCSS** — from a plain-text spec, using any AI model you already have access to.

```
node generate.js --spec my-spec.md --provider anthropic --output ./MyPresentation
cd MyPresentation && npm install && npm run dev
# → open http://localhost:5173
```

---

## Features

- **Any AI provider** — Anthropic Claude, OpenAI GPT-4o, local Ollama models, Groq, Mistral
- **Rich animations** — Framer Motion patterns: stagger reveals, SVG path draw, flow packets, typewriter, pulse rings, breathing blobs, loss curves, histograms
- **Spacebar-stepped presentations** — each slide can have N sub-steps, advancing with Space; arrows change slide
- **10 slide types** — cover, timeline, cards-grid, pipeline, lifecycle-wheel, drift-explainer, training-sim, text-bullets, comparison, final
- **Production-ready output** — fully typed TypeScript + Vite project, runs locally in seconds
- **Token-efficient** — the system prompt teaches the AI to reuse sub-components, declare data outside JSX, and batch similar slides

---

## Quick Start

### 1. Clone and enter the directory

```bash
git clone https://github.com/rubenalejandrocalderoncorona/ai-presentation-maker.git
cd ai-presentation-maker
```

### 2. Set your API key

The tool loads a `.env` file in the project root automatically — no third-party library required.

```bash
cp .env.example .env
# then edit .env and fill in your key(s)
```

Or export directly in your shell:

```bash
# Anthropic (default)
export ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
export OPENAI_API_KEY=sk-...

# Groq
export GROQ_API_KEY=gsk_...

# Mistral
export MISTRAL_API_KEY=...

# Ollama — no key needed, just have Ollama running locally
```

> **Proxy / Claude Code users:** if `ANTHROPIC_BASE_URL` is already set in your environment (e.g. you're running inside a Claude Code session), the tool picks it up automatically — no extra flags needed. You can also set it in `.env`.
>
> Corporate proxies often restrict which models are allowed. If you get an `INVALID_MODEL` error, use `--model claude-sonnet-latest` or check your proxy's supported model list.

### 3. Write your spec

Copy `examples/mlops-spec.md` and fill in your own content. The spec has two parts:

- **Basic info** — title, language, author, color theme
- **Slides** — one block per slide: type, content bullets, animation preference

See the [Spec Format](#spec-format) section below for all options.

### 4. Generate

```bash
node generate.js --spec my-spec.md --provider anthropic --output ./MyPresentation
```

The tool calls the AI, parses the response, and writes all project files into `./MyPresentation`.

### 5. Run

```bash
cd MyPresentation
npm install
npm run dev
# → http://localhost:5173
```

---

## CLI Options

| Flag | Default | Description |
|------|---------|-------------|
| `--spec <file>` | *(required)* | Path to your presentation spec `.md` file |
| `--provider <name>` | `anthropic` | `anthropic` \| `openai` \| `ollama` \| `groq` \| `mistral` |
| `--model <id>` | *(see table)* | Override the model (e.g. `--model gpt-4o-mini`) |
| `--output <dir>` | `./output/presentation` | Where to write the generated project |
| `--api-key <key>` | env var | Override API key (or set env var) |
| `--base-url <url>` | `ANTHROPIC_BASE_URL` | Anthropic API proxy base URL (see [Using with an API Proxy](#using-with-an-api-proxy)) |
| `--dry-run` | `false` | Print the first 500 chars of each prompt without calling the API |

### Default models per provider

| Provider | Default model |
|----------|--------------|
| `anthropic` | `claude-sonnet-latest` |
| `openai` | `gpt-4o` |
| `ollama` | `llama3.1:70b` |
| `groq` | `llama-3.3-70b-versatile` |
| `mistral` | `mistral-large-latest` |

---

## Spec Format

See `examples/mlops-spec.md` for a complete filled example (8-slide MLOps presentation in Spanish).

### Basic info block

```markdown
### Basic info
- **Title:** Your Presentation Title
- **Subtitle:** Optional tagline
- **Language:** English
- **Author name:** Jane Doe
- **Author role:** Senior Engineer @ Acme Corp
- **Color theme:** light-blue
```

**Color themes:** `light-blue` · `dark-indigo` · `light-white` · `dark-navy` · `custom: #hex`

### Slide block

```markdown
**Slide N — Title**
- Type: <slide-type>
- Content: (describe what to show)
- Animation: auto | none | (description)
```

### Slide types

| Type | Best for |
|------|----------|
| `cover` | Title + subtitle + chip reveals |
| `timeline` | History, milestones |
| `cards-grid` | Roles, features, 4-6 item comparisons |
| `pipeline` | CI/CD, architecture, data flow |
| `lifecycle-wheel` | ML cycle, product cycle (6-10 spokes) |
| `drift-explainer` | Distribution shift / concept drift |
| `training-sim` | Loss curves, training progress |
| `text-bullets` | Dense concept slides |
| `comparison` | Side-by-side before/after |
| `final` | Thank you + pills + optional QR |

### Animation preference

```markdown
# Let AI decide (recommended)
- Animation: auto

# Disable animations
- Animation: none

# Specific instructions
- Animation: reveal each card on spacebar (6 steps), then all glow on step 7
- Animation: auto-play SVG path draw left-to-right on slide entry, 1.5s
```

### Images / Logos

```markdown
### Images / Logos
- `/public/company-logo.png` — company logo, use on cover top-left
- `/public/k8s.png` — Kubernetes logo, use on slide 3 pipeline node
```

Place the actual image files in `<output>/public/` after generation.

---

## Using with Ollama (local, no API key)

```bash
# Start Ollama with a large model
ollama pull llama3.1:70b
ollama serve  # already running if you installed Ollama app

# Generate
node generate.js --spec my-spec.md --provider ollama --model llama3.1:70b --output ./Local
```

> Smaller models (7B-13B) may produce incomplete output. Use 70B+ for best results.

---

## Using with an API Proxy

If you access the Anthropic API through a proxy (e.g. a corporate gateway, a cost-tracking service, or a local Claude Code proxy like the one used in enterprise environments), point the tool at it with `ANTHROPIC_BASE_URL` or `--base-url`.

### Via .env file (recommended)

```bash
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_API_KEY=<your-proxy-session-token>
ANTHROPIC_BASE_URL=http://localhost:6655/anthropic/
```

> The API key for a corporate/local proxy is usually **not** a real `sk-ant-...` key — it's a session token issued by the proxy itself (e.g. a UUID). Check your proxy's documentation or run `echo $ANTHROPIC_API_KEY` inside an active Claude Code session to find the correct value.

### Via environment variable

```bash
export ANTHROPIC_BASE_URL=http://localhost:6655/anthropic/
export ANTHROPIC_API_KEY=<proxy-session-token>

node generate.js --spec my-spec.md --provider anthropic --output ./MyPresentation
```

The tool prints `Base URL : ...` on startup to confirm the proxy is active.

### Via CLI flag

```bash
node generate.js \
  --spec my-spec.md \
  --provider anthropic \
  --base-url http://localhost:6655/anthropic/ \
  --output ./MyPresentation
```

### How it works

The tool appends `/v1/messages` to whatever base URL you supply, then sends a standard Anthropic API request. The proxy forwards it and returns an unmodified Anthropic response envelope.

```
generate.js  →  POST http://localhost:6655/anthropic/v1/messages
                     └─ proxy forwards → https://api.anthropic.com/v1/messages
```

### Model restrictions on corporate proxies

Corporate proxies typically allowlist a fixed set of model aliases and reject versioned IDs. If you get `INVALID_MODEL`, use an alias instead of a specific version:

| Instead of | Use |
|-----------|-----|
| `claude-opus-4-7` | `claude-opus-latest` |
| `claude-sonnet-4-6` | `claude-sonnet-latest` |
| `claude-haiku-4-5` | `claude-haiku-latest` |

```bash
node generate.js --spec my-spec.md --provider anthropic --model claude-sonnet-latest --output ./MyPresentation
```

The default model is already `claude-sonnet-latest` for this reason.

### Claude Code proxy (same-session proxy)

If you're running inside a Claude Code session, the proxy is already wired up. Check the active values:

```bash
echo $ANTHROPIC_BASE_URL   # e.g. http://localhost:6655/anthropic/
echo $ANTHROPIC_API_KEY    # UUID session token, not an sk-ant- key
```

Copy both into your `.env` and the tool will route through the same proxy as Claude Code. Note: the session token changes each time Claude Code restarts — update `.env` when that happens.

> **Note:** `--base-url` only applies to the `anthropic` provider. For `openai`, `groq`, and `mistral` proxies, set `OPENAI_BASE_URL` in `.env` — those providers use the standard OpenAI-compatible base URL convention.

---

## Choosing a Model

Override the default model with `--model` for any provider:

```bash
# Anthropic — faster / cheaper
node generate.js --spec my-spec.md --provider anthropic --model claude-haiku-latest

# Anthropic — most capable
node generate.js --spec my-spec.md --provider anthropic --model claude-opus-latest

# OpenAI — smaller / cheaper
node generate.js --spec my-spec.md --provider openai --model gpt-4o-mini

# OpenAI — most capable
node generate.js --spec my-spec.md --provider openai --model o3

# Groq — fast inference
node generate.js --spec my-spec.md --provider groq --model llama-3.3-70b-versatile

# Mistral — European data residency
node generate.js --spec my-spec.md --provider mistral --model mistral-large-latest

# Ollama — fully local, no API key
node generate.js --spec my-spec.md --provider ollama --model llama3.1:70b
```

### Model quality vs cost trade-offs

| Use case | Recommended model |
|----------|------------------|
| Quick draft / testing | `claude-haiku-latest` or `gpt-4o-mini` |
| Standard presentations (default) | `claude-sonnet-latest` or `gpt-4o` |
| Complex, multi-slide with rich animations | `claude-opus-latest` or `o3` |
| No internet / fully private | Ollama `llama3.1:70b` |
| Corporate proxy (allowlisted aliases only) | `claude-sonnet-latest` |

### Permanently changing the default model

Edit `generate.js`, find the `DEFAULT_MODELS` object, and update the entry for your provider:

```js
const DEFAULT_MODELS = {
  anthropic: 'claude-sonnet-latest',  // ← change this
  openai:    'gpt-4o',
  ollama:    'llama3.1:70b',
  groq:      'llama-3.3-70b-versatile',
  mistral:   'mistral-large-latest',
}
```

---

## Project Structure

```
ai-presentation-maker/
├── generate.js          ← CLI entry point
├── package.json
├── prompts/
│   ├── SYSTEM_PROMPT.md ← Full AI system prompt (architecture rules, patterns, color palette)
│   └── USER_PROMPT_TEMPLATE.md ← Blank spec template + filled example
├── examples/
│   └── mlops-spec.md    ← Example: 8-slide MLOps presentation in Spanish
├── scaffold/            ← Reusable Vite project template (for reference / manual use)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── hooks/usePresentation.ts
│       └── components/
│           ├── Navigation.tsx
│           └── slides/Slide_00_Cover.tsx
└── output/              ← Generated presentations land here
```

---

## How It Works

1. **Spec → Prompt** — `generate.js` combines `prompts/SYSTEM_PROMPT.md` with your spec file into a single API call
2. **AI generates code** — the model outputs all project files in order: `package.json`, configs, `index.css`, hooks, components, `App.tsx`
3. **Parse → write** — the tool extracts code blocks from the response and writes them to `--output`
4. **You run it** — `npm install && npm run dev`

The system prompt encodes a complete React/Framer Motion architecture: file structure, animation patterns (10 named patterns with working code), color palette, slide type catalogue, and token-efficiency rules. This means even smaller models produce coherent, runnable output.

---

## Troubleshooting

**"No files were parsed from the response"**
The AI output didn't follow the expected format. Check `output/raw_response.md` and look for code blocks. Try a larger model or add `--dry-run` to inspect the prompt.

**TypeScript errors after generation**
Run `npx tsc --noEmit` in the output directory. Common fixes: the AI forgot to import a component, or used a Framer Motion API that changed. Edit the generated file directly.

**Ollama times out**
Large prompts can take 5+ minutes on consumer hardware. The tool has no timeout — just wait.

**Blank slides / animations not working**
Most likely `animStep` is not wired up in `App.tsx` `ANIMATED_SLIDES` set, or the `SLIDE_ANIM_STEPS` map in `usePresentation.ts` has the wrong index.

---

## License

MIT
