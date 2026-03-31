import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, ArrowRight, Shield, Clock, Star, CheckCircle,
  Zap, Wrench, Paintbrush, Wind, Scissors, Leaf, HardHat,
  ChevronRight, Users, Award, ThumbsUp, TrendingUp
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card }   from '../components/ui/card'
import { Badge }  from '../components/ui/badge'
import { fadeUp, staggerContainer, scaleIn, slideInLeft, slideInRight } from '../lib/motionVariants'

const services = [
  { Icon: Zap,        name: 'Electrician',   desc: 'Wiring, repairs & installations', gradient: 'from-yellow-400 to-orange-500' },
  { Icon: Wrench,     name: 'Plumber',       desc: 'Pipes, leaks & fittings',          gradient: 'from-blue-400 to-cyan-500'    },
  { Icon: Scissors,   name: 'Carpenter',     desc: 'Furniture, doors & woodwork',      gradient: 'from-amber-400 to-yellow-500' },
  { Icon: Paintbrush, name: 'Painter',       desc: 'Interior & exterior painting',     gradient: 'from-pink-400 to-rose-500'    },
  { Icon: Wind,       name: 'AC Technician', desc: 'AC service, repair & install',     gradient: 'from-cyan-400 to-blue-500'    },
  { Icon: Wrench,     name: 'Cleaner',       desc: 'Home & office deep cleaning',      gradient: 'from-green-400 to-emerald-500'},
  { Icon: HardHat,    name: 'Mechanic',      desc: 'Vehicle repair & maintenance',     gradient: 'from-red-400 to-rose-500'     },
  { Icon: Leaf,       name: 'Gardener',      desc: 'Lawn care & landscaping',          gradient: 'from-emerald-400 to-green-600'},
]

const stats = [
  { value: '10K+',  label: 'Happy Customers',    Icon: Users    },
  { value: '2.5K+', label: 'Verified Providers', Icon: Award    },
  { value: '4.8★',  label: 'Average Rating',     Icon: Star     },
  { value: '98%',   label: 'Satisfaction Rate',  Icon: ThumbsUp },
]

const testimonials = [
  { name: 'Priya Sharma',  role: 'Homeowner',       city: 'Mumbai',    initial: 'P', gradient: 'from-pink-400 to-rose-500',   text: 'Found an amazing electrician within minutes. Professional, on-time and affordable!', rating: 5 },
  { name: 'Rahul Gupta',   role: 'Office Manager',  city: 'Delhi',     initial: 'R', gradient: 'from-blue-400 to-indigo-500', text: 'ServiceMate helped us find a reliable AC technician for our entire office. Excellent!', rating: 5 },
  { name: 'Anita Desai',   role: 'Apartment Owner', city: 'Bangalore', initial: 'A', gradient: 'from-green-400 to-teal-500',  text: 'The plumber was professional and solved our issue fast. Will definitely use again!', rating: 5 },
]

