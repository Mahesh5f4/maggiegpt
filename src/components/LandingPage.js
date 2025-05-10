import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/system';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();  // Access MUI's theme for consistency in colors and fonts

  const handleExploreNow = () => {
    navigate('/login');
  };

  // Custom styling for the landing page container
  const Container = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a202c, #2d3748)', // Dark gradient background
    color: '#fff',
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(2),
  }));

  // Custom button styling with 3D-like hover effect
  const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#4CAF50',
    fontSize: '18px',
    fontWeight: 600,
    padding: '15px 30px',
    color: '#fff',
    textTransform: 'none',
    borderRadius: '8px',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',  // 3D shadow effect
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',  // Button lifts on hover
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
    },
  }));

  return (
    <Container>
      <Typography variant="h3" sx={{ marginBottom: 3, fontWeight: 700 }}>
        Welcome to Chatbot
      </Typography>
      <StyledButton onClick={handleExploreNow}>
        Explore Now
      </StyledButton>
    </Container>
  );
};

export default LandingPage;
