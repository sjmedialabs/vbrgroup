import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IDivisionFeature {
  id: string
  icon: string
  title: string
  description: string
}

export interface IDivisionService {
  id: string
  title: string
  description: string
}

export interface IDivision extends Document {
  tenantSlug: string
  slug: string
  name: string
  tagline: string
  subtitle: string
  description: string
  heroImage: string
  cardImage: string
  badge: string
  features: IDivisionFeature[]
  services: IDivisionService[]
  stats: {
    value: string
    label: string
  }[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const DivisionFeatureSchema = new Schema<IDivisionFeature>(
  {
    id: String,
    icon: String,
    title: String,
    description: String,
  },
  { _id: false },
)

const DivisionServiceSchema = new Schema<IDivisionService>(
  {
    id: String,
    title: String,
    description: String,
  },
  { _id: false },
)

const DivisionSchema = new Schema<IDivision>(
  {
    tenantSlug: { type: String, required: true, index: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    tagline: String,
    subtitle: String,
    description: String,
    heroImage: String,
    cardImage: String,
    badge: String,
    features: [DivisionFeatureSchema],
    services: [DivisionServiceSchema],
    stats: [
      {
        value: String,
        label: String,
      },
    ],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

DivisionSchema.index({ tenantSlug: 1, slug: 1 }, { unique: true })

export const Division: Model<IDivision> =
  mongoose.models.Division || mongoose.model<IDivision>("Division", DivisionSchema)
