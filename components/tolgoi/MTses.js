import { Drawer, Menu, Switch } from "antd"
import Link from "next/link"
import React, { useState } from "react"
import { url } from "services/uilchilgee"

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
        <ul className="sub-menu " style={{ display: open ? "block" : "none" }}>
          {mur.sub.map((a) => {
            return (
              <Link href={a.href} key={a.href}>
                <li
                  className={`relative cursor-pointer rounded-l-lg p-2 text-white ${
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
      <li className={selected ? "selected-menu" : ""}>
        <div className="flex flex-row p-1">{mur.ner}</div>
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
}) {
  const [visible, setVisible] = useState(false)

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
        <ul>
          <li className="mb-10 px-2">
            <div className="border-b px-2 pb-2">
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
