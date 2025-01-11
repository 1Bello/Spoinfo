import React from 'react';
import '../css/Top.css';
import "../../assets/logoMYS.png";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Top = () => {
  const [url, setUrl] = useState('');


  return (
    <div className="top-header">
      <img src={require("../../assets/logoMYS.png")} alt="Logo" className="logo" style={{ width: '60px', height: '60px' }} />
      <div className="title">SpoInfo</div>
      <div className="auth-buttons">
      </div>
    </div>
  );
}

export default Top;