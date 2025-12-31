import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Application, Job } from "@/lib/db"
import { dataStore, generateId } from "@/lib/mock-data"
import type { JobApplication } from "@/lib/db/schemas"
import { shouldUseMockFallback, handleDatabaseUnavailable } from "@/lib/db/config"

const DEFAULT_TENANT = "kisan-plant-technologies"

// GET - Fetch all job applications
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT
  const jobId = searchParams.get("jobId")
  const status = searchParams.get("status")

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const query: Record<string, unknown> = { tenantSlug: tenant }
      if (jobId) query.jobId = jobId
      if (status) query.status = status

      const applications = await Application.find(query).sort({ createdAt: -1 }).lean()
      return NextResponse.json({ applications, total: applications.length })
    } catch (error) {
      console.error("MongoDB applications fetch error:", error)
      handleDatabaseUnavailable(error as Error)
    }
  }

  // Fallback to mock data (only in development)
  if (shouldUseMockFallback()) {
    let applications = dataStore.jobApplications.filter((a) => a.tenantSlug === tenant)
    if (jobId) {
      applications = applications.filter((a) => a.jobId === jobId)
    }
    if (status) {
      applications = applications.filter((a) => a.status === status)
    }
    return NextResponse.json({ applications, total: applications.length })
  }

  return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
}

// POST - Submit job application
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jobId, name, email, phone, resumeUrl, coverLetter, linkedIn, portfolio } = body

    if (!jobId || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()

        const job = await Job.findById(jobId).lean()
        if (!job) {
          return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        const application = await Application.create({
          tenantSlug: DEFAULT_TENANT,
          jobId,
          jobTitle: job.title,
          name,
          email,
          phone,
          resumeUrl,
          coverLetter,
          linkedIn,
          portfolio,
          status: "new",
        })

        return NextResponse.json({ application, success: true })
      } catch (error) {
        console.error("MongoDB application create error:", error)
        handleDatabaseUnavailable(error as Error)
      }
    }

    // Fallback to mock data (only in development)
    if (shouldUseMockFallback()) {
      const job = dataStore.jobOpenings.find((j) => j._id === jobId)
      if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 })
      }

      const newApplication: JobApplication = {
        _id: generateId(),
        tenantSlug: DEFAULT_TENANT,
        jobId,
        jobTitle: job.title,
        name,
        email,
        phone,
        resumeUrl: resumeUrl || "",
        coverLetter,
        linkedIn,
        portfolio,
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dataStore.jobApplications.push(newApplication)
      return NextResponse.json({ application: newApplication, success: true })
    }

    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
