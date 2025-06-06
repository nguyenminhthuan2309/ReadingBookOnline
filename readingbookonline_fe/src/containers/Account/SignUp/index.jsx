
import React from "react";
import Header from "./Header";
import SignUpForm from "./SignUpForm";

const SignUpPage = () => {
  return (
    <main className="flex flex-col min-h-[screen]">
      <Header />
      <section className="flex justify-center px-5 py-20">
        <div className="p-9 w-full bg-white rounded-xl max-w-[1052px]">
          <h1 className="text-3xl text-black">SIGN UP</h1>
          <SignUpForm />
        </div>
      </section>
    </main>
  );
};

export default SignUpPage;
