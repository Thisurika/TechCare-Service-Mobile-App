# 🔧 TechCare Service Mobile App

A full-stack mobile application for **TechCare Services** — a company specializing in repairing and servicing electronic devices and home appliances.

## ✨ Features

- **User Authentication** — Register/login with email & phone, JWT-based auth
- **Service Browsing** — Browse repair services by device category (smartphones, laptops, TVs, ACs, refrigerators, washing machines)
- **Repair Booking** — Submit repair requests with issue details, photo uploads, pickup/drop-off options
- **Booking Management** — Track repair progress with real-time status updates
- **Notifications** — Booking confirmations, status updates, and promotional alerts
- **Support & Tips** — FAQs and device maintenance tips

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native (Expo) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |

## 📁 Project Structure

```
TechCare Service/
├── backend/          # Express.js REST API
│   ├── config/       # Database configuration
│   ├── controllers/  # Route handlers
│   ├── middleware/    # Auth middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── seeds/        # Seed data
├── frontend/         # React Native (Expo) app
│   └── src/
│       ├── api/          # API client
│       ├── components/   # Reusable components
│       ├── context/      # Auth context
│       ├── navigation/   # App navigation
│       ├── screens/      # App screens
│       └── theme/        # Colors & styling
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Backend Setup
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run seed    # Seed the database
npm start       # Starts server on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npx expo start  # Scan QR code with Expo Go
```

### Environment Variables

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/techcare
JWT_SECRET=your_jwt_secret_key_here
```

## 📱 Screens

1. **Login / Register** — Authentication screens
2. **Home** — Dashboard with device categories & active bookings
3. **Services** — Browse & search available repair services
4. **Booking Form** — Multi-step repair request submission
5. **My Bookings** — Track all repair bookings
6. **Notifications** — Alerts & updates
7. **Profile** — User profile & service history
8. **Support** — FAQs & maintenance tips

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| GET | `/api/services` | List all services |
| GET | `/api/services/:id` | Service details |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | User's bookings |
| GET | `/api/bookings/:id` | Booking details |
| PUT | `/api/bookings/:id/status` | Update status |
| DELETE | `/api/bookings/:id` | Cancel booking |
| GET | `/api/notifications` | User notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| GET | `/api/support/faqs` | Get FAQs |
| GET | `/api/support/tips` | Get maintenance tips |

## 👨‍💻 Author

TechCare Services Development Team

## 📄 License

This project is for educational purposes.
