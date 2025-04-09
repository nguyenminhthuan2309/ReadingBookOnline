import React from "react";
import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

export default function Error403Page({
  containerWidth = "max-w-md",
  imageSize = 400,
  showButton = true,
}) {
  return (
    <div
      className="flex flex-col items-center justify-center mt-16"
      style={{ backgroundColor: "#F6E8DF" }}
    >
      <div className={`${containerWidth} w-full rounded-lg relative`}>
        <div className="absolute -top-10 right-10">
          <div className="text-6xl font-bold text-red-500 animate-bounce">
            !
          </div>
        </div>

        <h1 className="text-7xl text-[#FFAF98] font-bold text-center">
          403 FORBIDDEN
        </h1>

        <div className="w-full relative justify-items-center rounded-lg overflow-hidden">
          <Image
            src="/images/403Cat.png"
            width={imageSize}
            height={imageSize}
            alt="Cat placeholder"
            className="object-contain mx-auto"
          />
        </div>

        <p className="text-gray-600 text-center mb-6">
          Sorry, you dont have permission to access this content.
        </p>

        {showButton && (
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <span>Go back home</span>
          </Link>
        )}
      </div>
    </div>
  );
}

Error403Page.propTypes = {
  containerWidth: PropTypes.string,
  imageSize: PropTypes.number,
  showButton: PropTypes.bool,
};
