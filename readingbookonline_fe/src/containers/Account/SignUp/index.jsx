import React from "react";
import Header from "./Header";
import SignUpForm from "./SignUpForm";
import Router from "next/router";

const SignUpPage = () => {
  return (
    <main className="flex flex-col bg-red-100 min-h-[screen]">
      <Header />
      <section className="flex justify-center px-5 py-20">
        <div className="p-9 w-full bg-white rounded-xl max-w-[1052px]">
          <h1 className="text-3xl">SIGN UP</h1>
          <SignUpForm />
        </div>
      </section>
    </main>
  );
};

export default SignUpPage;
