import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line, Bar } from "react-chartjs-2";
import moment from "moment";
import { useDispatch } from "react-redux";
import { trackLoginStatus } from "@/utils/actions/adminAction";

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function LoginChart() {
  const dispatch = useDispatch();
  const [loginDaily, setLoginDaily] = useState([]);
  const [loginWeekly, setLoginWeekly] = useState([]);
  const [loginMonthly, setLoginMonthly] = useState([]);

  const handleTrackLoginDaily = async () => {
    const res = await dispatch(trackLoginStatus("daily"));
    setLoginDaily(res);
  };

  const handleTrackLoginWeekly = async () => {
    const res = await dispatch(trackLoginStatus("weekly"));
    setLoginWeekly(res);
  };

  const handleTrackLoginMonthly = async () => {
    const res = await dispatch(trackLoginStatus("monthly"));
    setLoginMonthly(res);
  };

  // Chuyển đổi data thành dạng [{x: Date, y: number}]
  const chartDataPointsDaily = loginDaily
    .map((item) => ({
      x: moment(item.time, "DD-MM-YYYY").toDate(), // đổi định dạng dd-mm-yyyy → yyyy-mm-dd
      y: item.login,
    }))
    .sort((a, b) => a.x - b.x); // sắp xếp tăng dần theo thời gian

  const chartDataPointsWeekly = loginWeekly
    .map((item) => ({
      x: item.time,
      y: item.login,
    }));

  const chartDataPointsMonthly = loginMonthly.map((item) => ({
    x: item.time,
    y: item.login,
  }));

  const dataDaily = {
    datasets: [
      {
        label: "Lượt đăng nhập",
        data: chartDataPointsDaily,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
        backgroundColor: "rgba(27, 142, 242)",
      },
    ],
  };

  const dataWeekly = {
    datasets: [
      {
        label: "Lượt đăng nhập",
        data: chartDataPointsWeekly,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
        backgroundColor: "rgba(27, 142, 242)",
      },
    ],
  };

  const dataMonthly = {
    datasets: [
      {
        label: "Lượt đăng nhập",
        data: chartDataPointsMonthly,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.3,
        barThickness: 20,
        backgroundColor: "rgba(27, 142, 242)",
      },
    ],
  };

  const optionsDaily = {
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

  const optionsWeekly = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Tuần",
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

  const optionsMonthly = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Tháng",
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

  useEffect(() => {
    handleTrackLoginDaily();
    handleTrackLoginWeekly();
    handleTrackLoginMonthly();
  }, []);

  return (
    <main className="text-black max-h-[70vh] overflow-y-auto">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="w-full h-full flex gap-4">
          <div className="w-[80vh] h-[40vh]">
            <Line data={dataDaily} options={optionsDaily} />
          </div>
          <div className="w-[80vh] h-[40vh]">
            <Line data={dataWeekly} options={optionsWeekly} />
          </div>
        </div>
        <div className="w-[80vh] h-[40vh]">
          <Bar data={dataMonthly} options={optionsMonthly} />
        </div>
      </div>
    </main>
  );
}
