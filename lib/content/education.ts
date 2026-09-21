import { prisma } from '@/lib/prisma'
import { contentRoutes } from '@/lib/content-routes'
import { educationSchema } from '@/lib/validations/content'
export const handlers = contentRoutes(educationSchema, {
  list: () => prisma.education.findMany({  orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }] }),
  create: (data) => prisma.education.create({ data }),
  update: (id, data) => prisma.education.update({ where: { id }, data }),
  remove: (id) => prisma.education.delete({ where: { id } }),
})
