export interface AdminJob {
  id: string
  title: string
  company: string
  location: string
  jobType: 'full-time' | 'part-time' | 'internship' | 'remote' | 'hybrid' | 'contract'
  category: 'internship' | 'mnc' | 'banking' | 'government' | 'startup' | 'cat-mba'
  salary?: string
  applyLink: string       // DIRECT external apply URL
  deadline?: string       // ISO date string
  description?: string
  isActive: boolean
  isPinned: boolean
  isFeatured: boolean
  source: 'admin'         // marks it as manually added
  createdAt: string       // ISO date string
  updatedAt: string
}

export interface AdminLog {
  id: string
  action: string
  details: string
  createdAt: string
}
