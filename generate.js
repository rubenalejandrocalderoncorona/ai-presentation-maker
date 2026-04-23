#!/usr/bin/env node
/**
 * AI Presentation Maker — CLI
 *
 * Reads a presentation spec file, combines it with the system prompt,
 * and sends it to your chosen AI provider.
 *
 * Supported providers: anthropic | openai | ollama | groq | mistral
 *
 * Usage:
 *   node generate.js --spec my-spec.md --provider anthropic --output ./MyPresentation
 *   node generate.js --spec my-spec.md --provider openai --model gpt-4o
 *   node generate.js --spec my-spec.md --provider ollama --model llama3.1:70b
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── CLI argument parsing ────────────────────────────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2)
  const opts = {
    spec: null,
    provider: 'anthropic',
    model: null,
    output: './output/presentation',
    dryRun: false,
    apiKey: null,
    baseUrl: null,
  }
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--spec':        opts.spec     = args[++i]; break
      case '--provider':    opts.provider = args[++i]; break
      case '--model':       opts.model    = args[++i]; break
      case '--output':      opts.output   = args[++i]; break
      case '--dry-run':     opts.dryRun   = true;      break
      case '--api-key':     opts.apiKey   = args[++i]; break
      case '--base-url':    opts.baseUrl  = args[++i]; break
    }
  }
  if (!opts.spec) {
    console.error('ERROR: --spec <file> is required')
    console.error('Example: node generate.js --spec my-spec.md --provider anthropic')
    process.exit(1)
  }
  return opts
}

// ── Default models per provider ─────────────────────────────────────────────
const DEFAULT_MODELS = {
  anthropic: 'claude-opus-4-7',
  openai:    'gpt-4o',
  ollama:    'llama3.1:70b',
  groq:      'llama-3.3-70b-versatile',
  mistral:   'mistral-large-latest',
}

// ── Build the full prompt ───────────────────────────────────────────────────
function buildPrompt(specPath) {
  const systemPrompt = fs.readFileSync(
    path.join(__dirname, 'prompts', 'SYSTEM_PROMPT.md'), 'utf8'
  )
  const userSpec = fs.readFileSync(specPath, 'utf8')

  return {
    system: systemPrompt,
    user: `Generate the complete presentation from this spec:\n\n${userSpec}\n\n` +
          `Output every file in full. After each file print: ✅ FILE: <filename> (<N> lines)\n` +
          `After all files, print the 📦 PRESENTATION READY summary.`,
  }
}

// ── Provider implementations ─────────────────────────────────────────────────

async function callAnthropic(model, prompt, apiKey, baseUrl) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('Set ANTHROPIC_API_KEY env var or pass --api-key')

  // Honour proxy: ANTHROPIC_BASE_URL env var, --base-url flag, or the official endpoint.
  // Trailing slash is normalised so the path segment appends cleanly.
  const base = (baseUrl || process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com')
    .replace(/\/$/, '')
  const endpoint = `${base}/v1/messages`

  const body = JSON.stringify({
    model,
    max_tokens: 32000,
    system: prompt.system,
    messages: [{ role: 'user', content: prompt.user }],
  })

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body,
  })
  if (!res.ok) throw new Error(`Anthropic API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.content[0].text
}

async function callOpenAI(model, prompt, apiKey) {
  const key = apiKey || process.env.OPENAI_API_KEY
  if (!key) throw new Error('Set OPENAI_API_KEY env var or pass --api-key')

  const body = JSON.stringify({
    model,
    max_tokens: 32000,
    messages: [
      { role: 'system',    content: prompt.system },
      { role: 'user',      content: prompt.user   },
    ],
  })

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body,
  })
  if (!res.ok) throw new Error(`OpenAI API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices[0].message.content
}

async function callOllama(model, prompt) {
  const body = JSON.stringify({
    model,
    stream: false,
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user',   content: prompt.user   },
    ],
  })

  const res = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })
  if (!res.ok) throw new Error(`Ollama error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.message.content
}

async function callGroq(model, prompt, apiKey) {
  const key = apiKey || process.env.GROQ_API_KEY
  if (!key) throw new Error('Set GROQ_API_KEY env var or pass --api-key')

  const body = JSON.stringify({
    model,
    max_tokens: 32000,
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user',   content: prompt.user   },
    ],
  })

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body,
  })
  if (!res.ok) throw new Error(`Groq API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices[0].message.content
}

async function callMistral(model, prompt, apiKey) {
  const key = apiKey || process.env.MISTRAL_API_KEY
  if (!key) throw new Error('Set MISTRAL_API_KEY env var or pass --api-key')

  const body = JSON.stringify({
    model,
    max_tokens: 32000,
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user',   content: prompt.user   },
    ],
  })

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body,
  })
  if (!res.ok) throw new Error(`Mistral API error: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.choices[0].message.content
}

// ── Parse AI response into files ─────────────────────────────────────────────
function parseFilesFromResponse(response) {
  const files = []
  // Match markdown code blocks preceded by a filename comment or path
  const blockRe = /(?:^|\n)(?:\/\/\s*|#\s*)?([^\s`]+\.[a-z]+)\s*\n```(?:[a-z]*)?\n([\s\S]*?)```/gm
  let match
  while ((match = blockRe.exec(response)) !== null) {
    files.push({ path: match[1].trim(), content: match[2] })
  }

  // Fallback: look for ✅ FILE: annotations
  if (files.length === 0) {
    const fileRe = /✅ FILE: ([^\s(]+)/g
    // If AI named files but put code in blocks without filenames, try to pair them
    const codeBlocks = [...response.matchAll(/```(?:[a-z]+)?\n([\s\S]*?)```/gm)]
    const fileNames  = [...response.matchAll(/✅ FILE: ([^\s(]+)/gm)]
    fileNames.forEach((m, i) => {
      if (codeBlocks[i]) files.push({ path: m[1], content: codeBlocks[i][1] })
    })
  }

  return files
}

// ── Write files to disk ──────────────────────────────────────────────────────
function writeFiles(files, outputDir) {
  let written = 0
  for (const { path: filePath, content } of files) {
    const fullPath = path.join(outputDir, filePath)
    const dir = path.dirname(fullPath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(fullPath, content, 'utf8')
    console.log(`  ✅ ${filePath} (${content.split('\n').length} lines)`)
    written++
  }
  return written
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs()
  const model = opts.model || DEFAULT_MODELS[opts.provider]

  const effectiveBaseUrl = opts.baseUrl || process.env.ANTHROPIC_BASE_URL || null

  console.log(`\n🎨 AI Presentation Maker`)
  console.log(`   Provider : ${opts.provider}`)
  console.log(`   Model    : ${model}`)
  console.log(`   Spec     : ${opts.spec}`)
  console.log(`   Output   : ${opts.output}`)
  if (effectiveBaseUrl) console.log(`   Base URL : ${effectiveBaseUrl}`)
  console.log()

  const prompt = buildPrompt(opts.spec)

  if (opts.dryRun) {
    console.log('--- SYSTEM PROMPT (first 500 chars) ---')
    console.log(prompt.system.slice(0, 500) + '...')
    console.log('--- USER PROMPT (first 500 chars) ---')
    console.log(prompt.user.slice(0, 500) + '...')
    console.log('\n✅ Dry run complete — no API call made.')
    return
  }

  console.log(`⏳ Calling ${opts.provider} API...`)
  let response

  try {
    switch (opts.provider) {
      case 'anthropic': response = await callAnthropic(model, prompt, opts.apiKey, effectiveBaseUrl); break
      case 'openai':    response = await callOpenAI(model, prompt, opts.apiKey);    break
      case 'ollama':    response = await callOllama(model, prompt);                 break
      case 'groq':      response = await callGroq(model, prompt, opts.apiKey);      break
      case 'mistral':   response = await callMistral(model, prompt, opts.apiKey);   break
      default:
        console.error(`Unknown provider: ${opts.provider}`)
        console.error('Supported: anthropic | openai | ollama | groq | mistral')
        process.exit(1)
    }
  } catch (err) {
    console.error('\n❌ API call failed:', err.message)
    process.exit(1)
  }

  console.log('\n📝 Parsing response and writing files...\n')
  const files = parseFilesFromResponse(response)

  if (files.length === 0) {
    console.warn('⚠️  No files were parsed from the response.')
    console.warn('   Saving raw response to output/raw_response.md for manual inspection.')
    fs.mkdirSync(opts.output, { recursive: true })
    fs.writeFileSync(path.join(opts.output, 'raw_response.md'), response, 'utf8')
    process.exit(1)
  }

  const written = writeFiles(files, opts.output)

  console.log(`\n📦 PRESENTATION READY`)
  console.log(`   Files written : ${written}`)
  console.log(`   Output dir    : ${opts.output}`)
  console.log(`\n   Next steps:`)
  console.log(`   cd ${opts.output}`)
  console.log(`   npm install`)
  console.log(`   npm run dev`)
  console.log(`   → http://localhost:5173\n`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
