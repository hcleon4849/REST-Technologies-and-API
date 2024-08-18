import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <h1>Queue Management System</h1>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/create_queue">Create Queue</Link>
      <Link to="/queue_position">Queue Position</Link>
    </nav>
  </header>
);

export default Header;
