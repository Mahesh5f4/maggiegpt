import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ChatPage from './components/ChatPage';
import Footer from './components/Footer'; // Adjust path if needed

const App = () => {
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#0d0d0d',
    color: '#f1f1f1',
  };

  const contentStyle = {
    flex: '1',
  };

  return (
    <div style={appStyle}>
      <div style={contentStyle}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
