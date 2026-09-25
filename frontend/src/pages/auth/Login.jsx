import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login({
        email: form.email.trim(),
        password: form.password,
      });
      // Backend returns { id, name, email, token }
      const { token, ...userData } = data;
      login(userData, token);
      navigate("/dashboard");
    } catch (submitError) {
      const message =
        submitError?.response?.data?.message ||
        "Unable to sign in. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dm-auth-page">
      <div className="dm-auth-container">
        <div className="dm-auth-brand">
          <div className="dm-brand-mark">D</div>
          <div>
            <strong>DayMark</strong>
            <span>Student wellness</span>
          </div>
        </div>

        <div className="dm-auth-card">
          <div className="dm-auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to continue tracking your progress.</p>
          </div>

          <form className="dm-form" onSubmit={handleSubmit}>
            <div className="dm-form-group">
              <label htmlFor="login-email">Email</label>
              <div className="dm-input-with-icon">
                <Mail size={18} />
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="dm-form-group">
              <div className="dm-form-label-row">
                <label htmlFor="login-password">Password</label>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <div className="dm-input-with-icon dm-password-input">
                <Lock size={18} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="dm-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="dm-form-error">{error}</div>}

            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>

          <div className="dm-auth-footer">
            <span>Don&apos;t have an account?</span>
            <Link to="/register">Create an account</Link>
          </div>
        </div>

        <p className="dm-auth-tagline">
          Track your day. Build your goals. See your progress.
        </p>
      </div>
    </div>
  );
}

export default Login;
