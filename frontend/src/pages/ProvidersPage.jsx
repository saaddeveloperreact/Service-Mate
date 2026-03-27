import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import ProviderCard from '../components/common/ProviderCard'
import { Button }   from '../components/ui/button'
import { Input }    from '../components/ui/input'
import { Badge }    from '../components/ui/badge'
import { Search, SlidersHorizontal, X, Zap } from 'lucide-react'
import { staggerContainer, fadeUp } from '../lib/motionVariants'

const categories = ['All','Electrician','Plumber','Carpenter','Painter','Cleaner','AC Technician','Mechanic','Mason','Gardener','Security Guard','Other']
const catEmoji   = { All:'✨', Electrician:'⚡', Plumber:'🔧', Carpenter:'🪚', Painter:'🎨', Cleaner:'🧹', 'AC Technician':'❄️', Mechanic:'🔩', Mason:'🏗️', Gardener:'🌿', 'Security Guard':'🛡️', Other:'🛠️' }

export default function ProvidersPage() {
  const [searchParams] = useSearchParams()
  const [providers, setProviders]     = useState([])
  const [loading,   setLoading]       = useState(true)
  const [total,     setTotal]         = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search:   searchParams.get('search')   || '',
    category: searchParams.get('category') || '',
    city: '', minRate: '', maxRate: '',
  })

  const fetchProviders = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.search)   params.search   = filters.search
      if (filters.category) params.category = filters.category
      if (filters.city)     params.city     = filters.city
      if (filters.minRate)  params.minRate  = filters.minRate
      if (filters.maxRate)  params.maxRate  = filters.maxRate
      const { data } = await axios.get('/api/providers', { params })
      setProviders(data.providers)
      setTotal(data.total)
    } catch { setProviders([]) }
    finally  { setLoading(false) }
  }

  useEffect(() => { fetchProviders() }, [filters.category])

  const hasFilters = filters.search || filters.category || filters.city || filters.minRate || filters.maxRate

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">

      {/* Hero */}
      <div className="relative overflow-hidden py-16 px-4 text-white"
        style={{ background:'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#2563eb 100%)' }}>
        <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:8, repeat:Infinity }}
          className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <Badge className="bg-white/10 text-white border-white/20 mb-4 gap-1.5 px-4 py-1.5">
              <Zap className="w-3.5 h-3.5" /> Find Your Expert
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Browse Professionals</h1>
            <p className="text-blue-200 mb-8 text-lg">Verified experts ready to help in your city</p>
          </motion.div>
          <motion.form initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            onSubmit={e => { e.preventDefault(); fetchProviders() }} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search by name or service..."
                value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-11 pr-4 py-4 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-xl" />
            </div>
            <Button variant="accent" className="rounded-2xl px-6 h-auto py-4 shadow-xl" type="submit">Search</Button>
          </motion.form>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 20C1200 40 960 0 720 20C480 40 240 0 0 20L0 40Z" fill="currentColor" className="text-gray-50 dark:text-gray-950" /></svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Category pills */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}
          className="flex gap-2 overflow-x-auto pb-3 mb-6">
          {categories.map(cat => {
            const active = (cat === 'All' && !filters.category) || filters.category === cat
            return (
              <motion.button key={cat} whileTap={{ scale:0.95 }}
                onClick={() => setFilters({ ...filters, category: cat === 'All' ? '' : cat })}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-primary-400 hover:shadow-sm'
                }`}>
                <span>{catEmoji[cat]}</span>{cat}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {loading
              ? <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                    className="w-3 h-3 border-2 border-primary-500 border-t-transparent rounded-full" />
                  Searching...
                </span>
              : <><strong className="text-gray-900 dark:text-white text-base">{total}</strong> professionals found</>
            }
          </p>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }}>
                <Button variant="ghost" size="sm"
                  onClick={() => setFilters({ search:'', category:'', city:'', minRate:'', maxRate:'' })}
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
                  <X className="w-3.5 h-3.5" /> Clear
                </Button>
              </motion.div>
            )}
            <Button variant="outline" size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </Button>
          </div>
        </div>

        {/* Extra filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }} className="overflow-hidden mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">City</label>
                  <Input placeholder="e.g. Mumbai" value={filters.city}
                    onChange={e => setFilters({ ...filters, city: e.target.value })} className="h-9 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Min Rate (₹/hr)</label>
                  <Input type="number" placeholder="200" value={filters.minRate}
                    onChange={e => setFilters({ ...filters, minRate: e.target.value })} className="h-9 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Max Rate (₹/hr)</label>
                  <Input type="number" placeholder="1000" value={filters.maxRate}
                    onChange={e => setFilters({ ...filters, maxRate: e.target.value })} className="h-9 text-sm" />
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchProviders} className="w-full h-9 text-sm">Apply</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i) => <div key={i} className="h-52 skeleton" />)}
          </div>
        ) : providers.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-24">
            <div className="text-7xl mb-5">🔍</div>
            <p className="text-gray-600 dark:text-gray-300 text-xl font-semibold mb-2">No professionals found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Try adjusting your search filters</p>
          </motion.div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {providers.map((p, i) => <ProviderCard key={p._id} provider={p} index={i} />)}
          </motion.div>
        )}
      </div>
    </div>
  )
}
