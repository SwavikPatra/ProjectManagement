import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home.js';
import Signup from './components/Signup.js';
import Login from './components/Login.js';
import CreateGroup from './components/CreateGroup.js';
import GroupView from './components/GroupView.js';
import CreateTask from './components/CreateTask.js';
// import Logout from './components/Logout.js';
import Navbar from './components/Navbar.js';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Function to check if the user is authenticated
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/checkAuth', { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      setIsLoggedIn(false);
      // Redirect to home or login page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/group/group-view/:id" element={<GroupView />} />
          <Route path="/group/:id/create-task" element={<CreateTask />} />
          {/* <Route path="/logout" element={<Logout />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
