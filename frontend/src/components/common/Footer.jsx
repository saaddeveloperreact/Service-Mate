import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrench, Mail, Phone, MapPin, Twitter, Instagram, Github } from 'lucide-react'
import { staggerContainer, fadeUp } from '../../lib/motionVariants'

export default function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <motion.div variants={fadeUp} className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Wrench className="text-white w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl text-white">Service<span className="text-accent-500">Mate</span></span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
              Connecting skilled professionals with people who need them. Fast, reliable, trusted service at your doorstep.
            </p>
            <div className="space-y-2.5">
              {[{I:Mail,t:'support@servicemate.com'},{I:Phone,t:'+91 98765 43210'},{I:MapPin,t:'Mumbai, India'}].map(({I,t},i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                  <I className="w-4 h-4 text-primary-400 flex-shrink-0" />{t}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <motion.div key={i} whileHover={{ scale:1.2, y:-2 }}
                  className="w-9 h-9 bg-white/5 hover:bg-primary-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors">
                  <Icon className="w-4 h-4" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp} custom={1}>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {[['Home','/'],[' Find Services','/providers'],['Register as User','/user/register'],['Join as Provider','/provider/register'],['Forgot Password','/forgot-password']].map(([label,to]) => (
                <li key={label}><Link to={to} className="hover:text-white transition-colors hover:translate-x-1 inline-block">{label}</Link></li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeUp} custom={2}>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3 text-sm">
              {['Electrician','Plumber','Carpenter','Painter','AC Technician','Cleaner'].map(s => (
                <li key={s}><Link to={`/providers?category=${s}`} className="hover:text-white transition-colors hover:translate-x-1 inline-block">{s}</Link></li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} ServiceMate. All rights reserved.</span>
          <span>Built with ❤️ for reliable services across India</span>
        </div>
      </div>
    </footer>
  )
}
