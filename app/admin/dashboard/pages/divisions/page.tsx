"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebsite } from "@/lib/contexts/website-context"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Loader2, Save, Plus, Trash2, GripVertical, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [content, setContent] = useState<DivisionsPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/pages/divisions/content?tenant=${currentWebsite?.slug}`)
      const data = await response.json()
      if (data.content) {
        setContent(data.content)
      }
    } catch (error) {
      console.error("Failed to fetch content:", error)
      toast({
        title: "Error",
        description: "Failed to load content",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return

    try {
      setSaving(true)
      const response = await fetch(`/api/pages/divisions/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Content saved successfully",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Failed to save content:", error)
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleMigrate = async () => {
    try {
      setMigrating(true)
      const response = await fetch(`/api/divisions/migrate?tenant=${currentWebsite.slug}`, {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Migration Successful",
          description: `Migrated ${data.results?.length || 0} divisions to database`,
        })
        // Refresh the page to show new divisions in sidebar
        window.location.reload()
      } else {
        throw new Error(data.error || "Migration failed")
      }
    } catch (error: any) {
      console.error("Migration failed:", error)
      toast({
        title: "Migration Failed",
        description: error.message || "Failed to migrate divisions",
        variant: "destructive",
      })
    } finally {
      setMigrating(false)
    }
  }

  const updateHero = (field: keyof DivisionsPageContent["hero"], value: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    })
  }

  const updateIntro = (field: keyof DivisionsPageContent["intro"], value: string) => {
    if (!content) return
    setContent({
      ...content,
      intro: { ...content.intro, [field]: value },
    })
  }

  const generateId = () => `div-${Date.now()}`

  const addDivision = () => {
    if (!content) return
    const newDivision: Division = {
      id: generateId(),
      name: "",
      subtitle: "",
      description: "",
      image: "",
      logo: "",
      link: "",
      features: [],
    }
    setContent({
      ...content,
      divisions: [...content.divisions, newDivision],
    })
  }

  const updateDivision = (id: string, field: keyof Division, value: string | string[]) => {
    if (!content) return
    setContent({
      ...content,
      divisions: content.divisions.map((div) =>
        div.id === id ? { ...div, [field]: value } : div
      ),
    })
  }

  const removeDivision = async (id: string) => {
    if (!content || !currentWebsite) return
    
    try {
      const res = await fetch(`/api/divisions/${id}?tenant=${currentWebsite.slug}`, {
        method: "DELETE",
      })
      
      if (!res.ok) {
        throw new Error("Failed to delete division")
      }
      
      setContent({
        ...content,
        divisions: content.divisions.filter((div) => div.id !== id),
      })
      
      toast({ title: "Success", description: "Division deleted successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete division", variant: "destructive" })
    }
  }

  const addFeature = (divisionId: string) => {
    if (!content) return
    setContent({
      ...content,
      divisions: content.divisions.map((div) =>
        div.id === divisionId ? { ...div, features: [...div.features, ""] } : div
      ),
    })
  }

  const updateFeature = (divisionId: string, index: number, value: string) => {
    if (!content) return
    setContent({
      ...content,
      divisions: content.divisions.map((div) =>
        div.id === divisionId
          ? {
              ...div,
              features: div.features.map((f, i) => (i === index ? value : f)),
            }
          : div
      ),
    })
  }

  const removeFeature = (divisionId: string, index: number) => {
    if (!content) return
    setContent({
      ...content,
      divisions: content.divisions.map((div) =>
        div.id === divisionId
          ? {
              ...div,
              features: div.features.filter((_, i) => i !== index),
            }
          : div
      ),
    })
  }

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please select a website first</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No content found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Divisions Page Editor</h1>
          <p className="text-muted-foreground">Edit the main divisions listing page</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleMigrate} disabled={migrating} variant="outline">
            {migrating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Database className="mr-2 h-4 w-4" />
            Migrate to DB
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          This page edits the divisions <strong>listing page</strong>. To edit individual division pages, 
          use the "Divisions" dropdown in the sidebar or click "Migrate to DB" first if divisions are not showing.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="intro">Intro Section</TabsTrigger>
          <TabsTrigger value="divisions">Divisions List</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner for divisions page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={content.hero.title}
                  onChange={(e) => updateHero("title", e.target.value)}
                  placeholder="Page title"
                />
              </div>

              <div>
                <Label>Background Image</Label>
                <ImageUploadField
                  value={content.hero.backgroundImage}
                  onChange={(value) => updateHero("backgroundImage", value)}
                  label="Upload background image"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intro" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intro Section</CardTitle>
              <CardDescription>Introduction text for the page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="intro-badge">Badge</Label>
                <Input
                  id="intro-badge"
                  value={content.intro.badge}
                  onChange={(e) => updateIntro("badge", e.target.value)}
                  placeholder="e.g., Our Divisions"
                />
              </div>

              <div>
                <Label htmlFor="intro-title">Title</Label>
                <Textarea
                  id="intro-title"
                  value={content.intro.title}
                  onChange={(e) => updateIntro("title", e.target.value)}
                  rows={2}
                  placeholder="Section title"
                />
              </div>

              <div>
                <Label htmlFor="intro-description">Description</Label>
                <Textarea
                  id="intro-description"
                  value={content.intro.description}
                  onChange={(e) => updateIntro("description", e.target.value)}
                  rows={3}
                  placeholder="Section description"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="divisions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Divisions</h3>
            <Button onClick={addDivision} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Division
            </Button>
          </div>

          {content.divisions.map((division) => (
            <Card key={division.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{division.name || "New Division"}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDivision(division.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={division.name}
                      onChange={(e) => updateDivision(division.id, "name", e.target.value)}
                      placeholder="Division name"
                    />
                  </div>
                  <div>
                    <Label>Link</Label>
                    <Input
                      value={division.link}
                      onChange={(e) => updateDivision(division.id, "link", e.target.value)}
                      placeholder="/divisions/slug"
                    />
                  </div>
                </div>

                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={division.subtitle}
                    onChange={(e) => updateDivision(division.id, "subtitle", e.target.value)}
                    placeholder="Division subtitle"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={division.description}
                    onChange={(e) => updateDivision(division.id, "description", e.target.value)}
                    rows={2}
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <Label>Card Image</Label>
                  <ImageUploadField
                    value={division.image}
                    onChange={(value) => updateDivision(division.id, "image", value)}
                    label="Upload card image"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Features</Label>
                    <Button
                      onClick={() => addFeature(division.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>

                  {division.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(division.id, index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(division.id, index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
