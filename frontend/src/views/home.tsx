// frontend/src/views/home.tsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import RepoSubmit from '../Components/repoSubmit';

// define the data types expecting from the server 
interface UserData {
    username : string, 
    avatar: string,
    email: string | null
}


// define home componenet 
const Home: React.FC =() => {
    console.log('Home component rendering...');

    // initialize a state for the capturing the user data 
    const [userData, setUserData] = useState<UserData | null>(null);
    // initialize a state for error handling 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // fetch the user data from the backend
        fetch("http://localhost:8001/user", { credentials: "include" })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            return response.json();
        })
        .then((data) => {
            setUserData(data);
        })
        .catch((error) => {
            setError("Failed to fetch the user data");
            console.error(error);
        });
    });

    return (
        <div>
            { userData ? (
                <div>
                    <div>
                        <h2> Welcome, {userData.username}</h2>

                        <img src={userData.avatar} alt='Avatar'/>
                        
                        <p>Email: {userData.email || 'Not provided'}</p>

                    </div>
                    <div>
                        <RepoSubmit />
                    </div>
                </div>
            ): (
                <p>Loading user data ...</p>
            )}
        </div>
    )
};

export default Home;