import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
    username: string;
    avatar: string;
    email: string | null;
}

const GitHubCallback: React.FC = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            fetch(`http://localhost:8000/callback?code=${code}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("User data fetched:", data);
                    setUserData(data);  // Set user data to state
                    navigate('/match');  // Navigate to '/match' once data is set
                })
                .catch((err) => {
                    setError('Failed to fetch user data');
                    console.error(err);
                });
        } else {
            setError('Authorization code is missing');
        }
    }, [navigate]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {userData ? (
                <div>
                    <h2>Welcome, {userData.username}</h2>
                    <img src={userData.avatar} alt="Avatar" />
                    <p>Email: {userData.email}</p>
                </div>
            ) : (
                <p>Loading user data...</p> // Show loading message until user data is available
            )}
        </div>
    );
};

export default GitHubCallback;
