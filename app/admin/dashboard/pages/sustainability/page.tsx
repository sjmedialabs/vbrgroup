"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebsite } from "@/lib/contexts/website-context"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Loader2, Save, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

interface SustainabilityPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
    image: string
    videoUrl: string
  }
  features: Feature[]
  goals: {
    title: string
    description: string
    items: { id: string; title: string; description: string }[]
  }
  stats: {
    items: { id: string; value: string; label: string }[]
  }
}

export default function SustainabilityPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<SustainabilityPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/sustainability/content?tenant=${currentWebsite?.slug}`)
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
      const res = await fetch(`/api/pages/sustainability/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Sustainability page saved" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

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
          <h2 className="text-2xl font-bold text-gray-900">Sustainability Page</h2>
          <p className="text-gray-500 mt-1">Manage sustainability page for {currentWebsite.name}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={content?.hero?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, hero: { ...prev.hero, title: e.target.value } } : prev))
                  }
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

        <TabsContent value="intro">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content?.intro?.badge || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, intro: { ...prev.intro, badge: e.target.value } } : prev))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content?.intro?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, intro: { ...prev.intro, title: e.target.value } } : prev))
                  }
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
              <ImageUploadField
                label="Main Image"
                value={content?.intro?.image || ""}
                onChange={(url) =>
                  setContent((prev) => (prev ? { ...prev, intro: { ...prev.intro, image: url } } : prev))
                }
                tenant={currentWebsite.slug}
              />
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  value={content?.intro?.videoUrl || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, intro: { ...prev.intro, videoUrl: e.target.value } } : prev,
                    )
                  }
                  placeholder="https://youtube.com/embed/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Features</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!content) return
                    setContent({
                      ...content,
                      features: [
                        ...(content.features || []),
                        { id: generateId(), icon: "", title: "", description: "" },
                      ],
                    })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {content?.features?.map((feature, idx) => (
                <div key={feature.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{feature.title || `Feature ${idx + 1}`}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setContent((prev) =>
                          prev ? { ...prev, features: prev.features.filter((f) => f.id !== feature.id) } : prev,
                        )
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Title"
                    value={feature.title}
                    onChange={(e) => {
                      setContent((prev) =>
                        prev
                          ? {
                              ...prev,
                              features: prev.features.map((f) =>
                                f.id === feature.id ? { ...f, title: e.target.value } : f,
                              ),
                            }
                          : prev,
                      )
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={feature.description}
                    onChange={(e) => {
                      setContent((prev) =>
                        prev
                          ? {
                              ...prev,
                              features: prev.features.map((f) =>
                                f.id === feature.id ? { ...f, description: e.target.value } : f,
                              ),
                            }
                          : prev,
                      )
                    }}
                    rows={2}
                  />
                  <ImageUploadField
                    label="Icon"
                    value={feature.icon}
                    onChange={(url) => {
                      setContent((prev) =>
                        prev
                          ? {
                              ...prev,
                              features: prev.features.map((f) => (f.id === feature.id ? { ...f, icon: url } : f)),
                            }
                          : prev,
                      )
                    }}
                    tenant={currentWebsite.slug}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={content?.goals?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, goals: { ...prev.goals, title: e.target.value } } : prev))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.goals?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, goals: { ...prev.goals, description: e.target.value } } : prev,
                    )
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Statistics</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!content) return
                    setContent({
                      ...content,
                      stats: {
                        ...content.stats,
                        items: [...(content.stats?.items || []), { id: generateId(), value: "", label: "" }],
                      },
                    })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stat
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {content?.stats?.items?.map((stat, idx) => (
                <div key={stat.id} className="flex items-center gap-4">
                  <Input
                    placeholder="Value (e.g., 20+)"
                    value={stat.value}
                    onChange={(e) => {
                      setContent((prev) =>
                        prev
                          ? {
                              ...prev,
                              stats: {
                                ...prev.stats,
                                items: prev.stats.items.map((s) =>
                                  s.id === stat.id ? { ...s, value: e.target.value } : s,
                                ),
                              },
                            }
                          : prev,
                      )
                    }}
                    className="w-32"
                  />
                  <Input
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => {
                      setContent((prev) =>
                        prev
                          ? {
                              ...prev,
                              stats: {
                                ...prev.stats,
                                items: prev.stats.items.map((s) =>
                                  s.id === stat.id ? { ...s, label: e.target.value } : s,
                                ),
                              },
                            }
                          : prev,
                      )
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setContent((prev) =>
                        prev
                          ? {
                              ...prev,
                              stats: { ...prev.stats, items: prev.stats.items.filter((s) => s.id !== stat.id) },
                            }
                          : prev,
                      )
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
