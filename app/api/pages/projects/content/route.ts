import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultProjectsContent = {
  hero: {
    title: "Projects",
    backgroundImage: "/images/banner-2.png",
  },
  intro: {
    badge: "Our Project",
    title: "PROJECTS THAT TRANSFORM LAND INTO VALUE",
    description:
      "At Kisan Plant Technologies Pvt. Ltd., our projects reflect the successful execution of intelligent agriculture, green infrastructure, and smart living solutions. Each project is scientifically planned, technology-enabled, and sustainably executed—delivering measurable impact, long-term performance, and real-world results across farms, industries, and green developments.",
  },
  categories: [
    { id: "cat-1", name: "Nationwide Plant Supply", order: 1 },
    { id: "cat-2", name: "Strategic Nursery Partnerships", order: 2 },
    { id: "cat-3", name: "Smart Agro & Urban Greening Projects", order: 3 },
    { id: "cat-4", name: "24×7 Customer Care & Expert Support", order: 4 },
    { id: "cat-5", name: "Knowledge & Training Initiatives", order: 5 },
  ],
  projects: [
    {
      id: "proj-1",
      title: "GreenHarvest",
      location: "Ranga Reddy, Hyderabad",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit amet condimentum varius.",
      image: "/images/project-1.png",
      categoryId: "cat-1",
      link: "/projects/greenharvest",
    },
    {
      id: "proj-2",
      title: "FieldRoots Initiative",
      location: "Ranga Reddy, Hyderabad",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit amet condimentum varius.",
      image: "/images/project-2.png",
      categoryId: "cat-1",
      link: "/projects/fieldroots",
    },
    {
      id: "proj-3",
      title: "AgriGrow",
      location: "Ranga Reddy, Hyderabad",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit amet condimentum varius.",
      image: "/images/project-3.png",
      categoryId: "cat-1",
      link: "/projects/agrigrow",
    },
    {
      id: "proj-4",
      title: "SoilScape Development",
      location: "Ranga Reddy, Hyderabad",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit amet condimentum varius.",
      image: "/images/project-4.png",
      categoryId: "cat-1",
      link: "/projects/soilscape",
    },
    {
      id: "proj-5",
      title: "Urban Green Initiative",
      location: "Bangalore, Karnataka",
      description:
        "Strategic partnership with local nurseries to provide quality plants for urban landscaping projects.",
      image: "/images/project-1.png",
      categoryId: "cat-2",
      link: "/projects/urban-green",
    },
    {
      id: "proj-6",
      title: "Smart Farm Network",
      location: "Chennai, Tamil Nadu",
      description: "Technology-driven farming solutions with IoT-enabled monitoring and automated irrigation systems.",
      image: "/images/project-2.png",
      categoryId: "cat-3",
      link: "/projects/smart-farm",
    },
  ],
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()

      const pageContent = await PageContent.findOne({ tenantSlug: tenant, pageType: "projects" }).lean()

      if (pageContent && pageContent.content && Object.keys(pageContent.content).length > 0) {
        return NextResponse.json({ content: pageContent.content })
      }
    } catch (error) {
      console.error("MongoDB projects content fetch error:", error)
    }
  }

  // Check mock data store
  const mockData = dataStore.pageContents?.[tenant]?.projects
  if (mockData && Object.keys(mockData).length > 0) {
    return NextResponse.json({ content: mockData })
  }

  // Always return default content as fallback
  return NextResponse.json({ content: defaultProjectsContent })
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
          { tenantSlug: tenant, pageType: "projects" },
          { tenantSlug: tenant, pageType: "projects", content, isActive: true },
          { upsert: true, new: true },
        )
        return NextResponse.json({ success: true, content })
      } catch (error) {
        console.error("MongoDB projects content update error:", error)
      }
    }

    // Fallback to mock data
    if (!dataStore.pageContents) dataStore.pageContents = {}
    if (!dataStore.pageContents[tenant]) dataStore.pageContents[tenant] = {}
    dataStore.pageContents[tenant].projects = content

    return NextResponse.json({ success: true, content })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
