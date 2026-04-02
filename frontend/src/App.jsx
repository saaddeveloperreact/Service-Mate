import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import Navbar             from './components/common/Navbar'
import Footer             from './components/common/Footer'
import HomePage           from './pages/HomePage'
import ProvidersPage      from './pages/ProvidersPage'
import ProviderDetailPage from './pages/ProviderDetailPage'
import UserLogin          from './pages/user/UserLogin'
import UserRegister       from './pages/user/UserRegister'
import UserDashboard      from './pages/user/UserDashboard'
import BookingPage        from './pages/user/BookingPage'
import ProviderLogin      from './pages/provider/ProviderLogin'
import ProviderRegister   from './pages/provider/ProviderRegister'
import ProviderDashboard  from './pages/provider/ProviderDashboard'
import ForgotPassword     from './pages/auth/ForgotPassword'

const Spinner = () => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"/>
  </div>
)

// Logged-in users cannot visit login/register — redirect to their dashboard
const GuestRoute = ({ children }) => {
  const { user, role, loading } = useAuth()
  if (loading) return <Spinner/>
  if (user) return <Navigate to={role==='provider'?'/provider/dashboard':'/user/dashboard'} replace/>
  return children
}

// Pages that need login
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth()
  if (loading) return <Spinner/>
  if (!user) return <Navigate to={allowedRole==='provider'?'/provider/login':'/user/login'} replace/>
  if (role !== allowedRole) return <Navigate to={role==='provider'?'/provider/dashboard':'/user/dashboard'} replace/>
  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar/>
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"               element={<HomePage/>}/>
          <Route path="/providers"      element={<ProvidersPage/>}/>
          <Route path="/providers/:id"  element={<ProviderDetailPage/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>

          {/* Guest only — redirect if already logged in */}
          <Route path="/user/login"        element={<GuestRoute><UserLogin/></GuestRoute>}/>
          <Route path="/user/register"     element={<GuestRoute><UserRegister/></GuestRoute>}/>
          <Route path="/provider/login"    element={<GuestRoute><ProviderLogin/></GuestRoute>}/>
          <Route path="/provider/register" element={<GuestRoute><ProviderRegister/></GuestRoute>}/>

          {/* Protected */}
          <Route path="/user/dashboard"        element={<ProtectedRoute allowedRole="user"><UserDashboard/></ProtectedRoute>}/>
          <Route path="/user/book/:providerId" element={<ProtectedRoute allowedRole="user"><BookingPage/></ProtectedRoute>}/>
          <Route path="/provider/dashboard"    element={<ProtectedRoute allowedRole="provider"><ProviderDashboard/></ProtectedRoute>}/>

          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes/>
          <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
