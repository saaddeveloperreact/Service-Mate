import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Wrench, Home, CalendarCheck, History, Star } from 'lucide-react'
import { Button }      from '../../components/ui/button'
import { Input }       from '../../components/ui/input'
import { Label }       from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { staggerContainer, fadeUp, slideInLeft, slideInRight } from '../../lib/motionVariants'

export default function UserLogin() {
  const [form,     setForm]     = useState({ email:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await loginUser(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/user/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left */}
      <motion.div variants={slideInLeft} initial="hidden" animate="visible"
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background:'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 50%,#2563eb 100%)' }}>
        <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:6, repeat:Infinity }}
          className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-white text-center max-w-sm">
          <motion.div animate={{ y:[-8,8,-8] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
            className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-5xl border border-white/20">🏠</motion.div>
          <h2 className="font-display text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-blue-200 mb-8 leading-relaxed">Access your account to manage bookings and find trusted professionals.</p>
          <div className="space-y-3 text-left">
            {[{I:Home,t:'Book home services instantly'},{I:CalendarCheck,t:'Track bookings in real-time'},{I:History,t:'Full service history'},{I:Star,t:'Rate & review providers'}].map(({I,t},i) => (
              <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5+i*0.1 }}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-sm font-medium border border-white/10">
                <I className="w-4 h-4 text-blue-300 flex-shrink-0" />{t}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right */}
      <motion.div variants={slideInRight} initial="hidden" animate="visible"
        className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <motion.div whileHover={{ rotate:15 }} className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                  <Wrench className="text-white w-4 h-4" />
                </motion.div>
                <span className="font-display font-bold text-lg text-gray-900 dark:text-white">Service<span className="text-accent-500">Mate</span></span>
              </Link>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">User Login</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Sign in to book trusted professionals</p>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input type="email" placeholder="you@email.com" value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })} className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input type={showPass?'text':'password'} placeholder="••••••••" value={form.password}
                          onChange={e => setForm({ ...form, password: e.target.value })} className="pl-10 pr-10" required />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                      {loading
                        ? <span className="flex items-center gap-2">
                            <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />Signing in...
                          </span>
                        : <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>}
                    </Button>
                  </form>
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700 text-center space-y-2">
                    <Link to="/forgot-password" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 block">
                      Forgot your password?
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Don't have an account?{' '}
                      <Link to="/user/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Register here</Link>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Are you a provider?{' '}
                      <Link to="/provider/login" className="text-accent-500 font-semibold hover:underline">Login here</Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
