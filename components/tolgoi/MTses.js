import { Drawer, Menu, Switch } from "antd"
import Link from "next/link"
import React, { useState } from "react"
import { url } from "services/uilchilgee"
import _ from "lodash"

function MenuItem({ mur, selected, khuudasniiNer }) {
  const [open, setOpen] = React.useState(
    !!mur?.sub?.find((a) => a.khuudasniiNer === khuudasniiNer)
  )
  if (mur.sub) {
    return (
      <div className="">
        <li className={"flex flex-row"} onClick={() => setOpen(!open)}>
          {mur.ner}
          <div
            className={`transform ${open ? "rotate-180" : ""} ml-auto`}
            style={{ transitionDuration: ".1s" }}
          >
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
              className="feather feather-chevron-down"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </li>
        <ul className="sub-menu" style={{ display: open ? "block " : "none" }}>
          {mur.sub.map((a) => {
            return (
              <Link href={a.href} key={a.href}>
                <li
                  className={`relative cursor-pointer rounded-l-lg p-2 text-white  ${
                    a.khuudasniiNer === khuudasniiNer
                      ? "bg-white dark:bg-gray-800"
                      : ""
                  }`}
                >
                  <div
                    className={`${
                      a.khuudasniiNer === khuudasniiNer
                        ? "font-medium text-gray-500"
                        : ""
                    } flex flex-row`}
                  >
                    {a.ner}
                  </div>
                </li>
              </Link>
            )
          })}
        </ul>
      </div>
    )
  }
  return (
    <Link href={mur.href}>
      <li className={selected ? "selected-menu dark:bg-gray-400" : ""}>
        <div className="flex flex-row p-1 leading-8">
          <div
            className={`mr-2 ${
              selected ? "text-green-600 dark:text-white" : ""
            }`}
          >
            {" "}
            {mur.ner}
          </div>
        </div>
      </li>
    </Link>
  )
}

function MTses({
  khuudasnuud,
  khuudasniiNer,
  baiguullaga,
  themeValue,
  setTheme,
  ajiltan,
  barilgiinId,
  barilgaSoliyo,
}) {
  const [visible, setVisible] = useState(false)
  const barilguud = baiguullaga?.barilguud?.filter(
    (a) =>
      !!ajiltan?.barilguud?.find((b) => b === a._id) ||
      ajiltan?.erkh === "Admin"
  )
  return (
    <div className="mr-2 flex md:hidden">
      <button
        className="border-none outline-none"
        onClick={() => setVisible(!visible)}
      >
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
          className="feather feather-align-justify mx-auto block h-8 w-8 dark:text-gray-100"
        >
          <line x1="21" y1="10" x2="3" y2="10"></line>
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="14" x2="3" y2="14"></line>
          <line x1="21" y1="18" x2="3" y2="18"></line>
        </svg>
      </button>
      <Drawer
        placement={"left"}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={"left"}
        bodyStyle={{ padding: "10px 0" }}
        footer={
          <div className="flex h-8 items-center justify-center">
            <div className="mr-4 flex whitespace-nowrap text-gray-700 dark:text-gray-300">
              Dark Mode
            </div>
            <Switch
              checked={themeValue}
              onClick={() => setTheme(themeValue ? "light" : "dark")}
            />
          </div>
        }
      >
        <ul className="bg-green-400 text-white dark:bg-gray-800">
          <li className="t mb-10 px-2 ">
            <div className="border-b  px-2 pb-2">
              <div className="flex flex-col items-center">
                <img
                  className="h-20 w-20 "
                  alt={baiguullaga?.ner}
                  src={
                    baiguullaga?.zurgiinNer
                      ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                      : "/rent.png"
                  }
                />
                {barilguud?.length > 0 ? (
                  <div className="relative mt-2 inline-block">
                    <select
                      defaultValue={barilgiinId}
                      onChange={({ target }) => barilgaSoliyo(target.value)}
                      className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-1 pr-8 leading-tight text-black shadow hover:border-gray-500 focus:outline-none dark:bg-gray-800 dark:text-white"
                    >
                      {barilguud?.map((a) => (
                        <option key={a?._id} className="" value={a?._id}>
                          {a?.ner}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  _.get(barilguud, "0.ner")
                )}
              </div>
            </div>
          </li>
          {khuudasnuud.map((mur) => (
            <MenuItem
              key={mur.href}
              mur={mur}
              selected={mur.khuudasniiNer === khuudasniiNer}
              khuudasniiNer={khuudasniiNer}
            />
          ))}
        </ul>
      </Drawer>
    </div>
  )
}

export default MTses
