import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured } from "@/lib/db"
import {
  Tenant,
  Branding,
  Navigation,
  PageContent,
  Division,
  Service,
  Project,
  ProjectCategory,
  Job,
  Office,
} from "@/lib/db/models"

const DEFAULT_TENANT = "kisan-plant-technologies"

// Seed data for all collections
const seedData = {
  tenant: {
    slug: DEFAULT_TENANT,
    name: "Kisan Plant Technologies Pvt. Ltd.",
    domain: "kisanplanttechnologies.com",
    theme: { primaryColor: "#2E7D32", secondaryColor: "#1B5E20" },
    settings: {
      logo: "/images/vbr-logo.png",
      favicon: "/favicon.ico",
      siteTitle: "Kisan Plant Technologies",
      metaDescription: "Innovating Green Futures - Agricultural Technology Solutions",
    },
    isActive: true,
  },

  branding: {
    tenantSlug: DEFAULT_TENANT,
    headerLogo: "/images/vbr-logo.png",
    footerLogo: "/images/footer-logo.png",
    favicon: "/favicon.ico",
    siteTitle: "Kisan Plant Technologies",
    tagline: "Innovating Green Futures",
    primaryColor: "#2E7D32",
    secondaryColor: "#1B5E20",
    footerText: "KISAN PLANT TECHNOLOGIES",
    copyright: "© Copyright 2026 kisan agri tech. All Rights Reserved.",
    socialLinks: [
      { platform: "facebook", url: "https://facebook.com" },
      { platform: "twitter", url: "https://twitter.com" },
      { platform: "instagram", url: "https://instagram.com" },
      { platform: "linkedin", url: "https://linkedin.com" },
      { platform: "youtube", url: "https://youtube.com" },
    ],
    contactInfo: {
      emails: ["support@kisanagritech.com", "sales@kisanagritech.com"],
      phones: ["+91-9848123456", "99491237894"],
      address: "VBR Towers, Knowledge Towers, Madhapur, Raidurg, Telangana - 500008",
    },
  },

  headerNav: {
    tenantSlug: DEFAULT_TENANT,
    location: "header",
    items: [
      { id: "nav-1", label: "HOME", url: "/", order: 0 },
      {
        id: "nav-2",
        label: "ABOUT",
        url: "/about",
        order: 1,
        children: [
          { id: "about-1", label: "Who We are", url: "/about", order: 0 },
          { id: "about-2", label: "Vision & Mission", url: "/about#vision-mission", order: 1 },
          { id: "about-3", label: "Leadership", url: "/about/leadership", order: 2 },
        ],
      },
      {
        id: "nav-3",
        label: "DIVISIONS",
        url: "/divisions",
        order: 2,
        children: [
          { id: "div-1", label: "Kisan PLANTIQ", url: "/divisions/kisan-plantiq", order: 0 },
          { id: "div-2", label: "Kisan AGRIQ", url: "/divisions/kisan-agriq", order: 1 },
          { id: "div-3", label: "Kisan IRRIQ", url: "/divisions/kisan-irriq", order: 2 },
          { id: "div-4", label: "Kisan SECURE", url: "/divisions/kisan-secure", order: 3 },
          { id: "div-5", label: "GreenHabitat 360", url: "/divisions/greenhabitat-360", order: 4 },
          { id: "div-6", label: "Kisan VEDVAN", url: "/divisions/kisan-vedvan", order: 5 },
          { id: "div-7", label: "Kisan ORGANIQ", url: "/divisions/kisan-organiq", order: 6 },
          { id: "div-8", label: "KISAN FARM360", url: "/divisions/kisan-farm360", order: 7 },
        ],
      },
      { id: "nav-4", label: "SERVICES", url: "/services", order: 3 },
      { id: "nav-5", label: "PROJECTS", url: "/projects", order: 4 },
      { id: "nav-6", label: "SUSTAINABILITY", url: "/sustainability", order: 5 },
      { id: "nav-7", label: "CAREER", url: "/careers", order: 6 },
      { id: "nav-8", label: "GET IN TOUCH", url: "/contact", order: 7 },
    ],
  },

  footerNav: {
    tenantSlug: DEFAULT_TENANT,
    location: "footer",
    items: [
      { id: "fnav-1", label: "Home", url: "/", order: 0, group: "useful" },
      { id: "fnav-2", label: "Know Us", url: "/about", order: 1, group: "useful" },
      { id: "fnav-3", label: "Services", url: "/services", order: 2, group: "useful" },
      { id: "fnav-4", label: "Projects", url: "/projects", order: 3, group: "useful" },
      { id: "fnav-5", label: "Sustainability", url: "/sustainability", order: 4, group: "useful" },
      { id: "fnav-6", label: "Career", url: "/careers", order: 5, group: "useful" },
      { id: "fnav-7", label: "Contact us", url: "/contact", order: 6, group: "useful" },
      { id: "fnav-8", label: "Kisan PLANTIQ", url: "/divisions/kisan-plantiq", order: 0, group: "divisions" },
      { id: "fnav-9", label: "Kisan AGRIQ", url: "/divisions/kisan-agriq", order: 1, group: "divisions" },
      { id: "fnav-10", label: "Kisan IRRIQ", url: "/divisions/kisan-irriq", order: 2, group: "divisions" },
      { id: "fnav-11", label: "Kisan SECURE", url: "/divisions/kisan-secure", order: 3, group: "divisions" },
      { id: "fnav-12", label: "GreenHabitat 360", url: "/divisions/greenhabitat-360", order: 4, group: "divisions" },
      { id: "fnav-13", label: "Kisan VEDVAN", url: "/divisions/kisan-vedvan", order: 5, group: "divisions" },
      { id: "fnav-14", label: "Kisan ORGANIQ", url: "/divisions/kisan-organiq", order: 6, group: "divisions" },
      { id: "fnav-15", label: "KISAN FARM360", url: "/divisions/kisan-farm360", order: 7, group: "divisions" },
      { id: "fnav-16", label: "Facebook", url: "https://facebook.com", order: 0, group: "social", icon: "facebook" },
      { id: "fnav-17", label: "Twitter", url: "https://twitter.com", order: 1, group: "social", icon: "twitter" },
      { id: "fnav-18", label: "Instagram", url: "https://instagram.com", order: 2, group: "social", icon: "instagram" },
      { id: "fnav-19", label: "Linkedin", url: "https://linkedin.com", order: 3, group: "social", icon: "linkedin" },
      { id: "fnav-20", label: "YouTube", url: "https://youtube.com", order: 4, group: "social", icon: "youtube" },
    ],
  },

  offices: [
    {
      tenantSlug: DEFAULT_TENANT,
      name: "Head Office",
      type: "head",
      city: "Hyderabad",
      address: "VBR Towers, Knowledge Towers",
      fullAddress: "VBR Towers, Knowledge Towers, Madhapur, Raidurg, Telangana - 500008",
      order: 0,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      name: "Branch-1",
      type: "branch",
      city: "Hyderabad",
      address: "Plot No. 45, Tech Park",
      fullAddress: "Plot No. 45, Tech Park, HITEC City, Hyderabad - 500081",
      order: 1,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      name: "Branch-2",
      type: "branch",
      city: "Vishakapatnam",
      address: "Door No. 12-5-8, MVP Colony",
      fullAddress: "Door No. 12-5-8, MVP Colony, Vishakapatnam - 530017",
      order: 2,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      name: "Branch-3",
      type: "branch",
      city: "Vijayawada",
      address: "Opp. PVP Square, MG Road",
      fullAddress: "Opp. PVP Square, MG Road, Vijayawada - 520010",
      order: 3,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      name: "Branch-4",
      type: "branch",
      city: "Karimnagar",
      address: "Near Clock Tower, Jagtial Road",
      fullAddress: "Near Clock Tower, Jagtial Road, Karimnagar - 505001",
      order: 4,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      name: "Branch-5",
      type: "branch",
      city: "Warangal",
      address: "Hanamkonda Main Road",
      fullAddress: "Hanamkonda Main Road, Warangal - 506001",
      order: 5,
      isActive: true,
    },
  ],

  divisions: [
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "kisan-plantiq",
      name: "Kisan Plantiq",
      tagline: "Plant Supply & Manufacturing Division",
      subtitle: "Plant Supply & Manufacturing Division",
      description: "Comprehensive plant supply and manufacturing solutions.",
      heroImage: "/images/division-plantiq.png",
      cardImage: "/images/kisan-plantiq.png",
      badge: "Plantiq",
      order: 0,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "kisan-agriq",
      name: "Kisan Agriq",
      tagline: "Corporate Agriculture Intelligence Division",
      subtitle: "Corporate Agriculture Intelligence Division",
      description: "Smart agricultural intelligence solutions.",
      heroImage: "/images/division-agriq.png",
      cardImage: "/images/kisan-agriq.png",
      badge: "Agriq",
      order: 1,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "kisan-irriq",
      name: "Kisan Irriq",
      tagline: "Smarter Irrigation. Sustainable Results.",
      subtitle: "Irrigation & Water Management Division",
      description: "Innovative irrigation solutions.",
      heroImage: "/images/division-irriq.png",
      cardImage: "/images/kisan-irriq.png",
      badge: "Irriq",
      order: 2,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "kisan-secure",
      name: "Kisan Secure",
      tagline: "Agri & Environmental Security",
      subtitle: "Agri & Environmental Security Systems Division",
      description: "Advanced security systems.",
      heroImage: "/images/division-secure.png",
      cardImage: "/images/kisan-secure.png",
      badge: "Secure",
      order: 3,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "greenhabitat-360",
      name: "GreenHabitat 360",
      tagline: "Urban Green Infrastructure",
      subtitle: "Urban Green Infrastructure & Landscape Division",
      description: "Comprehensive urban greening solutions.",
      heroImage: "/images/division-habitat.png",
      cardImage: "/images/greenhabitat-360.png",
      badge: "Habitat",
      order: 4,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "kisan-vedvan",
      name: "Kisan Vedvan",
      tagline: "Culture & Ecological Plantation",
      subtitle: "Cultural & Ecological Plantation Division",
      description: "Traditional and ecological plantation.",
      heroImage: "/images/division-vedvan.png",
      cardImage: "/images/kisan-vedvan.png",
      badge: "Vedvan",
      order: 5,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "kisan-organiq",
      name: "Kisan Organiq",
      tagline: "Organic Farming Solutions",
      subtitle: "Organic Agriculture Division",
      description: "Organic farming and certification.",
      heroImage: "/images/division-organiq.png",
      cardImage: "/images/kisan-organiq.png",
      badge: "Organiq",
      order: 6,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "kisan-farm360",
      name: "Kisan Farm360",
      tagline: "Complete Farm Solutions",
      subtitle: "Integrated Farm Management Division",
      description: "Complete farm management solutions.",
      heroImage: "/images/division-farm360.png",
      cardImage: "/images/kisan-farm360.png",
      badge: "Farm360",
      order: 7,
      isActive: true,
    },
  ],

  services: [
    {
      tenantSlug: DEFAULT_TENANT,
      number: "01",
      title: "Agriculture & Green Solutions",
      description:
        "End-to-end agricultural and green development services covering farm planning, plantation, irrigation, soil health, and sustainable landscape execution.",
      image: "/images/project-1.png",
      tags: [
        { id: "t1", icon: "/images/sustainability-1.png", label: "Smart Farming" },
        { id: "t2", icon: "/images/sustainability-2.png", label: "Green Infrastructure" },
      ],
      order: 1,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      number: "02",
      title: "Intelligent Farm & Agri Management",
      description:
        "Smart technology solutions for farm management and agricultural operations using IoT sensors and data analytics.",
      image: "/images/project-2.png",
      tags: [
        { id: "t3", icon: "/images/smart-tech.png", label: "IoT Sensors" },
        { id: "t4", icon: "/images/sustainability-1.png", label: "Data Analytics" },
      ],
      order: 2,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      number: "03",
      title: "Agri Infrastructure Development",
      description:
        "Building robust agricultural infrastructure including storage facilities, processing units, and logistics.",
      image: "/images/project-3.png",
      tags: [
        { id: "t5", icon: "/images/sustainability-1.png", label: "Storage" },
        { id: "t6", icon: "/images/sustainability-2.png", label: "Processing" },
      ],
      order: 3,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      number: "04",
      title: "Sustainable Nutrition & Soil Health",
      description: "Solutions focused on soil health management and sustainable nutrition practices.",
      image: "/images/project-4.png",
      tags: [
        { id: "t7", icon: "/images/sustainability-1.png", label: "Soil Testing" },
        { id: "t8", icon: "/images/sustainability-2.png", label: "Organic Solutions" },
      ],
      order: 4,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      number: "05",
      title: "Smart Irrigation & Water Management",
      description: "Intelligent irrigation systems and water management solutions.",
      image: "/images/project-1.png",
      tags: [
        { id: "t9", icon: "/images/sustainability-1.png", label: "Drip Irrigation" },
        { id: "t10", icon: "/images/sustainability-2.png", label: "Water Conservation" },
      ],
      order: 5,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      number: "06",
      title: "Security & Smart Living Solutions",
      description: "Integrated security and smart living solutions for agricultural properties.",
      image: "/images/project-2.png",
      tags: [
        { id: "t11", icon: "/images/sustainability-1.png", label: "CCTV" },
        { id: "t12", icon: "/images/sustainability-2.png", label: "Smart Automation" },
      ],
      order: 6,
      isActive: true,
    },
  ],

  projectCategories: [
    { tenantSlug: DEFAULT_TENANT, name: "All", slug: "all", order: 0, isActive: true },
    { tenantSlug: DEFAULT_TENANT, name: "Corporate Farming", slug: "corporate-farming", order: 1, isActive: true },
    {
      tenantSlug: DEFAULT_TENANT,
      name: "Green Infrastructure",
      slug: "green-infrastructure",
      order: 2,
      isActive: true,
    },
    { tenantSlug: DEFAULT_TENANT, name: "Smart Irrigation", slug: "smart-irrigation", order: 3, isActive: true },
    { tenantSlug: DEFAULT_TENANT, name: "Landscaping", slug: "landscaping", order: 4, isActive: true },
  ],

  projects: [
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "greenharvest",
      title: "GreenHarvest",
      location: "Ranga Reddy, Hyderabad",
      description: "Sustainable farming project with advanced irrigation systems.",
      image: "/images/project-1.png",
      categoryId: "corporate-farming",
      categoryName: "Corporate Farming",
      featured: true,
      order: 1,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "fieldroots",
      title: "FieldRoots Initiative",
      location: "Ranga Reddy, Hyderabad",
      description: "Community farming initiative focused on local produce.",
      image: "/images/project-2.png",
      categoryId: "corporate-farming",
      categoryName: "Corporate Farming",
      featured: true,
      order: 2,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "agrigrow",
      title: "AgriGrow",
      location: "Ranga Reddy, Hyderabad",
      description: "Technology-driven agricultural expansion project.",
      image: "/images/project-3.png",
      categoryId: "green-infrastructure",
      categoryName: "Green Infrastructure",
      featured: true,
      order: 3,
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      slug: "soilscape",
      title: "SoilScape Development",
      location: "Ranga Reddy, Hyderabad",
      description: "Soil restoration and landscape development project.",
      image: "/images/project-4.png",
      categoryId: "landscaping",
      categoryName: "Landscaping",
      featured: true,
      order: 4,
      isActive: true,
    },
  ],

  jobs: [
    {
      tenantSlug: DEFAULT_TENANT,
      title: "HR Business Partner",
      department: "Human Resources",
      location: "Hyderabad, Telangana",
      type: "full-time",
      description: "We are looking for an HR Business Partner to join our team.",
      requirements: ["5+ years HR experience", "Strong communication skills", "MBA in HR preferred"],
      responsibilities: ["Partner with business leaders", "Drive HR initiatives", "Employee relations"],
      salary: "₹12-18 LPA",
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      title: "Senior Agricultural Scientist",
      department: "Research & Development",
      location: "Hyderabad, Telangana",
      type: "full-time",
      description: "Lead our agricultural research initiatives.",
      requirements: ["PhD in Agricultural Science", "10+ years experience", "Published research"],
      responsibilities: ["Lead research projects", "Mentor junior scientists", "Publish findings"],
      salary: "₹15-25 LPA",
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      title: "Full Stack Developer",
      department: "Technology",
      location: "Hyderabad, Telangana",
      type: "full-time",
      description: "Build innovative solutions for agriculture.",
      requirements: ["5+ years experience", "React, Node.js, TypeScript", "Database experience"],
      responsibilities: ["Build web applications", "Design APIs", "Code reviews"],
      salary: "₹12-18 LPA",
      isActive: true,
    },
  ],

  pageContents: [
    {
      tenantSlug: DEFAULT_TENANT,
      pageType: "home",
      content: {
        hero: {
          slides: [
            {
              id: "slide-1",
              title: "FUTURES FOCUS GREEN INNOVATIONS",
              subtitle: "Innovative plant solutions built for tomorrow.",
              image: "/images/banner-1-1.png",
              badge: "Kisan Plantiq",
              ctaText: "Explore Ecosystem",
              ctaLink: "/about",
            },
            {
              id: "slide-2",
              title: "SUSTAINABLE FARMING SOLUTIONS",
              subtitle: "Building a greener tomorrow through innovative agriculture",
              image: "/images/banner-1.png",
              badge: "",
              ctaText: "Explore Ecosystem",
              ctaLink: "/about",
            },
          ],
        },
        about: {
          badge: "About Kisan Plant Technologies Pvt. Ltd.",
          title: "Built on Quality. Driven by Innovation",
          description:
            "exists to reimagine India's green future through intelligent technology and sustainable innovation.",
        },
      },
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      pageType: "contact",
      content: {
        hero: { title: "Let's Build the Future Together", backgroundImage: "/images/contact-hero.jpg" },
        phoneBar: {
          tollFree: { label: "Toll Free No:", number: "1800-123456-123789" },
          customerCare: { label: "Customer Care Number:", number: "1800-425-9339" },
        },
      },
      isActive: true,
    },
    {
      tenantSlug: DEFAULT_TENANT,
      pageType: "leadership",
      content: {
        hero: { title: "Leadership", backgroundImage: "/images/image-209.png" },
        content: {
          badge: "Leadership",
          title: "Visionary leadership driving innovation, sustainability, and the future of Indian agriculture.",
          description:
            "Kisan Plant Technologies Pvt. Ltd. is driven by visionary leadership that combines entrepreneurial foresight with deep domain expertise.",
          image: "/images/leaderhip-20image.png",
        },
      },
      isActive: true,
    },
  ],
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const setupKey = searchParams.get("key")

    if (setupKey !== process.env.SETUP_KEY && setupKey !== "dev-seed-key") {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 403 })
    }

    if (!isMongoDBConfigured()) {
      return NextResponse.json({ message: "MongoDB not configured - using mock mode", mode: "mock" })
    }

    await connectToDatabase()

    const results: Record<string, { inserted: number; errors: number }> = {}

    // Seed Tenant
    try {
      await Tenant.findOneAndUpdate({ slug: seedData.tenant.slug }, seedData.tenant, { upsert: true })
      results.tenant = { inserted: 1, errors: 0 }
    } catch (e) {
      console.error("Tenant seed error:", e)
      results.tenant = { inserted: 0, errors: 1 }
    }

    // Seed Branding
    try {
      await Branding.findOneAndUpdate({ tenantSlug: seedData.branding.tenantSlug }, seedData.branding, { upsert: true })
      results.branding = { inserted: 1, errors: 0 }
    } catch (e) {
      console.error("Branding seed error:", e)
      results.branding = { inserted: 0, errors: 1 }
    }

    // Seed Navigation
    try {
      await Navigation.findOneAndUpdate({ tenantSlug: DEFAULT_TENANT, location: "header" }, seedData.headerNav, {
        upsert: true,
      })
      await Navigation.findOneAndUpdate({ tenantSlug: DEFAULT_TENANT, location: "footer" }, seedData.footerNav, {
        upsert: true,
      })
      results.navigation = { inserted: 2, errors: 0 }
    } catch (e) {
      console.error("Navigation seed error:", e)
      results.navigation = { inserted: 0, errors: 1 }
    }

    // Seed Offices
    try {
      await Office.deleteMany({ tenantSlug: DEFAULT_TENANT })
      await Office.insertMany(seedData.offices)
      results.offices = { inserted: seedData.offices.length, errors: 0 }
    } catch (e) {
      console.error("Offices seed error:", e)
      results.offices = { inserted: 0, errors: 1 }
    }

    // Seed Divisions
    try {
      for (const div of seedData.divisions) {
        await Division.findOneAndUpdate({ tenantSlug: div.tenantSlug, slug: div.slug }, div, { upsert: true })
      }
      results.divisions = { inserted: seedData.divisions.length, errors: 0 }
    } catch (e) {
      console.error("Divisions seed error:", e)
      results.divisions = { inserted: 0, errors: 1 }
    }

    // Seed Services
    try {
      await Service.deleteMany({ tenantSlug: DEFAULT_TENANT })
      await Service.insertMany(seedData.services)
      results.services = { inserted: seedData.services.length, errors: 0 }
    } catch (e) {
      console.error("Services seed error:", e)
      results.services = { inserted: 0, errors: 1 }
    }

    // Seed Project Categories
    try {
      for (const cat of seedData.projectCategories) {
        await ProjectCategory.findOneAndUpdate({ tenantSlug: cat.tenantSlug, slug: cat.slug }, cat, { upsert: true })
      }
      results.projectCategories = { inserted: seedData.projectCategories.length, errors: 0 }
    } catch (e) {
      console.error("Project categories seed error:", e)
      results.projectCategories = { inserted: 0, errors: 1 }
    }

    // Seed Projects
    try {
      for (const proj of seedData.projects) {
        await Project.findOneAndUpdate({ tenantSlug: proj.tenantSlug, slug: proj.slug }, proj, { upsert: true })
      }
      results.projects = { inserted: seedData.projects.length, errors: 0 }
    } catch (e) {
      console.error("Projects seed error:", e)
      results.projects = { inserted: 0, errors: 1 }
    }

    // Seed Jobs
    try {
      await Job.deleteMany({ tenantSlug: DEFAULT_TENANT })
      await Job.insertMany(seedData.jobs)
      results.jobs = { inserted: seedData.jobs.length, errors: 0 }
    } catch (e) {
      console.error("Jobs seed error:", e)
      results.jobs = { inserted: 0, errors: 1 }
    }

    // Seed Page Contents
    try {
      for (const page of seedData.pageContents) {
        await PageContent.findOneAndUpdate({ tenantSlug: page.tenantSlug, pageType: page.pageType }, page, {
          upsert: true,
        })
      }
      results.pageContents = { inserted: seedData.pageContents.length, errors: 0 }
    } catch (e) {
      console.error("Page contents seed error:", e)
      results.pageContents = { inserted: 0, errors: 1 }
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      mode: "mongodb",
      results,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to check seed status
export async function GET() {
  if (!isMongoDBConfigured()) {
    return NextResponse.json({ configured: false, mode: "mock" })
  }

  try {
    await connectToDatabase()

    const counts = await Promise.all([
      Tenant.countDocuments(),
      Branding.countDocuments(),
      Navigation.countDocuments(),
      Division.countDocuments(),
      Service.countDocuments(),
      Project.countDocuments(),
      Job.countDocuments(),
      Office.countDocuments(),
      PageContent.countDocuments(),
    ])

    return NextResponse.json({
      configured: true,
      mode: "mongodb",
      collections: {
        tenants: counts[0],
        branding: counts[1],
        navigation: counts[2],
        divisions: counts[3],
        services: counts[4],
        projects: counts[5],
        jobs: counts[6],
        offices: counts[7],
        pageContents: counts[8],
      },
    })
  } catch (error) {
    console.error("Seed status check error:", error)
    return NextResponse.json({ configured: true, mode: "mongodb", error: "Connection failed" })
  }
}
