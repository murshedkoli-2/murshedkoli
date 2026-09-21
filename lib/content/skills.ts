import { prisma } from '@/lib/prisma'
import { contentRoutes } from '@/lib/content-routes'
import { skillSchema } from '@/lib/validations/content'
export const handlers = contentRoutes(skillSchema, {
  list: (includeDisabled) => prisma.skill.findMany({ where: includeDisabled ? {} : { isEnabled: true }, orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }] }),
  create: (data) => prisma.skill.create({ data }),
  update: (id, data) => prisma.skill.update({ where: { id }, data }),
  remove: (id) => prisma.skill.delete({ where: { id } }),
})
