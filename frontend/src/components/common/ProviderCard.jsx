import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, BadgeCheck, IndianRupee } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const catCfg = {
  Electrician:      { color:'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', icon:'⚡' },
  Plumber:          { color:'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300',   icon:'🔧' },
  Carpenter:        { color:'bg-amber-100  dark:bg-amber-900/30  text-amber-700  dark:text-amber-300',  icon:'🪚' },
  Painter:          { color:'bg-pink-100   dark:bg-pink-900/30   text-pink-700   dark:text-pink-300',   icon:'🎨' },
  Cleaner:          { color:'bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-300',  icon:'🧹' },
  'AC Technician':  { color:'bg-cyan-100   dark:bg-cyan-900/30   text-cyan-700   dark:text-cyan-300',   icon:'❄️' },
  Mechanic:         { color:'bg-red-100    dark:bg-red-900/30    text-red-700    dark:text-red-300',    icon:'🔩' },
  Mason:            { color:'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', icon:'🏗️' },
  Gardener:         { color:'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300', icon:'🌿' },
  'Security Guard': { color:'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', icon:'🛡️' },
  Other:            { color:'bg-gray-100   dark:bg-gray-700      text-gray-700   dark:text-gray-200',   icon:'🛠️' },
}

export default function ProviderCard({ provider, index = 0 }) {
  const cfg = catCfg[provider.serviceCategory] || catCfg.Other
  const avatarSrc = provider.avatar ? `${API_BASE}${provider.avatar}` : null

  return (
    <motion.div
      initial={{ opacity:0, y:30 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.4, delay:index*0.06, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-6, scale:1.02 }}
    >
      <Card className="p-5 group overflow-hidden relative border-0 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 group-hover:from-primary-50/60 dark:group-hover:from-primary-900/20 group-hover:to-blue-50/40 transition-all duration-500 rounded-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-start gap-4">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <motion.div whileHover={{ scale:1.08 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg overflow-hidden">
                {avatarSrc
                  ? <img src={avatarSrc} alt={provider.name} className="w-full h-full object-cover" />
                  : provider.name?.charAt(0).toUpperCase()
                }
              </motion.div>
              {provider.isAvailable && (
                <motion.span animate={{ scale:[1,1.3,1] }} transition={{ duration:2, repeat:Infinity }}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">{provider.name}</h3>
                {provider.isVerified && <BadgeCheck className="text-primary-600 dark:text-primary-400 w-4 h-4 flex-shrink-0" />}
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${cfg.color}`}>
                {cfg.icon} {provider.serviceCategory}
              </span>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <strong className="text-gray-700 dark:text-gray-300">{provider.rating?.average || '0'}</strong>
                  <span>({provider.rating?.count || 0})</span>
                </span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{provider.experience} yrs</span>
              </div>
              {provider.address?.city && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{provider.address.city}, {provider.address.state}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700">
            {/* Rate range */}
            <div className="flex items-center gap-0.5">
              <IndianRupee className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                {provider.rateMin}–{provider.rateMax}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">/hr</span>
            </div>
            <Button size="sm" asChild>
              <Link to={`/providers/${provider._id}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
