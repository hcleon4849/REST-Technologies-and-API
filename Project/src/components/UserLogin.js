

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Define error state
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/user-login', {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('Login successful:', data);
        localStorage.setItem('username', username);
        localStorage.setItem('token', response.data.token);
        // Redirect to business homepage
        navigate('/join-queue');
      } else {
        setError('Login failed. Please try again.');
        console.error('Login failed:', response.statusText);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    }
  };

  return (
    <div className="login-background">
         <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
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
        <button type="submit" className="btn-primary">Login</button>
        {error && <p className="error-message">{error}</p>} 
      </form>
    </div>
    </div>
   
  );
};

export default UserLogin;
