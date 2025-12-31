import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

const defaultLeadershipContent = {
  hero: {
    title: "Leadership",
    backgroundImage: "/images/image-209.png",
  },
  content: {
    badge: "Leadership",
    title: "Visionary leadership driving innovation, sustainability, and the future of Indian agriculture.",
    paragraphs: [
      "Kisan Plant Technologies Pvt. Ltd. is driven by visionary leadership that combines entrepreneurial foresight with deep domain expertise in agriculture and technology. Under the guidance of its founder-led management, the company is built on a strong commitment to innovation, farmer-centric solutions, and sustainable growth. The leadership team actively steers strategy, execution, and long-term value creation—ensuring every initiative aligns with the mission of transforming Indian agriculture through intelligent, integrated solutions.",
    ],
    image: "/images/leaderhip-20image.png",
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || "default"

  const tenantContent = dataStore.pageContents?.[tenant]?.leadership || defaultLeadershipContent

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

    dataStore.pageContents[tenant].leadership = content

    return NextResponse.json({ success: true, content })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
