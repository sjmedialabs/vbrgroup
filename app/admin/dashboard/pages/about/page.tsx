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

interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
}
interface Feature {
  id: string
  icon: string
  title: string
  description: string
}
interface AboutPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
    image: string
    features: Feature[]
  }
  mission: {
    title: string
    description: string
    link: string
  }
  impact: {
    title: string
    description: string
    link: string
  }
  whatWeDo: {
    title: string
    description: string
    link: string
  }
  whyChooseUs: {
    title: string
    badge: string
    description: string
    features: Feature[]
  }
  growth: {
    badge: string
    title: string
    description: string
    stats: { label: string; value: string }[]
  }
  // team: {
  //   title: string
  //   subtitle: string
  //   members: TeamMember[]
  // }
}
const defaultContent: AboutPageContent = {
  hero: {
    title: "",
    backgroundImage: "",
  },
  intro: {
    badge: "",
    title: "",
    description: "",
    image: "",
    features: [],
  },

    whatWeDo: { title: "", description: "", link: "" },
    impact: { title: "", description: "", link: "" },
    mission: { title: "", description: "", link: "" },

  whyChooseUs: {
    badge: "",
    title: "",
    description: "",
    features: [],
  },
  growth: {
    badge: "",
    title: "",
    description: "",
    stats: [],
  },
}

