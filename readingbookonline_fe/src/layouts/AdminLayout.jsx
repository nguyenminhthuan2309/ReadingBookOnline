import React from "react";
import PropTypes from "prop-types";

const AdminLayout = ({ children }) => {
  return (
    <div className="layout">
      <main className="main-content">{children}</main>
      <footer className="bg-[#3F3D6E]">
        <div className="pt-2 border-t border-indigo-800 text-center text-sm">
          <span className="text-white">© 2025 Haru&apos;s library. All rights reserved. This website only serve as
          Graduation Project</span>
        </div>
      </footer>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
