import { AuthProvider } from "../../context/AuthContext";
import MobileNav from "./mobileNav.tsx";

const MobileSidebarProvider = ({ categoriesData }) => {

  return (
    <AuthProvider>
      <MobileNav categoriesData={categoriesData} />
    </AuthProvider>
  );
};

export default MobileSidebarProvider;
