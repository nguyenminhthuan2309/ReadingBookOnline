import React from "react";
import VerifyAccount from "@/containers/Account/VerifyAccount/Loadable";
import Head from "next/head";

export default function VerifyAccountPage() {
  return (
    <>
      <Head>
        <title>Verify Account</title>
      </Head>
      <VerifyAccount />
    </>
  );
}
