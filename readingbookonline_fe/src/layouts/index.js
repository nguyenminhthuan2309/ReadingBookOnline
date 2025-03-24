import React from "react";
import { Footer } from "./Footer";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

Layout.propTypes={
    children: PropTypes.node.isRequired,
}

export default Layout;
