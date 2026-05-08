import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubscription, createOrder, verifyPayment, selectSubscription, selectSubLoading } from '../../store/slices/subscriptionSlice'
import { selectUser } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import { CheckCircle, Crown, Zap, Shield, Star, Calendar, ArrowRight, Lock } from 'lucide-react'

const PLANS = [
  {
    id: 'monthly',
    label: '1 Month',
    price: 400,
    duration: '1 month',
    color: 'from-blue-500 to-blue-700',
    borderColor: 'border-blue-500',
    badge: null,
    features: ['Accept unlimited bookings', 'Profile visible to customers', 'Receipt generation', 'Dashboard analytics'],
  },
  {
    id: 'quarterly',
    label: '3 Months',
    price: 700,
    duration: '3 months',
    color: 'from-primary-600 to-primary-800',
    borderColor: 'border-primary-500',
    badge: 'POPULAR',
    features: ['Everything in Monthly', 'Save ₹500 vs monthly', 'Priority listing', 'Advanced analytics'],
  },
  {
    id: 'biannual',
    label: '6 Months',
    price: 1200,
    duration: '6 months',
    color: 'from-orange-500 to-orange-700',
    borderColor: 'border-orange-500',
    badge: 'BEST VALUE',
    features: ['Everything in Quarterly', 'Save ₹1200 vs monthly', 'Top placement in search', 'Performance insights'],
  },
]

function loadRazorpayScript() {
  return new Promise(resolve => {
    if (document.getElementById('razorpay-script')) { resolve(true); return }
    const script    = document.createElement('script')
    script.id       = 'razorpay-script'
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload   = () => resolve(true)
    script.onerror  = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function SubscriptionPage() {
  const dispatch     = useDispatch()
  const user         = useSelector(selectUser)
  const subscription = useSelector(selectSubscription)
  const loading      = useSelector(selectSubLoading)
  const [paying, setPaying] = useState(false)

  useEffect(() => { dispatch(fetchSubscription()) }, [dispatch])

  const handleSubscribe = async (plan) => {
    setPaying(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast.error('Razorpay SDK failed to load. Check your internet connection.'); setPaying(false); return }

      const orderResult = await dispatch(createOrder(plan.id))
      if (!createOrder.fulfilled.match(orderResult)) {
        toast.error(orderResult.payload || 'Failed to create order')
        setPaying(false); return
      }

      const { order, key } = orderResult.payload

      const options = {
        key,
        amount:      order.amount,
        currency:    'INR',
        name:        'ServiceMate',
        description: `${plan.label} Subscription`,
        order_id:    order.id,
        prefill:     { name: user?.name, email: user?.email, contact: user?.phone },
        theme:       { color: '#1d4ed8' },
        handler: async (response) => {
          const verifyResult = await dispatch(verifyPayment({
            razorpay_order_id:   response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature:  response.razorpay_signature,
            plan:                plan.id,
          }))
          if (verifyPayment.fulfilled.match(verifyResult)) {
            toast.success(`🎉 ${plan.label} subscription activated!`)
            dispatch(fetchSubscription())
          } else {
            toast.error('Payment verification failed. Contact support.')
          }
          setPaying(false)
        },
        modal: { ondismiss: () => setPaying(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error('Something went wrong')
      setPaying(false)
    }
  }

  const isActive  = subscription?.status === 'active'
  const endDate   = subscription?.endDate ? new Date(subscription.endDate) : null
  const daysLeft  = endDate ? Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)) : 0
  const activePlan = PLANS.find(p => p.id === subscription?.plan)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 pb-12">

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-primary-700 text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'32px 32px' }}/>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring' }}
            className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Crown className="w-8 h-8 text-yellow-900"/>
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="font-display text-4xl font-bold mb-3">Provider Subscription</motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="text-blue-200 text-lg">Activate your subscription to start accepting bookings</motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Active subscription banner */}
        {isActive && (
          <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
            className="mb-8 p-5 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400"/>
              </div>
              <div>
                <p className="font-bold text-green-800 dark:text-green-300 text-lg">Subscription Active ✅</p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Plan: <strong>{activePlan?.label || subscription?.plan}</strong> · Expires: <strong>{endDate?.toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</strong>
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${daysLeft <= 7 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
            </div>
          </motion.div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id}
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.1 }}
              className={`relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg border-2 transition-all ${
                plan.badge === 'POPULAR'
                  ? 'border-primary-500 scale-105 shadow-xl shadow-primary-500/20'
                  : plan.badge === 'BEST VALUE'
                  ? 'border-orange-500'
                  : 'border-gray-100 dark:border-gray-800'
              }`}>

              {plan.badge && (
                <div className={`absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-bold tracking-widest text-white bg-gradient-to-r ${plan.color}`}>
                  {plan.badge}
                </div>
              )}

              <div className={`p-6 bg-gradient-to-br ${plan.color} text-white ${plan.badge ? 'pt-9' : ''}`}>
                <p className="text-sm font-semibold opacity-80 mb-1">{plan.label}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold font-display">₹{plan.price}</span>
                  <span className="text-sm opacity-80 mb-1">/{plan.duration}</span>
                </div>
              </div>

              <div className="p-5">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"/>
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale:0.97 }}
                  onClick={() => handleSubscribe(plan)}
                  disabled={paying || loading}
                  className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed bg-gradient-to-r ${plan.color} text-white hover:opacity-90`}>
                  {paying ? (
                    <span className="flex items-center gap-2">
                      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>
                      Processing...
                    </span>
                  ) : (
                    <>
                      {isActive && subscription?.plan === plan.id ? 'Renew Plan' : 'Subscribe Now'}
                      <ArrowRight className="w-4 h-4"/>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment security note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 pb-4">
          <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-green-500"/> Secured by Razorpay</span>
          <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-blue-500"/> 100% Safe & Encrypted</span>
          <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500"/> Instant Activation</span>
          <span className="flex items-center gap-2"><Star className="w-4 h-4 text-orange-500"/> GPay, UPI, Cards accepted</span>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 text-sm text-blue-800 dark:text-blue-300">
          <p className="font-semibold mb-1">ℹ️ How subscriptions work</p>
          <p>Your subscription allows customers to book your services. Without an active subscription, new booking requests are blocked. You can renew before expiry to avoid interruption. All payments are processed securely via Razorpay — supports UPI, Google Pay, PhonePe, debit/credit cards.</p>
        </div>
      </div>
    </div>
  )
}
