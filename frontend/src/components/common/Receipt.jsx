import React from 'react'
import { motion } from 'framer-motion'
import { X, CheckCircle, IndianRupee, Calendar, MapPin, Wrench } from 'lucide-react'

export default function Receipt({ booking, user, provider, onClose }) {

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=680,height=900')
    const created = new Date(booking.createdAt).toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' })
    const svcDate = new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' })
    const address = booking.address
      ? [booking.address.street,booking.address.city,booking.address.state,booking.address.pincode].filter(Boolean).join(', ')
      : ''

    win.document.write(`<!DOCTYPE html><html><head><title>ServiceMate Receipt</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Arial,sans-serif;background:#fff;color:#1e293b;padding:32px;max-width:600px;margin:0 auto}
.logo{text-align:center;margin-bottom:20px}
.logo-text{font-size:24px;font-weight:800;color:#2563eb}
.logo-text span{color:#f97316}
.subtitle{color:#64748b;font-size:13px;margin-top:4px}
.work-done{display:inline-flex;align-items:center;gap:6px;background:#dcfce7;color:#16a34a;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:700;margin-top:10px}
.divider{border:none;border-top:1px solid #e2e8f0;margin:18px 0}
.meta{display:flex;justify-content:space-between;background:#f8fafc;border-radius:10px;padding:14px 16px;margin-bottom:18px}
.meta-label{font-size:11px;color:#94a3b8;margin-bottom:3px}
.meta-value{font-weight:700;font-size:14px;color:#1e293b}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
.party{border-radius:10px;padding:14px}
.customer{background:#eff6ff}
.provdr{background:#fff7ed}
.party-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px}
.customer .party-label{color:#2563eb}
.provdr .party-label{color:#ea580c}
.party-name{font-weight:700;font-size:15px;color:#1e293b;margin-bottom:3px}
.party-info{color:#64748b;font-size:12px;line-height:1.6}
.section-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;margin-bottom:12px}
.detail-item{margin-bottom:10px}
.detail-key{font-size:11px;color:#94a3b8;margin-bottom:2px}
.detail-val{font-size:14px;font-weight:600;color:#1e293b}
.payment-box{background:linear-gradient(135deg,#eff6ff,#dbeafe);border-radius:10px;padding:16px;margin:18px 0}
.pay-label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#2563eb;margin-bottom:12px}
.pay-row{display:flex;justify-content:space-between;font-size:13px;color:#475569;margin-bottom:6px}
.pay-total{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #bfdbfe;padding-top:10px;margin-top:8px}
.pay-total-label{font-size:15px;font-weight:800;color:#1e293b}
.pay-total-value{font-size:24px;font-weight:900;color:#2563eb}
.status-box{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-radius:10px;margin-top:6px}
.paid{background:#f0fdf4;border:1px solid #bbf7d0}
.pending{background:#fef2f2;border:1px solid #fecaca}
.status-label{font-size:14px;font-weight:600;color:#1e293b}
.status-val-paid{color:#16a34a;font-weight:800;font-size:15px}
.status-val-pending{color:#dc2626;font-weight:800;font-size:15px}
.footer{text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;line-height:1.8}
</style></head><body>
<div class="logo">
  <div class="logo-text">Service<span>Mate</span></div>
  <div class="subtitle">Official Service Receipt</div>
  <div class="work-done">✓ Work Completed</div>
</div>
<hr class="divider"/>
<div class="meta">
  <div><div class="meta-label">Receipt No.</div><div class="meta-value">SM-${(booking._id||'').slice(-8).toUpperCase()}</div></div>
  <div style="text-align:right"><div class="meta-label">Booking Date</div><div class="meta-value">${created}</div></div>
</div>
<div class="parties">
  <div class="party customer">
    <div class="party-label">Customer</div>
    <div class="party-name">${user?.name||booking.user?.name||'N/A'}</div>
    <div class="party-info">${user?.phone||booking.user?.phone||''}<br/>${user?.email||booking.user?.email||''}</div>
  </div>
  <div class="party provdr">
    <div class="party-label">Provider</div>
    <div class="party-name">${provider?.name||booking.provider?.name||'N/A'}</div>
    <div class="party-info">${provider?.phone||booking.provider?.phone||''}<br/>${booking.serviceCategory}</div>
  </div>
</div>
<div class="section-label">Service Details</div>
<div class="detail-item"><div class="detail-key">Description</div><div class="detail-val">${booking.description}</div></div>
<div class="detail-item"><div class="detail-key">Service Date &amp; Time</div><div class="detail-val">${svcDate} at ${booking.scheduledTime}</div></div>
${address?`<div class="detail-item"><div class="detail-key">Service Address</div><div class="detail-val">${address}</div></div>`:''}
<div class="payment-box">
  <div class="pay-label">Payment Summary</div>
  ${booking.hoursWorked>0?`<div class="pay-row"><span>Hours Worked</span><span>${booking.hoursWorked} hrs</span></div>`:''}
  ${booking.hoursWorked>0?`<div class="pay-row"><span>Rate</span><span>₹${provider?.rateMin||0}–₹${provider?.rateMax||0}/hr</span></div>`:''}
  <div class="pay-total">
    <span class="pay-total-label">Total Amount</span>
    <span class="pay-total-value">₹ ${booking.totalAmount||0}</span>
  </div>
</div>
<div class="status-box ${booking.paymentStatus==='paid'?'paid':'pending'}">
  <span class="status-label">Payment Status</span>
  <span class="${booking.paymentStatus==='paid'?'status-val-paid':'status-val-pending'}">${booking.paymentStatus==='paid'?'✅ PAID':'⏳ PENDING'}</span>
</div>
<div class="footer">Thank you for using ServiceMate!<br/>support@servicemate.com · servicemate.app</div>
</body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 600)
  }

  const svcDate = new Date(booking.scheduledDate).toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' })
  const created = new Date(booking.createdAt).toLocaleDateString('en-IN', { day:'numeric',month:'long',year:'numeric' })

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}>
      <motion.div initial={{ scale:0.9,y:20,opacity:0 }} animate={{ scale:1,y:0,opacity:1 }}
        exit={{ scale:0.9,y:20,opacity:0 }} transition={{ type:'spring',stiffness:300,damping:25 }}
        onClick={e=>e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md my-4 overflow-hidden">

        {/* Top bar — always visible solid bg */}
        <div className="flex items-center justify-between px-5 py-4 bg-primary-600">
          <h2 className="font-bold text-white text-base">Service Receipt</h2>
          <div className="flex items-center gap-2">
            {/* Download/Print — always white text on blue */}
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 bg-white text-primary-600 hover:bg-gray-100 font-semibold text-sm px-4 h-9 rounded-xl transition-colors shadow">
              🖨️ Download / Print
            </button>
            <button onClick={onClose}
              className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white"/>
            </button>
          </div>
        </div>

        {/* Receipt body — always white */}
        <div className="p-5 sm:p-6 bg-white">

          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Wrench className="text-white w-4 h-4"/>
              </div>
              <span className="font-display font-bold text-xl text-gray-900">Service<span className="text-accent-500">Mate</span></span>
            </div>
            <p className="text-gray-500 text-xs">Official Service Receipt</p>
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <CheckCircle className="w-3 h-3"/> Work Completed
            </span>
          </div>

          {/* Receipt No + Date */}
          <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 mb-4 flex justify-between items-start">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Receipt No.</p>
              <p className="font-mono font-bold text-gray-900 text-sm">SM-{(booking._id||'').slice(-8).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Booking Date</p>
              <p className="text-sm font-semibold text-gray-700">{created}</p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1.5">Customer</p>
              <p className="font-bold text-gray-900 text-sm">{user?.name||booking.user?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.phone||booking.user?.phone}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email||booking.user?.email}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-xs text-accent-600 font-bold uppercase tracking-wide mb-1.5">Provider</p>
              <p className="font-bold text-gray-900 text-sm">{provider?.name||booking.provider?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{provider?.phone||booking.provider?.phone}</p>
              <p className="text-xs text-gray-400">{booking.serviceCategory}</p>
            </div>
          </div>

          {/* Service details */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Service Details</p>
            </div>
            <div className="p-4 space-y-3">
              <div><p className="text-xs text-gray-400">Description</p><p className="text-sm text-gray-800 font-medium mt-0.5">{booking.description}</p></div>
              <div><p className="text-xs text-gray-400">Service Date & Time</p><p className="text-sm text-gray-800 font-medium mt-0.5">{svcDate} at {booking.scheduledTime}</p></div>
              {booking.address?.city && (
                <div><p className="text-xs text-gray-400">Service Address</p>
                <p className="text-sm text-gray-800 font-medium mt-0.5">
                  {[booking.address.street,booking.address.city,booking.address.state,booking.address.pincode].filter(Boolean).join(', ')}
                </p></div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-4 mb-4 border border-primary-100">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-wide mb-3">Payment Summary</p>
            {booking.hoursWorked > 0 && (
              <>
                <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-600">Hours Worked</span><span className="font-medium">{booking.hoursWorked} hrs</span></div>
                <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-600">Rate Range</span><span className="font-medium">₹{provider?.rateMin||0}–₹{provider?.rateMax||0}/hr</span></div>
                <div className="border-t border-primary-200 my-2"/>
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-base">Total Amount</span>
              <div className="flex items-center gap-0.5">
                <IndianRupee className="w-4 h-4 text-primary-600"/>
                <span className="text-2xl font-bold text-primary-600">{booking.totalAmount||0}</span>
              </div>
            </div>
          </div>

          {/* Payment status */}
          <div className={`flex items-center justify-between p-3 rounded-xl border ${booking.paymentStatus==='paid'?'bg-green-50 border-green-200':'bg-red-50 border-red-200'}`}>
            <span className="text-sm font-semibold text-gray-700">Payment Status</span>
            <span className={`flex items-center gap-1.5 text-sm font-bold ${booking.paymentStatus==='paid'?'text-green-600':'text-red-500'}`}>
              <CheckCircle className="w-4 h-4"/>
              {booking.paymentStatus==='paid'?'PAID ✅':'PENDING ⏳'}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Thank you for using ServiceMate!</p>
            <p className="text-xs text-gray-300 mt-1">support@servicemate.com · servicemate.app</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
