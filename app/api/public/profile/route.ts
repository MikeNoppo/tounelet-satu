import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const profileData = await prisma.profileInfo.findMany({
      select: {
        key: true,
        value: true
      }
    })

    const profileMap = profileData.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json(profileMap)
  } catch (error) {
    console.error('Public profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
