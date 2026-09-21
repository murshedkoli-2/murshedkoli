import { z } from 'zod'
import { readAIRequest } from '@/lib/ai/request'
import { apiError } from '@/lib/http'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/require-admin'
import { generateUnifiedAICompletion } from '@/lib/ai/nvidia-nim'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { mode, payload } = z.object({ mode: z.enum(['tour-budget-advisor', 'savings-forecast', 'career-coach']), payload: z.record(z.string(), z.union([z.string().max(8000), z.number().finite(), z.array(z.string().max(2000)).max(30)])).optional() }).parse(await readAIRequest(req, auth.sub))

    if (!mode) {
      return NextResponse.json({ error: 'Advisor mode is required' }, { status: 400 })
    }

    let systemPrompt = 'You are an elite AI Strategic Advisor and Executive Coach specializing in technology career growth, travel optimization, and software engineering finance.'
    let prompt = ''

    switch (mode) {
      case 'tour-budget-advisor': {
        const { destination, budget, savingsBalance, season } = payload || {}
        prompt = `Analyze the travel feasibility for visiting "${destination || 'Unknown Destination'}" during "${season || 'any season'}".
Current Total Savings Balance: $${savingsBalance || 0} USD
Estimated Tour Budget: $${budget || 0} USD

Provide an executive advisory report formatted with clear Markdown headings:
1. **Feasibility Verdict**: Is this tour safely affordable right now without jeopardizing emergency savings?
2. **Daily Budget Breakdown**: Recommended allocation for accommodation, dining, local transport, and activities.
3. **Smart Travel Hacks**: 3 actionable insider tips to maximize travel experience while lowering costs.
4. **Savings Recommendation**: How much additional savings buffer to build before booking flights.`
        break
      }

      case 'savings-forecast': {
        const { currentSavings, monthlySavingsRate, targetGoal, goalTitle } = payload || {}
        prompt = `Perform a financial timeline projection for a developer goal: "${goalTitle || 'Financial Goal'}".
Target Amount: $${targetGoal || 0} USD
Current Savings Balance: $${currentSavings || 0} USD
Estimated Monthly Savings Velocity: $${monthlySavingsRate || 0} USD/month

Provide a strategic financial forecast:
1. **Estimated Completion Date**: Exact calculation of months needed at current velocity.
2. **Accelerated Roadmap**: Concrete suggestions to cut 30% off the timeline by securing high-ticket freelance milestones.
3. **Risk Buffer**: Recommended liquidity reserve for unexpected expenses.`
        break
      }

      case 'career-coach': {
        const { milestoneTitle, microTopics, interviewQuestions } = payload || {}
        prompt = `Act as a Staff Principal Engineer conducting interview coaching for the milestone: "${milestoneTitle}".
Key Micro-Topics to Cover:
${Array.isArray(microTopics) ? microTopics.map((t: string) => `- ${t}`).join('\n') : microTopics}

Technical Challenge Questions:
${Array.isArray(interviewQuestions) ? interviewQuestions.map((q: string) => `- ${q}`).join('\n') : interviewQuestions}

Provide an intense, high-value Technical Cheat-Sheet formatted in clean Markdown:
1. **Core Mental Model & Gotchas**: The 3 trickiest edge cases and misconceptions interviewers use to filter candidates on this topic.
2. **Whiteboard/Live Coding Strategy**: How to structure code cleanly and verbally communicate trade-offs.
3. **Staff-Level Punchline**: One memorable, technically precise insight that wows senior interview panels.`
        break
      }

      default:
        return NextResponse.json({ error: `Unknown advisor mode: ${mode}` }, { status: 400 })
    }

    const result = await generateUnifiedAICompletion({
      prompt,
      systemPrompt,
      temperature: 0.4,
      maxTokens: 1400,
    })

    return NextResponse.json({
      advice: result.text,
      provider: result.provider,
      model: result.model,
    })
  } catch (error) { return apiError(error) }
}
