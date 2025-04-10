import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#3F3D6E] text-white py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Introduction and policies */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              Introduction and policies
            </h3>
            <ul className="space-y-2">
              <li>
                -{" "}
                <a
                  href="#"
                  className="text-white/50 hover:text-indigo-200 transition-colors"
                >
                  About Haru&apos;s library
                </a>
              </li>
              <li>
                -{" "}
                <a
                  href="#"
                  className="text-white/50 hover:text-indigo-200 transition-colors"
                >
                  Policies and restrictions
                </a>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h3 className="text-lg font-bold mb-4">Guidelines:</h3>
            <ul className="space-y-2">
              <li>
                -{" "}
                <a
                  href="#"
                  className="text-white/50 hover:text-indigo-200 transition-colors"
                >
                  Guideline
                </a>
              </li>
              <li>
                -{" "}
                <a
                  href="#"
                  className="text-white/50 hover:text-indigo-200 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                -{" "}
                <a
                  href="#"
                  className="text-white/50 hover:text-indigo-200 transition-colors"
                >
                  Report form
                </a>
              </li>
            </ul>
          </div>

          {/* Join our forums */}
          <div>
            <h3 className="text-lg font-bold mb-4">Join our forums:</h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <img
                  className="w-10 h-10 object-cover"
                  src="/socialIcon/Facebook.png"
                  alt="Facebook"
                />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="bg-indigo-600 p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <img
                  className="w-10 h-10 object-cover"
                  src="/socialIcon/Messenger.webp"
                  alt="Messenger"
                />
                <span className="sr-only">Messenger</span>
              </a>
              <a
                href="#"
                className="bg-indigo-600 p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <img
                  className="w-10 h-10 object-cover"
                  src="/socialIcon/Discord.png"
                  alt="Discord"
                />
                <span className="sr-only">Discord</span>
              </a>

              <a
                href="#"
                className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <img
                  className="w-10 h-10 object-cover"
                  src="/socialIcon/Telegram.webp"
                  alt="Telegram"
                />
                <span className="sr-only">Telegram</span>
              </a>
              <a
                href="#"
                className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition-colors"
              >
                <img
                  className="w-10 h-10 object-cover"
                  src="/socialIcon/Zalo.webp"
                  alt="Zalo"
                />
                <span className="sr-only">Zalo</span>
              </a>
            </div>
          </div>

          {/* Contact us */}
          <div className="flex flex-col gap-2 pl-10">
            <h3 className="text-lg font-bold mb-4">Contact us:</h3>
            <p className="text-white/50">Zalo: 0397346184</p>
            <p className="text-white/50">
              Email: 18110208@student.hcmute.edu.vn
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-indigo-800 text-center text-sm">
          © 2025 Haru&apos;s library. All rights reserved. This website only serve as
          Graduation Project
        </div>
      </div>
    </footer>
  );
}
