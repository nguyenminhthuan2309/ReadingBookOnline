"use client";

import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getItem } from "@/utils/localStorage";
import { USER_INFO } from "./constants";

const withAuth = (WrappedComponent, allowedRoles) => {
  const AuthComponent = (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const userInfo = getItem(USER_INFO);
          const userRole = userInfo?.role?.id || 0;

          if (allowedRoles.includes(userRole)) {
            setIsAuthorized(true);
          } else {
            await router.replace("/forbidden");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          await router.replace("/forbidden");
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    // Show nothing while checking authorization
    if (isLoading) {
      return null;
    }

    // Only render the component if authorized
    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthComponent;
};

export default withAuth;
