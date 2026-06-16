// Runs only server-side in API routes

import fs from 'fs'
import path from 'path'

const isVercel = process.env.VERCEL === '1' || process.env.NEXT_PUBLIC_VERCEL_ENV;
const DATA_DIR = isVercel ? '/tmp/data' : path.join(process.cwd(), 'backend', 'data');
const INITIAL_DATA_DIR = path.join(process.cwd(), 'backend', 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    
    // On Vercel, copy initial mock data to the temporary writable directory
    if (isVercel && fs.existsSync(INITIAL_DATA_DIR)) {
      try {
        const files = fs.readdirSync(INITIAL_DATA_DIR);
        for (const file of files) {
          if (file.endsWith('.json')) {
            fs.copyFileSync(
              path.join(INITIAL_DATA_DIR, file),
              path.join(DATA_DIR, file)
            );
          }
        }
      } catch (e) {
        console.error('Failed to copy initial data:', e);
      }
    }
  }
}

export interface AdminJob {
  id: string
  title: string
  company: string
  logo?: string
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
}

export function getJobs(): AdminJob[] {
  ensureDir()
  const file = path.join(DATA_DIR, 'admin-jobs.json')
  try {
    if (!fs.existsSync(file)) return []
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch { return [] }
}

export function saveJobs(jobs: AdminJob[]): void {
  ensureDir()
  fs.writeFileSync(
    path.join(DATA_DIR, 'admin-jobs.json'),
    JSON.stringify(jobs, null, 2)
  )
}

export interface LiveFeedItem {
  id: string
  company: string
  role: string
  isNew: boolean
  postedTime: string
}

export function getLiveFeedItems(): LiveFeedItem[] {
  ensureDir()
  const file = path.join(DATA_DIR, 'live-feed.json')
  try {
    if (!fs.existsSync(file)) return []
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch { return [] }
}

export function saveLiveFeedItems(items: LiveFeedItem[]): void {
  ensureDir()
  fs.writeFileSync(
    path.join(DATA_DIR, 'live-feed.json'),
    JSON.stringify(items, null, 2)
  )
}

export interface CompanyLogo {
  company: string;
  logo: string;
}

export function getCompanyLogos(): CompanyLogo[] {
  ensureDir()
  const file = path.join(DATA_DIR, 'company-logos.json')
  try {
    if (!fs.existsSync(file)) return []
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch { return [] }
}

export function saveCompanyLogos(logos: CompanyLogo[]): void {
  ensureDir()
  fs.writeFileSync(
    path.join(DATA_DIR, 'company-logos.json'),
    JSON.stringify(logos, null, 2)
  )
}

export function addJob(
  data: Omit<AdminJob, 'id' | 'createdAt'>
): AdminJob {
  const jobs = getJobs()
  const job: AdminJob = {
    ...data,
    id: `job_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  saveJobs([job, ...jobs])
  return job
}

export function updateJob(
  id: string, 
  updates: Partial<AdminJob>
): AdminJob | null {
  const jobs = getJobs()
  const i = jobs.findIndex(j => j.id === id)
  if (i === -1) return null
  jobs[i] = { ...jobs[i], ...updates }
  saveJobs(jobs)
  return jobs[i]
}

export function deleteJob(id: string): boolean {
  const jobs = getJobs()
  const filtered = jobs.filter(j => j.id !== id)
  if (filtered.length === jobs.length) {
    // If not found in local admin jobs, it might be an automatically fetched job.
    // We add it to the hidden jobs list.
    hideJob(id)
    return true
  }
  saveJobs(filtered)
  return true
}

export function getHiddenJobs(): string[] {
  ensureDir()
  const file = path.join(DATA_DIR, 'hidden-jobs.json')
  try {
    if (!fs.existsSync(file)) return []
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch { return [] }
}

export function hideJob(id: string): void {
  const hidden = getHiddenJobs()
  if (!hidden.includes(id)) {
    hidden.push(id)
    ensureDir()
    fs.writeFileSync(
      path.join(DATA_DIR, 'hidden-jobs.json'),
      JSON.stringify(hidden, null, 2)
    )
  }
}

// ---------- Student storage ----------

export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  collegeName?: string
  registeredAt: string
  passwordHash: string // simple base64 hash for demo
}

export function getStudents(): Student[] {
  ensureDir()
  const file = path.join(DATA_DIR, 'students.json')
  try {
    if (!fs.existsSync(file)) return []
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch { return [] }
}

export function saveStudents(students: Student[]): void {
  ensureDir()
  fs.writeFileSync(
    path.join(DATA_DIR, 'students.json'),
    JSON.stringify(students, null, 2)
  )
}

export function registerStudentServer(
  name: string,
  email: string,
  password: string,
  phone?: string,
  whatsapp?: string,
  collegeName?: string
): { success: boolean; error?: string; student?: Omit<Student, 'passwordHash'> } {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return { success: false, error: 'All fields are required' }
  }
  if (!email.includes('@')) {
    return { success: false, error: 'Enter a valid email' }
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  const students = getStudents()
  if (students.find(s => s.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'This email is already registered. Please login.' }
  }

  const newStudent: Student = {
    id: 'student_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone?.trim(),
    whatsapp: whatsapp?.trim(),
    collegeName: collegeName?.trim(),
    registeredAt: new Date().toISOString(),
    passwordHash: Buffer.from(password).toString('base64'),
  }
  students.push(newStudent)
  saveStudents(students)

  const { passwordHash, ...publicData } = newStudent
  return { success: true, student: publicData }
}

export function loginStudentServer(
  email: string,
  password: string
): { success: boolean; error?: string; student?: Omit<Student, 'passwordHash'> } {
  if (!email.trim() || !password.trim()) {
    return { success: false, error: 'Email and password required' }
  }
  const students = getStudents()
  const found = students.find(
    s => s.email.toLowerCase() === email.toLowerCase().trim() && s.passwordHash === btoa(password)
  )
  if (!found) {
    return { success: false, error: 'Incorrect email or password.' }
  }
  const { passwordHash, ...publicData } = found
  return { success: true, student: publicData }
}

export function deleteStudent(id: string): boolean {
  const students = getStudents()
  const filtered = students.filter(s => s.id !== id)
  if (filtered.length === students.length) return false
  saveStudents(filtered)
  return true
}

export function updateStudentPassword(identifier: string, newHash: string): boolean {
  const students = getStudents()
  const sIndex = students.findIndex(s => s.email.toLowerCase() === identifier.toLowerCase() || s.phone === identifier)
  if (sIndex === -1) return false
  students[sIndex].passwordHash = newHash
  saveStudents(students)
  return true
}

// ---------- OTP Storage ----------
export interface OTPRecord {
  identifier: string
  otp: string
  expiresAt: number
}

export function getOTPs(): OTPRecord[] {
  ensureDir()
  const file = path.join(DATA_DIR, 'otps.json')
  try {
    if (!fs.existsSync(file)) return []
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch { return [] }
}

export function saveOTPs(otps: OTPRecord[]): void {
  ensureDir()
  fs.writeFileSync(
    path.join(DATA_DIR, 'otps.json'),
    JSON.stringify(otps, null, 2)
  )
}

export function generateOTP(identifier: string): string {
  const otps = getOTPs().filter(o => o.expiresAt > Date.now()) // clean old
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  otps.push({
    identifier,
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
  })
  saveOTPs(otps)
  return otp
}

export function verifyOTP(identifier: string, otp: string): boolean {
  const otps = getOTPs()
  const found = otps.find(o => o.identifier.toLowerCase() === identifier.toLowerCase() && o.otp === otp && o.expiresAt > Date.now())
  if (found) {
    saveOTPs(otps.filter(o => o.identifier !== identifier)) // clear used OTP
    return true
  }
  return false
}

// ---------- Admin Credentials ----------
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './admin-config'

export function getAdminCredentials() {
  ensureDir()
  const file = path.join(DATA_DIR, 'admin-credentials.json')
  try {
    if (!fs.existsSync(file)) return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
  }
}

export function updateAdminCredentials(email: string, password: string) {
  ensureDir()
  fs.writeFileSync(
    path.join(DATA_DIR, 'admin-credentials.json'),
    JSON.stringify({ email, password }, null, 2)
  )
}
