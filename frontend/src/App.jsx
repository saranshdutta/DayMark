import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Goals from "./pages/Goals";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import { ROUTES } from "./utils/constants";

import "./styles/variables.css";
import "./styles/globals.css";
import "./styles/responsive.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            Authentication Routes
            ========================= */}

        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        {/* =========================
            Main Application Routes
            ========================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ACTIVITIES} element={<Activities />} />
            <Route path={ROUTES.GOALS} element={<Goals />} />
            <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
            <Route path={ROUTES.CALENDAR} element={<Calendar />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>
        </Route>

        {/* =========================
            Default / Unknown Routes
            ========================= */}

        <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
