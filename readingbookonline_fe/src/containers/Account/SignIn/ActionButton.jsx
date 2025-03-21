import React from "react";
import PropTypes from "prop-types";

const ActionButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles = "text-center cursor-pointer";
  const variants = {
    primary:
      "px-16 pt-1.5 pb-3 text-white bg-amber-600 rounded-xl w-[231px] hover:bg-amber-700 transition-colors",
    link: "font-semibold text-indigo-900 underline hover:text-indigo-700",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

ActionButton.propTypes = {
  children: PropTypes.object,
  variant: PropTypes.string,
  className: PropTypes.string,
}

export default ActionButton;