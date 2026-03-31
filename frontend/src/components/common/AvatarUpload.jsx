import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function AvatarUpload({ size = 'md', className = '' }) {
  const { user, API, role } = useAuth()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const sizes = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-28 h-28 text-4xl',
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview immediately
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)

    // Upload
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await API.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      // Update localStorage so avatar persists on reload
      const saved = JSON.parse(localStorage.getItem('sm_user') || '{}')
      saved.avatar = data.avatar
      localStorage.setItem('sm_user', JSON.stringify(saved))
      toast.success('Profile photo updated!')
    } catch (err) {
      setPreview(null)
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const avatarSrc = preview
    || (user?.avatar ? `${API_BASE}${user.avatar}` : null)

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizes[size]} rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow-lg`}>
        {avatarSrc ? (
          <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
        )}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Camera button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => fileRef.current?.click()}
        disabled={loading}
        className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center shadow-md transition-colors border-2 border-white dark:border-gray-900"
      >
        <Camera className="w-3.5 h-3.5 text-white" />
      </motion.button>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
