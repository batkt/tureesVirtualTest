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
import useJagsaalt from "hooks/useJagsaalt";
import { map } from "lodash";
import { useTranslation } from "react-i18next";
const { RangePicker } = DatePicker;

function index({ token }) {
  const { t } = useTranslation();
  const { barilgiinId } = useAuth();
  const [turul, setTurul] = useState("sanal");

  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState();

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

  const router = useRouter();
  const { id, notificationTurul } = router.query;

  const khariltsagchQuery = useMemo(() => {
    return {
      barilgiinId,
      _id: sanal.jagsaalt.map((a) => a.khariltsagchiinId),
    };
  }, [barilgiinId, sanal]);
  const khariltsagchiinMedeelel = useJagsaalt(
    "/khariltsagch",
    khariltsagchQuery,
    undefined,
    undefined,
    ["ner", "ovog", "utas"]
  );
  const [khariltsagch, setKhariltsagch] = useState();
  const sanalGomdolTuukh = sanal.jagsaalt.filter(
    (a) => a.khariltsagchiinId === khariltsagch?._id
  );

  useEffect(() => {
    Aos.init({ duration: 1000 }, { once: true });
  });

  function sanalGomdolAvakh(mur) {
    uilchilgee(token)
      .post(`/sanalKhuleenAvlaa`, { id: mur._id })
      .then(({ data }) => {
        if (data === "OK") {
          notification.success({ message: t("Хүлээн авлаа") });
          sanal.sonorduulgaMutate();
          khariltsagchiinMedeelel.mutate();
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  function turulSongokh(status) {
    setTurul(status.utga);
    setKhariltsagch(undefined);
  }
  useEffect(() => {
    if (notificationTurul) {
      setTurul(notificationTurul);
    }
  }, [id, notificationTurul]);

  useEffect(() => {
    if (id) {
      setKhariltsagch(
        khariltsagchiinMedeelel?.jagsaalt?.find((mur) => id === mur._id)
      );
    }
  }, [id, khariltsagchiinMedeelel.jagsaalt]);

  return (
    <Admin
      khuudasniiNer="sanalKhuselt"
      title="Санал хүсэлт"
      tsonkhniiId={"644f12f89bef08f8ba701116"}
      className={"gap-5 p-2 pb-14 sm:p-6 md:pb-0"}
      onSearch={(search) =>
        sanal.setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }>
      <div
        style={{ height: "calc(100vh - 8rem)" }}
        className="col-span-12 flex flex-col space-y-5 rounded-2xl  bg-white p-4 dark:bg-gray-900 md:p-8 xl:col-span-4 xl:rounded-l-2xl">
        <div className="mb-2 grid w-full gap-x-5 px-2">
          <RangePicker
            className="flex w-full"
            placeholder={[t("Эхлэх огноо"), t("Дуусах огноо")]}
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
              }`}>
              {t(status.ner)}
            </div>
          ))}
        </div>
        <div className="scrollbar-hidden mt-5 h-medegdelHariltsagchPhone overflow-y-auto text-xs lg:h-scrollH">
          {khariltsagchiinMedeelel?.jagsaalt.map((mur) => (
            <div
              className={` ${
                khariltsagch?._id === mur?._id
                  ? "rounded-l-full bg-green-200 shadow-lg saturate-50 dark:bg-green-500 "
                  : ""
              } `}>
              <div
                className={`flex h-[7vh] cursor-pointer flex-row  items-center space-x-2 rounded-md`}
                onClick={() => setKhariltsagch(mur)}>
                <div className="image-fit bg-blackrounded-full relative h-12 w-12 flex-none">
                  <img
                    alt="Rubick"
                    className="rounded-full"
                    src={
                      ((mur.register?.replace(/^\D+/g, "") % 100) / 10) % 2 < 1
                        ? "/profileFemale.svg"
                        : "/profile.svg"
                    }
                  />
                </div>
                <div className="grid w-full grid-cols-2 text-xs">
                  <div className=" col-span-1 flex w-full flex-col pl-2 text-sm text-gray-600">
                    <div>{mur?.ner}</div>
                    <div style={{ width: "40%" }}>
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                        {mur.title}
                      </div>
                    </div>
                    {/* {mur.tuluv !== 0 ? (
                      <div className="font-semibold text-green-400">
                        Хүлээн авсан
                      </div>
                    ) : (
                      <div className="text-red-500">Хүлээн аваагүй</div>
                    )} */}
                  </div>
                  <div className="col-span-1 flex items-center justify-end pr-3  text-sm">
                    {mur.utas}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!!khariltsagch ? (
        <div
          style={{ height: "calc(100vh - 8rem)" }}
          className="col-span-12 space-y-3 overflow-y-auto rounded-r-lg bg-green-50 px-5  dark:bg-gray-900 xl:col-span-8 xl:rounded-2xl">
          {sanalGomdolTuukh.map((mur) => (
            <div>
              <div className="flex w-full items-center gap-3 px-5 pt-2 ">
                <div className="h-11 w-11 min-w-max rounded-full  bg-gray-300 dark:bg-gray-800">
                  <img src="/profile.svg" className="h-10 w-10 rounded-full" />
                </div>
                <div className="box relative  grid  w-10/12 grid-cols-12 rounded-lg  p-3 pb-8 pt-3 dark:bg-gray-700 sm:w-full">
                  <div className="col-span-12 grid grid-cols-12">
                    <div className=" col-span-6 flex flex-col justify-center ">
                      <div className="mb-3 flex items-center justify-between text-base font-medium">
                        {mur?.khariltsagchiinNer}
                      </div>
                      <div className="flex  items-center  gap-2 overflow-hidden  font-bold ">
                        <p>{t("Гарчиг")}:</p>
                        <div>{mur?.title}</div>
                      </div>
                    </div>
                    <div className=" col-span-6 flex flex-col items-end justify-center ">
                      <div
                        className={`mb-3  ${
                          mur?.tuluv === -1 ? "hidden" : "flex"
                        }`}>
                        <Popconfirm
                          disabled={mur?.tuluv === 1}
                          title={t("Хүлээн авах уу?")}
                          okText={t("Тийм")}
                          cancelText={t("Үгүй")}
                          onConfirm={() => sanalGomdolAvakh(mur)}>
                          <div
                            className={`text-md cursor-pointer rounded-full font-bold bg-${
                              0 === mur?.tuluv ? "red" : "green"
                            }-500 py-1 px-3 font-medium text-gray-50`}>
                            {t(
                              0 !== mur?.tuluv ? "Хүлээж aвсан" : "Хүлээж авах"
                            )}
                          </div>
                        </Popconfirm>
                      </div>
                      <div className="flex  items-center justify-between gap-2 overflow-hidden text-gray-400">
                        <div>
                          {moment(mur?.ognoo).format("YYYY-MM-DD HH:mm")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 flex justify-between">
                    <div className="w-full">
                      <div className="mt-3">{mur?.message}</div>
                      <div className="mt-3 gap-3">
                        {mur?.zurguud?.map((a) => (
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
          ))}
        </div>
      ) : (
        <div
          className="box col-span-12 flex h-[40vh] items-center xl:col-span-8 xl:h-full"
          data-aos="fade-left"
          data-aos-duration="1000">
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
              <div className="font-medium">{t("Өдрийн мэнд")}</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">
                {t("Та харилцагчаа сонгоно уу.")}
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
