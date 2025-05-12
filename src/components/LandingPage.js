import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { styled, keyframes } from '@mui/system';

// Keyframe animations
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 10px #00e5ff, 0 0 20px #00e5ff, 0 0 30px #00e5ff;
  }
  100% {
    box-shadow: 0 0 20px #00bcd4, 0 0 30px #00bcd4, 0 0 40px #00bcd4;
  }
`;

// Styled container with advanced background
const Container = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  position: 'relative',
  overflow: 'hidden',
  padding: theme.spacing(2),
}));

// Glassmorphic Card
const GlassCard = styled(Box)(({ theme }) => ({
  backdropFilter: 'blur(20px)',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '20px',
  padding: theme.spacing(6),
  textAlign: 'center',
  color: '#fff',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  zIndex: 2,
  border: '1px solid rgba(255, 255, 255, 0.18)',
}));

// Animated Button with glow and hover effect
const ExploreButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: '14px 32px',
  borderRadius: '50px',
  fontSize: '18px',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #00e5ff, #00bcd4)',
  color: '#fff',
  textTransform: 'none',
  transition: 'all 0.4s ease',
  animation: `${float} 3s ease-in-out infinite`,
  '&:hover': {
    animation: `${glow} 1.5s infinite alternate`,
    background: 'linear-gradient(135deg, #00bcd4, #00e5ff)',
    transform: 'translateY(-5px)',
  },
}));

const LandingPage = () => {
  const navigate = useNavigate();

  const handleExploreNow = () => {
    navigate('/login');
  };

  return (
    <Container>
      <GlassCard>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          Welcome to <span style={{ color: '#00e5ff' }}>MaggieGPT</span>
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2, color: '#cfd8dc' }}>
          Your intelligent assistant, powered by the best of AI.
        </Typography>
        <ExploreButton onClick={handleExploreNow}>
          Explore Now
        </ExploreButton>
      </GlassCard>
    </Container>
  );
};

export default LandingPage;
