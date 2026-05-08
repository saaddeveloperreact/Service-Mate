# 🛠️ ServiceMate — Trusted Home Services Platform

A full-stack MERN web application connecting customers with verified service professionals — featuring subscriptions, QR payments, reviews, performance analytics, and dark/light mode.

![MERN](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)
![Node](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

---

## 👨‍💻 Developer
**Mohammed Saad** · Information Science Engineering · MCEM Mysore · 2026
- 📧 mohdsaad251203@gmail.com
- 📞 +91 8904339551
- 🔗 [LinkedIn](https://linkedin.com/in/mohammed-saad-a761b0225)
- 💻 [GitHub](https://github.com/saaddeveloperreact)

---

## ✨ Features

### For Customers
- 🔍 Browse & search verified professionals by category, city, rate
- 📅 Book appointments with date, time, address
- 💳 Mark payment done after service
- ⭐ Write, edit, delete reviews for completed bookings
- 🧾 Download/print service receipt as PDF
- 📸 Upload profile photo
- 🗑️ Delete individual or all booking history
- 🔑 OTP-based forgot password via Gmail

### For Service Providers
- 👑 Subscription plans: ₹400/month · ₹700/3 months · ₹1200/6 months
- 💳 Pay via Razorpay (UPI, GPay, PhonePe, cards)
- 📊 Performance analytics dashboard with charts
- 📥 Accept/reject/complete booking requests
- 🧾 Generate service receipts
- 📸 Upload profile photo
- 🗑️ Delete booking history
- ⚠️ Subscription expiry alerts

### General
- 🌙 Dark / Light mode toggle
- 📱 Fully mobile responsive (Android tested)
- 🔐 JWT authentication (dual role — User & Provider)
- 🎨 Framer Motion animations throughout
- 🏗️ Redux Toolkit state management (4 slices)

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, Redux Toolkit, Tailwind CSS, Framer Motion |
| Charts | Recharts (BarChart, LineChart, PieChart) |
| Payments | Razorpay (subscriptions) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + Bcryptjs |
| Email | Nodemailer + Gmail SMTP |
| Uploads | Multer |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas (DB) |

---

## 🗄️ MongoDB Collections

| Collection | Description |
|---|---|
| `users` | Customer accounts with avatar |
| `providers` | Provider accounts with rateMin/rateMax, subscription status |
| `bookings` | Bookings with status, review, paymentStatus |
| `subscriptions` | Razorpay payment records |
| `otps` | Auto-expiring OTP codes (TTL 10 min) |

---

## 🚀 Getting Started

### 1. Clone
```bash
git clone https://github.com/saaddeveloperreact/servicemate.git
cd servicemate
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/servicemate
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16char_app_password
EMAIL_FROM=ServiceMate <your_gmail@gmail.com>
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

```bash
npm run dev
# ✅ Server running on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
# ✅ App on http://localhost:5173
```

---

## ☁️ Deployment

### Database — MongoDB Atlas
1. Create free cluster at mongodb.com/cloud/atlas
2. Add database user
3. Allow all IPs (0.0.0.0/0) in Network Access
4. Copy connection string to `MONGO_URI` in Render env vars

### Backend — Render.com
1. Push to GitHub
2. New Web Service → connect repo
3. Root: `backend` · Build: `npm install` · Start: `node server.js`
4. Add all `.env` values as Environment Variables

### Frontend — Vercel
1. New Project → connect repo
2. Root: `frontend` · Framework: Vite
3. Add env var: `VITE_API_URL=https://your-render-url.onrender.com`

---

## 💳 Razorpay Setup
1. Register at [razorpay.com](https://razorpay.com)
2. Dashboard → Settings → API Keys → Generate Test Key
3. Copy Key ID and Key Secret to backend `.env`
4. For live payments, complete KYC and switch to live keys

---

## 📄 License
MIT — free to use and modify.
