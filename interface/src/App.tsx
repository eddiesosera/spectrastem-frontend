import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/auth.context";
import ErrorBoundary from "./pages/Error/ErrorBoundary";
import AppRoutes from "./utils/routes/routes";
import { Provider } from "react-redux";
import store from "./redux/store";

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Provider store={store}>
            <AppRoutes />
          </Provider>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
};

export default App;
