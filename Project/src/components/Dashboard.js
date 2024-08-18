import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/Homepage.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  const [stats, setStats] = useState({
    total_queues: 0,
    total_users: 0,
    queues_with_users: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/queues/stats');
        setStats(response.data);
      } catch (error) {
        setError('Error fetching stats.');
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className='stats-heading'>Queue Management Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="dashboard-stats">
        <div className="stat-card">
          <FontAwesomeIcon icon={faList} className="icon" />
          <h3>Total Queues</h3>
          <p>{stats.total_queues}</p>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faUser} className="icon" />
          <h3>Total Users</h3>
          <p>{stats.total_users}</p>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faUsers} className="icon" />
          <h3>Queues with Users</h3>
          <p>{stats.queues_with_users}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
