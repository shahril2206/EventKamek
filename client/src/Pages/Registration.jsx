import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import dummyProfilePic from '../Assets/dummyProfilePic.png';

const Registration = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      role,
      name,
      email,
      contactNo,
      password,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        navigate('/Login');
      } else {
        alert(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Server error during registration.');
    }
  };

  return (
    <main>
      <button className="back-btn" onClick={() => window.history.back()}>
        &larr; Back
      </button>

      <div className="signup-form-container">
        <h1>Sign Up</h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
          <img
            src={preview || dummyProfilePic}
            alt="Profile Preview"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #ccc',
            }}
          />
          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{
                marginTop: '8px',
                padding: '4px 10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Remove Image
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="role">Register as:</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>Select a role to proceed with registration</option>
            <option value="vendor">Vendor</option>
            <option value="organizer">Event Organizer</option>
          </select>

          {role && (
            <>
              <label htmlFor="name">{role === 'vendor' ? 'Vendor Name:' : 'Organization Name:'}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="contactNo">Contact No.:</label>
          <input
            type="tel"
            id="contactNo"
            name="contactNo"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            pattern="[0-9+\-\s]{7,15}"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <label htmlFor="profilePic">Profile Picture/Logo (optional):</label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          <p>
            Already have an account?{' '}
            <Link to="/Login" className="login-link">Login here</Link>
          </p>

          <button type="submit" className="signup-btn">Register</button>
        </form>
      </div>
    </main>
  );
};

export default Registration;
