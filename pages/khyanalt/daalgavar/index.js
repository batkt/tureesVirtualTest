import {
  AudioOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  HistoryOutlined,
  PictureOutlined,
  SendOutlined,
  StarOutlined,
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
import TextArea from "antd/lib/input/TextArea";
import { useRouter } from "next/router";

const order = { updatedAt: -1 };

function index({ token }) {
  const [tuluv, setTuluv] = React.useState("Идэвхитэй");
  const [daalgavar, setDaalgavar] = React.useState();
  const [setgegdel, setSetgegdel] = React.useState();
  const { ajiltan, barilgiinId } = useAuth();
  const inputRef = React.useRef();
  const ChatRef = React.useRef();
  const messageEl = React.useRef(null);
  const router = useRouter();
  const { id } = router.query;

  const query = React.useMemo(
    () => ({
      ajiltniiId: ajiltan?.erkh === "Admin" ? undefined : ajiltan?._id,
      baiguullagiinId: ajiltan?.baiguullagiinId,
      tuluv: tuluv === "Идэвхитэй" ? [0, 1] : tuluv === "Дууссан" ? 2 : -1,
    }),
    [ajiltan, tuluv]
  );
  useEffect(() => {
    task.mutate();
    setDaalgavar();
  }, [tuluv])

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
    Aos.init({ duration: 1000 }, { once: true });
  });

  // useEffect(() => {
  //   if (ajiltan?.erkh === "Admin")
  //     window.location.href = "/khyanalt/daalgavar/admin";
  // }, [ajiltan]);

  useEffect(() => {
    setSetgegdel("");
    inputRef.current.focus();
    //document.getElementById('').setAttribute('data-aos','')
  }, [daalgavar?._id]);

  useEffect(() => {
    if (id) {
      setDaalgavar(task?.jagsaalt?.find((mur) => id === mur._id));
      scrollTogsgolruu();
    }
  }, [id, task?.data]);

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

  function scrollTogsgolruu() {
    messageEl.current.scrollTo({
      top: messageEl.current.scrollHeight,
      behavior: "smooth",
    });
  }

  return (
    <Admin
      khuudasniiNer="daalgavar"
      title="Даалгавар"
      tsonkhniiId={"62ea0dc27c54f8189bdca566"}
      className={"gap-5 sm:p-6"}
      onSearch={task.onSearch}
    >
      <div className="col-span-12 flex flex-col space-y-5 rounded-lg bg-white p-8 dark:bg-gray-900 xl:col-span-5">
        <div className="grid grid-cols-3 gap-5 rounded-xl bg-green-500 p-2 font-medium dark:bg-green-700 sm:text-lg lg:text-sm xl:text-base 2xl:text-xl">
          {["Идэвхитэй", "Дууссан", "Цуцлагдсан"].map((status) => (
            <div
              onClick={() => setTuluv(status)}
              data-aos="fade-down"
              data-aos-delay={1 + status + "00"}
              className={`cursor-pointer rounded-lg p-1 text-center ${tuluv === status
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
              className={`my-1 flex w-full cursor-pointer flex-row space-x-2 rounded-lg  p-2 pl-0 dark:bg-gray-800 ${daalgavar?._id === mur._id
                ? "bg-green-100 dark:bg-green-700"
                : "bg-gray-50"
                }`}
              key={`${index}-daalgavar`}
              onClick={() => {
                setDaalgavar(mur);
                daalgavriinSetgegdel.refresh();
                setTimeout(scrollTogsgolruu, 500);
              }}
              data-aos="fade-right"
              data-aos-delay={1 + index + "00"}
              data-aos-anchor-placement="top-bottom"
            >
              <div className="-ml-1 flex w-10 items-center justify-end text-left text-base">
                {1 + index}.
              </div>
              <div
                className={`h-10 w-10 rounded-lg bg-${mur.started ? "green" : "green"
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
                      className={`text-medium overflow-hidden overflow-ellipsis whitespace-nowrap break-words font-medium text-${mur.tuluv === 1
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
                          : mur.tuluv === -1
                            ? "Цуцлагдсан"
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
      {/* chat */}

      <div
        className={`col-span-12 ${daalgavar ? "block" : "hidden"
          } relative gap-5 bg-green-50 p-1 rounded-lg dark:bg-gray-900 xl:col-span-7`}
        data-aos="flip-left"
        style={{ height: "calc(100vh - 7rem)" }}
        data-aos-delay="200"
        data-aos-anchor-placement="top-bottom"
        ref={ChatRef}
      >

        <div
          className="flex w-full items-center gap-3 px-5 pt-2"
          style={{ height: "10rem" }}
        >
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
                <div
                  className={`ml-5 ${daalgavar?.tuluv === -1 ? "hidden" : "flex"
                    }`}
                >
                  <Popconfirm
                    disabled={daalgavar?.tuluv === 2}
                    title={`Та даалгавар ${0 === daalgavar?.tuluv
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
                      className={`text-md cursor-pointer rounded-full bg-${0 === daalgavar?.tuluv
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
                <div
                  className={`rounded-2xl bg-red-500 px-3 py-1 text-white ${daalgavar?.tuluv === -1 ? "flex" : "hidden"
                    }`}
                >
                  Цуцлагдсан
                </div>
              </div>
            </div>
            <div className="flex w-full py-2">{daalgavar?.tailbar}</div>
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
          style={{ height: "calc( 100vh - 21.5rem )" }}
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
                  ?.map((mur) => (
                    <div
                      className={`flex ${ajiltan?._id === mur?.ajiltniiId
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
                          className=" h-9 w-9"
                        />
                      </div>
                      <div
                        key={mur._id + "daalgavriinSetgegdel"}
                        className={`relative my-3 flex w-2/3 flex-col flex-wrap rounded-xl ${ajiltan?._id === mur?.ajiltniiId
                          ? "bg-gray-400 dark:bg-gray-500"
                          : "bg-green-500 dark:bg-green-600"
                          }  p-5 pt-1 text-white `}
                      >
                        <div className="pb-1 font-medium">
                          {mur.ajiltniiNer}
                        </div>
                        <div className="w-full break-words  ">
                          {mur.message}
                        </div>
                        <div className="absolute bottom-1 right-3 text-gray-300">
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
          <div className="flex w-full flex-row px-5 py-2">
            <div className="w-full px-2">
              <TextArea
                autoSize={{
                  minRows: 1,
                  maxRows: 2,
                }}
                className="h-10 w-full break-words rounded-md border border-gray-600 p-2 focus:border-gray-400 focus:outline-none"
                placeholder="Тайлбар"
                ref={inputRef}
                value={setgegdel}
                onChange={({ target }) => setSetgegdel(target.value)}
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
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
