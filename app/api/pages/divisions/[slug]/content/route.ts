import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Division } from "@/lib/db"

const DEFAULT_TENANT = "kisan-plant-technologies"

// Function to generate default content for a division
function getDefaultContent(divisionName: string, slug: string) {
  return {
    hero: {
      title: `Welcome to\n${divisionName}`,
      subtitle: `Innovative solutions and services from ${divisionName}`,
      backgroundImage: "/images/division-hero.jpg",
    },
    about: {
      badge: "About Us",
      title: `About ${divisionName}`,
      description: [
        `${divisionName} is dedicated to providing innovative and sustainable solutions in agriculture and technology.`,
        `We combine cutting-edge technology with traditional knowledge to deliver exceptional results for our clients.`,
        `Our team of experts is committed to excellence and customer satisfaction.`,
      ],
    },
    services: {
      badge: "Our Services",
      title: `${divisionName}\nServices`,
      subtitle: "Comprehensive solutions tailored to your needs",
      tabs: [
        {
          id: "service-1",
          title: "Service 1",
          number: "01",
          heading: "Primary Service",
          description: [
            "Our primary service offering provides comprehensive solutions for your needs.",
            "We use cutting-edge technology and best practices to deliver exceptional results.",
          ],
          image: "/images/service-1.jpg",
        },
        {
          id: "service-2",
          title: "Service 2",
          number: "02",
          heading: "Advanced Solutions",
          description: [
            "Advanced solutions designed to optimize your operations and increase efficiency.",
            "Our expert team ensures seamless implementation and ongoing support.",
          ],
          image: "/images/service-2.jpg",
        },
        {
          id: "service-3",
          title: "Service 3",
          number: "03",
          heading: "Consulting Services",
          description: [
            "Expert consulting to help you make informed decisions and achieve your goals.",
            "We provide strategic guidance and actionable insights for your business.",
          ],
          image: "/images/service-3.jpg",
        },
      ],
    },
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (!isMongoDBConfigured()) {
    return NextResponse.json(
      { error: "Database not configured. Please run migration first." }, 
      { status: 500 }
    )
  }

  try {
    await connectToDatabase()
    const division = await Division.findOne({
      tenantSlug: tenant,
      slug,
      isActive: true,
    }).lean()

    if (!division) {
      return NextResponse.json(
        { error: "Division not found. Please create it in admin panel or run migration." }, 
        { status: 404 }
      )
    }

    // If division has configured content, return it
    if (division.pageContent && Object.keys(division.pageContent).length > 0) {
      return NextResponse.json({ content: division.pageContent })
    }

    // Otherwise, return default content based on division name
    const defaultContent = getDefaultContent(division.name, division.slug)
    return NextResponse.json({ content: defaultContent })
  } catch (error) {
    console.error("Error fetching division content:", error)
    return NextResponse.json(
      { error: "Failed to fetch division content" }, 
      { status: 500 }
    )
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
    return NextResponse.json(
      { error: "Database not configured" }, 
      { status: 500 }
    )
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
      return NextResponse.json(
        { error: "Division not found" }, 
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, content: division.pageContent })
  } catch (error) {
    console.error("Error updating division content:", error)
    return NextResponse.json(
      { error: "Failed to update division content" }, 
      { status: 500 }
    )
  }
}
