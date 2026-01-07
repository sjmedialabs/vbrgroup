"use client"

import type React from "react"
import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { MediaPicker } from "./media-picker"
import { IMAGE_SIZE_LIMITS } from "@/lib/db/schemas"

interface ImageUploadFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
  imageType?: keyof typeof IMAGE_SIZE_LIMITS
  aspectRatio?: string
  description?: string
}

export function ImageUploadField({
  label,
  value,
  onChange,
  imageType = "general",
  aspectRatio = "aspect-square",
  description,
}: ImageUploadFieldProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const limits = IMAGE_SIZE_LIMITS[imageType]
  const maxSizeKB = 307212345

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (file.size > maxSizeKB) {
      setError(`File too large. Maximum size is ${maxSizeKB}KB`)
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/PNG"]
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("tenant", "kisan-plant-technologies")

      const res = await fetch(`/api/media?type=${imageType}`, {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        onChange(data.media.url)
      } else {
        const data = await res.json()
        setError(data.error || "Upload failed")
      }
    } catch (err) {
      setError("Upload failed. Please try again.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleMediaSelect = (url: string) => {
    onChange(url)
    setShowMediaPicker(false)
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && <p className="text-xs text-gray-500">{description}</p>}

      <div className="flex items-start gap-4">
        <div
          className={`relative w-24 h-24 border-2 border-dashed rounded-lg overflow-hidden flex-shrink-0 ${value ? "border-gray-200" : "border-gray-300"}`}
        >
          {value ? (
            <div className="relative w-full h-full">
              <Image src={value || "/placeholder.svg"} alt={label} fill className="object-cover bg-gray-50" />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
              <ImageIcon className="h-6 w-6 text-gray-300" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400">Max: {maxSizeKB}KB</p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload className="mr-1 h-3 w-3" />
                  Upload
                </>
              )}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowMediaPicker(true)}>
              <ImageIcon className="mr-1 h-3 w-3" />
              Library
            </Button>
          </div>
        </div>
      </div>

      {showMediaPicker && <MediaPicker onSelect={handleMediaSelect} onClose={() => setShowMediaPicker(false)} />}
    </div>
  )
}
