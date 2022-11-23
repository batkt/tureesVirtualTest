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
      <div className=" ">
        <li className="text-base mt-2 h-8" onClick={() => setOpen(!open)}>
          <div className={"flex flex-row items-center leading-8 px-1"}>
            <div className={`mr-4 ${selected ? "text-green-600" : ""}`}>
              {mur.icon}
            </div>
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
          </div>
        </li>
        <ul className="rounded-lg overflow-hidden bg-green-500 dark:bg-gray-600 transition-all duration-500" style={{ height: open ? `${2.5 * mur.sub.length}rem` : "0rem" }}>
          {mur.sub.map((a) => {
            return (
              <Link href={a.href} key={a.href}>
                <li
                  className={`relative px-5 h-[2.5rem] text-base cursor-pointer rounded-lg  text-white  ${a.khuudasniiNer === khuudasniiNer
                    ? "bg-white dark:bg-gray-800"
                    : ""
                    }`}
                >
                  <div
                    className={`${a.khuudasniiNer === khuudasniiNer
                      ? "font-medium text-gray-500"
                      : ""
                      } flex flex-row h-full items-center`}
                  >
                    <div className={`mx-3`}>{a.icon}</div>
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
      <li className={`text-base h-8 mt-2 rounded-lg ${selected ? "text-green-600 bg-white dark:bg-gray-400" : ""}`}>
        <div className="flex items-center flex-row px-1 leading-8">
          <div
            className={`mr-4 ${selected ? "text-green-600 dark:text-white" : ""
              }`}
          >
            {mur.icon}
          </div>
          {mur.ner}
        </div>
      </li>
    </Link>
  )
}

function MTses({
  khuudasnuud,
  khuudasniiNer,
  visible,
}) {


  return (
    <div onClick={(e) => e.stopPropagation()} className="w-full border-t pb-5 flex md:hidden">
      <div className={`w-full border-b overflow-hidden menuForPhone duration-500 overflow-y-auto transition-all px-3 ${visible === true ? "h-HMobile py-5" : "invisible h-[0vh]"}`}>
        <ul className="text-white ">
          {khuudasnuud.map((mur) => (
            <MenuItem
              key={mur.href}
              mur={mur}
              selected={mur.khuudasniiNer === khuudasniiNer}
              khuudasniiNer={khuudasniiNer}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MTses
