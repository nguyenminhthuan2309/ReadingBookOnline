import React from "react";
import LoadableForbidden from "@/containers/Forbidden/Loadable";
import AdminLayout from "@/layouts/AdminLayout";

export default function Forbidden() {
  return <LoadableForbidden />;
}

Forbidden.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
