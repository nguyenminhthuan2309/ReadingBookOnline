"use client";

import React from "react";

import { Header } from "@/layouts/Header";
import ChapterInfo from "./ChapterInfo";

export default function ChapterInfoPage() {
  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />
        <ChapterInfo />
      </div>
    </main>
  );
}
