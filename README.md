# 🛠️ ServiceMate — Trusted Home Services Platform

A full-stack MERN web application that connects customers with trusted service professionals like electricians, plumbers, carpenters, painters, and more — with QR code payments, service receipts, profile photos, and dark/light mode.

![ServiceMate](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### For Customers (Users)
- 🔍 Browse and search verified service professionals
- 📅 Book appointments with preferred date and time
- 📋 Track booking status in real-time (pending → accepted → in-progress → completed)
- 💳 Pay via **QR code (UPI)** when provider accepts booking
- 🧾 Download/print **service receipt** after work is completed
- 📸 Upload and update **profile photo**
- 🔑 **OTP-based forgot password** via email
- ❌ Cancel pending bookings
- ⭐ View provider profiles, ratings and reviews

### For Service Providers
- 📥 Receive and manage booking requests
- ✅ Accept or reject bookings
- 🔄 Update booking status (Accept → Start Work → Complete)
- 💰 Set **hourly rate range** (min–max) instead of fixed price
- 🧾 Generate **service receipt** for completed jobs
- 📸 Upload and update **profile photo**
- 📊 Dashboard with earnings (paid bookings only)

### General
- 🌙 **Dark / Light mode** toggle with smooth animation
- 📱 **Fully mobile responsive** (Android & iOS optimised)
- 🔐 Dual JWT authentication (User & Provider)
- 🎨 Beautiful UI with Framer Motion animations
- 🔒 Bcrypt password hashing, secure OTP system

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework & build tool |
| Tailwind CSS | Styling with dark mode support |
| Framer Motion | Animations & transitions |
| Lucide React | Icon library |
| Shadcn/ui (Radix UI) | Accessible UI components |
| qrcode.react | QR code generation for payments |
| react-to-print | Receipt printing |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP requests with interceptors |
| React Toastify | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| Bcryptjs | Password & OTP hashing |
| Nodemailer | OTP email sending via Gmail |
| Multer | Profile photo uploads |
| CORS | Cross-origin request handling |

---

## 📁 Folder Structure

```
servicemate-final/
│
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── userAuthController.js
│   │   ├── providerAuthController.js
│   │   ├── providerController.js
│   │   ├── bookingController.js
│   │   ├── forgotPasswordController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Provider.js      ← rateMin & rateMax fields
│   │   ├── Booking.js       ← qrCode & receiptGenerated fields
│   │   ├── Review.js
│   │   └── OTP.js           ← auto-expires in 10 minutes
│   ├── routes/
│   │   ├── userAuthRoutes.js
│   │   ├── providerAuthRoutes.js
│   │   ├── providerRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── forgotPasswordRoutes.js
│   │   └── uploadRoutes.js
│   ├── uploads/avatars/     ← profile photos (git-ignored)
│   ├── utils/
│   │   ├── sendEmail.js
│   │   ├── otpTemplate.js
│   │   └── testEmail.js
│   ├── .env                 ← git-ignored, create manually
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── ProviderCard.jsx
    │   │   │   ├── StatusBadge.jsx
    │   │   │   ├── ThemeToggle.jsx
    │   │   │   ├── AvatarUpload.jsx    ← profile photo upload
    │   │   │   ├── QRPaymentModal.jsx  ← UPI QR code payment
    │   │   │   └── Receipt.jsx         ← printable receipt
    │   │   └── ui/
    │   │       ├── button.jsx
    │   │       ├── card.jsx
    │   │       ├── badge.jsx
    │   │       ├── input.jsx
    │   │       ├── label.jsx
    │   │       ├── separator.jsx
    │   │       └── tabs.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── lib/
    │   │   ├── utils.js
    │   │   └── motionVariants.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProvidersPage.jsx
    │   │   ├── ProviderDetailPage.jsx
    │   │   ├── auth/ForgotPassword.jsx
    │   │   ├── user/
    │   │   │   ├── UserLogin.jsx
    │   │   │   ├── UserRegister.jsx
    │   │   │   ├── UserDashboard.jsx
    │   │   │   └── BookingPage.jsx
    │   │   └── provider/
    │   │       ├── ProviderLogin.jsx
    │   │       ├── ProviderRegister.jsx
    │   │       └── ProviderDashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .gitignore
    └── package.json
```

---

## 🗄️ MongoDB Collections

| Collection | Description | Key New Fields |
|---|---|---|
| `users` | Customer accounts | avatar (profile photo URL) |
| `providers` | Service professionals | `rateMin`, `rateMax` (rate range), avatar |
| `bookings` | Service appointments | `qrCode` (UPI string), `receiptGenerated`, `paymentStatus` |
| `reviews` | Ratings & comments | — |
| `otps` | OTP codes for password reset | Auto-expires after 10 minutes |

### ⚠️ MongoDB Changes Required
If you have an **existing database** from a previous version, you need to:
1. The `providers` collection now uses `rateMin` and `rateMax` instead of `hourlyRate`
2. Re-register providers to populate these new fields
3. The `bookings` collection has two new fields `qrCode` and `receiptGenerated` — existing bookings will just have empty values which is fine

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Compass](https://www.mongodb.com/products/compass) or MongoDB Atlas
- Gmail account with App Password (for OTP emails)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/servicemate.git
cd servicemate
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/servicemate
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=ServiceMate <your_gmail@gmail.com>

FRONTEND_URL=http://localhost:5173
UPI_ID=your_upi_id@upi
```

Test your Gmail config:
```bash
node utils/testEmail.js
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open Browser
```
http://localhost:5173
```

---

## ⚙️ Gmail App Password Setup (for OTP)

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Turn ON **2-Step Verification**
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select App: **Mail** → Device: **Other** → Name it `ServiceMate`
5. Copy the 16-character password (no spaces) → paste into `EMAIL_PASS`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/user/register` | Register user |
| POST | `/api/auth/user/login` | Login user |
| POST | `/api/auth/provider/register` | Register provider |
| POST | `/api/auth/provider/login` | Login provider |
| POST | `/api/auth/forgot-password/send-otp` | Send OTP email |
| POST | `/api/auth/forgot-password/verify-otp` | Verify OTP |
| POST | `/api/auth/forgot-password/reset-password` | Reset password |

### Providers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/providers` | List providers (with filters) |
| GET | `/api/providers/:id` | Get provider profile |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my` | User's bookings |
| GET | `/api/bookings/provider` | Provider's bookings |
| PUT | `/api/bookings/:id/status` | Update status (provider) |
| PUT | `/api/bookings/:id/cancel` | Cancel booking (user) |
| PUT | `/api/bookings/:id/payment` | Confirm payment (user) |
| POST | `/api/bookings/:id/review` | Add review |

### Upload
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload/avatar` | Upload profile photo |

---

## 🚀 Deployment

### Backend → Render
1. Push to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Root directory: `backend`, Start command: `node server.js`
4. Add all environment variables from `.env`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Root directory: `frontend`, Framework: Vite
3. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`

---

## ⚠️ Common Issues

| Issue | Fix |
|---|---|
| OTP email not sending | Use Gmail App Password, not regular password |
| MongoDB not connecting | Make sure MongoDB Compass is open and running |
| Avatar not loading | Make sure backend `uploads/` folder exists |
| QR code not showing | Provider must accept the booking first |
| Dark mode text invisible | Clear localStorage and refresh |

---

## 📄 License

MIT License — free to use and modify.

## 👨‍💻 Author

Built by **Mohammed** — Information Science Engineering Student, MCEM Mysore (2026)

> ⭐ If you found this project helpful, please give it a star on GitHub!
