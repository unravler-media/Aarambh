
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value
    checkIfMobile();
    
    // Add event listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Modern approach using addEventListener
    mql.addEventListener("change", checkIfMobile);
    
    // Cleanup listener on component unmount
    return () => {
      mql.removeEventListener("change", checkIfMobile);
    };
  }, []);

  return isMobile;
}
