import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRegistration } from "../components/auth/Register/Register";

import { toast } from "react-toastify";

const notify = () => toast("Registered Successfully!");

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const { mutate: registerUser } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (newData: UserRegistration) => {
      const response = await axios.post(
        "http://127.0.0.1:8000/register/",
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      notify();
      navigate("/login");
    },
  });

  const { mutate: login } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginCredentials: any) => {
      const response = await axios.post(
        "http://127.0.0.1:8000/login/",
        { ...loginCredentials },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (res) => {
      setToken(res.token);
      localStorage.setItem("token", res.token);
      navigate("/");
    },
  });

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, setUser, logOut, login, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
