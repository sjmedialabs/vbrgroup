"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Trash2, GripVertical, Save } from "lucide-react"
import type { NavigationMenu, MenuItem } from "@/lib/db/schemas"

export default function NavigationPage() {
  const [headerNav, setHeaderNav] = useState<NavigationMenu | null>(null)
  const [footerNav, setFooterNav] = useState<NavigationMenu | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNavigation()
  }, [])

  const fetchNavigation = async () => {
    try {
      const res = await fetch("/api/navigation?tenant=kisan-plant-technologies")
      const data = await res.json()
      setHeaderNav(data.header)
      setFooterNav(data.footer)
    } catch (error) {
      console.error("Error fetching navigation:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveNavigation = async (location: "header" | "footer") => {
    setSaving(true)
    const nav = location === "header" ? headerNav : footerNav

    try {
      await fetch(`/api/navigation?location=${location}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nav),
      })
      alert("Navigation saved successfully!")
    } catch (error) {
      console.error("Error saving navigation:", error)
      alert("Error saving navigation")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Navigation Manager</h2>
        <p className="text-gray-500 mt-1">Configure header and footer navigation menus</p>
      </div>

      <Tabs defaultValue="header">
        <TabsList>
          <TabsTrigger value="header">Header Navigation</TabsTrigger>
          <TabsTrigger value="footer">Footer Navigation</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="mt-6">
          <NavigationEditor
            navigation={headerNav}
            onChange={setHeaderNav}
            onSave={() => saveNavigation("header")}
            saving={saving}
            allowChildren={true}
          />
        </TabsContent>

        <TabsContent value="footer" className="mt-6">
          <NavigationEditor
            navigation={footerNav}
            onChange={setFooterNav}
            onSave={() => saveNavigation("footer")}
            saving={saving}
            allowChildren={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NavigationEditor({
  navigation,
  onChange,
  onSave,
  saving,
  allowChildren,
}: {
  navigation: NavigationMenu | null
  onChange: (nav: NavigationMenu) => void
  onSave: () => void
  saving: boolean
  allowChildren: boolean
}) {
  if (!navigation) return null

  const addItem = () => {
    const newItem: MenuItem = {
      id: `nav-${Date.now()}`,
      label: "New Item",
      url: "/",
      order: navigation.items.length,
    }
    onChange({
      ...navigation,
      items: [...navigation.items, newItem],
    })
  }

  const updateItem = (index: number, updates: Partial<MenuItem>) => {
    const newItems = [...navigation.items]
    newItems[index] = { ...newItems[index], ...updates }
    onChange({ ...navigation, items: newItems })
  }

  const removeItem = (index: number) => {
    const newItems = navigation.items.filter((_, i) => i !== index)
    onChange({ ...navigation, items: newItems })
  }

  const addChildItem = (parentIndex: number) => {
    const newChild: MenuItem = {
      id: `nav-child-${Date.now()}`,
      label: "New Submenu Item",
      url: "/",
      order: navigation.items[parentIndex].children?.length || 0,
    }
    const newItems = [...navigation.items]
    newItems[parentIndex] = {
      ...newItems[parentIndex],
      children: [...(newItems[parentIndex].children || []), newChild],
    }
    onChange({ ...navigation, items: newItems })
  }

  const updateChildItem = (parentIndex: number, childIndex: number, updates: Partial<MenuItem>) => {
    const newItems = [...navigation.items]
    const children = [...(newItems[parentIndex].children || [])]
    children[childIndex] = { ...children[childIndex], ...updates }
    newItems[parentIndex] = { ...newItems[parentIndex], children }
    onChange({ ...navigation, items: newItems })
  }

  const removeChildItem = (parentIndex: number, childIndex: number) => {
    const newItems = [...navigation.items]
    const children = newItems[parentIndex].children?.filter((_, i) => i !== childIndex)
    newItems[parentIndex] = { ...newItems[parentIndex], children }
    onChange({ ...navigation, items: newItems })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>Drag to reorder, click to edit</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
          <Button onClick={onSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {navigation.items.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-4">
              <GripVertical className="h-5 w-5 text-gray-400 cursor-grab" />
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input
                    value={item.label}
                    onChange={(e) => updateItem(index, { label: e.target.value })}
                    placeholder="Menu Label"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={item.url}
                    onChange={(e) => updateItem(index, { url: e.target.value })}
                    placeholder="/page-url"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Target</Label>
                  <Select
                    value={item.target || "_self"}
                    onValueChange={(value) => updateItem(index, { target: value as "_self" | "_blank" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_self">Same Window</SelectItem>
                      <SelectItem value="_blank">New Window</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            {/* Children (Dropdown items) */}
            {allowChildren && (
              <div className="ml-8 space-y-2">
                {item.children?.map((child, childIndex) => (
                  <div key={child.id} className="flex items-center gap-4 bg-gray-50 p-2 rounded">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                    <Input
                      value={child.label}
                      onChange={(e) => updateChildItem(index, childIndex, { label: e.target.value })}
                      placeholder="Submenu Label"
                      className="flex-1"
                    />
                    <Input
                      value={child.url}
                      onChange={(e) => updateChildItem(index, childIndex, { url: e.target.value })}
                      placeholder="/url"
                      className="flex-1"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeChildItem(index, childIndex)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => addChildItem(index)} className="ml-6">
                  <Plus className="mr-1 h-3 w-3" />
                  Add Submenu Item
                </Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
