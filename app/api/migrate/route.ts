import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/migrate - 从 localStorage 数据迁移到数据库
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { websites, adminPassword } = body

    // 简单的管理员验证
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin password' },
        { status: 401 }
      )
    }

    if (!Array.isArray(websites)) {
      return NextResponse.json(
        { success: false, error: 'Invalid websites data' },
        { status: 400 }
      )
    }

    // 批量插入网站数据
    const migratedWebsites = []
    
    for (const website of websites) {
      try {
        // URL 格式化
        let formattedUrl = website.url?.trim()
        if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
          formattedUrl = 'https://' + formattedUrl
        }

        const created = await prisma.website.create({
          data: {
            name: website.name || 'Untitled',
            url: formattedUrl || 'https://example.com',
            description: website.description || null,
            iconType: 'FAVICON', // 默认使用 favicon
            sortOrder: migratedWebsites.length
          }
        })

        migratedWebsites.push({
          ...created,
          id: created.id.toString()
        })
      } catch (error) {
        console.error('Failed to migrate website:', website, error)
        // 继续处理其他网站
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedWebsites.length} websites`,
      data: migratedWebsites
    })

  } catch (error) {
    console.error('Migration failed:', error)
    return NextResponse.json(
      { success: false, error: 'Migration failed' },
      { status: 500 }
    )
  }
}
