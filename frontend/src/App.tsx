import React from 'react';
import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import routes from './routes'

// initialize the router object 
const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />
}

export default App;
