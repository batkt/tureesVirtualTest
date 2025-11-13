import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

export const data = {
  datasets: [
    {
      label: "# of Votes",
      data: [5, 22, 3, 5],
      backgroundColor: ["green", "blue", "orange", "yellow"],
    },
  ],
  labels: ["Бат", "Сүх", "Хүрэл", "Ган"],
};

export default function App() {
  // Register Chart.js components on client-side only
  useEffect(() => {
    ChartJS.register(
      ArcElement,
      Tooltip,
      Legend
    );
  }, []);

  return <Pie data={data} />;
}
