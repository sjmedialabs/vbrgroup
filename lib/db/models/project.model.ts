import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IProject extends Document {
  tenantSlug: string
  slug: string
  title: string
  location: string
  description: string
  fullDescription?: string
  image: string
  images?: string[]
  categoryId: string
  categoryName: string
  client?: string
  completionDate?: Date
  featured: boolean
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    tenantSlug: { type: String, required: true, index: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    location: String,
    description: String,
    fullDescription: String,
    image: String,
    images: [String],
    categoryId: { type: String, index: true },
    categoryName: String,
    client: String,
    completionDate: Date,
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

ProjectSchema.index({ tenantSlug: 1, slug: 1 }, { unique: true })
ProjectSchema.index({ tenantSlug: 1, categoryId: 1 })

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
