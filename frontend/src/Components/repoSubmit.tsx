// frontend/src/componenets/repoSubmit.tsx

import React, { useState } from 'react';

const RepoSubmit: React.FC =  () => {
    //initalize a state to capture the repo link
    const [repoUrl, setRepoUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState(null);

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault();

        // try catch block for debugging 
        try {
            const response = await fetch("http://localhost:8001/process_repo", {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ repo_url: repoUrl}),
            });

            const data = await response.json();
            setData(data);

           
        } catch (err) {
            setError("Failed to fetch repository data");
        }

    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Paste the link of the ptoject repo: </label>
                <input id='repo' type='text'/>
                <input type='submit' value='submit'/>
            </form>


            {error && <p>{error}</p>}

            {data && (
                <div>
                    <h2>Repo Data</h2>
                </div>
            )}
        </div>
    );
};

export default RepoSubmit