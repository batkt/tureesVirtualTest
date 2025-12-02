import React, { useEffect, useState } from "react";
import { Form, Input, Switch } from "antd";
import { useTheme } from "next-themes";
import Head from "next/head";
import moment from "moment";
import { useAuth } from "../services/auth";
import { destroyCookie } from "nookies";
import Aos from "aos";
import "../services/i18n";
import { useTranslation } from "react-i18next";
import Snowfall from "react-snowfall";
import Loader from "components/loader";
const { Password } = Input;

export function useThemeValue() {
  const { theme, setTheme } = useTheme();
  const [themeValue, setThemeValue] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setThemeValue(theme === "dark");
    }
  }, [theme, mounted]);

  return { themeValue, setTheme };
}

function Ajiltan() {
  const [form] = Form.useForm();
  const [namaigsana, setNamaigsana] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { themeValue, setTheme } = useThemeValue();
  const { newterya } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("baiguulgiinErkhiinJagsaalt");
      const nevtrekhNer = localStorage.getItem("newtrekhNerTurees");
      if (nevtrekhNer) {
        form.setFieldsValue({ nevtrekhNer });
      }

      setIsReady(true);
    }
  }, [form]);

  useEffect(() => {
    if (isReady) {
      Aos.init({ once: true });
    }
  }, [isReady]);

  const { t, i18n } = useTranslation();

  const images = React.useMemo(() => {
    if (typeof window === "undefined") return [];
    const snowflake1 = document.createElement("img");
    snowflake1.src = "/snowflake.png";
    const snowflake2 = document.createElement("img");
    snowflake2.src = "/snowflake1.png";
    return [snowflake1, snowflake2];
  }, []);

  if (!isReady) {
    return (
      <div className="login flex min-h-screen items-center justify-center bg-green-600 dark:bg-gray-800 xl:bg-white">
        <div className="text-xl text-white">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="login flex justify-center bg-green-600 dark:bg-gray-800 xl:bg-white ">
      <Head>
        <title>{t("Нэвтрэх хуудас")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <img
        className={`hidden w-full cursor-pointer object-contain transition-all`}
        src="/copyPasteLogo.png"
      />
      {moment(new Date()).format("MM") === "12" ? (
        <Snowfall 
          radius={[5, 20]} 
          snowflakeCount={80} 
          images={images}
          speed={[0.5, 1.5]}
          wind={[-0.3, 0.5]}
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        />
      ) : null}
      <div className="container sm:px-10">
        <div className="block grid-cols-2 gap-4 xl:grid">
          <div className="z-10 hidden min-h-screen flex-col xl:flex">
            <div
              className="my-auto"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              <img
                className="-intro-x -mt-16 w-1/2"
                data-aos="fade-left"
                data-aos-duration="3000"
                src="/illustration.svg"
              />
              <div
                className="-intro-x animate__fadeInLeftBig mt-10 text-4xl font-medium leading-tight text-white"
                data-aos="fade-right"
                data-aos-duration="3000"
              >
                {t("Түрээсийн удирдлагын систем")}
              </div>
            </div>
          </div>
          <div className="my-10 flex h-screen py-5 xl:my-0 xl:h-auto xl:py-0">
            <div className="mx-auto my-auto w-full rounded-md bg-white px-5 py-14 pb-5 shadow-md dark:bg-gray-900 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-20 xl:w-auto xl:bg-transparent xl:p-0 xl:shadow-none xl:dark:bg-gray-800">
              <h2 className="intro-x text-center text-2xl font-bold dark:text-gray-300 xl:text-left xl:text-3xl"></h2>
              <div data-aos="flip-right">
                <Form
                  autoComplete={"off"}
                  form={form}
                  initialValues={{}}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      newterya({ ...form.getFieldsValue(), namaigsana });
                  }}
                >
                  <div data-aos="fade-up" data-aos-delay="500">
                    <Form.Item name="nevtrekhNer">
                      <Input
                        placeholder={t("Нэвтрэх нэр")}
                        className="login-input"
                      />
                    </Form.Item>
                  </div>
                  <div data-aos="fade" data-aos-delay="300">
                    <Form.Item name="nuutsUg">
                      <Password
                        placeholder={t("Нууц үг")}
                        className="login-input"
                      />
                    </Form.Item>
                  </div>
                </Form>
                <div
                  className="intro-x mt-4 flex text-xs text-gray-700 dark:text-gray-600 sm:text-sm"
                  data-aos="fade-down"
                  data-aos-delay="400"
                >
                  <div className="mr-auto flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="form-check-input mr-2 border"
                      onChange={({ target }) => setNamaigsana(target.checked)}
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="remember-me"
                    >
                      {t("Намайг сана")}
                    </label>
                  </div>
                </div>

                <button
                  onClick={() =>
                    newterya({ ...form.getFieldsValue(), namaigsana })
                  }
                  className="group relative mt-5 flex w-full justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 xl:mt-8"
                  data-aos="fade-down"
                  data-aos-delay="500"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-green-500 group-hover:text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {t("Нэвтрэх")}
                </button>
                <div className="mt-24 text-center xl:hidden">
                  © Zev-TABS LLC © {moment(new Date()).format("YYYY")}.{" "}
                  {t("Бүх эрх хуулиар баталгаажсан.")}
                </div>
              </div>
              <div className="fixed right-10 top-6 flex w-10 gap-2 transition-all hover:scale-105">
                {i18n.language === "en" ? (
                  <img
                    onClick={() => {
                      i18n.changeLanguage("mn");
                      window.localStorage.setItem("Localelanguage", "mn");
                    }}
                    className={`w-full cursor-pointer object-contain transition-all`}
                    src="/MN.png"
                  />
                ) : (
                  <img
                    onClick={() => {
                      i18n.changeLanguage("en");
                      window.localStorage.setItem("Localelanguage", "en");
                    }}
                    className={`w-full cursor-pointer object-contain transition-all`}
                    src="/UK.png"
                  />
                )}
              </div>
              <div className="dark-mode-switcher dark:bg-dark-2 fixed bottom-0 right-0 z-50 mb-10 mr-10 flex h-12 w-40 cursor-pointer items-center justify-center rounded-full border bg-white shadow-md dark:bg-gray-900">
                <div className="mr-4 text-gray-700 dark:text-gray-300">
                  Dark Mode
                </div>
                <Switch
                  checked={themeValue}
                  onClick={() => setTheme(themeValue ? "light" : "dark")}
                />
              </div>
              <div className="fixed bottom-0 hidden xl:block">
                © Zev-TABS LLC © {moment(new Date()).format("YYYY")}.{" "}
                {t("Бүх эрх хуулиар баталгаажсан.")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  destroyCookie(ctx, "tureestoken");
  return { props: {} };
};

export default Ajiltan;
