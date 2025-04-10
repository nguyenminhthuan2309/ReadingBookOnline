import React from "react";
import Purchase from "@/containers/Purchase/Loadable";
import Head from "next/head";

export default function AccountInfoPage() {
  return (
    <>
      <Head>
        <title>Purchases</title>
      </Head>
      <Purchase />
    </>
  );
}
