import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Wrench, CheckCircle } from 'lucide-react'
import { Button }      from '../../components/ui/button'
import { Input }       from '../../components/ui/input'
import { Label }       from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { staggerContainer, fadeUp, slideInLeft, slideInRight } from '../../lib/motionVariants'

export default function UserRegister() {
  const [form,     setForm]     = useState({ name:'', email:'', password:'', phone:'', city:'', state:'' })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const { registerUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await registerUser({ name:form.name, email:form.email, password:form.password, phone:form.phone, address:{ city:form.city, state:form.state } })
      toast.success('Account created!')
      navigate('/user/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
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
          <motion.div animate={{ y:[-6,6,-6] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }} className="text-7xl mb-6">🎉</motion.div>
          <h2 className="font-display text-4xl font-bold mb-4">Join ServiceMate</h2>
          <p className="text-blue-200 mb-8 leading-relaxed">Create your free account and start booking reliable professionals right away.</p>
          <div className="space-y-3 text-left">
            {['Free account creation','Browse 2,500+ verified experts','Easy booking & tracking','Secure & transparent payments'].map((item,i) => (
              <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5+i*0.1 }}
                className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-sm font-medium border border-white/10">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />{item}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right */}
      <motion.div variants={slideInRight} initial="hidden" animate="visible"
        className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-5">
                <motion.div whileHover={{ rotate:15 }} className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                  <Wrench className="text-white w-4 h-4" />
                </motion.div>
                <span className="font-display font-bold text-lg text-gray-900 dark:text-white">Service<span className="text-accent-500">Mate</span></span>
              </Link>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Join thousands of happy customers</p>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} className="pl-10" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} className="pl-10" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>City</Label>
                        <Input name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>State</Label>
                        <Input name="state" placeholder="Maharashtra" value={form.state} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input name="password" type={showPass?'text':'password'} placeholder="Min 6 characters"
                          value={form.password} onChange={handleChange} className="pl-10 pr-10" required />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 text-base mt-2" disabled={loading}>
                      {loading ? 'Creating...' : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                    </Button>
                  </form>
                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 text-center space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Already have an account?{' '}
                      <Link to="/user/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Are you a provider?{' '}
                      <Link to="/provider/register" className="text-accent-500 font-semibold hover:underline">Register here</Link>
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
