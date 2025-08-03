import React, { useEffect, useState } from "react";
import { AuthProvider } from "../../context/AuthContext";
import { BrowserRouter, Navigate } from "react-router-dom";
import SearchComponent from "./search.tsx";

const SearchDetailProvider = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchComponent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default SearchDetailProvider;
