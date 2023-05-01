import {
  LogoutOutlined,
  QuestionOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Menu, Tooltip, Empty, Drawer, Button } from "antd";
import Link from "next/link";
import React, { useState } from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import useSonorduulga from "hooks/useSonorduulga";
import { FiSend } from "react-icons/fi";
import SanalKhuseltIlgeekh from "./SanalKhuseltIlgeekh";
import { modal } from "components/ant/Modal";
import { useTranslation } from "react-i18next";

function idAwyaa(mur) {
  var id = undefined;
  switch (mur.turul) {
    case "setgegdel":
      id = mur?.object?.daalgavriinId;
      break;
    case "daalgavar":
      id = mur?.object?._id;
      break;

    default:
      id = mur?.object?.khariltsagchiinId;
      break;
  }
  return id;
}

function hrefAvya(mur, ajiltan) {
  var href = "";

  if (ajiltan.erkh === "Admin")
    switch (mur.turul) {
      case "daalgavar":
        href = "/khyanalt/daalgavar/admin";
        break;
      case "sanal":
      case "gomdol":
        href = `/khyanalt/medegdel/sanalKhuselt`;
        break;
      case "setgegdel":
        href = "/khyanalt/daalgavar/admin";
        break;
      default:
        break;
    }
  else {
    switch (mur.turul) {
      case "daalgavar":
        href = "/khyanalt/daalgavar";
        break;
      case "sanal":
      case "gomdol":
        href = `/khyanalt/medegdel/sanalKhuselt`;
        break;
      case "setgegdel":
        href = "/khyanalt/daalgavar";
        break;
      default:
        break;
    }
  }
  return href;
}

