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

interface ServiceTag {
  id: string
  icon: string
  label: string
}

interface Service {
  id: string
  number: string
  title: string
  description: string
  image: string
  tags: ServiceTag[]
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
    const updatedServices = content.services.filter((s) => s.id !== id)
    // Renumber services
    const renumberedServices = updatedServices.map((s, idx) => ({
      ...s,
      number: String(idx + 1).padStart(2, "0"),
    }))
    setContent({ ...content, services: renumberedServices })
  }

  const updateService = (id: string, field: keyof Service, value: any) => {
    if (!content) return
    const updatedServices = content.services.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    setContent({ ...content, services: updatedServices })
  }

  const addTagToService = (serviceId: string) => {
    if (!content) return
    const updatedServices = content.services.map((s) =>
      s.id === serviceId ? { ...s, tags: [...s.tags, { id: generateId(), icon: "", label: "" }] } : s,
    )
    setContent({ ...content, services: updatedServices })
  }

  const removeTagFromService = (serviceId: string, tagId: string) => {
    if (!content) return
    const updatedServices = content.services.map((s) =>
      s.id === serviceId ? { ...s, tags: s.tags.filter((t) => t.id !== tagId) } : s,
    )
    setContent({ ...content, services: updatedServices })
  }

  const updateTag = (serviceId: string, tagId: string, field: keyof ServiceTag, value: string) => {
    if (!content) return
    const updatedServices = content.services.map((s) =>
      s.id === serviceId
        ? {
            ...s,
            tags: s.tags.map((t) => (t.id === tagId ? { ...t, [field]: value } : t)),
          }
        : s,
    )
    setContent({ ...content, services: updatedServices })
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
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services Page Content</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={content.hero?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                />
              </div>
              <ImageUploadField
                label="Background Image"
                value={content.hero?.backgroundImage || ""}
                onChange={(url) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, backgroundImage: url },
                  })
                }
                accept="image/*"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Intro Tab */}
        <TabsContent value="intro" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Introduction Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Badge</Label>
                <Input
                  value={content.intro?.badge || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      intro: { ...content.intro, badge: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.intro?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      intro: { ...content.intro, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.intro?.description || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      intro: { ...content.intro, description: e.target.value },
                    })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services List</CardTitle>
              <CardDescription>Add and manage services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.services?.map((service, idx) => (
                <Card key={service.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <span className="font-semibold text-gray-500">{service.number}</span>
                    </div>

                    <div>
                      <Label>Title</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(service.id, "title", e.target.value)}
                      />
                    </div>

                    <div>
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
                      accept="image/*"
                    />

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      {service.tags?.map((tag) => (
                        <Card key={tag.id} className="p-3">
                          <div className="space-y-2">
                            <ImageUploadField
                              label="Tag Icon"
                              value={tag.icon}
                              onChange={(url) => updateTag(service.id, tag.id, "icon", url)}
                              accept="image/*"
                            />
                            <div>
                              <Label>Tag Label</Label>
                              <Input
                                value={tag.label}
                                onChange={(e) => updateTag(service.id, tag.id, "label", e.target.value)}
                                placeholder="e.g., Smart Farming"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeTagFromService(service.id, tag.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remove Tag
                            </Button>
                          </div>
                        </Card>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addTagToService(service.id)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Tag
                      </Button>
                    </div>

                    <Button variant="destructive" onClick={() => removeService(service.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Service
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addService} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
