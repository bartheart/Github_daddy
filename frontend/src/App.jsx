// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GitHubLogin from './views/GitHubLogin';
import GitHubCallback from './views/GitHubCallback';
import Match from './views/Match'; // Import the RepoInput component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route for the GitHub login page */}
        <Route path="/" element={<GitHubLogin />} />
        
        {/* Route for handling the GitHub callback */}
        <Route path="/callback" element={<GitHubCallback />} />
        
        {/* Route for the repository input form page */}
        <Route path="/match" element={<Match onSubmitRepo={(repoUrl) => console.log(repoUrl)} />} />
      </Routes>
    </Router>
  );
};

export default App;
