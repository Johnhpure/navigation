import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { IconType } from '@prisma/client'

// GET /api/websites - 获取所有网站
export async function GET() {
  try {
    const websites = await prisma.website.findMany({
      where: { isActive: true },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // 转换 BigInt 为字符串以便 JSON 序列化
    const serializedWebsites = websites.map(website => ({
      ...website,
      id: website.id.toString()
    }))

    return NextResponse.json({
      success: true,
      data: serializedWebsites
    })
  } catch (error) {
    console.error('Failed to fetch websites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch websites' },
      { status: 500 }
    )
  }
}

// POST /api/websites - 创建新网站
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, description, iconType = 'FAVICON', customIconPath, sortOrder = 0 } = body

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
    console.log('Received iconType:', iconType)
    console.log('Available IconType values:', Object.values(IconType))
    console.log('Type of iconType:', typeof iconType)
    
    if (!Object.values(IconType).includes(iconType)) {
      return NextResponse.json(
        { success: false, error: `Invalid icon type: ${iconType}. Available types: ${Object.values(IconType).join(', ')}` },
        { status: 400 }
      )
    }

    const website = await prisma.website.create({
      data: {
        name: name.trim(),
        url: formattedUrl,
        description: description?.trim() || null,
        iconType: iconType as IconType,
        customIconPath: customIconPath || null,
        sortOrder: parseInt(sortOrder) || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...website,
        id: website.id.toString()
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to create website:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create website' },
      { status: 500 }
    )
  }
}
