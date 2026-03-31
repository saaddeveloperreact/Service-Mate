import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { X, CheckCircle, IndianRupee, Smartphone, AlertCircle, CreditCard } from 'lucide-react'
import { Button } from '../ui/button'

export default function QRPaymentModal({ booking, provider, onClose, onPaymentDone }) {
  if (!booking) return null

  const hasQR = !!booking.qrCode

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        exit={{ opacity:0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale:0.85, opacity:0, y:20 }}
          animate={{ scale:1,    opacity:1, y:0  }}
          exit={{    scale:0.85, opacity:0, y:20 }}
          transition={{ type:'spring', stiffness:300, damping:25 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-5 text-white relative">
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <h2 className="font-display text-xl font-bold">Payment Required</h2>
            <p className="text-blue-200 text-sm mt-1">Complete payment before work starts</p>
          </div>

          <div className="p-6">
            {/* Provider info */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                {provider?.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{provider?.name}</p>
                <p className="text-xs text-gray-500">{booking.serviceCategory}</p>
              </div>
              {provider?.rateMin && (
                <div className="text-right">
                  <div className="flex items-center gap-0.5 justify-end">
                    <IndianRupee className="w-3 h-3 text-primary-600" />
                    <span className="font-bold text-primary-600 text-sm">{provider.rateMin}–{provider.rateMax}</span>
                  </div>
                  <p className="text-xs text-gray-400">/hr</p>
                </div>
              )}
            </div>

            {/* QR or manual */}
            {hasQR ? (
              <>
                <div className="flex flex-col items-center mb-5">
                  <div className="p-4 bg-white rounded-2xl shadow-md border-2 border-primary-100 mb-3">
                    <QRCodeSVG
                      value={booking.qrCode}
                      size={180}
                      level="H"
                      includeMargin={false}
                      fgColor="#1d4ed8"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Smartphone className="w-3.5 h-3.5" />
                    Scan with GPay, PhonePe, Paytm, or any UPI app
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl mb-5 border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    After paying, tap <strong>"I've Paid"</strong> below to confirm and notify the provider.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-xl mb-5 border border-blue-200">
                <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Pay the provider directly in cash or via UPI, then tap <strong>"I've Paid"</strong> to confirm.
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-gray-300" onClick={onClose}>
                Later
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 shadow-lg" onClick={onPaymentDone}>
                <CheckCircle className="w-4 h-4" /> I've Paid
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