function ProfileTovch({ ajiltan, garya, token, setShowTuslamj, showSanalKhuselt }) {
  const {
    sonorduulga,
    sonorduulgaMutate,
    jagsaalt,
    setKhuudaslalt,
    kharaaguiToo,
  } = useSonorduulga(token, ajiltan?._id);
const { t } = useTranslation()
  function sonorduulgaKharlaa(id, sonorduulgaId) {
    uilchilgee(token)
      .post("/sanalKharlaa", { id, sonorduulgaId })
      .then(() => sonorduulgaMutate())
      .catch(aldaaBarigch);
  }
  
  

  function onScroll(e) {
    if (
      e.target.scrollHeight - e.target.scrollTop - 1 < e.target.clientHeight &&
      !!sonorduulga &&
      sonorduulga?.jagsaalt.length === 20
    ) {
      setKhuudaslalt((kh) => ({
        khuudasniiDugaar: kh.khuudasniiDugaar + 1,
        khuudasniiKhemjee: 20,
        jagsaalt: [...kh.jagsaalt, ...sonorduulga?.jagsaalt],
      }));
    }
  }


  return (
    <div className="flex h-8 items-center justify-end gap-1 md:gap-3">
     
      <Dropdown
        trigger="click"
        overlay={
          <Menu>
            <Menu.Item>{t("Сонордуулга")}</Menu.Item>
            <Menu.Divider />

            <div
              style={{ maxHeight: "70vh", overflow: "auto" }}
              onScroll={onScroll}
            >
              {[...jagsaalt, ...(sonorduulga?.jagsaalt || [])].map((mur, i) => {
                const {
                  turul,
                  message,
                  khariltsagchiinNer,
                  _id,
                  tailbar,
                  ajiltniiNer,
                  ajiltniiId,
                } = mur?.object || {};
                  return (
                    <Menu.Item
                      key={`sonorduulga${i}`}
                      onClick={() => sonorduulgaKharlaa(_id, mur?._id)}
                      className={`${
                        mur.kharsanEsekh
                          ? "kharsanSonorduulga opacity-70"
                          : "kharaaguiSonorduulga"
                      }`}
                    >
                      <Link
                        href={{
                          pathname: hrefAvya(mur, ajiltan),
                          query: { id: idAwyaa(mur), notificationTurul:mur?.turul },
                        }}
                      >
                        <div className="relative  flex cursor-pointer items-center justify-between space-x-2">
                          <div className="flex" style={{ maxWidth: `2.5rem` }}>
                            <Tooltip title={khariltsagchiinNer}>
                              <img
                                alt={khariltsagchiinNer}
                                className={`zoom-in h-10 w-10 rounded-full bg-white`}
                                src={"/profile.svg"}
                              />
                            </Tooltip>
                            {!mur.kharsanEsekh && (
                              <div className="bg-theme-9 absolute left-0 bottom-0 h-3 w-3 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="grid w-60 grid-cols-2 overflow-hidden">
                            <div className="col-span-1">
                              <a className="font-medium">
                                {khariltsagchiinNer || ajiltniiNer || mur?.title}
                              </a>
                              <div
                                className=" z-50 flex pr-4 flex-row overflow-hidden  whitespace-nowrap text-gray-600  dark:text-gray-300  "
                                style={{ textOverflow: "ellipsis" }}
                              >
                                <div className="truncate">{message || tailbar || mur?.message}</div>
                              </div>
                            </div>
                            <div className="col-span-1 space-y-2">
                              <div className=" whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                                {moment(mur.createdAt).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )}
                              </div>
                              <div>
                                {mur.turul === "daalgavar" ? (
                                  <div className="flex justify-center rounded-md bg-green-500 px-2 text-white ">
                                    {t("Даалгавар")}
                                  </div>
                                ) : mur.turul === "sanal" ? (
                                  <div className="flex justify-center rounded-md bg-yellow-500 px-2 text-white ">
                                    {t("Санал")}
                                  </div>
                                ) : mur.turul === "gomdol" ? (
                                  <div className="flex justify-center rounded-md bg-red-500 px-2 text-white ">
                                    {t("Гомдол")}
                                  </div>
                                ) : mur.turul === "medegdel" ? (
                                  <div className="flex justify-center rounded-md bg-blue-500 px-2 text-white ">
                                    {t("Мэдэгдэл")}
                                  </div>
                                ) : mur.turul === "shaardlaga" ? (
                                  <div className="flex justify-center rounded-md bg-blue-500 px-2 text-white ">
                                    {t("Шаардлага")}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </Menu.Item>
                  );
              })}
              {!!sonorduulga && !(sonorduulga?.jagsaalt?.length > 0) && (
                <Menu.Item>
                  <Empty description="Хоосон байна" />
                </Menu.Item>
              )}
            </div>
          </Menu>
        }
      >
        <button className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 dark:text-white">
          <Badge count={kharaaguiToo} dot>
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
              className="feather feather-bell mx-auto block h-5 w-5 dark:text-white"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </Badge>
        </button>
      </Dropdown>
      <Dropdown
        overlayClassName="profile"
        overlay={
          <Menu>
            <Menu.Item className="profileMenuItem">
              <div className="text-lg font-medium text-white">
                {`${(ajiltan?.ovog && ajiltan?.ovog[0]) || ""}.${ajiltan?.ner}`}
              </div>
              <div className="text-sm font-medium text-gray-200">
                {ajiltan?.albanTushaal}
              </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="0" className="profileMenuItem">
              <Link href="/khyanalt/tokhirgoo">
                <a>
                  <div className="flex w-44 items-center space-x-2 text-white dark:text-gray-100">
                    <SettingOutlined />
                    <span>{t("Тохиргоо")}</span>
                  </div>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item
              key="1"
              className="profileMenuItem"
              onClick={() => setShowTuslamj(true)}
            >
              <div className="flex w-44 items-center space-x-2 text-white">
                <QuestionOutlined />
                <span>{t("Тусламж")}</span>
              </div>
            </Menu.Item>
            <Menu.Item
              key="2"
              className="profileMenuItem"
              onClick={() => showSanalKhuselt(ajiltan)}
            >
              <div className="flex w-44 items-center space-x-2 text-white">
                <FiSend />
                <span>{t("Санал хүсэлт")}</span>
              </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3" onClick={garya} className="profileMenuItem">
              <div className="flex w-44 items-center space-x-2 text-white">
                <LogoutOutlined />
                <span>{t("Гарах")}</span>
              </div>
            </Menu.Item>
          </Menu>
        }
        trigger="click"
        className="cursor-pointer"
      >
        <button className="flex h-8 w-8 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
          <img
            alt={ajiltan?.ner}
            src={
              ajiltan?.zurgiinNer
                ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`
                : ((ajiltan?.register?.replace(/^\D+/g, "") % 100) / 10) % 2 < 1
                ? "/profileFemale.svg"
                : "/profile.svg"
            }
            className="h-8 w-8 rounded-full bg-gray-200 p-1 shadow-xl"
          />
        </button>
      </Dropdown>
    </div>
  );
}

export default ProfileTovch;
