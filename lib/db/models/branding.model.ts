import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ISocialLink {
  platform: "facebook" | "twitter" | "linkedin" | "youtube" | "instagram"
  url: string
  icon?: string
}

export interface IContactInfo {
  emails: string[]
  phones: string[]
  address: string
}

export interface IBranding extends Document {
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
  socialLinks: ISocialLink[]
  contactInfo: IContactInfo
  createdAt: Date
  updatedAt: Date
}

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: {
      type: String,
      enum: ["facebook", "twitter", "linkedin", "youtube", "instagram"],
      required: true,
    },
    url: { type: String, required: true },
    icon: String,
  },
  { _id: false },
)

const ContactInfoSchema = new Schema<IContactInfo>(
  {
    emails: [String],
    phones: [String],
    address: String,
  },
  { _id: false },
)

const BrandingSchema = new Schema<IBranding>(
  {
    tenantSlug: { type: String, required: true, unique: true, index: true },
    headerLogo: { type: String, required: true },
    footerLogo: String,
    favicon: String,
    siteTitle: { type: String, required: true },
    tagline: String,
    primaryColor: { type: String, default: "#2E7D32" },
    secondaryColor: { type: String, default: "#1B5E20" },
    footerText: String,
    copyright: String,
    socialLinks: [SocialLinkSchema],
    contactInfo: ContactInfoSchema,
  },
  { timestamps: true },
)

export const Branding: Model<IBranding> =
  mongoose.models.Branding || mongoose.model<IBranding>("Branding", BrandingSchema)
