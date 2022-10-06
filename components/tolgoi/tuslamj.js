import { LeftOutlined, SettingFilled } from "@ant-design/icons";
import { FaFileContract } from "react-icons/fa/index";
import { GiArrowDunk } from "react-icons/gi/index";
import { ImUserPlus } from "react-icons/im/index";
import { RiFolderUserFill } from "react-icons/ri/index";
import React, { useEffect, useState } from "react";
import Aos from "aos";
import { Image, Tabs } from "antd";
import Link from "next/link";
import { useAuth } from "services/auth";
import Faq from "./faq";

function Tuslamj() {
  const [songogdsonAlkham, setSongogdsonAlkham] = useState(0);

  useEffect(() => {
    Aos.init({ once: true });
  }, []);
  const { ajiltan } = useAuth();

  return (
    <div className="h-full w-full overflow-hidden px-5">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          tab={
            <span className="text-base font-medium">нэвтрүүлэлтийн алхам</span>
          }
          key="1"
        >
          <div
            className={`relative h-[91vh] space-y-5  px-5  pb-10 ${
              songogdsonAlkham === 0 ? "overflow-y-auto overflow-x-hidden" : ""
            }`}
          >
            <div
              className={`absolute z-30 text-lg transition-all duration-500 ${
                songogdsonAlkham === 0 ? "left-full" : "left-0 "
              }`}
            >
              <LeftOutlined
                className={`mt-2 ml-2 rounded-full border-2 p-1 transition-all duration-500 hover:bg-green-600 hover:bg-opacity-30 ${
                  songogdsonAlkham === 0 ? "invisible opacity-0" : "opacity-100"
                }`}
                onClick={() => setSongogdsonAlkham(0)}
              />
            </div>
            <div
              className={`group relative flex h-[120px] w-full cursor-pointer items-center rounded-full bg-green-600 p-1 transition-all duration-500 hover:scale-95 hover:bg-green-800 ${
                songogdsonAlkham === 0
                  ? "top-0 right-0 opacity-100"
                  : songogdsonAlkham === 1
                  ? "absolute -right-3/4 -top-11 z-50 opacity-100"
                  : "invisible absolute -top-96 opacity-0"
              }`}
              onClick={
                songogdsonAlkham === 1
                  ? () => setSongogdsonAlkham(0)
                  : () => setSongogdsonAlkham(1)
              }
            >
              <div className="flex min-h-[112px] min-w-[112px] items-center justify-center rounded-full bg-white ">
                <div className="text-6xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                  <SettingFilled className="group-hover:animate-spin-mid" />
                </div>
              </div>
              <div
                className={` w-full py-2 pr-6 pl-3 transition-opacity duration-700`}
              >
                <h1
                  className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                    songogdsonAlkham === 1
                      ? "absolute -left-[190px] top-6 -z-50 rounded-l-full bg-green-600 py-6 px-10 pr-20 group-hover:bg-green-800"
                      : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
                  }`}
                >
                  Тохиргоо
                </h1>
                <p
                  className={`text-white ${
                    songogdsonAlkham === 1 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Систем ашиглахтай холбоотой байгууллагын үндсэн зарчмыг
                  оруулах шаардлага, түүний дагуу гэрээний ажиллагаанд хяналт
                  үүсэх боломжтой.
                </p>
              </div>
              <div className="absolute -bottom-7 -right-2 text-5xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                <GiArrowDunk className="rotate-[80deg]" />
              </div>
            </div>
            <div
              className={`group relative flex h-[120px] w-full cursor-pointer items-center rounded-full bg-green-600 p-1 transition-all duration-500 hover:scale-95 hover:bg-green-800 ${
                songogdsonAlkham === 0
                  ? "top-0 right-0 opacity-100"
                  : songogdsonAlkham === 2
                  ? "absolute -right-3/4 -top-[183px] z-50 opacity-100"
                  : "invisible absolute -top-96 opacity-0"
              }`}
              onClick={
                songogdsonAlkham === 2
                  ? () => setSongogdsonAlkham(0)
                  : () => setSongogdsonAlkham(2)
              }
            >
              <div className="flex min-h-[112px] min-w-[112px] items-center justify-center rounded-full bg-white ">
                <div className="text-6xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                  <RiFolderUserFill className="group-hover:mt-4 group-hover:animate-bounce" />
                </div>
              </div>
              <div
                className={` w-full py-2 pr-6 pl-3 transition-opacity duration-700 `}
              >
                <h1
                  className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                    songogdsonAlkham === 2
                      ? "absolute -left-[260px] top-6 -z-50 rounded-l-full bg-green-600 py-6 px-10 pr-20 group-hover:bg-green-800"
                      : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
                  }`}
                >
                  Ажилтан бүртгэл
                </h1>
                <p
                  className={`text-white ${
                    songogdsonAlkham === 2 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Системд ажилчдыг бүртгэлжүүлэх, Ажилтан системд нэвтрэх эрх
                  олгох боломжтой.
                </p>
              </div>
              <div
                className={`absolute -bottom-7 -left-3 text-5xl text-green-600 transition-all duration-500 group-hover:text-green-800 ${
                  songogdsonAlkham === 2 ? "opacity-0" : "opacity-100"
                }`}
              >
                <GiArrowDunk className="-rotate-[80deg] -scale-x-100" />
              </div>
            </div>
            <div
              className={`group relative flex h-[120px] w-full cursor-pointer items-center rounded-full bg-green-600 p-1 transition-all duration-500 hover:scale-95 hover:bg-green-800 ${
                songogdsonAlkham === 0
                  ? "top-0 right-0 opacity-100"
                  : songogdsonAlkham === 3
                  ? "absolute -right-3/4 -top-[325px] z-50 opacity-100"
                  : "invisible absolute -top-96 opacity-0"
              }`}
              onClick={
                songogdsonAlkham === 3
                  ? () => setSongogdsonAlkham(0)
                  : () => setSongogdsonAlkham(3)
              }
            >
              <div className="flex min-h-[112px] min-w-[112px] items-center justify-center rounded-full bg-white ">
                <div className="text-6xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                  <FaFileContract className="group-hover:mt-5 group-hover:animate-bounce" />
                </div>
              </div>
              <div
                className={` w-full py-2 pr-6 pl-3 transition-opacity duration-700 `}
              >
                <h1
                  className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                    songogdsonAlkham === 3
                      ? "absolute -left-[280px] top-6 -z-50 rounded-l-full bg-green-600 py-6 px-10 pr-20 group-hover:bg-green-800"
                      : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
                  }`}
                >
                  Гэрээний удирдлага
                </h1>
                <p
                  className={`text-white ${
                    songogdsonAlkham === 3 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Харилцагчтай байгуулсан гэрээний хугацаа, зээлийн дүн, хуваарь
                  болон бусад тохиролцоог зохицуулна.
                </p>
              </div>
              <div className="absolute -bottom-7 -right-2 text-5xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                <GiArrowDunk className="rotate-[80deg]" />
              </div>
            </div>
            <div
              className={`group relative z-10 flex h-[120px] w-full cursor-pointer items-center rounded-full bg-green-600 p-1 transition-all duration-500 hover:scale-95 hover:bg-green-800 ${
                songogdsonAlkham === 0
                  ? "top-0 right-0 opacity-100"
                  : songogdsonAlkham === 4
                  ? "absolute -right-3/4 -top-[464px] z-50 opacity-100"
                  : "invisible absolute -top-96 opacity-0"
              }`}
              onClick={
                songogdsonAlkham === 4
                  ? () => setSongogdsonAlkham(0)
                  : () => setSongogdsonAlkham(4)
              }
            >
              <div className="z-30 flex min-h-[112px] min-w-[112px] items-center justify-center rounded-full bg-white ">
                <div className="text-6xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                  <ImUserPlus className="group-hover:mt-5 group-hover:animate-bounce" />
                </div>
              </div>
              <div
                className={` w-full py-2 pr-6 pl-3 transition-opacity duration-700 `}
              >
                <h1
                  className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                    songogdsonAlkham === 4
                      ? "absolute -left-[310px] top-6 -z-50 rounded-l-full bg-green-600 py-6 px-10 pr-12 group-hover:bg-green-800"
                      : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
                  }`}
                >
                  Харилцагчийн бүртгэл
                </h1>
                <p
                  className={`text-white ${
                    songogdsonAlkham === 4 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Хэрэглэгчдийн мэдээллийг бүртгэлжүүлэн түүх болгон хадгалах.
                </p>
              </div>
              <div
                className={`absolute -bottom-7 -left-3 text-5xl text-green-600 transition-all duration-500 group-hover:text-green-800 ${
                  songogdsonAlkham === 4 ? "opacity-0" : "opacity-100"
                }`}
              >
                <GiArrowDunk className="-rotate-[80deg] -scale-x-100" />
              </div>
            </div>
            <div
              className={`group relative flex h-[120px] w-full cursor-pointer items-center rounded-full bg-green-600 p-1 transition-all duration-500 hover:scale-95 hover:bg-green-800 ${
                songogdsonAlkham === 0
                  ? "top-0 right-0 opacity-100"
                  : songogdsonAlkham === 5
                  ? "absolute -right-3/4 -top-[603px] z-50 opacity-100"
                  : "invisible absolute -top-96 opacity-0"
              }`}
              onClick={
                songogdsonAlkham === 5
                  ? () => setSongogdsonAlkham(0)
                  : () => setSongogdsonAlkham(5)
              }
            >
              <div className="flex min-h-[112px] min-w-[112px] items-center justify-center rounded-full bg-white ">
                <div className="text-6xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                  <RiFolderUserFill className="group-hover:mt-4 group-hover:animate-bounce" />
                </div>
              </div>
              <div
                className={` w-full py-2 pr-6 pl-3 transition-opacity duration-700 `}
              >
                <h1
                  className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                    songogdsonAlkham === 5
                      ? "absolute -left-[260px] top-6 -z-50 rounded-l-full bg-green-600 py-6 px-10 pr-20 group-hover:bg-green-800"
                      : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
                  }`}
                >
                  Ажилтан бүртгэл
                </h1>
                <p
                  className={`text-white ${
                    songogdsonAlkham === 5 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Системд ажилчдыг бүртгэлжүүлэх, Ажилтан системд нэвтрэх эрх
                  олгох боломжтой.
                </p>
              </div>
              <div className="absolute -bottom-7 -right-2 text-5xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                <GiArrowDunk className="rotate-[80deg]" />
              </div>
            </div>
            <div
              className={`group relative flex h-[120px] w-full cursor-pointer items-center rounded-full bg-green-600 p-1 transition-all duration-500 hover:scale-95 hover:bg-green-800 ${
                songogdsonAlkham === 0
                  ? "top-0 right-0 opacity-100"
                  : songogdsonAlkham === 6
                  ? "absolute -right-3/4 -top-[745px] z-50 opacity-100"
                  : "invisible absolute -top-96 opacity-0"
              }`}
              onClick={
                songogdsonAlkham === 6
                  ? () => setSongogdsonAlkham(0)
                  : () => setSongogdsonAlkham(6)
              }
            >
              <div className="flex min-h-[112px] min-w-[112px] items-center justify-center rounded-full bg-white ">
                <div className="text-6xl text-green-600 transition-all duration-500 group-hover:text-green-800">
                  <RiFolderUserFill className="group-hover:mt-4 group-hover:animate-bounce" />
                </div>
              </div>
              <div
                className={` w-full py-2 pr-6 pl-3 transition-opacity duration-700 `}
              >
                <h1
                  className={`pl-8 text-2xl font-semibold text-white transition-all duration-500 ${
                    songogdsonAlkham === 6
                      ? "absolute -left-[260px] top-6 -z-50 rounded-l-full bg-green-600 py-6 px-10 pr-20 group-hover:bg-green-800"
                      : "left-0 top-10 rounded-sm p-0 px-0 py-0 pr-0"
                  }`}
                >
                  Ажилтан бүртгэл
                </h1>
                <p
                  className={`text-white ${
                    songogdsonAlkham === 6 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Системд ажилчдыг бүртгэлжүүлэх, Ажилтан системд нэвтрэх эрх
                  олгох боломжтой.
                </p>
              </div>
            </div>
            {songogdsonAlkham === 1 ? (
              <div
                data-aos="fade-right"
                data-aos-delay="200"
                className="absolute top-10 z-10 h-full w-full overflow-y-auto "
              >
                <div className="pt-3">
                  <Link href={"/khyanalt/tokhirgoo"}>
                    Тохиргооний хуудасруу шилжих
                  </Link>
                </div>
              </div>
            ) : null}
            {songogdsonAlkham === 2 ? (
              <div
                data-aos="zoom-in-right"
                data-aos-delay="200"
                className="absolute top-10 z-10   "
              ></div>
            ) : null}
            {songogdsonAlkham === 3 ? (
              <div
                data-aos="fade-right"
                data-aos-delay="200"
                className="absolute top-10 z-10 h-full w-full   px-2 pr-5 "
              ></div>
            ) : null}
            {songogdsonAlkham === 4 ? (
              <div
                data-aos="zoom-in-right"
                data-aos-delay="200"
                className="absolute top-10 z-10   "
              ></div>
            ) : null}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<span className="text-base font-medium">Түгээмэл асуулт</span>}
          key="2"
        >
          <Faq />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default React.forwardRef(Tuslamj);
