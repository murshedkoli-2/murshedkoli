import { Archivo, Inter, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { Metadata, Viewport } from 'next'
import ToasterProvider from '@/components/ToasterProvider'
import { getPublicProfile, getSettingsMap } from '@/lib/site-data'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, profile] = await Promise.all([getSettingsMap(), getPublicProfile()])
  
  const siteName = (settings.siteName as string) || profile?.name || 'Portfolio'
  const siteDescription = (settings.siteDescription as string) || profile?.description || 'Professional portfolio showcasing projects, skills, and experience.'
  const siteTitle = (settings.siteTitle as string) || `${siteName} | ${siteDescription}`
  const siteKeywords = (settings.siteKeywords as string[] | string) || [
    siteName,
    'web developer',
    'full stack developer',
    'React developer',
    'Next.js developer',
    'TypeScript',
    'portfolio',
  ]

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: Array.isArray(siteKeywords) ? siteKeywords : [siteKeywords],
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: 'technology',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: `${siteName} — Portfolio`,
      title: siteTitle,
      description: siteDescription,
      images: [
        {
          url: profile?.heroImage || '/image.png',
          width: 1200,
          height: 630,
          alt: `${siteName} — Full Stack Web Developer`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [profile?.heroImage || '/image.png'],
    },
    alternates: {
      canonical: siteUrl,
    },
    icons: {
      icon: '/icon.svg',
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f23',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, profile] = await Promise.all([getSettingsMap(), getPublicProfile()])
  
  const siteName = (settings.siteName as string) || profile?.name || 'Portfolio'
  const siteDescription =
    (settings.siteDescription as string) ||
    profile?.description ||
    'Professional portfolio showcasing projects, skills, and experience.'
  const siteTitle = (settings.siteTitle as string) || `${siteName} | ${siteDescription}`
  const sameAs = profile?.socialLinks
    ? Object.values(profile.socialLinks).filter(Boolean)
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#profile-page`,
        url: siteUrl,
        name: siteTitle,
        description: siteDescription,
        mainEntity: {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: siteName,
          url: siteUrl,
          jobTitle: profile?.title || 'Full Stack Web Developer',
          knowsAbout: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'MongoDB', 'Web Development'],
          sameAs,
          image: profile?.heroImage || `${siteUrl}/image.png`,
          description: profile?.description || siteDescription,
          email: profile?.email ? `mailto:${profile.email}` : undefined,
          telephone: profile?.phone || undefined,
          homeLocation: profile?.location
            ? {
                '@type': 'Place',
                name: profile.location,
              }
            : undefined,
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        publisher: {
          '@id': `${siteUrl}/#person`
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: siteTitle,
        description: siteDescription,
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        about: {
          '@id': `${siteUrl}/#person`,
        },
      }
    ]
  }

  return (
    <html
      lang="en"
      className={`theme-dark ${archivo.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`} suppressHydrationWarning>
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
