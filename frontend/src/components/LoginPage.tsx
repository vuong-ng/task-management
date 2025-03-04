import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/v1/login', { name, password });
      if (response.status === 200) {
        const name = response.data.name;
        const id = response.data.id;
        const token = response.data.accessToken;
        localStorage.setItem("token", token);
        navigate('/home', {state: {name, id}});
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            textAlign="center"
            sx={{ mb: 4, fontWeight: 'medium' }}
          >
            Welcome Back
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="standard"
              value={name}
              onChange={(e) => setName(e.target.value)}
                          sx={{
                              mb: 3
               }}
              error={!!error}
            />

            <TextField
              fullWidth
              label="Password"
              variant="standard"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error}
              
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mb: 2,
                height: 48,
                textTransform: 'none',
                fontSize: '1.1rem',
              }}
            >
              Log In
            </Button>
          </form>

          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1 
            }}
          >
            <Typography color="text.secondary">
              Don't have an account?
            </Typography>
            <Button 
              onClick={() => navigate('/signup')}
              sx={{ textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;