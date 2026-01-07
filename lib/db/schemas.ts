// Multi-tenant: Each website is a "tenant"
export interface Tenant {
  _id?: string
  slug: string
  name: string
  domain?: string
  theme?: {
    primaryColor: string
    secondaryColor: string
  }
  settings?: {
    logo: string
    favicon: string
    siteTitle?: string
    metaDescription?: string
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Branding {
  _id?: string
  tenantSlug: string
  headerLogo: string
  footerLogo: string
  favicon: string
  siteTitle: string
  tagline: string
  primaryColor: string
  secondaryColor: string
  footerText: string
  copyright: string
  socialLinks: SocialLink[]
  contactInfo: ContactInfo
  updatedAt: Date
}

export interface SocialLink {
  id?: string
  platform: "facebook" | "twitter" | "linkedin" | "youtube" | "instagram"
  url: string
  icon?: string
}

export interface ContactInfo {
  emails: string[]
  phones: string[]
  address: string
}

export interface AdminCredentials {
  email: string
  password: string
}

export interface Session {
  _id?: string
  token: string
  expiresAt: Date
  createdAt: Date
}

// Page content structure
export interface Page {
  _id?: string
  tenantSlug: string
  slug: string
  title: string
  metaTitle: string
  metaDescription?: string
  sections: PageSection[]
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface PageSection {
  id: string
  type: SectionType
  order: number
  title: string
  subtitle?: string
  content: SectionContent
}

export type SectionType =
  | "hero"
  | "about"
  | "divisions"
  | "sustainability"
  | "projects"
  | "testimonials"
  | "services"
  | "contact"
  | "careers"
  | "custom"

export interface SectionContent {
  slides?: HeroSlide[]
  badge?: string
  description?: string
  stats?: StatItem[]
  buttonText?: string
  buttonLink?: string
  divisions?: DivisionItem[]
  features?: FeatureItem[]
  images?: ImageItem[]
  projects?: ProjectItem[]
  testimonials?: TestimonialItem[]
  services?: ServiceItem[]
  formEnabled?: boolean
  showOpenings?: boolean
  html?: string
  paragraphs?: string[]
}

export interface HeroSlide {
  id: string
  image: string
  badge?: string
  title: string
  subtitle: string
  buttonPrimaryText?: string
  buttonPrimaryLink?: string
  buttonSecondaryText?: string
  buttonSecondaryLink?: string
}

export interface StatItem {
  id: string
  icon: string
  value: string
  label: string
}

export interface DivisionItem {
  id: string
  image: string
  title: string
  subtitle: string
  link: string
}

export interface FeatureItem {
  id: string
  icon: string
  title: string
  description: string
}

export interface ImageItem {
  id: string
  src: string
  alt: string
  type?: "image" | "video"
  badge?: {
    icon: string
    value: string
    label: string
  }
}

export interface ProjectItem {
  id: string
  image: string
  title: string
  location: string
  description: string
  categoryId: string
  link?: string
}

export interface ProjectCategory {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
}

export interface TestimonialItem {
  id: string
  content: string
  name: string
  role: string
  avatar: string
  rating: number
}

export interface ServiceItem {
  id: string
  number: string
  title: string
  description: string
  image: string
  tags?: ServiceTag[]
}

export interface ServiceTag {
  id: string
  icon: string
  label: string
}

export interface Service {
  _id?: string
  tenantSlug: string
  number: string
  title: string
  description: string
  image: string
  tags: ServiceTag[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ServicesPageContent {
  _id?: string
  tenantSlug: string
  heroImage: string
  heroTitle: string
  badge: string
  mainTitle: string
  mainSubtitle: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export interface MediaFile {
  _id?: string
  tenantSlug: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt?: string
  folder?: string
  width?: number
  height?: number
  createdAt: Date
  updatedAt: Date
}

export const IMAGE_SIZE_LIMITS = 
{
  logo: { maxSize: 307200000, maxWidth: 400, maxHeight: 800 },
  hero: { maxSize: 307200000, maxWidth: 1920, maxHeight: 1080 },
  thumbnail: { maxSize: 3072000000, maxWidth: 11920, maxHeight: 800 },
  icon: { maxSize: 307200000, maxWidth: 1920, maxHeight: 1000 },
  general: { maxSize: 307200000, maxWidth: 1920, maxHeight: 1200 },
}

export interface Lead {
  _id?: string
  tenantSlug: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  source: string
  status: "new" | "contacted" | "qualified" | "converted" | "closed"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface JobOpening {
  _id?: string
  tenantSlug: string
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  description: string
  requirements: string[]
  responsibilities: string[]
  salary?: string
  applyUrl?: string
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface JobApplication {
  _id?: string
  tenantSlug: string
  jobId: string
  jobTitle: string
  name: string
  email: string
  phone: string
  resumeUrl: string
  coverLetter?: string
  linkedIn?: string
  portfolio?: string
  status: "new" | "reviewing" | "shortlisted" | "interviewed" | "offered" | "hired" | "rejected"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface URLRedirect {
  _id?: string
  tenantSlug: string
  sourceUrl: string
  targetUrl: string
  type: "301" | "302"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface NavigationMenu {
  _id?: string
  tenantSlug: string
  location: "header" | "footer"
  items: MenuItem[]
  updatedAt: Date
}

export interface MenuItem {
  id: string
  label: string
  url: string
  target?: "_self" | "_blank"
  children?: MenuItem[]
  order: number
  group?: string
  icon?: string
}

export interface Office {
  _id?: string
  tenantSlug: string
  name: string
  type: "head" | "branch"
  city: string
  address: string
  fullAddress: string
  phone?: string
  email?: string
  coordinates?: {
    lat: number
    lng: number
  }
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Division {
  _id?: string
  tenantSlug: string
  slug: string
  name: string
  tagline: string
  subtitle: string
  description: string
  heroImage: string
  cardImage: string
  badge: string
  features: FeatureItem[]
  services: ServiceItem[]
  stats: { value: string; label: string }[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PageContent {
  _id?: string
  tenantSlug: string
  pageType: string
  content: Record<string, unknown>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
