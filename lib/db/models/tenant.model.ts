import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ITenant extends Document {
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

const TenantSchema = new Schema<ITenant>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    domain: { type: String, sparse: true },
    theme: {
      primaryColor: { type: String, default: "#2E7D32" },
      secondaryColor: { type: String, default: "#1B5E20" },
    },
    settings: {
      logo: String,
      favicon: String,
      siteTitle: String,
      metaDescription: String,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Tenant: Model<ITenant> = mongoose.models.Tenant || mongoose.model<ITenant>("Tenant", TenantSchema)
