import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    // Find the index of the media item
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
