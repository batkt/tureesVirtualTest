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
import Updater from "./Updater"
import Zaavar from "./Zaavar"

var timeout = null

function Admin({
  title,
  khuudasniiNer,
  onSearch,
  children,
  className,
  dedKhuudas,
  hideSearch,
  onBack,
  tsonkhniiId,
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
    ajiltanKhasya,
    barilgaSoliyo,
    barilgiinId,
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
    <div className="flex min-h-screen w-screen flex-row bg-green-600 dark:bg-gray-900 md:px-6 md:py-4">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Updater />
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
          barilgaSoliyo={barilgaSoliyo}
          barilgiinId={barilgiinId}
        />
      )}
      <div
        className={`bg-gray-100 dark:bg-gray-800 md:rounded-3xl md:px-2 ${
          dedKhuudas ? "w-full" : "main"
        }`}
      >
        <div className="flex h-12 flex-row justify-between border-b p-2">
          <div className="flex flex-row transition-all">
            {!dedKhuudas && (
              <MTses
                khuudasnuud={khuudasnuud}
                baiguullaga={baiguullaga}
                khuudasniiNer={khuudasniiNer}
                themeValue={themeValue}
                setTheme={setTheme}
                ajiltan={ajiltan}
                barilgaSoliyo={barilgaSoliyo}
                barilgiinId={barilgiinId}
              />
            )}
            {dedKhuudas && (
              <button
                className="iconbutton flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={() =>
                  _.isFunction(onBack) ? onBack(router.back) : router.back()
                }
              >
                <LeftOutlined className="flex items-center justify-center text-2xl dark:text-gray-50" />
              </button>
            )}
            <h2
              id="garchig"
              className="mr-5 whitespace-normal text-lg font-medium dark:text-gray-300 md:whitespace-nowrap"
            >
              {title}
            </h2>
          </div>
          <div className="flex flex-row space-x-6">
            {tsonkhniiId && (
              <div className="hidden h-8 items-center justify-center md:flex ">
                <Zaavar token={token} id={tsonkhniiId} />
              </div>
            )}
            <div className="hidden h-8 items-center justify-center md:flex">
              <div className="mr-4 hidden whitespace-nowrap text-gray-700 dark:text-gray-300 md:flex">
                Dark Mode
              </div>
              <Switch
                className="bg-green-500"              
                checked={themeValue}
                checkedChildren={
                  <svg className="" focusable="false" viewBox="0 0 24 24" >
                    <path d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path>
                  </svg>
                }
                unCheckedChildren={
                  <svg className="" focusable="false" viewBox="0 0 24 24" >
                    <path d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path>
                  </svg>}
                onClick={() => setTheme(themeValue ? "light" : "dark")}
              />
            </div>
            {!hideSearch && (
              <>
                <div
                  id="search"
                  className="relative hidden w-40 text-gray-700 dark:text-gray-300 md:block md:w-56"
                >
                  <input
                    onChange={({ target }) => {
                      if (!!onSearch) {
                        clearTimeout(timeout)
                        timeout = setTimeout(function () {
                          onSearch(target.value)
                        }, 300)
                      }
                    }}
                    type="text"
                    className="box w-40 px-3 py-1 pr-10 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:w-56"
                    placeholder="Хайлт..."
                  />
                  {mSearch ? (
                    <CloseOutlined
                      onClick={onClickSearch}
                      className="feather feather-search absolute inset-y-0 right-0 my-auto mr-2 h-4 w-4"
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
                      className="feather feather-search absolute inset-y-0 right-0 my-auto mr-3 mt-2 h-4 w-4"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  )}
                </div>
                <MSearch
                  className="relative block text-gray-700 dark:text-gray-300 md:hidden"
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
