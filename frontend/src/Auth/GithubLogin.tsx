// frontend/src/views/home.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

// define login componenet 
const GithubLogin: React.FC =() => {
    const navigate = useNavigate();
    // define a function to handle the login button 
    const handleLogin = () => {
        // redirect it to the fastapi backend route to OAuth 
        window.location.href = "http://localhost:8001/login"
    };

    // test button 
    const handleTest = () => {
        

        navigate('/home');
    };

    return (
        <div>
            <button onClick={handleLogin}>Login with Github</button>
        
            <button onClick={handleTest}>Home</button>
        </div>
    )
};

export default GithubLogin;