import React, { useEffect, useState } from "react";
import { AuthProvider } from "../../context/AuthContext";
import Category from "./Category.tsx";
import { BrowserRouter, Navigate } from "react-router-dom";

const CategoryDetailProvider = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Category />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default CategoryDetailProvider;
