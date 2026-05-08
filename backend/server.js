const express      = require('express')
const cors         = require('cors')
const dotenv       = require('dotenv')
const path         = require('path')
const connectDB    = require('./config/db')
const errorHandler = require('./middleware/error')

dotenv.config()
connectDB()

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth/user',            require('./routes/userAuthRoutes'))
app.use('/api/auth/provider',        require('./routes/providerAuthRoutes'))
app.use('/api/auth/forgot-password', require('./routes/forgotPasswordRoutes'))
app.use('/api/providers',            require('./routes/providerRoutes'))
app.use('/api/bookings',             require('./routes/bookingRoutes'))
app.use('/api/upload',               require('./routes/uploadRoutes'))
app.use('/api/subscription',         require('./routes/subscriptionRoutes'))

app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'ServiceMate API is running 🚀', env: process.env.NODE_ENV })
)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () =>
  console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`)
)
