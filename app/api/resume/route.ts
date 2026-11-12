import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib'

interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  website?: string
  [key: string]: string | undefined
}

export async function GET() {
  try {
    // Fetch all data
    const [profile, skills, experiences, educations, certifications, projects] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.skill.findMany({ where: { isEnabled: true }, orderBy: { order: 'asc' } }),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.education.findMany({ orderBy: { order: 'asc' } }),
      prisma.certification.findMany({ orderBy: { order: 'asc' } }),
      prisma.project.findMany({
        where: { publishStatus: 'published', featured: true },
        orderBy: { order: 'asc' },
        take: 4
      })
    ])

    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    const PAGE_SIZE: [number, number] = [612, 792] // Letter size
    let page = pdfDoc.addPage(PAGE_SIZE)
    const { width, height } = page.getSize()

    // Embed fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Clean modern colors
    const colors = {
      white: rgb(1, 1, 1),
      black: rgb(0.1, 0.1, 0.1),
      primary: rgb(0.133, 0.4, 0.867),      // #2266dd - Blue
      secondary: rgb(0.4, 0.4, 0.45),        // #666673 - Gray
      lightGray: rgb(0.6, 0.6, 0.63),        // #9999a0
      border: rgb(0.88, 0.88, 0.9),          // #e0e0e6
      accent: rgb(0.2, 0.65, 0.45),          // #33a673 - Green
      bgLight: rgb(0.97, 0.97, 0.98),        // #f8f8fb - Light bg
    }

    // Layout
    const margin = 45
    const contentWidth = width - margin * 2
    let y = height - margin

    // Start a new page when the next block would run into the bottom margin.
    const ensureSpace = (needed: number) => {
      if (y - needed >= margin) return
      page = pdfDoc.addPage(PAGE_SIZE)
      y = height - margin
    }

    // Helper functions
    const drawText = (text: string, font: PDFFont, size: number, color: typeof colors.black, x = margin) => {
      ensureSpace(size + 4)
      page.drawText(text, { x, y, size, font, color })
      y -= size + 4
    }

    const drawCenteredText = (text: string, font: PDFFont, size: number, color: typeof colors.black) => {
      const textWidth = font.widthOfTextAtSize(text, size)
      page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color })
      y -= size + 4
    }

    const drawSectionHeader = (title: string) => {
      // Keep the header with at least a couple of lines of its section.
      ensureSpace(60)
      y -= 8
      page.drawText(title.toUpperCase(), { x: margin, y, size: 11, font: helveticaBold, color: colors.primary })
      y -= 6
      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 1.5,
        color: colors.primary,
      })
      y -= 12
    }

    const wrapText = (text: string, font: PDFFont, size: number, maxWidth: number): string[] => {
      const cleanText = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()
      const words = cleanText.split(' ')
      const lines: string[] = []
      let line = ''

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word
        if (font.widthOfTextAtSize(testLine, size) > maxWidth) {
          if (line) lines.push(line)
          line = word
        } else {
          line = testLine
        }
      }
      if (line) lines.push(line)
      return lines
    }

    // ===== HEADER =====
    // Name
    const name = profile?.name || 'Developer'
    drawCenteredText(name, helveticaBold, 26, colors.black)
    y -= 2

    // Title
    if (profile?.title) {
      drawCenteredText(profile.title, helvetica, 12, colors.secondary)
    }
    y -= 4

    // Contact line
    const contactParts: string[] = []
    if (profile?.email) contactParts.push(profile.email)
    if (profile?.phone) contactParts.push(profile.phone)
    if (profile?.location) contactParts.push(profile.location)

    if (contactParts.length > 0) {
      drawCenteredText(contactParts.join('  |  '), helvetica, 9, colors.lightGray)
    }

    // Social links line
    const socialLinks = profile?.socialLinks as SocialLinks | null
    if (socialLinks) {
      const links: string[] = []
      if (socialLinks.github) links.push('GitHub: ' + socialLinks.github.replace(/^https?:\/\//, ''))
      if (socialLinks.linkedin) links.push('LinkedIn: ' + socialLinks.linkedin.replace(/^https?:\/\//, ''))
      if (links.length > 0) {
        const linksText = links.join('  |  ')
        if (helvetica.widthOfTextAtSize(linksText, 8) < contentWidth) {
          drawCenteredText(linksText, helvetica, 8, colors.lightGray)
        }
      }
    }

    y -= 6
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: colors.border,
    })
    y -= 12

    // ===== SUMMARY =====
    if (profile?.description) {
      drawSectionHeader('Summary')
      const descLines = wrapText(profile.description, helvetica, 10, contentWidth)
      for (const line of descLines) {
        drawText(line, helvetica, 10, colors.secondary)
      }
    }

    // ===== EXPERIENCE =====
    if (experiences.length > 0) {
      drawSectionHeader('Experience')

      for (const exp of experiences) {
        const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const endDate = exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
        const dateRange = `${startDate} - ${endDate}`
        const expLines = wrapText(exp.description, helvetica, 9, contentWidth - 10).slice(0, 3)
        ensureSpace(13 + 12 + expLines.length * 11 + 6)

        // Position
        page.drawText(exp.position, { x: margin, y, size: 11, font: helveticaBold, color: colors.black })
        // Date on right
        const dateWidth = helvetica.widthOfTextAtSize(dateRange, 9)
        page.drawText(dateRange, { x: width - margin - dateWidth, y, size: 9, font: helvetica, color: colors.lightGray })
        y -= 13

        // Company and location
        let companyLine = exp.company
        if (exp.location) companyLine += ` - ${exp.location}`
        page.drawText(companyLine, { x: margin, y, size: 10, font: helvetica, color: colors.primary })
        y -= 12

        // Description
        for (const line of expLines) {
          page.drawText(line, { x: margin + 8, y, size: 9, font: helvetica, color: colors.secondary })
          y -= 11
        }
        y -= 6
      }
    }

    // ===== EDUCATION =====
    if (educations.length > 0) {
      drawSectionHeader('Education')

      for (const edu of educations) {
        const startYear = new Date(edu.startDate).getFullYear()
        const endYear = edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'
        const dateRange = `${startYear} - ${endYear}`

        ensureSpace(27)

        // Degree
        const degree = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`
        page.drawText(degree, { x: margin, y, size: 11, font: helveticaBold, color: colors.black })
        // Date
        const dateWidth = helvetica.widthOfTextAtSize(dateRange, 9)
        page.drawText(dateRange, { x: width - margin - dateWidth, y, size: 9, font: helvetica, color: colors.lightGray })
        y -= 13

        // Institution
        let instLine = edu.institution
        if (edu.gpa) instLine += ` | GPA: ${edu.gpa}`
        page.drawText(instLine, { x: margin, y, size: 10, font: helvetica, color: colors.primary })
        y -= 14
      }
    }

    // ===== SKILLS =====
    if (skills.length > 0) {
      drawSectionHeader('Skills')

      // Group by category
      const skillsByCategory = skills.reduce((acc, skill) => {
        const cat = skill.category || 'Other'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(skill.name)
        return acc
      }, {} as Record<string, string[]>)

      for (const [category, skillNames] of Object.entries(skillsByCategory)) {
        const categoryLabel = `${category.charAt(0).toUpperCase() + category.slice(1)}: `
        const skillsText = skillNames.join(', ')
        ensureSpace(14)

        page.drawText(categoryLabel, { x: margin, y, size: 10, font: helveticaBold, color: colors.black })
        const labelWidth = helveticaBold.widthOfTextAtSize(categoryLabel, 10)

        // Wrap skills if needed
        const availableWidth = contentWidth - labelWidth
        if (helvetica.widthOfTextAtSize(skillsText, 9) <= availableWidth) {
          page.drawText(skillsText, { x: margin + labelWidth, y, size: 9, font: helvetica, color: colors.secondary })
          y -= 14
        } else {
          const skillLines = wrapText(skillsText, helvetica, 9, contentWidth - 15)
          page.drawText(skillLines[0] || '', { x: margin + labelWidth, y, size: 9, font: helvetica, color: colors.secondary })
          y -= 12
          for (const line of skillLines.slice(1)) {
            ensureSpace(12)
            page.drawText(line, { x: margin + 15, y, size: 9, font: helvetica, color: colors.secondary })
            y -= 12
          }
          y -= 2
        }
      }
    }

    // ===== CERTIFICATIONS =====
    if (certifications.length > 0) {
      drawSectionHeader('Certifications')

      for (const cert of certifications) {
        const certDate = new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        ensureSpace(26)

        page.drawText(cert.name, { x: margin, y, size: 10, font: helveticaBold, color: colors.black })
        const dateWidth = helvetica.widthOfTextAtSize(certDate, 9)
        page.drawText(certDate, { x: width - margin - dateWidth, y, size: 9, font: helvetica, color: colors.lightGray })
        y -= 12

        page.drawText(`Issued by ${cert.issuer}`, { x: margin, y, size: 9, font: helvetica, color: colors.secondary })
        y -= 14
      }
    }

    // ===== PROJECTS =====
    if (projects.length > 0) {
      drawSectionHeader('Featured Projects')

      for (const project of projects.slice(0, 3)) {
        const descLines = project.description ? wrapText(project.description, helvetica, 9, contentWidth - 10).slice(0, 2) : []
        ensureSpace(12 + 11 + descLines.length * 11 + 6)

        page.drawText(project.title, { x: margin, y, size: 10, font: helveticaBold, color: colors.black })
        y -= 12

        // Tech stack
        const technologies = project.technologies as string[] | undefined
        if (technologies && technologies.length > 0) {
          const techText = 'Tech: ' + technologies.slice(0, 5).join(', ')
          page.drawText(techText, { x: margin, y, size: 9, font: helvetica, color: colors.secondary })
          y -= 11
        }

        // Short description
        for (const line of descLines) {
          page.drawText(line, { x: margin, y, size: 9, font: helvetica, color: colors.lightGray })
          y -= 11
        }
        y -= 6
      }
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Morshed_al_main_resume.pdf"',
      }
    })
  } catch (error) {
    console.error('Error generating resume PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    )
  }
}
