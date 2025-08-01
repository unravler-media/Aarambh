
import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import MobileNav from "./mobileNav";
import { useCategories } from "../hooks/useCategories";
import { ScrollArea } from "./ui/scrollArea";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const categoriesData = useCategories();
  
  return (
    <div className="flex min-h-screen bg-[#0A0B0F] overflow-hidden">
      <Sidebar categoriesData={categoriesData} />
      <MobileNav categoriesData={categoriesData} />
      <main className="flex-1 w-full md:ml-64 mt-14 md:mt-0 transition-all duration-300 overflow-hidden">
        <ScrollArea className="h-screen kinetic-scroll">
          <div className="container px-3 sm:px-4 md:px-4 lg:px-6 py-4 sm:py-6 mx-auto max-w-5xl lg:max-w-6xl xl:max-w-7xl w-full overflow-hidden min-w-0">
            <div className="fade-in-up">
              {children}
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default Layout;
