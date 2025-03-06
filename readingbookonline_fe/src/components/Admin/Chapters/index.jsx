"use client";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";

const AppContainer = () => {
  return (
    <main className="w-full min-h-screen bg-red-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <ContentArea />
      </div>
    </main>
  );
};

export default AppContainer;
