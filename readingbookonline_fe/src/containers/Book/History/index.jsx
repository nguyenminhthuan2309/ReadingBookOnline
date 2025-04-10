import React from "react";
import { Header } from "@/layouts/Header";
import HistoryForm from "./HistoryForm";
import withAuth from "@/utils/withAuth";

function HistoryPage() {
  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />
        <HistoryForm />
      </div>
    </main>
  );
}

export default withAuth(HistoryPage, [3]);
