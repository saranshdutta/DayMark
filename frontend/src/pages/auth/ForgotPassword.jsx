import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Button from "../../components/common/Button";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Temporary password reset flow.
       * Replace with authService.forgotPassword()
       * when the backend is connected.
       */
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSubmitted(true);
    } catch (submitError) {
      console.error(submitError);

      setError("Unable to process your request. Please try again.");
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
          {!submitted ? (
            <>
              <div className="dm-auth-header">
                <h1>Reset your password</h1>

                <p>
                  Enter your email and we'll send you instructions to reset your
                  password.
                </p>
              </div>

              <form className="dm-form" onSubmit={handleSubmit}>
                <div className="dm-form-group">
                  <label htmlFor="forgot-email">Email</label>

                  <div className="dm-input-with-icon">
                    <Mail size={18} />

                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);

                        if (error) {
                          setError("");
                        }
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {error && <div className="dm-form-error">{error}</div>}

                <Button type="submit" fullWidth loading={loading}>
                  Send reset instructions
                </Button>
              </form>
            </>
          ) : (
            <div className="dm-auth-success">
              <div className="dm-auth-success-icon">
                <CheckCircle2 size={30} />
              </div>

              <h1>Check your email</h1>

              <p>
                If an account exists for <strong>{email}</strong>, password
                reset instructions will be sent there.
              </p>

              <Link to="/login">
                <Button type="button" fullWidth>
                  Back to sign in
                </Button>
              </Link>
            </div>
          )}

          {!submitted && (
            <div className="dm-auth-footer">
              <Link to="/login" className="dm-auth-back-link">
                <ArrowLeft size={15} />
                Back to sign in
              </Link>
            </div>
          )}
        </div>

        <p className="dm-auth-tagline">
          Track your day. Build your goals. See your progress.
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
