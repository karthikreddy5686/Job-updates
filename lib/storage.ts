import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function readJSON<T>(file: string, fallback: T): T {
  ensureDir()
  const filePath = path.join(DATA_DIR, file)
  try {
    if (!fs.existsSync(filePath)) return fallback
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(file: string, data: T): void {
  ensureDir()
  const filePath = path.join(DATA_DIR, file)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export interface AdminJob {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  category: string
  salary: string
  applyLink: string
  deadline: string
  description: string
  isActive: boolean
  isPinned: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminLog {
  id: string
  action: string
  details: string
  createdAt: string
}

export const Jobs = {
  all: (): AdminJob[] => readJSON<AdminJob[]>('jobs.json', []),

  save: (jobs: AdminJob[]) => writeJSON('jobs.json', jobs),

  add: (job: Omit<AdminJob, 'id' | 'createdAt' | 'updatedAt'>): AdminJob => {
    const jobs = Jobs.all()
    const newJob: AdminJob = {
      ...job,
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    Jobs.save([newJob, ...jobs])
    return newJob
  },

  update: (id: string, updates: Partial<AdminJob>): AdminJob | null => {
    const jobs = Jobs.all()
    const i = jobs.findIndex(j => j.id === id)
    if (i === -1) return null
    jobs[i] = { ...jobs[i], ...updates, updatedAt: new Date().toISOString() }
    Jobs.save(jobs)
    return jobs[i]
  },

  remove: (id: string): boolean => {
    const jobs = Jobs.all()
    const filtered = jobs.filter(j => j.id !== id)
    if (filtered.length === jobs.length) return false
    Jobs.save(filtered)
    return true
  },

  byCategory: (category: string): AdminJob[] =>
    Jobs.all().filter(j => j.category === category && j.isActive),
}

export const Logs = {
  all: (): AdminLog[] => readJSON<AdminLog[]>('logs.json', []),

  add: (action: string, details: string) => {
    const logs = Logs.all()
    const log: AdminLog = {
      id: `log_${Date.now()}`,
      action,
      details,
      createdAt: new Date().toISOString(),
    }
    writeJSON('logs.json', [log, ...logs].slice(0, 200))
  },
}
