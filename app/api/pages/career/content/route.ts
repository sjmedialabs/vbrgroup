import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

const defaultCareerContent = {
  hero: {
    title: "Career",
    backgroundImage: "/images/career-hero.png",
  },
  intro: {
    badge: "Join Our Team",
    title: "BUILD YOUR CAREER WITH US",
    description:
      "Be part of the green revolution. Join a team that's transforming agriculture through innovation and sustainability.",
  },
  benefits: {
    title: "Why Join Us",
    items: [],
  },
  culture: {
    title: "Our Culture",
    description:
      "At Kisan Plant Technologies, we foster a culture of innovation, collaboration, and continuous learning.",
    images: [],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || "default"

  const tenantContent = dataStore.pageContents?.[tenant]?.career || defaultCareerContent

  return NextResponse.json({ content: tenantContent })
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || "default"

  try {
    const { content } = await request.json()

    if (!dataStore.pageContents) {
      dataStore.pageContents = {}
    }
    if (!dataStore.pageContents[tenant]) {
      dataStore.pageContents[tenant] = {}
    }

    dataStore.pageContents[tenant].career = content

    return NextResponse.json({ success: true, content })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
