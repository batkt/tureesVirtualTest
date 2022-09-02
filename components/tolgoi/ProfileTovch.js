import {
  LogoutOutlined,
  QuestionOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Menu, Tooltip, Empty } from "antd";
import Link from "next/link";
import React from "react";
import moment from "moment";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import useSonorduulga from "hooks/useSonorduulga";

function hrefAvya(mur, ajiltan, turul, _id) {
  var href = "";

  if (ajiltan.erkh === "Admin")
    switch (mur.turul) {
      case "daalgavar":
        href = "/khyanalt/daalgavar/admin";
        break;
      case "sanal":
        href = `/khyanalt/medegdel/${turul}/${_id}`;
      case "gomdol":
        href = `/khyanalt/medegdel/${turul}/${_id}`;
      case "setgegdel":
        href = "/khyanalt/daalgavar/admin";
      default:
        break;
    }
  else {
    switch (mur.turul) {
      case "daalgavar":
        href = "/khyanalt/daalgavar";
        break;
      case "sanal":
        href = `/khyanalt/medegdel/${turul}/${_id}`;
      case "gomdol":
        href = `/khyanalt/medegdel/${turul}/${_id}`;
      case "setgegdel":
        href = "/khyanalt/daalgavar";
      default:
        break;
    }
  }
  return href;
}

function ProfileTovch({ ajiltan, garya, token }) {
  const {
    sonorduulga,
    sonorduulgaMutate,
    jagsaalt,
    setKhuudaslalt,
    kharaaguiToo,
  } = useSonorduulga(token, ajiltan?._id);

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
    <div className="flex h-8 items-center justify-end gap-3">
      <Dropdown
        trigger="click"
        overlay={
          <Menu>
            <Menu.Item>Сонордуулга</Menu.Item>
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
                        pathname: hrefAvya(mur, ajiltan, turul, _id),
                        query: { id: mur.object.daalgavriinId },
                      }}
                    >
                      <div className="relative  flex cursor-pointer items-center justify-between">
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
                        <div className="ml-2 w-60 overflow-hidden">
                          <div className="flex w-full items-center">
                            <a className="mr-5 font-medium">
                              {khariltsagchiinNer || ajiltniiNer}
                            </a>
                            <div className="ml-auto whitespace-nowrap text-xs text-gray-500 dark:text-gray-300">
                              {moment(mur.createdAt).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </div>
                          </div>
                          <div className="mt-0.5 flex w-full flex-row text-gray-600 dark:text-gray-300">
                            <div>{message || tailbar}</div>
                            {mur.turul === "daalgavar" && (
                              <div className="ml-auto rounded-md bg-red-400 px-2 text-white">
                                Даалгавар
                              </div>
                            )}
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
        <button className="focus:outline-none flex h-8 w-8 items-center justify-center rounded-full focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 dark:text-white">
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
                {`${ajiltan?.ovog[0] || ""}.${ajiltan?.ner}`}
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
                    <span>Тохиргоо</span>
                  </div>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="1" className="profileMenuItem">
              <div className="flex w-44 items-center space-x-2 text-white">
                <QuestionOutlined />
                <span>Тусламж</span>
              </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3" onClick={garya} className="profileMenuItem">
              <div className="flex w-44 items-center space-x-2 text-white">
                <LogoutOutlined />
                <span>Гарах</span>
              </div>
            </Menu.Item>
          </Menu>
        }
        trigger="click"
        className="cursor-pointer"
      >
        <button className="focus:outline-none flex h-8 w-8 items-center justify-center rounded-full focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
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
