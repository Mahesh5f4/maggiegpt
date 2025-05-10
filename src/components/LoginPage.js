import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Container } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/login', { email, password });
      localStorage.setItem('token', response.data.token); // Store JWT token
      navigate('/chat'); // Navigate to the chat page after successful login
    } catch (error) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom align="center">
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
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          {error && (
            <Grid item xs={12}>
              <Typography color="error" align="center">{error}</Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
      <br />
      <Typography align="center">
        Don't have an account? <a href="/register">Register here</a>
      </Typography>
    </Container>
  );
};

export default LoginPage;
