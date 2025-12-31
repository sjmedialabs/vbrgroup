"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import type { JobOpening, JobApplication } from "@/lib/db/schemas"
import { useWebsite } from "@/lib/contexts/website-context"

const applicationStatusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-green-100 text-green-800",
  interviewed: "bg-purple-100 text-purple-800",
  offered: "bg-indigo-100 text-indigo-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
}

export default function CareersAdminPage() {
  const { currentWebsite } = useWebsite()

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Careers Management</h2>
        <p className="text-gray-500 mt-1">
          Careers for <span className="font-medium">{currentWebsite.name}</span>
        </p>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList>
          <TabsTrigger value="jobs">Job Openings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="mt-6">
          <JobsTab tenantSlug={currentWebsite.slug} />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <ApplicationsTab tenantSlug={currentWebsite.slug} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function JobsTab({ tenantSlug }: { tenantSlug: string }) {
  const [jobs, setJobs] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [tenantSlug])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs?tenant=${tenantSlug}`)
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" })
      fetchJobs()
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Job Openings ({jobs.length})</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#2d8a39] hover:bg-[#236b2d]">
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <JobForm tenantSlug={tenantSlug} onSuccess={fetchJobs} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No job openings yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>{job.type}</TableCell>
                  <TableCell>
                    <Badge variant={job.isActive ? "default" : "secondary"}>
                      {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Job</DialogTitle>
                          </DialogHeader>
                          <JobForm job={job} tenantSlug={tenantSlug} onSuccess={fetchJobs} />
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => deleteJob(job._id!)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function JobForm({ job, tenantSlug, onSuccess }: { job?: JobOpening; tenantSlug: string; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      tenantSlug,
      title: formData.get("title"),
      department: formData.get("department"),
      location: formData.get("location"),
      type: formData.get("type"),
      description: formData.get("description"),
      requirements: (formData.get("requirements") as string).split("\n").filter(Boolean),
      responsibilities: (formData.get("responsibilities") as string).split("\n").filter(Boolean),
      salary: formData.get("salary"),
      isActive: formData.get("isActive") === "true",
    }

    try {
      const url = job ? `/api/jobs/${job._id}` : "/api/jobs"
      const method = job ? "PUT" : "POST"
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      onSuccess()
    } catch (error) {
      console.error("Error saving job:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input id="title" name="title" defaultValue={job?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Input id="department" name="department" defaultValue={job?.department} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input id="location" name="location" defaultValue={job?.location} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select name="type" defaultValue={job?.type || "full-time"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary">Salary Range</Label>
        <Input id="salary" name="salary" defaultValue={job?.salary} placeholder="e.g., ₹12-18 LPA" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" name="description" defaultValue={job?.description} required rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements (one per line)</Label>
        <Textarea id="requirements" name="requirements" defaultValue={job?.requirements?.join("\n")} rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
        <Textarea
          id="responsibilities"
          name="responsibilities"
          defaultValue={job?.responsibilities?.join("\n")}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="isActive">Status</Label>
        <Select name="isActive" defaultValue={job?.isActive !== false ? "true" : "false"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#2d8a39] hover:bg-[#236b2d]">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {job ? "Update Job" : "Create Job"}
      </Button>
    </form>
  )
}

function ApplicationsTab({ tenantSlug }: { tenantSlug: string }) {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [tenantSlug])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/applications?tenant=${tenantSlug}`)
      const data = await res.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      fetchApplications()
    } catch (error) {
      console.error("Error updating application:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications ({applications.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No applications yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>{app.jobTitle}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{app.email}</p>
                      <p className="text-gray-500">{app.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={applicationStatusColors[app.status]}>{app.status}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                      <Select value={app.status} onValueChange={(status) => updateStatus(app._id!, status)}>
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="reviewing">Reviewing</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="interviewed">Interviewed</SelectItem>
                          <SelectItem value="offered">Offered</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
