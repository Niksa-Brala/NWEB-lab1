import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProtectedRoute = ({ component }) => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const location = useLocation(); // To get the current URL path

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Trigger login and pass the current URL as appState
      loginWithRedirect({
        appState: { returnTo: location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? component : null;
};

export default ProtectedRoute;
