import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../PageElements/api';
import {  Typography, Card, CardContent, ImageList, ImageListItem, IconButton, ImageListItemBar, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2';
import '../css/Home.css';
import '../css/AnimatedBackground.css';
import '../css/Playlist.css';
import { Weight } from 'lucide-react';

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
          console.log(PlaylistsRes.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlaylistClick = (playlist, index) => {
    navigate(`/playlists/${index}`, { state: { playlist } });
  };

  if (loading) {
    return (
      <div className="animated-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={70} color='white' />
      </div>
    );
  }

  return (
    <div className="animated-background">
      <Grid container spacing={1} justifyContent="center" marginTop={12} >
        <Grid item xs={12} md={6}>
          <Card sx={{ minWidth: 275, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardContent >
              <Typography variant="h5" component="div" padding={1}>
                Playlists
              </Typography>
            </CardContent>
            <IconButton onClick={() => navigate('/home')} sx={{ marginRight: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          </Card>
          <ImageList className='image-list' sx={{ width: 550, height: 450 }} cols={3} rowHeight={164}>
            {playlists.map((item, index) => (
              <ImageListItem key={item.id} className="image-link" onClick={() => handlePlaylistClick(item, index)}>
                <Link className="image-link">
                  <img src={item.images[0]?.url} alt={item.name} />
                </Link>
                <ImageListItemBar
                  title={item.name}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
      </Grid>
    </div>
  );
};

export default Playlists;