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
    <div className="login flex min-h-screen justify-center bg-green-600 dark:bg-gray-800 xl:bg-white">
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
            position: "fixed",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        />
      ) : null}
      <div className="container mx-auto flex min-h-screen items-center justify-center sm:px-10">
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
                className="-intro-x animate__fadeInLeftBig mr-5 mt-10 text-4xl font-medium leading-tight text-white"
                data-aos="fade-right"
                data-aos-duration="3000"
              >
                {t("Түрээсийн удирдлагын систем")}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              <div
                className="rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-xl dark:bg-gray-800/80 sm:p-10"
                data-aos="fade-left"
                data-aos-duration="1000"
              >
                <div className="mb-8 flex justify-center lg:hidden">
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-4 py-2">
                    <img
                      src="/rent.png"
                      alt="Rently Logo"
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </div>

                <div
                  className="mb-8 text-center"
                  data-aos="fade-down"
                  data-aos-delay="200"
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t("Нэвтрэх")}
                  </h2>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {t("Бүртгэлдээ нэвтэрнэ үү")}
                  </p>
                </div>

                <Form
                  autoComplete={"off"}
                  form={form}
                  initialValues={{}}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      newterya({ ...form.getFieldsValue(), namaigsana });
                  }}
                >
                  <div className="space-y-5">
                    <div data-aos="fade-up" data-aos-delay="300">
                      <Form.Item name="nevtrekhNer" className="mb-0">
                        <div className="group relative">
                          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-emerald-600 dark:text-gray-500 dark:group-focus-within:text-emerald-400">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <Input
                            placeholder={t("Нэвтрэх нэр")}
                            className="h-14 rounded-xl border-2 border-gray-200 bg-gray-50/50 pl-12 text-base transition-all focus:border-emerald-500 focus:bg-white dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:focus:border-emerald-400 dark:focus:bg-gray-700"
                            size="large"
                          />
                        </div>
                      </Form.Item>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="400">
                      <Form.Item name="nuutsUg" className="mb-0">
                        <div className="group relative">
                          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-gray-400 transition-colors group-focus-within:text-emerald-600 dark:text-gray-500 dark:group-focus-within:text-emerald-400">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <Password
                            placeholder={t("Нууц үг")}
                            className="h-14 rounded-xl border-2 border-gray-200 bg-gray-50/50 pl-12 text-base transition-all focus:border-emerald-500 focus:bg-white dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:focus:border-emerald-400 dark:focus:bg-gray-700"
                            size="large"
                          />
                        </div>
                      </Form.Item>
                    </div>

                    <div
                      className="flex items-center justify-between"
                      data-aos="fade-up"
                      data-aos-delay="500"
                    >
                      <label className="flex cursor-pointer items-center">
                        <input
                          id="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-700"
                          onChange={({ target }) =>
                            setNamaigsana(target.checked)
                          }
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t("Намайг сана")}
                        </span>
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        newterya({ ...form.getFieldsValue(), namaigsana })
                      }
                      className="group relative mt-2 flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/40 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 active:scale-[0.98] dark:shadow-emerald-500/20 dark:hover:shadow-emerald-500/30"
                      data-aos="fade-up"
                      data-aos-delay="600"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {t("Нэвтрэх")}
                        <svg
                          className="h-5 w-5 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </Form>

                <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                  © Zev-TABS LLC © {moment(new Date()).format("YYYY")}.{" "}
                  <br className="sm:hidden" />
                  {t("Бүх эрх хуулиар баталгаажсан.")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed right-6 top-6 z-50 transition-all hover:scale-105">
        <button
          onClick={() => {
            const newLang = i18n.language === "en" ? "mn" : "en";
            i18n.changeLanguage(newLang);
            window.localStorage.setItem("Localelanguage", newLang);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:bg-gray-800/80"
        >
          <img
            className="h-7 w-7 rounded-full object-cover"
            src={i18n.language === "en" ? "/MN.png" : "/UK.png"}
            alt="Language"
          />
        </button>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center gap-3 rounded-full bg-white/80 px-5 py-3 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:bg-gray-800/80">
          <svg
            className="h-5 w-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <Switch
            checked={themeValue}
            onChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <svg
            className="h-5 w-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </div>
      </div>

      <div className="fixed right-6 top-6 z-50 transition-all hover:scale-105">
        <button
          onClick={() => {
            const newLang = i18n.language === "en" ? "mn" : "en";
            i18n.changeLanguage(newLang);
            window.localStorage.setItem("Localelanguage", newLang);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:bg-gray-800/80"
        >
          <img
            className="h-7 w-7 rounded-full object-cover"
            src={i18n.language === "en" ? "/MN.png" : "/UK.png"}
            alt="Language"
          />
        </button>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center gap-3 rounded-full bg-white/80 px-5 py-3 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:bg-gray-800/80">
          <svg
            className="h-5 w-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <Switch
            checked={themeValue}
            onChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <svg
            className="h-5 w-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
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
