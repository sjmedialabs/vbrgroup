import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IProjectCategory extends Document {
  tenantSlug: string
  name: string
  slug: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectCategorySchema = new Schema<IProjectCategory>(
  {
    tenantSlug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

ProjectCategorySchema.index({ tenantSlug: 1, slug: 1 }, { unique: true })

export const ProjectCategory: Model<IProjectCategory> =
  mongoose.models.ProjectCategory || mongoose.model<IProjectCategory>("ProjectCategory", ProjectCategorySchema)
