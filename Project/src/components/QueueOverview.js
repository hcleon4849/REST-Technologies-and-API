import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QueueOverview = () => {
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await axios.get('/api/queues');
        setQueues(response.data);
      } catch (error) {
        console.error("Error fetching queues", error);
      }
    };
    fetchQueues();
  }, []);

  return (
    <div>
      <h2>Queue Overview</h2>
      <ul>
        {queues.map(queue => (
          <li key={queue.id}>{queue.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default QueueOverview;
