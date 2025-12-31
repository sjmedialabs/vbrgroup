import { type NextRequest, NextResponse } from "next/server"
import { getPageContent } from "@/lib/content"

// Public API endpoint for fetching page content
export async function GET(request: NextRequest, { params }: { params: Promise<{ tenant: string; slug: string }> }) {
  try {
    const { tenant, slug } = await params
    const page = await getPageContent(tenant, slug)

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({ page })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
