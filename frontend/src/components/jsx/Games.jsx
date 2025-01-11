import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../PageElements/api';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid2';
import '../css/Home.css';
import '../css/AnimatedBackground.css';

const Games = () => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="animated-background">

    </div>
  );
};

export default Games;