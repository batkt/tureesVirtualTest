import { Switch } from "antd"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { CloseOutlined, LeftOutlined } from "@ant-design/icons"
import { useAuth } from "../services/auth"
import NTses from "./tolgoi/Tses"
import MTses from "./tolgoi/MTses"
import _ from "lodash"

import ProfileTovch from "./tolgoi/ProfileTovch"
import useErkh from "../tools/logic/khereglegchiinErkhiinTokhirgoo"
import { useThemeValue } from "pages"
import MSearch from "./tolgoi/MSearch"

function Admin({
  title,
  khuudasniiNer,
  onSearch,
  children,
  className,
  dedKhuudas,
  hideSearch,
  onBack
}) {
  const [mSearch, setMSearch] = useState(false)
  const { themeValue, setTheme } = useThemeValue()
  const router = useRouter()

  const {
    ajiltan,
    token,
    baiguullaga,
    garya,
    ajiltniiJagsaalt,
    ajiltanNemya,
    setToken,
    ajiltanKhasya
  } = useAuth()
  const khuudasnuud = useErkh(ajiltan)

  function onClickSearch() {
    if (mSearch) {
      const search = document.getElementById("search")
      document.getElementById("mobileSearch").classList.remove("hidden")
      search.classList.add("hidden")
      document.getElementById("garchig").classList.remove("hidden")
      search.getElementsByTagName("input")[0].value = ""
      onSearch && onSearch("")
    } else {
      document.getElementById("mobileSearch").classList.add("hidden")
      document.getElementById("search").classList.remove("hidden")
      document.getElementById("garchig").classList.add("hidden")
    }

    setMSearch(!mSearch)
  }

  return (
    <div className="w-screen min-h-screen bg-green-600 dark:bg-gray-900 flex flex-row md:px-6 md:py-4">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/rent.png" />
      </Head>
      {!dedKhuudas && (
        <NTses
          khuudasnuud={khuudasnuud}
          baiguullaga={baiguullaga}
          khuudasniiNer={khuudasniiNer}
          ajiltan={ajiltan}
          ajiltniiJagsaalt={ajiltniiJagsaalt}
          ajiltanNemya={ajiltanNemya}
          setToken={setToken}
          ajiltanKhasya={ajiltanKhasya}
        />
      )}
      <div className={`bg-gray-100 dark:bg-gray-800 md:rounded-3xl md:px-2 ${dedKhuudas ? "w-full" : "main"}`}>
        <div className="h-12 border-b p-2 flex flex-row justify-between">
          <div className="flex flex-row">
            {!dedKhuudas && (
              <MTses
                khuudasnuud={khuudasnuud}
                baiguullaga={baiguullaga}
                khuudasniiNer={khuudasniiNer}
                themeValue={themeValue}
                setTheme={setTheme}
              />
            )}
            {dedKhuudas && (
              <button
                className="h-8 w-8 flex rounded-full items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={() =>
                  _.isFunction(onBack) ? onBack(router.back) : router.back()
                }
              >
                <LeftOutlined className="text-2xl dark:text-gray-50 flex items-center justify-center" />
              </button>
            )}
            <h2
              id="garchig"
              className="text-lg font-medium mr-5 dark:text-gray-300 whitespace-normal md:whitespace-nowrap"
            >
              {title}
            </h2>
          </div>
          <div className="flex flex-row space-x-6">
            <div className="h-8 justify-center items-center hidden md:flex">
              <div className="mr-4 text-gray-700 dark:text-gray-300 whitespace-nowrap hidden md:flex">
                Dark Mode
              </div>
              <Switch
                checked={themeValue}
                onClick={() => setTheme(themeValue ? "light" : "dark")}
              />
            </div>
            {!hideSearch && (
              <>
                <div
                  id="search"
                  className="w-40 md:w-56 relative text-gray-700 dark:text-gray-300 hidden md:block"
                >
                  <input
                    onChange={({ target }) =>
                      onSearch && onSearch(target.value)
                    }
                    type="text"
                    className="px-3 py-1 shadow-xl w-40 md:w-56 box pr-10 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                    placeholder="Хайлт..."
                  />
                  {mSearch ? (
                    <CloseOutlined
                      onClick={onClickSearch}
                      className="feather feather-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-search w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  )}
                </div>
                <MSearch
                  className="block md:hidden relative text-gray-700 dark:text-gray-300"
                  onClick={onClickSearch}
                />
              </>
            )}
            <ProfileTovch ajiltan={ajiltan} garya={garya} token={token} />
          </div>
        </div>
        <div className={`grid grid-cols-12 gap-6 ${className}`}>{children}</div>
      </div>
    </div>
  )
}
export default Admin
