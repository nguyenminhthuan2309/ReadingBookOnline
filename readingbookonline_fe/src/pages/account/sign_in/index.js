import React from "react";
import SignIn from "@/containers/Account/SignIn/Loadable";
import Head from "next/head";
export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign In</title>
      </Head>
      <SignIn />
    </>
  );
}
