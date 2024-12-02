// src/views/Mstch.tsx
import React, { useState } from "react";

const Match = ({ onSubmitRepo }) => {
    const [repoUrl, setRepoUrl] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitRepo(repoUrl);
    };

    return (
        <div>
            <h2>Enter the Repository URL for Analysis</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    placeholder="https://github.com/user/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                    style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
                />
                <button type="submit" style={{ padding: "10px 20px" }}>Analyze</button>
            </form>
        </div>
    );
};

export default Match;
