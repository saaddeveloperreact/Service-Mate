import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { Star, MapPin, Clock, BadgeCheck, ArrowLeft, IndianRupee, Briefcase, Phone, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button }    from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { staggerContainer, fadeUp, slideInLeft } from '../lib/motionVariants'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const catColors = {
  Electrician:     'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  Plumber:         'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300',
  Carpenter:       'bg-amber-100  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300',
  Painter:         'bg-pink-100   dark:bg-pink-900/30   text-pink-700   dark:text-pink-300',
  Cleaner:         'bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-300',
  'AC Technician': 'bg-cyan-100   dark:bg-cyan-900/30   text-cyan-700   dark:text-cyan-300',
  Mechanic:        'bg-red-100    dark:bg-red-900/30    text-red-700    dark:text-red-300',
  Other:           'bg-gray-100   dark:bg-gray-700      text-gray-700   dark:text-gray-200',
}
const catEmoji = { Electrician:'⚡', Plumber:'🔧', Carpenter:'🪚', Painter:'🎨', Cleaner:'🧹', 'AC Technician':'❄️', Mechanic:'🔩', Other:'🛠️' }

export default function ProviderDetailPage() {
  const { id }    = useParams()
  const { user, role } = useAuth()
  const navigate  = useNavigate()
  const [provider, setProvider] = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    axios.get(`/api/providers/${id}`)
      .then(({ data }) => setProvider(data.provider))
      .catch(() => navigate('/providers'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-screen pt-16 bg-white dark:bg-gray-950">
      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
        className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"/>
    </div>
  )
  if (!provider) return null

  const avatarSrc = provider.avatar ? `${API_BASE}${provider.avatar}` : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-12">

      {/* Banner */}
      <div className="h-36 sm:h-48 bg-gradient-to-br from-slate-900 via-primary-900 to-primary-700 relative">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'32px 32px' }}/>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 sm:-mt-20">
        {/* Back button */}
        <motion.button initial={{ opacity:0 }} animate={{ opacity:1 }} onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform"/> Back to Providers
        </motion.button>

        {/* ── Layout: stacked on mobile, side-by-side on desktop ── */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          {/* ── Profile Card ── */}
          <motion.div variants={slideInLeft} initial="hidden" animate="visible"
            className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <Card className="border-0 shadow-xl overflow-hidden lg:sticky lg:top-24">
              <div className="h-1.5 bg-gradient-to-r from-primary-500 to-accent-500"/>
              <CardContent className="p-5">

                {/* Avatar - centered */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-xl overflow-hidden">
                      {avatarSrc
                        ? <img src={avatarSrc} alt={provider.name} className="w-full h-full object-cover"/>
                        : provider.name?.charAt(0)
                      }
                    </div>
                    {provider.isAvailable && (
                      <motion.span animate={{ scale:[1,1.3,1] }} transition={{ duration:2, repeat:Infinity }}
                        className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"/>
                    )}
                  </div>

                  <h1 className="font-display text-xl font-bold text-gray-900 dark:text-white">{provider.name}</h1>

                  <div className="flex items-center justify-center gap-1.5 flex-wrap mt-1.5">
                    {provider.isVerified && <BadgeCheck className="text-primary-600 dark:text-primary-400 w-4 h-4"/>}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${catColors[provider.serviceCategory] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                      {catEmoji[provider.serviceCategory]} {provider.serviceCategory}
                    </span>
                  </div>

                  {provider.rating?.count > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_,i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(provider.rating.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-600'}`}/>
                      ))}
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-1">{provider.rating.average}</span>
                      <span className="text-xs text-gray-400">({provider.rating.count})</span>
                    </div>
                  )}
                </div>

                <Separator className="mb-4"/>

                {/* Info */}
                <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2"><Clock  className="w-4 h-4 text-primary-400 flex-shrink-0"/>{provider.experience} years experience</div>
                  {provider.address?.city && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400 flex-shrink-0"/>{provider.address.city}, {provider.address.state}</div>}
                  {provider.phone        && <div className="flex items-center gap-2"><Phone  className="w-4 h-4 text-primary-400 flex-shrink-0"/>{provider.phone}</div>}
                </div>

                {/* Rate range */}
                <div className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-2xl mb-4 border border-primary-100 dark:border-primary-800 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hourly Rate Range</p>
                  <div className="flex items-center justify-center gap-0.5">
                    <IndianRupee className="w-4 h-4 text-primary-600 dark:text-primary-400"/>
                    <span className="font-display text-2xl font-bold text-primary-600 dark:text-primary-400">{provider.rateMin}</span>
                    <span className="text-gray-400 dark:text-gray-500 mx-1 font-bold text-lg">–</span>
                    <IndianRupee className="w-4 h-4 text-primary-600 dark:text-primary-400"/>
                    <span className="font-display text-2xl font-bold text-primary-600 dark:text-primary-400">{provider.rateMax}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">per hour · final cost discussed on site</p>
                </div>

                {/* Book button */}
                {user && role === 'user' ? (
                  <Button className="w-full shadow-lg shadow-primary-500/25" size="lg" asChild>
                    <Link to={`/user/book/${provider._id}`}>Book Now <ChevronRight className="w-4 h-4"/></Link>
                  </Button>
                ) : !user ? (
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/user/login">Login to Book</Link>
                  </Button>
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-xs text-gray-500 dark:text-gray-300 text-center border border-gray-200 dark:border-gray-600">
                    Switch to a user account to book
                  </div>
                )}

                <p className={`text-xs mt-3 font-medium text-center ${provider.isAvailable ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                  {provider.isAvailable ? '● Available for bookings' : '● Currently unavailable'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Detail panels ── */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="flex-1 min-w-0 space-y-4">

            {provider.bio && (
              <motion.div variants={fadeUp}>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary-500"/> About
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{provider.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {provider.skills?.length > 0 && (
              <motion.div variants={fadeUp} custom={1}>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Skills & Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {provider.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/40 dark:to-blue-900/40 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-medium border border-primary-100 dark:border-primary-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Service Details — fixed 2-col grid matching screenshot */}
            <motion.div variants={fadeUp} custom={2}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Service Details</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label:'Category',   value: provider.serviceCategory                        },
                      { label:'Experience', value: `${provider.experience} years`                  },
                      { label:'Rate Range', value: `₹${provider.rateMin}–₹${provider.rateMax}/hr` },
                      { label:'Location',   value: provider.address?.city || 'N/A'                 },
                      { label:'Jobs Done',  value: provider.bookings?.length || 0                  },
                      { label:'Status',     value: provider.isAvailable ? '✅ Available':'❌ Busy' },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-700/80 rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-600">
                        <p className="text-xs text-gray-400 dark:text-gray-400 mb-1">{item.label}</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA banner */}
            {user && role === 'user' && (
              <motion.div variants={fadeUp} custom={3}
                className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                <div>
                  <p className="font-semibold text-lg">Ready to Book?</p>
                  <p className="text-blue-200 text-sm mt-0.5">Send a request to {provider.name?.split(' ')[0]}</p>
                </div>
                <Button variant="glass" size="lg" asChild className="w-full sm:w-auto">
                  <Link to={`/user/book/${provider._id}`}>Book Now <ChevronRight className="w-4 h-4"/></Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
