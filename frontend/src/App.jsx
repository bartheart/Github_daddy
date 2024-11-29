// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GitHubLogin from './components/GitHubLogin';
import GitHubCallback from './components/GitHubCallback';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the GitHub login page */}
        <Route path="/" element={<GitHubLogin />} />
        
        {/* Route for handling the GitHub callback */}
        <Route path="/callback" element={<GitHubCallback />} />
      </Routes>
    </Router>
  );
};

export default App;
