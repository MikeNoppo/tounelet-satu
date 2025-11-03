import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { deleteFile } from '@/lib/upload-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const deleted = await deleteFile(imageUrl)

    if (deleted) {
      return NextResponse.json({ success: true, message: 'Image deleted successfully' })
    } else {
      return NextResponse.json({ success: false, message: 'Failed to delete image' }, { status: 500 })
    }
  } catch (error) {
    console.error('Delete image error:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
