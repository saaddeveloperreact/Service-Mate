const express    = require('express')
const cors       = require('cors')
const dotenv     = require('dotenv')
const path       = require('path')
const connectDB  = require('./config/db')
const errorHandler = require('./middleware/error')

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:5173',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth/user',            require('./routes/userAuthRoutes'))
app.use('/api/auth/provider',        require('./routes/providerAuthRoutes'))
app.use('/api/auth/forgot-password', require('./routes/forgotPasswordRoutes'))
app.use('/api/providers',            require('./routes/providerRoutes'))
app.use('/api/bookings',             require('./routes/bookingRoutes'))
app.use('/api/upload',               require('./routes/uploadRoutes'))

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'ServiceMate API running 🚀' })
)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
