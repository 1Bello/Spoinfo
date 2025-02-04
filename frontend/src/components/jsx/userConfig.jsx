import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../PageElements/api';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid2';
import '../css/Home.css';
import '../css/AnimatedBackground.css';

const UserConfig = () => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();


  const handleMouseEnter = (panel) => (event) => {
    setExpanded(panel);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };


  return (
    <div className='animated-background'>
      {auth ? (
        <div>   
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px'}}>
            <Grid container spacing={7} justifyContent="center">
              <Grid item xs={6} md={4}>
                <Accordion
                expanded={expanded === 'panel1'}
                onMouseEnter={handleMouseEnter('panel1')}
                onMouseLeave={handleMouseLeave}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    
                  >
                    <Typography padding={1}>Info</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button onClick={() => navigate('/info')}>
                      Go to Info
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={6} md={4}>
                <Accordion
                expanded={expanded === 'panel2'}
                onMouseEnter={handleMouseEnter('panel2')}
                onMouseLeave={handleMouseLeave}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography padding={1}>Playlists</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button onClick={() => navigate('/playlists')}>
                      Go to Playlists
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={6} md={4}>
                <Accordion
                expanded={expanded === 'panel3'}
                onMouseEnter={handleMouseEnter('panel3')}
                onMouseLeave={handleMouseLeave}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                  >
                    <Typography padding={1}>Games?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button onClick={() => navigate('/games')}>
                      Go to Games
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
        </div>
      ) : (
        <div>
          <h1>Not Authenticated</h1>
        </div>
      )}
    </div>
  );
};

export default UserConfig;