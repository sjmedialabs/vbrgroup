import { type NextRequest, NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const page = dataStore.pages.find((p) => p._id === id || p.slug === id)

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({ page })
  } catch (error) {
    console.error("Get page error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = dataStore.pages.findIndex((p) => p._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    dataStore.pages[index] = {
      ...dataStore.pages[index],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ page: dataStore.pages[index] })
  } catch (error) {
    console.error("Update page error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const index = dataStore.pages.findIndex((p) => p._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    dataStore.pages.splice(index, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete page error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