export default function AboutPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<AboutPageContent>(defaultContent)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/about/content?tenant=${currentWebsite?.slug}`)
      const data = await res.json()
      setContent(data.content || defaultContent)
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
      const res = await fetch(`/api/pages/about/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "About page content saved successfully" })
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
    const addAboutFeature = () => {
    if (!content) return
    setContent({
      ...content,
      intro: {
        ...content.intro,
        features: [
          ...(content.intro.features || []),
          { id: generateId(), icon: "", title: "", description: "" },
        ],
      },
    })
  }

  const removeAboutFeature = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      intro: {
        ...content.intro,
        features: content.intro.features.filter((f) => f.id !== id),
      },
    })
  }

  const updateAboutFeature = (id: string, field: keyof Feature, value: string) => {
    if (!content) return
    setContent({
      ...content,
      intro: {
        ...content.intro,
        features: content.intro.features.map((f) => (f.id === id ? { ...f, [field]: value } : f)),
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
          <h2 className="text-2xl font-bold text-gray-900">About Page</h2>
          <p className="text-gray-500 mt-1">Manage about page sections for {currentWebsite.name}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    <Tabs>
      <TabsList>
        <TabsTrigger value="hero">Hero</TabsTrigger>
        <TabsTrigger value="intro">Introduction</TabsTrigger>
        <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
        <TabsTrigger value="whyChoose">Why Choose Us</TabsTrigger>
        <TabsTrigger value="growth">Our Growth</TabsTrigger>
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
              type="text"
                value={content?.hero?.title || ""}
                onChange={(e) =>
                  setContent((prev) => (prev ? { ...prev, hero: { ...prev.hero, title: e.target.value } } : prev))
                }
                placeholder="About Us"
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
            <div className="flex flex-row justify-between">
              <div>
            <CardTitle>Introduction Section</CardTitle>
            <CardDescription>Company introduction and overview</CardDescription></div>
                            <Button onClick={addAboutFeature} variant="outline" size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Feature
                            </Button>
                            </div>
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
                          <div className="space-y-4">
                <Label className="text-lg font-semibold">Features</Label>
                {content?.intro?.features?.map((feature, index) => (
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
                {(!content?.intro?.features || content.intro.features.length === 0) && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No features added yet. Click "Add Feature" to create one.
                  </div>
                )}
              </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="mission">
        <Card>
          <CardHeader>
            <CardTitle>Mission Section</CardTitle>
            <CardDescription>Company mission statement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={content?.mission?.title || ""}
                onChange={(e) =>
                  setContent((prev) =>
                    prev ? { ...prev, mission: { ...prev.mission, title: e.target.value } } : prev,
                  )
                }
                placeholder="Our Mission"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={content?.mission?.description || ""}
                onChange={(e) =>
                  setContent((prev) =>
                    prev ? { ...prev, mission: { ...prev.mission, description: e.target.value } } : prev,
                  )
                }
                rows={4}
              />
            </div>
            <ImageUploadField
              label="Mission Image"
              value={content?.mission?.image || ""}
              onChange={(url) =>
                setContent((prev) => (prev ? { ...prev, mission: { ...prev.mission, image: url } } : prev))
              }
              tenant={currentWebsite.slug}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="vision">
        <Card>
          <CardHeader>
            <CardTitle>Vision Section</CardTitle>
            <CardDescription>Company vision statement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={content?.vision?.title || ""}
                onChange={(e) =>
                  setContent((prev) => (prev ? { ...prev, vision: { ...prev.vision, title: e.target.value } } : prev))
                }
                placeholder="Our Vision"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={content?.vision?.description || ""}
                onChange={(e) =>
                  setContent((prev) =>
                    prev ? { ...prev, vision: { ...prev.vision, description: e.target.value } } : prev,
                  )
                }
                rows={4}
              />
            </div>
            <ImageUploadField
              label="Vision Image"
              value={content?.vision?.image || ""}
              onChange={(url) =>
                setContent((prev) => (prev ? { ...prev, vision: { ...prev.vision, image: url } } : prev))
              }
              tenant={currentWebsite.slug}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="values">
        <Card>
          <CardHeader>
            <CardTitle>Core Values</CardTitle>
            <CardDescription>Company values and principles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={content?.values?.title || ""}
                onChange={(e) =>
                  setContent((prev) => (prev ? { ...prev, values: { ...prev.values, title: e.target.value } } : prev))
                }
                placeholder="Our Core Values"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Values</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!content) return
                  setContent({
                    ...content,
                    values: {
                      ...content.values,
                      items: [
                        ...(content.values?.items || []),
                        { id: generateId(), icon: "", title: "", description: "" },
                      ],
                    },
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Value
              </Button>
            </div>
            {content?.values?.items?.map((item, idx) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Value {idx + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setContent((prev) =>
                        prev
                          ? {
                            ...prev,
                            values: { ...prev.values, items: prev.values.items.filter((v) => v.id !== item.id) },
                          }
                          : prev,
                      )
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    setContent((prev) =>
                      prev
                        ? {
                          ...prev,
                          values: {
                            ...prev.values,
                            items: prev.values.items.map((v) =>
                              v.id === item.id ? { ...v, title: e.target.value } : v,
                            ),
                          },
                        }
                        : prev,
                    )
                  }}
                />
                <Textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    setContent((prev) =>
                      prev
                        ? {
                          ...prev,
                          values: {
                            ...prev.values,
                            items: prev.values.items.map((v) =>
                              v.id === item.id ? { ...v, description: e.target.value } : v,
                            ),
                          },
                        }
                        : prev,
                    )
                  }}
                  rows={2}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="team">
        <Card>
          <CardHeader>
            <CardTitle>Team Section</CardTitle>
            <CardDescription>Leadership team members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={content?.team?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, team: { ...prev.team, title: e.target.value } } : prev))
                  }
                  placeholder="Our Leadership Team"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content?.team?.subtitle || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, team: { ...prev.team, subtitle: e.target.value } } : prev,
                    )
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Team Members</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!content) return
                  setContent({
                    ...content,
                    team: {
                      ...content.team,
                      members: [
                        ...(content.team?.members || []),
                        { id: generateId(), name: "", role: "", image: "", bio: "" },
                      ],
                    },
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
            {content?.team?.members?.map((member, idx) => (
              <div key={member.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{member.name || `Member ${idx + 1}`}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setContent((prev) =>
                        prev
                          ? {
                            ...prev,
                            team: { ...prev.team, members: prev.team.members.filter((m) => m.id !== member.id) },
                          }
                          : prev,
                      )
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => {
                      setContent((prev) =>
                        prev
                          ? {
                            ...prev,
                            team: {
                              ...prev.team,
                              members: prev.team.members.map((m) =>
                                m.id === member.id ? { ...m, name: e.target.value } : m,
                              ),
                            },
                          }
                          : prev,
                      )
                    }}
                  />
                  <Input
                    placeholder="Role"
                    value={member.role}
                    onChange={(e) => {
                      setContent((prev) =>
                        prev
                          ? {
                            ...prev,
                            team: {
                              ...prev.team,
                              members: prev.team.members.map((m) =>
                                m.id === member.id ? { ...m, role: e.target.value } : m,
                              ),
                            },
                          }
                          : prev,
                      )
                    }}
                  />
                </div>
                <ImageUploadField
                  label="Photo"
                  value={member.image}
                  onChange={(url) => {
                    setContent((prev) =>
                      prev
                        ? {
                          ...prev,
                          team: {
                            ...prev.team,
                            members: prev.team.members.map((m) => (m.id === member.id ? { ...m, image: url } : m)),
                          },
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
    </Tabs>
    </div >
  )
}
