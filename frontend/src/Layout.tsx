import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/auth/Login/Login";
import Register from "./components/auth/Register/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "./pages/Home";
import RecommendJob from "./components/RecommendJob/RecommendJob";
import CalculateATS from "./components/CalculateATS/CalculateATS";

export const Layout = () => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
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
    </>
  );
};
