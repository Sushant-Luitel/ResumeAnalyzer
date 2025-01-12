import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const { mutate: login } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginCredentials: any) => {
      const response = await axios.post(
        "http://127.0.0.1:8000/login/",
        loginCredentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    },
    onSuccess: (res) => {
      console.log("res", res);
    },
  });

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, setUser, logOut, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
