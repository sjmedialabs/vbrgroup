import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultAboutContent = {
  hero: { title: "About Us", backgroundImage: "/images/about-hero.png" },
  intro: {
    badge: "About Kisan Plant Technologies",
    title: "Reimagining India's Green Future",
    description:
      "Kisan Plant Technologies exists to reimagine India's green future through intelligent technology and sustainable innovation – building ecosystems that perform today and endure for generations.",
    image: "/images/about-intro.png",
  },
  mission: {
    title: "Our Mission",
    description:
      "To deliver innovative, technology-driven agricultural solutions that empower farmers, enhance productivity, and promote sustainable practices across India.",
    image: "/images/mission.png",
  },
  vision: {
    title: "Our Vision",
    description:
      "To be India's leading agricultural technology company, transforming the farming landscape through innovation, sustainability, and farmer empowerment.",
    image: "/images/vision.png",
  },
  values: {
    title: "Our Core Values",
    items: [
      {
        id: "v1",
        icon: "",
        title: "Innovation",
        description: "Continuously pushing boundaries with cutting-edge solutions",
      },
      {
        id: "v2",
        icon: "",
        title: "Sustainability",
        description: "Committed to environmentally responsible practices",
      },
      { id: "v3", icon: "", title: "Quality", description: "Delivering excellence in every product and service" },
      {
        id: "v4",
        icon: "",
        title: "Integrity",
        description: "Building trust through honest and ethical business practices",
      },
    ],
  },
  team: { title: "Our Leadership Team", subtitle: "Meet the visionaries driving our mission", members: [] },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const pageContent = await PageContent.findOne({ tenantSlug: tenant, pageType: "about" }).lean()
      if (pageContent) {
        return NextResponse.json({ content: pageContent.content })
      }
    } catch (error) {
      console.error("MongoDB about content fetch error:", error)
    }
  }

  const tenantContent = dataStore.pageContents?.[tenant]?.about || defaultAboutContent
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
          { tenantSlug: tenant, pageType: "about" },
          { tenantSlug: tenant, pageType: "about", content, isActive: true },
          { upsert: true, new: true },
        )
        return NextResponse.json({ success: true, content })
      } catch (error) {
        console.error("MongoDB about content update error:", error)
      }
    }

    if (!dataStore.pageContents) dataStore.pageContents = {}
    if (!dataStore.pageContents[tenant]) dataStore.pageContents[tenant] = {}
    dataStore.pageContents[tenant].about = content

    return NextResponse.json({ success: true, content })
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
