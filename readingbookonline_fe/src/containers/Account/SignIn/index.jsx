"use client";

import React from "react";
import { Header } from "./Header";
import { LoginForm } from "./LoginForm";

const LoginPage = () => {
  return (
    <main className="rounded-none">
      <div className="flex flex-col pb-16 w-full max-md:max-w-full">
        <Header />
        <LoginForm />
      </div>
    </main>
  );
};

export default LoginPage;
