import fs from 'fs';
import path from 'path';

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

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  collegeName?: string;
  passwordHash: string;
  registeredAt: string;
}

export function getStudents(): StudentRecord[] {
  ensureDir();
  const file = path.join(DATA_DIR, 'students.json');
  try {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch { return []; }
}

export function saveStudents(students: StudentRecord[]): void {
  ensureDir();
  const file = path.join(DATA_DIR, 'students.json');
  fs.writeFileSync(file, JSON.stringify(students, null, 2));
}

export function registerStudentServer(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  whatsapp?: string;
  collegeName?: string;
}): { success: boolean; error?: string } {
  if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
    return { success: false, error: 'All fields are required' };
  }
  if (!data.email.includes('@')) {
    return { success: false, error: 'Invalid email' };
  }
  if (data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  const students = getStudents();
  if (students.find(s => s.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }
  const student: StudentRecord = {
    id: 'student_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    phone: data.phone?.trim(),
    whatsapp: data.whatsapp?.trim(),
    collegeName: data.collegeName?.trim(),
    passwordHash: btoa(data.password),
    registeredAt: new Date().toISOString(),
  };
  students.push(student);
  saveStudents(students);
  return { success: true };
}

export function loginStudentServer(email: string, password: string): { success: boolean; error?: string; student?: StudentRecord } {
  if (!email.trim() || !password.trim()) {
    return { success: false, error: 'Email and password required' };
  }
  const students = getStudents();
  const found = students.find(s => s.email === email.toLowerCase().trim() && s.passwordHash === btoa(password));
  if (!found) {
    return { success: false, error: 'Invalid credentials' };
  }
  return { success: true, student: found };
}
