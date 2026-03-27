import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.08 }}
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        isDark
          ? 'bg-primary-600 focus:ring-offset-gray-900'
          : 'bg-gray-200 focus:ring-offset-white'
      } ${className}`}
      aria-label="Toggle dark mode"
    >
      {/* Sliding circle */}
      <motion.div
        layout
        animate={{ x: isDark ? 28 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Moon className="w-3 h-3 text-primary-600" />
            </motion.div>
          ) : (
            <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sun className="w-3 h-3 text-yellow-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}
