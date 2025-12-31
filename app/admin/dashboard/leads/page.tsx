"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, Mail, Phone } from "lucide-react"
import type { Lead } from "@/lib/db/schemas"
import { useWebsite } from "@/lib/contexts/website-context"

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  converted: "bg-purple-100 text-purple-800",
  closed: "bg-gray-100 text-gray-800",
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { currentWebsite } = useWebsite()

  useEffect(() => {
    if (!currentWebsite) return
    fetchLeads()
  }, [statusFilter, currentWebsite])

  const fetchLeads = async () => {
    if (!currentWebsite) return
    setLoading(true)
    try {
      const url =
        statusFilter === "all"
          ? `/api/leads?tenant=${currentWebsite.slug}`
          : `/api/leads?tenant=${currentWebsite.slug}&status=${statusFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error("Error fetching leads:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (id: string, status: string, notes?: string) => {
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      })
      fetchLeads()
    } catch (error) {
      console.error("Error updating lead:", error)
    }
  }

  if (!currentWebsite) {
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
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-500 mt-1">
            Leads for <span className="font-medium">{currentWebsite.name}</span>
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No leads found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{lead.subject}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <LeadDetailDialog lead={lead} onUpdate={updateLeadStatus} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LeadDetailDialog({
  lead,
  onUpdate,
}: {
  lead: Lead
  onUpdate: (id: string, status: string, notes?: string) => void
}) {
  const [status, setStatus] = useState(lead.status)
  const [notes, setNotes] = useState(lead.notes || "")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-500">Name</Label>
              <p className="font-medium">{lead.name}</p>
            </div>
            <div>
              <Label className="text-gray-500">Email</Label>
              <p className="font-medium">{lead.email}</p>
            </div>
            {lead.phone && (
              <div>
                <Label className="text-gray-500">Phone</Label>
                <p className="font-medium">{lead.phone}</p>
              </div>
            )}
            {lead.company && (
              <div>
                <Label className="text-gray-500">Company</Label>
                <p className="font-medium">{lead.company}</p>
              </div>
            )}
          </div>

          <div>
            <Label className="text-gray-500">Subject</Label>
            <p className="font-medium">{lead.subject}</p>
          </div>

          <div>
            <Label className="text-gray-500">Message</Label>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{lead.message}</p>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead..."
              rows={3}
            />
          </div>

          <Button onClick={() => onUpdate(lead._id!, status, notes)} className="w-full bg-[#2d8a39] hover:bg-[#236b2d]">
            Update Lead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
