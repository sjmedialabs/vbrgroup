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

export interface IServiceTab {
  id: string
  title: string
  number: string
  heading: string
  description: string[]
  image: string
}

export interface IDivisionPageContent {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  about: {
    badge: string
    title: string
    description: string[]
  }
  services: {
    badge: string
    title: string
    subtitle: string
    tabs: IServiceTab[]
  }
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
  pageContent?: IDivisionPageContent
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

const ServiceTabSchema = new Schema<IServiceTab>(
  {
    id: String,
    title: String,
    number: String,
    heading: String,
    description: [String],
    image: String,
  },
  { _id: false },
)

const DivisionPageContentSchema = new Schema(
  {
    hero: {
      title: String,
      subtitle: String,
      backgroundImage: String,
    },
    about: {
      badge: String,
      title: String,
      description: [String],
    },
    services: {
      badge: String,
      title: String,
      subtitle: String,
      tabs: [ServiceTabSchema],
    },
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
    pageContent: DivisionPageContentSchema,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

DivisionSchema.index({ tenantSlug: 1, slug: 1 }, { unique: true })

export const Division: Model<IDivision> =
  mongoose.models.Division || mongoose.model<IDivision>("Division", DivisionSchema)
