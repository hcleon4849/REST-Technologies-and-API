import '../pages/MonitorPosition.css'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonitorPosition = () => {
  const [fullName, setFullName] = useState('');
  const [queues, setQueues] = useState([]);
  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    setFullName(e.target.value);
  };

const [loading, setLoading] = useState(false);

const handleSearch = async () => {
  setLoading(true);
  setError('');
  try {
    const response = await axios.get(`http://localhost:5000/api/queues/user/${fullName}`);
    setQueues(response.data);
  } catch (error) {
    setError('Error fetching queues for this name.');
    console.error('Error fetching queues:', error);
  } finally {
    setLoading(false);
  }
};
  const handleLeaveQueue = async (queueId) => {
    try {
      await axios.post(`http://localhost:5000/api/queues/${queueId}/leave`, { full_name: fullName });
      alert('Left the queue successfully!');
      // Update the list of queues after leaving one
      const response = await axios.get(`http://localhost:5000/api/queues/user/${fullName}`);
      setQueues(response.data);
    } catch (error) {
      setError('Error leaving the queue.');
      console.error('Error leaving the queue:', error);
    }
  };

  return (
    <div className="monitor-position-container">
      <h2>Monitor Position</h2>
      {error && <p className="error-message">{error}</p>}

      <label>
        Enter Your Full Name:
        <input
          type="text"
          value={fullName}
          onChange={handleNameChange}
          required
        />
      </label>
      <button onClick={handleSearch}>Search</button>

      {queues.length > 0 && (
        <div>
          <h3>Queues for {fullName}</h3>
          <table className="queue-table">
            <thead>
              <tr>
                <th>Queue Name</th>
                <th>Position</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queues.map((queue, index) => (
                <tr key={queue._id}>
                  <td>{queue.name}</td>
                  <td>{index + 1}</td> {/* Assuming queues are returned in order */}
                  <td>
                    <button onClick={() => handleLeaveQueue(queue._id)}>Leave Queue</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonitorPosition;
