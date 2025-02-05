import { Route, Routes } from "react-router";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/auth/Login/Login";
import AuthProvider from "./context/authContext";
import Register from "./components/auth/Register/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import RecommendJob from "./components/RecommendJob/RecommendJob";
import CalculateATS from "./components/CalculateATS/calculateATS";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calculate-ats"
              element={
                <ProtectedRoute>
                  <CalculateATS />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommend-job"
              element={
                <ProtectedRoute>
                  <RecommendJob />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer autoClose={2000} />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
