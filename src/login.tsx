import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return (
    <>
      {isAuthenticated && <button onClick={() => logout()}>Logout</button>}
      <button onClick={() => loginWithRedirect()}>Log In</button>
    </>
  );
};

export default LoginButton;
