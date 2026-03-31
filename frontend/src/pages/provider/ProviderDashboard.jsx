import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import StatusBadge from '../../components/common/StatusBadge'
import AvatarUpload from '../../components/common/AvatarUpload'
import Receipt from '../../components/common/Receipt'
import { Card, CardContent }              from '../../components/ui/card'
import { Button }                         from '../../components/ui/button'
import { Badge }                          from '../../components/ui/badge'
import { Input }                          from '../../components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { Calendar, Clock, User, CheckCircle, XCircle, Play, Star, IndianRupee, Briefcase, TrendingUp, Bell, FileText, Mail } from 'lucide-react'
import { staggerContainer, fadeUp } from '../../lib/motionVariants'

const statusActions = {
  pending:       [
    { label:'Accept', status:'accepted',    Icon:CheckCircle, cls:'bg-blue-500   hover:bg-blue-600   text-white' },
    { label:'Reject', status:'rejected',    Icon:XCircle,     cls:'bg-red-500    hover:bg-red-600    text-white' },
  ],
  accepted:      [{ label:'Start Work',    status:'in-progress', Icon:Play,        cls:'bg-purple-500 hover:bg-purple-600 text-white' }],
  'in-progress': [{ label:'Mark Complete', status:'completed',   Icon:CheckCircle, cls:'bg-green-500  hover:bg-green-600  text-white', needsAmount:true }],
}

