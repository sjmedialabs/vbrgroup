import { NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

// GET - Fetch single job
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const job = dataStore.jobOpenings.find((j) => j._id === id)

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  return NextResponse.json({ job })
}

// PUT - Update job
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = dataStore.jobOpenings.findIndex((j) => j._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    dataStore.jobOpenings[index] = {
      ...dataStore.jobOpenings[index],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ job: dataStore.jobOpenings[index] })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

// DELETE - Delete job
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = dataStore.jobOpenings.findIndex((j) => j._id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  dataStore.jobOpenings.splice(index, 1)
  return NextResponse.json({ success: true })
}
