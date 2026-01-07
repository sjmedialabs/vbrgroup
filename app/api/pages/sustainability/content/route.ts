import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultSustainabilityContent = {
  hero: {
    title: "Sustainability",
    backgroundImage: "/images/pexels-ron-lach-7944397-201.png",
  },
  sections: [
    {
      id: "government-initiatives",
      title: "Sustainability &\nGovernment Initiatives",
      description: [
        "At Kisan Plant Technologies Pvt. Ltd., sustainability is central to our approach, aligned with national priorities in water conservation, soil health, renewable energy, and green infrastructure development. Our solutions support government-led initiatives through the deployment of smart irrigation, organic farming inputs, agroforestry, and technology-enabled farm management.",
        "By integrating data-driven planning and sustainable practices, we enable institutions and stakeholders to achieve environmental compliance, resource efficiency, and long-term impact. We actively collaborate with government bodies and public institutions to deliver scalable, measurable, and future-ready agricultural solutions.",
      ],
      image: "/images/pexels-ron-lach-7944397-201.png",
      layout: "text-left",
    },
    {
      id: "csr",
      title: "Corporate Social\nResponsibility (CSR)",
      description: [
        "At Kisan Plant Technologies Pvt. Ltd., Corporate Social Responsibility is integral to our commitment toward sustainable development, environmental stewardship, and community empowerment. Our CSR initiatives focus on creating long-term social and ecological impact by strengthening agriculture, conserving natural resources, and supporting rural livelihoods.",
        "Through programs in tree plantation, soil restoration, water conservation, organic farming promotion, and green infrastructure development, we actively contribute to building resilient ecosystems and healthier communities. We work closely with government bodies, institutions, NGOs, and local stakeholders to implement transparent, measurable, and impact-driven CSR projects.",
        "By combining technology, agricultural expertise, and sustainability principles, Kisan Plant Technologies ensures that every CSR initiative delivers meaningful value—supporting inclusive growth while protecting the environment for future generations.",
      ],
      image: "/images/image-2037.png",
      layout: "image-left",
    },
    {
      id: "eco-sustainability",
      title: "Eco Sustainability",
      description: [
        "At Kisan Plant Technologies Pvt. Ltd., eco sustainability is a core principle guiding every solution we design and deliver. Our approach focuses on responsible resource management, environmental conservation, and long-term ecological balance across agriculture and green infrastructure.",
        "By integrating water-efficient irrigation systems, organic soil nutrition, renewable energy solutions, native plantations, and technology-driven farm practices, we help reduce environmental impact while enhancing productivity. Our commitment to eco sustainability ensures that growth is achieved responsibly—protecting natural ecosystems today while securing a greener future for generations to come.",
      ],
      image: "/images/image-2038.png",
      layout: "text-left",
    },
  ],
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()

      const pageContent = await PageContent.findOne({ tenantSlug: tenant, pageType: "sustainability" }).lean()

      if (pageContent && pageContent.content && Object.keys(pageContent.content).length > 0) {
        return NextResponse.json({ content: pageContent.content })
      }
    } catch (error) {
      console.error("MongoDB sustainability content fetch error:", error)
    }
  }

  // Check mock data store
  const mockData = dataStore.pageContents?.[tenant]?.sustainability
  if (mockData && Object.keys(mockData).length > 0) {
    return NextResponse.json({ content: mockData })
  }

  // Always return default content as fallback
  return NextResponse.json({ content: defaultSustainabilityContent })
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
          { tenantSlug: tenant, pageType: "sustainability" },
          { tenantSlug: tenant, pageType: "sustainability", content, isActive: true },
          { upsert: true, new: true },
        )
        return NextResponse.json({ success: true, content })
      } catch (error) {
        console.error("MongoDB sustainability content update error:", error)
      }
    }

    // Fallback to mock data
    if (!dataStore.pageContents) dataStore.pageContents = {}
    if (!dataStore.pageContents[tenant]) dataStore.pageContents[tenant] = {}
    dataStore.pageContents[tenant].sustainability = content

    return NextResponse.json({ success: true, content })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
