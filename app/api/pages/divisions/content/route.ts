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

    const [pageContent, divisions] = await Promise.all([
      PageContent.findOne({ tenantSlug: tenant, pageType: "divisions" }).lean(),
      Division.find({ tenantSlug: tenant, isActive: true }).sort({ order: 1 }).lean(),
    ])

    // If no page content exists, create default with divisions from DB
    let content = pageContent?.content as typeof defaultDivisionsContent

    if (!content) {
      content = { ...defaultDivisionsContent }
    }

    // Always use divisions from database
    content.divisions = divisions.map((d) => ({
      id: d._id.toString(),
      name: d.name,
      subtitle: d.subtitle || "",
      description: d.description || "",
      image: d.cardImage || d.heroImage || "",
      logo: d.cardImage || "",
      link: `/divisions/${d.slug}`,
      features: d.features || [],
    }))

    return NextResponse.json({ content })
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
