import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(facilities)
  } catch (error) {
    console.error('Facilities fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 })
  }
}
