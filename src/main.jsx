// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async'; 

import './index.css';
import { RouterProvider } from 'react-router-dom';

import AuthProvider from './providers/AuthProvider.jsx';
import routes from './routes/Routes.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the entire application in the AuthProvider */}
    <HelmetProvider> 
      <AuthProvider>
      {/* Provide the router to the application */}
      <RouterProvider router={routes} />
    </AuthProvider>
    </HelmetProvider>
    
  </React.StrictMode>,
);