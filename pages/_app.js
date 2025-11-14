import { useEffect } from "react";
import { AuthProvider } from "../services/auth";
import { ThemeProvider } from "next-themes";
import { registerServiceWorker } from "../utils/swHelper"
import "antd/dist/antd.css";
import "../styles/globals.css";
import "suneditor/dist/css/suneditor.min.css";
import "aos/dist/aos.css";
import "../services/i18n";
import "../lib/chartSetup"; // Register Chart.js components globally

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
