import PropTypes from "prop-types";
import React, { useState } from "react";
import PaidIcon from "@mui/icons-material/Paid";


function CoinBundle({ discount, title, coins, originalPrice, price }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="border border-gray-700 rounded-lg p-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="bg-red-500 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold">
            <span className="text-xl">
              {discount}
              <span className="text-sm">%</span>
            </span>
          </div>

          <div>
            <div className="mb-2">{title}</div>
            <div className="flex flex-wrap gap-x-2">
              {coins.map((coin, index) => (
                <div key={index} className="flex items-center">
                  <PaidIcon
                    className={`w-5 h-5 mr-1 ${
                      coin.type === "regular"
                        ? "fill-amber-400 text-amber-400"
                        : coin.type === "bonus"
                        ? "fill-teal-400 text-teal-400"
                        : "fill-purple-400 text-purple-400"
                    }`}
                  />
                  {coin.amount}
                  {index < coins.length - 1 && <span className="ml-1">+</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-gray-400 line-through">
            ${originalPrice.toFixed(2)}
          </div>
          <div className="text-xl font-bold">${price.toFixed(2)}</div>
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Purchase Now
          </button>
        </div>
      )}
    </div>
  );
}

CoinBundle.propTypes = {
  discount: PropTypes.number,
  title: PropTypes.string,
  coins: PropTypes.object,
  originalPrice: PropTypes.number,
  price: PropTypes.number,
};
export default CoinBundle;
