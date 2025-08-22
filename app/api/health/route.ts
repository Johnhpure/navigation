import { NextResponse } from 'next/server'
import { checkDBHealth } from '@/lib/db'

export async function GET() {
  try {
    const dbHealth = await checkDBHealth()
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      version: '1.0.0'
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
