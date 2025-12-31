import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IApplication extends Document {
  tenantSlug: string
  jobId: mongoose.Types.ObjectId
  jobTitle: string
  name: string
  email: string
  phone: string
  resumeUrl?: string
  coverLetter?: string
  linkedIn?: string
  portfolio?: string
  status: "new" | "reviewing" | "shortlisted" | "interviewed" | "offered" | "hired" | "rejected"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ApplicationSchema = new Schema<IApplication>(
  {
    tenantSlug: { type: String, required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true, index: true },
    jobTitle: String,
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    resumeUrl: String,
    coverLetter: String,
    linkedIn: String,
    portfolio: String,
    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "interviewed", "offered", "hired", "rejected"],
      default: "new",
      index: true,
    },
    notes: String,
  },
  { timestamps: true },
)

ApplicationSchema.index({ tenantSlug: 1, status: 1 })
ApplicationSchema.index({ email: 1, jobId: 1 })

export const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema)
