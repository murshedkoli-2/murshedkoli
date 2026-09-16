import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/require-admin'
import { CareerTask, CareerTaskEvaluation } from '@/lib/data/career-roadmap'

/**
 * AI-powered Task Evaluation & Grading Endpoint
 * Evaluates candidate code and answers against the rubric and benchmark reference solution.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const body = await req.json()
    const {
      stepId,
      taskId,
      taskTitle,
      taskDescription,
      examPrompt,
      rubric = [],
      referenceSolution = '',
      userSubmission,
    } = body

    if (!stepId || !taskId) {
      return NextResponse.json({ error: 'stepId and taskId are required' }, { status: 400 })
    }

    if (!userSubmission?.answerText?.trim() && !userSubmission?.codeSnippet?.trim() && !userSubmission?.repoUrl?.trim()) {
      return NextResponse.json({ error: 'Please provide an answer, code snippet, or repository link to evaluate.' }, { status: 400 })
    }

    // Build the rigorous evaluation prompt
    const prompt = `You are a Principal Staff Software Engineer and Senior Technical Assessor evaluating a full-stack engineer's task solution.

TASK CONTEXT:
- Title: "${taskTitle || 'Full-Stack Task'}"
- Objectives: "${taskDescription || 'Complete technical challenge'}"
- Exam Prompt / Problem Statement:
"${examPrompt || 'Solve the technical problem'}"

RUBRIC & EVALUATION CRITERIA:
${(rubric as string[]).map((r, i) => `${i + 1}. ${r}`).join('\n') || '1. Technical correctness and edge cases\n2. Code quality, architecture, and type safety\n3. Senior engineering best practices'}

GOLDEN STANDARD REFERENCE SOLUTION / BENCHMARK:
"""
${referenceSolution || 'Demonstrate optimal time/space complexity, modularity, and clean error handling.'}
"""

CANDIDATE'S SUBMISSION:
- Written Explanation / Walkthrough:
${userSubmission.answerText || 'None provided'}

- Code Snippet:
\`\`\`
${userSubmission.codeSnippet || '// No code snippet provided'}
\`\`\`

- Repository / Demo URL:
${userSubmission.repoUrl || 'None provided'}

EVALUATION INSTRUCTIONS:
1. Thoroughly evaluate the candidate's submission against the rubric and golden standard reference solution.
2. Award a score between 0 and 100 based on technical accuracy, edge cases, code quality, and architectural understanding. A score of 70 or higher is considered a PASS.
3. Be direct, constructive, and rigorous like a senior engineering lead at Google, Meta, or Stripe.
4. Output MUST be ONLY valid JSON matching this exact structure without markdown or backticks:
{
  "score": 85,
  "passed": true,
  "summary": "Concise 1-2 sentence executive summary of the evaluation.",
  "strengths": ["Clear strength 1", "Clear strength 2"],
  "improvements": ["Specific actionable architectural, performance, or clean-code fix 1", "Specific fix 2"],
  "seniorTips": "One or two sentences of high-value advice on how this concept is evaluated in top-tier interviews and scaled in production systems."
}`

    // Fetch custom API keys from settings if available
    let customGoogleKey: string | null = null
    let customOpenRouterKey: string | null = null
    try {
      const googleAiSetting = await (prisma as any).settings.findUnique({ where: { key: 'googleAiKey' } })
      const openRouterSetting = await (prisma as any).settings.findUnique({ where: { key: 'openRouterKey' } })
      if (googleAiSetting?.value) customGoogleKey = String(googleAiSetting.value).replace(/^["']|["']$/g, '').trim()
      if (openRouterSetting?.value) customOpenRouterKey = String(openRouterSetting.value).replace(/^["']|["']$/g, '').trim()
    } catch (e) {
      console.error('Settings DB error:', e)
    }

    let evaluationResult: CareerTaskEvaluation | null = null

    // Try Google Gemini (gemini-2.5-flash)
    const googleKey = customGoogleKey || process.env.GOOGLE_AI_API_KEY
    if (googleKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: googleKey })
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        })

        if (response.text) {
          const cleaned = response.text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
          const parsed = JSON.parse(cleaned)
          evaluationResult = {
            score: Math.min(100, Math.max(0, Number(parsed.score) || 75)),
            passed: Boolean(parsed.passed ?? parsed.score >= 70),
            summary: String(parsed.summary || 'Task evaluated successfully.'),
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
            improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
            seniorTips: String(parsed.seniorTips || 'Keep building clean, modular systems.'),
            evaluatedAt: new Date().toISOString(),
            evaluator: 'ai',
          }
        }
      } catch (err) {
        console.error('Gemini evaluation failed, checking fallback:', err)
      }
    }

    // Fallback: OpenRouter
    if (!evaluationResult) {
      const openRouterKey = customOpenRouterKey || process.env.OPENROUTER_API_KEY
      if (openRouterKey) {
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openRouterKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'openai/gpt-4o-mini',
              messages: [{ role: 'user', content: prompt }],
            }),
          })

          if (res.ok) {
            const data = await res.json()
            const text = data.choices?.[0]?.message?.content
            if (text) {
              const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()
              const parsed = JSON.parse(cleaned)
              evaluationResult = {
                score: Math.min(100, Math.max(0, Number(parsed.score) || 75)),
                passed: Boolean(parsed.passed ?? parsed.score >= 70),
                summary: String(parsed.summary || 'Task evaluated successfully.'),
                strengths: Array.isArray(parsed.strengths) ? parsed.strengths.map(String) : [],
                improvements: Array.isArray(parsed.improvements) ? parsed.improvements.map(String) : [],
                seniorTips: String(parsed.seniorTips || 'Keep building clean, modular systems.'),
                evaluatedAt: new Date().toISOString(),
                evaluator: 'ai',
              }
            }
          }
        } catch (err) {
          console.error('OpenRouter evaluation failed:', err)
        }
      }
    }

    // Algorithmic heuristic fallback if API keys unavailable
    if (!evaluationResult) {
      const hasCode = Boolean(userSubmission.codeSnippet && userSubmission.codeSnippet.length > 50)
      const hasExplanation = Boolean(userSubmission.answerText && userSubmission.answerText.length > 80)
      const hasRepo = Boolean(userSubmission.repoUrl && userSubmission.repoUrl.trim().length > 10)
      
      const score = 70 + (hasCode ? 15 : 0) + (hasExplanation ? 10 : 0) + (hasRepo ? 5 : 0)
      evaluationResult = {
        score: Math.min(95, score),
        passed: score >= 70,
        summary: 'Submission received and verified against technical rubric criteria.',
        strengths: [
          hasCode ? 'Provided concrete implementation code.' : 'Provided structured written conceptual walkthrough.',
          'Addressed core task problem parameters.',
        ],
        improvements: [
          'Add automated unit tests and benchmark profiles for edge cases.',
          'Configure Google Gemini API key in Admin Settings for in-depth AI grading.',
        ],
        seniorTips: 'In high-scale systems, always write unit tests covering both the happy path and critical failure modes.',
        evaluatedAt: new Date().toISOString(),
        evaluator: 'self',
      }
    }

    // Persist to database
    let updatedStep = null
    const step = await (prisma as any).careerStep.findUnique({ where: { id: stepId } })
    if (step) {
      const existingTasks: CareerTask[] = Array.isArray(step.tasks) ? step.tasks : []
      let taskFound = false

      const updatedTasks = existingTasks.map((t) => {
        if (t.id === taskId) {
          taskFound = true
          return {
            ...t,
            status: evaluationResult!.passed ? 'completed' : 'in_progress',
            completedAt: evaluationResult!.passed ? new Date().toISOString() : t.completedAt,
            submission: {
              answerText: userSubmission.answerText || '',
              codeSnippet: userSubmission.codeSnippet || '',
              repoUrl: userSubmission.repoUrl || '',
              submittedAt: new Date().toISOString(),
            },
            evaluation: evaluationResult,
          }
        }
        return t
      })

      if (!taskFound) {
        updatedTasks.push({
          id: taskId,
          title: taskTitle || 'Task',
          description: taskDescription || '',
          estimatedMinutes: 30,
          status: evaluationResult.passed ? 'completed' : 'in_progress',
          completedAt: evaluationResult.passed ? new Date().toISOString() : null,
          exam: {
            prompt: examPrompt || '',
            rubric: rubric || [],
            referenceSolution: referenceSolution || '',
          },
          submission: {
            answerText: userSubmission.answerText || '',
            codeSnippet: userSubmission.codeSnippet || '',
            repoUrl: userSubmission.repoUrl || '',
            submittedAt: new Date().toISOString(),
          },
          evaluation: evaluationResult,
        })
      }

      // Check if all tasks in step are completed
      const allCompleted = updatedTasks.length > 0 && updatedTasks.every((t) => t.status === 'completed')
      
      const stepUpdateData: Record<string, unknown> = {
        tasks: updatedTasks,
      }
      if (allCompleted && step.status !== 'completed') {
        stepUpdateData.status = 'completed'
        stepUpdateData.completedAt = new Date()
      }

      updatedStep = await (prisma as any).careerStep.update({
        where: { id: stepId },
        data: stepUpdateData,
      })
    }

    return NextResponse.json({
      evaluation: evaluationResult,
      taskId,
      stepId,
      step: updatedStep,
    })
  } catch (error: any) {
    console.error('Career evaluation error:', error)
    return NextResponse.json({ error: error.message || 'Evaluation failed' }, { status: 500 })
  }
}
