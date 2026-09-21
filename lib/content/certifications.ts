import { prisma } from '@/lib/prisma'
import { contentRoutes } from '@/lib/content-routes'
import { certificationSchema } from '@/lib/validations/content'
export const handlers = contentRoutes(certificationSchema, {
  list: () => prisma.certification.findMany({  orderBy: [{ date: 'desc' }, { order: 'asc' }] }),
  create: (data) => prisma.certification.create({ data }),
  update: (id, data) => prisma.certification.update({ where: { id }, data }),
  remove: (id) => prisma.certification.delete({ where: { id } }),
})
