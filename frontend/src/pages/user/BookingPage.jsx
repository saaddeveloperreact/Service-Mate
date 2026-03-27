import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { Calendar, Clock, MapPin, FileText, ArrowLeft, Send, Star, BadgeCheck, IndianRupee } from 'lucide-react'
import { Button }      from '../../components/ui/button'
import { Input }       from '../../components/ui/input'
import { Label }       from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { Separator }   from '../../components/ui/separator'
import { staggerContainer, fadeUp } from '../../lib/motionVariants'

export default function BookingPage() {
  const { providerId } = useParams()
  const { API, user }  = useAuth()
  const navigate       = useNavigate()
  const [provider, setProvider] = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [form, setForm] = useState({
    description:'', scheduledDate:'', scheduledTime:'',
    street:'', city: user?.address?.city||'', state: user?.address?.state||'', pincode:'', notes:'',
  })

  useEffect(() => {
    API.get(`/providers/${providerId}`)
      .then(({ data }) => setProvider(data.provider))
      .catch(() => { toast.error('Provider not found'); navigate(-1) })
  }, [providerId])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/bookings', {
        providerId, description:form.description, scheduledDate:form.scheduledDate, scheduledTime:form.scheduledTime,
        address:{ street:form.street, city:form.city, state:form.state, pincode:form.pincode }, notes:form.notes,
      })
      toast.success('Booking request sent!')
      navigate('/user/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally { setLoading(false) }
  }

  if (!provider) return (
    <div className="flex items-center justify-center h-screen pt-16 bg-white dark:bg-gray-950">
      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
        className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.button initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
          onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 text-sm font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </motion.button>

        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-1">Book Service</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-7">Fill in the details to send a booking request.</p>
          </motion.div>

          {/* Provider summary */}
          <motion.div variants={fadeUp} custom={1}>
            <Card className="mb-6 border-0 shadow-sm overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary-500 to-accent-500" />
              <CardContent className="p-5 flex items-center gap-4">
                <motion.div whileHover={{ scale:1.05 }}
                  className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                  {provider.name?.charAt(0)}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{provider.name}</h3>
                    {provider.isVerified && <BadgeCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{provider.serviceCategory}</p>
                  {provider.rating?.count > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{provider.rating.average}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">({provider.rating.count})</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5 justify-end">
                    <IndianRupee className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{provider.hourlyRate}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">per hour</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} custom={2}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-7">
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 dark:text-gray-300">
                      <FileText className="w-3.5 h-3.5 text-primary-500" />Describe the Work
                    </Label>
                    <textarea name="description" placeholder="Describe what needs to be done..." value={form.description}
                      onChange={handleChange} rows={3} required
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none placeholder-gray-400 dark:placeholder-gray-500 transition-all" />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 dark:text-gray-300">
                        <Calendar className="w-3.5 h-3.5 text-primary-500" />Preferred Date
                      </Label>
                      <Input name="scheduledDate" type="date" value={form.scheduledDate} onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5 dark:text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-primary-500" />Preferred Time
                      </Label>
                      <Input name="scheduledTime" type="time" value={form.scheduledTime} onChange={handleChange} required />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="flex items-center gap-1.5 dark:text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-primary-500" />Service Address
                    </Label>
                    <Input name="street" placeholder="Street / Apartment / Building" value={form.street} onChange={handleChange} />
                    <div className="grid grid-cols-3 gap-3">
                      <Input name="city"    placeholder="City"    value={form.city}    onChange={handleChange} required />
                      <Input name="state"   placeholder="State"   value={form.state}   onChange={handleChange} required />
                      <Input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="dark:text-gray-300">
                      Additional Notes <span className="text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
                    </Label>
                    <textarea name="notes" placeholder="Any special instructions..." value={form.notes}
                      onChange={handleChange} rows={2}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none placeholder-gray-400 dark:placeholder-gray-500" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 dark:border-gray-600 dark:text-gray-300" onClick={() => navigate(-1)}>Cancel</Button>
                    <Button type="submit" className="flex-1 shadow-lg shadow-primary-500/25" disabled={loading}>
                      {loading ? 'Sending...' : <><Send className="w-4 h-4" />Send Booking Request</>}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
