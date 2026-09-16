import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUnifiedAICompletion, UnifiedAIMessage } from '@/lib/ai/nvidia-nim'

export async function POST(req: NextRequest) {
  try {
    const { messages, userQuery } = await req.json()

    if (!userQuery && (!messages || messages.length === 0)) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 })
    }

    // Load portfolio context from database for factual grounding
    const [profile, projects, skills, experiences, services] = await Promise.all([
      prisma.profile.findFirst().catch(() => null),
      prisma.project.findMany({
        where: { publishStatus: 'published' },
        select: {
          title: true,
          description: true,
          technologies: true,
          slug: true,
          demoUrl: true,
          githubUrl: true,
          featured: true,
        },
        take: 8,
        orderBy: { featured: 'desc' },
      }).catch(() => []),
      prisma.skill.findMany({
        where: { isEnabled: true },
        select: { name: true, category: true, proficiency: true },
      }).catch(() => []),
      prisma.experience.findMany({
        select: {
          company: true,
          position: true,
          startDate: true,
          endDate: true,
          current: true,
          description: true,
        },
        take: 4,
        orderBy: { startDate: 'desc' },
      }).catch(() => []),
      prisma.service.findMany({
        where: { isEnabled: true },
        select: { title: true, description: true },
      }).catch(() => []),
    ])

    const devName = profile?.name || 'Murshed'
    const devTitle = profile?.title || 'Full Stack Software Engineer'
    const devLocation = profile?.location || 'Dhaka, Bangladesh (Available Worldwide Remotely)'

    const systemPrompt = `You are the official AI Assistant and Portfolio Copilot for ${devName}, a senior ${devTitle} based in ${devLocation}.
Your role is to represent ${devName} to recruiters, engineering managers, prospective clients, and fellow engineers who visit this portfolio.

Key Knowledge Base:
- Developer Name: ${devName}
- Title/Role: ${devTitle}
- Location & Availability: ${devLocation} — actively open to high-paying international remote roles, B2B SaaS contracts, and high-ticket freelance software projects.
- Core Tech Stack: TypeScript, Next.js 16 (App Router, Server Components & Actions), React 19, Node.js, Express, MongoDB Atlas, PostgreSQL, Prisma ORM, Redis (caching & queues), Docker, WebSockets, Tailwind CSS, System Design, and Cloudflare/AWS.

Featured Projects:
${projects.map((p) => `- ${p.title}: ${p.description || ''} (Tech: ${Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies}) [View: /projects/${p.slug}]`).join('\n')}

Technical Skills Overview:
${skills.map((s) => `- ${s.category}: ${s.name} (${s.proficiency}%)`).join('\n')}

Work Experience:
${experiences
  .map(
    (e) =>
      `- ${e.position} at ${e.company} (${new Date(e.startDate).getFullYear()} - ${
        e.current ? 'Present' : e.endDate ? new Date(e.endDate).getFullYear() : 'N/A'
      }): ${e.description || ''}`
  )
  .join('\n')}

Services & Freelance Capabilities:
${services.map((s) => `- ${s.title}: ${s.description || ''}`).join('\n')}

Guidelines:
1. Tone: Warm, highly articulate, tech-savvy, professional, and confident.
2. If asked about contact or hiring: Direct the visitor to the Contact section on the page (/about or #contact) or encourage them to leave a message.
3. Be concise and crisp (2-4 paragraphs max). Use markdown formatting, bullet points, and code formatting where relevant.
4. Always answer from the perspective of Murshed's personal AI Assistant.`

    // Format conversation history
    const conversationMessages: UnifiedAIMessage[] = []

    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach((m: any) => {
        if (m.role === 'user' || m.role === 'assistant') {
          conversationMessages.push({
            role: m.role,
            content: String(m.content || ''),
          })
        }
      })
    }

    if (userQuery && (!messages || messages[messages.length - 1]?.content !== userQuery)) {
      conversationMessages.push({ role: 'user', content: userQuery })
    }

    const aiResponse = await generateUnifiedAICompletion({
      messages: conversationMessages,
      systemPrompt,
      temperature: 0.5,
      maxTokens: 1000,
    })

    return NextResponse.json({
      reply: aiResponse.text,
      provider: aiResponse.provider,
      model: aiResponse.model,
    })
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      {
        reply: "Hi there! I'm Murshed's AI Assistant. I'm currently running in low-latency standby mode. Feel free to explore his featured projects or reach out directly through the contact section!",
        provider: 'local-heuristic',
        model: 'fallback-greeting',
      },
      { status: 200 }
    )
  }
}
