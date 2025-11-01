import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { uploadFile, deleteFile } from '@/lib/upload-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const key = formData.get('key') as string

    if (!file || !key) {
      return NextResponse.json({ error: 'File and key are required' }, { status: 400 })
    }

    const validKeys = [
      'heroImage',
      'beritaBanner',
      'galeriBanner',
      'potensiBanner',
      'profilBanner',
      'strukturBanner',
      'petaBanner'
    ]

    if (!validKeys.includes(key)) {
      return NextResponse.json({ error: 'Invalid banner key' }, { status: 400 })
    }

    const result = await uploadFile(file, { 
      folder: 'banners',
      customFilename: `${key}-${Date.now()}`
    })

    if (!result.success || !result.url) {
      return NextResponse.json({ error: result.error || 'Upload failed' }, { status: 400 })
    }

    const existingSetting = await prisma.setting.findUnique({
      where: { key }
    })

    if (existingSetting?.value) {
      await deleteFile(existingSetting.value)
    }

    await prisma.setting.upsert({
      where: { key },
      create: { key, value: result.url },
      update: { value: result.url }
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error('Banner upload error:', error)
    return NextResponse.json({ error: 'Failed to upload banner' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const setting = await prisma.setting.findUnique({
      where: { key }
    })

    if (setting?.value) {
      await deleteFile(setting.value)
    }

    await prisma.setting.delete({
      where: { key }
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Banner delete error:', error)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}
