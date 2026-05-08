import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProviderBookings, updateBookingStatus, deleteBooking, deleteAllHistory,
  setActiveTab, selectBookings, selectBLoading, selectActiveTab
} from '../../store/slices/bookingSlice'
import { fetchSubscription, selectSubscription } from '../../store/slices/subscriptionSlice'
import { selectUser } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import StatusBadge  from '../../components/common/StatusBadge'
import AvatarUpload from '../../components/common/AvatarUpload'
import Receipt      from '../../components/common/Receipt'
import { Card, CardContent } from '../../components/ui/card'
import { Badge }    from '../../components/ui/badge'
import { Input }    from '../../components/ui/input'
import { Button }   from '../../components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import {
  Calendar, Clock, User, CheckCircle, XCircle, Play,
  Star, IndianRupee, Briefcase, TrendingUp, Bell,
  Crown, FileText, Trash2, BarChart2, AlertTriangle
} from 'lucide-react'
import { staggerContainer, fadeUp } from '../../lib/motionVariants'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const STATUS_ACTIONS = {
  pending:       [{label:'Accept',status:'accepted',Icon:CheckCircle,cls:'bg-blue-500 hover:bg-blue-600 text-white'},
                  {label:'Reject',status:'rejected',Icon:XCircle,    cls:'bg-red-500  hover:bg-red-600  text-white'}],
  accepted:      [{label:'Start Work',  status:'in-progress',Icon:Play,        cls:'bg-purple-500 hover:bg-purple-600 text-white'}],
  'in-progress': [{label:'Mark Complete',status:'completed', Icon:CheckCircle, cls:'bg-green-500  hover:bg-green-600  text-white',needsAmount:true}],
}

