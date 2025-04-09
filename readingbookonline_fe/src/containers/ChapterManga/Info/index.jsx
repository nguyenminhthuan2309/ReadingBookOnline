"use client";

import React from "react";

import { Header } from "@/layouts/Header";
import ChapterInfo from "./ChapterInfo";
import CommentSection from "./CommentSection";
import withAuth from "@/utils/withAuth";

function ChapterInfoPage() {
  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />
        <ChapterInfo />
        <CommentSection />
      </div>
    </main>
  );
}

export default withAuth(ChapterInfoPage, [0, 1, 2, 3]);
