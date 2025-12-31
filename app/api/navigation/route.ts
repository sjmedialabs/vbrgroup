import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, Navigation } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"

const DEFAULT_TENANT = "kisan-plant-technologies"

// GET - Fetch navigation
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") as "header" | "footer" | null
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()

      if (location) {
        const navigation = await Navigation.findOne({ tenantSlug: tenant, location }).lean()
        if (navigation) {
          return NextResponse.json({ navigation })
        }
      } else {
        const [header, footer] = await Promise.all([
          Navigation.findOne({ tenantSlug: tenant, location: "header" }).lean(),
          Navigation.findOne({ tenantSlug: tenant, location: "footer" }).lean(),
        ])
        if (header || footer) {
          return NextResponse.json({ header, footer })
        }
      }
    } catch (error) {
      console.error("MongoDB navigation fetch error:", error)
    }
  }

  // Fallback to mock data
  if (location === "header") {
    return NextResponse.json({ navigation: dataStore.headerNav })
  } else if (location === "footer") {
    return NextResponse.json({ navigation: dataStore.footerNav })
  }

  return NextResponse.json({
    header: dataStore.headerNav,
    footer: dataStore.footerNav,
  })
}

// PUT - Update navigation
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") as "header" | "footer"
    const tenant = searchParams.get("tenant") || DEFAULT_TENANT

    if (!location) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 })
    }

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()

        const navigation = await Navigation.findOneAndUpdate(
          { tenantSlug: tenant, location },
          { ...body, tenantSlug: tenant, location },
          { upsert: true, new: true, runValidators: true },
        ).lean()

        return NextResponse.json({ navigation })
      } catch (error) {
        console.error("MongoDB navigation update error:", error)
      }
    }

    // Fallback to mock data
    if (location === "header") {
      dataStore.headerNav = { ...dataStore.headerNav, ...body, updatedAt: new Date() }
      return NextResponse.json({ navigation: dataStore.headerNav })
    } else if (location === "footer") {
      dataStore.footerNav = { ...dataStore.footerNav, ...body, updatedAt: new Date() }
      return NextResponse.json({ navigation: dataStore.footerNav })
    }

    return NextResponse.json({ error: "Invalid location" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
