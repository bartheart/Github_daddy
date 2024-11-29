import React, { useEffect, useState } from 'react';

interface UserData {
    username: string;
    avatar: string;
    email: string | null;
}

const GitHubCallback: React.FC = () => {
    const [ UserData, setUserData ] = useState<UserData | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        // get the code query parameter from the url 
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // send the 'code' to the backedn for processing 
            fetch(`http://localhost:8000/callback?code=${code}`)
                .then((response) => response.json())
                .then((data) => {
                    // set user data to state 
                    setUserData(data);
                })
                .catch((err) => {
                    setError('Failed to fetch user data')
                    console.error(err);
                });
            } else {
                setError('Authorization code is missing');
            }
    }, []);

    if (error) {
        return <div>{error}</div>
    }

    return (
        <div>
            {UserData ? (
                <div>
                    <h2>Welcome, {UserData.username}</h2>
                    <img src={UserData.avatar} alt='Avatar'/>
                    <p>Email: {UserData.email}</p>
                </div>
            ): (
                <p>Loading user data ...</p>
            )}
        </div>

    );
};

export default GitHubCallback