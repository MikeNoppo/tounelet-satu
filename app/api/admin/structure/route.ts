import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const members = await prisma.structureMember.findMany({
      include: {
        parent: true,
        children: true
      },
      orderBy: [
        { urutan: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Check if there are unpublished changes
    const metadata = await prisma.structureMetadata.findFirst()

    return NextResponse.json({ 
      members,
      hasUnpublished: metadata?.hasUnpublished ?? false,
      lastPublishedAt: metadata?.lastPublishedAt
    })
  } catch (error) {
    console.error('Structure fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch structure' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jabatan, nama, nip, fotoUrl, parentId, urutan, positionX, positionY } = await request.json()

    if (!jabatan || !nama) {
      return NextResponse.json({ error: 'Jabatan and nama are required' }, { status: 400 })
    }

    const normalizedParentId = parentId && parentId !== '' ? String(parentId) : null

    const maxUrutan = await prisma.structureMember.aggregate({
      _max: { urutan: true },
      where: { parentId: normalizedParentId }
    })

    const member = await prisma.structureMember.create({
      data: {
        jabatan,
        nama: nama.trim(),
        nip: nip?.trim() || null,
        fotoUrl: fotoUrl || null,
        parentId: normalizedParentId,
        positionX: positionX ?? 0,
        positionY: positionY ?? 0,
        urutan: urutan ?? ((maxUrutan._max?.urutan ?? 0) + 1),
      },
      include: {
        parent: true
      }
    })

    // Mark as having unpublished changes
    await prisma.structureMetadata.upsert({
      where: { id: 1 },
      update: { hasUnpublished: true },
      create: { id: 1, hasUnpublished: true }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/struktur')

    return NextResponse.json(member)
  } catch (error) {
    console.error('Structure create error:', error)
    return NextResponse.json({ error: 'Failed to create structure member' }, { status: 500 })
  }
}
