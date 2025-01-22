import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { useAuthManager } from "./store/AuthProvider";
import { useEffect } from "react";
import ProtectedRoute from "./components/features/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/user/Dashboard";

const App = () => {
  const { isAuthenticated, initializeAuth } = useAuthManager();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected Routes = Authenticated */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
