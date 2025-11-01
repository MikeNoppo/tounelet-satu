import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/upload-utils'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: idParam } = await context.params
    const id = Number(idParam)
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const { url, title, description } = await request.json()

    if (url !== undefined) {
      const currentItem = await prisma.galleryItem.findUnique({
        where: { id }
      })

      if (currentItem?.url && currentItem.url !== url) {
        const localPath = currentItem.url.split('?')[0]
        await deleteFile(localPath)
      }
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(url !== undefined && { url }),
        ...(title !== undefined && { title: title?.trim() || null }),
        ...(description !== undefined && { description: description?.trim() || null })
      }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/galeri')

    return NextResponse.json(item)
  } catch (error) {
    console.error('Gallery update error:', error)
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 })
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

    const { id: idParam } = await context.params
    const id = Number(idParam)
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    const item = await prisma.galleryItem.findUnique({
      where: { id }
    })

    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    if (item.url) {
      const localPath = item.url.split('?')[0]
      await deleteFile(localPath)
    }

    await prisma.galleryItem.delete({
      where: { id }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/galeri')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Gallery delete error:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
