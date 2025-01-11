import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import api from '../PageElements/api';
import '../css/AnimatedBackground.css';

const Home = () => {
  const [url, setUrl] = useState('');

  const handleLogIn = async () => {
    try {
      // Use the api instance with credentials
      const { data } = await api.get('/spotify/get-auth-url', {
        withCredentials: true
      });
      
      if (data.url) {
        // Store the session ID in localStorage before redirect
        if (data.session_id) {
          localStorage.setItem('spotify_session_id', data.session_id);
        }
        setUrl(data.url);
      }
    } catch (error) {
      console.error('Error fetching auth URL:', error);
    }
  };

  useEffect(() => {
    // Check if we're returning from Spotify auth
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      // We've returned from Spotify, redirect to the config page
      window.location.href = '/config';
    } else if (url) {
      window.location.href = url;
    }
  }, [url]);

  return (
    <div className='animated-background'>
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px', 
      marginTop: '10%' 
    }}>
      <Paper elevation={3} sx={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
        <Button 
          onClick={handleLogIn} 
          variant="contained"
          sx={{ 
            width: '100%', 
            padding: '10px',
            backgroundColor: "#1DB954", // Spotify green
            '&:hover': {
              backgroundColor: "#1ed760"
            }
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            Login With Spotify
          </Typography>
        </Button>
      </Paper>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ marginTop: 2, fontSize: '0.8em', color: 'gray' }}>
          <div>Session ID: {localStorage.getItem('spotify_session_id')}</div>
        </Box>
      )}
    </Box>
    </div>
  );
};

export default Home;