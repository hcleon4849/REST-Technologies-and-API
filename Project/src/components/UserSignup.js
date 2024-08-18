// src/components/UserSignup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSignup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user-signup', {
        username,
        password,
      });

      setMessage(response.data.message);
      setError('');
      // Redirect to user login page after successful signup
      setTimeout(() => {
        navigate('/user-login');
      }, 1000); // Redirect after 1 second for user feedback
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
      <h2>User Signup</h2>
      <form onSubmit={handleSignup} className="login-form">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn-primary">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
    </div>
    
  );
};

export default UserSignup;
