"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebsite } from "@/lib/contexts/website-context"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Service {
  id: string
  number: string
  title: string
  description: string
  image: string
  tags: string[]
}

interface ServicesPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
  }
  services: Service[]
}

export default function ServicesPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<ServicesPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/services/content?tenant=${currentWebsite?.slug}`)
      const data = await res.json()
      setContent(data.content)
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content || !currentWebsite) return
    setSaving(true)
    try {
      const res = await fetch(`/api/pages/services/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Services page content saved successfully" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save content", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addService = () => {
    if (!content) return
    const newNumber = String(content.services.length + 1).padStart(2, "0")
    setContent({
      ...content,
      services: [
        ...content.services,
        { id: generateId(), number: newNumber, title: "", description: "", image: "", tags: [] },
      ],
    })
  }

  const removeService = (id: string) => {
    if (!content) return
    const updatedServices = content.services
      .filter((s) => s.id !== id)
      .map((s, idx) => ({ ...s, number: String(idx + 1).padStart(2, "0") }))
    setContent({ ...content, services: updatedServices })
  }

  const updateService = (id: string, field: keyof Service, value: string | string[]) => {
    if (!content) return
    setContent({
      ...content,
      services: content.services.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    })
  }

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please select a website first</p>
      </div>
    )
  }

  if (loading) {
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
          <h2 className="text-2xl font-bold text-gray-900">Services Page</h2>
          <p className="text-gray-500 mt-1">Manage services page sections for {currentWebsite.name}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="services">Services List</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Banner image and title for services page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={content?.hero?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, hero: { ...prev.hero, title: e.target.value } } : prev))
                  }
                  placeholder="Services"
                />
              </div>
              <ImageUploadField
                label="Background Image"
                value={content?.hero?.backgroundImage || ""}
                onChange={(url) =>
                  setContent((prev) => (prev ? { ...prev, hero: { ...prev.hero, backgroundImage: url } } : prev))
                }
                tenant={currentWebsite.slug}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Introduction Section */}
        <TabsContent value="intro">
          <Card>
            <CardHeader>
              <CardTitle>Introduction Section</CardTitle>
              <CardDescription>Badge, title, and description for services introduction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input
                  value={content?.intro?.badge || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, intro: { ...prev.intro, badge: e.target.value } } : prev))
                  }
                  placeholder="Our Services"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content?.intro?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, intro: { ...prev.intro, title: e.target.value } } : prev))
                  }
                  placeholder="INTEGRATED AGRITECH & SUSTAINABLE GREEN SOLUTIONS"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.intro?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, intro: { ...prev.intro, description: e.target.value } } : prev,
                    )
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services List */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Services List</CardTitle>
                  <CardDescription>Manage individual services</CardDescription>
                </div>
                <Button onClick={addService} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {content?.services?.map((service, index) => (
                <div key={service.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-lg text-[#2d8a39]">{service.number}</span>
                      <span className="font-medium">{service.title || "Untitled Service"}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeService(service.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service Title</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(service.id, "title", e.target.value)}
                        placeholder="Enter service title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tags (comma separated)</Label>
                      <Input
                        value={service.tags.join(", ")}
                        onChange={(e) =>
                          updateService(
                            service.id,
                            "tags",
                            e.target.value.split(",").map((t) => t.trim()),
                          )
                        }
                        placeholder="Smart Farming, Green Infrastructure"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) => updateService(service.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <ImageUploadField
                    label="Service Image"
                    value={service.image}
                    onChange={(url) => updateService(service.id, "image", url)}
                    tenant={currentWebsite.slug}
                  />
                </div>
              ))}
              {(!content?.services || content.services.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No services yet. Click "Add Service" to create your first service.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
