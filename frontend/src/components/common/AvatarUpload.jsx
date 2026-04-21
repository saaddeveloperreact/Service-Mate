import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Loader2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '../../store/slices/authSlice'
import { updateAvatar } from '../../store/slices/authSlice'
import { toast } from 'react-toastify'
import API from '../../store/services/api'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const sizes = { sm:'w-12 h-12', md:'w-20 h-20', lg:'w-28 h-28' }

export default function AvatarUpload({ size = 'md', className = '' }) {
  const dispatch = useDispatch()
  const user     = useSelector(selectUser)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileRef  = useRef()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await API.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      dispatch(updateAvatar(data.avatar))
      toast.success('Profile photo updated!')
    } catch (err) {
      setPreview(null)
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally { setLoading(false) }
  }

  const avatarSrc = preview || (user?.avatar ? `${API_BASE}${user.avatar}` : null)

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizes[size]} rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
        {avatarSrc ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover"/> : <span>{user?.name?.charAt(0)?.toUpperCase()}</span>}
        {loading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="w-5 h-5 text-white animate-spin"/></div>}
      </div>
      <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={() => fileRef.current?.click()} disabled={loading}
        className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center shadow-md transition-colors border-2 border-white dark:border-gray-900">
        <Camera className="w-3.5 h-3.5 text-white"/>
      </motion.button>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile}/>
    </div>
  )
}
