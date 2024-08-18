import '../pages/Homepage.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JoinQueue = () => {
  const [queues, setQueues] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeQueue, setActiveQueue] = useState(null);
  const [userName, setUserName] = useState('');
  const [userQueueInfo, setUserQueueInfo] = useState(null);
  const [userPosition, setUserPosition] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueues = async () => {
      const storedUserName = localStorage.getItem('username');
      if (storedUserName) {
        setUserName(storedUserName);
      } else {
        console.warn('Username not found in local storage.');
      }

      const token = localStorage.getItem('authToken'); // Ensure consistent key
      try {
        const response = await axios.get('http://localhost:5000/api/queues', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setQueues(response.data);
      } catch (error) {
        setError('Error fetching queues.');
      }
    };

    fetchQueues();
  }, [navigate]);

  const handleJoin = async () => {
    setError('');
    setSuccessMessage('');

    if (!userName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!activeQueue) {
      setError('No queue selected.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/queues/${activeQueue._id}/join`,
        { user_name: userName },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } }
      );

      if (response.status === 200) {
        const { user_id } = response.data;
        if (user_id) {
          const positionResponse = await axios.get(`http://localhost:5000/api/queues/position/${user_id}`);
          setUserPosition(positionResponse.data.position);
          setUserQueueInfo({
            queueName: activeQueue.name,
            position: response.data.position,
          });
          setSuccessMessage(`Successfully joined the ${activeQueue.name} queue! Your position is ${response.data.position}.`);
          setActiveQueue(null);
          setUserName('');
        } else {
          setError('User ID is missing.');
        }
      } else {
        setError('Failed to join the queue. Please try again.');
      }
    } catch (error) {
      setError('Error joining queue. Please try again.');
    }
  };

  const handleQueueClick = (queue) => {
    setActiveQueue(queue);
  };

  const handleLeaveQueue = async () => {
    if (!activeQueue) {
      alert('No queue selected.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `http://localhost:5000/api/queues/${activeQueue._id}/leave`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert('You have successfully left the queue.');
        setUserQueueInfo(null);
        setActiveQueue(null);
      } else {
        alert('Failed to leave the queue. Please try again.');
      }
    } catch (error) {
      alert('Error leaving queue. Please try again.');
    }
  };

  const closeModal = () => {
    setActiveQueue(null);
    setUserName('');
    setUserPosition(null);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/join-queue">Join Queue</Link></li>
          <li><Link to="/leave-queue">Leave Queue</Link></li>
          <li><Link to="/monitor-position">Monitor Position</Link></li>
        </ul>
      </nav>

      <h2>Available Queues</h2>
      {/* {error && <p className="error">{error}</p>} */}
      {successMessage && <p className="success">{successMessage}</p>}

      <table className="queue-table">
        <thead>
          <tr>
            <th>Queue Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {queues.map(queue => (
            <tr key={queue._id}>
              <td>{queue.name}</td>
              <td>
                <button type="button" onClick={() => handleQueueClick(queue)}>
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeQueue && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {/* {error && <p className="error">{error}</p>} */}
            {successMessage && <p className="success">{successMessage}</p>}
            <h2>Join Queue</h2>
            <p>Queue: {activeQueue.name}</p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
            />
            <button type="button" onClick={handleJoin}>
              Join Queue
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Queue Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default JoinQueue;
