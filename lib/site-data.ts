import { cached } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

export type SocialLinks = {
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
  facebook?: string
  youtube?: string
}

export type PublicProfile = {
  id?: string
  name: string
  title: string
  description: string
  email: string
  phone?: string | null
  location?: string | null
  avatar?: string | null
  heroImage?: string | null
  resume?: string | null
  socialLinks?: SocialLinks
}

export type PublicSettings = Record<string, unknown>

export const DEFAULT_PROFILE: PublicProfile = {
  name: 'Murshed Koli',
  title: 'Full Stack Developer',
  description: 'Passionate web developer with expertise in modern technologies and AI-powered experiences.',
  email: 'murshed@example.com',
  phone: '+1 (555) 123-4567',
  location: 'Remote',
  socialLinks: {
    github: 'https://github.com/murshedkoli',
    linkedin: 'https://linkedin.com/in/murshedkoli',
    twitter: 'https://twitter.com/murshedkoli',
  },
}

export const getSettingsMap = cached('settings', async (): Promise<PublicSettings> => {
  try {
    const settings = await prisma.settings.findMany()
    return settings.reduce<Record<string, unknown>>((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {})
  } catch (error) {
    console.error('Error fetching settings:', error)
    return {}
  }
})

export const getPublicProfile = cached('public-profile', async (): Promise<PublicProfile> => {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: 'desc' },
    })

    if (!profile) {
      return DEFAULT_PROFILE
    }

    return {
      id: profile.id,
      name: profile.name,
      title: profile.title,
      description: profile.description,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      avatar: profile.avatar,
      heroImage: profile.heroImage,
      resume: profile.resume,
      socialLinks: (profile.socialLinks as SocialLinks | null) || undefined,
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    return DEFAULT_PROFILE
  }
})

export const getHomePageData = cached('homepage-data', async () => {
  try {
    const [
      profile,
      settings,
      skills,
      experiences,
      education,
      certifications,
      projects,
    ] = await Promise.all([
      getPublicProfile(),
      getSettingsMap(),
      prisma.skill.findMany({
        where: { isEnabled: true },
        orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
      }),
      prisma.experience.findMany({
        orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }],
      }),
      prisma.education.findMany({
        orderBy: [{ current: 'desc' }, { startDate: 'desc' }, { order: 'asc' }],
      }),
      prisma.certification.findMany({
        orderBy: [{ date: 'desc' }, { order: 'asc' }],
      }),
      prisma.project.findMany({
        where: { publishStatus: 'published' },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      }),
    ])

    return {
      profile,
      settings,
      skills,
      experiences,
      education,
      certifications,
      projects,
    }
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return {
      profile: DEFAULT_PROFILE,
      settings: {},
      skills: [],
      experiences: [],
      education: [],
      certifications: [],
      projects: [],
    }
  }
})
