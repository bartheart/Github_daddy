// frontend/src/componenets/repoSubmit.tsx

import React, { useState } from 'react';

const RepoSubmit: React.FC =  () => {
    //initalize a state to capture the repo link
    const [repoUrl, setRepoUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault()

        // try catch block for debugging 
        try {
            const response = await fetch("http://localhost:8001/process_repo", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ repo_url: repoUrl }),

                credentials: 'include'
            });

                    // Check if the response is ok
            if (response.ok) {
                // If successful, redirect to match page
                window.location.href = "http://localhost:3000/match";
            } else {
                // Handle error
                const errorData = await response.json();
                setError(errorData.detail || "Failed to fetch repository data");
            }
        } catch (err) {
        setError("Failed to fetch repository data");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Paste the link of the ptoject repo: </label>
                <input id='repo' type='text' value = {repoUrl} 
                onChange={(e) => setRepoUrl(e.target.value)} />
                <input type='submit' value='submit'/>
            </form>


            {error && <p>{error}</p>}

        </div>
    );
};

export default RepoSubmit