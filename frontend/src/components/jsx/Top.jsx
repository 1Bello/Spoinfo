import React from 'react';
import '../css/Top.css';
import "../../assets/logoMYS.png";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const Top = () => {
  const [url, setUrl] = useState('');
  const token = localStorage.getItem('spotify_session_id');
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('spotify_session_id');
    navigate('/');
  };

  return (
    <div className="top-header">
      <div className="title">SpoInfo</div>
      {token ? (
        <div className="login-logout-btn">
          <Typography onClick={handleLogOut} style={{ cursor: 'pointer' }}>Log Out</Typography>
        </div>
      ) : null }
    </div>
  );
}

export default Top;