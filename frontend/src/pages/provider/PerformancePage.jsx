import React, { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProviderBookings } from '../../store/slices/bookingSlice'
import { selectBookings, selectBLoading } from '../../store/slices/bookingSlice'
import { selectUser } from '../../store/slices/authSlice'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, Star, IndianRupee, CheckCircle, Clock, XCircle, Award, Activity } from 'lucide-react'

const COLORS = ['#1d4ed8','#16a34a','#f59e0b','#dc2626','#7c3aed','#0891b2']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  )
  return null
}

export default function PerformancePage() {
  const dispatch  = useDispatch()
  const bookings  = useSelector(selectBookings)
  const loading   = useSelector(selectBLoading)
  const user      = useSelector(selectUser)

  useEffect(() => { dispatch(fetchProviderBookings()) }, [dispatch])

  const stats = useMemo(() => {
    const total      = bookings.length
    const completed  = bookings.filter(b => b.status === 'completed').length
    const cancelled  = bookings.filter(b => b.status === 'cancelled').length
    const rejected   = bookings.filter(b => b.status === 'rejected').length
    const pending    = bookings.filter(b => b.status === 'pending').length
    const earnings   = bookings.filter(b => b.status === 'completed' && b.paymentStatus === 'paid').reduce((s,b) => s + (b.totalAmount||0), 0)
    const completion = total ? Math.round((completed/total)*100) : 0
    const reviews    = bookings.filter(b => b.review?.rating)
    const avgRating  = reviews.length ? (reviews.reduce((s,b) => s + b.review.rating, 0) / reviews.length).toFixed(1) : '0'
    return { total, completed, cancelled, rejected, pending, earnings, completion, reviews: reviews.length, avgRating }
  }, [bookings])

  // Monthly earnings chart data
  const monthlyData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const map = {}
    bookings.filter(b => b.status === 'completed').forEach(b => {
      const d   = new Date(b.createdAt)
      const key = months[d.getMonth()]
      map[key]  = (map[key] || 0) + (b.totalAmount || 0)
    })
    return months.map(m => ({ month: m, earnings: map[m] || 0 })).filter(d => d.earnings > 0 || bookings.length < 5)
  }, [bookings])

  // Status distribution for pie chart
  const pieData = [
    { name: 'Completed',  value: stats.completed  || 0 },
    { name: 'Cancelled',  value: stats.cancelled  || 0 },
    { name: 'Rejected',   value: stats.rejected   || 0 },
    { name: 'Pending',    value: stats.pending     || 0 },
  ].filter(d => d.value > 0)

  // Rating distribution
  const ratingDist = useMemo(() => {
    const dist = {5:0,4:0,3:0,2:0,1:0}
    bookings.filter(b=>b.review?.rating).forEach(b => { dist[b.review.rating]++ })
    return [5,4,3,2,1].map(r => ({ stars: `${r}★`, count: dist[r] }))
  }, [bookings])

  // Weekly bookings trend
  const weeklyData = useMemo(() => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const map  = {}
    bookings.forEach(b => { const d = days[new Date(b.createdAt).getDay()]; map[d] = (map[d]||0) + 1 })
    return days.map(d => ({ day: d, bookings: map[d] || 0 }))
  }, [bookings])

  const statCards = [
    { label:'Total Bookings',   value: stats.total,        Icon: Activity,    color:'text-blue-500',   bg:'bg-blue-50 dark:bg-blue-900/20'   },
    { label:'Completed Jobs',   value: stats.completed,    Icon: CheckCircle, color:'text-green-500',  bg:'bg-green-50 dark:bg-green-900/20' },
    { label:'Total Earnings',   value: `₹${stats.earnings}`,Icon:IndianRupee, color:'text-purple-500', bg:'bg-purple-50 dark:bg-purple-900/20'},
    { label:'Avg Rating',       value: `${stats.avgRating}★`,Icon:Star,       color:'text-yellow-500', bg:'bg-yellow-50 dark:bg-yellow-900/20'},
    { label:'Completion Rate',  value: `${stats.completion}%`,Icon:TrendingUp, color:'text-teal-500',  bg:'bg-teal-50 dark:bg-teal-900/20'   },
    { label:'Reviews Received', value: stats.reviews,      Icon: Award,       color:'text-orange-500', bg:'bg-orange-50 dark:bg-orange-900/20'},
  ]

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 flex items-center justify-center">
      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
        className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"/>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-12">

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-primary-700 text-white py-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'32px 32px' }}/>
        <div className="relative max-w-6xl mx-auto">
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="font-display text-3xl font-bold mb-1">Performance Analytics</motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="text-blue-200">Track your bookings, earnings and customer satisfaction</motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map(({ label, value, Icon, color, bg }, i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
              whileHover={{ y:-4 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${color}`}/>
              </div>
              <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Monthly Earnings */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-purple-500"/> Monthly Earnings (₹)
            </h3>
            {monthlyData.some(d => d.earnings > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top:0, right:0, left:0, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5}/>
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Bar dataKey="earnings" name="Earnings ₹" fill="#7c3aed" radius={[6,6,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                No earnings data yet. Complete bookings to see earnings here.
              </div>
            )}
          </motion.div>

          {/* Booking Status Pie */}
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500"/> Booking Status Distribution
            </h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                    paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                    labelLine={false} fontSize={10}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                  </Pie>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend iconType="circle" iconSize={8}
                    formatter={v => <span style={{ fontSize:11, color:'#94a3b8' }}>{v}</span>}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm">
                No booking data yet.
              </div>
            )}
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Weekly Trend */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500"/> Weekly Bookings Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData} margin={{ top:0, right:0, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5}/>
                <XAxis dataKey="day" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#0891b2"
                  strokeWidth={2.5} dot={{ r:4, fill:'#0891b2' }} activeDot={{ r:6 }}/>
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Rating Distribution */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500"/> Rating Distribution
            </h3>
            {stats.reviews > 0 ? (
              <div className="space-y-3">
                {ratingDist.map(({ stars, count }) => {
                  const pct = stats.reviews ? Math.round((count / stats.reviews) * 100) : 0
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-6">{stars}</span>
                      <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8, delay:0.2 }}
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"/>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Average Rating</span>
                  <span className="text-2xl font-bold text-yellow-500">{stats.avgRating} ★</span>
                </div>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm text-center">
                No reviews yet.<br/>Complete bookings to receive ratings.
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent completed bookings summary */}
        {bookings.filter(b => b.status === 'completed').length > 0 && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500"/> Recent Completed Jobs
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['Customer','Service','Date','Amount','Payment','Rating'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.filter(b => b.status === 'completed').slice(0, 5).map((b, i) => (
                    <tr key={b._id} className={`border-b border-gray-50 dark:border-gray-800/50 ${i%2===0?'bg-gray-50/50 dark:bg-gray-800/20':''}`}>
                      <td className="py-3 px-3 font-medium text-gray-900 dark:text-white">{b.user?.name || 'N/A'}</td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-400">{b.serviceCategory}</td>
                      <td className="py-3 px-3 text-gray-500 dark:text-gray-500">{new Date(b.scheduledDate).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 px-3 font-semibold text-green-600 dark:text-green-400">₹{b.totalAmount || 0}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.paymentStatus==='paid'?'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300':'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                          {b.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {b.review?.rating
                          ? <span className="text-yellow-500 font-semibold">{b.review.rating} ★</span>
                          : <span className="text-gray-400 dark:text-gray-600 text-xs">No review</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
