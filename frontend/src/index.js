import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TicketPage from './TicketPage';
import ProtectedRoute from './ProtectedTicketPage';

const onRedirectCallback = (appState) => {
  const targetUrl = appState?.returnTo || window.location.pathname;
  window.location.assign(targetUrl); // Ensure redirect to the correct URL
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Auth0Provider
    domain="dev-nn4nwq0trcxe4v3b.us.auth0.com"
    clientId="gEG2k4lH9ZMZxtIT5NU4iI84dPBC9hkH"
    authorizationParams={{
        redirect_uri: window.location.origin
    }}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback} // Handle post-login redirect
  >
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <App /> }/>
          <Route path="/:ticket_id" element={<ProtectedRoute component={<TicketPage />} />} />
        </Routes>
      </BrowserRouter>
    </div>
</Auth0Provider>
);