import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Division } from "@/lib/db"

const DEFAULT_TENANT = "kisan-plant-technologies"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    await connectToDatabase()
    
    // Soft delete by setting isActive to false
    const division = await Division.findOneAndUpdate(
      { _id: id, tenantSlug: tenant },
      { isActive: false },
      { new: true }
    )

    if (!division) {
      return NextResponse.json({ error: "Division not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Division deleted successfully" })
  } catch (error) {
    console.error("Error deleting division:", error)
    return NextResponse.json({ error: "Failed to delete division" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    const body = await request.json()
    await connectToDatabase()
    
    const division = await Division.findOneAndUpdate(
      { _id: id, tenantSlug: tenant },
      { $set: body },
      { new: true }
    )

    if (!division) {
      return NextResponse.json({ error: "Division not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, division })
  } catch (error) {
    console.error("Error updating division:", error)
    return NextResponse.json({ error: "Failed to update division" }, { status: 500 })
  }
}
