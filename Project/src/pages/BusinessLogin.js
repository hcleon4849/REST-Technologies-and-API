
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BusinessLogin.css'

const BusinessLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/business-login', { email, password });
      if (response.status === 200) {
        // Save token or user session information here (e.g., localStorage)
        localStorage.setItem('token', response.data.token); // Update based on your response
        navigate('/business-homepage');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-background">
    <div className="login-container">
      <h2>Business Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn-primary">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  </div>
);
};

export default BusinessLogin;
