'use client'
import { useState } from 'react'
import { X, Eye, EyeOff, GraduationCap, User, Mail, Lock, CheckCircle, Phone, Building } from 'lucide-react'
import { loginStudent } from '@/lib/student-auth'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: (student: { name: string; email: string }) => void
  defaultTab?: 'login' | 'register'
}

export default function StudentAuthModal({
  isOpen, onClose, onSuccess, defaultTab = 'login'
}: Props) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Forgot Password state
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotIdentifier, setForgotIdentifier] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '', password: ''
  })

  // Register form
  const [regForm, setRegForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', whatsapp: '', collegeName: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Small delay for UX
    await new Promise(r => setTimeout(r, 400))
    
    const result = loginStudent(loginForm.email, loginForm.password)
    if (result.success && result.student) {
      onSuccess(result.student)
      onClose()
    } else {
      setError(result.error || 'Login failed')
    }
    setLoading(false)
  }

  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/student/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier }),
      })
      const data = await res.json()
      if (data.success) {
        setOtpSent(true)
        alert('MOCK OTP: ' + data.mockOtp) // For demo
      } else {
        setError(data.error || 'Failed to send OTP')
      }
    } catch {
      setError('Connection error.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/student/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier, otp, newPassword }),
      })
      const data = await res.json()
      if (data.success) {
        setForgotMode(false)
        setOtpSent(false)
        setOtp('')
        setNewPassword('')
        alert('Password reset successful. You can now login.')
      } else {
        setError(data.error || 'Invalid OTP')
      }
    } catch {
      setError('Connection error.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!regForm.phone.trim() || !regForm.whatsapp.trim()) {
      setError('Phone and WhatsApp numbers are required')
      return
    }

    if (regForm.password !== regForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true);
    try {
      const res = await fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regForm.name,
          email: regForm.email,
          password: regForm.password,
          phone: regForm.phone,
          whatsapp: regForm.whatsapp,
          collegeName: regForm.collegeName,
        }),
      });
      const result = await res.json();
      if (result.success) {
        onSuccess({ name: regForm.name, email: regForm.email });
        onClose();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  if (!isOpen) return null

  const inputCls = `w-full pl-9 pr-4 py-2.5 border border-gray-200 
    rounded-xl text-sm bg-gray-50 text-gray-900
    focus:outline-none focus:ring-2 focus:ring-orange-500 
    focus:border-transparent focus:bg-white
    placeholder:text-gray-400 transition-all`

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 
                   backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center 
                      justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl 
                        w-full max-w-sm pointer-events-auto
                        border border-gray-100">

          {/* Header */}
          <div className="flex items-center justify-between 
                          px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-600 rounded-xl 
                              flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-base">
                  Student Portal
                </h2>
                <p className="text-xs text-gray-400">
                  Geonixa NextJob — Career Hub
                </p>
              </div>
            </div>
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 
                         hover:bg-gray-100 hover:text-gray-600 
                         transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mx-6 mt-5 bg-gray-100 
                          rounded-xl p-1 gap-1">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm 
                  font-medium capitalize transition-colors ${
                  tab === t
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">

            {/* ── LOGIN FORM ── */}
            {tab === 'login' && (
              !forgotMode ? (
                <form onSubmit={handleLogin} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 
                                     -translate-y-1/2 w-4 h-4 
                                     text-gray-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={e => setLoginForm(p => ({
                        ...p, email: e.target.value
                      }))}
                      placeholder="Your email address"
                      required
                      autoComplete="email"
                      className={inputCls}
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 
                                     -translate-y-1/2 w-4 h-4 
                                     text-gray-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={e => setLoginForm(p => ({
                        ...p, password: e.target.value
                      }))}
                      placeholder="Password"
                      required
                      autoComplete="current-password"
                      className={`${inputCls} pr-10`}
                    />
                    <button type="button"
                      onClick={() => setShowPwd(p => !p)}
                      className="absolute right-3 top-1/2 
                                 -translate-y-1/2 text-gray-400 
                                 hover:text-gray-600">
                      {showPwd
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                      }
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs bg-red-50 
                                  border border-red-100 rounded-lg 
                                  px-3 py-2">
                      ⚠ {error}
                    </p>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-orange-600 
                               hover:bg-orange-700 text-white 
                               font-semibold text-sm rounded-xl 
                               transition-colors disabled:opacity-60
                               flex items-center justify-center gap-2
                               shadow-sm shadow-orange-500/20 mt-1">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 
                                         border-white/30 border-t-white 
                                         rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : 'Login as Student'}
                  </button>

                  <div className="flex justify-between items-center px-1">
                    <p className="text-xs text-gray-500">
                      No account?{' '}
                      <button type="button"
                        onClick={() => { setTab('register'); setError('') }}
                        className="text-orange-600 font-medium 
                                   hover:underline">
                        Register free
                      </button>
                    </p>
                    <button type="button" onClick={() => { setForgotMode(true); setError(''); }} className="text-xs text-orange-600 font-medium hover:underline">Forgot password?</button>
                  </div>
                </form>
              ) : (
                <form onSubmit={otpSent ? handleForgotVerifyOtp : handleForgotSendOtp} className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Reset Password</h3>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={e => setForgotIdentifier(e.target.value)}
                      placeholder="Email or Phone number"
                      required
                      disabled={otpSent}
                      className={inputCls}
                    />
                  </div>
                  {otpSent && (
                    <>
                      <div className="relative">
                        <input
                          type="text"
                          value={otp}
                          onChange={e => setOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          required
                          className={inputCls}
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="New Password"
                          required
                          className={inputCls}
                        />
                      </div>
                    </>
                  )}
                  {error && (
                    <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      ⚠ {error}
                    </p>
                  )}
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 mt-1">
                    {loading ? 'Processing...' : otpSent ? 'Reset Password' : 'Send OTP'}
                  </button>
                  <div className="text-center mt-2">
                    <button type="button" onClick={() => { setForgotMode(false); setOtpSent(false); setError(''); }} className="text-xs text-gray-500 hover:text-gray-900">Back to login</button>
                  </div>
                </form>
              )
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 
                                   -translate-y-1/2 w-4 h-4 
                                   text-gray-400" />
                  <input
                    type="text"
                    value={regForm.name}
                    onChange={e => setRegForm(p => ({
                      ...p, name: e.target.value
                    }))}
                    placeholder="Full name *"
                    required
                    autoComplete="name"
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 
                                   -translate-y-1/2 w-4 h-4 
                                   text-gray-400" />
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={e => setRegForm(p => ({
                      ...p, email: e.target.value
                    }))}
                    placeholder="Email address *"
                    required
                    autoComplete="email"
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 
                                   -translate-y-1/2 w-4 h-4 
                                   text-gray-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={regForm.password}
                    onChange={e => setRegForm(p => ({
                      ...p, password: e.target.value
                    }))}
                    placeholder="Create password (min 6 chars) *"
                    required
                    autoComplete="new-password"
                    className={`${inputCls} pr-10`}
                  />
                  <button type="button"
                    onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3 top-1/2 
                               -translate-y-1/2 text-gray-400 
                               hover:text-gray-600">
                    {showPwd
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 
                                   -translate-y-1/2 w-4 h-4 
                                   text-gray-400" />
                  <input
                    type="tel"
                    value={regForm.phone}
                    onChange={e => setRegForm(p => ({
                      ...p, phone: e.target.value
                    }))}
                    placeholder="Phone number *"
                    required
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 
                                   -translate-y-1/2 w-4 h-4 
                                   text-green-500" />
                  <input
                    type="tel"
                    value={regForm.whatsapp}
                    onChange={e => setRegForm(p => ({
                      ...p, whatsapp: e.target.value
                    }))}
                    placeholder="WhatsApp number *"
                    required
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Building className="absolute left-3 top-1/2 
                                   -translate-y-1/2 w-4 h-4 
                                   text-gray-400" />
                  <input
                    type="text"
                    value={regForm.collegeName}
                    onChange={e => setRegForm(p => ({
                      ...p, collegeName: e.target.value
                    }))}
                    placeholder="College name *"
                    required
                    className={inputCls}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 
                                   -translate-y-1/2 w-4 h-4 
                                   text-gray-400" />
                  <input
                    type="password"
                    value={regForm.confirmPassword}
                    onChange={e => setRegForm(p => ({
                      ...p, confirmPassword: e.target.value
                    }))}
                    placeholder="Confirm password *"
                    required
                    autoComplete="new-password"
                    className={inputCls}
                  />
                </div>



                {error && (
                  <p className="text-red-500 text-xs bg-red-50 
                                border border-red-100 rounded-lg 
                                px-3 py-2">
                    ⚠ {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-2.5 bg-orange-600 
                             hover:bg-orange-700 text-white 
                             font-semibold text-sm rounded-xl 
                             transition-colors disabled:opacity-60
                             flex items-center justify-center gap-2
                             shadow-sm shadow-orange-500/20 mt-1">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 
                                       border-white/30 border-t-white 
                                       rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : 'Create Student Account'}
                </button>

                <p className="text-center text-xs text-gray-500">
                  Already registered?{' '}
                  <button type="button"
                    onClick={() => { setTab('login'); setError('') }}
                    className="text-orange-600 font-medium 
                               hover:underline">
                    Login here
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 pb-5">
            <p className="text-center text-xs text-gray-400">
              Free access to all job updates, internships & alerts
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
