import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import StatusBadge from '../../components/common/StatusBadge'
import { Card, CardContent }              from '../../components/ui/card'
import { Button }                         from '../../components/ui/button'
import { Badge }                          from '../../components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { Search, Calendar, Clock, X, User, IndianRupee, Package, CheckCircle, Activity } from 'lucide-react'
import { staggerContainer, fadeUp } from '../../lib/motionVariants'

const TABS = ['all','pending','accepted','in-progress','completed','cancelled']

export default function UserDashboard() {
  const { user, API }   = useAuth()
  const [bookings, setBookings]   = useState([])
  const [loading,  setLoading]    = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  const fetchBookings = async () => {
    try { const { data } = await API.get('/bookings/my'); setBookings(data.bookings) }
    catch { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try { await API.put(`/bookings/${id}/cancel`); toast.success('Cancelled'); fetchBookings() }
    catch { toast.error('Failed to cancel') }
  }

  const filtered = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab)

  const stats = [
    { label:'Total',     value: bookings.length,                                                                        Icon: Package,     color:'text-blue-400'   },
    { label:'Active',    value: bookings.filter(b => ['pending','accepted','in-progress'].includes(b.status)).length,   Icon: Activity,    color:'text-yellow-400' },
    { label:'Completed', value: bookings.filter(b => b.status === 'completed').length,                                  Icon: CheckCircle, color:'text-green-400'  },
    { label:'Spent',     value:`₹${bookings.filter(b=>b.status==='completed').reduce((s,b)=>s+(b.totalAmount||0),0)}`,  Icon: IndianRupee, color:'text-purple-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-primary-700 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'32px 32px' }} />
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <motion.div whileHover={{ scale:1.1, rotate:5 }}
              className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <User className="w-7 h-7" />
            </motion.div>
            <div>
              <h1 className="font-display text-2xl font-bold">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-blue-200 text-sm mt-0.5">{user?.email}</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ label, value, Icon, color }, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} whileHover={{ scale:1.03, y:-2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs text-blue-200 font-medium">{label}</span>
                </div>
                <p className="font-display text-2xl font-bold text-white">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <Button asChild size="lg" className="shadow-lg shadow-primary-500/20">
            <Link to="/providers"><Search className="w-4 h-4" /> Find New Service</Link>
          </Button>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">My Bookings</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex flex-wrap gap-1 h-auto bg-gray-100 dark:bg-gray-800 p-1">
              {TABS.map(tab => (
                <TabsTrigger key={tab} value={tab} className="capitalize text-xs px-3 py-1.5">
                  {tab === 'all' ? 'All' : tab}
                  {tab !== 'all' && (
                    <span className="ml-1 text-xs opacity-60">({bookings.filter(b=>b.status===tab).length})</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab}>
              {loading ? (
                <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-24 skeleton" />)}</div>
              ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-500 dark:text-gray-400 mb-5">No bookings found</p>
                  <Button asChild><Link to="/providers">Book a Service</Link></Button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-4">
                    {filtered.map((booking, i) => (
                      <motion.div key={booking._id}
                        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                        exit={{ opacity:0, y:-20 }} transition={{ delay:i*0.05 }} whileHover={{ y:-2 }}>
                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md">
                          <CardContent className="p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <motion.div whileHover={{ scale:1.1 }}
                                  className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0 shadow-md">
                                  {booking.provider?.name?.charAt(0)}
                                </motion.div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">{booking.provider?.name}</h3>
                                  <Badge variant="info" className="text-xs mt-0.5">{booking.serviceCategory}</Badge>
                                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.scheduledTime}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <StatusBadge status={booking.status} />
                                {booking.status === 'pending' && (
                                  <Button variant="ghost" size="sm" onClick={() => handleCancel(booking._id)}
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 text-xs">
                                    <X className="w-3 h-3" /> Cancel
                                  </Button>
                                )}
                                {booking.status === 'completed' && booking.totalAmount > 0 && (
                                  <Badge variant="success" className="font-bold text-sm">₹{booking.totalAmount}</Badge>
                                )}
                              </div>
                            </div>
                            {booking.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2 border border-gray-100 dark:border-gray-600">
                                {booking.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
