import { useEffect } from "react";
import { AuthProvider } from "../services/auth";
import { ThemeProvider } from "next-themes";
import { registerServiceWorker } from "@/utils/registerServiceWorker";
import "antd/dist/antd.css";
import "../styles/globals.css";
import "suneditor/dist/css/suneditor.min.css";
import "aos/dist/aos.css";
import "../services/i18n";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    registerServiceWorker(); // register SW only on client
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
