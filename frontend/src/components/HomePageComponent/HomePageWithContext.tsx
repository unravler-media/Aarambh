import React, { useEffect, useState } from "react";
import { AuthProvider } from "../../context/AuthContext";
import { BrowserRouter, Navigate } from "react-router-dom";
import Home from "./homepage";

const HomePageProvider = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default HomePageProvider;
