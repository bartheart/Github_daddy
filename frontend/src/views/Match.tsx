// frontend/src/views/match.tsx

import React, {useEffect, useState } from 'react';

// define the data types expecting from the server for all the repo data 

interface RepoData {
    id: number; // GitHub repository ID
    name: string;
    full_name: string;
    description: string | null;
    stars: number;
    forks: number;
    open_issues: number;
    html_url: string;
}

interface Commit {
    sha: string;
    author: {
        name: string;
        email: string;
        date: string; // ISO string
    };
    message: string;
    url: string;
}

interface Contributor {
    login: string;
    contributions: number;
    avatar_url: string;
    html_url: string;
}

interface Issue {
    id: number;
    title: string;
    body: string | null;
    state: "open" | "closed";
    labels: Array<{ name: string; color: string }>;
    created_at: string; // ISO string
    updated_at: string; // ISO string
    html_url: string;
}

interface AllRepoData {
    repo_data: RepoData;
    commit_history: Commit[];
    contributors: Contributor[];
    issues: Issue[];
}



const Match: React.FC= () => {
    // initialize a state for the capturing the user data 
    const [allRepoData, setRepoData] = useState<AllRepoData | null>(null);
    // initialize a state for error handling 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // fetch the user data from the backend
        fetch("http://localhost:8001/repo_data", { credentials: "include" })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            return response.json();
        })
        .then((data) => {
            setRepoData(data);
        })
        .catch((error) => {
            setError("Failed to fetch the user data");
            console.error(error);
        });
    });

    return (
        <div>
            {allRepoData && (
                <div>
                    <h2>Repository: {allRepoData.repo_data.name}</h2>
                    <p>{allRepoData.repo_data.description}</p>
                    <p>Stars: {allRepoData.repo_data.stars}</p>
                    <p>Forks: {allRepoData.repo_data.forks}</p>
                    <p>Open Issues: {allRepoData.repo_data.open_issues}</p>

                    <h3>Commit History</h3>
                    <ul>
                    {allRepoData.commit_history.map((commit: any) => (
                        <li key={commit.sha}>{commit.commit.message}</li>
                    ))}
                    </ul>

                    <h3>Contributors</h3>
                    <ul>
                    {allRepoData.contributors.map((contributor: any) => (
                        <li key={contributor.login}>{contributor.login}</li>
                    ))}
                    </ul>

                    <h3>Issues</h3>
                    <ul>
                    {allRepoData.issues.map((issue: any) => (
                        <li key={issue.id}>{issue.title}</li>
                    ))}
                    </ul>
                </div>
                )}

        </div>
    )
};

export default Match;