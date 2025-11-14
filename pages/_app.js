import { useEffect } from "react";
import { AuthProvider } from "../services/auth";
import { ThemeProvider } from "next-themes";
import { registerServiceWorker } from "../utils/swHelper"
import "antd/dist/antd.css";
import "../styles/globals.css";
import "suneditor/dist/css/suneditor.min.css";
import "aos/dist/aos.css";
import "../services/i18n";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Register Chart.js components on client-side only
    import('chart.js').then((ChartJS) => {
      ChartJS.Chart.register(
        ChartJS.ArcElement,
        ChartJS.CategoryScale,
        ChartJS.LinearScale,
        ChartJS.BarElement,
        ChartJS.PointElement,
        ChartJS.LineElement,
        ChartJS.Title,
        ChartJS.Tooltip,
        ChartJS.Legend
      );
    });

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
