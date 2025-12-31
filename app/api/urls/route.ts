import { NextResponse } from "next/server"
import { generateId } from "@/lib/mock-data"
import type { URLRedirect } from "@/lib/db/schemas"

// In-memory store for URL redirects
const urlRedirects: URLRedirect[] = []

// GET - Fetch all URL redirects
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || "kisan-plant-technologies"

  const urls = urlRedirects.filter((u) => u.tenantSlug === tenant)
  return NextResponse.json({ urls, total: urls.length })
}

// POST - Create new URL redirect
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sourceUrl, targetUrl, type = "301", isActive = true } = body

    if (!sourceUrl || !targetUrl) {
      return NextResponse.json({ error: "Source and target URLs are required" }, { status: 400 })
    }

    const newUrl: URLRedirect = {
      _id: generateId(),
      tenantSlug: "kisan-plant-technologies",
      sourceUrl,
      targetUrl,
      type,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    urlRedirects.push(newUrl)

    return NextResponse.json({ url: newUrl })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
