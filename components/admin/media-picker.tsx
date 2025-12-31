"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Check } from "lucide-react"
import type { MediaFile } from "@/lib/db/schemas"

interface MediaPickerProps {
  onSelect: (url: string) => void
  onClose: () => void
}

export function MediaPicker({ onSelect, onClose }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media?tenant=kisan-plant-technologies")
      const data = await res.json()
      setMedia(data.media || [])
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", files[0])
      formData.append("tenant", "kisan-plant-technologies")

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setMedia((prev) => [data.media, ...prev])
        setSelected(data.media.url)
      }
    } catch (error) {
      console.error("Error uploading:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 pb-4 border-b">
          <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="max-w-xs" />
          {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {media.map((file) => (
                <button
                  key={file._id?.toString()}
                  onClick={() => setSelected(file.url)}
                  className={`aspect-square rounded border-2 overflow-hidden transition-all ${
                    selected === file.url
                      ? "border-green-500 ring-2 ring-green-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={file.url || "/placeholder.svg"}
                      alt={file.alt || file.originalName}
                      fill
                      className="object-cover"
                    />
                    {selected === file.url && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selected} className="bg-[#2d8a39] hover:bg-[#236b2d]">
            Select Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
