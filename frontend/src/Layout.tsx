import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Register from "./components/auth/Register/Register";
import { ProtectedRoute } from "./ProtectedRoute";
import Home from "./pages/Home";
import RecommendJob from "./components/RecommendJob/RecommendJob";
import CalculateATS from "./components/CalculateATS/CalculateATS";
import AppliedJobsPage from "./components/AppliedJobs/AppliedJobs";
import Login from "./components/auth/Login/Login";
import JobDetails from "./components/JobDetails/JobDetails";

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
          path="/jobs/:jobId"
          element={
            <ProtectedRoute>
              <JobDetails />
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
        <Route
          path="/applied-jobs"
          element={
            <ProtectedRoute>
              <AppliedJobsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};
