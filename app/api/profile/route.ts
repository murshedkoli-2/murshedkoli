import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: 'desc' }
    })

    if (!profile) {
      // Return default profile if none exists
      return NextResponse.json({
        name: 'Murshed Koli',
        title: 'Full Stack Developer',
        description: 'Passionate web developer with expertise in modern technologies',
        email: 'murshed@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        socialLinks: {
          github: 'https://github.com/murshedkoli',
          linkedin: 'https://linkedin.com/in/murshedkoli',
          twitter: 'https://twitter.com/murshedkoli'
        }
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if profile exists
    const existingProfile = await prisma.profile.findFirst()

    let profile
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          name: data.name,
          title: data.title,
          description: data.description,
          email: data.email,
          phone: data.phone,
          location: data.location,
          avatar: data.avatar,
          heroImage: data.heroImage,
          heroPortrait: data.heroPortrait,
          storyImage: data.storyImage,
          resume: data.resume,
          socialLinks: data.socialLinks,
        }
      })
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          name: data.name,
          title: data.title,
          description: data.description,
          email: data.email,
          phone: data.phone,
          location: data.location,
          avatar: data.avatar,
          heroImage: data.heroImage,
          heroPortrait: data.heroPortrait,
          storyImage: data.storyImage,
          resume: data.resume,
          socialLinks: data.socialLinks,
        }
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}