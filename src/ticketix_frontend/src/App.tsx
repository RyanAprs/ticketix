import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
// import { useAuthManager } from "./store/AuthProvider";
// import { useEffect } from "react";
// import ProtectedRoute from "./components/features/ProtectedRoute/ProtectedRoute";

const App = () => {
  // const { isAuthenticated, initializeAuth } = useAuthManager();

  // useEffect(() => {
  //   initializeAuth();
  // }, [initializeAuth]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected Routes = Authenticated */}
      {/* <Route
        element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
      ></Route> */}
    </Routes>
  );
};

export default App;
