import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute(){
  const accessToken = localStorage.getItem('access_token');
  const sessionToken = localStorage.getItem('session_token');

  // Check if both tokens exist (or just the one you want to validate)
  const isLoggedIn = accessToken && sessionToken;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;