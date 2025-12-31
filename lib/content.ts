import type { Page, Tenant } from "./db/schemas"

// Mock page content for preview
const mockHomePage: Page = {
  _id: "page-home",
  tenantSlug: "kisan-plant-technologies",
  slug: "home",
  title: "Kisan Plant Technologies - Home",
  metaDescription: "Innovating green futures",
  isPublished: true,
  sections: [
    { id: "hero-1", type: "hero", order: 0, content: {} },
    { id: "about-1", type: "about", order: 1, content: {} },
    { id: "divisions-1", type: "divisions", order: 2, content: {} },
    { id: "sustainability-1", type: "sustainability", order: 3, content: {} },
    { id: "projects-1", type: "projects", order: 4, content: {} },
    { id: "testimonials-1", type: "testimonials", order: 5, content: {} },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockTenant: Tenant = {
  _id: "tenant-1" as any,
  name: "Kisan Plant Technologies",
  slug: "kisan-plant-technologies",
  theme: {
    primaryColor: "#2d8a39",
    secondaryColor: "#1e3a1e",
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

export async function getPageContent(tenantSlug: string, pageSlug: string): Promise<Page | null> {
  if (tenantSlug === "kisan-plant-technologies" && (pageSlug === "home" || pageSlug === "")) {
    return mockHomePage
  }
  return null
}

export async function getTenant(slug: string): Promise<Tenant | null> {
  if (slug === "kisan-plant-technologies") {
    return mockTenant
  }
  return null
}

export async function getTenantPages(tenantSlug: string): Promise<Page[]> {
  if (tenantSlug === "kisan-plant-technologies") {
    return [mockHomePage]
  }
  return []
}
