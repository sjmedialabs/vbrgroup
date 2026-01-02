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
import { TestimonialItem } from "@/lib/db/schemas"

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  image: string
  ctaText: string
  ctaLink: string
}

interface Feature {
  id: string
  icon: string
  title: string
  description: string
}
interface Items {
  id: string
  title: string
  description: string,
  image: string,
}
interface Division {
  id: string
  name: string
  subtitle: string
  image: string
  link: string
}

interface HomePageContent {
  hero: {
    slides: HeroSlide[]
  }
  about: {
    badge: string
    title: string
    subtitle: string
    description: string
    features: Feature[]
    ctaText: string
    ctaLink: string
  }
  divisions: {
    badge: string
    title: string
    description: string
    backgroundImage: string
    items: Division[]
    ctaText: string
    ctaLink: string
  }
  sustainability: {
    badge: string
    title: string
    description: string
    image: string
    videoUrl: string
    features: { id: string; icon: string; title: string; description: string }[]
    stats: { value: string; label: string, icon: string }
    ctaText: string
    ctaLink: string
  }
  projects: {
    badge: string
    title: string
    items: { id: string; title: string; location: string; description: string; image: string }[]
    ctaText: string
    ctaLink: string
  }
  testimonials: {
    badge: string
    title: string
    subtitle: string
    items: { id: string; name: string; role: string; content: string; avatar: string; rating: number }[]
  }
}

