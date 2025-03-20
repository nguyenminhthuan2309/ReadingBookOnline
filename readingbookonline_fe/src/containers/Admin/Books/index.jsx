"use client";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";

const AppContainer = () => {
  return (
    <main className="min-h-screen bg-red-100">
      <Header />
      <div className="flex max-md:flex-col">
        <Sidebar />
        <ContentArea />
      </div>
    </main>
  );
};

export default AppContainer;
