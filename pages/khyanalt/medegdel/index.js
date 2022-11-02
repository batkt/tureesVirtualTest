//#region import
import Admin from "components/Admin";
import { useEffect, useState, useRef, useMemo } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useAuth } from "services/auth";
import useMedegdel from "hooks/medegdel/useMedegdel";
import useMailiinZagvar from "hooks/useMailiinZagvar";
import {
  Button,
  Checkbox,
  Drawer,
  Image,
  Input,
  message,
  notification,
  Popconfirm,
  Select,
  Spin,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import moment from "moment";
import router from "next/router";
import MedegdelMailIlgeekh from "components/pageComponents/medegdel/MedegdelMailIlgeekh";
import ZagvarBurtgel from "components/pageComponents/medegdel/ZagvarBurtgel";
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh";
import deleteMethod from "tools/function/crud/deleteMethod";
import createMethod from "tools/function/crud/createMethod";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import { modal } from "components/ant/Modal";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";
import useOrder from "tools/function/useOrder";

//#endregion

var dateCount = {
  yearStart: moment().startOf("year"),
  yearEnd: moment().endOf("year"),
  monthStart: moment().startOf("month"),
  monthEnd: moment().endOf("month"),
};

var timeout = null;

function IlgeesenToo({
  barilgiinId,
  baiguullagiinId,
  ekhlekhOgnoo,
  duusakhOgnoo,
  token,
  text,
  turul,
}) {
  const { data } = useSWR(
    turul === "SMS"
      ? [
          "msgIlgeesenTooAvya",
          barilgiinId,
          baiguullagiinId,
          ekhlekhOgnoo,
          duusakhOgnoo,
        ]
      : null,
    (url, barilgiinId, baiguullagiinId) =>
      createMethod(url, token, {
        barilgiinId,
        baiguullagiinId,
        ekhlekhOgnoo,
        duusakhOgnoo,
      }).then((a) => a.data)
  );
  return (
    <div className="ml-6 flex xl:flex-col xl:text-center">
      {text} <span className="ml-3 font-medium xl:ml-0">{data || 0}</span>
    </div>
  );
}

function Khyanalt({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  //#region const
  const { baiguullaga, barilgiinId } = useAuth();
  const [turul, setTurul] = useState("SMS");
  const [khariltsagch, setKhariltsagch] = useState(null);
  const [davkhar, setDavkhar] = useState(null);
  const [content, setContent] = useState("");
  const [msj, onTextChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [turulZagvar, setTurulZagvar] = useState(false);
  const [mailIlgeekh, setMailIlgeekh] = useState(false);
  const ilgeekhRef = useRef();
  /**Илгээх төрөл
   * enum {buunuur | davkharaar | avlagaar | gantsaar}
   *  */
  const [ilgeekhTurul, setIlgeekhTurul] = useState("gantsaar");
  const [tuluv, setTuluv] = useState("idevkhtei");
  const [waiting, setWaiting] = useState(false);
  const ref = useRef(null);
  const [zurag, setZurag] = useState();
  const [songogdsonKhariltsagch, setSongogdsonKhariltsagch] = useState([]);
  const khariltsagchiinQuery = useMemo(() => {
    return {
      barilgiinId,
    };
  }, [barilgiinId]);
  const nekhemjlel = useJagsaalt(
    "/khariltsagch",
    khariltsagchiinQuery,
    undefined,
    undefined,
    ["ner", "ovog", "utas"]
  );
  const { mailiinZagvarGaralt, mailiinZagvarMutate } = useMailiinZagvar(token);

  const query = useMemo(() => {
    return {
      turul: "medegdel",
      khuleenAvagchiinId: khariltsagch?._id,
    };
  }, [turul, khariltsagch]);

  const { order } = useOrder({ createdAt: -1 });
  const medegdelAvya = useJagsaalt("/sonorduulga", query, order);

  const khariltsagchiinMsjTuukhKharakh = useMemo(() => {
    return { barilgiinId: barilgiinId, dugaar: khariltsagch?.utas };
  });
  const msjTuukh = useJagsaalt(
    "/msgTuukh",
    khariltsagchiinMsjTuukhKharakh,
    order
  );

  useEffect(() => {
    setKhariltsagch(null);
    if (ilgeekhTurul !== "davkharaar") setDavkhar(null);
  }, [ilgeekhTurul]);

  useEffect(() => {
    setKhariltsagch(null);
    setDavkhar(null);
  }, [turul]);

  const ingeekhmSms = useMemo(() => {
    if (!khariltsagch) return msj;
    var utga = msj;
    for (const [key, value] of Object.entries(khariltsagch)) {
      utga = utga?.replace(new RegExp(`<${key}>`, "g"), value);
    }
    return utga;
  }, [khariltsagch, msj]);
  //#endregion

  //#region method
  async function appIlgeeye() {
    if (loading) {
      message.warning("Хүсэлт илгээгдсэн байна");
      return;
    }
    if (!!title) {
      setLoading(true);
      uilchilgee(token)
        .post(`/sonorduulgaIlgeeye`, {
          firebaseToken: khariltsagch?.firebaseToken,
          khariltsagchiinId: khariltsagch?._id,
          barilgiinId: khariltsagch.barilgiinId,
          khariltsagchiinNer: khariltsagch.ner,
          zurgiinId: zurag,
          medeelel: { title, body: ingeekhmSms },
        })
        .then(({ data }) => {
          zurag &&
            uilchilgee(token).post("/confirmFile", {
              filename: zurag,
              path: "medegdel",
            });
          if (!!data?.successCount) {
            medegdelAvya.jagsaalt.unshift({
              khariltsagchiinId: khariltsagch?._id,
              barilgiinId: khariltsagch.barilgiinId,
              khariltsagchiinNer: khariltsagch.ner,
              title,
              message: ingeekhmSms,
              turul: "medegdel",
            });
            notification.success({
              message: "Notification Амжилттай илгээлээ",
            });
            onTextChange("");
            setContent("");
            setTitle("");
            setLoading(false);
          } else if (!!data?.failureCount) {
            notification.warning({
              description: _.get(data, "results.0.error.message"),
              message: _.get(data, "results.0.error.code"),
            });
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          aldaaBarigch(e);
        });
    } else {
      notification.warning({
        message: "Гарчиг заавал оруулна уу",
      });
    }
  }

  async function msgIlgeeye() {
    if (loading) {
      message.warning("Хүсэлт илгээгдсэн байна");
      return;
    }
    var msgnuud = [];
    if (ilgeekhTurul !== "gantsaar" && songogdsonKhariltsagch.length > 0)
      songogdsonKhariltsagch.map((a) => {
        var text = msj;
        for (const [key, value] of Object.entries(a)) {
          text = text?.replace(new RegExp(`<${key}>`, "g"), value);
        }
        if (_.isArray(a.utas))
          a.utas.map((to) =>
            msgnuud.push({
              to,
              text,
            })
          );
        else
          msgnuud.push({
            to: a.utas,
            text,
          });
      });
    else if (!!khariltsagch) {
      if (_.isArray(khariltsagch?.utas))
        khariltsagch?.utas.map((to) =>
          msgnuud.push({
            to,
            text: ingeekhmSms,
          })
        );
      else
        msgnuud.push({
          to: khariltsagch?.utas,
          text: ingeekhmSms,
        });
    } else {
      message.warning("Та SMS илгээх гэрээгээ сонгоно уу");
      return;
    }
    if (!(msgnuud.length > 0)) {
      message.warning("Илгээх мэдээлэл байхгүй байна");
      return;
    }

    setLoading(true);
    uilchilgee(token)
      .post(`/msgIlgeeye`, { barilgiinId, msgnuud })
      .then(({ data }) => {
        if (data && data[0].Result === "SUCCESS") {
          notification.success({ message: "SMS Амжилттай илгээлээ" });
          setContent("");
          setTitle("");
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
        aldaaBarigch(e);
      });
  }

  async function mailIlgeeye() {
    if (ilgeekhTurul === "gantsaar" && !khariltsagch?.mail) {
      notification.warning({ message: "Гэрээнд и-мэйл бүртгэгдээгүй байна" });
      return;
    }
    const mailuud = [];

    if (ilgeekhTurul === "gantsaar") {
      var zagvar = content;
      for (const [key, value] of Object.entries(khariltsagch)) {
        zagvar = zagvar?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
      }
      mailuud.push({
        mail: khariltsagch.mail,
        content: zagvar,
      });
    } else if (songogdsonKhariltsagch?.length > 0) {
      songogdsonKhariltsagch.forEach((a) => {
        var zagvar = content;
        for (const [key, value] of Object.entries(a)) {
          zagvar = zagvar?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
        }
        mailuud.push({
          mail: a.mail,
          content: zagvar,
        });
      });
    }
    if (!!title) {
      setLoading(true);
      uilchilgee(token)
        .post(`/mailOlnoorIlgeeye`, { mailuud, subject: title })
        .then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({ message: "И-мэйл Амжилттай илгээлээ" });
            setContent("");
            setTitle("");
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          aldaaBarigch(e);
        });
    } else {
      notification.warning({
        message: "Гарчиг заавал оруулна уу",
      });
    }
  }

  function send() {
    switch (turul) {
      case "App":
        appIlgeeye();
        break;
      case "Mail":
        mailIlgeeye();
        break;
      default:
        msgIlgeeye();
        break;
    }
  }

  function smsZagvarNemya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => ref.current.khadgalya(setWaiting(true))}
      >
        Хадгалах
      </Button>,
    ];
    modal({
      title: `${turul} Загвар үүсгэх`,
      icon: <FileExcelOutlined />,
      content: (
        <ZagvarBurtgel
          ref={ref}
          setWaiting={setWaiting}
          data={data}
          token={token}
          turul={turul}
          barilgiinId={barilgiinId}
          onRefresh={mailiinZagvarMutate}
        />
      ),
      footer,
    });
  }

  function zagvarUstgaya(mur) {
    setWaiting(true);
    deleteMethod("mailiinZagvar", token, mur?._id)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setWaiting(false);
          notification.success({ message: "Устгагдлаа" });
          mailiinZagvarMutate();
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setWaiting(false);
      });
  }

  function seen() {
    const seenList = [...(medegdelAvya?.jagsaalt || [])].filter(
      (a) => a.turul !== "medegdel" && a.kharsanEsekh !== true
    );
    if (seenList.length > 0) {
      const seenIds = seenList.map((a) => a._id);
      if (
        medegdelAvya?.jagsaalt.filter(
          (a) => a.turul !== "medegdel" && a.kharsanEsekh === false
        ).length > 0
      )
        setKhuudaslalt((a) => {
          a.jagsaalt.forEach((b) => {
            if (b.turul !== "medegdel" && b.kharsanEsekh === false)
              b.kharsanEsekh = true;
          });
          return a;
        });
      uilchilgee(token)
        .post("/sanalKharlaa", { id: seenIds })
        .then(() => {
          if (
            medegdelAvya?.jagsaalt?.filter(
              (a) => a.turul !== "medegdel" && a.kharsanEsekh === false
            ).length > 0
          )
            sonorduulgaMutate();
        })
        .catch(aldaaBarigch);
    }
  }

  function onScroll(e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      seen();
    }, 300);
  }
  //#endregion

  return (
    <Admin
      title="Мэдэгдэл"
      khuudasniiNer="medegdel"
      className=" overflow-hidden p-5 md:p-4 lg:h-auto"
      onSearch={(search) =>
        nekhemjlel.setKhuudaslalt((a) => ({ ...a, search }))
      }
      tsonkhniiId="61c2c68d1c2830c4e6f90ca5"
    >
      <div className="col-span-12 xl:col-span-3">
        <div className="pr-1" data-aos="fade-right" data-aos-duration="1000">
          <div className="box p-2">
            <div className="grid grid-cols-3 gap-1 font-medium" role="tablist">
              {["SMS", "App", "Mail"].map((mur) => (
                <div
                  key={mur}
                  className={`flex-1 cursor-pointer rounded-md py-2 text-center ${
                    turul === mur ? "bg-green-500 text-white" : ""
                  }`}
                  onClick={() => setTurul(mur)}
                >
                  {mur}
                </div>
              ))}
            </div>
          </div>
        </div>

        {turul === "SMS" ? (
          <div
            className="box mt-5 flex flex-row items-center p-2 pl-3 "
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <div className="items-center sm:flex lg:mt-3 xl:block 2xl:mt-auto 2xl:flex">
              <p className="rounded-md bg-white text-sm dark:bg-gray-900">
                SMS илгээсэн
              </p>
              <IlgeesenToo
                barilgiinId={barilgiinId}
                baiguullagiinId={baiguullaga?._id}
                ekhlekhOgnoo={dateCount.yearStart}
                duusakhOgnoo={dateCount.yearEnd}
                token={token}
                text="Нийт"
                turul={turul}
              />
              <IlgeesenToo
                barilgiinId={barilgiinId}
                baiguullagiinId={baiguullaga?._id}
                ekhlekhOgnoo={dateCount.monthStart}
                duusakhOgnoo={dateCount.monthEnd}
                token={token}
                text="Энэ сард"
                turul={turul}
              />
            </div>
          </div>
        ) : null}
        <div
          className={` ${
            turul === "SMS" ? "ml-auto" : "flex w-full justify-center"
          }`}
        ></div>

        <div
          className="box mt-5 flex flex-row items-center space-x-3 p-2 pl-3"
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="100"
        >
          {/* <Select className="w-full" value={tuluv} onChange={setTuluv}>
            {[
              { key: "idevkhtei", v: "Идэвхтэй" },
              { key: "idevkhgiu", v: "Идэвхгүй " },
            ].map((a) => (
              <Select.Option key={a.key} value={a.key}>
                {a.v}
              </Select.Option>
            ))}
          </Select> */}
          <Select placeholder="Давхар" onChange={setDavkhar} allowClear>
            {baiguullaga?.barilguud
              ?.find((a) => a._id === barilgiinId)
              ?.davkharuud.map((a) => (
                <Select.Option key={a._id} value={a.davkhar}>
                  {a.davkhar}
                </Select.Option>
              ))}
          </Select>
        </div>
        <div
          className={`mt-5 flex-row p-2 font-medium xl:flex ${
            khariltsagch ? "hidden" : "flex"
          }`}
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="100"
        >
          <div className="hidden xl:block">{turul} загвар</div>
          <div className=" xl:hidden">
            <Button
              onClick={
                turulZagvar === false
                  ? () => setTurulZagvar(true)
                  : () => setTurulZagvar(false)
              }
            >
              {turulZagvar === false ? (turul, "загвар") : "буцах"}
            </Button>
          </div>
          {turul === "Mail" ? (
            <button
              className={`ml-auto cursor-pointer rounded-md bg-green-500 py-2 px-4 text-center text-white`}
              onClick={() => {
                setMailIlgeekh(true);
              }}
            >
              Загвар үүсгэх
            </button>
          ) : (
            <button
              className={`ml-auto cursor-pointer rounded-md bg-green-500 py-2 px-4 text-center text-white`}
              onClick={() => smsZagvarNemya()}
            >
              Загвар үүсгэх
            </button>
          )}
        </div>
        <div
          className={`scrollbar-hidden h-full overflow-hidden overflow-y-auto xl:block ${
            turulZagvar === true ? "block" : "hidden"
          }`}
        >
          {mailiinZagvarGaralt?.jagsaalt?.map((a) => (
            <div>
              {a.turul === turul ? (
                <div
                  key={a.ner}
                  className="intro-x box relative mt-2 flex cursor-pointer items-center p-2"
                  data-aos="fade-left"
                  data-aos-duration="1000"
                  data-aos-delay="100"
                  onClick={() => setContent(a.mail)}
                >
                  <div className="image-fit mr-1 h-8 w-8 flex-none ">
                    <img alt="email" src="/email.png" />
                  </div>
                  <div className="ml-2 mr-1 overflow-hidden">
                    <div className="flex items-center">
                      <div className="font-medium">{a.ner}</div>
                    </div>
                  </div>
                  <div className="ml-auto flex flex-row space-x-2">
                    <Popconfirm
                      title="Загвар устгах уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => zagvarUstgaya(a)}
                    >
                      <div className="flex h-8  w-8 items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-white dark:bg-gray-800">
                        <DeleteOutlined style={{ color: "red" }} />
                      </div>
                    </Popconfirm>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-white dark:bg-gray-800"
                      onClick={() =>
                        turul === "sms" || "App"
                          ? smsZagvarNemya(a)
                          : router.push(`/khyanalt/medegdel/${a._id}`)
                      }
                    >
                      <EditOutlined style={{ color: "#85C1E9" }} />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
      <div
        className={`col-span-12 lg:col-span-6 xl:col-span-3`}
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className={`box p-5 xl:block`}>
          <div className="relative w-full text-gray-700   dark:text-gray-300">
            <input
              type="text"
              className="w-full rounded-md bg-gray-100 px-2  py-1   dark:bg-gray-700"
              placeholder="Харилцагч хайх /Утас , Нэр, Регистр/"
              onChange={({ target }) => {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                  nekhemjlel.setKhuudaslalt((a) => ({
                    ...a,
                    search: target.value,
                  }));
                }, 300);
              }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-search absolute inset-y-0 right-0 my-auto mr-3 mt-2 h-4 w-4"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div className=" flex  cursor-pointer flex-row items-center space-x-2 rounded-md p-2 ">
            <Checkbox
              checked={
                nekhemjlel?.jagsaalt?.length === songogdsonKhariltsagch.length
              }
              onChange={(e) => {
                if (e.target.checked === true)
                  setSongogdsonKhariltsagch([...nekhemjlel?.jagsaalt]);
                else setSongogdsonKhariltsagch([]);
              }}
            >
              {" "}
              Бүгдийг сонгох
            </Checkbox>
          </div>
          <div className="scrollbar-hidden h-medegdelHariltsagchPhone overflow-y-auto lg:h-scrollH">
            {nekhemjlel?.jagsaalt?.map((mur) => (
              <div>
                {!!mur._id ? (
                  <div
                    className={`flex cursor-pointer flex-row items-center space-x-2 rounded-md p-2 ${
                      khariltsagch?._id === mur?._id
                        ? "rounded-l-full bg-green-200 shadow-lg saturate-50 dark:bg-green-500 "
                        : ""
                    } `}
                    key={mur?._id}
                    onClick={() => setKhariltsagch(mur)}
                  >
                    <div>
                      <Checkbox
                        checked={
                          songogdsonKhariltsagch.findIndex(
                            (a) => a._id === mur._id
                          ) !== -1
                        }
                        onChange={(e) => {
                          e.target.checked;
                          if (e.target.checked == true) {
                            songogdsonKhariltsagch.push(mur);
                          } else {
                            const index = songogdsonKhariltsagch.findIndex(
                              (a) => a._id === mur._id
                            );
                            if (index !== -1) {
                              songogdsonKhariltsagch.splice(index, 1);
                            }
                          }
                          setSongogdsonKhariltsagch([
                            ...songogdsonKhariltsagch,
                          ]);
                        }}
                      />
                    </div>
                    <div className="image-fit relative h-10 w-10 flex-none rounded-full">
                      <img
                        alt="profileZurag"
                        className="rounded-full"
                        src={
                          ((mur.register?.replace(/^\D+/g, "") % 100) / 10) %
                            2 <
                          1
                            ? "/profileFemale.svg"
                            : "/profile.svg"
                        }
                      />
                      <div className="bg-theme-9 absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white"></div>
                    </div>
                    <div>{mur?.ner}</div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12 mt-0 min-h-[70vh] lg:col-span-6 lg:mt-0 xl:col-span-6 xl:h-H7HalfRem">
        {khariltsagch ? (
          <div className="box flex h-full flex-col">
            {songogdsonKhariltsagch.length <= 1 ? (
              <div className="dark:border-dark-5 flex flex-col border-b border-gray-200 px-5 py-4 sm:flex-row">
                {ilgeekhTurul === "davkharaar" && (
                  <div className="flex flex-row space-x-2">
                    <div>Давхар сонгох</div>
                    <div className="">
                      <Select
                        placeholder="Давхар"
                        value={davkhar}
                        onChange={setDavkhar}
                        allowClear
                      >
                        {baiguullaga?.barilguud[0]?.davkharuud.map((a) => (
                          <Select.Option key={a._id} value={a.davkhar}>
                            {a.davkhar}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}
                {khariltsagch && (
                  <div className="flex items-center">
                    <div className="mr-3 text-lg xl:hidden">
                      <ArrowLeftOutlined
                        onClick={() => setKhariltsagch(null)}
                      />
                    </div>
                    <div className="image-fit relative h-10 w-10 flex-none sm:h-12 sm:w-12">
                      <img
                        alt="ProfileZurag"
                        className="rounded-full"
                        src={
                          ((khariltsagch.register.replace(/^\D+/g, "") % 100) /
                            10) %
                            2 <
                          1
                            ? "/profileFemale.svg"
                            : "/profile.svg"
                        }
                      />
                    </div>
                    <div className="ml-3 mr-auto">
                      <div className="text-base font-medium">
                        {khariltsagch?.ner}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                        {turul === "Mail"
                          ? khariltsagch?.mail
                          : khariltsagch?.utas}{" "}
                        <span className="mx-1">•</span> {turul}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            <div
              className="w-full"
              data-aos="fade-left"
              data-aos-duration="1000"
            >
              {turul === "App" ? (
                <div
                  className="mt-0 flex h-full w-full flex-col-reverse overflow-y-auto p-5 lg:mt-0"
                  style={{ maxHeight: "calc(100vh - 32rem)" }}
                  onScroll={onScroll}
                >
                  {medegdelAvya?.jagsaalt.map((a) => {
                    return (
                      <div
                        className={`relative my-5 flex w-full flex-col rounded-xl border border-green-200 bg-green-500 p-3  ${
                          a.turul === "medegdel"
                            ? "ml-auto rounded-br-none bg-green-500"
                            : "rounded-bl-none"
                        }`}
                      >
                        <span className="w-full break-words text-justify text-white ">
                          {a.message}
                        </span>
                        <div>
                          {!!a.zurgiinId ? (
                            <Image
                              width={75}
                              src={`https://turees.zevtabs.mn/api/file?path=medegdel/${a.zurgiinId}`}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                        <div
                          className={`absolute right-2 h-5 w-5 fill-current text-white ${
                            a.kharsanEsekh === true ? "" : "hidden"
                          }`}
                        >
                          <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M16 7L12 11"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="absolute -bottom-5 text-xs font-medium text-gray-500">
                          {moment(a.createdAt).format("YYYY-MM-DD hh:mm")}
                        </span>
                        <span className="absolute right-0 -bottom-5 text-gray-500">
                          Мэдэгдэл
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : turul === "SMS" ? (
                <div
                  className="mt-0 flex h-full w-full flex-col-reverse overflow-y-auto p-5 lg:mt-0"
                  style={{ maxHeight: "calc(100vh - 32rem)" }}
                  onScroll={onScroll}
                >
                  {msjTuukh?.jagsaalt.map((a) => {
                    return (
                      <div
                        className={`relative my-5 flex w-full flex-col rounded-xl border border-green-200 bg-green-500 p-3  ${
                          a.turul === "medegdel"
                            ? "ml-auto rounded-br-none bg-green-500"
                            : "rounded-bl-none"
                        }`}
                      >
                        <span className="w-full break-words text-justify text-white ">
                          {a.msg}
                        </span>

                        <div
                          className={`absolute right-2 h-5 w-5 fill-current text-white ${
                            a.kharsanEsekh === true ? "" : "hidden"
                          }`}
                        >
                          <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M16 7L12 11"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <span className="absolute -bottom-5 text-xs font-medium text-gray-500">
                          {moment(a.createdAt).format("YYYY-MM-DD hh:mm")}
                        </span>
                        <span className="absolute right-0 -bottom-5 text-gray-500">
                          Мэдэгдэл
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                ""
              )}
            </div>
            <div
              className="mt-auto w-full p-2"
              data-aos="fade-right"
              data-aos-duration="1000"
            >
              {turul !== "SMS" && (
                <Input
                  className="space-y-3"
                  placeholder="Гарчиг"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}
                />
              )}

              {turul !== "App" ? (
                <ZagvarUusgekh
                  change={setContent}
                  value={content}
                  onTextChange={onTextChange}
                />
              ) : (
                <div className="py-5">
                  <div className="flex items-center space-x-3">
                    <div>
                      <Upload
                        showUploadList={false}
                        multiple={false}
                        name="file"
                        action={`${url}/upload`}
                        method="POST"
                        onChange={(v) => setZurag(v.file.response)}
                      >
                        <div className="flex flex-row space-x-1">
                          <Button icon={<UploadOutlined />}>
                            зураг оруулах
                          </Button>
                        </div>
                      </Upload>
                    </div>
                  </div>

                  <ZagvarUusgekh
                    change={setContent}
                    value={content}
                    onTextChange={onTextChange}
                  />
                </div>
              )}
            </div>
            <div className="flex w-full items-center justify-between space-x-2 p-2">
              <div className="text-lg">{msj.length}/160</div>
              <div className="flex items-center justify-between space-x-3">
                <label className="font-medium">{turul} Илгээх</label>
                <div
                  onClick={send}
                  className={`h-8 w-8 cursor-pointer sm:h-10 sm:w-10 bg-green-${
                    loading ? "200" : "600"
                  } flex flex-none items-center justify-center rounded-full text-white`}
                >
                  {loading ? (
                    <Spin size="small" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`box hidden h-full items-center xl:flex ${
              turulZagvar ? "hidden" : "lg:flex"
            }`}
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
                  Та {turul} илгээх харилцагчаа сонгоно уу.
                </div>
              </div>
            </div>
          </div>
        )}
        <Drawer
          title={"Mail Загвар үүсгэх"}
          width={"70vw"}
          onClose={() => setMailIlgeekh(false)}
          visible={mailIlgeekh === true}
        >
          {mailIlgeekh === true && (
            <MedegdelMailIlgeekh ref={ilgeekhRef} token={token} />
          )}
        </Drawer>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Khyanalt;