export default function HomePageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<HomePageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/home/content?tenant=${currentWebsite?.slug}`)
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
      const res = await fetch(`/api/pages/home/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Home page content saved successfully" })
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

  const addHeroSlide = () => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        slides: [
          ...content.hero.slides,
          { id: generateId(), title: "", subtitle: "", image: "", ctaText: "", ctaLink: "" },
        ],
      },
    })
  }

  const removeHeroSlide = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        slides: content.hero.slides.filter((s) => s.id !== id),
      },
    })
  }

  const updateHeroSlide = (id: string, field: keyof HeroSlide, value: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        slides: content.hero.slides.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      },
    })
  }

  const addAboutFeature = () => {
    if (!content) return
    setContent({
      ...content,
      about: {
        ...content.about,
        features: [
          ...(content.about.features || []),
          { id: generateId(), icon: "", title: "", description: "" },
        ],
      },
    })
  }

  const removeAboutFeature = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      about: {
        ...content.about,
        features: content.about.features.filter((f) => f.id !== id),
      },
    })
  }

  const updateAboutFeature = (id: string, field: keyof Feature, value: string) => {
    if (!content) return
    setContent({
      ...content,
      about: {
        ...content.about,
        features: content.about.features.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
      },
    })
  }

  const addDivision = () => {
    if (!content) return
    setContent({
      ...content,
      divisions: {
        ...content.divisions,
        items: [
          ...(content.divisions.items || []),
          { id: generateId(), name: "", subtitle: "", image: "", link: "" },
        ],
      },
    })
  }

  const removeDivision = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      divisions: {
        ...content.divisions,
        items: content.divisions.items.filter((d) => d.id !== id),
      },
    })
  }

  const updateDivision = (id: string, field: keyof Division, value: string) => {
    if (!content) return
    setContent({
      ...content,
      divisions: {
        ...content.divisions,
        items: content.divisions.items.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
      },
    })
  }

  const addSustainabilityFeature = () => {
    if (!content) return
    setContent({
      ...content,
      sustainability: {
        ...content.sustainability,
        features: [
          ...(content.sustainability.features || []),
          { id: generateId(), icon: "", title: "", description: "" },
        ],
      },
    })
  }

  const removeSustainabilityFeature = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      sustainability: {
        ...content.sustainability,
        features: content.sustainability.features.filter((f) => f.id !== id),
      },
    })
  }

  const updateSustainabilityFeature = (id: string, field: keyof Feature, value: string) => {
    if (!content) return
    setContent({
      ...content,
      sustainability: {
        ...content.sustainability,
        features: content.sustainability.features.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
      },
    })
  }

  const addProjectItems = () => {
    if (!content) return
    setContent({
      ...content,
      projects: {
        ...content.projects,
        items: [
          ...(content.projects.items || []),
          { id: generateId(), image: "", title: "", description: "", location: "" },
        ],
      },
    })
  }

  const removeProjectItems = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      projects: {
        ...content.projects,
        items: content.projects.items.filter((f) => f.id !== id),
      },
    })
  }

  const updateProjectItems = (id: string, field: keyof Items, value: string) => {
    if (!content) return
    setContent({
      ...content,
      projects: {
        ...content.projects,
        items: content.projects.items.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
      },
    })
  }

  const addtestimonialItems = () => {
    if (!content) return
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        items: [
          ...(content.testimonials.items || []),
          { id: generateId(), avatar: "", role: "", content: "", rating: 0, name: "" },
        ],
      },
    })
  }

  const removetestimonialItems = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        items: content.testimonials.items.filter((f) => f.id !== id),
      },
    })
  }

  const updatetestimonialItems = (id: string, field: keyof TestimonialItem, value: any) => {
    if (!content) return
    setContent({
      ...content,
      testimonials: {
        ...content.testimonials,
        items: content.testimonials.items.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
      },
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
          <h2 className="text-2xl font-bold text-gray-900">Home Page</h2>
          <p className="text-gray-500 mt-1">Manage home page sections for {currentWebsite.name}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="divisions">Divisions</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hero Carousel</CardTitle>
                  <CardDescription>Manage hero slider images and content</CardDescription>
                </div>
                <Button onClick={addHeroSlide} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slide
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {content?.hero?.slides?.map((slide, index) => (
                <div key={slide.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">Slide {index + 1}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeHeroSlide(slide.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={slide.title}
                        onChange={(e) => updateHeroSlide(slide.id, "title", e.target.value)}
                        placeholder="Enter slide title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={slide.subtitle}
                        onChange={(e) => updateHeroSlide(slide.id, "subtitle", e.target.value)}
                        placeholder="Enter slide subtitle"
                      />
                    </div>
                  </div>
                  <ImageUploadField
                    label="Background Image"
                    value={slide.image}
                    onChange={(url) => updateHeroSlide(slide.id, "image", url)}
                    tenant={currentWebsite.slug}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>CTA Button Text</Label>
                      <Input
                        value={slide.ctaText}
                        onChange={(e) => updateHeroSlide(slide.id, "ctaText", e.target.value)}
                        placeholder="e.g., Learn More"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA Button Link</Label>
                      <Input
                        value={slide.ctaLink}
                        onChange={(e) => updateHeroSlide(slide.id, "ctaLink", e.target.value)}
                        placeholder="e.g., /about"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!content?.hero?.slides || content.hero.slides.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No slides yet. Click "Add Slide" to create your first hero slide.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>Content shown in the about section on home page</CardDescription>
                </div>
                <Button onClick={addAboutFeature} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.about?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) => (prev ? { ...prev, about: { ...prev.about, badge: e.target.value } } : prev))
                    }
                    placeholder="e.g., About Kisan Plant Technologies"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.about?.title || ""}
                    onChange={(e) =>
                      setContent((prev) => (prev ? { ...prev, about: { ...prev.about, title: e.target.value } } : prev))
                    }
                    placeholder="e.g., Built on Quality. Driven by Innovation"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content?.about?.subtitle || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, about: { ...prev.about, subtitle: e.target.value } } : prev,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.about?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, about: { ...prev.about, description: e.target.value } } : prev,
                    )
                  }
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={content?.about?.ctaText || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, about: { ...prev.about, ctaText: e.target.value } } : prev,
                      )
                    }
                    placeholder="e.g., Explore More"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input
                    value={content?.about?.ctaLink || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, about: { ...prev.about, ctaLink: e.target.value } } : prev,
                      )
                    }
                    placeholder="e.g., /about"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Features</Label>
                {content?.about?.features?.map((feature, index) => (
                  <div key={feature.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Feature {index + 1}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeAboutFeature(feature.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateAboutFeature(feature.id, "title", e.target.value)}
                          placeholder="Feature Title"
                        />
                      </div>
                      <div className="space-y-2">
                        <ImageUploadField
                          label="Icon Image"
                          value={feature.icon}
                          onChange={(url) => updateAboutFeature(feature.id, "icon", url)}
                          tenant={currentWebsite.slug}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {(!content?.about?.features || content.about.features.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No features added yet. Click "Add Feature" to create one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Divisions Section */}
        <TabsContent value="divisions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Divisions Section</CardTitle>
                  <CardDescription>Manage divisions displayed on home page</CardDescription>
                </div>
                <Button onClick={addDivision} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Division
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.divisions?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, divisions: { ...prev.divisions, badge: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.divisions?.title || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, divisions: { ...prev.divisions, title: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.divisions?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, divisions: { ...prev.divisions, description: e.target.value } } : prev,
                    )
                  }
                  rows={3}
                />
              </div>
              <ImageUploadField
                label="Background Image"
                value={content?.divisions?.backgroundImage || ""}
                onChange={(url) =>
                  setContent((prev) =>
                    prev ? { ...prev, divisions: { ...prev.divisions, backgroundImage: url } } : prev,
                  )
                }
                tenant={currentWebsite.slug}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={content?.divisions?.ctaText || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, divisions: { ...prev.divisions, ctaText: e.target.value } } : prev,
                      )
                    }
                    placeholder="e.g., Explore our Divisions"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input
                    value={content?.divisions?.ctaLink || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, divisions: { ...prev.divisions, ctaLink: e.target.value } } : prev,
                      )
                    }
                    placeholder="e.g., /divisions"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Division Items</Label>
                {content?.divisions?.items?.map((division, index) => (
                  <div key={division.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Division {index + 1}</span>
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
                          placeholder="Division Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link</Label>
                        <Input
                          value={division.link}
                          onChange={(e) => updateDivision(division.id, "link", e.target.value)}
                          placeholder="/division-link"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={division.subtitle}
                        onChange={(e) => updateDivision(division.id, "subtitle", e.target.value)}
                        placeholder="Short description"
                      />
                    </div>
                    <ImageUploadField
                      label="Division Image"
                      value={division.image}
                      onChange={(url) => updateDivision(division.id, "image", url)}
                      tenant={currentWebsite.slug}
                    />
                  </div>
                ))}
                {(!content?.divisions?.items || content.divisions.items.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No divisions added yet. Click "Add Division" to create one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sustainability Section */}
        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sustainability Section</CardTitle>
                  <CardDescription>Content for sustainability section</CardDescription>
                </div>
                <Button onClick={addSustainabilityFeature} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.sustainability?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, sustainability: { ...prev.sustainability, badge: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.sustainability?.title || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, sustainability: { ...prev.sustainability, title: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.sustainability?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev
                        ? { ...prev, sustainability: { ...prev.sustainability, description: e.target.value } }
                        : prev,
                    )
                  }
                  rows={3}
                />
              </div>
              <ImageUploadField
                label="Main Image"
                value={content?.sustainability?.image || ""}
                onChange={(url) =>
                  setContent((prev) =>
                    prev ? { ...prev, sustainability: { ...prev.sustainability, image: url } } : prev,
                  )
                }
                tenant={currentWebsite.slug}
              />
              <div className="space-y-2">
                <Label>Video URL (YouTube/Vimeo embed)</Label>
                <Input
                  value={content?.sustainability?.videoUrl || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, sustainability: { ...prev.sustainability, videoUrl: e.target.value } } : prev,
                    )
                  }
                  placeholder="https://youtube.com/embed/..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={content?.sustainability?.ctaText || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, sustainability: { ...prev.sustainability, ctaText: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input
                    value={content?.sustainability?.ctaLink || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, sustainability: { ...prev.sustainability, ctaLink: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-4 border p-4 rounded-lg">
                <Label className="font-semibold">Statistics Highlight</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      value={content?.sustainability?.stats?.value || ""}
                      onChange={(e) =>
                        setContent((prev) =>
                          prev
                            ? {
                              ...prev,
                              sustainability: {
                                ...prev.sustainability,
                                stats: { ...(prev.sustainability.stats || {}), value: e.target.value },
                              },
                            }
                            : prev,
                        )
                      }
                      placeholder="e.g. 50+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={content?.sustainability?.stats?.label || ""}
                      onChange={(e) =>
                        setContent((prev) =>
                          prev
                            ? {
                              ...prev,
                              sustainability: {
                                ...prev.sustainability,
                                stats: { ...(prev.sustainability.stats || {}), label: e.target.value },
                              },
                            }
                            : prev,
                        )
                      }
                      placeholder="e.g. Years of Experience"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">Features</Label>
                {content?.sustainability?.features?.map((feature, index) => (
                  <div key={feature.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Feature {index + 1}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeSustainabilityFeature(feature.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateSustainabilityFeature(feature.id, "title", e.target.value)}
                          placeholder="Feature Title"
                        />
                      </div>
                      <div className="space-y-2">
                        <ImageUploadField
                          label="Icon Image"
                          value={feature.icon}
                          onChange={(url) => updateSustainabilityFeature(feature.id, "icon", url)}
                          tenant={currentWebsite.slug}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description}
                        onChange={(e) => updateSustainabilityFeature(feature.id, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                {(!content?.sustainability?.features || content.sustainability.features.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No features added yet. Click "Add Feature" to create one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Section */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>Projects Section</CardTitle>
                  <CardDescription>Featured projects on home page</CardDescription>
                </div>
                <Button onClick={addProjectItems} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.projects?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, projects: { ...prev.projects, badge: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.projects?.title || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, projects: { ...prev.projects, title: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={content?.projects?.ctaText || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, projects: { ...prev.projects, ctaText: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input
                    value={content?.projects?.ctaLink || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, projects: { ...prev.projects, ctaLink: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Projects</Label>
                {content?.projects?.items?.map((items, index) => (
                  <div key={items.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">items {index + 1}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeProjectItems(items.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={items.title}
                          onChange={(e) => updateProjectItems(items.id, "title", e.target.value)}
                          placeholder="project Title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={items.location}
                          onChange={(e) => updateProjectItems(items.id, "location", e.target.value)}
                          placeholder="project Location"
                        />
                      </div>
                      <div className="space-y-2">
                        <ImageUploadField
                          label="Icon Image"
                          value={items.image}
                          onChange={(url) => updateProjectItems(items.id, "image", url)}
                          tenant={currentWebsite.slug}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={items.description}
                        onChange={(e) => updateProjectItems(items.id, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                {(!content?.projects?.items || content.projects.items.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No Projects added yet. Click "Add Projects" to create one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Testimonials Section</CardTitle>
                  <CardDescription>Customer testimonials displayed on home page</CardDescription>
                </div>
                <Button onClick={addtestimonialItems} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Testimonials
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.testimonials?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, testimonials: { ...prev.testimonials, badge: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.testimonials?.title || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, testimonials: { ...prev.testimonials, title: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content?.testimonials?.subtitle || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, testimonials: { ...prev.testimonials, subtitle: e.target.value } } : prev,
                    )
                  }
                />
              </div>
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Testimonials</Label>
                {content?.testimonials?.items?.map((items, index) => (
                  <div key={items._id || index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">items {index + 1}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removetestimonialItems(items.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={items.name}
                          onChange={(e) => updatetestimonialItems(items.id, "name", e.target.value)}
                          placeholder="Auther name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Input
                          value={items.role}
                          onChange={(e) => updatetestimonialItems(items.id, "role", e.target.value)}
                          placeholder="Auther role"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <Input
                          type="number"
                          value={items.rating ?? ""}
                          min={1}
                          max={5}
                          onChange={(e) =>
                            updatetestimonialItems(
                              items.id,
                              "rating",
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          placeholder="Author rating"
                        />
                      </div>
                      <div className="space-y-2">
                        <ImageUploadField
                          label="Avatar"
                          value={items.avatar}
                          onChange={(url) => updatetestimonialItems(items.id, "avatar", url)}
                          tenant={currentWebsite.slug}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={items.content}
                        onChange={(e) => updatetestimonialItems(items.id, "content", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                {(!content?.testimonials?.items || content.testimonials.items.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No Testimonials added yet. Click "Add Testimonials" to create one.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
