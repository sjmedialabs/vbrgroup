import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"
import { shouldUseMockFallback, handleDatabaseUnavailable } from "@/lib/db/config"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultLeadershipContent = {
  hero: {
    title: "Our Leadership",
    backgroundImage: "/images/leadership-hero.jpg",
  },
  content: {
    badge: "Leadership",
    title: "Visionary Leaders Driving Innovation",
    paragraphs: [
      "Our leadership team comprises experienced professionals with deep expertise in agriculture, technology, and sustainable business practices. They guide our mission to transform traditional farming through innovation and digital solutions.",
      "With decades of combined experience, our leaders bring strategic vision, operational excellence, and a commitment to making agriculture more productive, sustainable, and profitable for farmers across India.",
      "Their dedication to excellence and innovation has positioned VBR Group as a trusted partner for thousands of farmers, helping them adopt modern practices and achieve better outcomes.",
    ],
    image: "/images/leadership-team.jpg",
  },
}

export async function GET(request: NextRequest) {
  const tenant = request.nextUrl.searchParams.get("tenant") || DEFAULT_TENANT

  if (shouldUseMockFallback()) {
    return NextResponse.json({
      content: dataStore.leadership || defaultLeadershipContent,
    })
  }

  if (!isMongoDBConfigured()) {
    return handleDatabaseUnavailable()
  }

  try {
    await connectToDatabase()

    const pageContent = await PageContent.findOne({
      tenant,
      pageType: "leadership",
    }).lean()

    if (pageContent && pageContent.content) {
      return NextResponse.json({ content: pageContent.content })
    }

    // Return default content if no database entry exists
    return NextResponse.json({ content: defaultLeadershipContent })
  } catch (error) {
    console.error("Error fetching leadership content:", error)
    return NextResponse.json({ content: defaultLeadershipContent })
  }
}

export async function PUT(request: NextRequest) {
  const tenant = request.nextUrl.searchParams.get("tenant") || DEFAULT_TENANT

  if (shouldUseMockFallback()) {
    const { content } = await request.json()
    dataStore.leadership = content
    return NextResponse.json({ success: true })
  }

  if (!isMongoDBConfigured()) {
    return handleDatabaseUnavailable()
  }

  try {
    await connectToDatabase()

    const { content } = await request.json()

    await PageContent.findOneAndUpdate(
      { tenant, pageType: "leadership" },
      {
        $set: {
          tenant,
          pageType: "leadership",
          content,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating leadership content:", error)
    return NextResponse.json({ success: false, error: "Failed to update content" }, { status: 500 })
  }
}
