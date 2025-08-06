import { AuthProvider } from "../../context/AuthContext";
import { BrowserRouter, Navigate } from "react-router-dom";
import Sidebar from "./sidebar.tsx";

const SidebarProvider = ({ categoriesData }) => {

  return (
    // <BrowserRoute>
    <AuthProvider>
      <Sidebar categoriesData={categoriesData} />
    </AuthProvider>
    // </BrowserRouter>
  );
};

export default SidebarProvider;
