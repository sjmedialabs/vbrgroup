"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Trash2, Loader2, ImageIcon, FileIcon, Copy, Check } from "lucide-react"
import type { MediaFile } from "@/lib/db/schemas"
import { useWebsite } from "@/lib/contexts/website-context"

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { currentWebsite } = useWebsite()

  useEffect(() => {
    if (!currentWebsite) return
    fetchMedia()
  }, [currentWebsite])

  const fetchMedia = async () => {
    if (!currentWebsite) return
    setLoading(true)
    try {
      const res = await fetch(`/api/media?tenant=${currentWebsite.slug}`)
      const data = await res.json()
      setMedia(data.media || [])
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentWebsite) return
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("tenant", currentWebsite.slug)

        const res = await fetch("/api/media", {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          setMedia((prev) => [data.media, ...prev])
        }
      }
    } catch (error) {
      console.error("Error uploading:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" })
      setMedia(media.filter((m) => m._id?.toString() !== id))
      setSelectedMedia(null)
    } catch (error) {
      console.error("Error deleting:", error)
    }
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isImage = (mimeType: string) => mimeType.startsWith("image/")

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-500 mt-1">
            Media files for <span className="font-medium">{currentWebsite.name}</span>
          </p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
          <Button
            className="bg-[#2d8a39] hover:bg-[#236b2d]"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Files</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="text-gray-500 mt-4">No files uploaded yet</p>
              <Button className="mt-4 bg-[#2d8a39] hover:bg-[#236b2d]" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Your First File
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
              {media.map((file) => (
                <Dialog key={file._id?.toString()}>
                  <DialogTrigger asChild>
                    <button
                      className="w-16 h-16 rounded border border-gray-200 overflow-hidden hover:ring-2 hover:ring-green-500 transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
                      onClick={() => setSelectedMedia(file)}
                    >
                      {isImage(file.mimeType) ? (
                        <Image
                          src={file.url || "/placeholder.svg"}
                          alt={file.alt || file.originalName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                          <FileIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="truncate text-sm">{file.originalName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                        {isImage(file.mimeType) ? (
                          <Image
                            src={file.url || "/placeholder.svg"}
                            alt={file.alt || file.originalName}
                            width={400}
                            height={200}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileIcon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500">File URL</label>
                        <div className="flex gap-2 mt-1">
                          <Input value={file.url} readOnly className="text-xs" />
                          <Button variant="outline" size="sm" onClick={() => copyUrl(file.url)}>
                            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Size: {formatSize(file.size)}</span>
                        <span>Type: {file.mimeType}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleDelete(file._id?.toString() || "")}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete File
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
