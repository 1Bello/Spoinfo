import React from 'react';
import '../css/Top.css';
import "../../assets/logoMYS.png";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const Top = () => {
  const [url, setUrl] = useState('');


  return (
    <div className="top-header">
      <div className="title">SpoInfo</div>
      <div className="auth-buttons">
      </div>
    </div>
  );
}

export default Top;