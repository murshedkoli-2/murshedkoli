import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: [{ date: 'desc' }, { order: 'asc' }]
    })

    return NextResponse.json(certifications)
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Ensure date is a Date object
    const date = new Date(data.date);

    const certification = await prisma.certification.create({
      data: {
        name: data.name,
        issuer: data.issuer,
        date: date,
        url: data.url,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        description: data.description,
        order: data.order || 0
      }
    })

    return NextResponse.json(certification, { status: 201 })
  } catch (error) {
    console.error('Error creating certification:', error)
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Ensure date is a Date object
    if (updateData.date) updateData.date = new Date(updateData.date);

    const certification = await prisma.certification.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(certification)
  } catch (error) {
    console.error('Error updating certification:', error)
    return NextResponse.json(
      { error: 'Failed to update certification' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.certification.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    );
  }
}
