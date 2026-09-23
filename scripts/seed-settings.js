const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding settings and profile...\n')

  // Settings to be created/updated
  const settings = [
    {
      key: 'siteName',
      value: 'murshedkoli',
      description: 'The main site name displayed in browser tab and headers'
    },
    {
      key: 'siteTitle',
      value: 'murshedkoli | Full Stack Web Developer & Software Engineer',
      description: 'Full page title for SEO'
    },
    {
      key: 'siteDescription',
      value: 'Professional portfolio of murshedkoli - Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Building scalable and user-friendly applications.',
      description: 'Meta description for SEO'
    },
    {
      key: 'siteKeywords',
      value: [
        'murshedkoli',
        'Full Stack Developer',
        'Web Developer',
        'React Developer',
        'Next.js Developer',
        'Node.js Developer',
        'TypeScript',
        'JavaScript',
        'MongoDB',
        'Portfolio',
        'Software Engineer',
        'Frontend Developer',
        'Backend Developer'
      ],
      description: 'Keywords for SEO'
    },
    {
      key: 'contactEmail',
      value: 'contact@murshedkoli.com',
      description: 'Primary contact email'
    },
    {
      key: 'availableForWork',
      value: true,
      description: 'Whether the developer is available for new opportunities'
    },
    {
      key: 'socialLinks',
      value: {
        github: 'https://github.com/morshedkoli',
        linkedin: 'https://linkedin.com/in/murshedkoli',
        twitter: 'https://twitter.com/murshedkoli',
        facebook: 'https://facebook.com/murshedkoli'
      },
      description: 'Social media profile links'
    },
    {
      key: 'analytics',
      value: {
        googleAnalyticsId: '',
        enabled: true
      },
      description: 'Analytics configuration'
    },
    {
      key: 'theme',
      value: {
        primaryColor: '#3B82F6',
        accentColor: '#8B5CF6',
        darkMode: true
      },
      description: 'Site theme configuration'
    },
    {
      key: 'copyrightText',
      value: 'All rights reserved.',
      description: 'Copyright text displayed in footer'
    }
  ]

  // Upsert all settings
  for (const setting of settings) {
    const result = await prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting
    })
    console.log(`✅ Setting: ${result.key}`)
  }

  console.log('\n📝 Updating profile...\n')

  // Profile data
  const profileData = {
    name: 'murshedkoli',
    title: 'Full Stack Web Developer',
    description: 'Passionate and dedicated Full Stack Developer with expertise in building modern, scalable web applications. Specialized in React, Next.js, Node.js, and cloud technologies. I love creating elegant solutions to complex problems and delivering exceptional user experiences.',
    email: 'contact@murshedkoli.com',
    phone: '+880 1XXXXXXXXX',
    location: 'Bangladesh',
    socialLinks: {
      github: 'https://github.com/morshedkoli',
      linkedin: 'https://linkedin.com/in/murshedkoli',
      twitter: 'https://twitter.com/murshedkoli',
      facebook: 'https://facebook.com/murshedkoli'
    }
  }

  // Check if profile exists and update/create
  const existingProfile = await prisma.profile.findFirst()
  
  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: profileData
    })
    console.log('✅ Profile updated')
  } else {
    await prisma.profile.create({
      data: profileData
    })
    console.log('✅ Profile created')
  }

  console.log('\n🎉 Seeding completed!\n')
}

main()
  .catch((e) => {
    console.error('Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
