import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent, Service } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultServicesContent = {
  hero: { title: "Services", backgroundImage: "/images/banner-2.png" },
  intro: {
    badge: "Our Services",
    title: "INTEGRATED AGRITECH & SUSTAINABLE GREEN SOLUTIONS",
    description:
      "We deliver end-to-end, technology-driven agricultural and green infrastructure solutions—combining smart farming, intelligent irrigation, agri-infrastructure development, soil health, security systems, and sustainable living concepts.",
  },
  services: [
    {
      id: "srv-1",
      number: "01",
      title: "Agriculture & Green Solutions",
      description: "End-to-end agricultural and green development services.",
      image: "/images/agreeculture.png",
      tags: [{id: "t1", icon: "/images/smart-farming.png", label: "Smart Farming"}, {id:"t2", icon:"/images/green-infrastructure.png", label:"Green Infrastructure"}, {id:"t3", icon:"/images/plant-supply.png", label:"Plant Supply"},{id:"t4", icon:"/images/sustainable-agriculture.png", label:"Sustainable Agriculture"}],
    },
    {
      id: "srv-2",
      number: "02",
      title: "Intelligent Farm & Agri Management",
      description: "Smart technology solutions for farm management.",
      image: "/images/project-2.png",
      tags: ["IoT Sensors", "Data Analytics"],
    },
    {
      id: "srv-3",
      number: "03",
      title: "Agri Infrastructure Development",
      description: "Building robust agricultural infrastructure.",
      image: "/images/project-3.png",
      tags: ["Storage Facilities", "Processing Units"],
    },
    {
      id: "srv-4",
      number: "04",
      title: "Sustainable Nutrition & Soil Health",
      description: "Solutions focused on soil health management.",
      image: "/images/project-4.png",
      tags: ["Soil Testing", "Organic Solutions"],
    },
    {
      id: "srv-5",
      number: "05",
      title: "Smart Irrigation & Water Management",
      description: "Intelligent irrigation systems.",
      image: "/images/project-1.png",
      tags: ["Drip Irrigation", "Water Conservation"],
    },
    {
      id: "srv-6",
      number: "06",
      title: "Security & Smart Living Solutions",
      description: "Integrated security and smart living solutions.",
      image: "/images/project-2.png",
      tags: ["CCTV Surveillance", "Smart Automation"],
    },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT
  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()

      const pageContent = await PageContent.findOne({ tenantSlug: tenant, pageType: "services" }).lean()

      if (pageContent && pageContent.content && Object.keys(pageContent.content).length > 0) {
        return NextResponse.json({ content: pageContent.content })
      }
    } catch (error) {
      console.error("MongoDB projects content fetch error:", error)
    }
  }
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
          { tenantSlug: tenant, pageType: "services" },
          { tenantSlug: tenant, pageType: "services", content, isActive: true },
          { upsert: true, new: true },
        )
        return NextResponse.json({ success: true, content })
      } catch (error) {
        console.error("MongoDB services content update error:", error)
      }
    }

    if (!dataStore.pageContents) dataStore.pageContents = {}
    if (!dataStore.pageContents[tenant]) dataStore.pageContents[tenant] = {}
    dataStore.pageContents[tenant].services = content

    return NextResponse.json({ success: true, content })
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
