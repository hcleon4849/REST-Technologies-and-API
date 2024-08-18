import React from 'react';
import '../pages/LandingPage.css';
const LandingPage = () => {
  return (
    <div>
      <header className="header">
        <h1>Queue Management System</h1>
      </header>
      <section className="hero">
        <h2>Streamline Your Queue Management</h2>
        <p>Efficiently manage and monitor your queues with our easy-to-use system. Perfect for businesses of all sizes.</p>
      </section>
      <section className="features">
        <div className="feature">
          <h3>Easy Queue Setup</h3>
          <p>Quickly create and configure queues with a few simple steps.</p>
        </div>
        <div className="feature">
          <h3>Real-Time Monitoring</h3>
          <p>Track queue status and user positions in real-time.</p>
        </div>
        <div className="feature">
          <h3>Prioritization</h3>
          <p>Manage and prioritize queues to handle urgent requests efficiently.</p>
        </div>
      </section>
      <section className="cta">
        <h2>Get Started Today</h2>
        <p>Sign up now and start optimizing your queue management!</p>
        <a href="/signup">Sign Up</a>
      </section>
      <footer>
        <p>&copy; 2024 Queue Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
