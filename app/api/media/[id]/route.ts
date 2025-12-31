import { type NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { connectToDatabase, isMongoDBConfigured } from "@/lib/db"
import { Media } from "@/lib/db/models/media.model"
import { dataStore } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Try to use database first
    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const media = await Media.findById(id).lean()
        if (!media) {
          return NextResponse.json({ error: "Media not found" }, { status: 404 })
        }
        return NextResponse.json({ media })
      } catch (dbError) {
        console.error("Database error, falling back to mock data:", dbError)
      }
    }

    // Fallback to mock data
    const media = dataStore.mediaFiles.find((m) => m._id === id)

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    return NextResponse.json({ media })
  } catch (error) {
    console.error("Get media error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Try to use database first
    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const media = await Media.findById(id)
        
        if (!media) {
          return NextResponse.json({ error: "Media not found" }, { status: 404 })
        }

        // Delete file from filesystem if it exists in uploads directory
        if (media.url.startsWith("/uploads/")) {
          const filename = media.url.replace("/uploads/", "")
          const filePath = join(process.cwd(), "public", "uploads", filename)
          try {
            await unlink(filePath)
          } catch (fileError) {
            console.error("Failed to delete file:", fileError)
          }
        }

        await Media.findByIdAndDelete(id)
        return NextResponse.json({ success: true })
      } catch (dbError) {
        console.error("Database error, falling back to mock data:", dbError)
      }
    }

    // Fallback to mock data
    const index = dataStore.mediaFiles.findIndex((m) => m._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Remove the media item from the data store
    dataStore.mediaFiles.splice(index, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete media error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // Try to use database first
    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const media = await Media.findByIdAndUpdate(
          id,
          { ...body, updatedAt: new Date() },
          { new: true }
        ).lean()

        if (!media) {
          return NextResponse.json({ error: "Media not found" }, { status: 404 })
        }

        return NextResponse.json({ media })
      } catch (dbError) {
        console.error("Database error, falling back to mock data:", dbError)
      }
    }

    // Fallback to mock data
    const index = dataStore.mediaFiles.findIndex((m) => m._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Update the media item
    dataStore.mediaFiles[index] = {
      ...dataStore.mediaFiles[index],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ media: dataStore.mediaFiles[index] })
  } catch (error) {
    console.error("Update media error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
