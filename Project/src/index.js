import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the updated import
import App from './App';
import './index.css';

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
