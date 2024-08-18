// src/pages/BusinessSignup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Replace with your backend API URL and handle the response accordingly
    try {
      const response = await fetch('http://localhost:5000/api/business-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        navigate('/business-login'); // Redirect to login page
      } else {
        alert('Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
      <h2>Business Signup</h2>
      <form onSubmit={handleSignup} className="login-form">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </label>
        <br />
        <label>
          Confirm Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-control"
          />
        </label>
        <br />
        <button type="submit" className="btn-primary">Sign Up</button>
      </form>
    </div>

    </div>
    
  );
};

export default BusinessSignup;
