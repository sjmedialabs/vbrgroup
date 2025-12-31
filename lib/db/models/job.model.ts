import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IJob extends Document {
  tenantSlug: string
  title: string
  department: string
  location: string
  type: "full-time" | "part-time" | "contract" | "internship"
  description: string
  requirements: string[]
  responsibilities: string[]
  salary?: string
  applyUrl?: string
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const JobSchema = new Schema<IJob>(
  {
    tenantSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    department: String,
    location: String,
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },
    description: String,
    requirements: [String],
    responsibilities: [String],
    salary: String,
    applyUrl: String,
    isActive: { type: Boolean, default: true, index: true },
    expiresAt: Date,
  },
  { timestamps: true },
)

JobSchema.index({ tenantSlug: 1, isActive: 1 })

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema)
