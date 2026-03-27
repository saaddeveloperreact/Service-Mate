# 🛠️ ServiceMate — Trusted Home Services Platform

A full-stack MERN web application that connects customers with trusted service professionals like electricians, plumbers, carpenters, painters, and more.

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
- 📋 Track booking status in real-time
- ❌ Cancel pending bookings
- ⭐ View provider profiles, ratings and reviews

### For Service Providers
- 📥 Receive and manage booking requests
- ✅ Accept or reject bookings
- 🔄 Update booking status (Accept → Start → Complete)
- 💰 Auto-calculate earnings based on hours worked
- 📊 Dashboard with earnings and booking stats

### General
- 🔐 Dual authentication system (User & Provider)
- 🎨 Beautiful UI with Framer Motion animations
- 📱 Fully responsive design
- 🔒 JWT-based secure authentication

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Shadcn/ui (Radix UI) | UI Components |
| React Router DOM | Routing |
| Axios | API calls |
| React Toastify | Notifications |
| Lottie React | Animated illustrations |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Bcryptjs | Password hashing |
| CORS | Cross-origin requests |
| Dotenv | Environment variables |

---

## 📁 Folder Structure

```
servicemate-final/
│
├── backend/
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── userAuthController.js     # User register/login
│   │   ├── providerAuthController.js # Provider register/login
│   │   ├── providerController.js     # Browse providers
│   │   └── bookingController.js      # Booking management
│   ├── middleware/
│   │   ├── auth.js                   # JWT protection
│   │   └── error.js                  # Error handling
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   ├── Provider.js               # Provider schema
│   │   ├── Booking.js                # Booking schema
│   │   └── Review.js                 # Review schema
│   ├── routes/
│   │   ├── userAuthRoutes.js
│   │   ├── providerAuthRoutes.js
│   │   ├── providerRoutes.js
│   │   └── bookingRoutes.js
│   ├── .env                          # Environment variables
│   ├── package.json
│   └── server.js                     # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/               # Navbar, Footer, Cards
    │   │   └── ui/                   # Shadcn components
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global auth state
    │   ├── lib/
    │   │   ├── utils.js              # Helper functions
    │   │   └── motionVariants.js     # Framer motion variants
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProvidersPage.jsx
    │   │   ├── ProviderDetailPage.jsx
    │   │   ├── user/                 # User pages
    │   │   └── provider/             # Provider pages
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🗄️ MongoDB Collections

| Collection | Description |
|---|---|
| `users` | Customer accounts |
| `providers` | Service professional accounts |
| `bookings` | Service appointments |
| `reviews` | Ratings and comments |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have these installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Compass](https://www.mongodb.com/products/compass) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/servicemate-final.git
cd servicemate-final
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/servicemate
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

> **If using MongoDB Compass (local):**
> ```
> MONGO_URI=mongodb://localhost:27017/servicemate
> ```

> **If using MongoDB Atlas (cloud):**
> ```
> MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/servicemate
> ```

Start the backend server:

```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on http://localhost:5000
```

---

### 3. Frontend Setup

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE ready in ~500ms
➜ Local: http://localhost:5173
```

---

### 4. Open in Browser

```
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/servicemate` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `JWT_EXPIRE` | JWT token expiry time | `7d` |
| `NODE_ENV` | Environment mode | `development` |

---

## 📡 API Endpoints

### User Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/user/register` | Register new user |
| POST | `/api/auth/user/login` | Login user |
| GET | `/api/auth/user/me` | Get user profile |
| PUT | `/api/auth/user/me` | Update user profile |

### Provider Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/provider/register` | Register new provider |
| POST | `/api/auth/provider/login` | Login provider |
| GET | `/api/auth/provider/me` | Get provider profile |
| PUT | `/api/auth/provider/me` | Update provider profile |

### Providers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/providers` | Get all providers (with filters) |
| GET | `/api/providers/:id` | Get single provider |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create booking (user) |
| GET | `/api/bookings/my` | Get user bookings |
| GET | `/api/bookings/provider` | Get provider bookings |
| PUT | `/api/bookings/:id/status` | Update booking status (provider) |
| PUT | `/api/bookings/:id/cancel` | Cancel booking (user) |
| POST | `/api/bookings/:id/review` | Add review (user) |

---

## 🎨 Pages Overview

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero section, services, testimonials |
| Find Services | `/providers` | Browse and filter providers |
| Provider Detail | `/providers/:id` | Full provider profile |
| User Login | `/user/login` | Customer login |
| User Register | `/user/register` | Customer registration |
| User Dashboard | `/user/dashboard` | Manage bookings |
| Book Service | `/user/book/:id` | Book a provider |
| Provider Login | `/provider/login` | Provider login |
| Provider Register | `/provider/register` | Provider registration |
| Provider Dashboard | `/provider/dashboard` | Manage requests & earnings |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
```bash
git checkout -b feature/your-feature-name
```
3. Commit your changes
```bash
git commit -m "Add your feature"
```
4. Push to the branch
```bash
git push origin feature/your-feature-name
```
5. Open a Pull Request

---

## ⚠️ Common Issues

**MongoDB not connecting?**
- Make sure MongoDB Compass is open and running
- Check that the `MONGO_URI` in `.env` is correct
- For Atlas, whitelist your IP in Network Access

**Frontend not connecting to backend?**
- Make sure backend is running on port `5000`
- Check `vite.config.js` has the proxy set to `http://localhost:5000`

**npm install fails?**
- Make sure you are running Node.js v18 or higher
- Try deleting `node_modules` and running `npm install` again

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ for reliable home services across India.

> ⭐ If you found this project helpful, please give it a star on GitHub!
