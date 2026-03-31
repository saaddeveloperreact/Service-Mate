import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import StatusBadge from '../../components/common/StatusBadge'
import QRPaymentModal from '../../components/common/QRPaymentModal'
import Receipt from '../../components/common/Receipt'
import AvatarUpload from '../../components/common/AvatarUpload'
import { Card, CardContent }              from '../../components/ui/card'
import { Button }                         from '../../components/ui/button'
import { Badge }                          from '../../components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import {
  Search, Calendar, Clock, X, IndianRupee,
  Package, CheckCircle, Activity, QrCode, FileText, CreditCard
} from 'lucide-react'
import { staggerContainer, fadeUp } from '../../lib/motionVariants'

const TABS = ['all','pending','accepted','in-progress','completed','cancelled']
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function UserDashboard() {
  const { user, API }   = useAuth()
  const [bookings, setBookings]   = useState([])
  const [loading,  setLoading]    = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [qrBooking, setQrBooking] = useState(null)
  const [receipt,   setReceipt]   = useState(null)

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

  // Mark payment done — called from QR modal OR manual button
  const handlePaymentDone = async (bookingId) => {
    try {
      await API.put(`/bookings/${bookingId}/payment`)
      toast.success('✅ Payment confirmed! Provider will start the work.')
      setQrBooking(null)
      fetchBookings()
    } catch { toast.error('Failed to confirm payment') }
  }

  const filtered = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab)

  const stats = [
    { label:'Total',     value: bookings.length,                                                                       Icon: Package,     color:'text-blue-400'   },
    { label:'Active',    value: bookings.filter(b => ['pending','accepted','in-progress'].includes(b.status)).length,  Icon: Activity,    color:'text-yellow-400' },
    { label:'Completed', value: bookings.filter(b => b.status === 'completed').length,                                 Icon: CheckCircle, color:'text-green-400'  },
    { label:'Spent',     value:`₹${bookings.filter(b=>b.status==='completed').reduce((s,b)=>s+(b.totalAmount||0),0)}`, Icon: IndianRupee, color:'text-purple-400' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-primary-700 text-white py-10 sm:py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'32px 32px' }} />
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6 sm:mb-8">
            <AvatarUpload size="md" />
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-blue-200 text-xs sm:text-sm mt-0.5">{user?.email}</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map(({ label, value, Icon, color }, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} whileHover={{ scale:1.03 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs text-blue-200 font-medium">{label}</span>
                </div>
                <p className="font-display text-xl sm:text-2xl font-bold text-white">{value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-6">
          <Button asChild size="lg" className="shadow-lg shadow-primary-500/20 w-full sm:w-auto">
            <Link to="/providers"><Search className="w-4 h-4" /> Find New Service</Link>
          </Button>
        </motion.div>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">My Bookings</h2>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex flex-wrap gap-1 h-auto bg-gray-100 dark:bg-gray-800 p-1 w-full">
              {TABS.map(tab => (
                <TabsTrigger key={tab} value={tab} className="capitalize text-xs px-2 sm:px-3 py-1.5 flex-1 sm:flex-none">
                  {tab === 'all' ? 'All' : tab === 'in-progress' ? 'Active' : tab}
                  {tab !== 'all' && (
                    <span className="ml-1 text-xs opacity-60 hidden sm:inline">
                      ({bookings.filter(b=>b.status===tab).length})
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="space-y-4">{[...Array(3)].map((_,i) => <div key={i} className="h-24 skeleton" />)}</div>
              ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-16 sm:py-20">
                  <div className="text-5xl sm:text-6xl mb-4">📋</div>
                  <p className="text-gray-500 dark:text-gray-400 mb-5">No bookings found</p>
                  <Button asChild><Link to="/providers">Book a Service</Link></Button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-4">
                    {filtered.map((booking, i) => (
                      <motion.div key={booking._id}
                        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                        exit={{ opacity:0, y:-20 }} transition={{ delay:i*0.05 }}>
                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md">
                          {/* Status top bar */}
                          <div className={`h-1.5 ${
                            booking.status==='accepted'    ? 'bg-blue-500' :
                            booking.status==='completed'   ? 'bg-green-500' :
                            booking.status==='in-progress' ? 'bg-purple-500' :
                            booking.status==='pending'     ? 'bg-yellow-400' :
                            'bg-gray-300 dark:bg-gray-600'
                          }`} />

                          <CardContent className="p-4 sm:p-5">
                            {/* Top row — provider info + status */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center font-bold text-white text-base flex-shrink-0 shadow-md overflow-hidden">
                                  {booking.provider?.avatar
                                    ? <img src={`${API_BASE}${booking.provider.avatar}`} alt="" className="w-full h-full object-cover" />
                                    : booking.provider?.name?.charAt(0)
                                  }
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{booking.provider?.name}</h3>
                                  <Badge variant="info" className="text-xs mt-0.5">{booking.serviceCategory}</Badge>
                                </div>
                              </div>
                              <StatusBadge status={booking.status} />
                            </div>

                            {/* Date / time */}
                            <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-3">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(booking.scheduledDate).toLocaleDateString('en-IN')}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.scheduledTime}</span>
                            </div>

                            {/* Description */}
                            {booking.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/60 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-600 mb-3 line-clamp-2">
                                {booking.description}
                              </p>
                            )}

                            {/* Action buttons row */}
                            <div className="flex flex-wrap items-center gap-2 mt-1">

                              {/* ── PENDING: cancel ── */}
                              {booking.status === 'pending' && (
                                <Button variant="ghost" size="sm" onClick={() => handleCancel(booking._id)}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 h-8 text-xs border border-red-200 dark:border-red-800">
                                  <X className="w-3 h-3" /> Cancel
                                </Button>
                              )}

                              {/* ── ACCEPTED + QR exists: show Pay Now OR Paid ── */}
                              {booking.status === 'accepted' && booking.qrCode && (
                                booking.paymentStatus === 'paid' ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold border border-green-200 dark:border-green-700">
                                    <CheckCircle className="w-3.5 h-3.5" /> Payment Done
                                  </span>
                                ) : (
                                  <Button size="sm" onClick={() => setQrBooking(booking)}
                                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 gap-1.5">
                                    <QrCode className="w-3.5 h-3.5" /> Scan & Pay
                                  </Button>
                                )
                              )}

                              {/* ── ACCEPTED + NO QR: manual payment confirm ── */}
                              {booking.status === 'accepted' && !booking.qrCode && booking.paymentStatus !== 'paid' && (
                                <Button size="sm" onClick={() => handlePaymentDone(booking._id)}
                                  className="h-8 text-xs bg-green-600 hover:bg-green-700 gap-1.5">
                                  <CreditCard className="w-3.5 h-3.5" /> Mark Payment Done
                                </Button>
                              )}

                              {/* ── COMPLETED: receipt + amount ── */}
                              {booking.status === 'completed' && (
                                <>
                                  {/* Receipt button — highly visible */}
                                  <Button
                                    size="sm"
                                    onClick={() => setReceipt(booking)}
                                    className="h-8 text-xs bg-primary-600 hover:bg-primary-700 text-white gap-1.5 shadow-md"
                                  >
                                    <FileText className="w-3.5 h-3.5" /> View Receipt
                                  </Button>

                                  {/* Payment status pill */}
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    booking.paymentStatus === 'paid'
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700'
                                  }`}>
                                    {booking.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Payment Pending'}
                                  </span>

                                  {/* Mark payment done if still pending after completion */}
                                  {booking.paymentStatus !== 'paid' && (
                                    <Button size="sm" onClick={() => handlePaymentDone(booking._id)}
                                      className="h-8 text-xs bg-green-600 hover:bg-green-700 gap-1.5">
                                      <CreditCard className="w-3.5 h-3.5" /> Mark Paid
                                    </Button>
                                  )}

                                  {booking.totalAmount > 0 && (
                                    <Badge variant="success" className="font-bold text-sm ml-auto">
                                      ₹{booking.totalAmount}
                                    </Badge>
                                  )}
                                </>
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
        </motion.div>
      </div>

      {/* QR Payment Modal */}
      {qrBooking && (
        <QRPaymentModal
          booking={qrBooking}
          provider={qrBooking.provider}
          onClose={() => setQrBooking(null)}
          onPaymentDone={() => handlePaymentDone(qrBooking._id)}
        />
      )}

      {/* Receipt Modal */}
      {receipt && (
        <Receipt
          booking={receipt}
          user={user}
          provider={receipt.provider}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  )
}
