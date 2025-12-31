import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPageSection {
  id: string
  type: string
  order: number
  title: string
  subtitle?: string
  content: Record<string, unknown>
}

export interface IPage extends Document {
  tenantSlug: string
  slug: string
  title: string
  metaTitle: string
  metaDescription?: string
  sections: IPageSection[]
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const PageSectionSchema = new Schema<IPageSection>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    order: { type: Number, default: 0 },
    title: String,
    subtitle: String,
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
)

const PageSchema = new Schema<IPage>(
  {
    tenantSlug: { type: String, required: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    metaTitle: String,
    metaDescription: String,
    sections: [PageSectionSchema],
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true },
)

PageSchema.index({ tenantSlug: 1, slug: 1 }, { unique: true })

export const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema)
