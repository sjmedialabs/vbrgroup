import { NextResponse } from "next/server"
import { dataStore, generateId } from "@/lib/mock-data"
import type { Tenant } from "@/lib/db/schemas"

export async function GET() {
  try {
    return NextResponse.json({ tenants: dataStore.tenants })
  } catch (error) {
    console.error("Get tenants error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, domain, primaryColor, secondaryColor, logo, favicon } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    // Check if slug already exists
    const existingTenant = dataStore.tenants.find((t) => t.slug === slug)
    if (existingTenant) {
      return NextResponse.json({ error: "A website with this slug already exists" }, { status: 400 })
    }

    const newTenant: Tenant = {
      _id: generateId(),
      name,
      slug,
      domain: domain || "",
      theme: {
        primaryColor: primaryColor || "#2d8a39",
        secondaryColor: secondaryColor || "#1e3a1e",
      },
      settings: {
        logo: logo || "/images/logo-header.png",
        favicon: favicon || "/favicon.ico",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    dataStore.tenants.push(newTenant)

    return NextResponse.json({ tenant: newTenant, message: "Website created successfully" })
  } catch (error) {
    console.error("Create tenant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
