import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultAboutContent = {
  hero: {
    title: "About us",
    backgroundImage: "/images/A.png",
  },
  subNav: [
    { id: "leadership", label: "Leadership", href: "/about/leadership" },
  ],
  story: {
    badge: "Our Story",
    title: "Innovation, Intelligent Systems, And Sustainable Practices.",
    paragraphs: [
      "Kisan Plant Technologies Pvt. Ltd. is a pioneering agri-technology enterprise based in India, committed to transforming the agricultural ecosystem through innovation, intelligent systems, and sustainable practices. We are among the first organizations in the country to deliver a fully integrated, technology-enabled farming ecosystem—offering end-to-end agricultural solutions under one unified platform.",
      "Our comprehensive capabilities span the entire agricultural lifecycle, from land fencing and borewell installation to scientific soil testing, land preparation, plantation, irrigation, and crop maintenance. By consolidating these critical services, we enable farmers, developers, and institutions to manage farms more efficiently, transparently, and profitably.",
      "At the core of our operations is a data-driven approach to agriculture. We begin with precision land development and soil analysis to establish the right foundation for productivity. This is supported by the supply of premium-quality plants, along with the integration of AI-based monitoring systems, IoT-enabled irrigation controls, and drone-assisted field inspections—ensuring continuous performance tracking from planting through harvest.",
      "Kisan Plant Technologies delivers end-to-end farm management solutions by combining deep agricultural expertise with advanced engineering and digital technologies. Our multidisciplinary team of agronomists, engineers, and field specialists works closely with clients to achieve measurable improvements in yield optimization, water efficiency, cost control, and long-term profitability.",
    ],
    features: [
      { id: "f1", icon: "/images/20-plus-experience.png", label: "Of Experience" },
      { id: "f2", icon: "/images/map.png", label: "Pan-India Network" },
      { id: "f3", icon: "/images/bulb.png", label: "Smart Tech" },
      { id: "f4", icon: "/images/headphone.png", label: "24×7 Support" },
      { id: "f5", icon: "/images/Vector.png", label: "Trust & Quality" },
    ],
  },
  cards: [
    {
      id: "c1",
      title: "What we do",
      description:
        "At Kisan Plant Technologies, we specialize in delivering end-to-end green solutions that combine advanced horticultural practices with large-scale plant supply and project execution.",
      link: "/services",
      linkText: "Our Solutions",
    },
    {
      id: "c2",
      title: "Our impact",
      description:
        "To become India's most trusted and innovative green technology company, enabling sustainable ecosystems and greener environments through intelligent plant solutions and responsible practices.",
      link: "/projects",
      linkText: "Our Projects",
    },
    {
      id: "c3",
      title: "Our Mission",
      description:
        "To provide superior-quality plants and integrated green solutions through innovation, expertise, and sustainability. To empower customers with reliable supply, expert support, and long-term plant success across India.",
      link: "/contact",
      linkText: "Contact us",
    },
  ],
  whyChooseUs: {
    badge: "Why Choose Us",
    title: "We don't just garden we grow happiness",
    description:
      "We bring creativity, care, and quality to every space. With a passion for greenery, we turn garden dreams into reality — beautifully and reliably.",
    features: [
      {
        id: "w1",
        icon: "/images/customise.png",
        title: "Expertise in Garden & Landscape Design",
        description:
          "Our experienced team brings creativity and horticultural knowledge to craft beautiful, functional outdoor spaces.",
      },
      {
        id: "w2",
        icon: "/images/Vector-1.png",
        title: "Customized Solutions for Every Space",
        description: "We tailor every project to your style, space, and needs — no two gardens are ever the same.",
      },
      {
        id: "w3",
        icon: "/images/lighting.png",
        title: "Reliable Service with Lasting Results",
        description:
          "From design to maintenance, we deliver high-quality, sustainable results you can enjoy season after season.",
      },
      {
        id: "w4",
        icon: "/images/service3.png",
        title: "Eco-Friendly and Sustainable Materials",
        description: "We prioritize native plants and sustainable materials to enhance your outdoor living space.",
      },
    ],
  },
  growth: {
    badge: "Our Growth in Numbers",
    title: "Our Growth in Numbers",
    description:
      "A quick look at our journey through numbers — projects completed, gardens transformed, and clients satisfied",
    backgroundImage: "/images/growth-bg.jpg",
    stats: [
      { id: "s1", value: "98%", label: "Client Satisfaction" },
      { id: "s2", value: "10k", label: "Projects Complete" },
      { id: "s3", value: "300+", label: "Trees & Plants" },
      { id: "s4", value: "20+", label: "Expert Team" },
    ],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()

      const pageContent = await PageContent.findOne({ tenantSlug: tenant, pageType: "about" }).lean()

      if (pageContent && pageContent.content && Object.keys(pageContent.content).length > 0) {
        return NextResponse.json({ content: pageContent.content })
      }
    } catch (error) {
      console.error("MongoDB about content fetch error:", error)
    }
  }

  // Check mock data store
  const mockData = dataStore.pageContents?.[tenant]?.about
  if (mockData && Object.keys(mockData).length > 0) {
    return NextResponse.json({ content: mockData })
  }

  // Always return default content as fallback
  return NextResponse.json({ content: defaultAboutContent })
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

    // Fallback to mock data
    if (!dataStore.pageContents) dataStore.pageContents = {}
    if (!dataStore.pageContents[tenant]) dataStore.pageContents[tenant] = {}
    dataStore.pageContents[tenant].about = content

    return NextResponse.json({ success: true, content })
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
