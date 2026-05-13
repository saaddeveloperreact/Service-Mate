import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import { staggerContainer, fadeUp } from "../../lib/motionVariants";

export default function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Wrench className="text-white w-4 h-4" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Service<span className="text-accent-500">Mate</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
              Connecting skilled professionals with people who need them. Fast,
              reliable, trusted service at your doorstep.
            </p>
            <div className="space-y-2.5 text-sm text-gray-500 mb-5">
              {[
                {
                  I: Mail,
                  t: "mohdsaad251203@gmail.com",
                  href: "mailto:mohdsaad251203@gmail.com",
                },
                { I: Phone, t: "+91 8904339551", href: "tel:+918904339551" },
                { I: MapPin, t: "Mysore, Karnataka, India", href: null },
              ].map(({ I, t, href }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <I className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  {href ? (
                    <a
                      href={href}
                      className="hover:text-accent-400 transition-colors"
                    >
                      {t}
                    </a>
                  ) : (
                    <span>{t}</span>
                  )}
                </div>
              ))}
            </div>
            {/* Developer credit */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
              <p className="text-white font-semibold mb-0.5">
                👨‍💻 Developed by Mohammed Saad
              </p>
              <p className="text-gray-500">
                Information Science Engineering · MYCEM Mysore · 2026
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              {[
                {
                  Icon: Github,
                  href: "https://github.com/saaddeveloperreact",
                  label: "GitHub",
                },
                {
                  Icon: Linkedin,
                  href: "https://linkedin.com/in/mohammed-saad-a761b0225",
                  label: "LinkedIn",
                },
                { Icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ Icon, href, label }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-9 h-9 bg-white/5 hover:bg-primary-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp} custom={1}>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                ["🏠 Home", "/"],
                ["🔍 Find Services", "/providers"],
                ["📝 Register as User", "/user/register"],
                ["🛠️ Join as Provider", "/provider/register"],
                ["🔑 Forgot Password", "/forgot-password"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={fadeUp} custom={2}>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                "⚡ Electrician",
                "🔧 Plumber",
                "🪚 Carpenter",
                "🎨 Painter",
                "❄️ AC Technician",
                "🧹 Cleaner",
              ].map((s) => (
                <li key={s}>
                  <Link
                    to={`/providers?category=${s.split(" ")[1]}`}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>
            © {new Date().getFullYear()} ServiceMate. All rights reserved.
          </span>
          <span>
            Built with ❤️ by{" "}
            <a
              href="mailto:mohdsaad251203@gmail.com"
              className="text-primary-400 hover:text-primary-300"
            >
              Mohammed Saad
            </a>{" "}
            · MCEM Mysore
          </span>
        </div>
      </div>
    </footer>
  );
}
