import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserBookings, cancelBooking, markPaymentDone,
  deleteBooking, deleteAllHistory, setActiveTab,
  selectBookings, selectBLoading, selectActiveTab
} from '../../store/slices/bookingSlice'
import { selectUser } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import StatusBadge    from '../../components/common/StatusBadge'
import Receipt        from '../../components/common/Receipt'
import AvatarUpload   from '../../components/common/AvatarUpload'
import ReviewModal    from '../../components/common/ReviewModal'
import { Card, CardContent } from '../../components/ui/card'
import { Button }     from '../../components/ui/button'
import { Badge }      from '../../components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import {
  Search, Calendar, Clock, X, IndianRupee, Package,
  CheckCircle, Activity, FileText, CreditCard, Star,
  Trash2, AlertTriangle
} from 'lucide-react'
import { staggerContainer, fadeUp } from '../../lib/motionVariants'

const TABS = ['all','pending','accepted','in-progress','completed','cancelled']
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function UserDashboard() {
  const dispatch  = useDispatch()
  const user      = useSelector(selectUser)
  const bookings  = useSelector(selectBookings)
  const loading   = useSelector(selectBLoading)
  const activeTab = useSelector(selectActiveTab)
  const [receipt,      setReceipt]      = useState(null)
  const [reviewBooking,setReviewBooking] = useState(null)

  useEffect(() => { dispatch(fetchUserBookings()) }, [dispatch])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    const res = await dispatch(cancelBooking(id))
    if (cancelBooking.fulfilled.match(res)) toast.success('Booking cancelled')
    else toast.error(res.payload || 'Failed to cancel')
  }

  const handlePaymentDone = async (id) => {
    const res = await dispatch(markPaymentDone(id))
    if (markPaymentDone.fulfilled.match(res)) toast.success('✅ Payment confirmed!')
    else toast.error('Failed to confirm payment')
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
    else toast.error(res.payload || 'Failed to clear history')
  }

  const filtered    = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab)
  const hasHistory  = bookings.some(b => ['completed','cancelled','rejected'].includes(b.status))

  const stats = [
    { label:'Total',     value: bookings.length,                                                                       Icon: Package,     color:'text-blue-400'   },
    { label:'Active',    value: bookings.filter(b=>['pending','accepted','in-progress'].includes(b.status)).length,    Icon: Activity,    color:'text-yellow-400' },
    { label:'Completed', value: bookings.filter(b=>b.status==='completed').length,                                     Icon: CheckCircle, color:'text-green-400'  },
    { label:'Spent',     value:`₹${bookings.filter(b=>b.status==='completed').reduce((s,b)=>s+(b.totalAmount||0),0)}`, Icon: IndianRupee, color:'text-purple-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-primary-700 text-white py-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'32px 32px' }}/>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
            <AvatarUpload size="md"/>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-blue-200 text-xs sm:text-sm mt-0.5">{user?.email}</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map(({ label, value, Icon, color }, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${color}`}/>
                  <span className="text-xs text-blue-200 font-medium">{label}</span>
                </div>
                <p className="font-display text-xl sm:text-2xl font-bold">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <Button asChild size="lg" className="shadow-lg w-full sm:w-auto">
            <Link to="/providers"><Search className="w-4 h-4"/> Find New Service</Link>
          </Button>
        </div>

        {/* Bookings header with delete all */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Bookings</h2>
          {hasHistory && (
            <motion.button whileTap={{ scale:0.95 }} onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 border border-red-200 dark:border-red-800 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 className="w-4 h-4"/>
              Clear History
            </motion.button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={tab => dispatch(setActiveTab(tab))}>
          <TabsList className="mb-6 flex flex-wrap gap-1 h-auto bg-gray-100 dark:bg-gray-800 p-1 w-full">
            {TABS.map(tab => (
              <TabsTrigger key={tab} value={tab} className="capitalize text-xs px-2 sm:px-3 py-1.5 flex-1 sm:flex-none">
                {tab === 'all' ? 'All' : tab === 'in-progress' ? 'Active' : tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-24 skeleton"/>)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-500 dark:text-gray-400 mb-5">No bookings found</p>
                <Button asChild><Link to="/providers">Book a Service</Link></Button>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {filtered.map((booking, i) => (
                    <motion.div key={booking._id}
                      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                      exit={{ opacity:0, y:-20 }} transition={{ delay:i*0.04 }}>
                      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md">
                        <div className={`h-1.5 ${
                          booking.status==='accepted'?'bg-blue-500':
                          booking.status==='completed'?'bg-green-500':
                          booking.status==='in-progress'?'bg-purple-500':
                          booking.status==='pending'?'bg-yellow-400':'bg-gray-300 dark:bg-gray-600'
                        }`}/>
                        <CardContent className="p-4 sm:p-5">
                          {/* Top row */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden">
                                {booking.provider?.avatar
                                  ? <img src={`${API_BASE}${booking.provider.avatar}`} alt="" className="w-full h-full object-cover"/>
                                  : booking.provider?.name?.charAt(0)
                                }
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{booking.provider?.name}</h3>
                                <Badge variant="info" className="text-xs mt-0.5">{booking.serviceCategory}</Badge>
                              </div>
                            </div>
                            <StatusBadge status={booking.status}/>
                          </div>

                          {/* Date/time */}
                          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-3">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{new Date(booking.scheduledDate).toLocaleDateString('en-IN')}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{booking.scheduledTime}</span>
                          </div>

                          {/* Description */}
                          {booking.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/60 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-600 mb-3 line-clamp-2">
                              {booking.description}
                            </p>
                          )}

                          {/* Existing review display */}
                          {booking.review?.rating && (
                            <div className="flex items-center gap-2 mb-3 p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800">
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_,j) => (
                                  <Star key={j} className={`w-3.5 h-3.5 ${j < booking.review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}/>
                                ))}
                              </div>
                              {booking.review.comment && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate italic">"{booking.review.comment}"</p>
                              )}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Cancel */}
                            {booking.status === 'pending' && (
                              <Button variant="ghost" size="sm" onClick={() => handleCancel(booking._id)}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 text-xs border border-red-200 dark:border-red-800">
                                <X className="w-3 h-3"/> Cancel
                              </Button>
                            )}

                            {/* Payment done */}
                            {booking.status === 'accepted' && booking.paymentStatus !== 'paid' && (
                              <Button size="sm" onClick={() => handlePaymentDone(booking._id)}
                                className="h-8 text-xs bg-green-600 hover:bg-green-700 gap-1.5">
                                <CreditCard className="w-3.5 h-3.5"/> Mark Paid
                              </Button>
                            )}

                            {/* Completed actions */}
                            {booking.status === 'completed' && (
                              <>
                                <Button size="sm" onClick={() => setReceipt(booking)}
                                  className="h-8 text-xs bg-primary-600 hover:bg-primary-700 text-white gap-1.5">
                                  <FileText className="w-3.5 h-3.5"/> Receipt
                                </Button>
                                <Button size="sm" onClick={() => setReviewBooking(booking)}
                                  className={`h-8 text-xs gap-1.5 ${booking.review?.rating ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}>
                                  <Star className="w-3.5 h-3.5"/>
                                  {booking.review?.rating ? 'Edit Review' : 'Write Review'}
                                </Button>
                                {booking.totalAmount > 0 && (
                                  <Badge variant="success" className="font-bold text-sm ml-auto">₹{booking.totalAmount}</Badge>
                                )}
                              </>
                            )}

                            {/* Delete completed/cancelled */}
                            {['completed','cancelled','rejected'].includes(booking.status) && (
                              <motion.button whileTap={{ scale:0.9 }}
                                onClick={() => handleDeleteBooking(booking._id)}
                                className="ml-auto flex items-center gap-1 text-xs text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                <Trash2 className="w-3.5 h-3.5"/>
                              </motion.button>
                            )}
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

      {/* Modals */}
      {receipt && <Receipt booking={receipt} user={user} provider={receipt.provider} onClose={() => setReceipt(null)}/>}
      {reviewBooking && <ReviewModal booking={reviewBooking} onClose={() => { setReviewBooking(null); dispatch(fetchUserBookings()) }}/>}
    </div>
  )
}
