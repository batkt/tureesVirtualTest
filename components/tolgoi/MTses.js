import { Drawer, Menu, Switch } from "antd";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { url } from "services/uilchilgee";
import _ from "lodash";
import { useTranslation } from "react-i18next";

function MenuItem({ mur, selected, khuudasniiNer, t }) {
  const [open, setOpen] = React.useState(
    !!mur?.sub?.find((a) => a.khuudasniiNer === khuudasniiNer)
  );

  if (mur.sub) {
    return (
      <div className="">
        <li className="mt-2 h-8 text-base" onClick={() => setOpen(!open)}>
          <div className={"flex flex-row items-center px-1 leading-8"}>
            <div className={`mr-4 flex-shrink-0 ${selected ? "text-green-600" : ""}`}>
              {mur.icon}
            </div>
            <span className="flex-1 min-w-0 truncate">{t(mur.ner)}</span>
            <div
              className={`transform flex-shrink-0 ${open ? "rotate-180" : ""} ml-2`}
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
        <ul
          className="overflow-hidden rounded-lg bg-green-500 transition-all duration-500 dark:bg-gray-600"
          style={{ height: open ? `${2.5 * mur.sub.length}rem` : "0rem" }}
        >
          {mur.sub.map((a) => {
            return (
              <Link href={a.href} key={a.href}>
                <li
                  className={`relative h-[2.5rem] cursor-pointer rounded-lg px-5 text-base  text-white  ${
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
                    } flex h-full flex-row items-center`}
                  >
                    <div className={`mx-3`}>{a.icon}</div>
                    {t(a.ner)}
                  </div>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    );
  }
  return (
    <Link href={mur.href}>
      <li
        className={`mt-2 h-8 rounded-lg text-base ${
          selected ? "bg-white text-green-600 dark:bg-gray-400" : ""
        }`}
      >
        <div className="flex flex-row items-center px-1 leading-8">
          <div
            className={`mr-4 ${
              selected ? "text-green-600 dark:text-white" : ""
            }`}
          >
            {mur.icon}
          </div>
          {t(mur.ner)}
        </div>
      </li>
    </Link>
  );
}

function MTses({ khuudasnuud, khuudasniiNer, visible }) {
  const { t, i18n } = useTranslation();
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex w-full border-t pb-5 md:hidden"
    >
      <div
        className={`menuForPhone w-full overflow-hidden overflow-y-auto border-b px-3 transition-all duration-500 ${
          visible === true ? "h-HMobile py-5" : "invisible h-[0vh]"
        }`}
      >
        <ul className="text-white ">
          {khuudasnuud.map((mur) => (
            <MenuItem
              t={t}
              key={mur.href}
              mur={mur}
              khuudasnuud
              selected={mur.khuudasniiNer === khuudasniiNer}
              khuudasniiNer={khuudasniiNer}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MTses;
