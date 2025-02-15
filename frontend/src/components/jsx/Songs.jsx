import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../PageElements/api';
import { Box, Typography, Card, CardContent, ImageList, ImageListItem, ImageListItemBar, Button, IconButton, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import '../css/Playlist.css';
import '../css/AnimatedBackground.css';

import songIcon from '../../assets/song.png';
import ultIcon from '../../assets/ult.png';

const Songs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playlist } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionId = localStorage.getItem('session_id');
        const accessToken = localStorage.getItem('access_token');

        const [SongsRes] = await Promise.all([
          api.get(`/spotify/playlist-details/${playlist.id}/?session_id=${sessionId}&access_token=${accessToken}&playlist_id=${playlist.id}`, {
            withCredentials: true
          }),
        ]);
        setSongs(SongsRes.data.tracks);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playlist]);

  if (loading) {
    return (
      <div className="animated-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={70} color='white' />
      </div>
    );
  }

  return (
    <div className="animated-background">
      <Grid container spacing={1} justifyContent="center" marginTop={12}>
        <Grid item xs={12} md={6}>
          <Card sx={{ minWidth: 275, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardContent>
              <Typography variant="h5" component="div" padding={1}>
                {playlist.name}
              </Typography>
            </CardContent>
            <div>
              <IconButton onClick={() => navigate('/playlists')} sx={{ marginRight: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <IconButton onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} sx={{ marginRight: 2 }}>
                {viewMode === 'grid' ? <ViewListIcon /> : <GridViewIcon />}
              </IconButton>
            </div>
          </Card>

          {/* Conditional rendering based on view mode */}
          {viewMode === 'grid' ? (
            <ImageList sx={{ width: 550, height: 450 }} cols={3} rowHeight={164} className='image-list'>
              {songs.map((item) => (
                <ImageListItem key={item.track.id} className="image-song">
                  <div className="image-container">
                    <img 
                      src={item.track.album.images[0]?.url} 
                      alt={item.track.name} 
                      className="song-image" 
                    />
                  </div>
                  <ImageListItemBar
                    title={item.track.name}
                    className="image-list-item-bar"
                    subtitle={item.track.artists.map((artist) => artist.name).join(', ')}
                  />
                  <div className="song-buttons">
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => window.open(`https://www.songsterr.com/?pattern=${item.track.name}`, '_blank')}
                    >
                      <img src={songIcon} alt="Song" />
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => window.open(`https://www.ultimate-guitar.com/search.php?search_type=title&value=${item.track.name}`, '_blank')}
                    >
                      <img src={ultIcon} alt="Ultimate" />
                    </Button>
                  </div>
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <TableContainer component={Paper} className='table-container' sx={{ maxHeight: 450, overflow: 'auto', marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className='table-header'><Typography fontWeight="bold">Song</Typography></TableCell>
                    <TableCell className='table-header'><Typography fontWeight="bold">Artist</Typography></TableCell>
                    <TableCell className='table-header'><Typography fontWeight="bold">Tabs</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {songs.map((item) => (
                    <TableRow key={item.track.id}>
                      <TableCell>{item.track.name}</TableCell>
                      <TableCell>{item.track.artists.map((artist) => artist.name).join(', ')}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => window.open(`https://www.songsterr.com/?pattern=${item.track.name}`, '_blank')}>
                          <img src={songIcon} alt="Song" className='song-buttons-list'/>
                        </IconButton>
                        <IconButton onClick={() => window.open(`https://www.ultimate-guitar.com/search.php?search_type=title&value=${item.track.name}`, '_blank')}>
                          <img src={ultIcon} alt="Ultimate" className='song-buttons-list' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Songs;
