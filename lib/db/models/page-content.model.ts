import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPageContent extends Document {
  tenantSlug: string
  pageType: string // 'home' | 'about' | 'contact' | 'services' | 'projects' | 'sustainability' | 'careers' | 'leadership'
  content: Record<string, unknown>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PageContentSchema = new Schema<IPageContent>(
  {
    tenantSlug: { type: String, required: true, index: true },
    pageType: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

PageContentSchema.index({ tenantSlug: 1, pageType: 1 }, { unique: true })

export const PageContent: Model<IPageContent> =
  mongoose.models.PageContent || mongoose.model<IPageContent>("PageContent", PageContentSchema)
