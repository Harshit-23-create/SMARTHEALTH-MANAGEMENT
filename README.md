# SMARTHEALTH MANAGEMENT 🏥

A full-stack **Hospital Management System** built with the MERN stack (MongoDB, Express, React, Node.js). Features patient management, ambulance tracking, appointment booking, analytics dashboard, and more.

## 🚀 Live Demo

- **Frontend**: [https://careflow-dashboard.vercel.app](https://careflow-dashboard.vercel.app)
- **Backend API**: [https://careflow-backend.onrender.com](https://careflow-backend.onrender.com)

## ✨ Features

- 🔐 JWT Authentication (Login & Register)
- 👥 Patient Management (CRUD operations)
- 🚑 Live Ambulance Tracking with Leaflet Maps
- 📊 Analytics Dashboard with Recharts
- 🏥 Bed Management
- 💊 Pharmacy Module
- 🩸 Blood Bank Management
- 📅 Appointment Booking
- 🆘 Emergency Module
- 🏥 Hospital Finder
- ⚙️ Settings Page

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Shadcn/ui |
| Backend    | Node.js, Express 5                  |
| Database   | MongoDB Atlas (Mongoose ODM)        |
| Auth       | JWT (JSON Web Tokens), bcryptjs     |
| Maps       | Leaflet, React-Leaflet              |
| Charts     | Recharts                            |
| Deployment | Vercel (Frontend), Render (Backend) |

## 📁 Project Structure

```
CareFlow-Dashboard/
├── backend/                 # Express API server
│   ├── models/              # Mongoose schemas
│   ├── middleware/           # Auth middleware
│   ├── server.js            # Main server file
│   └── package.json
├── careflow-dashboard/      # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── utils/           # API config & utilities
│   │   └── hooks/           # Custom React hooks
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env   # Fill in your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd careflow-dashboard
npm install
cp .env.example .env   # Set VITE_API_URL if needed
npm run dev
```

## 📄 Environment Variables

### Backend (`backend/.env`)
| Variable       | Description                    |
|----------------|--------------------------------|
| `MONGO_URI`    | MongoDB Atlas connection string|
| `JWT_SECRET`   | Secret key for JWT tokens      |
| `PORT`         | Server port (default: 5000)    |
| `FRONTEND_URL` | Frontend URL for CORS          |

### Frontend (`careflow-dashboard/.env`)
| Variable       | Description                    |
|----------------|--------------------------------|
| `VITE_API_URL` | Backend API URL                |

## 👤 Author

**Harshit Soni**
- GitHub: [@Harshit-23-create](https://github.com/Harshit-23-create)

## 📝 License

This project is [MIT](LICENSE) licensed.
