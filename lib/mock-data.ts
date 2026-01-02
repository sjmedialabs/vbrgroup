// Mock data store for preview mode (replaces MongoDB in development)
import type {
  Branding,
  Page,
  Lead,
  JobOpening,
  JobApplication,
  MediaFile,
  NavigationMenu,
  Tenant,
  Service,
  ServicesPageContent,
} from "./db/schemas"

// Helper to generate IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Mock Tenant
export const mockTenant: Tenant = {
  _id: "tenant-1",
  name: "Kisan Plant Technologies",
  slug: "kisan-plant-technologies",
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock Branding
export const mockBranding: Branding = {
  _id: "branding-1",
  tenantSlug: "kisan-plant-technologies",
  headerLogo: "/images/logo-header.png",
  footerLogo: "/images/logo-footer.png",
  favicon: "/favicon.ico",
  siteTitle: "Kisan Plant Technologies",
  tagline: "Innovating Green Futures",
  primaryColor: "#2d8a39",
  secondaryColor: "#1e3a1e",
  footerText: "Driving growth. Sustaining the future.",
  copyright: "© Copyright 2026 Kisan Agri Tech. All Rights Reserved.",
  socialLinks: [
    { id: "social-1", platform: "facebook", url: "https://facebook.com", icon: "/images/icon-facebook.png" },
    { id: "social-2", platform: "twitter", url: "https://twitter.com", icon: "/images/icon-x.png" },
    { id: "social-3", platform: "linkedin", url: "https://linkedin.com", icon: "/images/icon-linkedin.png" },
    { id: "social-4", platform: "youtube", url: "https://youtube.com", icon: "/images/icon-youtube.png" },
  ],
  contactInfo: {
    emails: ["support@kisanagritech.com", "sales@kisanagritech.com"],
    phones: ["+4800 45 678 900", "+4800 45 678 900"],
    address: "8814 Bayberry Ave, Jonesborough, Hyderabad",
  },
  updatedAt: new Date(),
}

// Mock Home Page with actual images
export const mockHomePage: Page = {
  _id: "page-home",
  tenantSlug: "kisan-plant-technologies",
  slug: "home",
  title: "Innovating Green Futures",
  metaTitle: "Kisan Plant Technologies - Innovating Green Futures",
  metaDescription: "Connecting Agriculture, Technology & Sustainability",
  isPublished: true,
  sections: [
    {
      id: "hero-1",
      type: "hero",
      order: 0,
      title: "",
      content: {
        slides: [
          {
            id: "slide-1",
            image: "/images/banner-1-1.png",
            badge: "Kisan Plantiq",
            title: "FUTURES FOCUS GREEN INNOVATIONS",
            subtitle: "Innovative plant solutions built for tomorrow.",
            buttonPrimaryText: "Explore Ecosystem",
            buttonPrimaryLink: "/about",
            buttonSecondaryText: "Talk to our Experts",
            buttonSecondaryLink: "/contact",
          },
          {
            id: "slide-2",
            image: "/images/banner-1.png",
            badge: "",
            title: "SUSTAINABLE FARMING SOLUTIONS",
            subtitle: "Building a greener tomorrow through innovative agriculture",
            buttonPrimaryText: "Explore Ecosystem",
            buttonPrimaryLink: "/about",
            buttonSecondaryText: "Talk to our Experts",
            buttonSecondaryLink: "/contact",
          },
          {
            id: "slide-3",
            image: "/images/banner-2.png",
            badge: "KISAN AGRIQ",
            title: "FARMING WITH FORESIGHT",
            subtitle: "Strategic agriculture designed for long-term performance",
            buttonPrimaryText: "Explore Ecosystem",
            buttonPrimaryLink: "/about",
            buttonSecondaryText: "Talk to our Experts",
            buttonSecondaryLink: "/contact",
          },
          {
            id: "slide-4",
            image: "/images/banner-3.png",
            badge: "",
            title: "INTELLIGENT GREENS",
            subtitle: "Through sustainable farming and smart technology — more than crops — we grow impact.",
            buttonPrimaryText: "Explore Ecosystem",
            buttonPrimaryLink: "/about",
            buttonSecondaryText: "Talk to our Experts",
            buttonSecondaryLink: "/contact",
          },
        ],
      },
    },
    {
      id: "about-1",
      type: "about",
      order: 1,
      title: "Built on Quality. Driven by Innovation",
      subtitle: "About Kisan Plant Technologies Pvt. Ltd.",
      content: {
        badge: "About Kisan Plant Technologies Pvt. Ltd.",
        description:
          "exists to reimagine India's green future through intelligent technology and sustainable innovation —building ecosystems that perform today and endure for generations.",
        stats: [
          { id: "stat-1", icon: "/images/20-plus-experience.png", value: "20+", label: "Of Experience" },
          { id: "stat-2", icon: "/images/pan-india-network.png", value: "", label: "Pan-India Network" },
          { id: "stat-3", icon: "/images/smart-tech.png", value: "", label: "Smart Tech" },
          { id: "stat-4", icon: "/images/24x7-support.png", value: "", label: "24×7 Support" },
          { id: "stat-5", icon: "/images/trust-quality.png", value: "", label: "Trust & Quality" },
        ],
        buttonText: "Explore More",
        buttonLink: "/about",
      },
    },
    {
      id: "divisions-1",
      type: "divisions",
      order: 2,
      title: "SPECIALIZED DIVISIONS. UNIFIED PURPOSE",
      subtitle: "Our Divisions",
      content: {
        badge: "Our Divisions",
        description:
          "Our divisions operate under specialized brands, each engineered to address a specific sector while sharing one unified mission — to make India's green and agricultural future intelligent, sustainable, and globally competitive.",
        buttonText: "Explore our Divisions",
        buttonLink: "/divisions",
        divisions: [
          {
            id: "div-1",
            image: "/images/kisan-plantiq.png",
            title: "Kisan Plantiq",
            subtitle: "Plant Supply &\nManufacturing Division",
            link: "/divisions/kisan-plantiq",
          },
          {
            id: "div-2",
            image: "/images/kisan-agriq.png",
            title: "Kisan Agriq",
            subtitle: "Corporate Agriculture\nIntelligence Division",
            link: "/divisions/kisan-agriq",
          },
          {
            id: "div-3",
            image: "/images/kisan-secure.png",
            title: "Kisan Secure",
            subtitle: "Agri & Environmental Security\nSystems Division",
            link: "/divisions/kisan-secure",
          },
          {
            id: "div-4",
            image: "/images/kisan-vedvan.png",
            title: "Kisan Vedvan",
            subtitle: "Culture & Ecological\nPlantation Division",
            link: "/divisions/kisan-vedvan",
          },
        ],
      },
    },
    {
      id: "sustainability-1",
      type: "sustainability",
      order: 3,
      title: "EMPOWERING AGRICULTURE TO ACHIEVE SUSTAINABILITY GOALS",
      subtitle: "Sustainability",
      content: {
        badge: "Sustainability",
        features: [
          {
            id: "feat-1",
            icon: "/images/sustainability-1.png",
            title: "Regenerative Farming Practices",
            description: "Restoring soil health and ecosystems through responsible cultivation methods.",
          },
          {
            id: "feat-2",
            icon: "/images/sustainability-2.png",
            title: "Environment-Responsible Agriculture",
            description: "Minimizing environmental impact while optimizing agricultural productivity.",
          },
          {
            id: "feat-3",
            icon: "/images/sustainability-3.png",
            title: "Smart & Sustainable Farming",
            description: "Leveraging technology to enable efficient, resilient, and sustainable farm operations.",
          },
        ],
        images: [
          {
            id: "img-1",
            src: "/images/banner-4.png",
            alt: "Sustainability Video",
            type: "video",
            badge: { icon: "/images/20-plus-experience.png", value: "20+", label: "Integrated Green Technology" },
          },
        ],
        buttonText: "Know More",
        buttonLink: "/sustainability",
      },
    },
    {
      id: "projects-1",
      type: "projects",
      order: 4,
      title: "CULTIVATED WITH PRECISION AND INNOVATION",
      subtitle: "Our Projects",
      content: {
        badge: "Our Projects",
        buttonText: "View all Project",
        buttonLink: "/projects",
        projects: [
          {
            id: "proj-1",
            image: "/images/project-1.png",
            title: "GreenHarvest",
            location: "Ranga Reddy, Hyderabad",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit emet condimentum varius.",
            link: "/projects/greenharvest",
          },
          {
            id: "proj-2",
            image: "/images/project-2.png",
            title: "FieldRoots Initiative",
            location: "Ranga Reddy, Hyderabad",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit emet condimentum varius.",
            link: "/projects/fieldroots",
          },
          {
            id: "proj-3",
            image: "/images/project-3.png",
            title: "AgriGrow",
            location: "Ranga Reddy, Hyderabad",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit emet condimentum varius.",
            link: "/projects/agrigrow",
          },
          {
            id: "proj-4",
            image: "/images/project-4.png",
            title: "SoilScape Development",
            location: "Ranga Reddy, Hyderabad",
            description:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin bibendum, arcu sit emet condimentum varius.",
            link: "/projects/soilscape",
          },
        ],
      },
    },
    {
      id: "testimonials-1",
      type: "testimonials",
      order: 5,
      title: "Built on Trust. Proven by Results.",
      subtitle: "Voices of Trust",
      content: {
        badge: "Voices of Trust",
        testimonials: [
          {
            id: "test-1",
            quote:
              "We have a terrace that we love to use year-round, and Plant Specialists has helped us with it for years. The team there has helped us with every aspect of it from decking to irrigation to containers to lighting to furniture to plant health — and of course the overall design!",
            author: "Emily Carter",
            role: "Homeowner",
            avatar: "/images/avatar-1.png",
            rating: 5,
          },
          {
            id: "test-2",
            quote:
              "We have a terrace that we love to use year-round, and Plant Specialists has helped us with it for years. The team there has helped us with every aspect of it from decking to irrigation to containers to lighting to furniture to plant health — and of course the overall design!",
            author: "Emily Carter",
            role: "Homeowner",
            avatar: "/images/avatar-1.png",
            rating: 5,
          },
        ],
      },
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock Contact Page
export const mockContactPage: Page = {
  _id: "page-contact",
  tenantSlug: "kisan-plant-technologies",
  slug: "contact",
  title: "Contact Us",
  metaTitle: "Contact Us - Kisan Plant Technologies",
  metaDescription: "Get in touch with us",
  isPublished: true,
  sections: [
    {
      id: "contact-hero",
      type: "hero",
      order: 0,
      title: "",
      content: {
        slides: [
          {
            id: "slide-1",
            image: "/images/banner-2.png",
            badge: "",
            title: "GET IN TOUCH",
            subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
          },
        ],
      },
    },
    {
      id: "contact-form",
      type: "contact",
      order: 1,
      title: "Send us a Message",
      subtitle: "Contact Form",
      content: {
        formEnabled: true,
      },
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock Careers Page
export const mockCareersPage: Page = {
  _id: "page-careers",
  tenantSlug: "kisan-plant-technologies",
  slug: "careers",
  title: "Join Our Team",
  metaTitle: "Careers - Kisan Plant Technologies",
  metaDescription: "Explore career opportunities with us",
  isPublished: true,
  sections: [
    {
      id: "careers-hero",
      type: "hero",
      order: 0,
      title: "",
      content: {
        slides: [
          {
            id: "slide-1",
            image: "/images/banner-3.png",
            badge: "",
            title: "JOIN OUR TEAM",
            subtitle: "Be part of the green revolution. Explore exciting career opportunities.",
          },
        ],
      },
    },
    {
      id: "careers-list",
      type: "careers",
      order: 1,
      title: "Current Openings",
      subtitle: "Career Opportunities",
      content: {
        showOpenings: true,
      },
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Mock Job Openings
export const mockJobOpenings: JobOpening[] = [
  {
    _id: "job-1",
    tenantSlug: "kisan-plant-technologies",
    title: "Senior Agricultural Scientist",
    department: "Research & Development",
    location: "Hyderabad, India",
    type: "full-time",
    description: "We are looking for an experienced agricultural scientist to lead our R&D initiatives.",
    requirements: [
      "PhD in Agricultural Science or related field",
      "10+ years of experience",
      "Published research papers",
      "Leadership experience",
    ],
    responsibilities: [
      "Lead research projects",
      "Mentor junior scientists",
      "Publish findings",
      "Collaborate with external partners",
    ],
    salary: "₹15-25 LPA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "job-2",
    tenantSlug: "kisan-plant-technologies",
    title: "Full Stack Developer",
    department: "Technology",
    location: "Hyderabad, India",
    type: "full-time",
    description: "Join our tech team to build innovative solutions for agriculture.",
    requirements: ["5+ years experience", "React, Node.js, TypeScript", "Database experience", "API development"],
    responsibilities: ["Build web applications", "Design APIs", "Collaborate with team", "Code reviews"],
    salary: "₹12-18 LPA",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Mock Navigation
export const mockHeaderNav: NavigationMenu = {
  _id: "nav-header",
  tenantSlug: "kisan-plant-technologies",
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
  updatedAt: new Date(),
}

export const mockFooterNav: NavigationMenu = {
  _id: "nav-footer",
  tenantSlug: "kisan-plant-technologies",
  location: "footer",
  items: [
    // Useful Links
    { id: "fnav-1", label: "Home", url: "/", order: 0, group: "useful" },
    { id: "fnav-2", label: "Know Us", url: "/about", order: 1, group: "useful" },
    { id: "fnav-3", label: "Services", url: "/services", order: 2, group: "useful" },
    { id: "fnav-4", label: "Projects", url: "/projects", order: 3, group: "useful" },
    { id: "fnav-5", label: "Sustainability", url: "/sustainability", order: 4, group: "useful" },
    { id: "fnav-6", label: "Career", url: "/careers", order: 5, group: "useful" },
    { id: "fnav-7", label: "Contact us", url: "/contact", order: 6, group: "useful" },
    // Our Divisions
    { id: "fnav-8", label: "Kisan PLANTIQ", url: "/divisions/kisan-plantiq", order: 0, group: "divisions" },
    { id: "fnav-9", label: "Kisan AGRIQ", url: "/divisions/kisan-agriq", order: 1, group: "divisions" },
    { id: "fnav-10", label: "Kisan IRRIQ", url: "/divisions/kisan-irriq", order: 2, group: "divisions" },
    { id: "fnav-11", label: "Kisan SECURE", url: "/divisions/kisan-secure", order: 3, group: "divisions" },
    { id: "fnav-12", label: "GreenHabitat 360", url: "/divisions/greenhabitat-360", order: 4, group: "divisions" },
    { id: "fnav-13", label: "Kisan VEDVAN", url: "/divisions/kisan-vedvan", order: 5, group: "divisions" },
    { id: "fnav-14", label: "Kisan ORGANIQ", url: "/divisions/kisan-organiq", order: 6, group: "divisions" },
    { id: "fnav-15", label: "KISAN FARM360", url: "/divisions/kisan-farm360", order: 7, group: "divisions" },
    // Social Media
    { id: "fnav-16", label: "Facebook", url: "https://facebook.com", order: 0, group: "social", icon: "facebook" },
    { id: "fnav-17", label: "Twitter", url: "https://twitter.com", order: 1, group: "social", icon: "twitter" },
    { id: "fnav-18", label: "Instagram", url: "https://instagram.com", order: 2, group: "social", icon: "instagram" },
    { id: "fnav-19", label: "Linkedin", url: "https://linkedin.com", order: 3, group: "social", icon: "linkedin" },
    { id: "fnav-20", label: "youtube", url: "https://youtube.com", order: 4, group: "social", icon: "youtube" },
  ],
  updatedAt: new Date(),
}

// Mock Leads
export const mockLeads: Lead[] = []

// Mock Job Applications
export const mockJobApplications: JobApplication[] = []

// Mock Media Files
export const mockMediaFiles: MediaFile[] = [
  {
    _id: "media-1",
    tenantSlug: "kisan-plant-technologies",
    filename: "banner-1-1.png",
    originalName: "banner-1-1.png",
    mimeType: "image/png",
    size: 1500000,
    url: "/images/banner-1-1.png",
    alt: "Hero Banner 1",
    folder: "banners",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "media-2",
    tenantSlug: "kisan-plant-technologies",
    filename: "logo-header.png",
    originalName: "logo-header.png",
    mimeType: "image/png",
    size: 50000,
    url: "/images/logo-header.png",
    alt: "Header Logo",
    folder: "logos",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockServicesPageContent: ServicesPageContent = {
  _id: "services-page-1",
  tenantSlug: "kisan-plant-technologies",
  heroImage: "/images/banner-2.png",
  heroTitle: "Services",
  badge: "Our Services",
  mainTitle: "INTEGRATED AGRITECH & SUSTAINABLE GREEN SOLUTIONS",
  mainSubtitle: "",
  description:
    "We deliver end-to-end, technology-driven agricultural and green infrastructure solutions—combining smart farming, intelligent irrigation, agri-infrastructure development, soil health, security systems, and sustainable living concepts.",
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockServices: Service[] = [
   {
      _id: "service-1",
      tenantSlug: "kisan-plant-technologies",
      number: "01",
      title: "Agriculture & Green Solutions",
      description: "End-to-end agricultural and green development services.",
      image: "/images/agreeculture.png",
      isActive: true,
      order:1,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [{id: "t1", icon: "/images/smart-farming.png", label: "Smart Farming"}, {id:"t2", icon:"/images/green-infrastructure.png", label:"Green Infrastructure"}, {id:"t3", icon:"/images/plant-supply.png", label:"Plant Supply"},{id:"t4", icon:"/images/sustainable-agriculture.png", label:"Sustainable Agriculture"}],
    },
  {
    _id: "service-2",
    tenantSlug: "kisan-plant-technologies",
    number: "02",
    title: "Intelligent Farm & Agri Management",
    description:
      "Smart farm management solutions using IoT sensors, drone monitoring, and AI-powered analytics. We provide comprehensive farm management services including crop planning, resource optimization, and yield prediction.",
    image: "/images/project-2.png",
    tags: [
      { id: "tag-5", icon: "/images/smart-tech.png", label: "IoT Monitoring" },
      { id: "tag-6", icon: "/images/sustainability-1.png", label: "AI Analytics" },
      { id: "tag-7", icon: "/images/sustainability-2.png", label: "Drone Services" },
    ],
    order: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "service-3",
    tenantSlug: "kisan-plant-technologies",
    number: "03",
    title: "Agri Infrastructure Development",
    description:
      "Complete agricultural infrastructure development including polyhouses, shade nets, cold storage facilities, and processing units. We design and build world-class agri-infrastructure tailored to your needs.",
    image: "/images/project-3.png",
    tags: [
      { id: "tag-8", icon: "/images/sustainability-1.png", label: "Polyhouses" },
      { id: "tag-9", icon: "/images/sustainability-2.png", label: "Cold Storage" },
      { id: "tag-10", icon: "/images/sustainability-3.png", label: "Processing Units" },
    ],
    order: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "service-4",
    tenantSlug: "kisan-plant-technologies",
    number: "04",
    title: "Sustainable Nutrition & Soil Health",
    description:
      "Comprehensive soil health management and sustainable nutrition programs. We provide soil testing, organic amendments, bio-fertilizers, and nutrient management plans for optimal crop health.",
    image: "/images/project-4.png",
    tags: [
      { id: "tag-11", icon: "/images/sustainability-1.png", label: "Soil Testing" },
      { id: "tag-12", icon: "/images/sustainability-2.png", label: "Organic Farming" },
      { id: "tag-13", icon: "/images/sustainability-3.png", label: "Bio-fertilizers" },
    ],
    order: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "service-5",
    tenantSlug: "kisan-plant-technologies",
    number: "05",
    title: "Smart Irrigation & Water Management",
    description:
      "Advanced irrigation systems including drip irrigation, sprinkler systems, and automated water management. We optimize water usage through smart sensors and AI-based scheduling for maximum efficiency.",
    image: "/images/kisan-plantiq.png",
    tags: [
      { id: "tag-14", icon: "/images/sustainability-1.png", label: "Drip Irrigation" },
      { id: "tag-15", icon: "/images/sustainability-2.png", label: "Water Sensors" },
      { id: "tag-16", icon: "/images/sustainability-3.png", label: "Automation" },
    ],
    order: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "service-6",
    tenantSlug: "kisan-plant-technologies",
    number: "06",
    title: "Security & Smart Living Solutions",
    description:
      "Integrated security solutions for farms and agricultural facilities including CCTV surveillance, perimeter security, and smart living concepts for farm houses and eco-resorts.",
    image: "/images/kisan-agriq.png",
    tags: [
      { id: "tag-17", icon: "/images/sustainability-1.png", label: "CCTV Systems" },
      { id: "tag-18", icon: "/images/sustainability-2.png", label: "Perimeter Security" },
      { id: "tag-19", icon: "/images/sustainability-3.png", label: "Smart Living" },
    ],
    order: 6,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// In-memory data stores (for preview mode)
export interface PageContentsStore {
  [tenant: string]: {
    home?: any
    about?: any
    services?: any
    divisions?: any
    projects?: any
    sustainability?: any
    career?: any
    contact?: any
  }
}

export const dataStore = {
  tenant: mockTenant,
  tenants: [mockTenant] as Tenant[],
  branding: mockBranding,
  pages: [mockHomePage, mockContactPage, mockCareersPage] as Page[],
  leads: mockLeads,
  jobOpenings: mockJobOpenings,
  jobApplications: mockJobApplications,
  mediaFiles: mockMediaFiles,
  headerNav: mockHeaderNav,
  footerNav: mockFooterNav,
  services: mockServices,
  servicesPageContent: mockServicesPageContent,
  pageContents: {} as PageContentsStore,
}
