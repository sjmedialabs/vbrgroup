import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Job } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"
import { shouldUseMockFallback, handleDatabaseUnavailable } from "@/lib/db/config"

// GET - Fetch single job
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const job = await Job.findById(id).lean()
      
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 })
      }
      
      return NextResponse.json({ job })
    } catch (error) {
      console.error("MongoDB job fetch error:", error)
      handleDatabaseUnavailable(error as Error)
    }
  }

  // Fallback to mock data
  if (shouldUseMockFallback()) {
    const job = dataStore.jobOpenings.find((j) => j._id === id)
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    return NextResponse.json({ job })
  }

  return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
}

// PUT - Update job
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const job = await Job.findByIdAndUpdate(
          id,
          { ...body, updatedAt: new Date() },
          { new: true, runValidators: true }
        ).lean()

        if (!job) {
          return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        return NextResponse.json({ job })
      } catch (error) {
        console.error("MongoDB job update error:", error)
        handleDatabaseUnavailable(error as Error)
      }
    }

    // Fallback to mock data
    if (shouldUseMockFallback()) {
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
    }

    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

// DELETE - Delete job
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const job = await Job.findByIdAndDelete(id).lean()

      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, job })
    } catch (error) {
      console.error("MongoDB job delete error:", error)
      handleDatabaseUnavailable(error as Error)
    }
  }

  // Fallback to mock data
  if (shouldUseMockFallback()) {
    const index = dataStore.jobOpenings.findIndex((j) => j._id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    dataStore.jobOpenings.splice(index, 1)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
}
