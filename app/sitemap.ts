import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://murshedkoli.com'
    
    let projectsSitemap: MetadataRoute.Sitemap = []
    
    try {
        const projects = await prisma.project.findMany({
            where: {
                publishStatus: 'published',
            },
            select: {
                slug: true,
                updatedAt: true,
            }
        })
        
        projectsSitemap = projects.map((project) => ({
            url: `${baseUrl}/projects/${project.slug}`,
            lastModified: project.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.8,
        }))
    } catch (error) {
        console.error('Error fetching projects for sitemap:', error)
    }

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/travels`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        ...projectsSitemap,
    ]
}
