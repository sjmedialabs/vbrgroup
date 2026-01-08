import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Application } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"
import { shouldUseMockFallback, handleDatabaseUnavailable } from "@/lib/db/config"

// GET - Fetch single application
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const application = await Application.findById(id).lean()
      
      if (!application) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }
      
      return NextResponse.json({ application })
    } catch (error) {
      console.error("MongoDB application fetch error:", error)
      handleDatabaseUnavailable(error as Error)
    }
  }

  // Fallback to mock data
  if (shouldUseMockFallback()) {
    const application = dataStore.jobApplications.find((a) => a._id === id)
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }
    return NextResponse.json({ application })
  }

  return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
}

// PUT - Update application status
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const application = await Application.findByIdAndUpdate(
          id,
          { ...body, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).lean()

        if (!application) {
          return NextResponse.json({ error: "Application not found" }, { status: 404 })
        }

        return NextResponse.json({ application })
      } catch (error) {
        console.error("MongoDB application update error:", error)
        handleDatabaseUnavailable(error as Error)
      }
    }

    // Fallback to mock data
    if (shouldUseMockFallback()) {
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
    }

    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

// DELETE - Delete application
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id} = await params

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const application = await Application.findByIdAndDelete(id).lean()

      if (!application) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, application })
    } catch (error) {
      console.error("MongoDB application delete error:", error)
      handleDatabaseUnavailable(error as Error)
    }
  }

  // Fallback to mock data
  if (shouldUseMockFallback()) {
    const index = dataStore.jobApplications.findIndex((a) => a._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    dataStore.jobApplications.splice(index, 1)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
}
