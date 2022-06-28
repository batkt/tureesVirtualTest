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
      tuluv: tuluv === "Идэвхитэй" ? [0, 1] : tuluv === "Дууссан" ? 2 : -1,
    }),
    [ajiltan, tuluv]
  );
  console.log("--------------->>>>>>>>>>>>>>>>>>>>>", ajiltan)

  const task = useJagsaalt(ajiltan && "/daalgavar", query, order);

  const setgegdeliinQuery = React.useMemo(
    () => ({
      daalgavriinId: daalgavar?._id,  
    }),
    [daalgavar]
  );



  const daalgavriinSetgegdel = useJagsaalt(daalgavar && "/setgegdel", setgegdeliinQuery);

  console.log('daalgavriinSetgegdel', daalgavriinSetgegdel)

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
    setSetgegdel('');
    inputRef.current.focus();
    //document.getElementById('').setAttribute('data-aos','')

  }, [daalgavar?._id]);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [])

  
  function setgegdelBichie() {
    if (!setgegdel) {
      notification.warning({ message: 'Анхаар', description: 'Сэтгэгдэлээ бичиж оруулна уу' })
      return
    }

    inputRef.current.focus();
    uilchilgee(token).post("/setgegdelBichie", {
      barilgiinId: barilgiinId,
      daalgavriinId: daalgavar._id,
      message: setgegdel
    }).then((response) => {
      if (response.data === 'Amjilttai') {
        task.mutate()
        daalgavriinSetgegdel.mutate()
        setSetgegdel('')
      }
    })

  }
  const [showResults, setShowResults] = React.useState(false)
  const Nemekh = () => {setDaalgavar(false), setShowResults(true)}
  const khaakh = () => setShowResults(false)
  useEffect(() => {
    if(daalgavar){
      setShowResults(false);
    }
  },[])

  
  return (
    <Admin
      khuudasniiNer="daalgavar"
      title="Даалгавар"
      className={"gap-5 sm:p-6"}
      onSearch={task.onSearch}
    >
      <div className="col-span-12 flex flex-col space-y-5 bg-white p-8 dark:bg-gray-900 xl:col-span-5">
        <div className="flex w-full justify-between items-center text-white rounded-xl font-medium bg-green-500 dark:bg-green-700 py-1 px-3">
          <div>
            <div className=" text-2xl ">Өнөөдөр</div>
            <div>7 даалгавар</div>
          </div>
          <div onClick={Nemekh} className="h-5/6 px-5 rounded-xl cursor-pointer font-bold items-center flex bg-white text-green-500 dark:text-green-700">Нэмэх</div>
        </div>
        <div className="flex self-center justify-between py-2 items-center font-medium w-full">
          <div className="text-center py-2 bg-green-500 w-20 text-white rounded-2xl">
            <div className="text-xl">{moment().format("DD")}</div>
            <div>{moment().format("MM")} сар</div>
          </div>
          <div className="text-justify px-3">Ажлын цаг дуусхад 10 цаг 28 минут дутуу байна</div>
          <div className="text-center py-2 w-20 bg-green-500 text-white rounded-2xl">
            <div className="text-xl">{moment().format("DD")}</div>
            <div>{moment().format("MM")} сар</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 rounded-xl bg-green-500 dark:bg-green-700 p-2 font-medium sm:text-lg lg:text-sm xl:text-base 2xl:text-xl">
          {["Идэвхитэй", "Дууссан", "Цуцлагдсан"].map((status) => (
            <div
              onClick={() => setTuluv(status)}
              data-aos="fade-down"
              data-aos-delay={1 + status + "00"}
              className={`cursor-pointer rounded-lg p-1 text-center ${tuluv === status ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-50 " : "text-gray-50"
                }`}
            >
              {status}
            </div>
          ))}
        </div>
        <div className="w-full overflow-y-scroll" style={{ height: "70vh" }}>
          {task?.data?.jagsaalt?.map((mur, index) => (
            <div
              className={`flex w-full cursor-pointer rounded-lg flex-row space-x-2 p-2 bg-gray-50 dark:bg-gray-800 my-1 pl-0 ${daalgavar?._id === mur._id
                ? "bg-green-100 dark:bg-green-700"
                : ""
                }`}
              key={`${index}-daalgavar`}
              onClick={() => { khaakh(),
                setDaalgavar(mur);
              }}
              data-aos="fade-right"
              data-aos-delay={1 + index + "00"}
              data-aos-anchor-placement="top-bottom"
            >
              <div className="text-base w-10 -ml-1 text-left justify-end flex items-center">{1 + index}.</div>
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
                    {moment(mur.duusakhOgnoo).diff(moment(), 'h')} цаг
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
                          : "Эхлээгүй"}
                    </div>
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap break-words">

                    </div>
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
      <div data-aos="flip-right"
data-aos-delay="200"
data-aos-anchor-placement="top-bottom" className={`col-span-12 space-y-10 p-8 xl:px-12 2xl:px-28 ${showResults ? "block" : "hidden" } bg-white relative p-1 dark:bg-gray-900 xl:col-span-7`}>
        <div className="text-xl text-center font-medium">Даалгавар бүртгэх</div>
        <div className="flex justify-between lg:justify-center xl:justify-between flex-wrap gap-2">
        <div className="text-center py-2 bg-gray-200 w-16 font-bold rounded-2xl">
            <div className="text-xl">{moment().format("DD")}</div>
            <div>{moment().format("MM")} сар</div>
          </div>
          <div className="text-center py-2 bg-gray-200 w-16 font-bold rounded-2xl">
            <div className="text-xl">{moment().format("DD")}</div>
            <div>06 сар</div>
          </div>
          <div className="text-center py-2 bg-gray-200 w-16 font-bold rounded-2xl">
            <div className="text-xl">29</div>
            <div>06 сар</div>
          </div>
          <div className="text-center py-2 bg-gray-200 w-16 font-bold rounded-2xl">
            <div className="text-xl">30</div>
            <div>06 сар</div>
          </div>
          <div className="text-center py-2 bg-gray-200 w-16 font-bold rounded-2xl">
            <div className="text-xl">1</div>
            <div>07 сар</div>
          </div>
          <div className="text-center py-2 bg-gray-200 w-16 font-bold rounded-2xl">
            <div className="text-xl">2</div>
            <div>07 сар</div>
          </div>
        </div>
        <div className="text-2xl font-medium">Ажилтан сонгоно уу</div>
        <div className="gap-5 flex flex-col">
          <div  className="bg-gray-200 xl:w-2/3 flex rounded-xl p-5 justify-between">
            <div className="flex gap-5"><UserOutlined className="text-xl"/>
            <div>
              <div className="text-lg font-medium">Ажилтан</div>
              <div>Та ажилтангаа сонгоно уу</div>
            </div>
            </div>
            <div>
            <RightOutlined className="self-center items-end"/>
            </div>
          </div>
          <div  className="bg-gray-200 xl:w-2/3 flex rounded-xl p-5 justify-between">
            <div className="flex gap-5"><FileImageOutlined className="text-xl"/>
            <div>
              <div className="text-lg font-medium">Зураг</div>
              <div>Та зураг сонгоно уу</div>
            </div>
            </div>
            <div>
            <RightOutlined className="self-center items-end"/>
            </div>
          </div>
          <div  className="bg-gray-200 xl:w-2/3 flex rounded-xl p-5 justify-between">
            <audio controls autoplay muted type="audio"/>
          </div>
        </div>
        <div><input className="border-2 h-24 p-5 w-full" placeholder="Даалгавар" type={"text"}></input></div>
        <div className="w-full flex justify-center"><button className="bg-green-500 text-lg rounded-xl py-1 px-24 font-medium text-white">Хадгалах</button></div>
      </div>

      {/* chat */}

      <div
        className={`col-span-12 ${daalgavar ? "block" : "hidden"
          } gap-5 bg-green-50 relative p-1 dark:bg-gray-900 xl:col-span-7`}
        data-aos="flip-left"
        style={{ height: "90vh" }}
        data-aos-delay="200"
        data-aos-anchor-placement="top-bottom"
        ref={ChatRef}
      >
        <div
          className="w-full max-w-6xl min-w-0 space-y-5 p-8 overflow-y-scroll"
          style={{ height: "90%" }}
          ref={messageEl}
        >
          <div className="flex flex-row">

            <div className="w-full p-0 sm:p-2">
              {((!!daalgavar?.zurguud && daalgavar?.zurguud?.length > 0) ||
                (!!daalgavar?.file && daalgavar?.file?.length > 0)) && (
                  <div className="w-full gap-3 items-center flex">
                    <div className="h-11 w-11 rounded-full min-w-max  bg-gray-300 dark:bg-gray-800">
                      <img
                        src="https://365webresources.com/wp-content/uploads/2016/09/FREE-PROFILE-AVATARS.png"
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                    <div className="rounded-lg p-3 pb-8 pt-3 relative bg-white dark:bg-gray-800 w-10/12 sm:w-full">
                      <div className="flex flex-wrap flex-row items-center justify-between">
                        <div className="font-medium">Захирал</div>
                        <div className="flex">                          
                          <div className="absolute bottom-1 text-black dark:text-white opacity-30 right-2">{moment().format("YYYY/MM/DD HH:mm")}</div>
                          <div className="ml-5 flex">
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
                        </div>
                      </div>
                      <div className="flex w-full py-2">{daalgavar?.tailbar}</div>                      
                      <div  className="flex justify-between">                       
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
                        <div className="gap-2 w-1/2 flex justify-end items-center">
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
              <div className="w-full flex flex-col">
                {daalgavriinSetgegdel?.jagsaalt?.map((mur) => <div className="flex items-center gap-2">
                  <div className="h-11 w-11 rounded-full justify-center flex items-start bg-gray-300 dark:bg-gray-800">
                      <img
                        src="https://cdn1.iconfinder.com/data/icons/avatars-1-5/136/87-512.png"
                        className="h-11 w-11 -mt-1 rounded-full"
                      />
                    </div>
                  <div key={mur._id + 'daalgavriinSetgegdel'} className=" my-3 w-2/3 bg-green-500 dark:bg-green-600 text-white flex flex-col flex-wrap pt-1 p-5 relative rounded-xl"><div className="pb-1 font-medium">Ажилчин</div>{mur.message}<div className="absolute bottom-1 right-3 text-gray-300">{moment(mur.ognoo).format("HH:mm")}</div></div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bottom-3 fixed">
          <div className="flex w-full flex-row px-5 py-2">
            <div className="w-full px-2">
              <input
                className="h-10 w-full border border-gray-600 focus:outline-none focus:border-gray-400 rounded-md p-2"
                placeholder="Тайлбар"
                ref={inputRef}
                value={setgegdel}
                onChange={({ target }) => setSetgegdel(target.value)}
                onKeyUp={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setgegdelBichie()
                  }
                }}
              />
            </div>
            <div className="flex flex-row space-x-3">
              <div className="h-10 w-10 cursor-pointer rounded-full bg-gray-100 p-2 text-xl dark:bg-gray-800" onClick={setgegdelBichie}>
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
