import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Top.css';
import "../../assets/logoMYS.png";

const Data = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    const sessionId = params.get('session_id');

    if (accessToken && refreshToken && expiresIn) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('expires_in', expiresIn);
      localStorage.setItem('session_id', sessionId);
      console.log('Tokens saved to local storage');
    }

    navigate('/home');
  }, [navigate]);

  return (
    <div className="top-header">
      <img src={require("../../assets/logoMYS.png")} alt="Logo" className="logo" style={{ width: '60px', height: '60px' }} />
      <div className="title">SpoInfo</div>
      <div className="auth-buttons">
      </div>
    </div>
  );
}

export default Data;