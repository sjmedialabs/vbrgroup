import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent, Division } from "@/lib/db"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultDivisionsContent = {
  hero: { title: "Divisions", backgroundImage: "/images/banner-4.png" },
  intro: {
    badge: "Our Divisions",
    title: "SPECIALIZED DIVISIONS.\nUNIFIED PURPOSE",
    description:
      "Our divisions operate under specialized brands, each engineered to address a specific sector while sharing one unified mission.",
  },
  divisions: [],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json(
      { error: "Database not configured" }, 
      { status: 500 }
    )
  }

  try {
  await connectToDatabase()
  
        const pageContent = await PageContent.findOne({ tenantSlug: tenant, pageType: "divisions" }).lean()
  
        if (pageContent && pageContent.content && Object.keys(pageContent.content).length > 0) {
          return NextResponse.json({ content: pageContent.content })
        }
  } catch (error) {
    console.error("MongoDB divisions content fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch divisions content" }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    const { content } = await request.json()

    await connectToDatabase()
    await PageContent.findOneAndUpdate(
      { tenantSlug: tenant, pageType: "divisions" },
      { tenantSlug: tenant, pageType: "divisions", content, isActive: true },
      { upsert: true, new: true },
    )
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error("MongoDB divisions content update error:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
