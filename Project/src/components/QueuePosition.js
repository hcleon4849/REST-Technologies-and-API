import React, { useState } from 'react';
import axios from 'axios';

const QueuePosition = () => {
  const [userId, setUserId] = useState('');
  const [position, setPosition] = useState(null);

  const handleCheckPosition = async () => {
    try {
      const response = await axios.get(`/api/queues/position/${userId}`);
      setPosition(response.data.position);
    } catch (error) {
      console.error("Error fetching position", error);
    }
  };

  return (
    <div>
      <h2>Queue Position</h2>
      <label>
        User ID:
        <input 
          type="text" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
        />
      </label>
      <button onClick={handleCheckPosition}>Check Position</button>
      {position !== null && <p>Your position: {position}</p>}
    </div>
  );
};

export default QueuePosition;
