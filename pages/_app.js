import { useEffect } from "react";
import { AuthProvider } from "../services/auth";
import { ThemeProvider } from "next-themes";
import { registerServiceWorker } from "../utils/swHelper"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import "antd/dist/antd.css";
import "../styles/globals.css";
import "suneditor/dist/css/suneditor.min.css";
import "aos/dist/aos.css";
import "../services/i18n";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
