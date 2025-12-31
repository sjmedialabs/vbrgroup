import { NextResponse } from "next/server"
import { dataStore } from "@/lib/mock-data"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const tenant = dataStore.tenants.find((t) => t._id === id || t.slug === id)

    if (!tenant) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 })
    }

    return NextResponse.json({ tenant })
  } catch (error) {
    console.error("Get tenant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, domain, primaryColor, secondaryColor, logo, favicon, isActive } = body

    const tenantIndex = dataStore.tenants.findIndex((t) => t._id === id || t.slug === id)

    if (tenantIndex === -1) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 })
    }

    const updatedTenant = {
      ...dataStore.tenants[tenantIndex],
      name: name || dataStore.tenants[tenantIndex].name,
      domain: domain !== undefined ? domain : dataStore.tenants[tenantIndex].domain,
      theme: {
        primaryColor: primaryColor || dataStore.tenants[tenantIndex].theme?.primaryColor || "#2d8a39",
        secondaryColor: secondaryColor || dataStore.tenants[tenantIndex].theme?.secondaryColor || "#1e3a1e",
      },
      settings: {
        ...dataStore.tenants[tenantIndex].settings,
        logo: logo || dataStore.tenants[tenantIndex].settings?.logo,
        favicon: favicon || dataStore.tenants[tenantIndex].settings?.favicon,
      },
      isActive: isActive !== undefined ? isActive : dataStore.tenants[tenantIndex].isActive,
      updatedAt: new Date(),
    }

    dataStore.tenants[tenantIndex] = updatedTenant

    return NextResponse.json({ tenant: updatedTenant, message: "Website updated successfully" })
  } catch (error) {
    console.error("Update tenant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const tenantIndex = dataStore.tenants.findIndex((t) => t._id === id || t.slug === id)

    if (tenantIndex === -1) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 })
    }

    // Prevent deleting the last website
    if (dataStore.tenants.length === 1) {
      return NextResponse.json({ error: "Cannot delete the last website" }, { status: 400 })
    }

    dataStore.tenants.splice(tenantIndex, 1)

    return NextResponse.json({ message: "Website deleted successfully" })
  } catch (error) {
    console.error("Delete tenant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
