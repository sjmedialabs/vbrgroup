import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { connectToDatabase, isMongoDBConfigured } from "@/lib/db"
import { Media } from "@/lib/db/models/media.model"
import { dataStore, generateId } from "@/lib/mock-data"
import { IMAGE_SIZE_LIMITS, type MediaFile } from "@/lib/db/schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get("tenant") || "kisan-plant-technologies"
    const folder = searchParams.get("folder")

    // Try to use database first
    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const query: any = { tenantSlug }
        if (folder) {
          query.folder = folder
        }
        const media = await Media.find(query).sort({ createdAt: -1 }).lean()
        return NextResponse.json({ media, limits: IMAGE_SIZE_LIMITS })
      } catch (dbError) {
        console.error("Database error, falling back to mock data:", dbError)
      }
    }

    // Fallback to mock data
    let media = dataStore.mediaFiles.filter((m) => m.tenantSlug === tenantSlug)
    if (folder) {
      media = media.filter((m) => m.folder === folder)
    }

    return NextResponse.json({ media, limits: IMAGE_SIZE_LIMITS })
  } catch (error) {
    console.error("Get media error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageType = (searchParams.get("type") as keyof typeof IMAGE_SIZE_LIMITS) || "general"
    const folder = searchParams.get("folder") || "uploads"

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const alt = formData.get("alt") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check size limits
    const limits = IMAGE_SIZE_LIMITS[imageType]
    if (file.size > limits.maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size for ${imageType} is ${limits.maxSize / 1024}KB`,
          maxSize: limits.maxSize,
        },
        { status: 400 },
      )
    }

    // Check mime type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG" }, { status: 400 })
    }

    // Save file to filesystem
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const uploadDir = join(process.cwd(), "public", "uploads")
    
    // Ensure upload directory exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (mkdirError) {
      console.error("Failed to create upload directory:", mkdirError)
    }

    const filePath = join(uploadDir, filename)
    await writeFile(filePath, buffer)

    const mediaData = {
      tenantSlug: "kisan-plant-technologies",
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `/uploads/${filename}`,
      alt: alt || file.name,
      folder,
    }

    // Try to save to database first
    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const mediaFile = await Media.create(mediaData)
        return NextResponse.json({
          media: mediaFile,
          limits: IMAGE_SIZE_LIMITS,
        })
      } catch (dbError) {
        console.error("Database error, falling back to mock data:", dbError)
      }
    }

    // Fallback to mock data
    const mediaFile: MediaFile = {
      _id: generateId(),
      ...mediaData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    dataStore.mediaFiles.push(mediaFile)

    return NextResponse.json({
      media: mediaFile,
      limits: IMAGE_SIZE_LIMITS,
    })
  } catch (error) {
    console.error("Upload media error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
