import { getStoreData, setStoreData } from './db';

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

export async function getStudents(): Promise<StudentRecord[]> {
  return await getStoreData<StudentRecord[]>('students', []);
}

export async function saveStudents(students: StudentRecord[]): Promise<void> {
  await setStoreData('students', students);
}

export async function registerStudentServer(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  whatsapp?: string;
  collegeName?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!data.name.trim() || !data.email.trim() || !data.password.trim()) {
    return { success: false, error: 'All fields are required' };
  }
  if (!data.email.includes('@')) {
    return { success: false, error: 'Invalid email' };
  }
  if (data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }
  const students = await getStudents();
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
  await saveStudents(students);
  return { success: true };
}

export async function loginStudentServer(email: string, password: string): Promise<{ success: boolean; error?: string; student?: StudentRecord }> {
  if (!email.trim() || !password.trim()) {
    return { success: false, error: 'Email and password required' };
  }
  const students = await getStudents();
  const found = students.find(s => s.email === email.toLowerCase().trim() && s.passwordHash === btoa(password));
  if (!found) {
    return { success: false, error: 'Invalid credentials' };
  }
  return { success: true, student: found };
}
