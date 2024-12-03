// frontend/src/views/home.tsx

import React from 'react';

// define login componenet 
const GithubLogin: React.FC =() => {

    // define a function to handle the login button 
    const handleLogin = () => {
        // redirect it to the fastapi backend route to OAuth 
        window.location.href = "http://localhost:8001/login"
    };

    return (
        <button onClick={handleLogin}>Login with Github</button>
    )
};

export default GithubLogin;