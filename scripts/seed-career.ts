import { PrismaClient } from '@prisma/client'
import { INITIAL_CAREER_ROADMAP, generateDefaultTasksForStep } from '../lib/data/career-roadmap'

const prisma = new PrismaClient()

async function main() {
  console.log('Connecting to MongoDB Atlas...')
  const deleted = await prisma.careerStep.deleteMany({})
  console.log(`Deleted ${deleted.count} existing steps.`)

  const dataToInsert = INITIAL_CAREER_ROADMAP.map((item) => ({
    stage: item.stage,
    stageNumber: item.stageNumber,
    stepNumber: item.stepNumber,
    title: item.title,
    category: item.category,
    description: item.description,
    keyConcepts: item.keyConcepts,
    testQuestions: item.testQuestions,
    deliverable: item.deliverable,
    order: item.order,
    status: 'todo',
    tasks: generateDefaultTasksForStep(item),
  }))

  console.log(`Inserting ${dataToInsert.length} milestones with granular micro-topics and sub-tasks...`)
  const result = await (prisma as any).careerStep.createMany({
    data: dataToInsert,
  })

  console.log(`Successfully seeded ${result.count} career milestones!`)

  const totalMicroTopics = dataToInsert.reduce((acc, curr) => acc + (curr.keyConcepts?.length || 0), 0)
  const totalQuestions = dataToInsert.reduce((acc, curr) => acc + (curr.testQuestions?.length || 0), 0)
  const totalTasks = dataToInsert.reduce((acc, curr) => acc + (curr.tasks?.length || 0), 0)

  console.log(`Total Interview Micro-Topics: ${totalMicroTopics}`)
  console.log(`Total Technical Challenge Questions: ${totalQuestions}`)
  console.log(`Total Sub-Tasks & Exam Challenges: ${totalTasks}`)
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
