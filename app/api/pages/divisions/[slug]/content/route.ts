import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Division } from "@/lib/db"

const DEFAULT_TENANT = "kisan-plant-technologies"

// Fallback content for when database is not configured
const fallbackContent: Record<string, any> = {
  "kisan-plantiq": {
    hero: {
      title: "Intelligent Greens.\nSustainable Tomorrow.",
      subtitle: "Through sustainable farming and smart collaboration, we grow more than crops — we grow impact.",
      backgroundImage: "/images/plantiq-hero.png",
    },
    about: {
      badge: "About KISAN PLANTIQ",
      title: "Intelligent Greens. Sustainable Tomorrow.",
      description: [
        "At Kisan PLANTIQ, we don't just supply plants — we deliver living assets equipped with intelligence, sustainability, and a vision for greener tomorrows. Operating across India, we're your trusted partner in transforming urban and rural landscapes with high-quality plant supply, strategic nursery partnerships, and cutting-edge agro solutions.",
        "From supplying large-scale plants to building smart plantation projects and offering 24×7 customer support, we combine experience with innovation to serve government bodies, corporates, and communities nationwide."
      ],
    },
    services: {
      badge: "Our Services",
      title: "End-to-End Plant Supply\n& Green Solutions\nAcross India",
      subtitle: "At Kisan PLANTIQ, we go beyond being a traditional plant supplier — we deliver intelligent, reliable, and technology-enabled green solutions across all verticals of India's growing ecosystem.",
      tabs: [
        {
          id: "plant-supply",
          title: "Nationwide Plant Supply",
          number: "01",
          heading: "Nationwide\nPlant Supply",
          description: [
            "We are India's trusted partner for large-scale plant supply operations — offering a seamless experience from procurement to delivery, backed by quality assurance and logistical precision.",
            "Serving corporates, government bodies, municipalities, and infrastructure projects across the nation."
          ],
          image: "/images/project-1.png",
        },
        {
          id: "nursery-partnerships",
          title: "Strategic Nursery Partnerships",
          number: "02",
          heading: "Strategic Nursery\nPartnerships",
          description: [
            "We collaborate with government-approved nurseries and private growers to ensure a steady, scalable, and quality-controlled supply chain.",
            "Our partnerships span multiple states, enabling us to source diverse species and cater to region-specific requirements."
          ],
          image: "/images/project-2.png",
        },
        {
          id: "smart-greening",
          title: "Smart Agro & Urban Greening Projects",
          number: "03",
          heading: "Smart Agro &\nUrban Greening Projects",
          description: [
            "Beyond supplying plants, we design and execute turnkey plantation projects — from public parks and corporate campuses to highway beautification and urban forests.",
            "Leveraging data-driven species selection, irrigation planning, and maintenance protocols."
          ],
          image: "/images/project-3.png",
        },
        {
          id: "customer-support",
          title: "24×7 Customer Care & Expert Support",
          number: "04",
          heading: "24×7 Customer Care\n& Expert Support",
          description: [
            "Our dedicated team provides round-the-clock support — from consultation and site surveys to post-delivery care and troubleshooting.",
            "We ensure every stakeholder — from project managers to ground teams — is equipped with knowledge and assistance."
          ],
          image: "/images/project-4.png",
        },
        {
          id: "training",
          title: "Knowledge & Training Initiatives",
          number: "05",
          heading: "Knowledge &\nTraining Initiatives",
          description: [
            "We empower farmers, nursery operators, and contractors with training programs focused on modern plantation techniques, pest management, and sustainability practices.",
            "Building capacity at the grassroots level to ensure long-term ecological and economic impact."
          ],
          image: "/images/project-5.png",
        },
      ],
    },
  },
  "kisan-agriq": {
    hero: {
      title: "Smart Agriculture.\nIntelligent Farming.",
      subtitle: "Leveraging AI and data analytics to transform agricultural practices across India.",
      backgroundImage: "/images/division-agriq.png",
    },
    about: {
      badge: "About KISAN AGRIQ",
      title: "Smart Agriculture. Intelligent Farming.",
      description: [
        "Kisan AGRIQ represents the future of agriculture — where technology meets tradition to create sustainable, profitable, and scalable farming solutions.",
        "We provide corporate agriculture intelligence services that help organizations optimize their agricultural operations."
      ],
    },
    services: {
      badge: "Our Services",
      title: "Corporate Agriculture\nIntelligence Solutions",
      subtitle: "Transforming agriculture through technology and innovation.",
      tabs: [
        {
          id: "precision-farming",
          title: "Precision Farming",
          number: "01",
          heading: "Precision\nFarming",
          description: [
            "Advanced agricultural solutions powered by data analytics and IoT.",
            "Optimize crop yields and reduce waste through intelligent farming practices."
          ],
          image: "/images/division-agriq.png",
        },
      ],
    },
  },
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    const content = fallbackContent[slug]
    if (!content) {
      return NextResponse.json({ error: "Division not found" }, { status: 404 })
    }
    return NextResponse.json({ content })
  }

  try {
    await connectToDatabase()
    const division = await Division.findOne({
      tenantSlug: tenant,
      slug,
      isActive: true,
    }).lean()

    if (!division || !division.pageContent) {
      return NextResponse.json({ error: "Division not found" }, { status: 404 })
    }

    return NextResponse.json({ content: division.pageContent })
  } catch (error) {
    console.error("Error fetching division content:", error)
    return NextResponse.json({ error: "Failed to fetch division content" }, { status: 500 })
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
