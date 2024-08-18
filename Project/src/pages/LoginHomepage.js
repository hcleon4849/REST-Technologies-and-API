import React from 'react';
import './BusinessHomepage.css';
// import home_img from '../images/home_img.png';


const LoginHomepage = () => {
  return (
    <div>
        <header>
            <nav className="navbar">
                <ul>
                    {/* <li>
                        <a href="/">Home</a>
                    </li> */}
                
                    <li>
                        <a href="/join-queue">Join Queue</a>
                    </li>
                    <li>
                        <a href="/monitor-position">Monitor Position</a>
                </li>
                </ul>
            </nav>
        </header>
        
      
      {/* <div class="home-row">
        <div class="home-column">
          <div class="home-welcome">
            <h2>Welcome to MyWaitList Business</h2>
            <p>Manage your queues efficiently with our comprehensive dashboard.
              Here, you can create new queues, monitor their performance, and 
              handle customer interactions with ease</p>
          </div>
          
        </div>
        <div class="home-column">
          <img src={home_img} alt="people in queue" className="home-image" />
        </div>
      </div> */}

      <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Queue Management System. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
};

export default LoginHomepage;
