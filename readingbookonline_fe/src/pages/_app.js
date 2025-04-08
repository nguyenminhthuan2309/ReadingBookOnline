import React, { useState } from "react";
import "@/styles/globals.css";
import store from "@/utils/redux/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/layouts/index";
import ErrorBoundary from "@/utils/ErrorBoundary";
import PropTypes from "prop-types";
import Head from "next/head";
import { SocketProvider } from "@/utils/SocketContext";
import { USER_INFO } from "@/utils/constants";
import { getItem } from "@/utils/localStorage";

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);
  const userInfo = getItem(USER_INFO);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <Head>
          <link rel="icon" type="image/png" href="/images/favicon.png" />
        </Head>
        <SocketProvider userInfo={userInfo ? userInfo : null}>
          <ErrorBoundary>{getLayout(<Component {...pageProps} />)}</ErrorBoundary>
        </SocketProvider>
      </QueryClientProvider>
    </Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};
