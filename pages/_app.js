import { AuthProvider } from "../services/auth";
import { ThemeProvider } from "next-themes";
import "antd/dist/antd.css";
import "../styles/globals.css";
import "suneditor/dist/css/suneditor.min.css";
import "aos/dist/aos.css";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
