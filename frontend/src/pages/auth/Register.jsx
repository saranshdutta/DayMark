import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, BookOpen, Heart, Target, BarChart2 } from "lucide-react";
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

function getPasswordStrength(pass) {
  if (!pass) return { score: 0, label: "" };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 10) score += 1;
  if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak strength" };
  if (score === 2) return { score: 2, label: "Fair strength" };
  if (score === 3) return { score: 3, label: "Good strength" };
  return { score: 4, label: "Strong password" };
}

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await authService.register({ name, email, password });
      const token = data?.token;
      const user = data ? { id: data.id, name: data.name, email: data.email } : null;

      if (!token) {
        throw new Error("Registration succeeded but no token was returned.");
      }

      login(user, token);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
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
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.4)" }} />
            <div style={{ width: "20px", height: "4px", borderRadius: "9999px", backgroundColor: "#DCE9E1" }} />
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
          <div className="dm-mobile-only" style={{ marginBottom: "24px", textAlign: "center", display: "flex", justifyContent: "center" }}>
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
              marginBottom: "6px",
            }}
          >
            Student Wellness &amp; Productivity
          </div>

          {/* Heading & Subtitle */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#17201C",
              letterSpacing: "-0.025em",
              lineHeight: "1.2",
              marginBottom: "4px",
            }}
          >
            Create your DayMark.
          </h1>
          <p style={{ fontSize: "14px", color: "#78847E", marginBottom: "22px" }}>
            Build habits that make your days count.
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
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="name-input"
                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#17201C", marginBottom: "5px" }}
              >
                Full name
              </label>
              <div style={{ position: "relative" }}>
                <User
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
                  id="name-input"
                  type="text"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  style={{
                    width: "100%",
                    height: "42px",
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

            {/* Email Address */}
            <div>
              <label
                htmlFor="email-input-reg"
                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#17201C", marginBottom: "5px" }}
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
                  id="email-input-reg"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={{
                    width: "100%",
                    height: "42px",
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
                htmlFor="password-input-reg"
                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#17201C", marginBottom: "5px" }}
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
                  id="password-input-reg"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{
                    width: "100%",
                    height: "42px",
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

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px" }}>
                  <div style={{ display: "flex", gap: "4px", flex: 1, maxWidth: "160px" }}>
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        style={{
                          height: "4px",
                          flex: 1,
                          borderRadius: "9999px",
                          backgroundColor:
                            step <= passwordStrength.score
                              ? step <= 1
                                ? "#D97706"
                                : step <= 2
                                ? "#CA8A04"
                                : "#173F32"
                              : "#E3E8E3",
                          transition: "background-color 200ms ease",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "11px", color: "#78847E", fontWeight: "500" }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirm-password-input"
                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#17201C", marginBottom: "5px" }}
              >
                Confirm password
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
                  id="confirm-password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{
                    width: "100%",
                    height: "42px",
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
              </div>
            </div>

            {/* Terms Checkbox */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#173F32",
                  cursor: "pointer",
                }}
              />
              <label htmlFor="terms-checkbox" style={{ fontSize: "12px", color: "#78847E", cursor: "pointer" }}>
                I agree to the <strong style={{ color: "#17201C" }}>Terms &amp; Privacy Policy</strong>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                height: "44px",
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
                transition: "background-color 150ms ease",
              }}
              onMouseOver={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#0F3026";
              }}
              onMouseOut={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#173F32";
              }}
            >
              <span>{loading ? "Creating account..." : "Create account"}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Bottom Login Link */}
          <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#78847E" }}>
            Already have an account?{" "}
            <Link
              to={ROUTES.REGISTER}
              style={{ fontWeight: "600", color: "#173F32", textDecoration: "none" }}
            >
              Log in
            </Link>
          </div>

          {/* Supporting Feature Nav Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "28px",
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

export default Register;
