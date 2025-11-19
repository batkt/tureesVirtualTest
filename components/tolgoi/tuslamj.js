import { LeftOutlined } from "@ant-design/icons";
import { GiArrowDunk } from "react-icons/gi/index";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import { Image, Tabs } from "antd";
import _ from "lodash";
import { useAuth } from "services/auth";
import Faq from "./faq";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";

function Tuslamj() {
  const { t, i18n } = useTranslation();
  const [songogdsonAlkham, setSongogdsonAlkham] = useState(0);
  const [daragdsanTokhirgooMedeelel, setDaragdsanTokhirgooMedeelel] =
    useState(0);
  const tuslamj = useJagsaalt("https://admin.zevtabs.mn/api/tuslamjAvya/rent");

  useEffect(() => {
    Aos.init({ once: true });
  });
  const { ajiltan } = useAuth();

  return (
    <div className="h-full w-full overflow-hidden px-5">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          className="h-[100vh]"
          tab={
            <span className="text-base font-medium">
              {t("Нэвтрүүлэлтийн алхам")}
            </span>
          }
          key="1"
        >
          <div
            className={`relative h-[90%] space-y-3  px-5  pb-10 ${
              songogdsonAlkham === 0 ? "overflow-y-auto overflow-x-hidden" : ""
            }`}
          >
            <div
              className={`absolute z-30 text-lg transition-all duration-500 ${
                songogdsonAlkham === 0 ? "left-full" : "left-0 "
              }`}
            >
              <LeftOutlined
                className={`ml-2 mt-2 rounded-full border-2 p-1 transition-all duration-500 hover:bg-green-600 hover:bg-opacity-30 dark:text-gray-200 ${
                  songogdsonAlkham === 0 ? "invisible opacity-0" : "opacity-100"
                }`}
                onClick={() => setSongogdsonAlkham(0)}
              />
            </div>
            {_.sortBy(tuslamj?.data, (v) => v.daraalal)?.map((mur, index) => {
              return (
                <div
                  key={index}
                  className={`group flex h-[120px] w-full scale-95 cursor-pointer items-center rounded-full bg-green-600 p-1 transition-all duration-500 hover:scale-100 hover:bg-green-800 ${
                    songogdsonAlkham === 0
                      ? "relative right-0 top-0 opacity-100"
                      : songogdsonAlkham === index + 1
                      ? `absolute -right-3/4 -top-14 z-50 opacity-100`
                      : "invisible relative -top-96 opacity-0"
                  }`}
                  onClick={
                    songogdsonAlkham === index + 1
                      ? () => setSongogdsonAlkham(0)
                      : () => setSongogdsonAlkham(index + 1)
                  }
                >
                  <div className="relative flex min-h-[112px] min-w-[112px] items-center justify-center rounded-full bg-white ">
                    <img
                      src={
                        mur.zurgiinId &&
                        `https://admin.zevtabs.mn/api/file?path=tuslamj/${mur.zurgiinId}`
                      }
                      className="animate-css-deer  h-20"
                    />
                  </div>
                  <div
                    className={` w-full py-2 pl-3 pr-6 transition-opacity duration-700`}
                  >
                    <h1
                      className={`pl-12 text-2xl font-semibold text-white transition-all duration-500 ${
                        songogdsonAlkham === index + 1
                          ? "absolute -left-[60%] top-6 -z-50 w-full rounded-l-full bg-green-600 px-10 py-6 pr-20 group-hover:bg-green-800"
                          : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
                      }`}
                    >
                      {i18n.language === "mn" ? mur?.garchig : mur.garchigEN}
                    </h1>
                    <p
                      className={`text-white ${
                        songogdsonAlkham === index + 1
                          ? "opacity-0"
                          : "opacity-100"
                      }`}
                    >
                      {i18n.language === "mn" ? mur?.tailbar : mur?.tailbarEN}
                    </p>
                  </div>
                  {index + 1 !== tuslamj?.data?.length && index % 2 === 0 && (
                    <div className="absolute -bottom-7 -right-2 text-5xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                      <GiArrowDunk className="rotate-[80deg]" />
                    </div>
                  )}
                  {index + 1 !== tuslamj?.data?.length && index % 2 !== 0 && (
                    <div
                      className={`absolute -bottom-7 -left-3 text-5xl text-green-600 transition-all duration-500 group-hover:text-green-800 ${
                        songogdsonAlkham === index + 1
                          ? "opacity-0"
                          : "opacity-100"
                      }`}
                    >
                      <GiArrowDunk className="-rotate-[80deg] -scale-x-100" />
                    </div>
                  )}
                </div>
              );
            })}
            {tuslamj?.data?.map((data, i) => {
              return songogdsonAlkham === i + 1 ? (
                <div
                  key={i}
                  data-aos="fade-right"
                  data-aos-delay="200"
                  className={`absolute top-20 z-10 h-scrollH w-full overflow-y-auto px-3 py-5 pr-16 ${
                    data?.turul === "dropdown" ? "" : "space-y-10"
                  }`}
                >
                  {data?.alkhamuud?.map((a, i) => {
                    if (data?.turul === "dropdown") {
                      return (
                        <div
                          key={i}
                          className={`h-auto w-full overflow-hidden rounded-xl border-2 border-y-0 transition-all duration-300`}
                        >
                          <div
                            onClick={
                              daragdsanTokhirgooMedeelel === i + 1
                                ? () => setDaragdsanTokhirgooMedeelel(0)
                                : () => setDaragdsanTokhirgooMedeelel(i + 1)
                            }
                            className="flex cursor-pointer items-center justify-between pr-5"
                          >
                            <img
                              className="w-full"
                              src={
                                a.zurgiinId &&
                                `https://admin.zevtabs.mn/api/file?path=tuslamj/${a.zurgiinId}`
                              }
                            />
                            <LeftOutlined
                              className={`transition-all duration-300 dark:text-gray-200 ${
                                daragdsanTokhirgooMedeelel === i + 1
                                  ? "-rotate-90"
                                  : "rotate-0"
                              }`}
                            />
                          </div>
                          <div
                            className={`px-5 text-opacity-80 transition-all duration-300 dark:text-gray-200 ${
                              daragdsanTokhirgooMedeelel === i + 1
                                ? "h-32 overflow-y-auto  py-5 opacity-100 "
                                : "invisible h-0 opacity-0"
                            }`}
                          >
                            {i18n.language === "mn" ? a?.tailbar : a?.tailbarEN}
                          </div>
                        </div>
                      );
                    } else
                      return (
                        <div
                          key={i}
                          className="w-full space-y-3 rounded-md border px-5 py-2 shadow-xl dark:bg-gray-900 dark:shadow-lg dark:shadow-white"
                        >
                          <div className="w-full text-center font-medium dark:text-gray-200">
                            {i18n.language === "mn" ? a?.garchig : a?.garchigEN}
                          </div>
                          <div className="px-3">
                            {a.turul === "video" ? (
                              <iframe
                                width="100%"
                                height={"200"}
                                src={`https://www.youtube.com/embed/${a.link}`}
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                              ></iframe>
                            ) : (
                              <Image
                                width={"100%"}
                                height={220}
                                src={
                                  a.zurgiinId &&
                                  `https://admin.zevtabs.mn/api/file?path=tuslamj/${a.zurgiinId}`
                                }
                                className={` border border-dashed border-blue-500 bg-gray-900 object-contain `}
                              />
                            )}
                          </div>
                          <p className="px-2 pb-2 dark:text-gray-200">
                            {i18n.language === "mn" ? a?.tailbar : a?.tailbarEN}
                          </p>
                        </div>
                      );
                  })}
                </div>
              ) : null;
            })}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span className="text-base font-medium">
              {t("Түгээмэл асуулт")}
            </span>
          }
          className="h-[100vh]"
          key="2"
        >
          <Faq />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default React.forwardRef(Tuslamj);
