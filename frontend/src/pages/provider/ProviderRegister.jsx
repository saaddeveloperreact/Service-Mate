import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Wrench, IndianRupee, MapPin, Tag, FileText } from 'lucide-react'
import { Button }      from '../../components/ui/button'
import { Input }       from '../../components/ui/input'
import { Label }       from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { staggerContainer, fadeUp, slideInLeft, slideInRight } from '../../lib/motionVariants'

const categories = ['Electrician','Plumber','Carpenter','Painter','Cleaner','AC Technician','Mechanic','Mason','Gardener','Security Guard','Other']

export default function ProviderRegister() {
  const [form, setForm] = useState({
    name:'', email:'', password:'', phone:'', serviceCategory:'',
    experience:'', rateMin:'', rateMax:'', bio:'', city:'', state:'', skills:''
  })
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const { registerProvider } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (Number(form.rateMin) >= Number(form.rateMax)) return toast.error('Max rate must be greater than min rate')
    setLoading(true)
    try {
      await registerProvider({ ...form, address:{ city:form.city, state:form.state } })
      toast.success('Welcome aboard, Provider!')
      navigate('/provider/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const SectionLabel = ({ children }) => (
    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 pt-2">
      <span className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />{children}<span className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
    </p>
  )

  return (
    <div className="min-h-screen flex pt-16">
      {/* Left */}
      <motion.div variants={slideInLeft} initial="hidden" animate="visible"
        className="hidden lg:flex lg:w-2/5 relative overflow-hidden items-center justify-center p-10"
        style={{ background:'linear-gradient(135deg,#c2410c 0%,#ea580c 60%,#f97316 100%)' }}>
        <motion.div animate={{ scale:[1,1.2,1] }} transition={{ duration:6, repeat:Infinity }}
          className="absolute top-10 right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-white text-center max-w-xs">
          <motion.div animate={{ y:[-6,6,-6] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }} className="text-6xl mb-5">🚀</motion.div>
          <h2 className="font-display text-3xl font-bold mb-3">Start Earning Today</h2>
          <p className="text-orange-100 text-sm leading-relaxed mb-6">Register and connect with thousands of customers in your area.</p>
          <div className="space-y-2.5 text-left text-sm">
            {['Set your own rate range','Work on your schedule','Get paid securely','Build 5-star reputation'].map((item,i) => (
              <motion.div key={i} initial={{ opacity:0, x:-15 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5+i*0.1 }}
                className="bg-white/10 rounded-xl px-3.5 py-3 flex items-center gap-2.5 border border-white/10 font-medium">
                <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full flex-shrink-0" />{item}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right */}
      <motion.div variants={slideInRight} initial="hidden" animate="visible"
        className="w-full lg:w-3/5 flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <motion.div whileHover={{ rotate:15 }} className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                  <Wrench className="text-white w-4 h-4" />
                </motion.div>
                <span className="font-display font-bold text-lg text-gray-900 dark:text-white">Service<span className="text-accent-500">Mate</span></span>
              </Link>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Provider Registration</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Join our network of trusted professionals</p>
            </motion.div>

            <motion.div variants={fadeUp} custom={1}>
              <Card className="border-0 shadow-xl">
                <CardContent className="p-5 sm:p-7">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <SectionLabel>Personal Info</SectionLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Full Name</Label>
                        <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input name="name" placeholder="Your name" value={form.name} onChange={handleChange} className="pl-9 text-sm" required /></div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Phone</Label>
                        <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input name="phone" type="tel" placeholder="+91..." value={form.phone} onChange={handleChange} className="pl-9 text-sm" required /></div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <Input name="email" type="email" placeholder="provider@email.com" value={form.email} onChange={handleChange} className="pl-9 text-sm" required /></div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Password</Label>
                      <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <Input name="password" type={showPass?'text':'password'} placeholder="Min 6 characters"
                          value={form.password} onChange={handleChange} className="pl-9 pr-9 text-sm" required />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          {showPass ? <Eye className="w-3.5 h-3.5 rotate-180" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <SectionLabel>Service Info</SectionLabel>
                    <div className="space-y-1.5">
                      <Label>Service Category</Label>
                      <select name="serviceCategory" value={form.serviceCategory} onChange={handleChange}
                        className="w-full h-11 border border-gray-200 dark:border-gray-600 rounded-xl px-4 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" required>
                        <option value="">Select category...</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Experience (years)</Label>
                      <Input name="experience" type="number" min="0" placeholder="e.g. 5" value={form.experience} onChange={handleChange} className="text-sm" required />
                    </div>

                    {/* Rate Range */}
                    <div className="space-y-1.5">
                      <Label>Hourly Rate Range (₹)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input name="rateMin" type="number" min="0" placeholder="Min e.g. 200"
                            value={form.rateMin} onChange={handleChange} className="pl-9 text-sm" required />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">min</span>
                        </div>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input name="rateMax" type="number" min="0" placeholder="Max e.g. 500"
                            value={form.rateMax} onChange={handleChange} className="pl-9 text-sm" required />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">max</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Set a price range so customers know what to expect</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Short Bio</Label>
                      <div className="relative"><FileText className="absolute left-3 top-3 text-gray-400 w-3.5 h-3.5" />
                        <textarea name="bio" placeholder="Tell customers about your experience..." value={form.bio} onChange={handleChange}
                          rows={2} className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none placeholder-gray-400 dark:placeholder-gray-500" /></div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Skills (comma separated)</Label>
                      <div className="relative"><Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                        <Input name="skills" placeholder="e.g. Wiring, Switchboard, Solar" value={form.skills} onChange={handleChange} className="pl-9 text-sm" /></div>
                    </div>

                    <SectionLabel>Location</SectionLabel>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>City</Label>
                        <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                          <Input name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} className="pl-9 text-sm" required /></div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>State</Label>
                        <Input name="state" placeholder="Maharashtra" value={form.state} onChange={handleChange} className="text-sm" required />
                      </div>
                    </div>

                    <Button type="submit" variant="accent" className="w-full h-12 text-base mt-2" disabled={loading}>
                      {loading ? 'Registering...' : <><span>Register as Provider</span><ArrowRight className="w-4 h-4" /></>}
                    </Button>
                  </form>
                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700 text-center space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Already registered?{' '}
                      <Link to="/provider/login" className="text-accent-500 font-semibold hover:underline">Sign in</Link>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Looking for services?{' '}
                      <Link to="/user/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Register as user</Link>
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
