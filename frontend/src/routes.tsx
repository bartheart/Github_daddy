// frontend/src/routes.tsx

import { RouteObject } from "react-router-dom";
import Home from './Views/home';
import Match from "./Views/match";
import GithubLogin from "./Auth/GithubLogin";


// define the route object
const routes: RouteObject[] = [
    {
        // home page route
        path: '/',
        element: <GithubLogin />,
    },
    {
        // match route 
        path: '/match',
        element: <Match />
    }
];

export default routes;