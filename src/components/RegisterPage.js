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
  Box
} from '@mui/material';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await axios.post('https://maggiegptbackend-1.onrender.com/api/register', { name, email, password });
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration failed:', error);
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
        background: 'linear-gradient(135deg, #0f0f0f, #1f1f1f)'
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
            Register
          </Typography>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  sx={{ input: { color: '#E0E0E0' }, label: { color: '#9e9e9e' } }}
                />
              </Grid>
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
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ input: { color: '#E0E0E0' }, label: { color: '#9e9e9e' } }}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error" align="center">
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
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                </Button>
              </Grid>
            </Grid>
          </form>
          <Box mt={3} textAlign="center">
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              Already have an account?{' '}
              <a href="/login" style={{ color: '#00ADB5', textDecoration: 'none' }}>
                Login here
              </a>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
