import React, { useState } from "react";
import CoinBundle from "./CoinBundle";
import PaidIcon from "@mui/icons-material/Paid";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import { Header } from "@/layouts/Header";

export default function CoinPurchasePage() {
  const [activeTab, setActiveTab] = useState("coins");

  return (
    <main className="rounded-none">
      <div className="flex flex-col w-full max-md:max-w-full">
        <Header />
        <div className=" min-h-screen bg-gray-900 text-white p-10 pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Purchase Coins</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                className={`flex items-center gap-1 ${
                  activeTab === "coins" ? "text-amber-400" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("coins")}
              >
                <PaidIcon className="w-5 h-5 fill-amber-400 text-amber-400" />{" "}
                Coins
              </button>
              <button
                className={`flex items-center gap-1 ${
                  activeTab === "bonus" ? "text-teal-400" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("bonus")}
              >
                <PaidIcon className="w-5 h-5 fill-teal-400 text-teal-400" />{" "}
                Bonus Coins
              </button>
              <button
                className={`flex items-center gap-1 ${
                  activeTab === "points" ? "text-purple-400" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("points")}
              >
                <PaidIcon className="w-5 h-5 fill-purple-400 text-purple-400" />{" "}
                Points
              </button>
              <button className="text-gray-400">
                <HelpIcon className="w-5 h-5" />
              </button>
            </div>

            {/* First Purchase Bundle */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold">
                  First Purchase Special Bundle
                </h2>
                <InfoIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-sm">Details</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <CoinBundle
                  discount={50}
                  title="✨ Welcome Exclusive ✨"
                  coins={[
                    { type: "regular", amount: 200 },
                    { type: "bonus", amount: 200 },
                    { type: "points", amount: 1000 },
                  ]}
                  originalPrice={10.99}
                  price={4.99}
                />

                <CoinBundle
                  discount={50}
                  title="🌟 Welcome Exclusive 🌟"
                  coins={[
                    { type: "regular", amount: 400 },
                    { type: "bonus", amount: 400 },
                    { type: "points", amount: 2000 },
                  ]}
                  originalPrice={20.99}
                  price={9.99}
                />
              </div>
            </div>

            {/* VIP Club */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold">
                  👑 Jaymee&apos;s VIP Club (Monthly Plan) 👑
                </h2>
                <InfoIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 text-sm">Details</span>
              </div>

              <CoinBundle
                discount={20}
                title="Sign up to get extra Check-in Rewards, Sales and more!"
                coins={[{ type: "bonus", amount: 500 }]}
                originalPrice={12.5}
                price={9.99}
              />
            </div>

            {/* Right sidebar - would be positioned differently in a full layout */}
            <div className="mt-8 border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-4">Purchase Coins</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
