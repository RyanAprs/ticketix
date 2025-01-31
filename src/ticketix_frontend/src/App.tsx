import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import { useAuthManager } from "./store/AuthProvider";
import { useEffect } from "react";
import ProtectedRoute from "./components/features/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/user/Dashboard";
import WalletPage from "./pages/user/WalletPage";
import EventDetail from "./pages/event/EventDetail";
import CreateEventPage from "./pages/user/CreateEventPage";
import MyEvent from "./pages/user/MyEvent";
import EventPage from "./pages/event/EventPage";
import TicketPage from "./pages/ticket/TicketPage";

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
      <Route path="/event" element={<EventPage />} />
      <Route path="/event/:id" element={<EventDetail />} />
      <Route path="/event/:id/ticket" element={<TicketPage />} />

      {/* Protected Routes = Authenticated */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/event" element={<MyEvent />} />
        <Route path="/dashboard/event/post" element={<CreateEventPage />} />
        <Route path="/dashboard/wallet" element={<WalletPage />} />
      </Route>
    </Routes>
  );
};

export default App;
