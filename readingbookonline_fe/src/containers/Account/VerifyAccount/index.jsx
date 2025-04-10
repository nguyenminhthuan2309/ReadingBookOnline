import React, { useCallback, useEffect, useMemo, useRef } from "react";

import Link from "next/link";
import { Button, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { verifyToken } from "@/utils/actions/authAction";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorIcon from "@mui/icons-material/Error";

export default function VerifyAccount() {
  const dispatch = useDispatch();
  const searchParam = useSearchParams();
  const token = useMemo(() => searchParam.get("token"), []);
  const hasVerified = useRef(false);

  const { loading, isVerified, error } = useSelector(
    (state) => state.verifyToken
  );

  const handleVerifyCode = useCallback(
    (token) => {
      if (!hasVerified.current) {
        hasVerified.current = true;
        dispatch(verifyToken(token));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!token || hasVerified.current) return;
    handleVerifyCode(token);
  }, [token, handleVerifyCode]);

  return (
    <div
      className="flex w-full flex-col items-center justify-center"
      style={{ backgroundColor: "#F6E8DF" }}
    >
      {loading || !hasVerified.current ? (
        <div className="container flex max-w-3xl flex-col items-center justify-center gap-8 px-4 py-16 text-center md:py-24">
          <CircularProgress sx={{ color: "#FFAF98" }} />
        </div>
      ) : (
        <>
          <div className="container flex max-w-3xl flex-col items-center justify-center gap-8 px-4 py-16 text-center md:py-24">
            <div className="relative h-64 w-64 md:h-80 md:w-80 animate-bounce animation-delay-700">
              {isVerified && (
                <VerifiedIcon sx={{ fontSize: "200px", color: "green" }} />
              )}
              {error && <ErrorIcon sx={{ fontSize: "200px", color: "red" }} />}
            </div>
            <div className="space-y-4">
              <h1 className="text-7xl font-bold text-[#FFAF98] tracking-tighter md:text-8xl">
                {isVerified && "Verified"}
                {error && "Unverified"}
              </h1>
              <p className="text-xl font-medium text-gray-700 md:text-2xl">
                {isVerified && "Your account has been verified"}
                {error && error}
              </p>
            </div>

            <Button asChild className="mt-4">
              <Link href="/account/sign_in">Back to Login Page</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
