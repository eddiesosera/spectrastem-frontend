// File: frontend/routes.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./public.routes";
import PrivateRoute from "./private.routes";

// Import pages
import Login from "../../pages/Auth/Login";
import Register from "../../pages/Auth/Register";
import OTP from "../../pages/Auth/OTP";
import ForgotPassword from "../../pages/Auth/ForgotPassword";
import ResetPassword from "../../pages/Auth/ResetPassword";
import Home from "../../pages/Home/Home";
import Dashboard from "../../pages/Dashboard/Dashboard";
import AboutUs from "../../pages/About/AboutUs";
import NotFound from "../../pages/Error/NotFound";
import ExtractedMidi from "../../pages/Processing/ExtractedMidi";
import ExtractedStems from "../../pages/Processing/ExtractedStems";
import SelectSegment from "../../pages/Processing/SelectSegment";
import FileUpload from "../../components/Input/FileUpload";
import StatusPage from "../../pages/Processing/StatusPage";
import ResultsPage from "../../pages/Processing/StemsResults";

const AppRoutes: React.FC = () => {
  // const [trackName, setTrackName] = useState<string | null>(null);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/otp"
        element={
          <PublicRoute>
            <OTP />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
      <Route
        path="/about"
        element={
          <PublicRoute>
            <AboutUs />
          </PublicRoute>
        }
      />
      <Route
        path="*"
        element={
          <PublicRoute>
            <NotFound />
          </PublicRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/process/select-segment"
        element={
          <PrivateRoute>
            <SelectSegment />
          </PrivateRoute>
        }
      />
      <Route
        path="/result/extracted-midi"
        element={
          <PrivateRoute>
            <ExtractedMidi />
          </PrivateRoute>
        }
      />
      <Route
        path="/result/extracted-stems"
        element={
          <PrivateRoute>
            <ExtractedStems />
          </PrivateRoute>
        }
      />

      <Route path="/upload" element={<FileUpload />} />
      <Route path="/status/:trackName" element={<StatusPage />} />
      <Route path="/results" element={<ResultsPage />} />
    </Routes>
  );
};

export default AppRoutes;
