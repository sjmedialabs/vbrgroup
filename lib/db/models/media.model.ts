import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IMedia extends Document {
  tenantSlug: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt?: string
  folder?: string
  width?: number
  height?: number
  createdAt: Date
  updatedAt: Date
}

const MediaSchema = new Schema<IMedia>(
  {
    tenantSlug: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    originalName: String,
    mimeType: String,
    size: Number,
    url: { type: String, required: true },
    alt: String,
    folder: { type: String, index: true },
    width: Number,
    height: Number,
  },
  { timestamps: true },
)

MediaSchema.index({ tenantSlug: 1, folder: 1 })
MediaSchema.index({ createdAt: -1 })

export const Media: Model<IMedia> = mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema)
