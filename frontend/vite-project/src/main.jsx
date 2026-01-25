import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';



import './index.css'
import { UiProvider } from './api/UiContext.jsx';
import GlobalLoader from './components/GlobalLoader.jsx';
import GlobalError from './components/GlobalError.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UiProvider>
    <AuthProvider>
      <BrowserRouter>
        <GlobalLoader/>
        <GlobalError/>
        <App />
      </BrowserRouter>
    </AuthProvider>
    </UiProvider>
  </React.StrictMode>
);
