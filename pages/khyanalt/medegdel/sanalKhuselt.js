import Admin from "components/Admin";
import React, { useEffect, useMemo, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import useSanalGomdol from "hooks/medegdel/useSanalGomdol";
import moment from "moment";
import { Image, Popconfirm, DatePicker, notification } from "antd";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import local from "antd/lib/date-picker/locale/mn_MN";
import { useRouter } from "next/router";
import { useAuth } from "services/auth";
const { RangePicker } = DatePicker;

function index({ token }) {
  const { barilgiinId } = useAuth();
  console.log(barilgiinId);
  const [turul, setTurul] = useState("sanal");
  const [khariltsagch, setKhariltsagch] = useState();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState();
  const router = useRouter();
  const query = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      turul,
      createdAt: ekhlekhOgnoo
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
  }, [ekhlekhOgnoo, turul, barilgiinId]);

  const sanal = useSanalGomdol(token, undefined, query);

  useEffect(() => {
    Aos.init({ duration: 1000 }, { once: true });
  });

  function sanalGomdolAvakh() {
    uilchilgee(token)
      .post(`/sanalKhuleenAvlaa`, { id: khariltsagch._id })
      .then(({ data }) => {
        if (data === "OK") {
          notification.success({ message: "Хүлээн авлаа" });
          sanal.sonorduulgaMutate();
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }
  useEffect(() => {
    if (!!khariltsagch) {
      setKhariltsagch(sanal.jagsaalt.find((a) => a._id === khariltsagch._id));
    }
  }, [sanal]);

  function turulSongokh(status) {
    setTurul(status.utga);
    setKhariltsagch(undefined);
  }

  return (
    <Admin
      khuudasniiNer="sanalKhuselt"
      title="Санал хүсэлт"
      className={"gap-5 p-2 pb-14 sm:p-6 md:pb-0"}
      onSearch={(search) =>
        sanal.setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <div
        style={{ height: "calc(100vh - 8rem)" }}
        className="col-span-12 flex flex-col space-y-5 rounded-2xl bg-white p-4 dark:bg-gray-900 md:p-8 xl:col-span-5 xl:rounded-l-2xl"
      >
        <div className="mb-2 grid gap-x-5 px-2 md:grid-cols-2 ">
          <RangePicker
            locale={local}
            size="middle"
            onChange={setEkhlekhOgnoo}
          />
        </div>
        <div className="grid grid-cols-2 gap-5 rounded-xl bg-green-500 p-2 font-medium dark:bg-green-700 sm:text-lg lg:text-sm xl:text-base 2xl:text-xl">
          {[
            { ner: "Санал", utga: "sanal" },
            { ner: "Гомдол", utga: "gomdol" },
          ].map((status, index) => (
            <div
              key={index}
              onClick={() => turulSongokh(status)}
              data-aos="fade-down"
              data-aos-delay={1 + status + "00"}
              data-aos-anchor-placement="top-bottom"
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
          <div className="scrollbar-hidden h-scrollH overflow-y-auto text-xs">
            {sanal?.sonorduulga?.jagsaalt.map((mur, i) =>
              mur.turul === "sanal" ? (
                <div
                  key={i}
                  className={` ${
                    khariltsagch?._id === mur?._id
                      ? "rounded-l-full bg-green-100 shadow-lg transition-all dark:bg-green-200"
                      : i % 2 === 0 && "bg-gray-100"
                  } `}
                >
                  <div
                    className={`flex cursor-pointer flex-row items-center space-x-2 space-y-3 rounded-md`}
                    onClick={() => setKhariltsagch(mur)}
                  >
                    <div className="image-fit bg-blackrounded-full relative ml-3 h-12 w-12 flex-none">
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
                        {mur.tuluv !== 0 ? (
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
                        {mur.tuluv !== 0 ? (
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
        <div className="col-span-12 h-[40vh] rounded-r-lg bg-green-50 xl:col-span-7 xl:h-auto ">
          <div className="flex w-full items-center gap-3 px-5 pt-2  ">
            <div className="h-11 w-11 min-w-max rounded-full  bg-gray-300 dark:bg-gray-800">
              <img src="/profile.svg" className="h-10 w-10 rounded-full" />
            </div>
            <div className="box relative  grid  w-10/12 grid-cols-12 rounded-lg  p-3 pb-8 pt-3 dark:bg-gray-800 sm:w-full">
              <div className="col-span-12 grid grid-cols-12">
                <div className=" col-span-6 flex flex-col justify-center ">
                  <div className="mb-3 flex items-center justify-between text-base font-medium">
                    {khariltsagch.khariltsagchiinNer}
                  </div>
                  <div className="flex  items-center  gap-2 overflow-hidden  font-bold ">
                    <p>Гарчиг:</p>
                    <div>{khariltsagch.title}</div>
                  </div>
                </div>
                <div className=" col-span-6 flex flex-col items-end justify-center ">
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
                  <div className="flex  items-center justify-between gap-2 overflow-hidden text-gray-400">
                    <div>
                      {moment(khariltsagch.ognoo).format("YYYY-MM-DD HH:mm")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 flex justify-between">
                <div className="w-full">
                  <div className="mt-3">{khariltsagch.message}</div>
                  <div className="mt-3 gap-3">
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
          className="box col-span-12 flex h-[40vh] items-center xl:col-span-7 xl:h-full"
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
                Та санал хүсэлт илгээх харилцагчаа сонгоно уу.
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
