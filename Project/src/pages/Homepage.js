// src/pages/Homepage.js
import './Homepage.css';  
import home_img from '../images/home_img.png';


import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div>
      
        <nav className="navbar">
            <ul>
                <li>
                <Link to="/">Home</Link>
                </li>
                <li>
                <Link to="/user-signup">User Signup</Link>
                </li>
                <li>
                <Link to="/user-login">User Login</Link>
                </li>
                <li>
                <Link to="/business-login">Business Login</Link>
                </li>
                <li>
                <Link to="/business-signup">Business Signup</Link>
                </li>
                <li>
                <Link to="/LandingPage">LandingPage</Link>
                </li>
                
            </ul>
      </nav>
      
      <div className="home-row">
        <div className="home-column">
          <div className="home-welcome">
            <h2>Welcome to MyWaitList</h2>
            <p>We can help businesses  save time and improve their customer experience.</p>
          </div>
          
        </div>
        <div class="home-column">
          <img src={home_img} alt="people in queue" className="home-image" />
        </div>
      </div>

      <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Queue Management System. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
};

export default Homepage;
