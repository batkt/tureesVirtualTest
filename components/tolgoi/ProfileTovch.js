import {
  BellOutlined,
  LogoutOutlined,
  QuestionOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Menu, Skeleton, Tooltip, Empty } from "antd";
import Link from "next/link";
import React from "react";
import moment from "moment";
import uilchilgee, { url } from "services/uilchilgee";
import useSonorduulga from "hooks/useSonorduulga";

function ProfileTovch({ ajiltan, garya, token }) {
  const { sonorduulga, sonorduulgaMutate, jagsaalt, setKhuudaslalt } =
    useSonorduulga(token, ajiltan?._id);

  function sonorduulgaKharlaa(id) {
    uilchilgee(token)
      .post("/sonorduulgaKharlaa", { id })
      .then(({ data, status }) => {
        if (status === 200 && data === "Amjilttai") {
          sonorduulgaMutate((ug) => ({ ...ug, jagsaalt: [...ug.jagsaalt] }));
        }
      });
  }

  function onScroll(e) {
    if (
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight &&
      !!sonorduulga &&
      sonorduulga?.jagsaalt.length === 10
    ) {
      setKhuudaslalt((kh) => ({
        khuudasniiDugaar: kh.khuudasniiDugaar + 1,
        jagsaalt: [...kh.jagsaalt, ...sonorduulga?.jagsaalt],
      }));
    }
  }

  return (
    <div className="h-8 flex justify-end items-center gap-3">
      <Dropdown
        trigger="click"
        overlay={
          <Menu
            style={{ maxHeight: "70vh", overflow: "auto" }}
            onScroll={onScroll}
          >
            <Menu.Item>Сонордуулга</Menu.Item>
            <Menu.Divider />
            {!(sonorduulga?.jagsaalt?.length > 0) && (
              <Menu.Item>
                <Empty description="Хоосон байна" />
              </Menu.Item>
            )}
            {[...jagsaalt, ...(sonorduulga?.jagsaalt || [])].map((mur, i) => {
              const {
                ognoo,
                khariltsagchiinUtas,
                khariltsagchiinNer,
                zakhialguud = [],
                mashiniiDugaar,
              } = mur.object;
              return (
                <Menu.Item key={i} onClick={() => sonorduulgaKharlaa(mur._id)}>
                  <Link
                    href={
                      "/khyanalt/ajiltanKhyanalt/ajiltaniiZakhialguud" +
                      "/" +
                      ajiltan._id
                    }
                  >
                    <div className="cursor-pointer relative flex items-center justify-between">
                      <div
                        className="flex"
                        style={{
                          maxWidth: `${2.5 + 1.25 * zakhialguud.length}rem`,
                        }}
                      >
                        {zakhialguud.map((murj, ij) => {
                          return (
                            <Tooltip key={ij} title={murj.ner}>
                              <img
                                alt={murj.zurgiinNer}
                                className={`w-10 h-10 zoom-in rounded-full bg-white ${
                                  ij !== 0 ? "-ml-5" : ""
                                }`}
                                src={
                                  mur.zurgiinNer
                                    ? `${url}/zuragAvya/${mur.zurgiinNer}`
                                    : "/car-repair.png"
                                }
                              />
                            </Tooltip>
                          );
                        })}
                        {!mur.kharsanEsekh && (
                          <div className="w-3 h-3 bg-theme-9 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="ml-2 overflow-hidden w-60">
                        <div className="w-full flex items-center">
                          <a className="font-medium truncate mr-5">
                            {khariltsagchiinNer}
                          </a>
                          <div className="text-xs text-gray-500 ml-auto whitespace-nowrap">
                            {moment(ognoo).format("YYYY-MM-DD HH:mm")}
                          </div>
                        </div>
                        <div className="w-full truncate text-gray-600 mt-0.5">
                          {mashiniiDugaar}
                        </div>
                        <label>{khariltsagchiinUtas}</label>
                      </div>
                    </div>
                  </Link>
                </Menu.Item>
              );
            })}
            {!sonorduulga && (
              <Menu.Item>
                <div className="cursor-pointer relative flex items-center justify-between">
                  <div className="flex" style={{ width: `3.5rem` }}>
                    <Skeleton.Avatar active />
                  </div>
                  <div className="ml-2 overflow-hidden w-60">
                    <div className="w-full flex items-center">
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: "5rem" }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        className="ml-auto"
                        style={{ width: "5rem" }}
                      />
                    </div>
                    <Skeleton.Input
                      active
                      size="small"
                      className="mt-2"
                      style={{ width: "15rem" }}
                    />
                  </div>
                </div>
              </Menu.Item>
            )}
          </Menu>
        }
      >
        <button className="h-8 w-8 flex rounded-full items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
          <Badge count={sonorduulga?.kharaaguiToo}>
            <BellOutlined className="text-2xl dark:text-gray-50 flex items-center justify-center" />
          </Badge>
        </button>
      </Dropdown>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item>
              <span className="text-lg">
                {ajiltan?.ovog || "" + " " + ajiltan?.ner || ""}
              </span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="0">
              <Link href="/khyanalt/tokhirgoo">
                <a>
                  <div className="flex items-center w-44 text-xl space-x-2 dark:text-gray-100">
                    <SettingOutlined />
                    <span>Тохиргоо</span>
                  </div>
                </a>
              </Link>
            </Menu.Item>
            <Menu.Item key="1">
              <div className="flex items-center w-44 text-xl space-x-2">
                <QuestionOutlined />
                <span>Тусламж</span>
              </div>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3" onClick={garya}>
              <div className="flex items-center w-44 text-xl space-x-2">
                <LogoutOutlined />
                <span>Гарах</span>
              </div>
            </Menu.Item>
          </Menu>
        }
        trigger="click"
        className="cursor-pointer"
      >
        <button className="h-8 w-8 flex rounded-full items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
          <img
            alt={ajiltan?.ner}
            src={
              ajiltan?.zurgiinNer
                ? `${url}/ajiltniiZuragAvya/${ajiltan?.baiguullagiinId}/${ajiltan?.zurgiinNer}`
                : "/profile.svg"
            }
            className="h-8 w-8 rounded-full p-1 shadow-xl bg-gray-200"
          />
        </button>
      </Dropdown>
    </div>
  );
}

export default ProfileTovch;
