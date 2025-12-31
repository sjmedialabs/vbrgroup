import { type NextRequest, NextResponse } from "next/server"
import { dataStore, generateId } from "@/lib/mock-data"
import type { Page } from "@/lib/db/schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantSlug = searchParams.get("tenant") || "kisan-plant-technologies"

    const pages = dataStore.pages.filter((p) => p.tenantSlug === tenantSlug)
    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Get pages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tenantSlug = "kisan-plant-technologies", slug, title, metaTitle, metaDescription, sections = [] } = body

    const page: Page = {
      _id: generateId(),
      tenantSlug,
      slug,
      title,
      metaTitle: metaTitle || title,
      metaDescription,
      sections,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    dataStore.pages.push(page)
    return NextResponse.json({ page })
  } catch (error) {
    console.error("Create page error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
