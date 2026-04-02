import React from 'react'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { X, CheckCircle, IndianRupee, Smartphone, AlertCircle, CreditCard } from 'lucide-react'

export default function QRPaymentModal({ booking, provider, onClose, onPaymentDone }) {
  if (!booking) return null
  const hasQR = !!booking.qrCode

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale:0.85,y:20,opacity:0 }} animate={{ scale:1,y:0,opacity:1 }}
        exit={{ scale:0.85,y:20,opacity:0 }} transition={{ type:'spring',stiffness:300,damping:25 }}
        onClick={e=>e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-5 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <X className="w-4 h-4"/>
          </button>
          <h2 className="font-display text-xl font-bold">Payment Required</h2>
          <p className="text-blue-200 text-sm mt-1">Complete payment before work starts</p>
        </div>

        <div className="p-5">
          {/* Provider info */}
          <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-base">
              {provider?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{provider?.name}</p>
              <p className="text-xs text-gray-500">{booking.serviceCategory}</p>
            </div>
            {provider?.rateMin && (
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-0.5 justify-end">
                  <IndianRupee className="w-3 h-3 text-primary-600"/>
                  <span className="font-bold text-primary-600 text-sm">{provider.rateMin}–{provider.rateMax}</span>
                </div>
                <p className="text-xs text-gray-400">/hr</p>
              </div>
            )}
          </div>

          {/* QR code if available */}
          {hasQR ? (
            <>
              <div className="flex flex-col items-center mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Scan QR to Pay via UPI</p>
                <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-primary-100 mb-3">
                  <QRCodeSVG value={booking.qrCode} size={180} level="H" includeMargin={false} fgColor="#1d4ed8"/>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Smartphone className="w-3.5 h-3.5"/>
                  GPay · PhonePe · Paytm · Any UPI app
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl mb-5 border border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"/>
                <p className="text-xs text-amber-700">After scanning and paying, tap <strong>"I've Paid"</strong> below to confirm your payment.</p>
              </div>
            </>
          ) : (
            /* No QR — show manual payment instruction */
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl mb-5 border border-blue-200">
              <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"/>
              <div>
                <p className="font-semibold text-blue-800 text-sm mb-1">Pay the Provider Directly</p>
                <p className="text-xs text-blue-700">Pay via cash or UPI to the provider, then tap <strong>"I've Paid"</strong> to confirm and let them know.</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 h-11 rounded-2xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
              Later
            </button>
            <button onClick={onPaymentDone}
              className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/30">
              <CheckCircle className="w-4 h-4"/> I've Paid
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
