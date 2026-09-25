# DayMark

### Smart Student Wellness Activity Portal

> **Track your day. Build your goals. See your progress.**

DayMark is a student-focused activity and personal progress portal designed to help students record everyday activities, create meaningful goals, monitor consistency, and understand their progress over time.

It focuses on **non-medical wellness, productivity, and daily activity tracking**.

---

## ✨ Features

### 📊 Dashboard

Get a clear overview of your day and recent progress.

- Today's activity summary
- Total activity count
- Active time
- Goal completion
- Recent activities
- Weekly progress
- Current streak
- Longest streak
- Quick actions

### 📝 Activity Tracking

Record everyday activities such as:

- Walking / steps
- Exercise
- Study sessions
- Reading
- Water intake
- Sleep
- Breaks
- Meditation / relaxation
- Custom activities

Each activity can contain:

- Activity name
- Category
- Value
- Unit
- Duration
- Notes
- Logged date and time

### 🎯 Personalized Goals

Create and manage goals based on your daily routine.

Examples:

- 10,000 steps per day
- 4 hours of study
- 2 L water intake
- 20 pages of reading
- Exercise 5 days a week
- 7 hours of sleep

Goal states include:

- Active
- Completed
- Paused
- Archived

### 📈 Analytics

Understand activity patterns through visual analytics.

- Activity trends
- Category breakdown
- Goal analytics
- Completion percentage
- Activity duration
- Current streak
- Longest streak
- Date-range analysis

Charts are built using **Recharts**.

### 📅 Calendar

View activities based on the day they were logged.

- Monthly calendar
- Activity indicators
- Daily activity count
- Selected-day activity details
- Quick activity logging

### 🔔 Notifications

Receive productivity-oriented reminders and updates.

Examples:

- Goal reminders
- Streak updates
- Activity reminders
- Progress notifications

### 👤 Profile & Settings

Manage:

- Profile information
- Application preferences
- Theme
- Password
- Account settings

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React.js | UI development |
| Vite | Development and build tooling |
| React Router | Client-side routing |
| Axios | API communication |
| Recharts | Data visualization |
| Lucide React | Icons |
| CSS | Styling and responsive design |

### Backend

The frontend is designed to communicate with a future:

- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT Authentication
- bcrypt

backend through REST APIs.

---

## 🏗️ Architecture

```text
┌─────────────────────────┐
│       React Frontend    │
│                         │
│  Pages + Components     │
│  Context + Hooks        │
│  Services + Utilities   │
└────────────┬────────────┘
             │
             │ REST API
             ▼
┌─────────────────────────┐
│    Node.js + Express    │
│                         │
│ Routes                  │
│ Controllers             │
│ Services                │
│ Middleware              │
└────────────┬────────────┘
             │
             │ Prisma ORM
             ▼
┌─────────────────────────┐
│         MySQL           │
│                         │
│ Users                   │
│ Activities              │
│ Activity Logs           │
│ Goals                   │
│ Notifications           │
└─────────────────────────┘
```

---

## 📁 Frontend Structure

```text
frontend/
│
├── public/
│   └── favicon.svg
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── activities/
│   │   ├── goals/
│   │   ├── analytics/
│   │   └── calendar/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── Dashboard.jsx
│   │   ├── Activities.jsx
│   │   ├── Goals.jsx
│   │   ├── Analytics.jsx
│   │   ├── Calendar.jsx
│   │   ├── Notifications.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── activityService.js
│   │   ├── goalService.js
│   │   ├── dashboardService.js
│   │   └── analyticsService.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── AppContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useActivities.js
│   │   ├── useGoals.js
│   │   └── useDashboard.js
│   │
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── constants.js
│   │   ├── formatDate.js
│   │   └── formatDuration.js
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── responsive.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd DayMark/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 📦 Installed Dependencies

Main frontend dependencies:

```text
react
react-dom
react-router-dom
axios
lucide-react
recharts
```

Development tooling:

```text
vite
@vitejs/plugin-react
oxlint
```

---

## 🔐 Authentication

DayMark is designed to use JWT-based authentication.

The frontend stores:

```text
daymark_token
daymark_user
```

in browser local storage during the current development implementation.

The production backend will handle:

- Registration
- Login
- Logout
- Password hashing
- JWT generation
- JWT validation
- Profile management
- Password changes
- Password reset

---

## 🎨 Design Direction

DayMark follows a calm, mature and student-focused visual language.

### Design principles

- Minimal interface
- Strong typography
- Muted green and neutral palette
- Clear information hierarchy
- Subtle shadows
- Restrained border radius
- Responsive layouts
- Functional charts
- Minimal visual clutter

The interface intentionally avoids excessive:

- Gradients
- Glassmorphism
- Decorative animations
- Oversized cards
- Random motivational content
- Fake statistics

---

## 🧠 Personal Progress

DayMark can later include a rule-based **Personal Progress Engine**.

The engine can analyze recent activity patterns and provide useful productivity-oriented feedback.

For example:

```text
Recent study activity is below your weekly target.
Consider scheduling a focused study session.
```

The system is intended to provide **personal progress insights**, not medical diagnosis or treatment.

---

## 🔌 API Integration

The frontend communicates with the backend through Axios.

Base URL:

```text
http://localhost:5000/api
```

Example endpoints:

```text
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /activities
POST   /activities
PUT    /activities/:id
DELETE /activities/:id

GET    /activity-logs
POST   /activity-logs
PUT    /activity-logs/:id
DELETE /activity-logs/:id

GET    /goals
POST   /goals
PUT    /goals/:id
DELETE /goals/:id

GET    /dashboard
GET    /analytics
GET    /notifications
```

These endpoints will be finalized alongside the backend implementation.

---

## 🧪 Development

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run Oxlint:

```bash
npx oxlint .
```

---

## 📌 Current Development Status

### Frontend

- [x] Vite + React setup
- [x] Routing
- [x] Global styles
- [x] Responsive styles
- [x] Common components
- [x] Dashboard UI
- [x] Activity UI
- [x] Goals UI
- [x] Analytics UI
- [x] Calendar UI
- [x] Notifications UI
- [x] Profile UI
- [x] Settings UI
- [x] Context architecture
- [x] Hooks
- [x] API service layer
- [x] Utility functions

### Backend

- [ ] Express setup
- [ ] MySQL database
- [ ] Prisma schema
- [ ] Authentication API
- [ ] Activity API
- [ ] Goal API
- [ ] Dashboard API
- [ ] Analytics API
- [ ] Notification API
- [ ] Validation
- [ ] Error handling
- [ ] Testing
- [ ] Deployment

---

## 🗺️ Development Roadmap

```text
Phase 1  → Project Setup
Phase 2  → Database + Backend Foundation
Phase 3  → Authentication
Phase 4  → Activity Tracking
Phase 5  → Personalized Goals
Phase 6  → Dashboard
Phase 7  → Analytics + Calendar + Streaks
Phase 8  → Notifications + Personalization
Phase 9  → Testing + Security + Deployment
```

---

## ⚠️ Project Scope

DayMark is designed as a **non-medical student wellness and productivity platform**.

It focuses on:

- Everyday activities
- Personal goals
- Productivity
- Consistency
- Progress tracking
- Self-reflection

It does not attempt to:

- Diagnose medical conditions
- Provide medical treatment
- Calculate medical risk
- Replace healthcare professionals

---

## 👨‍💻 Development

**DayMark**

Smart Student Wellness Activity Portal

**Tagline:**  
> Track your day. Build your goals. See your progress.
