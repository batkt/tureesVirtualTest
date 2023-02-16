import {
  ClockCircleOutlined,
  HistoryOutlined,
  SendOutlined,
  StarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Admin from "components/Admin";
import React, { useEffect, useState } from "react";
import useJagsaalt from "hooks/useJagsaalt";
import { useAuth } from "services/auth";
import uilchilgee, { url } from "services/uilchilgee";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { Button, Image, Input, notification, Popconfirm } from "antd";
import Aos from "aos";
import DaalgavarNemekh from "components/pageComponents/daalgavar/DaalgavarNemekh";
import TextArea from "antd/lib/input/TextArea";
import { useRouter } from "next/router";
import { modal } from "components/ant/Modal";
import { useTranslation } from "react-i18next";

const TsutsalsanShaltgaan = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tsutsalsanShaltgaan, setTsutsalsanShaltgaan] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tsutsalsanShaltgaan);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [tsutsalsanShaltgaan]
  );
  return (
    <div>
      <Input.TextArea
        value={tsutsalsanShaltgaan}
        onChange={({ target }) => setTsutsalsanShaltgaan(target?.value)}
      />
    </div>
  );
});

const order = { updatedAt: -1 };

function index({ token }) {
  const { t, i18n } = useTranslation()
  const [tuluv, setTuluv] = React.useState("Идэвхтэй");
  const [daalgavar, setDaalgavar] = React.useState();
  const [setgegdel, setSetgegdel] = React.useState();
  const { ajiltan, barilgiinId } = useAuth();
  const inputRef = React.useRef();
  const ChatRef = React.useRef();
  const messageEl = React.useRef(null);
  const tailbarRef = React.useRef(null);

  const query = React.useMemo(
    () => ({
      barilgiinId: barilgiinId,
      ajiltniiId: ajiltan?.erkh === "Admin" ? undefined : ajiltan?._id,
      baiguullagiinId: ajiltan?.baiguullagiinId,
      tuluv: tuluv === "Идэвхтэй" ? [0, 1] : tuluv === "Дууссан" ? 2 : -1,
    }),
    [ajiltan, tuluv, barilgiinId]
  );
  useEffect(() => {
    task.mutate();
    setDaalgavar();
  }, [tuluv, barilgiinId]);

  const task = useJagsaalt(ajiltan && "/daalgavar", query, order);

  const setgegdeliinQuery = React.useMemo(
    () => ({
      daalgavriinId: daalgavar?._id,
    }),
    [daalgavar]
  );
  const daalgavriinSetgegdel = useJagsaalt(
    daalgavar && "/setgegdel",
    setgegdeliinQuery,
    order
  );

  function daalgavarTsutslakh() {
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        {t("Устгах")}
      </Button>,
    ];
    modal({
      title: "Даалгавар цуцлах шалтгаан",
      content: (
        <TsutsalsanShaltgaan
          ref={tailbarRef}
          confirm={(tsutsalsanShaltgaan) =>
            uilchilgee(token)
              .post("/daalgavarTsutsalya", {
                id: daalgavar._id,
                tsutsalsanShaltgaan,
              })
              .then(({ data }) => {
                if (data === "Amjilttai") {
                  notification.success({ message: t("Даалгавар цуцлагдлаа") });
                  setDaalgavar(undefined);
                }
              })
              .finally(() => task.mutate())
          }
        />
      ),
      footer,
    });
  }

  useEffect(() => {
    Aos.init({ duration: 1000 }, { once: true });
  });

  useEffect(() => {
    setSetgegdel("");
    inputRef.current.focus();
  }, [daalgavar?._id]);

  function scrollTogsgolruu() {
    messageEl.current.scrollTo({
      top: messageEl.current.scrollHeight,
      behavior: "smooth",
    });
  }

  function setgegdelBichie() {
    if (!setgegdel || setgegdel === "" || setgegdel.length < 2) {
      notification.warning({
        message: t("Анхаар"),
        description: t("Сэтгэгдэлээ бичиж оруулна уу"),
      });
      return;
    }

    inputRef.current.focus();
    uilchilgee(token)
      .post("/setgegdelBichie", {
        barilgiinId: barilgiinId,
        daalgavriinId: daalgavar._id,
        message: setgegdel,
      })
      .then((response) => {
        if (response.data === "Amjilttai") {
          task.mutate();
          daalgavriinSetgegdel.mutate();
          daalgavriinSetgegdel.refresh();
          setSetgegdel("");
        }
      });
  }

  const [showResults, setShowResults] = React.useState(false);
  const Nemekh = () => {
    setDaalgavar(false), setShowResults(true);
    setTimeout(() => {
      document.getElementById("DaalgavarNemekhTextArea")?.focus();
    }, 300);
  };
  const khaakh = () => setShowResults(false);
  useEffect(() => {
    if (daalgavar) {
      setShowResults(false);
    }
  }, []);
  const router = useRouter();
  const { id } = router.query;

  const tsagTootsoolur = () => {
    const today = new Date();
    const todayTarahTsag = new Date().setHours(18, 0, 0);
    const difference = todayTarahTsag - today;
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
      r = "0" + r;
    }
    return r;
  }

  useEffect(() => {
    if (id) {
      setDaalgavar(task?.jagsaalt?.find((mur) => id === mur._id));
      scrollTogsgolruu();
    }
  }, [id, task?.data]);

  const [timeLeft, setTimeLeft] = useState("Тооцоолж байна");

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(tsagTootsoolur());
    }, 1000);
  });

  return (
    <Admin
      khuudasniiNer="daalgavar"
      title="Даалгавар"
      tsonkhniiId={"62ea0dc27c54f8189bdca566"}
      className={"gap-5 p-2 pb-10 sm:p-6 md:pb-0"}
      onSearch={task.onSearch}
    >
      <div
        style={{ height: "calc(100vh - 8rem)" }}
        className="col-span-12 flex flex-col space-y-5 rounded-2xl bg-white p-2 dark:bg-gray-900 md:rounded-none md:rounded-l-2xl md:p-8 xl:col-span-5"
      >
        <div className="flex w-full items-center justify-between rounded-xl bg-green-500 py-1 px-3 font-medium text-white dark:bg-green-700">
          <div>
            <div className="text-2xl ">{t("Өнөөдөр")}</div>
            <div>
              {task?.data?.jagsaalt.length
                ? task?.data?.jagsaalt.length + 0
                : "0"}{" "}
              {t("Даалгавар")}
            </div>
          </div>
          <div
            onClick={Nemekh}
            className="flex h-5/6 cursor-pointer items-center rounded-xl bg-white px-5 font-bold  text-green-500 transition-colors duration-500 hover:bg-gray-200 hover:text-black dark:text-green-700"
          >
            {t("Нэмэх")}
          </div>
        </div>
        <div className="flex w-full items-center justify-between self-center py-2 font-medium">
          <div className="w-20 rounded-2xl bg-green-500 py-2 text-center text-white">
            <div className="text-xl">{moment().format("DD")}</div>
            <div>{moment().format(i18n.language === "mn" ? "MM" : "MMM")} {i18n.language === "mn" && "сар"}</div>
          </div>
          <div className="px-3 text-justify">
            {timeLeft?.hours || timeLeft?.minutes || timeLeft?.seconds ? (
              <div className="grid grid-cols-12 text-center md:flex">
                {t("Ажлын цаг дуусахад дутуу байна", {tsag: FormatNumberLength(timeLeft.hours, 2), minut: FormatNumberLength(timeLeft.minutes, 2), second: FormatNumberLength(timeLeft.seconds, 2)})}
                {/* <span className="col-span-12 pr-2"> Ажлын цаг дуусахад</span>
                <div className="col-span-12 flex justify-center">
                  <span className="px-1">
                    {FormatNumberLength(timeLeft.hours, 2)}
                  </span>
                  <p>:</p>
                  <span className="px-1">
                    {FormatNumberLength(timeLeft.minutes, 2)}
                  </span>
                  <p>:</p>
                  <span className="px-1">
                    {FormatNumberLength(timeLeft.seconds, 2)}
                  </span>
                </div>
                <span className="col-span-12 pl-1">дутуу байна</span> */}
              </div>
            ) : timeLeft === "Тооцоолж байна" ? (
              <p className="animate-pulse">{timeLeft}...</p>
            ) : (
              <p>{("Ажлын цаг дууссан байна")}</p>
            )}
          </div>
          <div className="w-20 rounded-2xl bg-green-500 py-2 text-center text-white">
            <div className="text-xl">{moment().format("DD")}</div>
            <div>{moment().format(i18n.language === "mn" ? "MM" : "MMM")} {i18n.language === "mn" && "сар"}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 rounded-xl bg-green-500 p-2 font-medium dark:bg-green-700 sm:text-lg lg:text-sm xl:text-base 2xl:text-xl">
          {["Идэвхтэй", "Дууссан", "Цуцлагдсан"].map((status, index) => (
            <div
              key={index}
              onClick={() => setTuluv(status)}
              data-aos="fade-down"
              data-aos-delay={1 + status + "00"}
              className={`cursor-pointer rounded-lg p-1 text-center ${
                tuluv === status
                  ? "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-50 "
                  : "text-gray-50"
              }`}
            >
              {t(status)}
            </div>
          ))}
        </div>
        <div
          className="w-full overflow-y-scroll"
          style={{ height: "50vh" }}
          onScroll={(e) => {
            if (
              e.target.scrollHeight - e.target.scrollTop ===
                e.target.clientHeight &&
              !!task.data
            )
              task.next();
          }}
        >
          {task?.jagsaalt?.map((mur, index) => (
            <div
              className={`my-1 flex w-full cursor-pointer flex-row items-center space-x-2 rounded-lg p-2 pl-0 dark:bg-gray-800 ${
                daalgavar?._id === mur._id
                  ? "bg-green-100 dark:bg-green-700"
                  : "bg-gray-50"
              }`}
              key={`${index}-daalgavar`}
              onClick={() => {
                khaakh(), setDaalgavar(mur);
                daalgavriinSetgegdel.refresh();
                setTimeout(scrollTogsgolruu, 500);
              }}
            >
              <div className="-ml-1 flex w-10 items-center justify-end text-left text-base">
                {1 + index}.
              </div>
              <div
                className={`h-10 w-10 rounded-lg  bg-${
                  mur.started ? "green" : "green"
                }-600 text-2xl text-white`}
              >
                {mur.tuluv === 1 ? (
                  <HistoryOutlined />
                ) : (
                  <ClockCircleOutlined />
                )}
              </div>
              <div className="w-full">
                {mur.ajiltniiNer}
                <div className="flex w-full flex-row justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-100">
                    {moment(mur.duusakhOgnoo).diff(moment(), "h")} цаг
                  </span>
                  <span className="ml-auto">
                    {moment(mur.ognoo).format("YYYY-MM-DD HH:mm")}
                  </span>
                </div>
                <div className="grid grid-cols-12">
                  <div className="col-span-11">
                    <div
                      className={`text-medium overflow-hidden overflow-ellipsis whitespace-nowrap break-words font-medium text-${
                        mur.tuluv === 1
                          ? "yellow"
                          : mur.tuluv === 2
                          ? "green"
                          : "red"
                      }-500`}
                    >
                      {mur.tuluv === 1
                        ? t("Хүлээн авсан")
                        : mur.tuluv === 2
                        ? t("Дууссан")
                        : mur.tuluv === -1
                        ? t("Цуцлагдсан")
                        : t("Эхлээгүй")}
                    </div>
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap break-words"></div>
                  </div>
                  <div className="col-span-1 flex cursor-pointer flex-col items-end text-yellow-500">
                    <StarOutlined />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Nemekh */}
      <DaalgavarNemekh
      t={t}
      i18n={i18n}
        className={` ${showResults ? "block" : "hidden"}`}
        token={token}
        onRefresh={task.refresh}
        onClose={() => setShowResults(false)}
        ajiltan={ajiltan}
      />

      {/* chat */}
      <div
        className={`col-span-12 ${
          daalgavar ? "block" : "hidden"
        } relative gap-5 rounded-2xl bg-green-50 p-1 dark:bg-gray-900 md:rounded-none md:rounded-r-2xl xl:col-span-7`}
        data-aos="fade-right"
        style={{ height: "calc(100vh - 8rem)" }}
        data-aos-delay="200"
        data-aos-anchor-placement="top-bottom"
        ref={ChatRef}
      >
        <div
          className={`absolute top-0 left-0 z-50 h-full w-full flex-col items-center justify-center rounded-2xl bg-black bg-opacity-30 text-white dark:bg-white dark:bg-opacity-20 ${
            daalgavar?.tuluv === -1 ? "flex" : "hidden"
          }`}
        >
          {!!daalgavar?.tsutsalsanOgnoo && (
            <p className="z-50 text-xl font-medium">
              {moment(daalgavar?.tsutsalsanOgnoo).format("YYYY-MM-DD HH:mm-нд")}
            </p>
          )}
          {!!daalgavar?.tsutsalsanShaltgaan && (
            <p className="z-50 w-4/6 text-center text-xl font-medium">
              {daalgavar?.tsutsalsanShaltgaan} гэсэн шалтгаанаар
            </p>
          )}
          <div className="-rotate-12 rounded-md border-8 border-red-500 text-4xl font-black text-red-500 md:text-6xl 2xl:text-8xl">
          {t("Цуцлагдсан")}
          </div>
        </div>
        <div className="flex w-full items-center gap-3 px-5 pt-2 ">
          <div className="h-11 w-11 min-w-max rounded-full  bg-gray-300 dark:bg-gray-800">
            <img
              src="https://365webresources.com/wp-content/uploads/2016/09/FREE-PROFILE-AVATARS.png"
              className="h-10 w-10 rounded-full"
            />
          </div>
          <div className=" w-10/12 rounded-lg bg-white p-3 selection:pt-3 dark:bg-gray-800 sm:w-full">
            <div className="flex flex-row flex-wrap items-center justify-between">
              <div className="font-medium">{t("Захирал")}</div>
              <div className="flex">
                <div className="absolute bottom-1 right-2 text-black opacity-30 dark:text-white">
                  {moment(daalgavar?.ognoo).format("YYYY/MM/DD HH:mm")}
                </div>
                <div
                  className={`ml-5 ${
                    daalgavar?.tuluv === -1 ? "hidden" : "flex"
                  }`}
                >
                  <Popconfirm
                    disabled={daalgavar?.tuluv === 2}
                    title={`Та даалгавар цуцлах уу?`}
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={() => daalgavarTsutslakh()}
                  >
                    <div
                      className={`text-md cursor-pointer rounded-full bg-${
                        0 === daalgavar?.tuluv
                          ? "red"
                          : 1 === daalgavar?.tuluv
                          ? "yellow"
                          : "green"
                      }-500 py-1 px-3 font-medium text-gray-50`}
                    >
                      {2 === daalgavar?.tuluv ? t("Дууссан") : t("Цуцлах")}
                    </div>
                  </Popconfirm>
                </div>
                <div
                  className={`rounded-2xl bg-red-500 px-3 py-1 text-white ${
                    daalgavar?.tuluv === -1 ? "flex" : "hidden"
                  }`}
                >
                  {t("Цуцлагдсан")}
                </div>
              </div>
            </div>
            <div className=" h-12 w-full overflow-y-scroll break-words py-2">
              {daalgavar?.tailbar}
            </div>
            <div className="flex justify-between">
              <div className="w-1/2">
                {daalgavar?.file?.map((mur) => (
                  <div className=" flex">
                    <audio className="" controls key={mur}>
                      <source
                        src={`${url}/fileAvya/${ajiltan.baiguullagiinId}/${mur}`}
                        type="audio/ogg"
                      />
                      <source
                        src={`${url}/fileAvya/${ajiltan.baiguullagiinId}/${mur}`}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ))}
              </div>
              <div className="flex w-1/2 items-center justify-end gap-2 overflow-hidden">
                <Image.PreviewGroup>
                  {daalgavar?.zurguud?.map((mur) => (
                    <Image
                      key={mur}
                      alt={mur}
                      height="2rem"
                      width="2rem"
                      src={`${url}/zuragAvya/jpg/${ajiltan.baiguullagiinId}/${mur}`}
                    />
                  ))}
                </Image.PreviewGroup>
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-full min-w-0 max-w-6xl space-y-5 overflow-y-scroll p-8"
          style={{ height: "calc(100vh - 22rem)" }}
          ref={messageEl}
          onScroll={(e) => {
            if (e.currentTarget.scrollTop === 0 && !!daalgavriinSetgegdel.data)
              daalgavriinSetgegdel.next();
          }}
        >
          <div className="flex flex-row">
            <div className="w-full p-0 sm:p-2">
              <div className="flex w-full flex-col">
                {daalgavriinSetgegdel?.jagsaalt
                  ?.map((mur, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        ajiltan?._id === mur?.ajiltniiId
                          ? "flex-row-reverse"
                          : ""
                      } items-center gap-2`}
                    >
                      <div className="flex h-11 w-11 items-start justify-center rounded-full border-2 border-gray-600 bg-white dark:bg-gray-800">
                        <img
                          src={
                            ajiltan?._id === mur?.ajiltniiId
                              ? "/sent.svg"
                              : "/receive.svg"
                          }
                          className="- h-9 w-9"
                        />
                      </div>
                      <div
                        key={mur._id + "daalgavriinSetgegdel"}
                        className={`relative my-3 flex w-2/3 flex-col flex-wrap rounded-xl ${
                          ajiltan?._id === mur?.ajiltniiId
                            ? "bg-gray-400 dark:bg-gray-600"
                            : "bg-green-500 dark:bg-green-600"
                        }  p-5 pt-1 text-white `}
                      >
                        <div className="pb-1 font-medium  ">
                          {mur.ajiltniiNer}
                        </div>
                        <div className="w-full break-words  ">
                          {mur.message}
                        </div>
                        <div className="absolute bottom-1 right-3 break-words text-gray-300">
                          {moment(mur.ognoo).format("HH:mm")}
                        </div>
                      </div>
                    </div>
                  ))
                  .reverse()}
              </div>
            </div>
          </div>
        </div>
        <div className=" bottom-3 w-full" style={{ height: "10%" }}>
          <div
            className={`flex w-full flex-row px-5 py-2 ${
              daalgavar?.tuluv === -1 && "hidden"
            }`}
          >
            <div className="w-full px-2">
              <TextArea
                autoSize={{
                  minRows: 1,
                  maxRows: 3,
                }}
                ng-trim="false"
                className="h-10 w-full break-words rounded-md border border-gray-600 p-2 focus:border-gray-400 focus:outline-none"
                placeholder="Тайлбар"
                ref={inputRef}
                value={setgegdel}
                onChange={({ target }) => setSetgegdel(target.value)}
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    setSetgegdel("");
                    event.preventDefault();
                    setgegdelBichie();
                    scrollTogsgolruu();
                  }
                }}
              />
            </div>
            <div className="flex flex-row space-x-3">
              <div
                className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 p-2 text-xl dark:bg-gray-800"
                onClick={() => {
                  setgegdelBichie();
                  scrollTogsgolruu();
                }}
              >
                <SendOutlined />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default index;
