import { NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

// GET - Fetch single application
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const application = dataStore.jobApplications.find((a) => a._id === id)

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  return NextResponse.json({ application })
}

// PUT - Update application status
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const index = dataStore.jobApplications.findIndex((a) => a._id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    dataStore.jobApplications[index] = {
      ...dataStore.jobApplications[index],
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ application: dataStore.jobApplications[index] })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

// DELETE - Delete application
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = dataStore.jobApplications.findIndex((a) => a._id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 })
  }

  dataStore.jobApplications.splice(index, 1)
  return NextResponse.json({ success: true })
}
