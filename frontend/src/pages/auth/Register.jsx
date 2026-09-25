import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../../components/common/Button";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) { setError("Please enter your name."); return; }
    if (!form.email.trim()) { setError("Please enter your email."); return; }
    if (form.password.length < 6) { setError("Password must contain at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const data = await authService.register({
        name: form.name.trim(),
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
        "Unable to create your account. Please try again.";
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
            <h1>Create your account</h1>
            <p>Start building better daily habits with DayMark.</p>
          </div>

          <form className="dm-form" onSubmit={handleSubmit}>
            <div className="dm-form-group">
              <label htmlFor="register-name">Full name</label>
              <div className="dm-input-with-icon">
                <User size={18} />
                <input
                  id="register-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="dm-form-group">
              <label htmlFor="register-email">Email</label>
              <div className="dm-input-with-icon">
                <Mail size={18} />
                <input
                  id="register-email"
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
              <label htmlFor="register-password">Password</label>
              <div className="dm-input-with-icon dm-password-input">
                <Lock size={18} />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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

            <div className="dm-form-group">
              <label htmlFor="register-confirm-password">Confirm password</label>
              <div className="dm-input-with-icon dm-password-input">
                <Lock size={18} />
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="dm-password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="dm-form-error">{error}</div>}

            <Button type="submit" fullWidth loading={loading}>
              Create account
            </Button>
          </form>

          <div className="dm-auth-footer">
            <span>Already have an account?</span>
            <Link to="/login">Sign in</Link>
          </div>
        </div>

        <p className="dm-auth-tagline">
          Track your day. Build your goals. See your progress.
        </p>
      </div>
    </div>
  );
}

export default Register;
