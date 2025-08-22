import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return NextResponse.json({
        success: false,
        isAuthenticated: false
      })
    }

    // 验证会话是否存在且未过期
    const session = await prisma.adminSession.findUnique({
      where: { token }
    })

    if (!session || session.expiresAt < new Date()) {
      // 清理过期或无效的 cookie
      cookieStore.delete('admin-token')
      
      // 删除过期会话
      if (session) {
        await prisma.adminSession.delete({
          where: { token }
        })
      }

      return NextResponse.json({
        success: false,
        isAuthenticated: false
      })
    }

    return NextResponse.json({
      success: true,
      isAuthenticated: true
    })

  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json({
      success: false,
      isAuthenticated: false,
      error: 'Verification failed'
    })
  }
}
