import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../PageElements/api';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Card, CardContent, CardActions, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid2';
import '../css/Home.css';
import '../css/AnimatedBackground.css';
import { Weight } from 'lucide-react';

const Songs = () => {
    const [loading, setLoading] = useState(true);
    const [songs, setSongs] = useState([]);

  return (
    
  );
};

export default Songs;