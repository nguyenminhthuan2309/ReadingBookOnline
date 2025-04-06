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

export default function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <ErrorBoundary>{getLayout(<Component {...pageProps} />)}</ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};
