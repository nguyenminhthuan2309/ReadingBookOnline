import React from "react";
import UserManagement from "@/containers/Admin";
import AdminLayout from "@/layouts/AdminLayout";

export default function UserManagementPage() {
  return <UserManagement />;
}

UserManagementPage.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
