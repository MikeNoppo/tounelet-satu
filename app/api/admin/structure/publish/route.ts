import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all current structure members
    const currentStructure = await prisma.structureMember.findMany({
      orderBy: [
        { urutan: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Delete all published structure (clear snapshot)
    await prisma.publishedStructure.deleteMany({})

    // Create new snapshot
    await prisma.publishedStructure.createMany({
      data: currentStructure.map(member => ({
        id: member.id,
        jabatan: member.jabatan,
        nama: member.nama,
        nip: member.nip,
        fotoUrl: member.fotoUrl,
        positionX: member.positionX,
        positionY: member.positionY,
        parentId: member.parentId,
        urutan: member.urutan,
      }))
    })

    // Update metadata
    await prisma.structureMetadata.upsert({
      where: { id: 1 },
      update: { 
        hasUnpublished: false,
        lastPublishedAt: new Date()
      },
      create: { 
        id: 1, 
        hasUnpublished: false,
        lastPublishedAt: new Date()
      }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/struktur')

    return NextResponse.json({ 
      success: true, 
      count: currentStructure.length,
      message: `Successfully published ${currentStructure.length} structure member(s)` 
    })
  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json({ error: 'Failed to publish structure' }, { status: 500 })
  }
}
