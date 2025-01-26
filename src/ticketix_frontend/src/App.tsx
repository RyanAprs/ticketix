import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { useAuthManager } from "./store/AuthProvider";
import { useEffect } from "react";
import ProtectedRoute from "./components/features/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/user/Dashboard";
import MyTickets from "./pages/user/MyTickets";
import Tickets from "./pages/Tickets";
import CreateTicketPage from "./pages/user/CreateTicketPage";
import DetailTicket from "./pages/DetailTicket";

const App = () => {
  const { isAuthenticated, initializeAuth } = useAuthManager();

  useEffect(() => {
    initializeAuth();
    if (document.title !== "TickeTix") {
      document.title = "TickeTix";
    }
  }, [initializeAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/ticket" element={<Tickets />} />
      <Route path="/ticket/:id" element={<DetailTicket />} />

      {/* Protected Routes = Authenticated */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/ticket" element={<MyTickets />} />
        <Route path="/dashboard/ticket/post" element={<CreateTicketPage />} />
      </Route>
    </Routes>
  );
};

export default App;
