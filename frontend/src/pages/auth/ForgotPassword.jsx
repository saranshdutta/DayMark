import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { ROUTES } from "../../utils/constants";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--dm-bg)" }}>
      {/* Left Panel */}
      <div
        className="dm-desktop-only"
        style={{
          flex: "1",
          backgroundColor: "var(--dm-primary)",
          color: "#ffffff",
          padding: "var(--dm-space-12) var(--dm-space-16)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--dm-space-3)" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--dm-radius-sm)",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={20} />
          </div>
          <span style={{ fontSize: "var(--dm-text-lg)", fontWeight: "var(--dm-weight-bold)", letterSpacing: "-0.03em" }}>
            DayMark
          </span>
        </div>

        <div style={{ maxWidth: "480px" }}>
          <h1
            style={{
              fontSize: "var(--dm-text-3xl)",
              fontWeight: "var(--dm-weight-bold)",
              lineHeight: "1.2",
              letterSpacing: "-0.03em",
              marginBottom: "var(--dm-space-4)",
              color: "#ffffff",
            }}
          >
            Reset your security credentials securely.
          </h1>
          <p style={{ fontSize: "var(--dm-text-base)", color: "rgba(255, 255, 255, 0.75)", lineHeight: "1.6" }}>
            We will send a password reset link to your registered email address.
          </p>
        </div>

        <div style={{ fontSize: "var(--dm-text-xs)", color: "rgba(255, 255, 255, 0.5)" }}>
          © 2026 DayMark Student Wellness Platform
        </div>
      </div>

      {/* Right Form */}
      <div
        style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "var(--dm-space-8) var(--dm-space-6)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <Link
            to={ROUTES.LOGIN}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "var(--dm-text-xs)",
              color: "var(--dm-text-muted)",
              marginBottom: "var(--dm-space-6)",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "var(--dm-space-4) 0" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--dm-success-soft)",
                  color: "var(--dm-success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto var(--dm-space-4)",
                }}
              >
                <CheckCircle2 size={24} />
              </div>

              <h2 style={{ fontSize: "var(--dm-text-xl)", fontWeight: "var(--dm-weight-semibold)", marginBottom: "var(--dm-space-2)" }}>
                Check your inbox
              </h2>
              <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-secondary)", lineHeight: "1.5", marginBottom: "var(--dm-space-6)" }}>
                We have sent password reset instructions to <strong>{email}</strong>.
              </p>

              <Button variant="secondary" size="md" fullWidth onClick={() => setSubmitted(false)}>
                Resend Email
              </Button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "var(--dm-space-6)" }}>
                <h2 style={{ fontSize: "var(--dm-text-2xl)", fontWeight: "var(--dm-weight-bold)", letterSpacing: "-0.025em" }}>
                  Forgot password?
                </h2>
                <p style={{ fontSize: "var(--dm-text-sm)", color: "var(--dm-text-muted)", marginTop: "var(--dm-space-1)" }}>
                  Enter your email address to receive reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--dm-space-4)" }}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="alex@student.edu"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
