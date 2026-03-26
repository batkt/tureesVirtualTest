import { useEffect } from "react";
import { useRouter } from "next/router";
import { AuthProvider } from "../services/auth";
import { ThemeProvider } from "next-themes";
import { clearExpiredCache } from "../utils/indexedDB";
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
import "../styles/TipTapEditor.css";
import "../services/i18n";
import { Toaster } from "sonner";

// Register Chart.js components (used on many pages, so register early)
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

// Lazy load AOS (animation library) - only needed on client
const loadAOS = () => {
  if (typeof window !== "undefined") {
    import("aos/dist/aos.css").then(() => {
      const Aos = require("aos");
      Aos.init({ once: true, duration: 800, easing: "ease-out-cubic", offset: 50 });
    }).catch(() => {
      // AOS failed to load, continue silently
    });
  }
};

moment.locale("mn");

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  useEffect(() => {
    // Load AOS on client side only
    loadAOS();
    // Purge IndexedDB cache entries older than 24 hours on every app init
    clearExpiredCache().catch(() => {});
  }, []);

  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Toaster 
          position="top-right" 
          richColors 
          suppressHydrationWarning 
          expand={true}
          gap={8}
          toastOptions={{
            style: {
              maxWidth: '400px',
              wordBreak: 'break-word',
            },
          }}
        />
        <ConfigProvider locale={mnMN}>
          <div key={router.asPath} className="page-transition-enter">
            <Component {...pageProps} />
          </div>
        </ConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
