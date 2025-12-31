import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Lead } from "@/lib/db"
import { dataStore, generateId } from "@/lib/mock-data"
import type { Lead as LeadType } from "@/lib/db/schemas"
import { shouldUseMockFallback, handleDatabaseUnavailable } from "@/lib/db/config"

const DEFAULT_TENANT = "kisan-plant-technologies"

// GET - Fetch all leads
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT
  const status = searchParams.get("status")

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const query: Record<string, unknown> = { tenantSlug: tenant }
      if (status) query.status = status

      const leads = await Lead.find(query).sort({ createdAt: -1 }).lean()
      return NextResponse.json({ leads, total: leads.length })
    } catch (error) {
      console.error("MongoDB leads fetch error:", error)
      handleDatabaseUnavailable(error as Error)
    }
  }

  // Fallback to mock data (only in development)
  if (shouldUseMockFallback()) {
    let leads = dataStore.leads.filter((l) => l.tenantSlug === tenant)
    if (status) {
      leads = leads.filter((l) => l.status === status)
    }
    return NextResponse.json({ leads, total: leads.length })
  }

  return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
}

// POST - Create new lead (contact form submission)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, subject, message, source } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const lead = await Lead.create({
          tenantSlug: DEFAULT_TENANT,
          name,
          email,
          phone,
          company,
          subject,
          message,
          source: source || "contact-page",
          status: "new",
        })
        return NextResponse.json({ lead, success: true })
      } catch (error) {
        console.error("MongoDB lead create error:", error)
        handleDatabaseUnavailable(error as Error)
      }
    }

    // Fallback to mock data (only in development)
    if (shouldUseMockFallback()) {
      const newLead: LeadType = {
        _id: generateId(),
        tenantSlug: DEFAULT_TENANT,
        name,
        email,
        phone,
        company,
        subject,
        message,
        source: source || "contact-page",
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      dataStore.leads.push(newLead)
      return NextResponse.json({ lead: newLead, success: true })
    }

    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
