import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Job } from "@/lib/db"
import { dataStore, generateId } from "@/lib/mock-data"
import type { JobOpening } from "@/lib/db/schemas"

const DEFAULT_TENANT = "kisan-plant-technologies"

// GET - Fetch all job openings
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT
  const activeOnly = searchParams.get("active") === "true"

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const query: Record<string, unknown> = { tenantSlug: tenant }
      if (activeOnly) {
        query.isActive = true
      }
      const jobs = await Job.find(query).sort({ createdAt: -1 }).lean()
      return NextResponse.json({ jobs, total: jobs.length })
    } catch (error) {
      console.error("MongoDB jobs fetch error:", error)
    }
  }

  // Fallback to mock data
  let jobs = dataStore.jobOpenings.filter((j) => j.tenantSlug === tenant)
  if (activeOnly) {
    jobs = jobs.filter((j) => j.isActive)
  }

  return NextResponse.json({ jobs, total: jobs.length })
}

// POST - Create new job opening
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tenant = DEFAULT_TENANT

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const job = await Job.create({
          ...body,
          tenantSlug: tenant,
          isActive: true,
        })
        return NextResponse.json({ job })
      } catch (error) {
        console.error("MongoDB job create error:", error)
      }
    }

    // Fallback to mock data
    const newJob: JobOpening = {
      _id: generateId(),
      tenantSlug: tenant,
      ...body,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    dataStore.jobOpenings.push(newJob)

    return NextResponse.json({ job: newJob })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
