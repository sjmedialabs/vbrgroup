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

interface Division {
  id: string
  name: string
  subtitle: string
  description: string
  image: string
  logo: string
  link: string
  features: string[]
}

interface DivisionsPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
  }
  divisions: Division[]
}

export default function DivisionsPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<DivisionsPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/divisions/content?tenant=${currentWebsite?.slug}`)
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
      const res = await fetch(`/api/pages/divisions/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Divisions page content saved successfully" })
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

  const addDivision = () => {
    if (!content) return
    setContent({
      ...content,
      divisions: [
        ...content.divisions,
        { id: generateId(), name: "", subtitle: "", description: "", image: "", logo: "", link: "", features: [] },
      ],
    })
  }

  const removeDivision = (id: string) => {
    if (!content) return
    setContent({ ...content, divisions: content.divisions.filter((d) => d.id !== id) })
  }

  const updateDivision = (id: string, field: keyof Division, value: string | string[]) => {
    if (!content) return
    setContent({
      ...content,
      divisions: content.divisions.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
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
          <h2 className="text-2xl font-bold text-gray-900">Divisions Page</h2>
          <p className="text-gray-500 mt-1">Manage divisions page for {currentWebsite.name}</p>
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
          <TabsTrigger value="divisions">Divisions List</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Banner image and title</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={content?.hero?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, hero: { ...prev.hero, title: e.target.value } } : prev))
                  }
                  placeholder="Our Divisions"
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
              <CardTitle>Introduction Section</CardTitle>
              <CardDescription>Overview of divisions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="divisions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Divisions</CardTitle>
                  <CardDescription>Manage company divisions</CardDescription>
                </div>
                <Button onClick={addDivision} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Division
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {content?.divisions?.map((division, idx) => (
                <div key={division.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{division.name || `Division ${idx + 1}`}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeDivision(division.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={division.name}
                        onChange={(e) => updateDivision(division.id, "name", e.target.value)}
                        placeholder="Kisan PLANTIQ"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={division.subtitle}
                        onChange={(e) => updateDivision(division.id, "subtitle", e.target.value)}
                        placeholder="Plant Supply & Manufacturing Division"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={division.description}
                      onChange={(e) => updateDivision(division.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
                    <Input
                      value={division.link}
                      onChange={(e) => updateDivision(division.id, "link", e.target.value)}
                      placeholder="/kisan-plantiq"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ImageUploadField
                      label="Division Image"
                      value={division.image}
                      onChange={(url) => updateDivision(division.id, "image", url)}
                      tenant={currentWebsite.slug}
                    />
                    <ImageUploadField
                      label="Division Logo"
                      value={division.logo}
                      onChange={(url) => updateDivision(division.id, "logo", url)}
                      tenant={currentWebsite.slug}
                    />
                  </div>
                </div>
              ))}
              {(!content?.divisions || content.divisions.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No divisions yet. Click "Add Division" to create one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
