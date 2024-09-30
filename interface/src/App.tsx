import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/auth.context";
import ErrorBoundary from "./pages/Error/ErrorBoundary";
import AppRoutes from "./utils/routes/routes";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;
