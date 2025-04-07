import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend
);

const rawData = [
  { time: "10-04-2025", login: 1 },
  { time: "09-04-2025", login: 10 },
  { time: "08-04-2025", login: 9 },
  { time: "07-04-2025", login: 5 },
  { time: "06-04-2025", login: 7 },
];

// Chuyển đổi data thành dạng [{x: Date, y: number}]
const chartDataPoints = rawData
  .map((item) => ({
    x: moment(item.time, "DD-MM-YYYY").toDate(), // đổi định dạng dd-mm-yyyy → yyyy-mm-dd
    y: item.login,
  }))
  .sort((a, b) => a.x - b.x); // sắp xếp tăng dần theo thời gian

const data = {
  datasets: [
    {
      label: "Lượt đăng nhập",
      data: chartDataPoints,
      fill: false,
      borderColor: "rgba(75,192,192,1)",
      tension: 0.3,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
        tooltipFormat: "dd-MM-yyyy",
        displayFormats: {
          day: "dd-MM-yyyy",
        },
      },
      title: {
        display: true,
        text: "Ngày",
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Số lượt đăng nhập",
      },
    },
  },
};

export default function LoginChart() {
  return (
    <main className="text-black max-h-[70vh] overflow-y-auto">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-full flex gap-4">
          <div className="w-[80vh] h-[40vh]">
            <Line data={data} options={options} />
          </div>
          <div className="w-[80vh] h-[40vh]">
            <Line data={data} options={options} />
          </div>
        </div>
        <div className="w-[80vh] h-[40vh]">
          <Line data={data} options={options} />
        </div>
      </div>
    </main>
  );
}
