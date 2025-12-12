import { useEffect } from "react";
import { AuthProvider } from "../services/auth";
import { ThemeProvider } from "next-themes";
import { registerServiceWorker } from "../utils/swHelper";
import { ConfigProvider } from "antd";
import mnMN from "antd/lib/locale/mn_MN";
import moment from "moment";
import "moment/locale/mn";
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
} from "chart.js";
import "antd/dist/antd.css";
import "../styles/globals.css";
import "suneditor/dist/css/suneditor.min.css";
import "aos/dist/aos.css";
import "../services/i18n";
import { Toaster } from "sonner";

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

moment.locale("mn");

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Toaster position="top-right" richColors suppressHydrationWarning />
        <ConfigProvider locale={mnMN}>
          <Component {...pageProps} />
        </ConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
