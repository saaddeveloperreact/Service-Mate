import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProviders, setFilters, resetFilters,
  selectProviders, selectTotal, selectPLoading, selectProvFilters
} from '../store/slices/providerSlice'
import ProviderCard from '../components/common/ProviderCard'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Search, SlidersHorizontal, X, Zap } from 'lucide-react'
import { staggerContainer } from '../lib/motionVariants'

const categories = ['All','Electrician','Plumber','Carpenter','Painter','Cleaner','AC Technician','Mechanic','Mason','Gardener','Security Guard','Other']
const catEmoji   = { All:'✨',Electrician:'⚡',Plumber:'🔧',Carpenter:'🪚',Painter:'🎨',Cleaner:'🧹','AC Technician':'❄️',Mechanic:'🔩',Mason:'🏗️',Gardener:'🌿','Security Guard':'🛡️',Other:'🛠️' }

export default function ProvidersPage() {
  const dispatch      = useDispatch()
  const [searchParams] = useSearchParams()
  const providers     = useSelector(selectProviders)
  const total         = useSelector(selectTotal)
  const loading       = useSelector(selectPLoading)
  const filters       = useSelector(selectProvFilters)
  const [showFilters, setShowFilters] = useState(false)

  // Initialise from URL params on mount
  useEffect(() => {
    const s = searchParams.get('search') || ''
    const c = searchParams.get('category') || ''
    if (s || c) dispatch(setFilters({ search: s, category: c }))
    else dispatch(fetchProviders(filters))
  }, [])

  useEffect(() => { dispatch(fetchProviders(filters)) }, [filters.category])

  const applyFilters = () => dispatch(fetchProviders(filters))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-14 px-4 text-white"
        style={{background:'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 60%,#2563eb 100%)'}}>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="bg-white/10 text-white border-white/20 mb-4 gap-1.5 px-4 py-1.5"><Zap className="w-3.5 h-3.5"/> Find Your Expert</Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-bold mb-3">Browse Professionals</h1>
          <p className="text-blue-200 mb-7">Verified experts ready to help in your city</p>
          <form onSubmit={e=>{e.preventDefault();applyFilters()}} className="flex gap-2 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
              <input type="text" placeholder="Search by name or service..."
                value={filters.search}
                onChange={e=>dispatch(setFilters({search:e.target.value}))}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-xl"/>
            </div>
            <button type="submit" className="bg-accent-500 hover:bg-accent-600 text-white px-5 rounded-2xl font-semibold text-sm transition-colors shadow-xl">Search</button>
          </form>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40L1440 40L1440 20C1200 40 960 0 720 20C480 40 240 0 0 20L0 40Z" fill="currentColor" className="text-gray-50 dark:text-gray-950"/></svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5" style={{scrollbarWidth:'none'}}>
          {categories.map(cat=>{
            const active=(cat==='All'&&!filters.category)||filters.category===cat
            return(
              <button key={cat} onClick={()=>dispatch(setFilters({category:cat==='All'?'':cat}))}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all ${active?'bg-primary-600 text-white shadow-md':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-primary-400'}`}>
                {catEmoji[cat]} {cat}
              </button>
            )
          })}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {loading?'Searching...':<><strong className="text-gray-900 dark:text-white">{total}</strong> professionals found</>}
          </p>
          <div className="flex items-center gap-2">
            {(filters.search||filters.category||filters.city||filters.minRate||filters.maxRate)&&(
              <button onClick={()=>{dispatch(resetFilters());dispatch(fetchProviders({}))}}
                className="flex items-center gap-1 h-9 px-3 rounded-xl text-xs font-semibold text-red-500 border border-red-200 dark:border-red-800 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                <X className="w-3.5 h-3.5"/> Clear
              </button>
            )}
            <button onClick={()=>setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold transition-colors shadow-sm ${showFilters?'bg-primary-600 text-white':'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-500'}`}>
              <SlidersHorizontal className="w-3.5 h-3.5"/> Filters
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters&&(
            <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden mb-5">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div><label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">City</label>
                  <Input placeholder="e.g. Mumbai" value={filters.city} onChange={e=>dispatch(setFilters({city:e.target.value}))} className="h-9 text-sm"/></div>
                <div><label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Min Rate (₹/hr)</label>
                  <Input type="number" placeholder="200" value={filters.minRate} onChange={e=>dispatch(setFilters({minRate:e.target.value}))} className="h-9 text-sm"/></div>
                <div><label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Max Rate (₹/hr)</label>
                  <Input type="number" placeholder="1000" value={filters.maxRate} onChange={e=>dispatch(setFilters({maxRate:e.target.value}))} className="h-9 text-sm"/></div>
                <div className="flex items-end"><button onClick={applyFilters} className="w-full h-9 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold">Apply</button></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {loading?(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{[...Array(8)].map((_,i)=><div key={i} className="h-52 skeleton"/>)}</div>
        ):providers.length===0?(
          <div className="text-center py-20"><div className="text-7xl mb-5">🔍</div><p className="text-gray-600 dark:text-gray-300 text-xl font-semibold mb-2">No professionals found</p></div>
        ):(
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {providers.map((p,i)=><ProviderCard key={p._id} provider={p} index={i}/>)}
          </motion.div>
        )}
      </div>
    </div>
  )
}
