import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Division } from "@/lib/db"

const DEFAULT_TENANT = "kisan-plant-technologies"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json(
      { error: "Database not configured. Please run migration first." }, 
      { status: 500 }
    )
  }

  try {
    await connectToDatabase()
    const division = await Division.findOne({
      tenantSlug: tenant,
      slug,
      isActive: true,
    }).lean()

    if (!division) {
      return NextResponse.json(
        { error: "Division not found. Please create it in admin panel or run migration." }, 
        { status: 404 }
      )
    }

    if (!division.pageContent) {
      return NextResponse.json(
        { error: "Division content not configured. Please edit it in admin panel." }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ content: division.pageContent })
  } catch (error) {
    console.error("Error fetching division content:", error)
    return NextResponse.json(
      { error: "Failed to fetch division content" }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    const { content } = await request.json()

    await connectToDatabase()
    const division = await Division.findOneAndUpdate(
      { tenantSlug: tenant, slug },
      { pageContent: content },
      { new: true }
    )

    if (!division) {
      return NextResponse.json({ error: "Division not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, content: division.pageContent })
  } catch (error) {
    console.error("Error updating division content:", error)
    return NextResponse.json({ error: "Failed to update division content" }, { status: 500 })
  }
}
