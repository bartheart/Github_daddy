import React from 'react';


const GitHubLogin: React.FC = () => {
    const handleLogin = () => {
        
        // redirect to FastAPI login route/endpoint to start Github OAuth
        window.location.href = 'http://localhost:8001/login'


        
    };

    return (
        <button onClick={handleLogin}>
            Login with GitHub
        </button>
    )
}

export default GitHubLogin;