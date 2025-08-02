import React, { useEffect, useState } from "react";
import { AuthProvider } from "../../context/AuthContext";
import { BrowserRouter, Navigate } from "react-router-dom";
import PostDetail from "./PostDetail";

const PostDetailProvider = () => {

  return (
    <BrowserRouter>
      <AuthProvider>
        <PostDetail />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default PostDetailProvider;