export default function ProviderDashboard() {
  const { user, API }   = useAuth()
  const [bookings, setBookings]     = useState([])
  const [loading,  setLoading]      = useState(true)
  const [activeTab, setActiveTab]   = useState('all')
  const [amountMap, setAmountMap]   = useState({})
  const [receipt,   setReceipt]     = useState(null)

  const fetchBookings = async () => {
    try { const { data } = await API.get('/bookings/provider'); setBookings(data.bookings) }
    catch { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchBookings() }, [])

  const handleStatusUpdate = async (bookingId, status, totalAmount) => {
    try {
      await API.put(`/bookings/${bookingId}/status`, { status, totalAmount })
      toast.success(`Booking ${status}`)
      fetchBookings()
    } catch { toast.error('Update failed') }
  }

  const filtered      = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab)
  const pendingCount  = bookings.filter(b => b.status === 'pending').length
  const totalEarnings = bookings.filter(b => b.status === 'completed' && b.paymentStatus === 'paid').reduce((s,b) => s+(b.totalAmount||0), 0)

  const stats = [
    { label:'Total',     value: bookings.length,                                         Icon:Briefcase   },
    { label:'Pending',   value: pendingCount,                                            Icon:Bell        },
    { label:'Completed', value: bookings.filter(b => b.status==='completed').length,     Icon:CheckCircle },
    { label:'Earnings',  value: `₹${totalEarnings}`,                                    Icon:TrendingUp  },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">

      {/* Header */}
      <div className="relative overflow-hidden py-12 px-4 text-white"
        style={{ background:'linear-gradient(135deg,#c2410c 0%,#ea580c 50%,#f97316 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'32px 32px' }} />
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <AvatarUpload size="md" />
            <div>
              <h1 className="font-display text-2xl font-bold">{user?.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className="bg-white/20 text-white border-0 text-xs">{user?.serviceCategory}</Badge>
                {user?.rating?.count > 0 && (
                  <span className="flex items-center gap-1 text-xs text-orange-100">
                    <Star className="w-3 h-3 fill-yellow-200 text-yellow-200" />
                    {user.rating.average} ({user.rating.count} reviews)
                  </span>
                )}
                {user?.rateMin && (
                  <span className="text-xs text-orange-100">₹{user.rateMin}–₹{user.rateMax}/hr</span>
                )}
              </div>
              <p className="text-orange-200 text-xs mt-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Tap camera icon to update photo
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map(({ label, value, Icon }, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} whileHover={{ scale:1.03, y:-2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-orange-200" />
                  <span className="text-xs text-orange-200 font-medium">{label}</span>
                </div>
                <p className="font-display text-xl sm:text-2xl font-bold text-white">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Requests</h2>
            {pendingCount > 0 && (
              <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:2, repeat:Infinity }}>
                <Badge variant="destructive" className="gap-1.5"><Bell className="w-3 h-3" />{pendingCount} pending</Badge>
              </motion.div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex flex-wrap gap-1 h-auto bg-gray-100 dark:bg-gray-800 p-1 w-full">
              {['all','pending','accepted','in-progress','completed','rejected'].map(tab => (
                <TabsTrigger key={tab} value={tab} className="capitalize text-xs px-2 sm:px-3 py-1.5 flex-1 sm:flex-none">
                  {tab === 'all' ? 'All' : tab === 'in-progress' ? 'Active' : tab}
                  {tab === 'pending' && pendingCount > 0 && (
                    <motion.span animate={{ scale:[1,1.2,1] }} transition={{ duration:1.5, repeat:Infinity }}
                      className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{pendingCount}</motion.span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-28 skeleton" />)}</div>
              ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 dark:text-gray-400">No bookings in this category</p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-4">
                    {filtered.map((booking, i) => (
                      <motion.div key={booking._id}
                        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                        exit={{ opacity:0 }} transition={{ delay:i*0.05 }} whileHover={{ y:-2 }}>
                        <Card className="border-0 shadow-sm hover:shadow-md overflow-hidden">
                          <div className={`h-1 ${booking.status==='pending'?'bg-yellow-400':booking.status==='completed'?'bg-green-400':booking.status==='in-progress'?'bg-purple-400':booking.status==='accepted'?'bg-blue-400':'bg-gray-300 dark:bg-gray-600'}`} />
                          <CardContent className="p-4 sm:p-5">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                              {/* Customer info */}
                              <div className="flex items-start gap-3 sm:gap-4">
                                <motion.div whileHover={{ scale:1.1 }}
                                  className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                                  {booking.user?.avatar
                                    ? <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${booking.user.avatar}`} alt="" className="w-full h-full object-cover" />
                                    : <User className="w-5 h-5 text-white" />
                                  }
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{booking.user?.name}</h3>
                                    <StatusBadge status={booking.status} />
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{booking.user?.phone} · {booking.user?.email}</p>
                                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.scheduledTime}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-600 line-clamp-2">
                                    {booking.description}
                                  </p>
                                  {booking.address?.city && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 flex items-start gap-1">
                                      📍 {[booking.address.street, booking.address.city, booking.address.state].filter(Boolean).join(', ')}
                                    </p>
                                  )}
                                  {/* Payment status pill */}
                                  {booking.status === 'accepted' && (
                                    <div className="mt-2">
                                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                        {booking.paymentStatus === 'paid' ? '✅ Payment received' : '⏳ Waiting for payment'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex flex-row md:flex-col gap-2 flex-shrink-0 flex-wrap">
                                {statusActions[booking.status]?.map((action, idx) => {
                                  const Icon = action.Icon
                                  return (
                                    <div key={idx}>
                                      {action.needsAmount ? (
                                        <div className="flex gap-2 items-center">
                                          <div className="relative">
                                            <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                            <Input type="number" min="0" placeholder="Total ₹"
                                              value={amountMap[booking._id]||''}
                                              onChange={e => setAmountMap({ ...amountMap, [booking._id]: e.target.value })}
                                              className="w-24 text-sm h-9 pl-7" />
                                          </div>
                                          <motion.button whileTap={{ scale:0.95 }}
                                            onClick={() => handleStatusUpdate(booking._id, action.status, amountMap[booking._id])}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${action.cls}`}>
                                            <Icon className="w-3.5 h-3.5" />{action.label}
                                          </motion.button>
                                        </div>
                                      ) : (
                                        <motion.button whileTap={{ scale:0.95 }}
                                          onClick={() => handleStatusUpdate(booking._id, action.status)}
                                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${action.cls}`}>
                                          <Icon className="w-3.5 h-3.5" />{action.label}
                                        </motion.button>
                                      )}
                                    </div>
                                  )
                                })}

                                {/* Receipt button for completed */}
                                {booking.status === 'completed' && (
                                  <Button size="sm" variant="outline" onClick={() => setReceipt(booking)}
                                    className="gap-1.5 text-xs dark:border-gray-600 dark:text-gray-300">
                                    <FileText className="w-3.5 h-3.5" /> Receipt
                                  </Button>
                                )}

                                {booking.status === 'completed' && booking.totalAmount > 0 && (
                                  <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring' }}
                                    className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center border border-green-100 dark:border-green-800">
                                    <div className="flex items-center justify-center gap-1">
                                      <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-400" />
                                      <span className="text-xl font-bold text-green-600 dark:text-green-400">{booking.totalAmount}</span>
                                    </div>
                                    <p className={`text-xs mt-0.5 font-medium ${booking.paymentStatus==='paid'?'text-green-500':'text-red-400'}`}>
                                      {booking.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Payment Pending'}
                                    </p>
                                  </motion.div>
                                )}
                              </div>
                            </div>
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

      {/* Receipt Modal */}
      {receipt && (
        <Receipt
          booking={receipt}
          user={receipt.user}
          provider={user}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  )
}
