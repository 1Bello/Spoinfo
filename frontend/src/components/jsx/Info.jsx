import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../PageElements/api';
import { Box, Typography, Card, CardContent, CircularProgress, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2';
import '../css/Home.css';
import '../css/AnimatedBackground.css';

const SpotifyPlayer = ({ songUrls }) => {
    return (
      <div>
        {songUrls.map((songUrl, index) => (
          <div key={index} style={{ marginBottom: "20px", textAlign: "center" }}>
            <iframe
              src={`https://open.spotify.com/embed/track/${songUrl.split("/track/")[1]}`}
              width="300"
              height="80"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
              title={`Spotify Player ${index}`}
            ></iframe>
          </div>
        ))}
      </div>
    );
  };
  

const Info = () => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [top5Tracks, setTop5Tracks] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const token = localStorage.getItem('spotify_session_id');
  const navigate = useNavigate();

  useEffect(() => {
       if (token) {
        setAuth(true);
      } else {
        setAuth(false);
        navigate('/');
       }
    }, []);

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
          const [topTracksRes] = await Promise.all([
            api.get(`/spotify/user-top-items?session_id=${sessionId}&access_token=${accessToken}`, {
              withCredentials: true
            }),
          ]);
          const topTracksData = topTracksRes.data.slice(0, 5); // Extract top 5 tracks
          setTop5Tracks(topTracksData);
          setTopTracks(topTracksRes.data);
          console.log(topTracksData);

          const artistIds = [
            ...new Set(
              topTracksRes.data.flatMap((track) =>
                track.artists.map((artist) => artist.id)
              )
            ),
          ];

          const artistDetails = await Promise.all(
            artistIds.map((id) =>
              api.get(
                `/spotify/artist-details/${id}?access_token=${accessToken}`,
                {
                  withCredentials: true,
                }
              )
            )
          );

          const genres = {};
          artistDetails.forEach(({ data: artist }) => {
            artist.genres.forEach((genre) => {
              genres[genre] = (genres[genre] || 0) + 1;
            });
          });

          const SortedGenres = Object.keys(genres).sort((a, b) => genres[b] - genres[a]).slice(0, 5);
          setTopGenres(SortedGenres);
          
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return (
        <div className="animated-background" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress size={70} color='white' />
        </div>
      );
    }

  const TopArtists = () => {
    const artists = {};
    topTracks.forEach((track) => {
      track.artists.forEach((artist) => {
        if (artists[artist.name]) {
          artists[artist.name] += 1;
        } else {
          artists[artist.name] = 1;
        }
      });
    });

    const sortedArtists = Object.keys(artists).sort((a, b) => artists[b] - artists[a]);
    return sortedArtists.slice(0, 5);
  }

  const TopGenres = () => {
    const genres = {};
    topTracks.forEach((track) => {
      track.genres.forEach((genre) => {
        if (genres[genre]) {
          genres[genre] += 1;
        } else {
          genres[genre] = 1;
        }
      });
    });

    const sortedGenres = Object.keys(genres).sort((a, b) => genres[b] - genres[a]);
    return sortedGenres.slice(0, 5);
  }

  return (
    <div className="animated-background">
      <Grid container spacing={1} justifyContent="center" marginTop={8} >
        <Card sx={{ minWidth: 275, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardContent >
            <Typography variant="h5" component="div" padding={1}>
              User Info
            </Typography>
          </CardContent>
          <IconButton onClick={() => navigate('/home')} sx={{ marginRight: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Card>
      </Grid>
      <Grid container spacing={1} justifyContent="center" marginTop={2} >
        <Grid item xs={12} md={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div" padding={1} >
                Top 5 Current Songs
              </Typography>
              {top5Tracks.map((track, index) => (
            <div key={index}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '5px' }}>
                <SpotifyPlayer songUrls={[track.external_urls.spotify]} />
              </Box>
            </div>
          ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div" padding={1} >
                Top 5 Current Artists
              </Typography>
              {TopArtists().map((artist, index) => (
                <div key={index}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '5px' }}>
                    <Typography variant="h6" component="div" padding={1} >
                      {artist}
                    </Typography>
                  </Box>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div" padding={1} >
                Top 5 Current Genres
              </Typography>
              {topGenres.map((genre, index) => (
            <div key={index}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '5px' }}>
                    <Typography variant="h6" component="div" padding={1} >
                      {genre}
                    </Typography>
                  </Box>
            </div>
          ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Info;