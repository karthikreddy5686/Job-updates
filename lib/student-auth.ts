export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  collegeName?: string
  registeredAt: string
}

const KEY = 'jobupdate_student'
const SESSION_KEY = 'jobupdate_student_session'

// Register new student
export function registerStudent(
  name: string,
  email: string,
  password: string,
  phone?: string,
  whatsapp?: string,
  collegeName?: string
): { success: boolean; error?: string } {
  if (!name.trim() || !email.trim() || !password.trim()) {
    return { success: false, error: 'All fields are required' }
  }
  if (!email.includes('@')) {
    return { success: false, error: 'Enter a valid email' }
  }
  if (password.length < 6) {
    return { 
      success: false, 
      error: 'Password must be at least 6 characters' 
    }
  }

  // Check if already registered
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) {
      const students: any[] = JSON.parse(existing)
      if (students.find(s => s.email === email.toLowerCase())) {
        return { 
          success: false, 
          error: 'This email is already registered. Please login.' 
        }
      }
    }
  } catch {}

  // Save student
  try {
    const existing = localStorage.getItem(KEY)
    const students: any[] = existing ? JSON.parse(existing) : []
    const student = {
      id: 'student_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      whatsapp: whatsapp?.trim(),
      collegeName: collegeName?.trim(),
      // Simple hash — not for production security
      passwordHash: btoa(password),
      registeredAt: new Date().toISOString(),
    }
    students.push(student)
    localStorage.setItem(KEY, JSON.stringify(students))

    // Auto login after register
    const session: Student = {
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      whatsapp: student.whatsapp,
      collegeName: student.collegeName,
      registeredAt: student.registeredAt,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { success: true }
  } catch {
    return { success: false, error: 'Registration failed. Try again.' }
  }
}

// Login existing student
export function loginStudent(
  email: string,
  password: string
): { success: boolean; error?: string; student?: Student } {
  if (!email.trim() || !password.trim()) {
    return { success: false, error: 'Email and password required' }
  }

  try {
    const existing = localStorage.getItem(KEY)
    if (!existing) {
      return { 
        success: false, 
        error: 'No account found. Please register first.' 
      }
    }
    const students: any[] = JSON.parse(existing)
    const found = students.find(
      s =>
        s.email === email.toLowerCase().trim() &&
        s.passwordHash === btoa(password)
    )
    if (!found) {
      return { 
        success: false, 
        error: 'Incorrect email or password.' 
      }
    }

    const session: Student = {
      id: found.id || 'student_' + btoa(found.email), // Fallback if no id
      name: found.name,
      email: found.email,
      phone: found.phone,
      whatsapp: found.whatsapp,
      collegeName: found.collegeName,
      registeredAt: found.registeredAt,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { success: true, student: session }
  } catch {
    return { success: false, error: 'Login failed. Try again.' }
  }
}

// Get current student session
export function getStudentSession(): Student | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Student
  } catch {
    return null
  }
}

// Logout student
export function logoutStudent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY)
}

// Check if logged in
export function isStudentLoggedIn(): boolean {
  return getStudentSession() !== null
}
