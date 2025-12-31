import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IOffice extends Document {
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

const OfficeSchema = new Schema<IOffice>(
  {
    tenantSlug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["head", "branch"], default: "branch" },
    city: { type: String, required: true },
    address: String,
    fullAddress: String,
    phone: String,
    email: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

OfficeSchema.index({ tenantSlug: 1, order: 1 })

export const Office: Model<IOffice> = mongoose.models.Office || mongoose.model<IOffice>("Office", OfficeSchema)
