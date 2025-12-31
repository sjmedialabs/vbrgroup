import { NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

// GET - Fetch single lead
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = dataStore.leads.find((l) => l._id === id)

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 })
  }

  return NextResponse.json({ lead })
}

// PUT - Update lead status/notes
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = dataStore.leads.findIndex((l) => l._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    dataStore.leads[index] = {
      ...dataStore.leads[index],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ lead: dataStore.leads[index] })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

// DELETE - Delete lead
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = dataStore.leads.findIndex((l) => l._id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 })
  }

  dataStore.leads.splice(index, 1)
  return NextResponse.json({ success: true })
}
