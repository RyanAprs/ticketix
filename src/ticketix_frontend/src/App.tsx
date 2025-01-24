import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { useAuthManager } from "./store/AuthProvider";
import { useEffect } from "react";
import ProtectedRoute from "./components/features/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/user/Dashboard";
import MyTickets from "./pages/user/MyTickets";
import Tickets from "./pages/Tickets";

const App = () => {
  const { isAuthenticated, initializeAuth } = useAuthManager();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/tickets" element={<Tickets />} />

      {/* Protected Routes = Authenticated */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/tickets" element={<MyTickets />} />
      </Route>
    </Routes>
  );
};

export default App;
