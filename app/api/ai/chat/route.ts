import { chatSchema, readAIRequest } from '@/lib/ai/request'
import { apiError } from '@/lib/http'
import { requireAdmin } from '@/lib/auth/require-admin'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateUnifiedAICompletion, UnifiedAIMessage, getResolvedAIKeys } from '@/lib/ai/nvidia-nim'

export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const { nvidiaModel, nvidiaKey } = await getResolvedAIKeys()
    return NextResponse.json({
      activeModel: nvidiaModel || 'nvidia/llama-3.1-nemotron-70b-instruct',
      hasKey: !!nvidiaKey,
    })
  } catch (error) {
    return NextResponse.json({
      activeModel: 'nvidia/llama-3.1-nemotron-70b-instruct',
      hasKey: false,
    })
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const { messages, userQuery, model } = chatSchema.parse(await readAIRequest(req, auth.sub))

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

    const systemPrompt = `You are the private admin assistant for ${devName}. Help the authenticated owner edit portfolio copy and understand their existing projects and skills. Do not invent achievements, availability, seniority, or client results. You cannot publish changes or inspect repository contents.

Key Knowledge Base:
- Developer Name: ${devName}
- Title/Role: ${devTitle}
- Location: ${devLocation}

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
2. Help the owner draft accurate content. Ask for missing facts rather than making claims.
3. Be concise and crisp (2-4 paragraphs max). Use markdown formatting, bullet points, and code formatting where relevant.
4. Address the portfolio owner, not prospective clients.`

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
      model: typeof model === 'string' && model.trim() ? model.trim() : undefined,
    })

    return NextResponse.json({
      reply: aiResponse.text,
      provider: aiResponse.provider,
      model: aiResponse.model,
    })
  } catch (error) { return apiError(error) }
}
