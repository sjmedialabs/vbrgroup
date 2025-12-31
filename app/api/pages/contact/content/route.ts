import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured, PageContent, Office } from "@/lib/db"
import { dataStore } from "@/lib/mock-data"
import { shouldUseMockFallback, handleDatabaseUnavailable } from "@/lib/db/config"

const DEFAULT_TENANT = "kisan-plant-technologies"

const defaultContactContent = {
  hero: {
    title: "Let's Build the Future Together",
    backgroundImage: "/images/contact-hero.jpg",
  },
  phoneBar: {
    tollFree: { label: "Toll Free No:", number: "1800-123456-123789" },
    customerCare: { label: "Customer Care Number:", number: "1800-425-9339" },
  },
  officeAddresses: {
    title: "Our Office Addresses",
    offices: [
      {
        type: "Head Office",
        name: "VBR Towers, Knoledge Towers",
        address: "Madhapur, Raidurg,",
        city: "Telangana - 500008",
        isHeadOffice: true,
      },
      {
        type: "Branch-1",
        name: "Hyderabad",
        address: "Plot No. 45, Tech Park",
        city: "Hyderabad - 500081",
        isHeadOffice: false,
      },
      {
        type: "Branch-2",
        name: "Vishakapatnam",
        address: "Door No. 12-5-8, MVP Colony",
        city: "Vishakapatnam - 530017",
        isHeadOffice: false,
      },
      {
        type: "Branch-3",
        name: "Vijayawada",
        address: "Opp. PVP Square, MG Road",
        city: "Vijayawada - 520010",
        isHeadOffice: false,
      },
      {
        type: "Branch-4",
        name: "Karimnagar",
        address: "Near Clock Tower, Jagtial Road",
        city: "Karimnagar - 505001",
        isHeadOffice: false,
      },
      {
        type: "Branch-5",
        name: "Warangal",
        address: "Hanamkonda Main Road",
        city: "Warangal - 506001",
        isHeadOffice: false,
      },
    ],
  },
  contactInfo: {
    mediaEnquiries: { label: "Media Enquiries :", email: "enquiry@kisanplanttechnologies.com" },
    contactNumbers: { label: "Contact Number:", numbers: ["+91-9848123456", "99491237894"] },
    emails: { label: "Email:", addresses: ["info@kisanplanttechnologies.com", "Support@kisanplanttechnologies.com"] },
  },
  socialMedia: {
    title: "SOCIAL MEDIA CHANNELS",
    channels: [
      { name: "Facebook", url: "#" },
      { name: "Twitter", url: "#" },
      { name: "Instagram", url: "#" },
      { name: "Linkedin", url: "#" },
      { name: "youtube", url: "#" },
    ],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  if (isMongoDBConfigured()) {
    try {
      await connectToDatabase()

      // Fetch page content and offices in parallel
      const [pageContent, offices] = await Promise.all([
        PageContent.findOne({ tenantSlug: tenant, pageType: "contact" }).lean(),
        Office.find({ tenantSlug: tenant, isActive: true }).sort({ order: 1 }).lean(),
      ])

      if (pageContent) {
        // Merge offices from database if available
        const content = pageContent.content as typeof defaultContactContent
        if (offices.length > 0) {
          content.officeAddresses.offices = offices.map((office) => ({
            type: office.type === "head" ? "Head Office" : office.name,
            name: office.type === "head" ? office.address : office.city,
            address: office.fullAddress?.split(",")[0] || office.address,
            city: office.fullAddress?.split(",").slice(1).join(",").trim() || office.city,
            isHeadOffice: office.type === "head",
          }))
        }
        return NextResponse.json({ content })
      }
    } catch (error) {
      console.error("MongoDB contact content fetch error:", error)
      handleDatabaseUnavailable(error as Error)
    }
  }

  // Fallback to mock data (only in development)
  if (shouldUseMockFallback()) {
    const tenantContent = dataStore.pageContents?.[tenant]?.contact || defaultContactContent
    return NextResponse.json({ content: tenantContent })
  }

  // If nothing is available, return an error with proper JSON
  return NextResponse.json(
    { error: "Content not found", content: null },
    { status: 404 }
  )
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tenant = searchParams.get("tenant") || DEFAULT_TENANT

  try {
    const { content } = await request.json()

    if (isMongoDBConfigured()) {
      try {
        await connectToDatabase()
        await PageContent.findOneAndUpdate(
          { tenantSlug: tenant, pageType: "contact" },
          { tenantSlug: tenant, pageType: "contact", content, isActive: true },
          { upsert: true, new: true },
        )
        return NextResponse.json({ success: true, content })
      } catch (error) {
        console.error("MongoDB contact content update error:", error)
        handleDatabaseUnavailable(error as Error)
      }
    }

    // Fallback to mock data (only in development)
    if (shouldUseMockFallback()) {
      if (!dataStore.pageContents) dataStore.pageContents = {}
      if (!dataStore.pageContents[tenant]) dataStore.pageContents[tenant] = {}
      dataStore.pageContents[tenant].contact = content
      return NextResponse.json({ success: true, content })
    }

    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
