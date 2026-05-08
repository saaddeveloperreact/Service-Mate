import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, IndianRupee, BadgeCheck, Crown, Lock, CheckCircle } from 'lucide-react'
import { fadeUp } from '../../lib/motionVariants'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const catColors = {
  Electrician:     'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  Plumber:         'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300',
  Carpenter:       'bg-amber-100  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300',
  Painter:         'bg-pink-100   dark:bg-pink-900/30   text-pink-700   dark:text-pink-300',
  Cleaner:         'bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-300',
  'AC Technician': 'bg-cyan-100   dark:bg-cyan-900/30   text-cyan-700   dark:text-cyan-300',
  Mechanic:        'bg-red-100    dark:bg-red-900/30    text-red-700    dark:text-red-300',
  Other:           'bg-gray-100   dark:bg-gray-700      text-gray-700   dark:text-gray-200',
}
const catEmoji = {
  Electrician:'⚡', Plumber:'🔧', Carpenter:'🪚', Painter:'🎨',
  Cleaner:'🧹', 'AC Technician':'❄️', Mechanic:'🔩', Other:'🛠️',
}

export default function ProviderCard({ provider, index = 0 }) {
  const avatarSrc = provider.avatar ? `${API_BASE}${provider.avatar}` : null
  const isActive  = provider.subscription?.status === 'active'
  const hasRating = provider.rating?.count > 0

  return (
    <motion.div variants={fadeUp} custom={index} initial="hidden" animate="visible"
      whileHover={{ y: isActive ? -8 : -2, transition:{ duration:0.2 } }}
      className={`relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 ${
        isActive
          ? 'border-yellow-300 dark:border-yellow-600 hover:shadow-2xl hover:shadow-yellow-200/40 dark:hover:shadow-yellow-900/30'
          : 'border-gray-100 dark:border-gray-800 opacity-70'
      }`}>

      {/* Premium gold top bar */}
      {isActive
        ? <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500"/>
        : <div className="h-1.5 bg-gray-200 dark:bg-gray-700"/>
      }

      {/* Premium glow background for active */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/40 via-transparent to-orange-50/20 dark:from-yellow-900/10 dark:via-transparent dark:to-orange-900/5 pointer-events-none"/>
      )}

      {/* Status badge — top right */}
      {isActive ? (
        <motion.div
          animate={{ scale:[1, 1.05, 1] }}
          transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}
          className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg shadow-yellow-400/30">
          <Crown className="w-3 h-3"/> Premium
        </motion.div>
      ) : (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
          <Lock className="w-3 h-3"/> Unavailable
        </div>
      )}

      <div className="p-5">
        {/* Avatar + name */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            {/* Gold ring for premium */}
            <div className={`p-0.5 rounded-2xl ${isActive ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <div className="w-13 h-13 bg-white dark:bg-gray-900 rounded-2xl p-0.5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                  {avatarSrc
                    ? <img src={avatarSrc} alt={provider.name} className="w-full h-full object-cover"/>
                    : provider.name?.charAt(0)
                  }
                </div>
              </div>
            </div>
            {/* Online dot — only for active */}
            {isActive && provider.isAvailable && (
              <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:2, repeat:Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"/>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{provider.name}</h3>
              {provider.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary-500 flex-shrink-0"/>}
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${catColors[provider.serviceCategory] || catColors.Other}`}>
              {catEmoji[provider.serviceCategory] || '🛠️'} {provider.serviceCategory}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5 mb-4">
          {provider.address?.city && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3 text-primary-400 flex-shrink-0"/>
              {provider.address.city}, {provider.address.state}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3 text-primary-400 flex-shrink-0"/>
            {provider.experience} yrs experience
          </div>
          {hasRating ? (
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400"/>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{provider.rating.average}</span>
              <span className="text-xs text-gray-400">({provider.rating.count} reviews)</span>
            </div>
          ) : (
            isActive && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Star className="w-3 h-3 text-gray-300"/>
                <span>No reviews yet</span>
              </div>
            )
          )}
        </div>

        {/* Rate */}
        <div className={`flex items-center gap-0.5 mb-4 px-3 py-2 rounded-xl ${isActive ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
          <IndianRupee className={`w-3.5 h-3.5 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}/>
          <span className={`font-bold text-base ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
            {provider.rateMin}–{provider.rateMax}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-0.5">/hr</span>
          {isActive && <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">negotiable</span>}
        </div>

        {/* Premium perks list — only for active */}
        {isActive && (
          <div className="mb-4 space-y-1.5">
            {[
              'Verified & trusted professional',
              'Booking available now',
              'Receipt & payment tracking',
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0"/>
                {perk}
              </div>
            ))}
          </div>
        )}

        {/* No subscription message */}
        {!isActive && (
          <div className="mb-4 flex items-start gap-2 p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
            <Lock className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5"/>
            <p className="text-xs text-red-600 dark:text-red-400 leading-snug">
              No active subscription — not accepting bookings right now.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <Link to={`/providers/${provider._id}`}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isActive
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-md shadow-orange-300/30 dark:shadow-orange-900/30'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500'
          }`}>
          {isActive ? <><Crown className="w-3.5 h-3.5"/> View Premium Profile</> : 'View Profile'}
        </Link>
      </div>
    </motion.div>
  )
}
