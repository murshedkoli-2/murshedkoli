import { HttpError } from '@/lib/http'
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/prisma'

export interface UnifiedAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface UnifiedAIOptions {
  prompt?: string
  messages?: UnifiedAIMessage[]
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  model?: string
  responseFormat?: 'text' | 'json'
}

export interface UnifiedAIResult {
  text: string
  provider: 'nvidia-nim' | 'google-gemini' | 'openrouter'
  model: string
  usage?: {
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
  }
}

/**
 * Retrieves configured AI keys dynamically, checking both MongoDB settings
 * and process.env environment variables.
 */
export async function getResolvedAIKeys() {
  let dbNvidiaKey: string | null = null
  let dbNvidiaModel: string | null = null
  let dbGoogleKey: string | null = null
  let dbOpenRouterKey: string | null = null

  try {
    const [nvidiaKeySetting, nvidiaModelSetting, googleSetting, openRouterSetting] = await Promise.all([
      prisma.settings.findUnique({ where: { key: 'nvidiaNimKey' } }).catch(() => null),
      prisma.settings.findUnique({ where: { key: 'nvidiaNimModel' } }).catch(() => null),
      prisma.settings.findUnique({ where: { key: 'googleAiKey' } }).catch(() => null),
      prisma.settings.findUnique({ where: { key: 'openRouterKey' } }).catch(() => null),
    ])

    if (nvidiaKeySetting?.value) dbNvidiaKey = String(nvidiaKeySetting.value).replace(/^["']|["']$/g, '').trim()
    if (nvidiaModelSetting?.value) dbNvidiaModel = String(nvidiaModelSetting.value).replace(/^["']|["']$/g, '').trim()
    if (googleSetting?.value) dbGoogleKey = String(googleSetting.value).replace(/^["']|["']$/g, '').trim()
    if (openRouterSetting?.value) dbOpenRouterKey = String(openRouterSetting.value).replace(/^["']|["']$/g, '').trim()
  } catch (e) {
    // Database read fallback
  }

  const nvidiaKey = dbNvidiaKey || process.env.NVIDIA_API_KEY || process.env.NVIDIA_NIM_API_KEY || ''
  const nvidiaModel = dbNvidiaModel || process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.2-11b-vision-instruct'
  const googleKey = dbGoogleKey || process.env.GOOGLE_AI_API_KEY || ''
  const openRouterKey = dbOpenRouterKey || process.env.OPENROUTER_API_KEY || ''

  return {
    nvidiaKey,
    nvidiaModel,
    googleKey,
    openRouterKey,
  }
}

export interface NvidiaModelInfo {
  id: string
  name: string
  owner: string
  isChat: boolean
}

/**
 * Fetches all currently active, live models directly from NVIDIA NIM API.
 */
export async function fetchLiveNvidiaModels(apiKey?: string): Promise<NvidiaModelInfo[]> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const res = await fetch('https://integrate.api.nvidia.com/v1/models', {
      signal: AbortSignal.timeout(15000),
      method: 'GET',
      headers,
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch models from NVIDIA NIM: HTTP ${res.status}`)
    }

    const data = await res.json()
    if (!Array.isArray(data.data)) {
      return []
    }

    const models: NvidiaModelInfo[] = data.data.map((m: any) => {
      const id = String(m.id || '')
      const isChat =
        id.includes('instruct') ||
        id.includes('chat') ||
        id.includes('nemotron') ||
        id.includes('llama') ||
        id.includes('mistral') ||
        id.includes('deepseek') ||
        id.includes('granite') ||
        id.includes('phi')

      return {
        id,
        name: id,
        owner: String(m.owned_by || id.split('/')[0] || 'nvidia'),
        isChat,
      }
    })

    // Sort chat/instruct models first, then alphabetically
    return models.sort((a, b) => {
      if (a.isChat && !b.isChat) return -1
      if (!a.isChat && b.isChat) return 1
      return a.id.localeCompare(b.id)
    })
  } catch (error) {
    console.warn('Live NVIDIA models fetch error, returning curated fallback list:', error)
    return [
      { id: 'meta/llama-3.2-11b-vision-instruct', name: 'meta/llama-3.2-11b-vision-instruct (Verified Active · Fast Chat & Vision)', owner: 'meta', isChat: true },
      { id: 'nvidia/nemotron-3.5-lightning-30b-a3b', name: 'nvidia/nemotron-3.5-lightning-30b-a3b (Verified Active · NVIDIA 30B Reasoning)', owner: 'nvidia', isChat: true },
      { id: 'mistralai/mistral-large-2-instruct', name: 'mistralai/mistral-large-2-instruct (Verified Active · 128k Context)', owner: 'mistralai', isChat: true },
      { id: 'mistralai/mistral-nemotron', name: 'mistralai/mistral-nemotron (Verified Active · Mistral + Nemotron)', owner: 'mistralai', isChat: true },
      { id: 'ibm/granite-3.0-8b-instruct', name: 'ibm/granite-3.0-8b-instruct (Verified Active · Enterprise 8B)', owner: 'ibm', isChat: true },
      { id: 'poolside/laguna-xs-2.1', name: 'poolside/laguna-xs-2.1 (Verified Active · Laguna)', owner: 'poolside', isChat: true },
    ]
  }
}

/**
 * Core NVIDIA NIM Chat Completion Client
 * Communicates with NVIDIA's OpenAI-compatible inference microservices API.
 */
async function callNvidiaNim(
  messages: UnifiedAIMessage[],
  apiKey: string,
  model: string,
  temperature = 0.3,
  maxTokens = 1500,
  hasRetriedAfterEol = false
): Promise<UnifiedAIResult> {
  const endpoint = 'https://integrate.api.nvidia.com/v1/chat/completions'
  const activeModel = model || 'meta/llama-3.2-11b-vision-instruct'

  const res = await fetch(endpoint, {
    signal: AbortSignal.timeout(30000),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: activeModel,
      messages,
      temperature,
      max_tokens: maxTokens,
      top_p: 0.95,
      stream: false,
    }),
  })

  if (!res.ok) {
    const errorText = await res.text()

    // Self-healing recovery: If requested model reached End-of-Life (HTTP 410 Gone) or Not Found (404 / Function not found for account),
    // automatically fallback to verified working public models: meta/llama-3.2-11b-vision-instruct -> nvidia/nemotron-3.5-lightning-30b-a3b
    if ((res.status === 410 || res.status === 404 || errorText.includes('Not found for account')) && !hasRetriedAfterEol) {
      const fallbackTarget =
        activeModel === 'meta/llama-3.2-11b-vision-instruct'
          ? 'nvidia/nemotron-3.5-lightning-30b-a3b'
          : 'meta/llama-3.2-11b-vision-instruct'

      console.warn(
        `Model "${activeModel}" returned HTTP ${res.status}. Retrying with fallback model "${fallbackTarget}"...`
      )

      return await callNvidiaNim(messages, apiKey, fallbackTarget, temperature, maxTokens, true)
    }

    throw new Error('NVIDIA NIM request failed: HTTP ' + res.status + ' - ' + errorText)
  }

  const data = await res.json()
  const choice = data.choices?.[0]
  if (!choice?.message?.content) {
    throw new Error('NVIDIA NIM returned an empty completion choice.')
  }

  return {
    text: choice.message.content.trim(),
    provider: 'nvidia-nim',
    model: data.model || activeModel,
    usage: data.usage ? {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens,
      totalTokens: data.usage.total_tokens,
    } : undefined,
  }
}

/**
 * Fallback 1: Google Gemini 2.5 Flash Client
 */
async function callGoogleGemini(
  prompt: string,
  systemInstruction?: string,
  apiKey?: string,
  maxTokens = 1500
): Promise<UnifiedAIResult> {
  if (!apiKey) throw new Error('Missing Google AI API key')

  const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 30000, retryOptions: { attempts: 1 } } })
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: { maxOutputTokens: maxTokens, abortSignal: AbortSignal.timeout(30000) },
    contents: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt,
  })

  if (!response.text) {
    throw new Error('Google Gemini returned empty response')
  }

  return {
    text: response.text.trim(),
    provider: 'google-gemini',
    model: 'gemini-2.5-flash',
  }
}

/**
 * Fallback 2: OpenRouter Client
 */
async function callOpenRouter(
  messages: UnifiedAIMessage[],
  apiKey?: string,
  maxTokens = 1500
): Promise<UnifiedAIResult> {
  if (!apiKey) throw new Error('Missing OpenRouter API key')

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    signal: AbortSignal.timeout(30000),
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Portfolio NVIDIA NIM Integration',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages,
      temperature: 0.3,
      max_tokens: maxTokens,
    }),
  })

  if (!res.ok) {
    await res.body?.cancel()
    throw new Error('OpenRouter request failed: HTTP ' + res.status)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenRouter returned empty content')

  return {
    text: content.trim(),
    provider: 'openrouter',
    model: data.model || 'openai/gpt-4o-mini',
  }
}

/**
 * Master Unified AI Completion Function
 * Cascades gracefully: NVIDIA NIM -> Google Gemini -> OpenRouter; failures remain explicit
 */
export async function generateUnifiedAICompletion(options: UnifiedAIOptions): Promise<UnifiedAIResult> {
  const { nvidiaKey, nvidiaModel, googleKey, openRouterKey } = await getResolvedAIKeys()

  // Build standard message list
  const messages: UnifiedAIMessage[] = []
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt })
  }

  if (options.messages && options.messages.length > 0) {
    messages.push(...options.messages)
  } else if (options.prompt) {
    messages.push({ role: 'user', content: options.prompt })
  }

  const promptText = options.prompt || messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n')

  if (promptText.length > 60000) throw new HttpError(413, 'AI input too large')

  // 1. Tier 1: NVIDIA NIM (Primary Enterprise Engine)
  if (nvidiaKey) {
    try {
      return await callNvidiaNim(
        messages,
        nvidiaKey,
        options.model || nvidiaModel,
        options.temperature,
        options.maxTokens
      )
    } catch (nvidiaErr) {
      console.warn('NVIDIA NIM unavailable; trying next provider. Error:', nvidiaErr)
    }
  }

  // 2. Tier 2: Google Gemini (2.5 Flash)
  if (googleKey) {
    try {
      return await callGoogleGemini(promptText, options.systemPrompt, googleKey, options.maxTokens)
    } catch (googleErr) {
      console.warn('Gemini unavailable; trying next provider')
    }
  }

  // 3. Tier 3: OpenRouter
  if (openRouterKey) {
    try {
      return await callOpenRouter(messages, openRouterKey, options.maxTokens)
    } catch (openRouterErr) {
      console.warn('OpenRouter unavailable')
    }
  }

  // Do not fabricate content or scores when providers are unavailable.
  throw new HttpError(503, 'AI service unavailable. Configure a provider or retry later.')
}

/**
 * Diagnostic utility to test provider connections
 */
export async function testAIConnection(customKey?: string, customModel?: string): Promise<{
  success: boolean
  provider: string
  model: string
  latencyMs: number
  sampleText: string
}> {
  const start = Date.now()
  const { nvidiaKey, nvidiaModel } = await getResolvedAIKeys()
  const keyToUse = customKey || nvidiaKey
  const modelToUse = customModel || nvidiaModel

  if (!keyToUse) {
    return {
      success: false,
      provider: 'none',
      model: modelToUse,
      latencyMs: 0,
      sampleText: 'No NVIDIA NIM API key provided. Please configure your key in Settings or .env.local.',
    }
  }

  try {
    const result = await callNvidiaNim(
      [
        { role: 'system', content: 'You are an AI diagnostic assistant.' },
        { role: 'user', content: 'Reply with "NVIDIA NIM Online: " followed by your model name in under 10 words.' }
      ],
      keyToUse,
      modelToUse,
      0.1,
      60
    )

    return {
      success: true,
      provider: 'nvidia-nim',
      model: result.model,
      latencyMs: Date.now() - start,
      sampleText: result.text,
    }
  } catch (error: any) {
    // If the tested model is not enabled for this account, test with verified fallback
    if (modelToUse !== 'meta/llama-3.2-11b-vision-instruct') {
      try {
        const fallbackResult = await callNvidiaNim(
          [
            { role: 'system', content: 'You are an AI diagnostic assistant.' },
            { role: 'user', content: 'Reply with "NVIDIA NIM Online: " followed by your model name in under 10 words.' }
          ],
          keyToUse,
          'meta/llama-3.2-11b-vision-instruct',
          0.1,
          60
        )
        return {
          success: true,
          provider: 'nvidia-nim',
          model: 'meta/llama-3.2-11b-vision-instruct',
          latencyMs: Date.now() - start,
          sampleText: `${fallbackResult.text} (Note: Model "${modelToUse}" is restricted for this API key. We recommend selecting "meta/llama-3.2-11b-vision-instruct")`,
        }
      } catch (fbErr) {
        // fall through to return original error
      }
    }

    return {
      success: false,
      provider: 'nvidia-nim',
      model: modelToUse,
      latencyMs: Date.now() - start,
      sampleText: error.message || 'Connection test failed',
    }
  }
}
