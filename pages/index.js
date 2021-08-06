import React, { useEffect, useState } from "react"
import { Form, Input, Switch } from "antd"
import { useTheme } from "next-themes"
import Head from "next/head"
import moment from "moment"
import { useAuth } from "../services/auth"
import { destroyCookie } from "nookies"

const { Password } = Input

export function useThemeValue() {
  const { theme, setTheme } = useTheme()
  const [themeValue, setThemeValue] = useState(false)
  useEffect(() => {
    setThemeValue(theme === "dark")
  }, [theme])
  return { themeValue, setTheme }
}

function Ajiltan() {
  const [form] = Form.useForm()
  const [namaigsana, setNamaigsana] = useState(false)
  const { themeValue, setTheme } = useThemeValue()

  const { newterya } = useAuth()

  useEffect(async () => {
    localStorage.removeItem("ajiltniiJagsaalt")
    const newtrekhNer = await localStorage.getItem("newtrekhNerTurees")
    form.setFieldsValue({ mail: newtrekhNer })
  }, [])

  return (
    <div className="login flex justify-center dark:bg-gray-800">
      <Head>
        <title>Нэвтрэх хуудас</title>
        <link rel="icon" href="/car.png" />
      </Head>
      <div className="container sm:px-10">
        <div className="block xl:grid grid-cols-2 gap-4">
          <div className="hidden xl:flex flex-col min-h-screen z-10">
            <div className="my-auto">
              <img
                alt="Icewall Tailwind HTML Admin Template"
                className="-intro-x w-1/2 -mt-16"
                src="http://icewall-laravel.left4code.com/dist/images/illustration.svg"
              />
              <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                Түрээсийн удирдлагын систем
              </div>
            </div>
          </div>
          <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
            <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-gray-900 xl:dark:bg-gray-800 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
              <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left dark:text-gray-300"></h2>
              <Form
                form={form}
                initialValues={{}}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    newterya({ ...form.getFieldsValue(), namaigsana })
                }}
              >
                <Form.Item name="ner">
                  <Input
                    placeholder="Нэвтрэх нэр"
                    className="login-input"
                  />
                </Form.Item>
                <Form.Item name="nuutsUg">
                  <Password placeholder="Нууц үг" className="login-input" />
                </Form.Item>
              </Form>
              <div className="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4">
                <div className="flex items-center mr-auto">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="form-check-input border mr-2"
                    onChange={({ target }) => setNamaigsana(target.checked)}
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    Намайг сана
                  </label>
                </div>
                <a href="">Нууц үг сэргээх?</a>
              </div>

              <button
                onClick={() =>
                  newterya({ ...form.getFieldsValue(), namaigsana })
                }
                className="mt-5 xl:mt-8 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-green-500 group-hover:text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Нэвтрэх
              </button>
              <div className="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 dark:bg-dark-2 border rounded-full w-40 h-12 items-center justify-center z-50 mb-10 mr-10 hidden md:flex">
                <div className="mr-4 text-gray-700 dark:text-gray-300">
                  Dark Mode
                </div>
                <Switch
                  checked={themeValue}
                  onClick={() => setTheme(themeValue ? "light" : "dark")}
                />
              </div>
              <div className="fixed bottom-0">
                © Zev-TABS LLC © {moment(new Date()).format("YYYY")}. Бүх эрх
                хуулиар баталгаажсан.
                <div className=" flex flex-row md:hidden">
                  <div className="mr-4 text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </div>
                  <Switch
                    checked={themeValue}
                    onClick={() => setTheme(themeValue ? "light" : "dark")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  destroyCookie(ctx, "tureestoken")
  return { props: {} }
}

export default Ajiltan
