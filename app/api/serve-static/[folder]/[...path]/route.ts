import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { folder: string; path: string[] } }
) {
  try {
    const { folder, path } = params
    const filePath = join(process.cwd(), 'public', folder, ...path)
    
    // Security check: ensure the resolved path is within the public directory
    const publicDir = join(process.cwd(), 'public')
    if (!filePath.startsWith(publicDir)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Read and serve the file
    const fileBuffer = await readFile(filePath)
    
    // Determine content type based on file extension
    const ext = filePath.split('.').pop()?.toLowerCase()
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
    }
    
    const contentType = contentTypeMap[ext || ''] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving static file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
