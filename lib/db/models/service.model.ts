import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IServiceTag {
  id: string
  icon: string
  label: string
}

export interface IService extends Document {
  tenantSlug: string
  number: string
  title: string
  description: string
  image: string
  tags: IServiceTag[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ServiceTagSchema = new Schema<IServiceTag>(
  {
    id: String,
    icon: String,
    label: String,
  },
  { _id: false },
)

const ServiceSchema = new Schema<IService>(
  {
    tenantSlug: { type: String, required: true, index: true },
    number: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    image: String,
    tags: [ServiceTagSchema],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

ServiceSchema.index({ tenantSlug: 1, order: 1 })

export const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema)
