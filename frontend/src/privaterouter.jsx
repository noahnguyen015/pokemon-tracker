import { Navigate, Outlet } from 'react-router-dom';

//component used to protect routing if the person is not logged in
function PrivateRoute(){
  //access token from the local storage
  const refreshToken = localStorage.getItem('refresh');
  const accessToken = localStorage.getItem('access');

  console.log(refreshToken);
  console.log(accessToken);

  // Check if both tokens exist (or just the one you want to validate)
  const isLoggedIn = refreshToken && accessToken;

  if(!isLoggedIn){
    console.log('it is not logged in')
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;