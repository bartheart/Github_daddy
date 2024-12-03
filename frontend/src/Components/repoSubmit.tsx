// frontend/src/componenets/repoSubmit.tsx

import React from 'react';

const RepoSubmit: React.FC =  () => {
    return (
        <form action="#">
            <label>Paste the link of the ptoject repo: </label>
            <input id='repo' type='text'/>
            <input type='submit' value='submit'/>
        </form>
    )
};

export default RepoSubmit