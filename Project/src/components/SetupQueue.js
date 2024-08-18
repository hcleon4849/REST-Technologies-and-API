import React, { useState } from 'react';
import axios from 'axios';

function SetupQueue() {
  const [queueName, setQueueName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Replace with your API endpoint
      await axios.post('http://localhost:5000/api/queue', { name: queueName });
      alert('Queue created successfully!');
    } catch (error) {
      console.error('Error creating queue:', error);
    }
  };

  return (
    <div>
      <h1>Setup Queue</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Queue Name:
          <input type="text" value={queueName} onChange={(e) => setQueueName(e.target.value)} required />
        </label>
        <button type="submit">Create Queue</button>
      </form>
    </div>
  );
}

export default SetupQueue;
