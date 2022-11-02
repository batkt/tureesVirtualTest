import Admin from "components/Admin";
import React, { useEffect, useMemo, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import useSanalGomdol from "hooks/medegdel/useSanalGomdol";
import moment from "moment";
import { Image, Popconfirm, DatePicker } from "antd";
import uilchilgee, { url } from "services/uilchilgee";
import local from "antd/lib/date-picker/locale/mn_MN";
const { RangePicker } = DatePicker;

function index({ token }) {
  const [turul, setTurul] = useState("sanal");
  const [khariltsagch, setKhariltsagch] = useState();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState();

  const query = useMemo(() => {
    return {
      turul,
      createdAt: ekhlekhOgnoo
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
  }, [ekhlekhOgnoo, turul]);

  const sanal = useSanalGomdol(token, undefined, query);

  useEffect(() => {
    Aos.init({ duration: 1000 }, { once: true });
  });

  function sanalGomdolAvakh() {
    uilchilgee(token).post(`/sanalKhuleenAvlaa`, { id: khariltsagch._id });
  }

  return (
    <Admin
      khuudasniiNer="sanalKhuselt"
      title="Санал хүсэлт"
      className={"gap-5 sm:p-6"}
      onSearch={(search) =>
        setAjiltniiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <div
        style={{ height: "calc(100vh - 8rem)" }}
        className="col-span-12 flex flex-col space-y-5 rounded-l-2xl bg-white p-8 dark:bg-gray-900 xl:col-span-5"
      >
        <RangePicker
          locale={local}
          className="w-[20vw]"
          style={{ marginBottom: "20px" }}
          size="middle"
          onChange={setEkhlekhOgnoo}
        />
        <div className="grid grid-cols-2 gap-5 rounded-xl bg-green-500 p-2 font-medium dark:bg-green-700 sm:text-lg lg:text-sm xl:text-base 2xl:text-xl">
          {[
            { ner: "Санал", utga: "sanal" },
            { ner: "Гомдол", utga: "gomdol" },
          ].map((status, index) => (
            <div
              key={index}
              onClick={() => setTurul(status.utga)}
              data-aos="fade-down"
              data-aos-delay={1 + status + "00"}
              className={`cursor-pointer rounded-lg p-1 text-center ${
                turul === status.utga
                  ? "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-50 "
                  : "text-gray-50"
              }`}
            >
              {status.ner}
            </div>
          ))}
        </div>
        {turul === "sanal" ? (
          <div className="scrollbar-hidden h-medegdelHariltsagchPhone overflow-y-auto text-xs  lg:h-scrollH">
            {sanal?.sonorduulga?.jagsaalt.map((mur) =>
              mur.turul === "sanal" ? (
                <div
                  className={` ${
                    khariltsagch?._id === mur?._id
                      ? "rounded-l-full bg-green-200 shadow-lg saturate-50 dark:bg-green-200"
                      : ""
                  } `}
                >
                  <div
                    className={`flex h-[7vh] cursor-pointer flex-row items-center space-x-2 space-y-3 rounded-md`}
                    onClick={() => setKhariltsagch(mur)}
                  >
                    <div className="image-fit bg-blackrounded-full relative h-12 w-12  flex-none">
                      <img
                        alt="Rubick"
                        className="rounded-full"
                        src={
                          ((mur.register?.replace(/^\D+/g, "") % 100) / 10) %
                            2 <
                          1
                            ? "/profileFemale.svg"
                            : "/profile.svg"
                        }
                      />
                    </div>
                    <div className="grid w-full grid-cols-2 text-xs">
                      <div className=" col-span-1 flex w-full flex-col pl-2 text-sm text-gray-600">
                        <div>{mur?.khariltsagchiinNer}</div>
                        <div style={{ width: "40%" }}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {mur.title}
                          </div>
                        </div>
                        {mur.tuluv === "0" ? (
                          <div className="font-semibold text-green-400">
                            Хүлээн авсан
                          </div>
                        ) : (
                          <div className="text-red-500">Хүлээн аваагүй</div>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center justify-end pr-3 text-sm">
                        {moment(mur.ognoo).format("YYYY-MM-DD HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        ) : (
          <div className="scrollbar-hidden mt-5 h-medegdelHariltsagchPhone overflow-y-auto text-xs lg:h-scrollH">
            {sanal?.sonorduulga?.jagsaalt.map((mur) =>
              mur.turul === "gomdol" ? (
                <div
                  className={` ${
                    khariltsagch?._id === mur?._id
                      ? "rounded-l-full bg-green-200 shadow-lg saturate-50 dark:bg-green-500 "
                      : ""
                  } `}
                >
                  <div
                    className={`flex h-[7vh] cursor-pointer flex-row  items-center space-x-2 rounded-md`}
                    onClick={() => setKhariltsagch(mur)}
                  >
                    <div className="image-fit bg-blackrounded-full relative h-12 w-12 flex-none">
                      <img
                        alt="Rubick"
                        className="rounded-full"
                        src={
                          ((mur.register?.replace(/^\D+/g, "") % 100) / 10) %
                            2 <
                          1
                            ? "/profileFemale.svg"
                            : "/profile.svg"
                        }
                      />
                    </div>
                    <div className="grid w-full grid-cols-2 text-xs">
                      <div className=" col-span-1 flex w-full flex-col pl-2 text-sm text-gray-600">
                        <div>{mur?.khariltsagchiinNer}</div>
                        <div style={{ width: "40%" }}>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {mur.title}
                          </div>
                        </div>
                        {mur.tuluv === "0" ? (
                          <div className="font-semibold text-green-400">
                            Хүлээн авсан
                          </div>
                        ) : (
                          <div className="text-red-500">Хүлээн аваагүй</div>
                        )}
                      </div>
                      <div className="col-span-1 flex items-center justify-end pr-3  text-sm">
                        {moment(mur.ognoo).format("YYYY-MM-DD HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )
            )}
          </div>
        )}
      </div>
      {!!khariltsagch ? (
        <div className="col-span-7 rounded-r-lg bg-green-50 ">
          <div className="flex w-full items-center gap-3 px-5 pt-2">
            <div className="h-11 w-11 min-w-max rounded-full  bg-gray-300 dark:bg-gray-800">
              <img src="/profile.svg" className="h-10 w-10 rounded-full" />
            </div>
            <div className="relative w-10/12  rounded-lg bg-white p-3 pb-8 pt-3 dark:bg-gray-800 sm:w-full">
              <div className="flex flex-row flex-wrap items-center justify-between">
                <div className="mb-3 font-medium">
                  {khariltsagch.khariltsagchiinNer}
                </div>
                <div className=" flex  flex-col">
                  <div
                    className={`mb-3  ${
                      khariltsagch?.tuluv === -1 ? "hidden" : "flex"
                    }`}
                  >
                    <Popconfirm
                      disabled={khariltsagch?.tuluv === 2}
                      title={`Хүлээн авах уу?`}
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => sanalGomdolAvakh(khariltsagch._id)}
                    >
                      <div
                        className={`text-md cursor-pointer rounded-full font-bold bg-${
                          0 === khariltsagch?.tuluv ? "red" : "green"
                        }-500 py-1 px-3 font-medium text-gray-50`}
                      >
                        {0 !== khariltsagch?.tuluv
                          ? "Хүлээж aвсан"
                          : "Хүлээж авах"}
                      </div>
                    </Popconfirm>
                  </div>
                  <div className="flex  items-center justify-end gap-2 overflow-hidden text-gray-400">
                    {moment(khariltsagch.ognoo).format("YYYY-MM-DD HH:mm")}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-full">
                  <div className="w-[90%] ">{khariltsagch.message}</div>
                  <div className="mt-3">
                    {khariltsagch.zurguud.map((a) => (
                      <Image
                        width={100}
                        src={`${url}/file?path=sanalkhuselt/${a}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="box col-span-7 flex h-full items-center"
          data-aos="fade-left"
          data-aos-duration="1000"
        >
          <div className="mx-auto text-center">
            <div className="flex justify-center">
              <div className="image-fit z-10 h-16 w-16 flex-none overflow-hidden rounded-full">
                <img alt="ProfileZurag" src="/profile.svg" />
              </div>
              <div className="image-fit z-0 -ml-5 h-16 w-16 flex-none overflow-hidden rounded-full">
                <img alt="ProfileZurag" src="/profileFemale.svg" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-medium">Өдрийн мэнд</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">
                Та харилцагчаа сонгоно уу.
              </div>
            </div>
          </div>
        </div>
      )}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default index;
