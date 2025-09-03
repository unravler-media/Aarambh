
import type { ReactNode } from "react";
import SidebarProvider from "../components/SidebarComponent/SidebarWithProvider.tsx";
import MobileSidebarProvider from "./MobileSidebar/MobileNavWithProvider.tsx";
import { useCategories } from "../hooks/useCategories";
import Footer from "./FooterComponent.tsx";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const categoriesData = useCategories();

  return (
    <div className="flex min-h-screen bg-[#0A0B0F] overflow-hidden">
      <SidebarProvider categoriesData={categoriesData} />
      <MobileSidebarProvider categoriesData={categoriesData} />
      <main className="flex-1 w-full md:ml-64 mt-14 md:mt-0 transition-all duration-300 overflow-hidden">
        { /* <ScrollArea className="dang h-screen kinetic-scroll"> */}
        <div className="container px-3 sm:px-4 md:px-4 lg:px-6 py-4 sm:py-6 mx-auto max-w-5xl lg:max-w-6xl xl:max-w-7xl w-full overflow-hidden min-w-0">
          <div className="fade-in-up">
            {children}
          </div>
        </div>
        <Footer />
        {/* </ScrollArea> */}
      </main>
    </div>
  );
};

export default Layout;
