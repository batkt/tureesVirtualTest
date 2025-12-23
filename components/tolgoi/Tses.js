import _ from "lodash";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { url } from "services/uilchilgee";
import moment from "moment";

function MenuItem({ mur, selected, khuudasniiNer }) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(
    !!mur?.sub?.find((a) => a.khuudasniiNer === khuudasniiNer)
  );

  if (mur.sub) {
    return (
      <div className="">
        <li className={"menu-item"} onClick={() => setOpen(!open)}>
          <div className={"flex flex-row items-center whitespace-nowrap"}>
            <div
              className={`mr-2 flex-shrink-0 ${
                selected ? "text-green-600 dark:text-green-400" : ""
              }`}
            >
              {mur.icon}
            </div>
            <span className="truncate">{t(mur.ner)}</span>
            <div
              className={`transform transition-transform duration-200 ${
                open ? "rotate-180" : ""
              } ml-auto`}
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
          style={{
            height: open ? "auto" : "0rem",
            maxHeight: open ? "none" : "0rem",
            opacity: open ? 1 : 0,
          }}
          className={`sub-menu flex flex-col transition-all duration-200 ${
            open ? "" : "overflow-hidden"
          }`}
        >
          {mur.sub.map((a) => {
            return (
              <Link href={a.href} key={a.href} legacyBehavior>
                <a>
                  <li
                    className={`relative ml-4 cursor-pointer rounded-l-lg transition-all duration-300 ${
                      a.khuudasniiNer === khuudasniiNer
                        ? "bg-white dark:bg-gray-800"
                        : ""
                    }`}
                  >
                    <div className={"flex flex-row px-3 py-1.5"}>
                      <div
                        className={`${
                          a.khuudasniiNer === khuudasniiNer
                            ? "font-medium text-green-500 dark:text-green-500"
                            : ""
                        } flex flex-row items-center truncate whitespace-nowrap text-sm`}
                      >
                        <div className={`mr-2 flex flex-shrink-0 items-center`}>
                          {a.icon}
                        </div>
                        <span className="truncate">{t(a.ner)}</span>
                      </div>
                    </div>
                  </li>
                </a>
              </Link>
            );
          })}
        </ul>
      </div>
    );
  } else {
    return (
      <Link href={mur.href} legacyBehavior>
        <a>
          <li className={`${selected ? "selected-menu" : "menu-item"} ml-4`}>
            <div className="flex flex-row items-center whitespace-nowrap p-1">
              <div
                className={`mr-2 flex-shrink-0 ${
                  selected ? "text-green-600" : ""
                }`}
              >
                {mur.icon}
              </div>
              <span className="truncate">{t(mur.ner)}</span>
            </div>
          </li>
        </a>
      </Link>
    );
  }
}

function NTses({
  khuudasnuud,
  khuudasniiNer,
  baiguullaga,
  ajiltan,
  barilgaSoliyo,
  onChangeBarilga,
  barilgiinId,
}) {
  const scrollRef = useRef(null);

  const barilguud = baiguullaga?.barilguud?.filter(
    (a) =>
      !!ajiltan?.barilguud?.find((b) => b === a._id) ||
      ajiltan?.erkh === "Admin"
  );

  if (
    Array.isArray(ajiltan?.salbaruud) &&
    ajiltan?.salbaruud?.length > 0 &&
    !!barilguud &&
    barilguud.length > 0
  ) {
    barilguud.forEach((a) => {
      a.disabled =
        new Date(
          ajiltan?.salbaruud?.find(
            (mur) => mur.salbariinId === a._id
          )?.duusakhOgnoo
        ) < new Date();
    });
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const delta = e.deltaY;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      if ((atTop && delta < 0) || (atBottom && delta > 0)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <nav className="hidden h-full w-44 md:block">
      <ul>
        <li className="mb-10 px-2">
          <div className="border-b px-2 pb-2">
            <div className="flex flex-col items-center">
              <div className="relative flex">
                {moment(new Date()).format("MM") === "12" ? (
                  <img src="/hat.webp" className="absolute -top-4 right-2 " />
                ) : null}
                <img
                  className={`h-16 w-16 ${
                    moment(new Date()).format("MM") === "12" &&
                    "rounded-full border-2 border-solid border-white p-1"
                  }`}
                  alt={baiguullaga?.ner}
                  src={
                    baiguullaga?.zurgiinNer
                      ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                      : "/rent.png"
                  }
                />
              </div>
              {barilguud?.length > 0 ? (
                <div className="relative mt-2 w-full">
                  <select
                    defaultValue={barilgiinId}
                    value={barilgiinId}
                    onChange={({ target }) => {
                      onChangeBarilga && onChangeBarilga();
                      barilgaSoliyo(target.value, ajiltan);
                    }}
                    className="modern-select"
                  >
                    {barilguud?.map((a) => (
                      <option key={a?._id} value={a?._id} disabled={a.disabled}>
                        {a?.ner}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mt-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  {_.get(barilguud, "0.ner")}
                </div>
              )}
            </div>
          </div>
        </li>

        <div
          ref={scrollRef}
          style={{ height: "calc(100vh - 12rem)" }}
          className="menuScrollbar group overflow-y-auto"
        >
          {khuudasnuud.map((mur) => (
            <MenuItem
              key={mur.href}
              mur={mur}
              selected={mur.khuudasniiNer === khuudasniiNer}
              khuudasniiNer={khuudasniiNer}
            />
          ))}
        </div>
      </ul>
    </nav>
  );
}

export default NTses;
