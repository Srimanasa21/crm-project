import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Enter both email and password to continue.");
      return;
    }
    setError("");
    onLogin();
  };

  return (
    <div className="login-page">
      <div className="login-panel panel">
        <h1>CRM Studio</h1>
        <p>Sign in to manage customers, leads, and pipeline growth.</p>

        {error && <p className="status-message">{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <label className="form-label">Email</label>
            <input
              className="form-field"
              type="email"
              placeholder="your@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field-row">
            <label className="form-label">Password</label>
            <input
              className="form-field"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="actions login-actions">
            <button className="btn btn-primary" type="submit">
              Sign in
            </button>
          </div>
        </form>

        <p className="login-note">
          This is a basic login screen for demonstration. Use any email/password combination.
        </p>
      </div>
    </div>
  );
}

export default Login;
