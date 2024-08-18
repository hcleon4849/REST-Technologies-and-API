import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewQueues() {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/queues');
        setQueues(response.data);
      } catch (error) {
        console.error('Error fetching queues:', error);
      }
    };
    fetchQueues();
  }, []);

  return (
    <div>
      <h1>View Queues</h1>
      <ul>
        {queues.map((queue) => (
          <li key={queue._id}>{queue.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ViewQueues;
