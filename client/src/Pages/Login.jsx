import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // <-- ✅ Import AuthContext

const Login = () => {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext); // <-- ✅ Use login from context

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password }),
      });

      const data = await response.json();

      if (data.token) {
        console.log('Login success:', data);

        // ✅ Set auth state and localStorage through context
        login(data.token, data.email, data.role);

        // ✅ Navigate to Events page
        navigate('/Events');
      } else {
        alert(data.error || 'Login failed.');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      alert('Server error');
    }
  };

  return (
    <main>
      <button className="back-btn" onClick={() => window.history.back()}>
        &larr; Back
      </button>
      <div className="login-form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="role">Login as:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="" disabled>
              Select role
            </option>
            <option value="vendor">Vendor</option>
            <option value="organizer">Event Organizer</option>
          </select>

          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p>
            Don't have an account?{' '}
            <Link to="/Registration" className="signup-link">
              Register here
            </Link>
          </p>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
