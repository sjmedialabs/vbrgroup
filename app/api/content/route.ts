import { NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

// GET - Fetch page content
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || "kisan-plant-technologies"
  const slug = searchParams.get("slug") || "home"

  const page = dataStore.pages.find((p) => p.tenantSlug === tenant && p.slug === slug)

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 })
  }

  return NextResponse.json({ page })
}
