import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getItem } from "@/utils/localStorage";
import { USER_INFO } from "./constants";

const withAuth = (WrappedComponent, allowedRoles) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const userInfo = getItem(USER_INFO);
      const userRole = userInfo?.role?.id || 0;

      if (allowedRoles.includes(userRole)) {
        setIsAuthorized(true);
      } else {
        router.replace("/forbidden");
      }
    }, []);

    if (!isAuthorized) return null; // Tránh hiển thị nội dung không cần thiết

    return <WrappedComponent {...props} />;
  };

  // 👉 Gán displayName để ESLint không báo lỗi
  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};

export default withAuth;
