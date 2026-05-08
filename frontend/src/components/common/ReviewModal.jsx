import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Star, Send, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addOrUpdateReview, deleteReview } from '../../store/slices/bookingSlice'
import { toast } from 'react-toastify'

export default function ReviewModal({ booking, onClose }) {
  const dispatch = useDispatch()
  const existing = booking?.review
  const [rating,  setRating]  = useState(existing?.rating  || 0)
  const [hover,   setHover]   = useState(0)
  const [comment, setComment] = useState(existing?.comment || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return toast.error('Please select a star rating')
    setLoading(true)
    const res = await dispatch(addOrUpdateReview({ id: booking._id, rating, comment }))
    setLoading(false)
    if (addOrUpdateReview.fulfilled.match(res)) {
      toast.success(existing ? 'Review updated!' : 'Review submitted!')
      onClose()
    } else {
      toast.error(res.payload || 'Failed to submit review')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete your review?')) return
    setLoading(true)
    const res = await dispatch(deleteReview(booking._id))
    setLoading(false)
    if (deleteReview.fulfilled.match(res)) {
      toast.success('Review deleted')
      onClose()
    } else {
      toast.error(res.payload || 'Failed to delete')
    }
  }

  const ratingLabels = ['','Poor','Fair','Good','Very Good','Excellent']

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ scale:0.9, y:20, opacity:0 }} animate={{ scale:1, y:0, opacity:1 }}
        exit={{ scale:0.9, opacity:0 }} transition={{ type:'spring', stiffness:300, damping:25 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {existing ? 'Edit Review' : 'Write a Review'}
            </h2>
            <p className="text-blue-200 text-sm mt-0.5">{booking?.provider?.name} · {booking?.serviceCategory}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white"/>
          </button>
        </div>

        <div className="p-6">
          {/* Star rating */}
          <div className="text-center mb-5">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">How was your experience?</p>
            <div className="flex justify-center gap-2 mb-2">
              {[1,2,3,4,5].map(star => (
                <motion.button key={star} type="button" whileHover={{ scale:1.2 }} whileTap={{ scale:0.9 }}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}>
                  <Star className={`w-9 h-9 transition-colors ${
                    star <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}/>
                </motion.button>
              ))}
            </div>
            {(hover || rating) > 0 && (
              <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
                className="text-sm font-semibold text-yellow-500">
                {ratingLabels[hover || rating]}
              </motion.p>
            )}
          </div>

          {/* Comment */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">
                Your Review <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this service provider..."
                rows={4}
                maxLength={500}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <p className="text-xs text-gray-400 text-right mt-1">{comment.length}/500</p>
            </div>

            <div className="flex gap-3">
              {existing && (
                <motion.button type="button" whileTap={{ scale:0.95 }}
                  onClick={handleDelete} disabled={loading}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-semibold transition-colors">
                  <Trash2 className="w-4 h-4"/> Delete
                </motion.button>
              )}
              <button type="button" onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading || !rating}
                className="flex-1 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors">
                <Send className="w-4 h-4"/>
                {loading ? 'Saving...' : existing ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}
