import React from "react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ backgroundColor: "#F6E8DF" }}
    >
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="relative justify-items-center w-auto h-auto mx-auto">
          <Image
            src="/images/ErrorNetworkCat.png"
            alt="Cat placeholder"
            width={250}
            height={250}
            className="object-none"
            style={{ backgroundColor: "transparent" }}
          />
        </div>
        <h1 className="text-3xl md:text-4xl text-[#FFAF98] lg:text-5xl font-bold mb-12">
          Something is wrong
        </h1>

        <div className="mt-16">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}
