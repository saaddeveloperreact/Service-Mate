import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Printer, X, CheckCircle, IndianRupee, Calendar, MapPin, Wrench, Download } from 'lucide-react'
import { Button } from '../ui/button'

export default function Receipt({ booking, user, provider, onClose }) {
  const printRef = useRef()

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML
    const win = window.open('', '_blank', 'width=700,height=900')
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ServiceMate Receipt - SM-${booking._id?.slice(-8).toUpperCase()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; background: white; color: #1e293b; padding: 24px; }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 22px; font-weight: bold; color: #2563eb; }
            .logo span { color: #f97316; }
            .subtitle { color: #64748b; font-size: 13px; margin-top: 4px; }
            .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: #dcfce7; color: #16a34a; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 8px; }
            .meta-box { display: flex; justify-content: space-between; background: #f8fafc; border-radius: 12px; padding: 14px 16px; margin: 16px 0; }
            .meta-label { color: #94a3b8; font-size: 11px; margin-bottom: 3px; }
            .meta-value { font-weight: 700; font-size: 13px; }
            .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
            .party-box { border-radius: 12px; padding: 12px; }
            .customer-box { background: #eff6ff; }
            .provider-box { background: #fff7ed; }
            .party-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
            .customer-box .party-label { color: #2563eb; }
            .provider-box .party-label { color: #ea580c; }
            .party-name { font-weight: 700; font-size: 14px; }
            .party-detail { color: #64748b; font-size: 12px; margin-top: 2px; }
            .section-title { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #94a3b8; margin: 16px 0 10px; }
            .detail-row { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; }
            .detail-label { color: #94a3b8; font-size: 11px; }
            .detail-value { font-weight: 600; font-size: 13px; margin-top: 1px; }
            .payment-box { background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px; padding: 16px; margin: 16px 0; }
            .payment-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #2563eb; margin-bottom: 12px; }
            .payment-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
            .payment-total { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 16px; margin-top: 8px; border-top: 1px solid #bfdbfe; padding-top: 10px; }
            .total-amount { color: #2563eb; }
            .status-box { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 10px; margin-top: 8px; }
            .status-paid { background: #f0fdf4; border: 1px solid #bbf7d0; }
            .status-pending { background: #fef2f2; border: 1px solid #fecaca; }
            .status-text-paid { color: #16a34a; font-weight: 700; }
            .status-text-pending { color: #dc2626; font-weight: 700; }
            .footer { text-align: center; margin-top: 20px; padding-top: 14px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Service<span>Mate</span></div>
            <div class="subtitle">Official Service Receipt</div>
            <div class="badge">✓ Work Completed</div>
          </div>

          <div class="meta-box">
            <div>
              <div class="meta-label">Receipt No.</div>
              <div class="meta-value">SM-${booking._id?.slice(-8).toUpperCase()}</div>
            </div>
            <div style="text-align:right">
              <div class="meta-label">Booking Date</div>
              <div class="meta-value">${new Date(booking.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
            </div>
          </div>

          <div class="parties">
            <div class="party-box customer-box">
              <div class="party-label">Customer</div>
              <div class="party-name">${user?.name || booking.user?.name || 'N/A'}</div>
              <div class="party-detail">${user?.phone || booking.user?.phone || ''}</div>
              <div class="party-detail">${user?.email || booking.user?.email || ''}</div>
            </div>
            <div class="party-box provider-box">
              <div class="party-label">Provider</div>
              <div class="party-name">${provider?.name || booking.provider?.name || 'N/A'}</div>
              <div class="party-detail">${provider?.phone || booking.provider?.phone || ''}</div>
              <div class="party-detail">${booking.serviceCategory}</div>
            </div>
          </div>

          <div class="section-title">Service Details</div>
          <div class="detail-row">
            <div>
              <div class="detail-label">Description</div>
              <div class="detail-value">${booking.description}</div>
            </div>
          </div>
          <div class="detail-row">
            <div>
              <div class="detail-label">Service Date & Time</div>
              <div class="detail-value">${new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })} at ${booking.scheduledTime}</div>
            </div>
          </div>
          ${booking.address?.city ? `
          <div class="detail-row">
            <div>
              <div class="detail-label">Service Address</div>
              <div class="detail-value">${[booking.address.street, booking.address.city, booking.address.state, booking.address.pincode].filter(Boolean).join(', ')}</div>
            </div>
          </div>` : ''}

          <div class="payment-box">
            <div class="payment-label">Payment Summary</div>
            ${booking.hoursWorked > 0 ? `
            <div class="payment-row"><span>Hours Worked</span><span>${booking.hoursWorked} hrs</span></div>
            <div class="payment-row"><span>Rate</span><span>₹${provider?.rateMin || booking.provider?.rateMin || 0}–₹${provider?.rateMax || booking.provider?.rateMax || 0}/hr</span></div>
            ` : ''}
            <div class="payment-total">
              <span>Total Amount</span>
              <span class="total-amount">₹ ${booking.totalAmount || 0}</span>
            </div>
          </div>

          <div class="status-box ${booking.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}">
            <span style="font-size:13px; font-weight:600;">Payment Status</span>
            <span class="${booking.paymentStatus === 'paid' ? 'status-text-paid' : 'status-text-pending'}">
              ${booking.paymentStatus === 'paid' ? '✅ PAID' : '⏳ PENDING'}
            </span>
          </div>

          <div class="footer">
            <div>Thank you for using ServiceMate!</div>
            <div style="margin-top:4px">support@servicemate.com · servicemate.app</div>
          </div>
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print() }, 500)
  }

  const date    = new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
  const created = new Date(booking.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.9, opacity:0, y:20 }}
        animate={{ scale:1,   opacity:1, y:0 }}
        exit={{    scale:0.9, opacity:0, y:20 }}
        transition={{ type:'spring', stiffness:300, damping:25 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md my-4 overflow-hidden"
      >
        {/* ── Top action bar ── */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-bold text-gray-900 text-base">Service Receipt</h2>
          <div className="flex items-center gap-2">
            {/* Print / Download button — always visible, solid color */}
            <Button
              size="sm"
              onClick={handlePrint}
              className="bg-primary-600 hover:bg-primary-700 text-white gap-1.5 h-9 px-4 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download / </span>Print
            </Button>
            <button onClick={onClose}
              className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors flex-shrink-0">
              <X className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* ── Receipt body (white, printable) ── */}
        <div ref={printRef} className="p-5 sm:p-6 bg-white">

          {/* Header */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Wrench className="text-white w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                Service<span className="text-accent-500">Mate</span>
              </span>
            </div>
            <p className="text-gray-500 text-xs">Official Service Receipt</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <CheckCircle className="w-3 h-3" /> Work Completed
            </div>
          </div>

          {/* Receipt ID + date */}
          <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 mb-4 flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Receipt No.</p>
              <p className="font-mono font-bold text-gray-900 text-sm">SM-{booking._id?.slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Booking Date</p>
              <p className="text-sm font-semibold text-gray-700">{created}</p>
            </div>
          </div>

          {/* Customer / Provider */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1.5">Customer</p>
              <p className="font-bold text-gray-900 text-sm">{user?.name || booking.user?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.phone || booking.user?.phone}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || booking.user?.email}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-xs text-accent-600 font-bold uppercase tracking-wide mb-1.5">Provider</p>
              <p className="font-bold text-gray-900 text-sm">{provider?.name || booking.provider?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{provider?.phone || booking.provider?.phone}</p>
              <p className="text-xs text-gray-400">{booking.serviceCategory}</p>
            </div>
          </div>

          {/* Service details */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Service Details</p>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400">Description</p>
                <p className="text-sm text-gray-800 font-medium mt-0.5">{booking.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Service Date & Time</p>
                <p className="text-sm text-gray-800 font-medium mt-0.5">{date} at {booking.scheduledTime}</p>
              </div>
              {booking.address?.city && (
                <div>
                  <p className="text-xs text-gray-400">Service Address</p>
                  <p className="text-sm text-gray-800 font-medium mt-0.5">
                    {[booking.address.street, booking.address.city, booking.address.state, booking.address.pincode].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-4 mb-4 border border-primary-100">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-3">Payment Summary</p>
            <div className="space-y-2">
              {booking.hoursWorked > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hours Worked</span>
                    <span className="font-medium text-gray-800">{booking.hoursWorked} hrs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate Range</span>
                    <span className="font-medium text-gray-800">
                      ₹{provider?.rateMin || booking.provider?.rateMin || 0}–₹{provider?.rateMax || booking.provider?.rateMax || 0}/hr
                    </span>
                  </div>
                  <div className="border-t border-primary-200 my-2" />
                </>
              )}
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-base">Total Amount</span>
                <div className="flex items-center gap-0.5">
                  <IndianRupee className="w-4 h-4 text-primary-600" />
                  <span className="text-2xl font-bold text-primary-600">{booking.totalAmount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment status */}
          <div className={`flex items-center justify-between p-3 rounded-xl border ${
            booking.paymentStatus === 'paid'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <span className="text-sm font-semibold text-gray-700">Payment Status</span>
            <span className={`flex items-center gap-1.5 text-sm font-bold ${
              booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'
            }`}>
              <CheckCircle className="w-4 h-4" />
              {booking.paymentStatus === 'paid' ? 'PAID ✅' : 'PENDING ⏳'}
            </span>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Thank you for using ServiceMate!</p>
            <p className="text-xs text-gray-300 mt-1">servicemate.app · support@servicemate.com</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
