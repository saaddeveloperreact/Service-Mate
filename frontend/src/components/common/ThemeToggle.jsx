import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={toggleTheme}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none flex-shrink-0 ${isDark ? 'bg-primary-600' : 'bg-gray-300'} ${className}`}
      aria-label="Toggle dark mode"
    >
      <motion.div
        animate={{ x: isDark ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isDark
            ? <motion.div key="moon" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:0.15}}><Moon className="w-2.5 h-2.5 text-primary-600"/></motion.div>
            : <motion.div key="sun"  initial={{rotate:90,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:0.15}}><Sun  className="w-2.5 h-2.5 text-yellow-500"/></motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}
