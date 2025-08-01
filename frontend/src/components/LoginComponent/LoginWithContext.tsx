import React, { useEffect, useState } from "react";
import { AuthProvider } from "../../context/AuthContext";
import { BrowserRouter, Navigate } from "react-router-dom";
import Login from "./login";

const LoginWithProvider = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [checked, setChecked] = useState(false); // to prevent flicker on initial load

  useEffect(() => {
    const user = localStorage.getItem("authToken");
    if (user) {
      setShouldRedirect(true);
    }
    setChecked(true);
  }, []);

  if (!checked) return null; // Or return a loading spinner

  return (
    <BrowserRouter>
      <AuthProvider>
        {shouldRedirect ? <Navigate to="/" replace /> : <Login />}
      </AuthProvider>
    </BrowserRouter>
  );
};

export default LoginWithProvider;
