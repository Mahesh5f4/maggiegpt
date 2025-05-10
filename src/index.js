import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router here
import App from './App';

// Use createRoot instead of render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>  {/* Wrap the entire App in Router */}
    <App />
  </Router>
);
