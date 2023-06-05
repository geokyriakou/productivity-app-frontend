import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Weekly Analytics",
    },
  },
};

const labels = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function Plot() {
  const { userInfo } = useContext(AuthContext);

  const dataset = userInfo?.focusTime;

  const data = {
    labels,
    datasets: [
      {
        label: "Focus Hours",
        data: dataset,
        borderColor: "#fdf6f3",
        backgroundColor: "rgba(253, 246, 243, 0.5)",
        tension: 0.5,
      },
    ],
  };
  return <Line options={options} data={data} />;
}
