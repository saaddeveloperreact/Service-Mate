// ─────────────────────────────────────────────────────────────
//  Centralised Axios instance
//  All API calls go through this one file — no duplication
// ─────────────────────────────────────────────────────────────
import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
})

// Automatically attach JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('sm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default API
