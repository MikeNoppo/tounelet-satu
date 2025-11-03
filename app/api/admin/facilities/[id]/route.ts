import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/upload-utils'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    const { name, description, imageUrl } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const existingFacility = await prisma.facility.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingFacility) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 })
    }

    if (existingFacility.imageUrl && imageUrl && existingFacility.imageUrl !== imageUrl) {
      try {
        await deleteFile(existingFacility.imageUrl)
      } catch (error) {
        console.error('Failed to delete old image:', error)
      }
    }

    const facility = await prisma.facility.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: name.trim(),
        description: description || null,
        imageUrl: imageUrl || null
      }
    })

    revalidatePath('/sarana-prasarana')
    revalidatePath(`/sarana-prasarana/${id}`)
    revalidatePath('/admin/sarana')

    return NextResponse.json(facility)
  } catch (error) {
    console.error('Facility update error:', error)
    return NextResponse.json({ error: 'Failed to update facility' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    
    const facility = await prisma.facility.findUnique({
      where: { id: parseInt(id) }
    })

    if (!facility) {
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 })
    }

    if (facility.imageUrl) {
      try {
        await deleteFile(facility.imageUrl)
      } catch (error) {
        console.error('Failed to delete image:', error)
      }
    }

    await prisma.facility.delete({
      where: {
        id: parseInt(id)
      }
    })

    revalidatePath('/sarana-prasarana')
    revalidatePath('/admin/sarana')

    return NextResponse.json({ message: 'Facility deleted successfully' })
  } catch (error) {
    console.error('Facility deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete facility' }, { status: 500 })
  }
}
