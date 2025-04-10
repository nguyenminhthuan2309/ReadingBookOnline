import React from "react";
import SignUp from "@/containers/Account/SignUp/Loadable";
import Head from "next/head";
export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <SignUp />
    </>
  );
}
