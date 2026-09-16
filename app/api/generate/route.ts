import { NextResponse } from 'next/server'
import { generateUnifiedAICompletion } from '@/lib/ai/nvidia-nim'

export async function POST(req: Request) {
  try {
    const { field, contextData } = await req.json()

    if (!field) {
      return NextResponse.json({ error: 'Field is required' }, { status: 400 })
    }

    let systemPrompt = 'You are a staff-level technical copywriter and senior software architect. Provide punchy, modern, tech-forward, and authoritative output without conversational fluff.'
    let prompt = ''
    let temperature = 0.4
    let maxTokens = 1200

    switch (field) {
      case 'project-description':
        prompt = `Write an engaging, professional, and concise 2-3 paragraph description for a software project named "${contextData.title}". ${contextData.tech ? 'It uses: ' + contextData.tech + '.' : ''} ${contextData.type ? 'Type: ' + contextData.type + '.' : ''} Emphasize the problem it solves, architecture, and technical excellence. Do not use markdown headers, just plain text or simple paragraphs.`
        break
      case 'project-seo':
        prompt = `Write a concise 150-160 character SEO meta description for a software project named "${contextData.title}". Make it click-worthy, modern, and professional.`
        maxTokens = 150
        break
      case 'project-title':
        prompt = `Enhance the project title "${contextData.title || ''}" to be catchy and professional. Output ONLY the title (max 5 words) with no quotes.`
        maxTokens = 60
        break
      case 'project-readme':
        prompt = `Generate a clean, professional GitHub README section for "${contextData.title}". Stack: ${contextData.tech || 'Full Stack'}. Include: Overview, Architecture Highlights, Key Features, and Tech Stack. Format with clean GitHub Markdown.`
        maxTokens = 1500
        break
      case 'experience-description':
        prompt = `Expand the following bullet points into a professional, cohesive 2-3 paragraph experience summary for a "${contextData.position}" role at "${contextData.company}". Make it sound impactful and results-oriented using the STAR method with metrics. Context: ${contextData.currentDesc || 'General responsibilities'}`
        break
      case 'profile-description':
        prompt = `Write an impactful, professional standard "About Me" biography (about 3-4 sentences long) for a software engineer named ${contextData.name || 'Murshed'}, working as a ${contextData.title || 'Full Stack Developer'}. Make it sound modern, tech-forward, and authoritative.`
        break
      case 'profile-title':
        prompt = `Enhance the professional title "${contextData.title || ''}" for a portfolio hero section. Keep it concise, punchy, and modern (e.g., 'Full-Stack Engineer & Cloud Architect'). Output ONLY the title with no quotes.`
        maxTokens = 50
        break
      case 'education-description':
        prompt = `Write a professional 1-2 sentence description of academic achievements and core CS coursework for a degree in "${contextData.degree || 'Computer Science'}" at "${contextData.institution || 'University'}". Context: ${contextData.currentDesc || ''}`
        break
      case 'certification-description':
        prompt = `Write a concise, professional 1-2 sentence description highlighting the industry value and skills demonstrated by the "${contextData.name || 'Professional'}" certification. Context: ${contextData.currentDesc || ''}`
        break
      case 'service-description':
        prompt = `Write a compelling, client-focused 2-sentence description for a freelance engineering service named "${contextData.title || 'Web Development'}". Focus on high business ROI, speed, reliability, and clean code.`
        break
      case 'service-features':
        prompt = `Generate a list of 4-5 high-value deliverable bullet points for a client purchasing "${contextData.title || 'Custom Full-Stack Development'}". Output as newline-separated items without bullets or numbers.`
        break
      case 'tour-description':
        prompt = `Write an inspiring, vivid 2-3 sentence travel description for visiting "${contextData.destination || 'Destination'}" during "${contextData.season || 'the season'}". Highlight culture, scenery, and adventure.`
        break
      case 'tour-itinerary':
        prompt = `Create a concise 3-day travel itinerary and budget estimate for "${contextData.destination || 'Destination'}" with an approximate budget of $${contextData.budget || '500'}. Keep it structured and practical.`
        break
      case 'about-story':
        prompt = `Craft an authentic, inspiring developer story for ${contextData.name || 'a developer'}, covering their journey from learning code to mastering full-stack systems, engineering mindset, and passion for craft. Context: ${contextData.notes || ''}`
        break
      case 'settings-seo-description':
        prompt = `Write a highly optimized, professional SEO meta description (150-160 characters) for a developer portfolio website named "${contextData.title || 'Portfolio'}". Make it click-worthy and indexable.`
        maxTokens = 160
        break
      default:
        prompt = `Refine and perfectly format the following text for a professional portfolio field named "${field}". Ensure industry-standard capitalization, spelling, and professional tone. If it's a short title or name, output ONLY the refined phrase with no quotes. Context: ${JSON.stringify(contextData)}`
        break
    }

    const result = await generateUnifiedAICompletion({
      prompt,
      systemPrompt,
      temperature,
      maxTokens,
    })

    return NextResponse.json({
      text: result.text,
      provider: result.provider,
      model: result.model,
    })
  } catch (error: any) {
    console.error('API Generate Error:', error)
    return NextResponse.json({ error: error.message || 'AI Generation failed' }, { status: 500 })
  }
}
