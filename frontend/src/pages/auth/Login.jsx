import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight, BookOpen, Heart, Target, BarChart2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { ROUTES } from "../../utils/constants";

const LeafLogo = ({ color = "#ffffff" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color }}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
    <span style={{ fontSize: "18px", fontWeight: "700", color, letterSpacing: "-0.02em" }}>
      DayMark
    </span>
  </div>
);

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const data = await authService.login({ email, password });
      const token = data?.token;
      const user = data ? { id: data.id, name: data.name, email: data.email } : null;

      if (!token) {
        throw new Error("No token received from server.");
      }

      login(user, token);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#F6F7F3",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* LEFT SIDE: 45% Cinematic Hero Panel (Hidden on mobile) */}
      <div
        className="dm-desktop-only"
        style={{
          flex: "0 0 45%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          backgroundColor: "#0F1A15",
        }}
      >
        {/* Clean background image: Cinematic floating island */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/cinematic-island.png'), url('/auth-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 1,
          }}
        />

        {/* Video stream layer */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 2,
            opacity: 0.9,
          }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Dark & Forest-Green Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(15, 30, 22, 0.45) 0%, rgba(10, 20, 15, 0.85) 100%)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />

        {/* Top Brand Logo */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <LeafLogo color="#ffffff" />
        </div>

        {/* Lower Left Headline & Supporting Copy */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "380px", marginBottom: "16px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#ffffff",
              lineHeight: "1.2",
              letterSpacing: "-0.03em",
              marginBottom: "12px",
            }}
          >
            Make space<br />for what matters.
          </h2>
          <p
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.85)",
              lineHeight: "1.6",
              marginBottom: "24px",
            }}
          >
            Track your habits, focus, wellness and progress in one place.
          </p>

          {/* Indicator dots */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "20px", height: "4px", borderRadius: "9999px", backgroundColor: "#DCE9E1" }} />
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.4)" }} />
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.4)" }} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: 55% Authentication Panel */}
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 24px",
          backgroundColor: "#F6F7F3",
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }}>
          {/* Mobile-only logo */}
          <div className="dm-mobile-only" style={{ marginBottom: "28px", textAlign: "center", display: "flex", justifyContent: "center" }}>
            <LeafLogo color="#173F32" />
          </div>

          {/* Top Label */}
          <div
            style={{
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.08em",
              color: "#78847E",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Student Wellness &amp; Productivity
          </div>

          {/* Heading & Subtitle */}
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "700",
              color: "#17201C",
              letterSpacing: "-0.025em",
              lineHeight: "1.2",
              marginBottom: "6px",
            }}
          >
            Welcome back.
          </h1>
          <p style={{ fontSize: "14px", color: "#78847E", marginBottom: "28px" }}>
            Continue building a better day.
          </p>

          {/* Error Banner */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                backgroundColor: "#F9EAEA",
                color: "#9B3B3B",
                border: "1px solid #F0C4C4",
                borderRadius: "8px",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email Address */}
            <div>
              <label
                htmlFor="email-input"
                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#17201C", marginBottom: "6px" }}
              >
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#78847E",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="email-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{
                    width: "100%",
                    height: "44px",
                    paddingLeft: "40px",
                    paddingRight: "14px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E3E8E3",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#17201C",
                    outline: "none",
                    transition: "border-color 150ms ease, box-shadow 150ms ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#173F32";
                    e.target.style.boxShadow = "0 0 0 3px rgba(23, 63, 50, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E3E8E3";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password-input"
                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#17201C", marginBottom: "6px" }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#78847E",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    height: "44px",
                    paddingLeft: "40px",
                    paddingRight: "40px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E3E8E3",
                    borderRadius: "10px",
                    fontSize: "14px",
                    color: "#17201C",
                    outline: "none",
                    transition: "border-color 150ms ease, box-shadow 150ms ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#173F32";
                    e.target.style.boxShadow = "0 0 0 3px rgba(23, 63, 50, 0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E3E8E3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#78847E",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Log in Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "46px",
                backgroundColor: "#173F32",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: "600",
                borderRadius: "10px",
                border: "none",
                cursor: loading ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
                transition: "background-color 150ms ease, transform 150ms ease",
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#0F3026";
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#173F32";
              }}
            >
              <span>{loading ? "Logging in..." : "Log in"}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Forgot Password */}
          <div style={{ textAlign: "right", marginTop: "12px" }}>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              style={{ fontSize: "12px", color: "#78847E", fontWeight: "600", textDecoration: "none" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#173F32")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#78847E")}
            >
              Forgot password?
            </Link>
          </div>

          {/* Bottom Register Link */}
          <div style={{ textAlign: "center", marginTop: "28px", fontSize: "13px", color: "#78847E" }}>
            Don't have an account?{" "}
            <Link
              to={ROUTES.REGISTER}
              style={{ fontWeight: "600", color: "#173F32", textDecoration: "none" }}
            >
              Create one
            </Link>
          </div>

          {/* Supporting Feature Nav Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "36px",
              paddingTop: "20px",
              borderTop: "1px solid #E3E8E3",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
              <BookOpen size={16} style={{ color: "#78847E" }} />
              <span style={{ fontSize: "11px", color: "#78847E", fontWeight: "500" }}>Focus</span>
            </div>
            <div style={{ width: "1px", height: "24px", backgroundColor: "#E3E8E3" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
              <Heart size={16} style={{ color: "#78847E" }} />
              <span style={{ fontSize: "11px", color: "#78847E", fontWeight: "500" }}>Wellness</span>
            </div>
            <div style={{ width: "1px", height: "24px", backgroundColor: "#E3E8E3" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
              <Target size={16} style={{ color: "#78847E" }} />
              <span style={{ fontSize: "11px", color: "#78847E", fontWeight: "500" }}>Goals</span>
            </div>
            <div style={{ width: "1px", height: "24px", backgroundColor: "#E3E8E3" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flex: 1 }}>
              <BarChart2 size={16} style={{ color: "#78847E" }} />
              <span style={{ fontSize: "11px", color: "#78847E", fontWeight: "500" }}>Growth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
