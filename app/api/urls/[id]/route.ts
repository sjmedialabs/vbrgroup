import { NextResponse } from "next/server"

// In-memory store reference (would be imported from a shared store in production)
const urlRedirects: {
  _id?: string
  sourceUrl: string
  targetUrl: string
  type: string
  isActive: boolean
  updatedAt: Date
}[] = []

// GET - Fetch single URL redirect
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const url = urlRedirects.find((u) => u._id === id)

  if (!url) {
    return NextResponse.json({ error: "URL redirect not found" }, { status: 404 })
  }

  return NextResponse.json({ url })
}

// PUT - Update URL redirect
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = urlRedirects.findIndex((u) => u._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "URL redirect not found" }, { status: 404 })
    }

    urlRedirects[index] = {
      ...urlRedirects[index],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ url: urlRedirects[index] })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

// DELETE - Delete URL redirect
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = urlRedirects.findIndex((u) => u._id === id)

  if (index === -1) {
    return NextResponse.json({ error: "URL redirect not found" }, { status: 404 })
  }

  urlRedirects.splice(index, 1)
  return NextResponse.json({ success: true })
}
