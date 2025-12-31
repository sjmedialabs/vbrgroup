import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IMenuItem {
  id: string
  label: string
  url: string
  target?: "_self" | "_blank"
  order: number
  group?: string
  icon?: string
  children?: IMenuItem[]
}

export interface INavigation extends Document {
  tenantSlug: string
  location: "header" | "footer"
  items: IMenuItem[]
  createdAt: Date
  updatedAt: Date
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    target: { type: String, enum: ["_self", "_blank"], default: "_self" },
    order: { type: Number, default: 0 },
    group: String,
    icon: String,
    children: [
      {
        id: String,
        label: String,
        url: String,
        target: String,
        order: Number,
        group: String,
        icon: String,
      },
    ],
  },
  { _id: false },
)

const NavigationSchema = new Schema<INavigation>(
  {
    tenantSlug: { type: String, required: true, index: true },
    location: { type: String, enum: ["header", "footer"], required: true },
    items: [MenuItemSchema],
  },
  { timestamps: true },
)

NavigationSchema.index({ tenantSlug: 1, location: 1 }, { unique: true })

export const Navigation: Model<INavigation> =
  mongoose.models.Navigation || mongoose.model<INavigation>("Navigation", NavigationSchema)
