import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const postId = parseInt(id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        type: true,
        title: true,
        featuredImage: true,
        body: true,
        date: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const relatedPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        type: post.type,
        id: { not: postId }
      },
      select: {
        id: true,
        type: true,
        title: true,
        featuredImage: true,
        date: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 3
    })

    return NextResponse.json({
      post,
      relatedPosts
    })
  } catch (error) {
    console.error('Public post detail fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
