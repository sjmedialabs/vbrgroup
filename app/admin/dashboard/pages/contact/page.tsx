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

interface Office {
  type: string
  name: string
  address?: string
  city?: string
  isHeadOffice: boolean
}

interface ContactPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  phoneBar: {
    tollFree: { label: string; number: string }
    customerCare: { label: string; number: string }
  }
  officeAddresses: {
    title: string
    offices: Office[]
  }
  contactInfo: {
    mediaEnquiries: { label: string; email: string }
    contactNumbers: { label: string; numbers: string[] }
    emails: { label: string; addresses: string[] }
  }
  socialMedia: {
    title: string
    channels: Array<{ name: string; url: string }>
  }
}

export default function ContactPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<ContactPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/contact/content?tenant=${currentWebsite?.slug}`)
      const data = await res.json()
      setContent(data.content)
    } catch (error) {
      console.error("Error fetching content:", error)
      toast({ title: "Error", description: "Failed to load content", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content || !currentWebsite) return
    setSaving(true)
    try {
      const res = await fetch(`/api/pages/contact/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Contact page saved successfully" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save contact page", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const addOffice = () => {
    if (!content) return
    setContent({
      ...content,
      officeAddresses: {
        ...content.officeAddresses,
        offices: [
          ...content.officeAddresses.offices,
          { type: "Branch", name: "", address: "", city: "", isHeadOffice: false },
        ],
      },
    })
  }

  const removeOffice = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      officeAddresses: {
        ...content.officeAddresses,
        offices: content.officeAddresses.offices.filter((_, i) => i !== index),
      },
    })
  }

  const updateOffice = (index: number, field: keyof Office, value: any) => {
    if (!content) return
    const offices = [...content.officeAddresses.offices]
    offices[index] = { ...offices[index], [field]: value }
    setContent({
      ...content,
      officeAddresses: { ...content.officeAddresses, offices },
    })
  }

  const addContactNumber = () => {
    if (!content) return
    setContent({
      ...content,
      contactInfo: {
        ...content.contactInfo,
        contactNumbers: {
          ...content.contactInfo.contactNumbers,
          numbers: [...content.contactInfo.contactNumbers.numbers, ""],
        },
      },
    })
  }

  const removeContactNumber = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      contactInfo: {
        ...content.contactInfo,
        contactNumbers: {
          ...content.contactInfo.contactNumbers,
          numbers: content.contactInfo.contactNumbers.numbers.filter((_, i) => i !== index),
        },
      },
    })
  }

  const updateContactNumber = (index: number, value: string) => {
    if (!content) return
    const numbers = [...content.contactInfo.contactNumbers.numbers]
    numbers[index] = value
    setContent({
      ...content,
      contactInfo: {
        ...content.contactInfo,
        contactNumbers: { ...content.contactInfo.contactNumbers, numbers },
      },
    })
  }

  const addEmail = () => {
    if (!content) return
    setContent({
      ...content,
      contactInfo: {
        ...content.contactInfo,
        emails: {
          ...content.contactInfo.emails,
          addresses: [...content.contactInfo.emails.addresses, ""],
        },
      },
    })
  }

  const removeEmail = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      contactInfo: {
        ...content.contactInfo,
        emails: {
          ...content.contactInfo.emails,
          addresses: content.contactInfo.emails.addresses.filter((_, i) => i !== index),
        },
      },
    })
  }

  const updateEmail = (index: number, value: string) => {
    if (!content) return
    const addresses = [...content.contactInfo.emails.addresses]
    addresses[index] = value
    setContent({
      ...content,
      contactInfo: {
        ...content.contactInfo,
        emails: { ...content.contactInfo.emails, addresses },
      },
    })
  }

  const addSocialChannel = () => {
    if (!content) return
    setContent({
      ...content,
      socialMedia: {
        ...content.socialMedia,
        channels: [...content.socialMedia.channels, { name: "", url: "" }],
      },
    })
  }

  const removeSocialChannel = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      socialMedia: {
        ...content.socialMedia,
        channels: content.socialMedia.channels.filter((_, i) => i !== index),
      },
    })
  }

  const updateSocialChannel = (index: number, field: "name" | "url", value: string) => {
    if (!content) return
    const channels = [...content.socialMedia.channels]
    channels[index] = { ...channels[index], [field]: value }
    setContent({
      ...content,
      socialMedia: { ...content.socialMedia, channels },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Contact Page</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="phonebar">Phone Bar</TabsTrigger>
          <TabsTrigger value="offices">Offices</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                  placeholder="Let's Build the Future Together"
                />
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                <ImageUploadField
                  value={content.hero.backgroundImage}
                  onChange={(url) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, backgroundImage: url },
                    })
                  }
                  label="Upload Hero Background"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phone Bar Section */}
        <TabsContent value="phonebar">
          <Card>
            <CardHeader>
              <CardTitle>Phone Bar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Toll Free Number</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={content.phoneBar.tollFree.label}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          phoneBar: {
                            ...content.phoneBar,
                            tollFree: { ...content.phoneBar.tollFree, label: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number</Label>
                    <Input
                      value={content.phoneBar.tollFree.number}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          phoneBar: {
                            ...content.phoneBar,
                            tollFree: { ...content.phoneBar.tollFree, number: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Customer Care Number</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={content.phoneBar.customerCare.label}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          phoneBar: {
                            ...content.phoneBar,
                            customerCare: { ...content.phoneBar.customerCare, label: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number</Label>
                    <Input
                      value={content.phoneBar.customerCare.number}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          phoneBar: {
                            ...content.phoneBar,
                            customerCare: { ...content.phoneBar.customerCare, number: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Office Addresses Section */}
        <TabsContent value="offices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Office Addresses</CardTitle>
                <Button onClick={addOffice} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Office
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={content.officeAddresses.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      officeAddresses: { ...content.officeAddresses, title: e.target.value },
                    })
                  }
                />
              </div>

              {content.officeAddresses.offices.map((office, index) => (
                <Card key={index} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Office {index + 1}</h4>
                    <Button onClick={() => removeOffice(index)} size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Input
                        value={office.type}
                        onChange={(e) => updateOffice(index, "type", e.target.value)}
                        placeholder="Head Office / Branch-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={office.name}
                        onChange={(e) => updateOffice(index, "name", e.target.value)}
                        placeholder="VBR Towers"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Address (Optional)</Label>
                      <Input
                        value={office.address || ""}
                        onChange={(e) => updateOffice(index, "address", e.target.value)}
                        placeholder="Madhapur, Raidurg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City (Optional)</Label>
                      <Input
                        value={office.city || ""}
                        onChange={(e) => updateOffice(index, "city", e.target.value)}
                        placeholder="Telangana - 500008"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`headoffice-${index}`}
                      checked={office.isHeadOffice}
                      onChange={(e) => updateOffice(index, "isHeadOffice", e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`headoffice-${index}`}>Mark as Head Office</Label>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Info Section */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Media Enquiries */}
              <div className="space-y-4">
                <h3 className="font-semibold">Media Enquiries</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={content.contactInfo.mediaEnquiries.label}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            mediaEnquiries: { ...content.contactInfo.mediaEnquiries, label: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={content.contactInfo.mediaEnquiries.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contactInfo: {
                            ...content.contactInfo,
                            mediaEnquiries: { ...content.contactInfo.mediaEnquiries, email: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Contact Numbers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Contact Numbers</h3>
                  <Button onClick={addContactNumber} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Number
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={content.contactInfo.contactNumbers.label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: {
                          ...content.contactInfo,
                          contactNumbers: { ...content.contactInfo.contactNumbers, label: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                {content.contactInfo.contactNumbers.numbers.map((number, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={number}
                      onChange={(e) => updateContactNumber(index, e.target.value)}
                      placeholder="+91-9848123456"
                    />
                    {content.contactInfo.contactNumbers.numbers.length > 1 && (
                      <Button onClick={() => removeContactNumber(index)} size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Emails */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Email Addresses</h3>
                  <Button onClick={addEmail} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={content.contactInfo.emails.label}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contactInfo: {
                          ...content.contactInfo,
                          emails: { ...content.contactInfo.emails, label: e.target.value },
                        },
                      })
                    }
                  />
                </div>
                {content.contactInfo.emails.addresses.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder="info@example.com"
                    />
                    {content.contactInfo.emails.addresses.length > 1 && (
                      <Button onClick={() => removeEmail(index)} size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Section */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Social Media</CardTitle>
                <Button onClick={addSocialChannel} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Channel
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={content.socialMedia.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      socialMedia: { ...content.socialMedia, title: e.target.value },
                    })
                  }
                />
              </div>

              {content.socialMedia.channels.map((channel, index) => (
                <div key={index} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={channel.name}
                      onChange={(e) => updateSocialChannel(index, "name", e.target.value)}
                      placeholder="Facebook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL</Label>
                    <Input
                      value={channel.url}
                      onChange={(e) => updateSocialChannel(index, "url", e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <Button onClick={() => removeSocialChannel(index)} size="icon" variant="ghost">
                    <Trash2 className="h-4 w-4 text-destructive" />
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
