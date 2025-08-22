import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { IconType } from '@prisma/client'

// GET /api/websites/[id] - 获取单个网站
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const website = await prisma.website.findUnique({
      where: { id: BigInt(id) }
    })

    if (!website) {
      return NextResponse.json(
        { success: false, error: 'Website not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...website,
        id: website.id.toString()
      }
    })
  } catch (error) {
    console.error('Failed to fetch website:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch website' },
      { status: 500 }
    )
  }
}

// PUT /api/websites/[id] - 更新网站
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, url, description, iconType, customIconPath, sortOrder } = body

    // 基本验证
    if (!name || !url) {
      return NextResponse.json(
        { success: false, error: 'Name and URL are required' },
        { status: 400 }
      )
    }

    // URL 格式化
    let formattedUrl = url.trim()
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl
    }

    // 验证图标类型
    if (iconType && !Object.values(IconType).includes(iconType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid icon type' },
        { status: 400 }
      )
    }

    // 检查网站是否存在
    const existingWebsite = await prisma.website.findUnique({
      where: { id: BigInt(id) }
    })

    if (!existingWebsite) {
      return NextResponse.json(
        { success: false, error: 'Website not found' },
        { status: 404 }
      )
    }

    const updatedWebsite = await prisma.website.update({
      where: { id: BigInt(id) },
      data: {
        name: name.trim(),
        url: formattedUrl,
        description: description?.trim() || null,
        iconType: iconType as IconType || existingWebsite.iconType,
        customIconPath: customIconPath !== undefined ? customIconPath : existingWebsite.customIconPath,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : existingWebsite.sortOrder
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updatedWebsite,
        id: updatedWebsite.id.toString()
      }
    })

  } catch (error) {
    console.error('Failed to update website:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update website' },
      { status: 500 }
    )
  }
}

// DELETE /api/websites/[id] - 删除网站
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 检查网站是否存在
    const existingWebsite = await prisma.website.findUnique({
      where: { id: BigInt(id) }
    })

    if (!existingWebsite) {
      return NextResponse.json(
        { success: false, error: 'Website not found' },
        { status: 404 }
      )
    }

    // 软删除（设置 isActive 为 false）
    await prisma.website.update({
      where: { id: BigInt(id) },
      data: { isActive: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Website deleted successfully'
    })

  } catch (error) {
    console.error('Failed to delete website:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete website' },
      { status: 500 }
    )
  }
}
