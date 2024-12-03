// frontend/src/views/home.tsx

import React, { useEffect, useState } from 'react';
import routes from '../routes';
import { data, useNavigate } from 'react-router-dom';
import { URLSearchParams } from 'url';

// define the data types expecting from the server 
interface UserData {
    username : string, 
    avatar: string,
    email: string | null
}


// define home componenet 
const Home: React.FC =() => {
    // initialize a state for the capturing the user data 
    const [userData, setUserData] = useState<UserData | null>(null);
    // initialize a state for error handling 
    const [error, setError] = useState<string | null>(null);
    // initialize the navigate componenet
    const navigate = useNavigate();


    useEffect(() => {
        // capture the secret code back from github auth 
        const urlParams = new URLSearchParams(window.location.search)

        // get the code 
        const code = urlParams.get('code')

        // check if we got code back 
        if (code) {
            // fetch the userdata from the server
            fetch(`http://localhost:8001/callback?code=${code}`, {
                method: 'GET', // explicitly set method
                credentials: 'include', // if you need to send cookies
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    // if we got no response 
                    if (!response.ok) {
                        throw new Error("Failed to fetch user data");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("about to set the data");
                    // set the user data 
                    setUserData(data);
                    // output a message with the data fetched 
                    console.log("User data fetched: " , {data});
                })
                .then(() => {
                    // navigate or redirect to the the match page
                    navigate('/match')
                })
                .catch((err) => {
                    setError('Failed to fetch user data');
                    console.error(err);
                });
        } else {
            setError('Authorization code missing!');
        }
    }, [navigate]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            { userData ? (
                <div>
                    <h2> Welcome, {userData.username}</h2>

                    <img src={userData.avatar} alt='Avatar'/>
                    
                    <p>Email: {userData.email}</p>

                </div>
            ): (
                <p>Loading user data ...</p>
            )}
        </div>
    )
};

export default Home;