const whyUs = [
  { Icon: Shield,      title: 'Verified Professionals', desc: 'Every provider is background-checked and skill-verified.' },
  { Icon: Clock,       title: 'On-Time Guarantee',      desc: 'Punctuality is our promise. No waiting around.' },
  { Icon: Star,        title: 'Quality Assured',        desc: 'Real reviews from real customers protect quality.' },
  { Icon: CheckCircle, title: 'Easy Booking',           desc: 'Book, track, and review — all in one place.' },
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/providers?search=${search}`)
  }

  return (
    <div className="overflow-hidden">

      {/* ═══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ x:[0,30,0], y:[0,-40,0], scale:[1,1.1,1] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
            className="absolute top-20 left-[10%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <motion.div animate={{ x:[0,-20,0], y:[0,30,0], scale:[1,0.9,1] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut', delay:2 }}
            className="absolute bottom-20 right-[10%] w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage:'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)', backgroundSize:'60px 60px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-white">
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="bg-white/15 text-white border-white/30 mb-6 px-4 py-2 text-sm gap-2">
                  <motion.span animate={{ scale:[1,1.4,1] }} transition={{ duration:1.5, repeat:Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full block" />
                  Trusted by 10,000+ customers across India
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
                Find Skilled{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-yellow-300">Pros</span>
                  <motion.svg initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:1.2, delay:0.8 }}
                    className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none">
                    <motion.path d="M2 6c40-5 80-5 120 0s60 4 76 0" stroke="#fb923c" strokeWidth="3" strokeLinecap="round"
                      initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:1, delay:1 }} />
                  </motion.svg>
                </span>{' '}
                <br />Near You
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="text-lg text-blue-100 mb-8 max-w-md leading-relaxed font-medium">
                From electricians to plumbers — book trusted professionals in minutes. Quality guaranteed, always on time.
              </motion.p>

              <motion.form variants={fadeUp} custom={3} onSubmit={handleSearch} className="flex gap-2 max-w-lg mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" placeholder="Search electrician, plumber..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 shadow-xl" />
                </div>
                <Button variant="accent" className="rounded-2xl px-6 py-4 h-auto shadow-xl" type="submit">
                  Search <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.form>

              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-3">
                <Button variant="accent" size="lg" asChild className="shadow-xl shadow-accent-500/30">
                  <Link to="/user/register">Get Started <ArrowRight className="w-4 h-4" /></Link>
                </Button>
                <Button variant="glass" size="lg" asChild>
                  <Link to="/provider/register">Join as Provider</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right — floating cards */}
            <motion.div variants={slideInRight} initial="hidden" animate="visible" className="hidden lg:block relative h-[520px]">
              <motion.div animate={{ y:[-6,6,-6] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute top-0 right-0 w-72 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-md">⚡</div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Rajesh Kumar</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Expert Electrician · 8 yrs</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                  <span className="ml-1 font-semibold">4.9</span>
                  <span className="text-gray-400">(128)</span>
                </div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">✓ Available</span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">₹300–₹500/hr</span>
                </div>
                <Button className="w-full" size="sm" asChild><Link to="/user/register">Book Now</Link></Button>
              </motion.div>

              <motion.div animate={{ y:[6,-6,6] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute top-56 left-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 w-52">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Today's Bookings</p>
                </div>
                <p className="font-display text-3xl font-bold text-primary-600 dark:text-primary-400">247</p>
                <p className="text-xs text-green-500 mt-1 font-medium">↑ 12% from yesterday</p>
              </motion.div>

              <motion.div animate={{ y:[-4,4,-4] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut', delay:0.5 }}
                className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 w-64">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold">P</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">Priya Sharma</p>
                    <div className="flex gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />)}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 italic">"Super professional and fast! Highly recommend."</p>
              </motion.div>

              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:1, type:'spring' }}
                className="absolute top-6 left-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-semibold">100% Verified</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="currentColor" className="text-gray-50 dark:text-gray-950" />
          </svg>
        </div>
      </section>

      {/* ═══ STATS ══════════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-gray-900 py-14 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, Icon }, i) => (
              <motion.div key={i} variants={scaleIn} custom={i} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <p className="font-display text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ SERVICES ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Services We Provide</motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">Verified experts for every home and office need.</motion.p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map(({ Icon, name, desc, gradient }, i) => (
              <motion.div key={i} variants={scaleIn} custom={i} whileHover={{ y:-6, scale:1.02 }} transition={{ type:'spring', stiffness:300 }}>
                <Link to={`/providers?category=${name}`}>
                  <Card className="p-5 text-center group cursor-pointer border-0 shadow-sm hover:shadow-lg">
                    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="text-center mt-10">
            <Button size="lg" asChild><Link to="/providers">View All Services <ArrowRight className="w-4 h-4" /></Link></Button>
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">How It Works</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />
            {[
              { step:'01', emoji:'🔍', title:'Search & Browse',  desc:'Find verified professionals in your city by service category.' },
              { step:'02', emoji:'📅', title:'Book Appointment', desc:'Choose your expert, pick date & time, submit your request.'     },
              { step:'03', emoji:'✅', title:'Get it Done',      desc:'Professional arrives, completes the work. Pay via QR code.'    },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once:true }} className="text-center relative">
                <motion.div whileHover={{ scale:1.1, rotate:5 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/30 dark:to-blue-900/30 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-sm relative z-10 border border-primary-100 dark:border-primary-800">
                  {item.emoji}
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">{item.step}</span>
                </motion.div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-900 to-primary-800 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize:'40px 40px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once:true }}>
              <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-4">Why ServiceMate</p>
              <h2 className="font-display text-4xl font-bold mb-10 leading-tight">Why 10,000+<br />Customers Trust Us</h2>
              <div className="space-y-6">
                {whyUs.map(({ Icon, title, desc }, i) => (
                  <motion.div key={i} initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} transition={{ delay:i*0.1 }} viewport={{ once:true }}
                    className="flex items-start gap-4">
                    <motion.div whileHover={{ scale:1.1, rotate:5 }}
                      className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10">
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-white">{title}</h4>
                      <p className="text-blue-200 text-sm mt-1">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once:true }} className="grid grid-cols-2 gap-4">
              {[
                { emoji:'🏆', value:'#1',      label:'Service Platform' },
                { emoji:'⭐', value:'4.8/5',   label:'Customer Rating'  },
                { emoji:'🔒', value:'100%',    label:'Secure Payments'  },
                { emoji:'🚀', value:'< 2 min', label:'Avg Booking Time' },
              ].map((card, i) => (
                <motion.div key={i} whileHover={{ scale:1.05, y:-4 }} transition={{ type:'spring', stiffness:300 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="text-4xl mb-3">{card.emoji}</div>
                  <div className="font-display text-2xl font-bold">{card.value}</div>
                  <div className="text-blue-300 text-xs mt-1">{card.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }} className="text-center mb-14">
            <motion.p variants={fadeUp} className="text-primary-600 dark:text-primary-400 font-semibold text-sm uppercase tracking-widest mb-3">Real Reviews</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">What Our Customers Say</motion.h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once:true }} whileHover={{ y:-6 }} transition={{ type:'spring', stiffness:300 }}>
                <Card className="p-6 h-full border-0 shadow-sm hover:shadow-lg">
                  <div className="flex gap-0.5 mb-4">{[...Array(t.rating)].map((_,j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${t.gradient} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>{t.initial}</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{t.role} · {t.city}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}
          className="max-w-3xl mx-auto px-4 text-center">
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-gray-500 dark:text-gray-400 mb-10 text-lg">Join thousands of satisfied customers today.</motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-4">
            <Button size="xl" asChild className="shadow-xl shadow-primary-500/25">
              <Link to="/user/register">Find a Professional <ArrowRight className="w-5 h-5" /></Link>
            </Button>
            <Button size="xl" variant="outline" asChild className="dark:border-gray-600 dark:text-gray-200">
              <Link to="/provider/register">Offer Your Services <ChevronRight className="w-5 h-5" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
