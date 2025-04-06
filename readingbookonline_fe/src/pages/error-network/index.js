import React from "react";
import ErrorNetwork from "@/containers/ErrorNetwork/Loadable";
import AdminLayout from "@/layouts/AdminLayout";

export default function ErrorNetworkPage() {
  return <ErrorNetwork />;
}

ErrorNetworkPage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
