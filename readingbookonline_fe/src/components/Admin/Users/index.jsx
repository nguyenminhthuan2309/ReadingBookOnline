"use client";
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import UserTable from "./UserTable";

function AppContainer() {
  return (
    <main className="px-4 py-3.5 min-h-screen bg-red-100">
      <Header />
      <div className="flex gap-2 max-sm:flex-col">
        <Sidebar />
        <section className="flex-1 px-9 py-12 bg-white max-sm:px-2.5 max-sm:py-5">
          <UserTable />
        </section>
      </div>
    </main>
  );
}

export default AppContainer;
