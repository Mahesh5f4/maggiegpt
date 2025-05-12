import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  CircularProgress,
  Paper,
  Box,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post('https://maggiegptbackend-1.onrender.com/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/chat'); 
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#121212',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f0f0f, #1f1f1f)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(30, 30, 30, 0.75)',
            borderRadius: 4,
            boxShadow: '0 0 25px rgba(0, 173, 181, 0.3)',
            color: '#E0E0E0'
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#00ADB5' }}>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{ input: { color: '#E0E0E0' }, label: { color: '#9e9e9e' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    style: { backgroundColor: '#333', color: '#E0E0E0' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{ color: '#E0E0E0' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error" align="center" sx={{ color: '#ff4081' }}>
                    {error}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={loading}
                  sx={{
                    bgcolor: '#00ADB5',
                    ':hover': { bgcolor: '#00cfd6' },
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </form>
          <Box mt={3} textAlign="center">
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color: '#00ADB5', textDecoration: 'none' }}>
                Register here
              </a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
