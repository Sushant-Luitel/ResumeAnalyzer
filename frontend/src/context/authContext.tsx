import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserRegistration } from "../components/auth/Register/Register";
import { toast } from "react-toastify";

const notify = () => toast("Registered Successfully!");
const loginError = () => toast("Invalid Credentials");
const loginSuccess = () => toast("Login Success");

interface AuthContextType {
  username: string;
  password: string;
  token: string;
  logOut: () => void;
  login: (loginCredentials: { username: string; password: string }) => void;
  registerUser: (newData: UserRegistration) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string>(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState<string>(
    localStorage.getItem("password") || ""
  );
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

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
    onError: () => {},
  });

  const { mutate: login } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (loginCredentials: {
      username: string;
      password: string;
    }) => {
      const response = await axios.post(
        "http://127.0.0.1:8000/login/",
        loginCredentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: (res, credentials) => {
      setToken(res.token);
      loginSuccess();
      localStorage.setItem("token", res.token);
      setUsername(credentials.username);
      setPassword(credentials.password);
      localStorage.setItem("username", credentials.username);
      localStorage.setItem("password", credentials.password);
      navigate("/");
    },
    onError: () => {
      loginError();
    },
  });

  const logOut = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ token, username, password, logOut, login, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
