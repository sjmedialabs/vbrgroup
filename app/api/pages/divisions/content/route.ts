import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent, Division } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultDivisionsContent = {
  hero: { title: "Divisions", backgroundImage: "/images/banner-4.png" },
  intro: {
    badge: "Our Divisions",
    title: "SPECIALIZED DIVISIONS.\nUNIFIED PURPOSE",
    description:
      "Our divisions operate under specialized brands, each engineered to address a specific sector while sharing one unified mission.",
  },
  divisions: [
    {
      id: "div-1",
      name: "Kisan Plantiq",
      subtitle: "Plant Supply & Manufacturing Division",
      description: "",
      image: "/images/division-plantiq.png",
      link: "/divisions/kisan-plantiq",
      features: [],
    },
    {
      id: "div-2",
      name: "Kisan Agriq",
      subtitle: "Corporate Agriculture Intelligence Division",
      description: "",
      image: "/images/division-agriq.png",
      link: "/divisions/kisan-agriq",
      features: [],
    },
    {
      id: "div-3",
      name: "Kisan Secure",
      subtitle: "Agro & Environmental Security Systems Division",
      description: "",
      image: "/images/division-secure.png",
      link: "/divisions/kisan-secure",
      features: [],
    },
    {
      id: "div-4",
      name: "Kisan Vedvan",
      subtitle: "Cultural & Ecological Plantation Division",
      description: "",
      image: "/images/division-vedvan.png",
      link: "/divisions/kisan-vedvan",
      features: [],
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()

      const [pageContent, divisions] = await Promise.all([
        PageContent.findOne({ tenantSlug: tenant, pageType: "divisions" }).lean(),
        Division.find({ tenantSlug: tenant, isActive: true }).sort({ order: 1 }).lean(),
      ])

      if (pageContent) {
        const content = pageContent.content as typeof defaultDivisionsContent
        if (divisions.length > 0) {
          content.divisions = divisions.map((d) => ({
            id: d._id.toString(),
            name: d.name,
            subtitle: d.subtitle,
            description: d.description,
            image: d.cardImage || d.heroImage,
            link: `/divisions/${d.slug}`,
            features: d.features || [],
          }))
        }
        return NextResponse.json({ content })
      }
    } catch (error) {
      console.error("MongoDB divisions content fetch error:", error)
    }
  }

  const tenantContent = dataStore.pageContents?.[tenant]?.divisions || defaultDivisionsContent
  return NextResponse.json({ content: tenantContent })
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  try {
    const { content } = await request.json()

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        await PageContent.findOneAndUpdate(
          { tenantSlug: tenant, pageType: "divisions" },
          { tenantSlug: tenant, pageType: "divisions", content, isActive: true },
          { upsert: true, new: true },
        )
        return NextResponse.json({ success: true, content })
      } catch (error) {
        console.error("MongoDB divisions content update error:", error)
      }
    }

    if (!dataStore.pageContents) dataStore.pageContents = {}
    if (!dataStore.pageContents[tenant]) dataStore.pageContents[tenant] = {}
    dataStore.pageContents[tenant].divisions = content

    return NextResponse.json({ success: true, content })
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
