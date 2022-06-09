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

const order = { createdAt: -1 };

function index({ token }) {
  const [tuluv, setTuluv] = React.useState("Идэвхитэй");
  const [daalgavar, setDaalgavar] = React.useState();
  const [setgegdel, setSetgegdel] = React.useState();
  const { ajiltan, barilgiinId } = useAuth();
  const inputRef = React.useRef();
  const ChatRef = React.useRef();

  const query = React.useMemo(
    () => ({
      ajiltniiId: ajiltan?._id,
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


  return (
    <Admin
      khuudasniiNer="daalgavar"
      title="Даалгавар"
      className={"gap-5 p-6"}
      onSearch={task.onSearch}
    >
      <div className="col-span-12 flex flex-col space-y-5 bg-white p-8 dark:bg-green-900 lg:col-span-6 xl:col-span-5">
        <div className="grid grid-cols-3 gap-5 rounded-xl bg-green-500 p-2 font-medium sm:text-lg lg:text-sm xl:text-base 2xl:text-xl">
          {["Идэвхитэй", "Дууссан", "Цуцлагдсан"].map((status) => (
            <div
              onClick={() => setTuluv(status)}
              data-aos="fade-down"
              data-aos-delay={1 + status + "00"}
              className={`cursor-pointer rounded-lg p-1 text-center ${tuluv === status ? "bg-white text-gray-800 " : "text-gray-50"
                }`}
            >
              {status}
            </div>
          ))}
        </div>
        <div className="w-full overflow-y-scroll" style={{height:"70vh"}}>
          {task?.data?.jagsaalt?.map((mur, index) => (
            <div
              className={`flex w-full cursor-pointer flex-row space-x-2 p-2 ${daalgavar?._id === mur._id
                  ? "bg-green-100 dark:bg-green-700"
                  : ""
                }`}
              key={`${index}-daalgavar`}
              onClick={() => {
                setDaalgavar(mur);
              }}
              data-aos="fade-right"
              data-aos-delay={1 + index + "00"}
              data-aos-anchor-placement="top-bottom"
            >  
            <div className="text-xl w-10 text-left justify-end flex items-center">{1 + index}.</div>            
              <div
                className={`h-10 w-10 rounded-lg bg-${mur.started ? "green" : "green"
                  }-500 text-2xl text-white`}
              >
                {/* <div className="absolute text-base -bottom-0.5 left-0.5">{1 + index}.</div> */}
                {mur.tuluv === 1 ? (
                  <HistoryOutlined />
                ) : (
                  <ClockCircleOutlined />
                )}
              </div>
              <div className="w-full">
                <div className="flex w-full flex-row justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-100">
                    {moment(mur.duusakhOgnoo).diff(moment(),'h')} цаг
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
      {/* chat */}

      <div
        className={`col-span-12 ${daalgavar ? "block" : "hidden"
          } gap-5 bg-white relative p-1 dark:bg-green-900 lg:col-span-6 xl:col-span-7`}
        data-aos="flip-left"
        style={{height:"90vh"}}
        data-aos-delay="200"
        data-aos-anchor-placement="top-bottom"
        ref={ChatRef}
      >
        <div
          className="w-full space-y-5 p-5"
        >
          <div className="flex flex-row p-2">
            <div className="h-11 w-11 rounded-full bg-gray-300 dark:bg-gray-800">
              <img
                src="https://365webresources.com/wp-content/uploads/2016/09/FREE-PROFILE-AVATARS.png"
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="w-full p-2">
              <div className="flex flex-row justify-between">
                <div className="font-medium">Захирал</div>
                <div className="flex">
                  <div className="ml-auto flex w-40 items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-200">
                    {moment().format("YYYY/MM/DD HH:mm")}
                  </div>
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
                          }-500 py-2 px-5 font-medium text-gray-50`}
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
              <div className="w-1/2">
                <div className="flex py-2">{daalgavar?.tailbar}</div>
              </div>
              <div></div>
              {((!!daalgavar?.zurguud && daalgavar?.zurguud?.length > 0) ||
                (!!daalgavar?.file && daalgavar?.file?.length > 0)) && (
                  <div className="w-full border border-gray-600">
                    <div className="flex justify-between flex-row items-center space-x-2 p-2">
                      <Image.PreviewGroup>
                        {daalgavar.zurguud?.map((mur) => (
                          <Image
                            key={mur}
                            alt={mur}
                            height="5rem"
                            width="5rem"
                            src={`${url}/zuragAvya/jpg/${ajiltan.baiguullagiinId}/${mur}`}
                          />
                        ))}
                      </Image.PreviewGroup>
                      {daalgavar.file?.map((mur) => (
                        <audio controls key={mur}>
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
                      ))}
                    </div>
                    <div className="bg-gray-500 p-2">
                      {(daalgavar?.zurguud?.length || 0) +
                        (daalgavar?.file?.length || 0)}{" "}
                      хавсралт
                    </div>
                  </div>
                )}
              <div className="w-full flex flex-col overflow-y-scroll" style={{height:"55vh"}}>
                {daalgavriinSetgegdel?.jagsaalt?.map((mur) => <div key={mur._id + 'daalgavriinSetgegdel'} className=" my-3 rounded-tl-none w-min bg-green-800 dark:bg-green-600 text-white flex flex-row p-3 rounded-3xl">{mur.message}</div>)}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bottom-3 fixed">
          <div className="flex w-full flex-row px-5 py-2">
            <div className="w-full px-2">
              <input
                className="h-10 w-full border border-gray-300 p-2"
                placeholder="Тайлбар"
                ref={inputRef}
                value={setgegdel}
                onChange={({ target }) => setSetgegdel(target.value)}
                onKeyUp={(event)=> {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    setgegdelBichie()
                  }}}
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