export default function ProviderDashboard() {
  const dispatch     = useDispatch()
  const user         = useSelector(selectUser)
  const bookings     = useSelector(selectBookings)
  const loading      = useSelector(selectBLoading)
  const activeTab    = useSelector(selectActiveTab)
  const subscription = useSelector(selectSubscription)
  const [amountMap,  setAmountMap]  = useState({})
  const [receipt,    setReceipt]    = useState(null)

  useEffect(() => {
    dispatch(fetchProviderBookings())
    dispatch(fetchSubscription())
  }, [dispatch])

  const handleStatusUpdate = async (bookingId, status, totalAmount) => {
    const res = await dispatch(updateBookingStatus({ id:bookingId, status, totalAmount }))
    if (updateBookingStatus.fulfilled.match(res)) toast.success(`Booking ${status}`)
    else toast.error(res.payload || 'Update failed')
  }

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking from history?')) return
    const res = await dispatch(deleteBooking(id))
    if (deleteBooking.fulfilled.match(res)) toast.success('Booking deleted')
    else toast.error(res.payload || 'Cannot delete active bookings')
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete ALL completed/cancelled booking history? This cannot be undone.')) return
    const res = await dispatch(deleteAllHistory())
    if (deleteAllHistory.fulfilled.match(res)) toast.success('History cleared')
    else toast.error(res.payload || 'Failed')
  }

  const filtered      = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab)
  const pendingCount  = bookings.filter(b => b.status === 'pending').length
  const totalEarnings = bookings.filter(b => b.status === 'completed' && b.paymentStatus === 'paid').reduce((s,b) => s+(b.totalAmount||0), 0)
  const hasHistory    = bookings.some(b => ['completed','cancelled','rejected'].includes(b.status))

  const isSubActive  = subscription?.status === 'active'
  const endDate      = subscription?.endDate ? new Date(subscription.endDate) : null
  const daysLeft     = endDate ? Math.ceil((endDate - new Date()) / (1000*60*60*24)) : 0
  const subExpiring  = isSubActive && daysLeft <= 7

  const stats = [
    { label:'Total',     value: bookings.length,                                   Icon:Briefcase   },
    { label:'Pending',   value: pendingCount,                                       Icon:Bell        },
    { label:'Completed', value: bookings.filter(b=>b.status==='completed').length,  Icon:CheckCircle },
    { label:'Earnings',  value: `₹${totalEarnings}`,                               Icon:TrendingUp  },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">

      {/* Header */}
      <div className="relative overflow-hidden py-10 px-4 text-white"
        style={{ background:'linear-gradient(135deg,#c2410c 0%,#ea580c 50%,#f97316 100%)' }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'32px 32px' }}/>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
            <AvatarUpload size="md"/>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl sm:text-2xl font-bold">{user?.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className="bg-white/20 text-white border-0 text-xs">{user?.serviceCategory}</Badge>
                {user?.rating?.count > 0 && (
                  <span className="flex items-center gap-1 text-xs text-orange-100">
                    <Star className="w-3 h-3 fill-yellow-200 text-yellow-200"/>
                    {user.rating.average} ({user.rating.count})
                  </span>
                )}
                {user?.rateMin && <span className="text-xs text-orange-200">₹{user.rateMin}–₹{user.rateMax}/hr</span>}
              </div>
            </div>
            {/* Quick nav buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <Link to="/provider/performance"
                className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-semibold transition-colors">
                <BarChart2 className="w-3.5 h-3.5"/> Analytics
              </Link>
              <Link to="/provider/subscription"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isSubActive ? 'bg-green-500/30 hover:bg-green-500/50' : 'bg-yellow-500/30 hover:bg-yellow-500/50'
                }`}>
                <Crown className="w-3.5 h-3.5"/>
                {isSubActive ? `${daysLeft}d left` : 'Subscribe'}
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map(({ label, value, Icon }, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-1"><Icon className="w-4 h-4 text-orange-200"/><span className="text-xs text-orange-200">{label}</span></div>
                <p className="font-display text-xl sm:text-2xl font-bold">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">

        {/* Subscription warning banners */}
        {!isSubActive && (
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
            className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0"/>
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                {subscription?.status === 'expired'
                  ? 'Your subscription has expired. Customers cannot book you until you renew.'
                  : 'No active subscription. Activate a plan to start receiving bookings.'}
              </p>
            </div>
            <Link to="/provider/subscription"
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors">
              <Crown className="w-4 h-4"/> Subscribe
            </Link>
          </motion.div>
        )}

        {subExpiring && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl flex items-center justify-between gap-4">
            <p className="text-sm text-orange-800 dark:text-orange-300 font-medium flex items-center gap-2">
              <Bell className="w-4 h-4"/> Subscription expiring in {daysLeft} days. Renew to avoid interruption.
            </p>
            <Link to="/provider/subscription"
              className="flex-shrink-0 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors">
              Renew
            </Link>
          </motion.div>
        )}

        {/* Bookings header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Requests</h2>
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <Badge variant="destructive" className="gap-1.5"><Bell className="w-3 h-3"/>{pendingCount} pending</Badge>
            )}
            {hasHistory && (
              <motion.button whileTap={{ scale:0.95 }} onClick={handleDeleteAll}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 border border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-4 h-4"/> Clear History
              </motion.button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={tab => dispatch(setActiveTab(tab))}>
          <TabsList className="mb-6 flex flex-wrap gap-1 h-auto bg-gray-100 dark:bg-gray-800 p-1 w-full">
            {['all','pending','accepted','in-progress','completed','rejected'].map(tab => (
              <TabsTrigger key={tab} value={tab} className="capitalize text-xs px-2 sm:px-3 py-1.5 flex-1 sm:flex-none">
                {tab==='all'?'All':tab==='in-progress'?'Active':tab}
                {tab==='pending' && pendingCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{pendingCount}</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-28 skeleton"/>)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 dark:text-gray-400">No bookings in this category</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {filtered.map((booking, i) => (
                    <motion.div key={booking._id}
                      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                      exit={{ opacity:0 }} transition={{ delay:i*0.04 }}>
                      <Card className="border-0 shadow-sm hover:shadow-md overflow-hidden">
                        <div className={`h-1.5 ${
                          booking.status==='pending'?'bg-yellow-400':
                          booking.status==='completed'?'bg-green-500':
                          booking.status==='in-progress'?'bg-purple-500':
                          booking.status==='accepted'?'bg-blue-500':'bg-gray-300 dark:bg-gray-600'
                        }`}/>
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                            {/* Customer info */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {booking.user?.avatar
                                  ? <img src={`${API_BASE}${booking.user.avatar}`} alt="" className="w-full h-full object-cover"/>
                                  : <User className="w-5 h-5 text-white"/>
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{booking.user?.name}</h3>
                                  <StatusBadge status={booking.status}/>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{booking.user?.phone} · {booking.user?.email}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{new Date(booking.scheduledDate).toLocaleDateString('en-IN')}</span>
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{booking.scheduledTime}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-600 line-clamp-2">{booking.description}</p>
                                {booking.address?.city && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">📍 {[booking.address.street,booking.address.city,booking.address.state].filter(Boolean).join(', ')}</p>
                                )}
                                {booking.status === 'accepted' && (
                                  <span className={`mt-2 inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    booking.paymentStatus==='paid'
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                  }`}>
                                    {booking.paymentStatus==='paid' ? '✅ Payment received' : '⏳ Waiting for payment'}
                                  </span>
                                )}
                                {/* Review left by customer */}
                                {booking.review?.rating && (
                                  <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800">
                                    <div className="flex gap-0.5">
                                      {[...Array(5)].map((_,j) => (
                                        <Star key={j} className={`w-3 h-3 ${j < booking.review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}/>
                                      ))}
                                    </div>
                                    {booking.review.comment && (
                                      <p className="text-xs text-gray-600 dark:text-gray-400 italic truncate">"{booking.review.comment}"</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row md:flex-col gap-2 flex-shrink-0 flex-wrap items-start">
                              {STATUS_ACTIONS[booking.status]?.map((action, idx) => {
                                const Icon = action.Icon
                                return (
                                  <div key={idx}>
                                    {action.needsAmount ? (
                                      <div className="flex gap-2 items-center">
                                        <div className="relative">
                                          <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400"/>
                                          <Input type="number" min="0" placeholder="Total ₹"
                                            value={amountMap[booking._id]||''}
                                            onChange={e => setAmountMap({...amountMap,[booking._id]:e.target.value})}
                                            className="w-24 text-sm h-9 pl-7"/>
                                        </div>
                                        <button onClick={() => handleStatusUpdate(booking._id, action.status, amountMap[booking._id])}
                                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold ${action.cls}`}>
                                          <Icon className="w-3.5 h-3.5"/>{action.label}
                                        </button>
                                      </div>
                                    ) : (
                                      <button onClick={() => handleStatusUpdate(booking._id, action.status)}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${action.cls}`}>
                                        <Icon className="w-3.5 h-3.5"/>{action.label}
                                      </button>
                                    )}
                                  </div>
                                )
                              })}

                              {/* Receipt */}
                              {booking.status === 'completed' && (
                                <button onClick={() => setReceipt(booking)}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-md transition-colors">
                                  <FileText className="w-3.5 h-3.5"/> Receipt
                                </button>
                              )}

                              {/* Earnings display */}
                              {booking.status === 'completed' && booking.totalAmount > 0 && (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center border border-green-200 dark:border-green-800">
                                  <div className="flex items-center justify-center gap-1">
                                    <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-400"/>
                                    <span className="text-xl font-bold text-green-600 dark:text-green-400">{booking.totalAmount}</span>
                                  </div>
                                  <p className={`text-xs mt-0.5 font-semibold ${booking.paymentStatus==='paid'?'text-green-500':'text-red-400'}`}>
                                    {booking.paymentStatus==='paid' ? '✅ Paid' : '⏳ Pending'}
                                  </p>
                                </div>
                              )}

                              {/* Delete button for history */}
                              {['completed','cancelled','rejected'].includes(booking.status) && (
                                <motion.button whileTap={{ scale:0.9 }}
                                  onClick={() => handleDeleteBooking(booking._id)}
                                  className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                  <Trash2 className="w-3.5 h-3.5"/>
                                </motion.button>
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
      </div>

      {receipt && <Receipt booking={receipt} user={receipt.user} provider={user} onClose={() => setReceipt(null)}/>}
    </div>
  )
}
