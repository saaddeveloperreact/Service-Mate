import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/button'
import { Menu, X, Wrench, LayoutDashboard, LogOut, User, Zap } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }
  const isHome = location.pathname === '/'
  const transp = isHome && !scrolled

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transp
          ? 'bg-transparent py-5'
          : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg dark:shadow-gray-900/50 py-3 border-b border-gray-100 dark:border-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div whileHover={{ rotate:15, scale:1.1 }} transition={{ type:'spring', stiffness:300 }}
            className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
            <Wrench className="text-white w-4 h-4" />
          </motion.div>
          <span className={`font-display font-bold text-xl ${transp ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            Service<span className="text-accent-500">Mate</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/providers" className={`text-sm font-medium flex items-center gap-1.5 hover:text-primary-600 transition-colors ${transp ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
            <Zap className="w-3.5 h-3.5" /> Find Services
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {!user ? (
            <div className="flex items-center gap-2">
              <Button variant={transp ? 'glass' : 'outline'} size="sm" asChild><Link to="/user/login">User Login</Link></Button>
              <Button variant="default"                       size="sm" asChild><Link to="/provider/login">Provider Login</Link></Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="dark:hover:bg-gray-800 dark:text-gray-200">
                <Link to={role === 'user' ? '/user/dashboard' : '/provider/dashboard'}>
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              </Button>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${transp ? 'bg-white/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="text-white w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-medium ${transp ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                  {user.name?.split(' ')[0]}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <motion.button whileTap={{ scale:0.9 }} onClick={() => setOpen(!open)}
            className={`p-2 rounded-xl ${transp ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link to="/providers" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium py-2">
                <Zap className="w-4 h-4 text-primary-500" /> Find Services
              </Link>
              {!user ? (
                <>
                  <Button variant="outline" className="w-full" asChild><Link to="/user/login">User Login</Link></Button>
                  <Button className="w-full"                   asChild><Link to="/provider/login">Provider Login</Link></Button>
                </>
              ) : (
                <>
                  <Link to={role === 'user' ? '/user/dashboard' : '/provider/dashboard'}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium py-2">
                    <LayoutDashboard className="w-4 h-4 text-primary-500" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-medium py-2 w-full">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
