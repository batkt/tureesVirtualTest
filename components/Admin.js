import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Loader from "./loader";
import { Button, Drawer, Switch, Tooltip, Alert } from "antd";
import {
  CalendarOutlined,
  CloseOutlined,
  LeftOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { useAuth } from "../services/auth";
import NTses from "./tolgoi/Tses";
import MTses from "./tolgoi/MTses";
import _ from "lodash";

import ProfileTovch from "./tolgoi/ProfileTovch";
import useErkh from "../tools/logic/khereglegchiinErkhiinTokhirgoo";
import { useThemeValue } from "pages";
import MSearch from "./tolgoi/MSearch";
import moment from "moment";
import Updater from "./Updater";
import Zaavar from "./Zaavar";
import MsgToololt from "./MsgToololt";
import { GoArrowLeft } from "react-icons/go";
import { BsBoxArrowLeft } from "react-icons/bs";
import { TbArrowBarLeft } from "react-icons/tb";
import Tuslamj from "./tolgoi/tuslamj";
import { FiSend } from "react-icons/fi";
import { SiAnydesk } from "react-icons/si";
import { modal } from "./ant/Modal";
import SanalKhuseltIlgeekh from "./tolgoi/SanalKhuseltIlgeekh";
import { useTranslation } from "react-i18next";
import Snowfall from "react-snowfall";

var timeout = null;

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
  loading,
  setNeesenEsekh,
  setTurulZagvar,
  fixedZagvarNeegdsenEsekh,
  onChangeBarilga,
  searchUtga,
  khailtDoubleClick,
  suggestionData,
}) {
  const [mSearch, setMSearch] = useState(false);
  const { themeValue, setTheme } = useThemeValue();
  const [showTuslamj, setShowTuslamj] = useState(false);
  const router = useRouter();
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
    baiguulgiinErkhiinJagsaalt,
  } = useAuth();
  const khuudasnuud = useErkh(ajiltan, baiguulgiinErkhiinJagsaalt);
  const sanalKhuseltRef = React.useRef(null);
  const [visible, setVisible] = useState(false);
  const [showSidehelpBar, setShowSidehelpBar] = useState(false);
  const { i18n, t } = useTranslation();
  const [isOnline, setIsOnline] = useState(false);
  const [focusaasGarsan, setFocusaasGarsan] = useState(false);

  function getOS() {
    var userAgent = navigator.userAgent,
      platform = navigator.platform,
      macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
      windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
      iosPlatforms = ["iPhone", "iPad", "iPod"],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = "/anydeskMacOs.dmg";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = "https://apps.apple.com/us/app/anydesk/id1176131273";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = "/AnyDeskWindows.exe";
    } else if (/Android/.test(userAgent)) {
      os =
        "https://play.google.com/store/apps/details?id=com.anydesk.anydeskandroid";
    } else if (!os && /Linux/.test(platform)) {
      os = "https://anydesk.com/en/downloads/linux";
    }

    return os;
  }

  useEffect(() => {
    if (window) {
      i18n.changeLanguage(window.localStorage.getItem("Localelanguage"));
    }
    window.addEventListener("offline", () => setIsOnline(true));
  }, []);

  function onClickSearch() {
    if (mSearch) {
      const search = document.getElementById("search");
      document.getElementById("mobileSearch").classList.remove("hidden");
      search.classList.add("hidden");
      document.getElementById("garchig").classList.remove("hidden");
      search.getElementsByTagName("input")[0].value = "";
      onSearch && onSearch("");
    } else {
      document.getElementById("mobileSearch").classList.add("hidden");
      document.getElementById("search").classList.remove("hidden");
      document.getElementById("garchig").classList.add("hidden");
    }

    setMSearch(!mSearch);
  }
  function showSanalKhuselt(ajiltan) {
    const footer = [
      <Button onClick={() => sanalKhuseltRef.current.khaaya()}>
        {t("Хаах")}
      </Button>,
      <Button
        className="space-x-2"
        icon={<FiSend />}
        type="primary"
        onClick={() => sanalKhuseltRef.current.ilgeeye()}
      >
        {t("Илгээх")}
      </Button>,
    ];
    modal({
      title: t("Системтэй холбоотой санал хүсэлт илгээх"),
      icon: <FiSend />,
      content: <SanalKhuseltIlgeekh ref={sanalKhuseltRef} ajiltan={ajiltan} />,
      footer,
    });
  }

  const license = useMemo(() => {
    const ognoo = moment(new Date()).format("YYYY-MM-DD");
    let duusakh = moment(ajiltan?.duusakhOgnoo).format("YYYY-MM-DD");
    if (Array.isArray(ajiltan?.salbaruud) && ajiltan?.salbaruud?.length > 0) {
      let tukhainDuusakhOgnoo = ajiltan?.salbaruud?.find(
        (mur) => mur.salbariinId === barilgiinId
      )?.duusakhOgnoo;
      duusakh = moment(tukhainDuusakhOgnoo).format("YYYY-MM-DD");
    }
    const khonog = moment(duusakh).diff(moment(ognoo), "days");
    return <span className="font-bold text-red-500">{khonog}</span>;
  }, [ajiltan, barilgiinId]);
  const barilguud = useMemo(() => {
    return baiguullaga?.barilguud?.filter(
      (a) =>
        !!ajiltan?.barilguud?.find((b) => b === a._id) ||
        ajiltan?.erkh === "Admin"
    );
  }, [baiguullaga, ajiltan]);

  const images = [];
  if (typeof window !== "undefined") {
    const snowflake1 = document.createElement("img");
    snowflake1.src = "/snowflake.png";
    const snowflake2 = document.createElement("img");
    snowflake2.src = "/snowflake1.png";
    images.push(snowflake1);
    images.push(snowflake2);
  }

  return (
    <div
      onClick={() => {
        visible === true && setVisible(false);
        showSidehelpBar === true && setShowSidehelpBar(false);
        !!setTurulZagvar &&
          fixedZagvarNeegdsenEsekh === true &&
          setTurulZagvar(false);
      }}
      className="relative min-h-screen w-screen overflow-hidden bg-green-600 px-3 pb-5 dark:bg-gray-900 md:flex md:flex-row md:px-6 md:py-4"
    >
      {isOnline && (
        <Alert
          style={{ bottom: 20 }}
          className="absolute bg-red-100"
          message="Интернэт холболтоо шалгана уу!"
          type="error"
          showIcon
        />
      )}
      <Drawer
        placement={"right"}
        closable={false}
        onClose={() => setShowTuslamj(false)}
        visible={showTuslamj}
        key={"righttuslamj"}
        width={600}
        bodyStyle={{ padding: "10px 0" }}
      >
        <Tuslamj />
      </Drawer>
      {moment(new Date()).format("MM") === "12" ? (
        <Snowfall images={images} radius={[5, 30]} snowflakeCount={250} />
      ) : null}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-1/3 z-50 flex h-48 items-center transition-all ${
          showSidehelpBar
            ? "right-0"
            : `${
                visible === true
                  ? "-right-full md:-right-[10.5rem]"
                  : "-right-[11.25rem] md:-right-[10.5rem]"
              } delay-200 `
        }`}
      >
        <div
          onClick={() => setShowSidehelpBar(!showSidehelpBar)}
          className={`text-2xl ${
            showSidehelpBar
              ? "bg-white text-green-500 dark:border-green-500 dark:bg-gray-800"
              : " bg-yellow-500 text-white"
          } flex  h-11  w-10 cursor-pointer items-center justify-center rounded-l-lg border border-r-0 transition-all`}
        >
          <TbArrowBarLeft
            className="transition-all duration-200"
            style={{ rotate: showSidehelpBar ? "180deg" : "0deg" }}
          />
        </div>
        <div
          className={`overflow-hidden ${
            showSidehelpBar
              ? "h-48 rounded-l-lg border-r-0 bg-white delay-200 dark:bg-gray-800"
              : "h-11 border-none bg-green-600 dark:bg-gray-900"
          } flex w-48 flex-col border py-5 pl-3 transition-all dark:border-green-500`}
        >
          <div
            className={`flex h-full w-full flex-col justify-between ${
              showSidehelpBar
                ? "visible opacity-100 delay-200"
                : "invisible opacity-0"
            }`}
          >
            <div
              className={`group cursor-pointer rounded-l-lg border border-r-0 transition-all hover:scale-105 hover:bg-green-100 dark:border-green-500 dark:hover:bg-green-600 dark:hover:bg-opacity-30 `}
              onClick={() => {
                setShowTuslamj(true);
                setShowSidehelpBar(false);
              }}
            >
              <div
                className={`flex w-44 items-center space-x-2 p-1 text-black dark:text-gray-200 `}
              >
                <div className="rounded-md border bg-green-600 p-2 text-white transition-colors group-hover:bg-green-500">
                  <QuestionOutlined />
                </div>
                <div className="font-medium">{t("Тусламж")}</div>
              </div>
            </div>
            <div
              className={`group cursor-pointer rounded-l-lg border border-r-0 transition-all hover:scale-105 hover:bg-yellow-100 dark:border-green-500 dark:hover:bg-yellow-600 dark:hover:bg-opacity-30 `}
              onClick={() => {
                showSanalKhuselt(ajiltan);
                setShowSidehelpBar(false);
              }}
            >
              <div
                className={`flex w-44 items-center space-x-2 p-1 text-black dark:text-gray-200 ${
                  showSidehelpBar
                    ? "visible opacity-100 delay-200"
                    : "invisible opacity-0"
                }`}
              >
                <div className="rounded-md border bg-yellow-600 p-2 text-white transition-colors group-hover:bg-yellow-500">
                  <FiSend />
                </div>
                <div className="font-medium">{t("Санал хүсэлт")}</div>
              </div>
            </div>
            <div
              className={`group cursor-pointer rounded-l-lg border border-r-0 transition-all hover:scale-105 hover:bg-red-100 dark:border-green-500 dark:hover:bg-red-600 dark:hover:bg-opacity-30 ${
                showSidehelpBar ? "visible opacity-100" : "invisible opacity-0"
              }`}
              onClick={() => {
                window.location.assign(getOS());
                setShowSidehelpBar(false);
              }}
            >
              <div
                className={`flex w-44 items-center space-x-2 p-1 text-black dark:text-gray-200 ${
                  showSidehelpBar
                    ? "visible opacity-100 delay-200"
                    : "invisible opacity-0"
                }`}
              >
                <div className="rounded-md border bg-red-600 p-2 text-white transition-colors group-hover:bg-red-500">
                  <SiAnydesk />
                </div>
                <div className="font-medium">{t("AnyDesk татах")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Head>
        <title>{t(title)}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Updater />
      <div className="flex items-center justify-between py-4">
        {dedKhuudas && (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600  focus:ring-opacity-50 md:hidden"
            onClick={() =>
              _.isFunction(onBack) ? onBack(router.back) : router.back()
            }
          >
            <LeftOutlined
              style={{ fontSize: "15px" }}
              className="flex items-center justify-center text-gray-50"
            />
          </button>
        )}
        <div className="flex gap-2 md:hidden">
          <img
            className="h-10 w-10 "
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
                value={barilgiinId}
                onChange={({ target }) => barilgaSoliyo(target.value, ajiltan)}
                className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-1 pr-8 leading-tight text-black shadow hover:border-gray-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
              >
                {barilguud?.map((a) => (
                  <option
                    key={a?._id}
                    className=""
                    value={a?._id}
                    disabled={a.disabled}
                  >
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
        {!dedKhuudas && (
          <button
            className="border-none outline-none md:hidden"
            onClick={() => {
              setVisible(!visible);
              !!setNeesenEsekh && setNeesenEsekh(!visible);
            }}
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
              className="feather feather-bar-chart-2 h-8 w-8 -rotate-90 text-white"
            >
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          </button>
        )}
      </div>
      {!dedKhuudas && (
        <NTses
          khuudasnuud={khuudasnuud}
          baiguullaga={baiguullaga}
          khuudasniiNer={khuudasniiNer}
          ajiltan={ajiltan}
          ajiltniiJagsaalt={ajiltniiJagsaalt}
          ajiltanNemya={ajiltanNemya}
          setToken={setToken}
          onChangeBarilga={onChangeBarilga}
          ajiltanKhasya={ajiltanKhasya}
          barilgaSoliyo={barilgaSoliyo}
          barilgiinId={barilgiinId}
        />
      )}
      {!dedKhuudas && (
        <MTses
          visible={visible}
          khuudasnuud={khuudasnuud}
          khuudasniiNer={khuudasniiNer}
        />
      )}
      <h2
        id="garchig"
        className=" -mt-4 ml-3 flex text-base font-semibold text-white md:hidden "
      >
        {t(title)}
      </h2>
      <div
        className={`rounded-3xl bg-gray-100 dark:bg-gray-800 md:px-2 ${
          dedKhuudas ? "w-full" : "main"
        }`}
      >
        <div className="flex h-12 flex-row justify-between border-b p-2 ">
          <div className="flex">
            {dedKhuudas && (
              <button
                className="hidden h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600  focus:ring-opacity-50 md:flex"
                onClick={() =>
                  _.isFunction(onBack) ? onBack(router.back) : router.back()
                }
              >
                <LeftOutlined
                  style={{ fontSize: "15px" }}
                  className="flex items-center justify-center dark:text-gray-50"
                />
              </button>
            )}
            <h2
              id="garchig"
              className=" ml-3 hidden items-center justify-center text-base  font-semibold text-green-800  dark:text-gray-200 md:flex "
            >
              {t(title)}
            </h2>
          </div>
          <div className="flex w-full flex-row justify-between md:w-auto md:space-x-3 lg:space-x-6">
            {token && baiguullaga?._id && barilgiinId && (
              <div className="hidden h-8 items-center justify-center md:flex ">
                <MsgToololt token={token} baiguullagiinId={baiguullaga?._id} barilgiinId={barilgiinId} />
              </div>
            )}
            {tsonkhniiId && (
              <div className="hidden h-8 items-center justify-center md:flex ">
                <Zaavar token={token} id={tsonkhniiId} />
              </div>
            )}
            <div className="hidden h-8 items-center justify-center md:flex">
              <div className="mr-4 hidden whitespace-nowrap text-gray-700 dark:text-gray-300 lg:flex">
                Dark Mode
              </div>
              <Switch
                className="bg-green-500"
                checked={themeValue}
                checkedChildren={
                  <svg className="" focusable="false" viewBox="0 0 24 24">
                    <path d="M9.37 5.51c-.18.64-.27 1.31-.27 1.99 0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27C17.45 17.19 14.93 19 12 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path>
                  </svg>
                }
                unCheckedChildren={
                  <svg className="" focusable="false" viewBox="0 0 24 24">
                    <path d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"></path>
                  </svg>
                }
                onClick={() => setTheme(themeValue ? "light" : "dark")}
              />
            </div>
            <div className="flex w-6 gap-2 transition-all hover:scale-105">
              {i18n.language === "en" ? (
                <img
                  onClick={() => {
                    i18n.changeLanguage("mn");
                    window.localStorage.setItem("Localelanguage", "mn");
                  }}
                  className={`w-full cursor-pointer object-contain transition-all`}
                  src="/MN.png"
                />
              ) : (
                <img
                  onClick={() => {
                    i18n.changeLanguage("en");
                    window.localStorage.setItem("Localelanguage", "en");
                  }}
                  className={`w-full cursor-pointer object-contain transition-all`}
                  src="/UK.png"
                />
              )}
            </div>
            <div className="hidden items-center justify-center md:flex">
              {t("Лиценз")}- {license}
            </div>
            {!hideSearch ? (
              <>
                <div
                  id="search"
                  className="relative hidden w-40 text-gray-700 dark:text-gray-300 md:block xl:w-56"
                >
                  <input
                    onFocus={() => setFocusaasGarsan(false)}
                    onBlur={() =>
                      setTimeout(() => {
                        setFocusaasGarsan(true);
                      }, 200)
                    }
                    ref={searchUtga ? searchUtga : undefined}
                    onDoubleClick={khailtDoubleClick}
                    onClick={() => {
                      if (searchUtga) {
                        searchUtga.current.select();
                      }
                    }}
                    onChange={({ target }) => {
                      if (!!onSearch) {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                          onSearch(target.value);
                        }, 300);
                      }
                    }}
                    type="text"
                    className="box w-40 px-3 py-1 pr-10 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 xl:w-56"
                    placeholder={`${t("Хайлт")}...`}
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
                  {suggestionData &&
                    searchUtga?.current?.value !== "" &&
                    !focusaasGarsan && (
                      <div
                        onClick={() => setFocusaasGarsan(false)}
                        className="box relative z-20 mt-[2px] max-h-[200px] w-40 overflow-y-auto px-3 py-1 pr-10 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 xl:w-56"
                      >
                        {suggestionData.length > 0 ? (
                          suggestionData.map((mur, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setFocusaasGarsan(false);
                                if (searchUtga) {
                                  searchUtga.current.value = mur.mashiniiDugaar;
                                  if (!!onSearch) {
                                    clearTimeout(timeout);
                                    timeout = setTimeout(function () {
                                      onSearch(mur.mashiniiDugaar);
                                    }, 300);
                                  }
                                  setFocusaasGarsan(true);
                                }
                              }}
                              className="w-full cursor-pointer py-1 hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              {mur.mashiniiDugaar}
                            </div>
                          ))
                        ) : (
                          <div>Машин олдсонгүй</div>
                        )}
                      </div>
                    )}
                </div>
                <MSearch
                  className="relative block text-gray-700 dark:text-gray-300 md:hidden"
                  onClick={onClickSearch}
                />
              </>
            ) : (
              <div></div>
            )}
            <div className="flex gap-[5px]">
              <Tooltip
                placement="bottom"
                title={
                  <div>
                    {
                      ("Лицензийн хугацаа дуусахад хоног үлдлээ",
                      { khonog: license })
                    }
                  </div>
                }
              >
                <div className="ml-1 flex items-center gap-1 text-base md:hidden">
                  {license}:
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-clock d-block mx-auto"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </Tooltip>
              <ProfileTovch
                ajiltan={ajiltan}
                garya={garya}
                token={token}
                showSanalKhuselt={showSanalKhuselt}
                setShowTuslamj={setShowTuslamj}
              />
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-12 gap-6 ${className} relative`}>
          {loading && <Loader />}
          {children}
        </div>
      </div>
      <div
        className={`fixed bottom-[1.7rem] z-40 ${
          visible === true ? "-right-full" : "right-5"
        } flex h-8 items-center justify-center rounded-3xl bg-green-600 px-3 py-5 shadow-md transition-all duration-500 dark:bg-gray-900 md:hidden`}
      >
        <div className="mr-4 flex whitespace-nowrap text-white dark:text-gray-300">
          Dark Mode
        </div>
        <Switch
          checked={themeValue}
          onClick={() => setTheme(themeValue ? "light" : "dark")}
        />
      </div>
    </div>
  );
}
export default Admin;
