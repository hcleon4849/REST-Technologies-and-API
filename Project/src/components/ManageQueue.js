import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/Homepage.css';

function ManageQueue() {
  const [queues, setQueues] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedUsers, setSelectedUsers] = useState(new Set()); // Track selected users
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/queues', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setQueues(response.data);

        // Extract unique user IDs
        const userIds = new Set();
        response.data.forEach(queue => {
          queue.users && queue.users.forEach(userId => userIds.add(userId));
        });

        // Fetch user details
        if (userIds.size > 0) {
          const userResponse = await axios.get('http://localhost:5000/api/users', {
            params: { ids: Array.from(userIds) },
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          console.log('User details fetched:', userResponse.data); // Add logging for debugging
          const userDetails = userResponse.data.reduce((acc, user) => {
            acc[user._id] = { username: user.username, id: user._id };
            return acc;
          }, {});
          setUsers(userDetails);
        }
      } catch (error) {
        setError('Error fetching queues.');
        console.error('Error fetching queues:', error);
      }
    };

    fetchQueues();
  }, []);

  const handleUserSelection = (userId, isSelected) => {
    setSelectedUsers(prevSelected => {
      const updated = new Set(prevSelected);
      if (isSelected) {
        updated.add(userId);
      } else {
        updated.delete(userId);
      }
      return updated;
    });
  };

  const handleProcessQueue = async (queueId) => {
    try {
      // Send selected users to be processed with the queue
      await axios.post(`http://localhost:5000/api/queues/${queueId}/process`, { userIds: Array.from(selectedUsers) }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Queue processed successfully!');
      // Refresh the list of queues
      const response = await axios.get('http://localhost:5000/api/queues', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setQueues(response.data);

      // Refresh user details if needed
      const userIds = new Set();
      response.data.forEach(queue => {
        queue.users && queue.users.forEach(userId => userIds.add(userId));
      });
      if (userIds.size > 0) {
        const userResponse = await axios.get('http://localhost:5000/api/users', {
          params: { ids: Array.from(userIds) },
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('User details after processing:', userResponse.data); // Add logging for debugging
        const userDetails = userResponse.data.reduce((acc, user) => {
          acc[user._id] = { username: user.username, id: user._id };
          return acc;
        }, {});
        setUsers(userDetails);
      }
    } catch (error) {
      setError('Error processing queue.');
      console.error('Error processing queue:', error);
    }
  };

  return (
    <div>
      <h1>Manage Queue</h1>
      {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
      
      <table className="queue-table">
        <thead>
          <tr>
            <th>Queue Name</th>
            <th>Users</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queues.map(queue => (
            <tr key={queue._id}>
              <td>{queue.name}</td>
              <td>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}> {/* Remove bullet points */}
                  {queue.users && queue.users.length > 0 ? queue.users.map(userId => (
                    <li key={userId}>
                      <input
                        type="checkbox"
                        onChange={(e) => handleUserSelection(userId, e.target.checked)}
                      />
                      {users[userId]?.username || userId} {/* Display user name */}
                    </li>
                  )) : <li>No users</li>}
                </ul>
              </td>
              <td>
                <button onClick={() => handleProcessQueue(queue._id)}>Process Queue</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageQueue;
