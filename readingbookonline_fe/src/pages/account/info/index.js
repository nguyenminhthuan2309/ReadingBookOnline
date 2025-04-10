import React from "react";
import AccountInfo from "@/containers/Account/Info/Loadable";
import Head from "next/head";

export default function AccountInfoPage() {
  return (
    <>
      <Head>
        <title>Account Info</title>
      </Head>
      <AccountInfo />
    </>
  );
}
