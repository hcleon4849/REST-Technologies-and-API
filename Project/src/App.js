// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import JoinQueue from './components/JoinQueue';
import BusinessLogin from './pages/BusinessLogin';
import UserLogin from './components/UserLogin';
import UserSignup from './components/UserSignup';
import BusinessHomepage from './pages/BusinessHomepage';
import LoginHomepage from './pages/LoginHomepage';
import CreateQueue from './components/CreateQueue';
import LeaveQueue from './components/LeaveQueue';
import LandingPage from './components/LandingPage';
import ManageQueue from './components/ManageQueue';
import MonitorPosition from './components/MonitorPosition';
import BusinessSignup from './pages/BusinessSignup';
import Dashboard from './components/Dashboard';
// Import other components

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/see-dashboard" element={<Dashboard />} />
        <Route path="/business-login" element={<BusinessLogin />} />
        <Route path="/business-signup" element={<BusinessSignup />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/business-homepage" element={<BusinessHomepage />} />
        <Route path="/login-homepage" element={<LoginHomepage />} />
        <Route path="/create-queue" element={<CreateQueue />} />
        <Route path="/join-queue" element={<JoinQueue />} />
        <Route path="/leave-queue" element={<LeaveQueue />} />
        <Route path="/manage-queue" element={<ManageQueue />} />
        <Route path="/manage-queue" element={<ManageQueue />} />
        <Route path="/monitor-position" element={<MonitorPosition />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        {/* Define other routes */}
      </Routes>
    </Router>
  );
};

export default App;
