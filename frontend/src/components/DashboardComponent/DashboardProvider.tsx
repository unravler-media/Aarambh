import { AuthProvider } from "../../context/AuthContext";
import { BrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard.tsx";

const DashboardProvider = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default DashboardProvider;
