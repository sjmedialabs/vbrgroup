import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Division } from "@/lib/db"

const DEFAULT_TENANT = "kisan-plant-technologies"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const defaultPageContent = {
  hero: {
    title: "New Division",
    subtitle: "Innovative solutions for the future",
    backgroundImage: "/images/banner-2.png",
  },
  about: {
    badge: "About",
    title: "About This Division",
    description: ["Add description here"],
  },
  services: {
    badge: "Our Services",
    title: "What We Offer",
    subtitle: "Comprehensive solutions tailored to your needs",
    tabs: [
      {
        id: "service-1",
        title: "Service 1",
        number: "01",
        heading: "Service 1",
        description: ["Service description here"],
        image: "/images/project-1.png",
      },
    ],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json({ divisions: [] })
  }

  try {
    await connectToDatabase()
    const divisions = await Division.find({ tenantSlug: tenant, isActive: true })
      .sort({ order: 1 })
      .select("_id slug name tagline subtitle order")
      .lean()

    return NextResponse.json({
      divisions: divisions.map((d) => ({
        id: d._id.toString(),
        slug: d.slug,
        name: d.name,
        tagline: d.tagline,
        subtitle: d.subtitle,
        order: d.order,
      })),
    })
  } catch (error) {
    console.error("Error fetching divisions:", error)
    return NextResponse.json({ error: "Failed to fetch divisions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { name, slug: customSlug, tagline, subtitle } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    await connectToDatabase()

    const slug = customSlug || slugify(name)

    // Check if slug already exists for this tenant
    const existing = await Division.findOne({ tenantSlug: tenant, slug })
    if (existing) {
      return NextResponse.json({ error: "A division with this slug already exists" }, { status: 409 })
    }

    // Get the highest order number
    const lastDivision = await Division.findOne({ tenantSlug: tenant }).sort({ order: -1 }).select("order")
    const order = lastDivision ? lastDivision.order + 1 : 0

    const division = await Division.create({
      tenantSlug: tenant,
      slug,
      name,
      tagline: tagline || "",
      subtitle: subtitle || "",
      description: "",
      heroImage: "/images/banner-2.png",
      cardImage: "/images/banner-2.png",
      pageContent: defaultPageContent,
      order,
      isActive: true,
    })

    return NextResponse.json({
      success: true,
      division: {
        id: division._id.toString(),
        slug: division.slug,
        name: division.name,
        tagline: division.tagline,
        subtitle: division.subtitle,
      },
    })
  } catch (error) {
    console.error("Error creating division:", error)
    return NextResponse.json({ error: "Failed to create division" }, { status: 500 })
  }
}
