import {
  AudioOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  FlagOutlined,
  HistoryOutlined,
  PictureOutlined,
  RightOutlined,
  SendOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Admin from "components/Admin";
import React, { useEffect } from "react";
import useJagsaalt from "hooks/useJagsaalt";
import { useAuth } from "services/auth";
import uilchilgee, { url } from "services/uilchilgee";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { Image, notification, Popconfirm } from "antd";
import Aos from "aos";
import Kharakh from "components/pageComponents/geree/Kharakh";
import DaalgavarNemekh from "components/pageComponents/daalgavar/DaalgavarNemekh";


const order = { createdAt: -1 };

function index({ token }) {
  const [tuluv, setTuluv] = React.useState("Идэвхитэй");
  const [daalgavar, setDaalgavar] = React.useState();
  const [setgegdel, setSetgegdel] = React.useState();
  const { ajiltan, barilgiinId } = useAuth();
  const inputRef = React.useRef();
  const ChatRef = React.useRef();
  const messageEl = React.useRef(null);

  const query = React.useMemo(
    () => ({
      ajiltniiId: ajiltan?.erkh === "Admin" ? undefined : ajiltan?._id,
      baiguullagiinId: ajiltan?.baiguullagiinId,
      tuluv: tuluv === "Идэвхитэй" ? [0, 1] : tuluv === "Дууссан" ? 2 : -1,
    }),
    [ajiltan, tuluv]
  );

  const task = useJagsaalt(ajiltan && "/daalgavar", query, order);

  const setgegdeliinQuery = React.useMemo(
    () => ({
      daalgavriinId: daalgavar?._id,
    }),
    [daalgavar]
  );

  const daalgavriinSetgegdel = useJagsaalt(
    daalgavar && "/setgegdel",
    setgegdeliinQuery
  );

  function daalgavarKhuleejAvlaa() {
    uilchilgee(token)
      .post("/daalgavarKhuleejAvlaa", { id: daalgavar._id })
      .then(({ data }) => {
        if (data === "Amjilttai") setDaalgavar((v) => ({ ...v, tuluv: 1 }));
      })
      .finally(() => task.mutate());
  }
  function daalgavarDuusgalaa() {
    uilchilgee(token)
      .post("/daalgavarDuusgalaa", { id: daalgavar._id })
      .then(({ data }) => {
        if (data === "Amjilttai") setDaalgavar((v) => ({ ...v, tuluv: 2 }));
      })
      .finally(() => task.mutate());
  }

  function batlakh() {
    if (daalgavar.tuluv === 0) daalgavarKhuleejAvlaa();
    else if (daalgavar.tuluv === 1) daalgavarDuusgalaa();
  }
  useEffect(() => {
    Aos.init({ duration: 1000 });
  });

  useEffect(() => {
    setSetgegdel("");
    inputRef.current.focus();
    //document.getElementById('').setAttribute('data-aos','')
  }, [daalgavar?._id]);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  function setgegdelBichie() {
    if (!setgegdel) {
      notification.warning({
        message: "Анхаар",
        description: "Сэтгэгдэлээ бичиж оруулна уу",
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
          setSetgegdel("");
        }
      });
  }
  const [showResults, setShowResults] = React.useState(false);
  const Nemekh = () => {
    setDaalgavar(false), setShowResults(true);
  };
  const khaakh = () => setShowResults(false);
  useEffect(() => {
    if (daalgavar) {
      setShowResults(false);
    }
  }, []);

  return (
    <Admin
      khuudasniiNer="daalgavar"
      title="Даалгавар"
      className={"gap-5 sm:p-6"}
      onSearch={task.onSearch}
    >
      <div className="col-span-12 flex flex-col space-y-5 bg-white p-8 dark:bg-gray-900 xl:col-span-5">
        <div className="flex w-full items-center justify-between rounded-xl bg-green-500 py-1 px-3 font-medium text-white dark:bg-green-700">
          <div>
            <div className="text-2xl ">Өнөөдөр</div>
            <div>{daalgavar?.length? + 0 : "0"} даалгавар</div>
          </div>
          <div
            onClick={Nemekh}
            className="flex h-5/6 cursor-pointer items-center rounded-xl bg-white hover:bg-gray-200 hover:text-black  duration-500 transition-colors px-5 font-bold text-green-500 dark:text-green-700"
          >
            Нэмэх
          </div>
        </div>
        <div className="flex w-full items-center justify-between self-center py-2 font-medium">
          <div className="w-20 rounded-2xl bg-green-500 py-2 text-center text-white">
            <div className="text-xl">{moment().format("DD")}</div>
            <div>{moment().format("MM")} сар</div>
          </div>
          <div className="px-3 text-justify">
            Ажлын цаг дуусхад 10 цаг 28 минут дутуу байна
          </div>
          <div className="w-20 rounded-2xl bg-green-500 py-2 text-center text-white">
            <div className="text-xl">{moment().format("DD")}</div>
            <div>{moment().format("MM")} сар</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 rounded-xl bg-green-500 p-2 font-medium dark:bg-green-700 sm:text-lg lg:text-sm xl:text-base 2xl:text-xl">
          {["Идэвхитэй", "Дууссан", "Цуцлагдсан"].map((status) => (
            <div
              onClick={() => setTuluv(status)}
              data-aos="fade-down"
              data-aos-delay={1 + status + "00"}
              className={`cursor-pointer rounded-lg p-1 text-center ${
                tuluv === status
                  ? "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-50 "
                  : "text-gray-50"
              }`}
            >
              {status}
            </div>
          ))}
        </div>
        <div className="w-full overflow-y-scroll" style={{ height: "70vh" }}>
          {task?.data?.jagsaalt?.map((mur, index) => (
            <div
              className={`my-1 flex w-full cursor-pointer flex-row space-x-2 rounded-lg bg-gray-50 p-2 pl-0 dark:bg-gray-800 ${
                daalgavar?._id === mur._id
                  ? "bg-green-100 dark:bg-green-700"
                  : ""
              }`}
              key={`${index}-daalgavar`}
              onClick={() => {
                khaakh(), setDaalgavar(mur);
              }}
              data-aos="fade-right"
              data-aos-delay={1 + index + "00"}
              data-aos-anchor-placement="top-bottom"
            >
              <div className="-ml-1 flex w-10 items-center justify-end text-left text-base">
                {1 + index}.
              </div>
              <div
                className={`h-10 w-10 rounded-lg bg-${
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
                        ? "Хүлээн авсан"
                        : mur.tuluv === 2
                        ? "Дууссан"
                        : "Эхлээгүй"}
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
      <DaalgavarNemekh className={` ${
          showResults ? "block" : "hidden"
        }`}/>

      {/* chat */}

      <div
        className={`col-span-12 ${
          daalgavar ? "block" : "hidden"
        } relative gap-5 bg-green-50 p-1 dark:bg-gray-900 xl:col-span-7`}
        data-aos="flip-left"
        style={{ height: "90vh" }}
        data-aos-delay="200"
        data-aos-anchor-placement="top-bottom"
        ref={ChatRef}
      >
        <div
          className="w-full min-w-0 max-w-6xl space-y-5 overflow-y-scroll p-8"
          style={{ height: "90%" }}
          ref={messageEl}
        >
          <div className="flex flex-row">
            <div className="w-full p-0 sm:p-2">
              {((!!daalgavar?.zurguud && daalgavar?.zurguud?.length > 0) ||
                (!!daalgavar?.file && daalgavar?.file?.length > 0)) && (
                <div className="flex w-full items-center gap-3">
                  <div className="h-11 w-11 min-w-max rounded-full  bg-gray-300 dark:bg-gray-800">
                    <img
                      src="https://365webresources.com/wp-content/uploads/2016/09/FREE-PROFILE-AVATARS.png"
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="relative w-10/12 rounded-lg bg-white p-3 pb-8 pt-3 dark:bg-gray-800 sm:w-full">
                    <div className="flex flex-row flex-wrap items-center justify-between">
                      <div className="font-medium">Захирал</div>
                      <div className="flex">
                        <div className="absolute bottom-1 right-2 text-black opacity-30 dark:text-white">
                          {moment().format("YYYY/MM/DD HH:mm")}
                        </div>
                        <div className="ml-5 flex">
                          <Popconfirm
                            disabled={daalgavar?.tuluv === 2}
                            title={`Та даалгавар ${
                              0 === daalgavar?.tuluv
                                ? "Хүлээж авах "
                                : 1 === daalgavar?.tuluv
                                ? "дуусгах"
                                : ""
                            } уу?`}
                            okText="Тийм"
                            cancelText="Үгүй"
                            onConfirm={() => batlakh()}
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
                              {0 === daalgavar?.tuluv
                                ? "Хүлээж авах"
                                : 1 === daalgavar?.tuluv
                                ? "Хийгдэж байна"
                                : "Дууссан"}
                            </div>
                          </Popconfirm>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full py-2">{daalgavar?.tailbar}</div>
                    <div className="flex justify-between">
                      <div className="w-1/2">
                        {daalgavar.file?.map((mur) => (
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
                      <div className="flex w-1/2 items-center justify-end gap-2">
                        <Image.PreviewGroup>
                          {daalgavar.zurguud?.map((mur) => (
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
              )}
              <div className="flex w-full flex-col">
                {daalgavriinSetgegdel?.jagsaalt?.map((mur) => (
                  <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 items-start justify-center rounded-full bg-gray-300 dark:bg-gray-800">
                      <img
                        src="https://cdn1.iconfinder.com/data/icons/avatars-1-5/136/87-512.png"
                        className="-mt-1 h-11 w-11 rounded-full"
                      />
                    </div>
                    <div
                      key={mur._id + "daalgavriinSetgegdel"}
                      className=" relative my-3 flex w-2/3 flex-col flex-wrap rounded-xl bg-green-500 p-5 pt-1 text-white dark:bg-green-600"
                    >
                      <div className="pb-1 font-medium">Ажилчин</div>
                      {mur.message}
                      <div className="absolute bottom-1 right-3 text-gray-300">
                        {moment(mur.ognoo).format("HH:mm")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-3 w-full">
          <div className="flex w-full flex-row px-5 py-2">
            <div className="w-full px-2">
              <input
                className="focus:outline-none h-10 w-full rounded-md border border-gray-600 p-2 focus:border-gray-400"
                placeholder="Тайлбар"
                ref={inputRef}
                value={setgegdel}
                onChange={({ target }) => setSetgegdel(target.value)}
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setgegdelBichie();
                  }
                }}
              />
            </div>
            <div className="flex flex-row space-x-3">
              <div
                className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 p-2 text-xl dark:bg-gray-800"
                onClick={setgegdelBichie}
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
