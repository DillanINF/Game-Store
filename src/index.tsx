import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './fonts/GTWalsheimPro/stylesheet.css';
import './scss/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const clientId = '724679148498-32m7bhurqoihng97ttjp640178om0p8m.apps.googleusercontent.com';

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter basename="/shopping-cart">
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
