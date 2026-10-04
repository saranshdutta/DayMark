# DayMark 🌟

**DayMark** is a comprehensive personal activity tracking, habit management, and student wellness platform built with modern web technologies. Designed specifically for students and busy individuals, DayMark helps you balance academic responsibilities, daily habits, focus sessions, and physical/mental well-being.

---

## 🚀 Features

### 📊 Comprehensive Dashboard
- **Greeting & Time Awareness**: Contextual greeting based on your local time.
- **Wellness & Habit Quick Snapshot**: Overview of today's mood, sleep, water intake, active time, and focus timer.
- **Quick-Add Actions**: Instantly record hydration, mood, sleep, or start a focus session right from the dashboard.
- **Recent Activity Feed & Goals Preview**: High-level status of your current streak and upcoming goals.

### 🧘 Wellness Hub
- **Mood & Energy Check-in**: Track daily emotional state, energy levels, stress factors, and quick reflection notes.
- **Sleep Log & Analysis**: Track bedtime, wake time, quality rating (Poor, Fair, Good, Excellent), and total hours.
- **Hydration Tracker**: Set daily water targets and log consumption in real-time.

### ⏱️ Focus & Pomodoro Mode
- **Customizable Pomodoro Timer**: Standard 25-minute focus intervals with short/long break toggles.
- **Session Labeling**: Link focus sessions to specific study tasks or projects.
- **Session History & Daily Productivity Stats**: Track completed, cancelled, and total focus minutes.

### 📋 Activity Logging & Categorization
- **Multi-Category Support**: `ACADEMIC`, `HEALTH`, `PERSONAL`, `SOCIAL`, `WORK`, `OTHER`.
- **Duration & Intensity**: Log duration in minutes, intensity, tags, and date/time.
- **Filter & Search**: Quickly query logs by date range and category.

### 🎯 Goal Tracking
- **Target Setting**: Set daily/weekly targets for study, exercise, reading, or custom habits.
- **Progress Tracking**: Real-time visual progress bars with status updates.

### 📈 Analytics & Trends
- **Activity & Category Distribution**: Visual charts powered by Recharts.
- **Streak & Consistency Metrics**: Calculate current and longest activity streaks.

### 📅 Interactive Calendar
- **Full Month & Day Breakdown**: View activities, mood check-ins, sleep, and focus sessions on a clean calendar interface.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: Modern CSS design system with custom variables & CSS grid (`globals.css`)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: SQLite (via Prisma ORM)
- **Security**: JWT authentication, bcrypt password hashing, Helmet, Rate Limiting
- **Database Tooling**: Prisma Client & Prisma Migrate

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/DayMark.git
   cd DayMark
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev --name init
   npm run seed
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   The frontend app will run on `http://localhost:5173`.

---

## 🔑 Demo Account

If seed data is loaded, you can log in with:
- **Email**: `alex@student.edu`
- **Password**: `password123`

---

## 🌐 API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Authenticate user & retrieve JWT |
| `/api/auth/register` | POST | Register new user account |
| `/api/activities` | GET / POST | Manage activity logs |
| `/api/goals` | GET / POST | Manage goals |
| `/api/wellness/checkins` | GET / POST | Log and retrieve mood/energy check-ins |
| `/api/sleep` | GET / POST | Log sleep records |
| `/api/hydration` | GET / POST | Track water intake |
| `/api/focus` | GET / POST | Track Pomodoro focus sessions |
| `/api/users/preferences` | GET / PUT | Manage user targets & preferences |

---

## 📄 License
MIT License.
