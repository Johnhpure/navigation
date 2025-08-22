import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'

// 允许的图片格式
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon'
]

// 最大文件大小 (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024

export interface UploadResult {
  success: boolean
  filePath?: string
  fileName?: string
  error?: string
}

export async function uploadIcon(file: File): Promise<UploadResult> {
  try {
    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only images are allowed.'
      }
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File too large. Maximum size is 2MB.'
      }
    }

    // 确保上传目录存在
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'icons')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 生成唯一文件名
    const fileExtension = path.extname(file.name) || getExtensionFromMimeType(file.type)
    const uniqueName = `${crypto.randomUUID()}${fileExtension}`
    const filePath = path.join(uploadDir, uniqueName)

    // 保存文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 返回相对路径（用于数据库存储和前端访问）
    const relativePath = `/uploads/icons/${uniqueName}`

    return {
      success: true,
      filePath: relativePath,
      fileName: uniqueName
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Failed to upload file'
    }
  }
}

function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/x-icon': '.ico',
    'image/vnd.microsoft.icon': '.ico'
  }
  
  return mimeToExt[mimeType] || '.png'
}

// 删除文件的辅助函数
export async function deleteUploadedFile(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath)
    if (existsSync(fullPath)) {
      const fs = await import('fs/promises')
      await fs.unlink(fullPath)
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to delete file:', error)
    return false
  }
}
