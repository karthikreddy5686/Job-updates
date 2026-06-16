// Runs only server-side in API routes

import { getStoreData, setStoreData } from './db';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './admin-config';

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

export async function getJobs(): Promise<AdminJob[]> {
  return await getStoreData<AdminJob[]>('admin-jobs', []);
}

export async function saveJobs(jobs: AdminJob[]): Promise<void> {
  await setStoreData('admin-jobs', jobs);
}

export interface LiveFeedItem {
  id: string
  company: string
  role: string
  isNew: boolean
  postedTime: string
}

export async function getLiveFeedItems(): Promise<LiveFeedItem[]> {
  return await getStoreData<LiveFeedItem[]>('live-feed', []);
}

export async function saveLiveFeedItems(items: LiveFeedItem[]): Promise<void> {
  await setStoreData('live-feed', items);
}

export interface CompanyLogo {
  company: string;
  logo: string;
}

export async function getCompanyLogos(): Promise<CompanyLogo[]> {
  return await getStoreData<CompanyLogo[]>('company-logos', []);
}

export async function saveCompanyLogos(logos: CompanyLogo[]): Promise<void> {
  await setStoreData('company-logos', logos);
}

export async function addJob(data: Omit<AdminJob, 'id' | 'createdAt'>): Promise<AdminJob> {
  const jobs = await getJobs();
  const job: AdminJob = {
    ...data,
    id: `job_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  await saveJobs([job, ...jobs]);
  return job;
}

export async function updateJob(id: string, updates: Partial<AdminJob>): Promise<AdminJob | null> {
  const jobs = await getJobs();
  const i = jobs.findIndex(j => j.id === id);
  if (i === -1) return null;
  jobs[i] = { ...jobs[i], ...updates };
  await saveJobs(jobs);
  return jobs[i];
}

export async function deleteJob(id: string): Promise<boolean> {
  const jobs = await getJobs();
  const filtered = jobs.filter(j => j.id !== id);
  if (filtered.length === jobs.length) {
    await hideJob(id);
    return true;
  }
  await saveJobs(filtered);
  return true;
}

export async function getHiddenJobs(): Promise<string[]> {
  return await getStoreData<string[]>('hidden-jobs', []);
}

export async function hideJob(id: string): Promise<void> {
  const hidden = await getHiddenJobs();
  if (!hidden.includes(id)) {
    hidden.push(id);
    await setStoreData('hidden-jobs', hidden);
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

export async function getStudents(): Promise<Student[]> {
  return await getStoreData<Student[]>('students', []);
}

export async function saveStudents(students: Student[]): Promise<void> {
  await setStoreData('students', students);
}

export async function registerStudentServer(
  name: string,
  email: string,
  password: string,
  phone?: string,
  whatsapp?: string,
  collegeName?: string
): Promise<{ success: boolean; error?: string; student?: Omit<Student, 'passwordHash'> }> {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return { success: false, error: 'All fields are required' }
  }
  if (!email.includes('@')) {
    return { success: false, error: 'Enter a valid email' }
  }
  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  const students = await getStudents();
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
  students.push(newStudent);
  await saveStudents(students);

  const { passwordHash, ...publicData } = newStudent;
  return { success: true, student: publicData }
}

export async function loginStudentServer(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; student?: Omit<Student, 'passwordHash'> }> {
  if (!email.trim() || !password.trim()) {
    return { success: false, error: 'Email and password required' }
  }
  const students = await getStudents();
  const found = students.find(
    s => s.email.toLowerCase() === email.toLowerCase().trim() && s.passwordHash === btoa(password)
  )
  if (!found) {
    return { success: false, error: 'Incorrect email or password.' }
  }
  const { passwordHash, ...publicData } = found;
  return { success: true, student: publicData }
}

export async function deleteStudent(id: string): Promise<boolean> {
  const students = await getStudents();
  const filtered = students.filter(s => s.id !== id);
  if (filtered.length === students.length) return false;
  await saveStudents(filtered);
  return true;
}

export async function updateStudentPassword(identifier: string, newHash: string): Promise<boolean> {
  const students = await getStudents();
  const sIndex = students.findIndex(s => s.email.toLowerCase() === identifier.toLowerCase() || s.phone === identifier);
  if (sIndex === -1) return false;
  students[sIndex].passwordHash = newHash;
  await saveStudents(students);
  return true;
}

// ---------- OTP Storage ----------
export interface OTPRecord {
  identifier: string
  otp: string
  expiresAt: number
}

export async function getOTPs(): Promise<OTPRecord[]> {
  return await getStoreData<OTPRecord[]>('otps', []);
}

export async function saveOTPs(otps: OTPRecord[]): Promise<void> {
  await setStoreData('otps', otps);
}

export async function generateOTP(identifier: string): Promise<string> {
  let otps = await getOTPs();
  otps = otps.filter(o => o.expiresAt > Date.now()); // clean old
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps.push({
    identifier,
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
  });
  await saveOTPs(otps);
  return otp;
}

export async function verifyOTP(identifier: string, otp: string): Promise<boolean> {
  const otps = await getOTPs();
  const found = otps.find(o => o.identifier.toLowerCase() === identifier.toLowerCase() && o.otp === otp && o.expiresAt > Date.now());
  if (found) {
    await saveOTPs(otps.filter(o => o.identifier !== identifier)); // clear used OTP
    return true;
  }
  return false;
}

// ---------- Admin Credentials ----------
export async function getAdminCredentials(): Promise<{ email: string; password: string }> {
  return await getStoreData<{ email: string; password: string }>('admin-credentials', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
}

export async function updateAdminCredentials(email: string, password: string): Promise<void> {
  await setStoreData('admin-credentials', { email, password });
}
