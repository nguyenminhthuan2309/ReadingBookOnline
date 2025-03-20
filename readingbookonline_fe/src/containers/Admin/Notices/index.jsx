"use client";
import React from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import NoticesTable from "./NoticesTable";

const AppContainer = () => {
  return (
    <main className="w-full min-h-screen bg-red-100">
      <Header />
      <div className="flex max-md:flex-col">
        <Sidebar />
        <section className="flex-1 px-11 py-5 bg-white max-md:p-4">
          <NoticesTable />
        </section>
      </div>
    </main>
  );
};

export default AppContainer;
