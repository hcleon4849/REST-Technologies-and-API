import '../pages/LeaveQueue.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LeaveQueue() {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the username from local storage or any other source
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      console.warn('No username found in local storage.');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userName) {
      setError('Username is required.');
      return;
    }

    try {
      // Ensure the endpoint matches the Flask route
      await axios.post('http://localhost:5000/api/leave', { username: userName });
      alert('Left queue successfully!');
      setError('');
    } catch (error) {
      console.error('Error leaving queue:', error);
      setError('Error leaving queue. Please try again.');
    }
  };

  return (
    
    <div className="leave-queue-container">
      <h1>Leave Queue</h1>
      <form onSubmit={handleSubmit}>
        <label>
          User Name:
          <input type="text" value={userName} readOnly /> 
        </label>
        <br />
        <button type="submit">Leave Queue</button>
        {/* {error && <p className="error-message">{error}</p>} */}
      </form>
    </div>
  );
}

export default LeaveQueue;
