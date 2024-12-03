// frontend/src/views/home.tsx

import React, { useEffect, useState } from 'react';
import routes from '../routes';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
    // initialize the navigate componenet
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        // capture the url parameters back from the server
        //const urlParams = new URLSearchParams(window.location.search)

        // get the username, email and avatar for the user 
        const username = searchParams.get('username');
        const email = searchParams.get('email');
        const avatar = searchParams.get('avatar');

        // check if the username and avatar is returned
        if (username && avatar) {
            // set userdata state 
            setUserData({
                username,
                avatar,
                email: email || null
            });
        } else {
            navigate('/');
        }
    }, [searchParams, navigate]);

    return (
        <div>
            { userData ? (
                <div>
                    <h2> Welcome, {userData.username}</h2>

                    <img src={userData.avatar} alt='Avatar'/>
                    
                    <p>Email: {userData.email || 'Not provided'}</p>

                </div>
            ): (
                <p>Loading user data ...</p>
            )}
        </div>
    )
};

export default Home;