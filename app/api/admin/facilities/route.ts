import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const
          }
        }
      : {}

    const facilities = await prisma.facility.findMany({
      where,
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, imageUrl } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const facility = await prisma.facility.create({
      data: {
        name: name.trim(),
        description: description || null,
        imageUrl: imageUrl || null
      }
    })

    revalidatePath('/sarana-prasarana')
    revalidatePath('/admin/sarana')

    return NextResponse.json(facility, { status: 201 })
  } catch (error) {
    console.error('Facility creation error:', error)
    return NextResponse.json({ error: 'Failed to create facility' }, { status: 500 })
  }
}
