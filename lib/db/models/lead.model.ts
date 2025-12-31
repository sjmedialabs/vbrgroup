import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ILead extends Document {
  tenantSlug: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  source: string
  status: "new" | "contacted" | "qualified" | "converted" | "closed"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const LeadSchema = new Schema<ILead>(
  {
    tenantSlug: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: String,
    company: String,
    subject: String,
    message: { type: String, required: true },
    source: String,
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "closed"],
      default: "new",
      index: true,
    },
    notes: String,
  },
  { timestamps: true },
)

LeadSchema.index({ tenantSlug: 1, status: 1 })
LeadSchema.index({ createdAt: -1 })

export const Lead: Model<ILead> = mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema)
