import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Branding } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"

const DEFAULT_TENANT = "kisan-plant-technologies"

// GET - Fetch branding settings
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()
      const branding = await Branding.findOne({ tenantSlug: tenant }).lean()
      if (branding) {
        return NextResponse.json({ branding })
      }
    } catch (error) {
      console.error("MongoDB branding fetch error:", error)
    }
  }

  // Fallback to mock data
  if (dataStore.branding.tenantSlug === tenant) {
    return NextResponse.json({ branding: dataStore.branding })
  }

  return NextResponse.json({ error: "Branding not found" }, { status: 404 })
}

// PUT - Update branding settings
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const tenant = searchParams.get("tenant") || DEFAULT_TENANT

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        const branding = await Branding.findOneAndUpdate(
          { tenantSlug: tenant },
          { ...body, tenantSlug: tenant },
          { upsert: true, new: true, runValidators: true },
        ).lean()
        return NextResponse.json({ branding })
      } catch (error) {
        console.error("MongoDB branding update error:", error)
      }
    }

    // Fallback to mock data
    if (dataStore.branding.tenantSlug === tenant) {
      dataStore.branding = {
        ...dataStore.branding,
        ...body,
        updatedAt: new Date(),
      }
      return NextResponse.json({ branding: dataStore.branding })
    }

    return NextResponse.json({ error: "Branding not found" }, { status: 404 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
