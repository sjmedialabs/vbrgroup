import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"
import { shouldUseMockFallback, handleDatabaseUnavailable } from "@/lib/db/config"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultHomeContent = {
  hero: {
    slides: [
      {
        id: "slide-1",
        title: "FUTURES FOCUS GREEN INNOVATIONS",
        subtitle: "Innovative plant solutions built for tomorrow.",
        image: "/images/banner-1-1.png",
        badge: "Kisan Plantiq",
        ctaText: "Explore Ecosystem",
        ctaLink: "/about",
      },
      {
        id: "slide-2",
        title: "SUSTAINABLE FARMING SOLUTIONS",
        subtitle: "Building a greener tomorrow through innovative agriculture",
        image: "/images/banner-1.png",
        badge: "",
        ctaText: "Explore Ecosystem",
        ctaLink: "/about",
      },
      {
        id: "slide-3",
        title: "FARMING WITH FORESIGHT",
        subtitle: "Strategic agriculture designed for long-term performance",
        image: "/images/banner-2.png",
        badge: "KISAN AGRIQ",
        ctaText: "Explore Ecosystem",
        ctaLink: "/about",
      },
      {
        id: "slide-4",
        title: "INTELLIGENT GREENS",
        subtitle: "Through sustainable farming and smart technology — more than crops — we grow impact.",
        image: "/images/banner-3.png",
        badge: "",
        ctaText: "Explore Ecosystem",
        ctaLink: "/about",
      },
    ],
  },
  about: {
    badge: "About Kisan Plant Technologies Pvt. Ltd.",
    title: "Built on Quality. Driven by Innovation",
    subtitle: "",
    description:
      "exists to reimagine India's green future through intelligent technology and sustainable innovation – building ecosystems that perform today and endure for generations.",
    features: [
      { id: "f1", icon: "/images/20-plus-experience.png", title: "20+", description: "Of Experience" },
      { id: "f2", icon: "/images/pan-india-network.png", title: "", description: "Pan-India Network" },
      { id: "f3", icon: "/images/smart-tech.png", title: "", description: "Smart Tech" },
      { id: "f4", icon: "/images/24x7-support.png", title: "", description: "24×7 Support" },
      { id: "f5", icon: "/images/trust-quality.png", title: "", description: "Trust & Quality" },
    ],
    ctaText: "Explore More",
    ctaLink: "/about",
  },
  divisions: {
    badge: "Our Divisions",
    title: "SPECIALIZED DIVISIONS. UNIFIED PURPOSE",
    description:
      "Our divisions operate under specialized brands, each engineered to address a specific sector while sharing one unified mission — to make India's green and agricultural future intelligent, sustainable, and globally competitive.",
    backgroundImage: "/images/divisions-bg.png",
    items: [
      {
        id: "div-1",
        name: "Kisan Plantiq",
        subtitle: "Plant Supply & Manufacturing Division",
        image: "/images/kisan-plantiq.png",
        link: "/divisions/kisan-plantiq",
      },
      {
        id: "div-2",
        name: "Kisan Agriq",
        subtitle: "Corporate Agriculture Intelligence Division",
        image: "/images/kisan-agriq.png",
        link: "/divisions/kisan-agriq",
      },
      {
        id: "div-3",
        name: "Kisan Secure",
        subtitle: "Agri & Environmental Security Systems Division",
        image: "/images/kisan-secure.png",
        link: "/divisions/kisan-secure",
      },
      {
        id: "div-4",
        name: "Kisan Vedvan",
        subtitle: "Culture & Ecological Plantation Division",
        image: "/images/kisan-vedvan.png",
        link: "/divisions/kisan-vedvan",
      },
    ],
    ctaText: "Explore our Divisions",
    ctaLink: "/divisions",
  },
  sustainability: {
    badge: "Sustainability",
    title: "EMPOWERING AGRICULTURE TO ACHIEVE SUSTAINABILITY GOALS",
    description: "",
    image: "/images/banner-4.png",
    videoUrl: "",
    features: [
      {
        id: "sf-1",
        icon: "/images/sustainability-1.png",
        title: "Regenerative Farming Practices",
        description: "Restoring soil health and ecosystems through responsible cultivation methods.",
      },
      {
        id: "sf-2",
        icon: "/images/sustainability-2.png",
        title: "Environment-Responsible Agriculture",
        description: "Minimizing environmental impact while optimizing agricultural productivity.",
      },
      {
        id: "sf-3",
        icon: "/images/sustainability-3.png",
        title: "Smart & Sustainable Farming",
        description: "Leveraging technology to enable efficient, resilient, and sustainable farm operations.",
      },
    ],
    stats: { value: "20+", label: "Integrated Green Technology" },
    ctaText: "Know More",
    ctaLink: "/sustainability",
  },
  projects: {
    badge: "Our Projects",
    title: "CULTIVATED WITH PRECISION AND INNOVATION",
    items: [
      {
        id: "proj-1",
        title: "GreenHarvest",
        location: "Ranga Reddy, Hyderabad",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit emet condimentum varius.",
        image: "/images/project-1.png",
        link: "/projects/greenharvest",
      },
      {
        id: "proj-2",
        title: "FieldRoots Initiative",
        location: "Ranga Reddy, Hyderabad",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit emet condimentum varius.",
        image: "/images/project-2.png",
        link: "/projects/fieldroots",
      },
      {
        id: "proj-3",
        title: "AgriGrow",
        location: "Ranga Reddy, Hyderabad",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit emet condimentum varius.",
        image: "/images/project-3.png",
        link: "/projects/agrigrow",
      },
      {
        id: "proj-4",
        title: "SoilScape Development",
        location: "Ranga Reddy, Hyderabad",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit emet condimentum varius.",
        image: "/images/project-4.png",
        link: "/projects/soilscape",
      },
    ],
    ctaText: "View all Project",
    ctaLink: "/projects",
  },
  testimonials: {
    badge: "Voices of Trust",
    title: "Built on Trust.",
    subtitle: "Proven by Results.",
    items: [
      {
        id: "test-1",
        name: "Emily Carter",
        role: "Homeowner",
        content:
          "We have a terrace that we love to use year-round, and Plant Specialists has helped us with it for years. The team there has helped us with every aspect of it from decking to irrigation to containers to lighting to furniture to plant health — and of course the overall design!",
        avatar: "/images/avatar-1.png",
        rating: 5,
      },
      {
        id: "test-2",
        name: "Emily Carter",
        role: "Homeowner",
        content:
          "We have a terrace that we love to use year-round, and Plant Specialists has helped us with it for years. The team there has helped us with every aspect of it from decking to irrigation to containers to lighting to furniture to plant health — and of course the overall design!",
        avatar: "/images/avatar-1.png",
        rating: 5,
      },
    ],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const pageContent = await PageContent.findOne({
        tenantSlug: tenant,
        pageType: "home",
      }).lean()

      if (pageContent) {
        return NextResponse.json({ content: pageContent.content })
      }
    } catch (error) {
      console.error("MongoDB home content fetch error:", error)
      handleDatabaseUnavailable(error as Error)
    }
  }

  // Fallback to mock data (only in development)
  if (shouldUseMockFallback()) {
    const tenantContent = dataStore.pageContents?.[tenant]?.home || defaultHomeContent
    return NextResponse.json({ content: tenantContent })
  }

  return NextResponse.json({ error: "Content not found" }, { status: 404 })
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  try {
    const { content } = await request.json()

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const pageContent = await PageContent.findOneAndUpdate(
          { tenantSlug: tenant, pageType: "home" },
          { tenantSlug: tenant, pageType: "home", content, isActive: true },
          { upsert: true, new: true, runValidators: true },
        ).lean()

        return NextResponse.json({ success: true, content: pageContent?.content })
      } catch (error) {
        console.error("MongoDB home content update error:", error)
        handleDatabaseUnavailable(error as Error)
      }
    }

    // Fallback to mock data (only in development)
    if (shouldUseMockFallback()) {
      if (!dataStore.pageContents) {
        dataStore.pageContents = {}
      }
      if (!dataStore.pageContents[tenant]) {
        dataStore.pageContents[tenant] = {}
      }

      dataStore.pageContents[tenant].home = content
      return NextResponse.json({ success: true, content })
    }

    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
