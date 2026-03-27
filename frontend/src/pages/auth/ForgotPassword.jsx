import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Wrench, CheckCircle, RefreshCw, Shield } from 'lucide-react'
import { Button }      from '../../components/ui/button'
import { Input }       from '../../components/ui/input'
import { Label }       from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { staggerContainer, fadeUp } from '../../lib/motionVariants'

const STEPS = ['Email', 'Verify OTP', 'New Password']

export default function ForgotPassword() {
  const [step,     setStep]     = useState(1)   // 1=email 2=otp 3=newpass
  const [role,     setRole]     = useState('user')
  const [email,    setEmail]    = useState('')
  const [otp,      setOtp]      = useState(['','','','','',''])
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [resendCd, setResendCd] = useState(0)
  const inputRefs = useRef([])

  // Countdown timer for resend
  const startCountdown = () => {
    setResendCd(60)
    const interval = setInterval(() => {
      setResendCd(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  // ── STEP 1: Send OTP ──────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password/send-otp', { email, role })
      toast.success(`OTP sent to ${email}`)
      setStep(2)
      startCountdown()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally { setLoading(false) }
  }

  // ── OTP Input handlers ────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char })
    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, 5)]?.focus()
  }

  // ── STEP 2: Verify OTP ────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) return toast.error('Please enter complete 6-digit OTP')
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password/verify-otp', { email, otp: otpString, role })
      toast.success('OTP verified!')
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally { setLoading(false) }
  }

  // ── Resend OTP ────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCd > 0) return
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password/send-otp', { email, role })
      toast.success('New OTP sent!')
      setOtp(['','','','','',''])
      startCountdown()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend')
    } finally { setLoading(false) }
  }

  // ── STEP 3: Reset Password ────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (password.length < 6)    return toast.error('Password must be at least 6 characters')
    if (password !== confirm)    return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await axios.post('/api/auth/forgot-password/reset-password', {
        email, otp: otp.join(''), role, newPassword: password,
      })
      toast.success('Password reset successfully!')
      setStep(4)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center pt-16 px-4 pb-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <motion.div whileHover={{ rotate:15 }} className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
              <Wrench className="text-white w-4 h-4" />
            </motion.div>
            <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
              Service<span className="text-accent-500">Mate</span>
            </span>
          </Link>
        </motion.div>

        {/* Step indicator */}
        {step <= 3 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-1">
                  <motion.div
                    animate={{ scale: step === i+1 ? 1.1 : 1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > i+1  ? 'bg-green-500 text-white' :
                      step === i+1 ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/40' :
                      'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                    {step > i+1 ? <CheckCircle className="w-4 h-4" /> : i+1}
                  </motion.div>
                  <span className={`text-xs font-medium ${step === i+1 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>{s}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-0.5 mb-5 max-w-12 transition-all ${step > i+1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </React.Fragment>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Email + Role ── */}
          {step === 1 && (
            <motion.div key="step1" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity:0, x:-30 }}>
              <Card className="border-0 shadow-xl dark:bg-gray-900 dark:shadow-gray-900/50">
                <CardContent className="p-8">
                  <motion.div variants={fadeUp} className="text-center mb-6">
                    <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Enter your email and we'll send you an OTP</p>
                  </motion.div>

                  <form onSubmit={handleSendOTP} className="space-y-5">
                    {/* Role selector */}
                    <motion.div variants={fadeUp} custom={1}>
                      <Label className="dark:text-gray-300">I am a</Label>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {['user','provider'].map(r => (
                          <motion.button key={r} type="button" whileTap={{ scale:0.97 }}
                            onClick={() => setRole(r)}
                            className={`py-2.5 rounded-xl text-sm font-semibold capitalize border-2 transition-all ${
                              role === r
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/30'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-primary-400'
                            }`}>
                            {r === 'user' ? '👤 Customer' : '🛠️ Provider'}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={fadeUp} custom={2} className="space-y-2">
                      <Label className="dark:text-gray-300">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input type="email" placeholder="your@email.com" value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500" required />
                      </div>
                    </motion.div>

                    <motion.div variants={fadeUp} custom={3}>
                      <Button type="submit" className="w-full h-12" disabled={loading}>
                        {loading ? 'Sending OTP...' : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                      </Button>
                    </motion.div>
                  </form>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                    Remember your password?{' '}
                    <Link to="/user/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── STEP 2: OTP Input ── */}
          {step === 2 && (
            <motion.div key="step2" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity:0, x:-30 }}>
              <Card className="border-0 shadow-xl dark:bg-gray-900 dark:shadow-gray-900/50">
                <CardContent className="p-8">
                  <motion.div variants={fadeUp} className="text-center mb-6">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Enter OTP</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      We sent a 6-digit code to<br />
                      <strong className="text-gray-700 dark:text-gray-200">{email}</strong>
                    </p>
                  </motion.div>

                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    {/* OTP boxes */}
                    <motion.div variants={fadeUp} custom={1} className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <motion.input
                          key={index}
                          ref={el => inputRefs.current[index] = el}
                          type="text" inputMode="numeric" maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(index, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          whileFocus={{ scale: 1.05 }}
                          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white ${
                            digit
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400 text-primary-700 dark:text-primary-300'
                              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                          }`}
                        />
                      ))}
                    </motion.div>

                    <motion.div variants={fadeUp} custom={2}>
                      <Button type="submit" className="w-full h-12" disabled={loading}>
                        {loading ? 'Verifying...' : <><span>Verify OTP</span><ArrowRight className="w-4 h-4" /></>}
                      </Button>
                    </motion.div>
                  </form>

                  {/* Resend */}
                  <div className="text-center mt-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Didn't receive the code?</p>
                    <motion.button
                      whileTap={{ scale: resendCd > 0 ? 1 : 0.95 }}
                      onClick={handleResend}
                      disabled={resendCd > 0 || loading}
                      className={`mt-1 text-sm font-semibold flex items-center gap-1.5 mx-auto transition-colors ${
                        resendCd > 0
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-primary-600 dark:text-primary-400 hover:underline cursor-pointer'
                      }`}>
                      <RefreshCw className="w-3.5 h-3.5" />
                      {resendCd > 0 ? `Resend in ${resendCd}s` : 'Resend OTP'}
                    </motion.button>
                  </div>

                  <button onClick={() => setStep(1)} className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <ArrowLeft className="w-3.5 h-3.5" /> Change email
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === 3 && (
            <motion.div key="step3" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity:0, x:-30 }}>
              <Card className="border-0 shadow-xl dark:bg-gray-900 dark:shadow-gray-900/50">
                <CardContent className="p-8">
                  <motion.div variants={fadeUp} className="text-center mb-6">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">New Password</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Create a strong new password for your account</p>
                  </motion.div>

                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <motion.div variants={fadeUp} custom={1} className="space-y-2">
                      <Label className="dark:text-gray-300">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input type={showPass?'text':'password'} placeholder="Min 6 characters"
                          value={password} onChange={e => setPassword(e.target.value)}
                          className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white" required />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </motion.div>

                    <motion.div variants={fadeUp} custom={2} className="space-y-2">
                      <Label className="dark:text-gray-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input type="password" placeholder="Re-enter new password"
                          value={confirm} onChange={e => setConfirm(e.target.value)}
                          className={`pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${confirm && confirm !== password ? 'border-red-400 focus:ring-red-400' : ''}`} required />
                      </div>
                      {confirm && confirm !== password && (
                        <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                      )}
                    </motion.div>

                    {/* Password strength */}
                    {password && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-1">
                        <div className="flex gap-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                              password.length >= i*3
                                ? i <= 1 ? 'bg-red-400'
                                : i <= 2 ? 'bg-yellow-400'
                                : i <= 3 ? 'bg-blue-400'
                                : 'bg-green-400'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {password.length < 6 ? 'Too short' : password.length < 9 ? 'Fair' : password.length < 12 ? 'Good' : 'Strong'}
                        </p>
                      </motion.div>
                    )}

                    <motion.div variants={fadeUp} custom={3}>
                      <Button type="submit" className="w-full h-12" disabled={loading || (confirm && confirm !== password)}>
                        {loading ? 'Resetting...' : <><span>Reset Password</span><ArrowRight className="w-4 h-4" /></>}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ type:'spring' }}>
              <Card className="border-0 shadow-xl dark:bg-gray-900 dark:shadow-gray-900/50">
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ type:'spring', stiffness:200, delay:0.1 }}
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Password Reset!</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                    Your password has been reset successfully.<br />You can now sign in with your new password.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full h-12" asChild>
                      <Link to="/user/login">Sign in as Customer</Link>
                    </Button>
                    <Button variant="outline" className="w-full h-12 dark:border-gray-600 dark:text-gray-200" asChild>
                      <Link to="/provider/login">Sign in as Provider</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
