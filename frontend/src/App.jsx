import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DemoOne from "./components/ui/demo";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Activities from "./pages/Activities";
import Goals from "./pages/Goals";
import Wellness from "./pages/Wellness";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import Focus from "./pages/Focus";
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
        {/* Landing Page (1st page of DayMark) */}
        <Route path="/" element={<DemoOne />} />

        {/* Auth Routes */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ACTIVITIES} element={<Activities />} />
            <Route path={ROUTES.GOALS} element={<Goals />} />
            <Route path={ROUTES.WELLNESS} element={<Wellness />} />
            <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
            <Route path={ROUTES.CALENDAR} element={<Calendar />} />
            <Route path={ROUTES.FOCUS} element={<Focus />} />
            <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
