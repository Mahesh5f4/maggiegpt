import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Container, CircularProgress } from '@mui/material';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // For loading spinner

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Simple validation for empty fields
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check if password is strong enough (optional)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError(''); // Clear any previous error messages
    setLoading(true); // Show loading spinner

    try {
      await axios.post('http://localhost:5001/api/register', { name, email, password });
      setLoading(false);
      navigate('/login'); // After successful registration, navigate to the login page
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration failed:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom align="center">
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
            <Button variant="contained" color="primary" fullWidth type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <br />
      <Typography align="center">
        Already have an account? <a href="/login">Login here</a>
      </Typography>
    </Container>
  );
};

export default RegisterPage;
