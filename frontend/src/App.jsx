import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/jsx/Home.jsx';
import Navbar from './components/jsx/Navbar.jsx';
import Top from './components/jsx/Top.jsx';
import SignUp from './components/jsx/SignUp.jsx';
import Login from './components/jsx/Login.jsx';
import UserConfig from './components/jsx/userConfig.jsx';
import Data from './components/jsx/Data.jsx';
import Info from './components/jsx/Info.jsx';
import Playlists from './components/jsx/Playlists.jsx';
import Games from './components/jsx/Games.jsx';
import Songs from './components/jsx/Songs.jsx';

function App() {
  return (
    <Router>
      <Top />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={< SignUp/>} />
        <Route path="/home" element={<UserConfig/>} />
        <Route path="*" element={<div><h1>Page Not Found</h1></div>} />
        <Route path="/data" element={<Data/>} />
        <Route path="/info" element={< Info/>} />
        <Route path="/playlists" element={< Playlists/>} />
        <Route path="/playlists/:id" element={< Songs/>} />
        <Route path="/games" element={< Games/>} />
      </Routes>
      <Navbar />
    </Router>
  );
}

export default App;
