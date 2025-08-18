import { AuthProvider } from "@/context/AuthContext";
import CreatorDashboard from "./CreatorDashboard.tsx";

const CreatorDashboardProvider = ({ }) => {

  return (
    <AuthProvider>
      <CreatorDashboard />
    </AuthProvider>
  );
};

export default CreatorDashboardProvider;
