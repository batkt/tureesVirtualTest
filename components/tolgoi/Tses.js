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
          <div className={"flex flex-row p-1"}>
            <div className={`mr-2 ${selected ? "text-green-600" : ""}`}>
              {mur.icon}
            </div>
            {t(mur.ner)}
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
        <ul
          style={{ height: open ? `${2.5 * mur.sub.length}rem` : "0rem" }}
          className={`sub-menu flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
        >
          {mur.sub.map((a) => {
            return (
              <Link href={a.href} key={a.href} legacyBehavior>
                <a>
                  <li
                    className={`submenu-item relative cursor-pointer rounded-l-lg transition-all duration-300 ease-out ${
                      open ? "ml-0" : "ml-56"
                    } p-2 ${
                      a.khuudasniiNer === khuudasniiNer
                        ? "bg-white text-green-600 shadow-lg dark:bg-gray-800 dark:text-green-400"
                        : "text-white hover:bg-green-600/95 hover:shadow-md hover:translate-x-1 hover:scale-[1.02] dark:hover:bg-gray-700/90 dark:hover:shadow-lg"
                    }`}
                    style={{
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div className={"flex flex-row px-1"}>
                      <div
                        className={`${
                          a.khuudasniiNer === khuudasniiNer
                            ? "font-medium"
                            : ""
                        } flex flex-row whitespace-nowrap transition-all duration-300 ease-out`}
                      >
                        <div 
                          className={`mr-2 transition-all duration-300 ease-out ${
                            a.khuudasniiNer === khuudasniiNer
                              ? "text-green-600 dark:text-green-400"
                              : "text-white group-hover:scale-110"
                          }`}
                          style={{
                            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s ease-out",
                          }}
                        >
                          {a.icon}
                        </div>
                        <span className="transition-all duration-300 ease-out">{t(a.ner)}</span>
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
          <li className={selected ? "selected-menu" : "menu-item"}>
            <div className="flex flex-row p-1">
              <div className={`mr-2 ${selected ? "text-green-600" : ""}`}>
                {mur.icon}
              </div>
              {t(mur.ner)}
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
  const { t } = useTranslation();
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

  if (!baiguullaga && !!ajiltan) {
    return (
      <nav className="hidden h-full w-44 md:block">
        <div className="flex flex-col items-center justify-center h-40">
           <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
           <span className="text-[10px] text-white/50 font-bold uppercase mt-3 tracking-widest">{t("Уншиж байна")}...</span>
        </div>
      </nav>
    );
  }

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
                <div className="relative mt-2 inline-block">
                  <select
                    defaultValue={barilgiinId}
                    value={barilgiinId}
                    onChange={({ target }) => {
                      onChangeBarilga && onChangeBarilga();
                      barilgaSoliyo(target.value, ajiltan);
                    }}
                    className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-1 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:bg-gray-800"
                  >
                    {barilguud?.map((a) => (
                      <option key={a?._id} value={a?._id} disabled={a.disabled}>
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
