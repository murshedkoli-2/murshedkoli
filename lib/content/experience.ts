import { prisma } from '@/lib/prisma'
import { contentRoutes } from '@/lib/content-routes'
import { experienceSchema } from '@/lib/validations/content'
export const handlers = contentRoutes(experienceSchema, {
  list: () => prisma.experience.findMany({  orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }] }),
  create: (data) => prisma.experience.create({ data }),
  update: (id, data) => prisma.experience.update({ where: { id }, data }),
  remove: (id) => prisma.experience.delete({ where: { id } }),
})
