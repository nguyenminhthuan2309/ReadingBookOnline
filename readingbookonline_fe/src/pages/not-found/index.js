import React from "react";
import LoadableUnauthorize from "@/containers/NotFound/Loadable";
import AdminLayout from "@/layouts/AdminLayout";

export default function Unauthorize() {
  return <LoadableUnauthorize />;
}

Unauthorize.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

