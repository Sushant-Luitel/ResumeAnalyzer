import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const location = useLocation();
  console.log(location, "location");
  return (
    <>
      {isAuthenticated && <button onClick={() => logout()}>Logout</button>}
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </>
  );
};

export default LoginButton;
