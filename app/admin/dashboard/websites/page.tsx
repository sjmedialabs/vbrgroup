"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Globe, Settings, Plus, Loader2, Trash2, ExternalLink, Pencil } from "lucide-react"
import type { Tenant } from "@/lib/db/schemas"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import Link from "next/link"

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedWebsite, setSelectedWebsite] = useState<Tenant | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    domain: "",
    primaryColor: "#2d8a39",
    secondaryColor: "#1e3a1e",
    logo: "",
    favicon: "",
  })

  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      const res = await fetch("/api/tenants")
      const data = await res.json()
      setWebsites(data.tenants || [])
    } catch (error) {
      console.error("Error fetching websites:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      domain: "",
      primaryColor: "#2d8a39",
      secondaryColor: "#1e3a1e",
      logo: "",
      favicon: "",
    })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleAddWebsite = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        await fetchWebsites()
        setIsAddDialogOpen(false)
        resetForm()
      } else {
        alert(data.error || "Failed to create website")
      }
    } catch (error) {
      console.error("Error creating website:", error)
      alert("Failed to create website")
    } finally {
      setSaving(false)
    }
  }

  const handleEditWebsite = async () => {
    if (!selectedWebsite) return

    setSaving(true)
    try {
      const res = await fetch(`/api/tenants/${selectedWebsite._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        await fetchWebsites()
        setIsEditDialogOpen(false)
        setSelectedWebsite(null)
        resetForm()
      } else {
        alert(data.error || "Failed to update website")
      }
    } catch (error) {
      console.error("Error updating website:", error)
      alert("Failed to update website")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteWebsite = async () => {
    if (!selectedWebsite) return

    setSaving(true)
    try {
      const res = await fetch(`/api/tenants/${selectedWebsite._id}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (res.ok) {
        await fetchWebsites()
        setIsDeleteDialogOpen(false)
        setSelectedWebsite(null)
      } else {
        alert(data.error || "Failed to delete website")
      }
    } catch (error) {
      console.error("Error deleting website:", error)
      alert("Failed to delete website")
    } finally {
      setSaving(false)
    }
  }

  const openEditDialog = (website: Tenant) => {
    setSelectedWebsite(website)
    setFormData({
      name: website.name,
      slug: website.slug,
      domain: website.domain || "",
      primaryColor: website.theme?.primaryColor || "#2d8a39",
      secondaryColor: website.theme?.secondaryColor || "#1e3a1e",
      logo: website.settings?.logo || "",
      favicon: website.settings?.favicon || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (website: Tenant) => {
    setSelectedWebsite(website)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Websites</h2>
          <p className="text-gray-500 mt-1">Manage multiple websites from one dashboard</p>
        </div>
        <Button
          className="bg-[#2d8a39] hover:bg-[#236b2d]"
          onClick={() => {
            resetForm()
            setIsAddDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Website
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : websites.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-300" />
            <p className="text-gray-500 mt-4">No websites configured yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Website" to create your first website</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <Card key={website._id?.toString()} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: website.theme?.primaryColor || "#2d8a39" }}
                  >
                    {website.settings?.logo ? (
                      <img
                        src={website.settings.logo || "/placeholder.svg"}
                        alt={website.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <Globe className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Active
                  </Badge>
                </div>
                <CardTitle className="mt-4">{website.name}</CardTitle>
                <CardDescription className="flex flex-col gap-1">
                  <span className="font-mono text-xs">{website.slug}</span>
                  {website.domain && (
                    <a
                      href={`https://${website.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2d8a39] hover:underline flex items-center gap-1 text-xs"
                    >
                      {website.domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => openEditDialog(website)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Link href={`/admin/dashboard/websites/${website.slug}/settings`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    onClick={() => openDeleteDialog(website)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Website Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Website</DialogTitle>
            <DialogDescription>Create a new website to manage from this dashboard</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Website Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }}
                  placeholder="My Website"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                  placeholder="my-website"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain (optional)</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="primaryColor"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#2d8a39"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="#1e3a1e"
                  />
                </div>
              </div>
            </div>

            <ImageUploadField
              label="Website Logo"
              value={formData.logo}
              onChange={(url) => setFormData({ ...formData, logo: url })}
              type="logo"
            />

            <ImageUploadField
              label="Favicon"
              value={formData.favicon}
              onChange={(url) => setFormData({ ...formData, favicon: url })}
              type="icon"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleAddWebsite}
              disabled={saving || !formData.name || !formData.slug}
              className="bg-[#2d8a39] hover:bg-[#236b2d]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Website"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Website Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Website</DialogTitle>
            <DialogDescription>Update website details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Website Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Website"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input id="edit-slug" value={formData.slug} disabled className="bg-gray-100" />
                <p className="text-xs text-gray-500">Slug cannot be changed after creation</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-domain">Domain</Label>
              <Input
                id="edit-domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="edit-primaryColor"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="edit-secondaryColor"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <ImageUploadField
              label="Website Logo"
              value={formData.logo}
              onChange={(url) => setFormData({ ...formData, logo: url })}
              type="logo"
            />

            <ImageUploadField
              label="Favicon"
              value={formData.favicon}
              onChange={(url) => setFormData({ ...formData, favicon: url })}
              type="icon"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleEditWebsite}
              disabled={saving || !formData.name}
              className="bg-[#2d8a39] hover:bg-[#236b2d]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Website</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedWebsite?.name}"? This action cannot be undone and will remove
              all associated pages, content, and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWebsite} disabled={saving} className="bg-red-600 hover:bg-red-700">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Website"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
