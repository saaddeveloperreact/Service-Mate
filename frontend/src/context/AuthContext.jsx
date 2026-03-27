import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const API = axios.create({ baseURL: '/api' })
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('sm_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [role,    setRole]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sm_token')
    const info  = localStorage.getItem('sm_user')
    const r     = localStorage.getItem('sm_role')
    if (token && info) { setUser(JSON.parse(info)); setRole(r) }
    setLoading(false)
  }, [])

  const _save = (token, data, r) => {
    localStorage.setItem('sm_token', token)
    localStorage.setItem('sm_user',  JSON.stringify(data))
    localStorage.setItem('sm_role',  r)
    setUser(data); setRole(r)
  }

  const loginUser       = async (email, password) => { const { data } = await API.post('/auth/user/login',      { email, password }); _save(data.token, data.user, 'user'); return data }
  const registerUser    = async (form)             => { const { data } = await API.post('/auth/user/register',   form);               _save(data.token, data.user, 'user'); return data }
  const loginProvider   = async (email, password) => { const { data } = await API.post('/auth/provider/login',  { email, password }); _save(data.token, data.provider, 'provider'); return data }
  const registerProvider = async (form)            => { const { data } = await API.post('/auth/provider/register', form);              _save(data.token, data.provider, 'provider'); return data }

  const logout = () => {
    ['sm_token','sm_user','sm_role'].forEach(k => localStorage.removeItem(k))
    setUser(null); setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, API, loginUser, registerUser, loginProvider, registerProvider, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
