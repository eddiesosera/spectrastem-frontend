import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/auth.context";
import ErrorBoundary from "./pages/Error/ErrorBoundary";
import AppRoutes from "./utils/routes/routes";
import { Provider } from "react-redux";
import store from "./redux/store";
import { FileProvider } from "./context/file.context";
import { TimerProvider } from "./context/timer.context";

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <FileProvider>
            <TimerProvider>
              <Provider store={store}>
                <AppRoutes />
              </Provider>
            </TimerProvider>
          </FileProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
