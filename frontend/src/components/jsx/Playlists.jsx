import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../PageElements/api';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid2';
import '../css/Home.css';
import '../css/AnimatedBackground.css';

const Playlists = () => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionId = localStorage.getItem('session_id');
        const accessToken = localStorage.getItem('access_token');

        const { data } = await api.get(`/spotify/is-authenticated?session_id=${sessionId}`, {
          withCredentials: true
        });
        
        setAuth(data.status);

        if (true) {
          const [PlaylistsRes] = await Promise.all([
            api.get(`/spotify/user-playlists?session_id=${sessionId}&access_token=${accessToken}`, {
              withCredentials: true
            }),
          ]);
          setPlaylists(PlaylistsRes.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animated-background">

    </div>
  );
};

export default Playlists;