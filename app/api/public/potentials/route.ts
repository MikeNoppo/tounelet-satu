import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [potentials, total] = await Promise.all([
      prisma.potential.findMany({
        select: {
          id: true,
          name: true,
          desc: true,
          emoji: true,
          imageUrl: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.potential.count()
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      items: potentials,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    })
  } catch (error) {
    console.error('Public potentials fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch potentials' }, { status: 500 })
  }
}
