import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    const facility = await prisma.facility.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (!facility) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 })
    }

    return NextResponse.json(facility)
  } catch (error) {
    console.error('Facility fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch facility' }, { status: 500 })
  }
}
