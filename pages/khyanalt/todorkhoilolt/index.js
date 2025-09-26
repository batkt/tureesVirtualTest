import Admin from "components/Admin";
import { useEffect, useState, useRef, useMemo } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { Tooltip, Tag } from "antd";
import { useAuth } from "services/auth";
import useMailiinZagvar from "hooks/useMailiinZagvar";
import {
  Button,
  Checkbox,
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
  EyeInvisibleOutlined,
  FileExcelOutlined,
  SnippetsOutlined,
  UploadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import moment from "moment";
import router from "next/router";
import Zasvar from "./zasvar";
import Burtgel from "./burtgel";
import deleteMethod from "tools/function/crud/deleteMethod";
import createMethod from "tools/function/crud/createMethod";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import { modal } from "components/ant/Modal";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";
import useOrder from "tools/function/useOrder";
import useKhariltsagchDavkhraarAvya from "hooks/useKhariltsagchDavkhraarAvya";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { renderToString } from "react-dom/server";
import {
  todorkhoiloltTuukh,
  useTodorkhoiloltTuukh,
} from "hooks/useTodorkhoiloltTuukh";

var dateCount = {
  yearStart: moment().startOf("year"),
  yearEnd: moment().endOf("year"),
  monthStart: moment().startOf("month"),
  monthEnd: moment().endOf("month"),
};

var timeout = null;

function Todorkhoilolt() {
  useEffect(() => {
    Aos.init({ once: true });
  });

  const { token, baiguullaga, barilgiinId, ajiltan, baiguullagiinId } =
    useAuth();
  const { t } = useTranslation();
  const [khariltsagch, setKhariltsagch] = useState(null);
  const [davkhar, setDavkhar] = useState(null);
  const [content, setContent] = useState("");
  const [ner, setNer] = useState();
  const [msj, onTextChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const [turulZagvar, setTurulZagvar] = useState(false);

  const [waiting, setWaiting] = useState(false);
  const ref = useRef(null);
  const [zurag, setZurag] = useState();
  const [songogdsonKhariltsagch, setSongogdsonKhariltsagch] = useState([]);
  const [turul, setTurul] = useState("Тодорхойлолт");

  const printRef = useRef(null);
  const [printContent, setPrintContent] = useState("");
  const burtgelRef = useRef(null);

  const khariltsagchiinQuery = useMemo(() => {
    return {
      barilgiinId,
    };
  }, [barilgiinId]);

  const { setKhariltsagchKhuudaslalt, jagsaalt } = useKhariltsagchDavkhraarAvya(
    token,
    khariltsagchiinQuery,
    undefined,
    undefined
  );

  const { mailtuukhmailtuukhJagsaalt } = todorkhoiloltTuukh(
    token,
    null,
    null,
    null
  );

  const { mailiinZagvarGaralt, mailiinZagvarMutate } = useMailiinZagvar(
    token,
    turul
  );
  const [neesenEsekh, setNeesenEsekh] = useState(false);
  const [songosonZagvar, setSongosonZagvar] = useState();
  const [selectedContent, setSelectedContent] = useState(null);

  const query = useMemo(() => {
    return {
      turul: "medegdel",
      khuleenAvagchiinId: khariltsagch?._id,
    };
  }, [turul, khariltsagch]);

  const { order } = useOrder({ createdAt: -1 });
  const medegdelAvya = useJagsaalt("/sonorduulga", query, order, undefined);

  const getCurrentContent = () => {
    try {
      const content = burtgelRef.current?.getContent() || "";

      return content;
    } catch (error) {
      console.log(error);
    }
  };
  const barilga = baiguullaga?.barilguud?.find(
    (a) => a.id === jagsaalt?.barilgiinId
  );
  const printDataRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: turul || "Тодорхойлолт",
    onBeforeGetContent: () => {
      let processedContent = printDataRef.current || getCurrentContent();

      if (songogdsonKhariltsagch && jagsaalt) {
        const foundClient = jagsaalt.find(
          (c) =>
            c.id === songogdsonKhariltsagch || c._id === songogdsonKhariltsagch
        );

        if (foundClient) {
          const clientData = {
            ner: foundClient.ner || "",
            register: foundClient.register || "",
            utas: foundClient.utas || "",
            talbainDugaar: Array.isArray(foundClient.talbainDugaar)
              ? foundClient.talbainDugaar.join(", ")
              : foundClient.talbainDugaar || "",
            gereeniiDugaar: Array.isArray(foundClient.gereenuud)
              ? foundClient.gereenuud
                  .map((g) => g.gereeniiDugaar)
                  .filter(Boolean)
                  .join(", ")
              : "",
            ...foundClient,
          };

          for (const [key, value] of Object.entries(clientData)) {
            if (value !== null && value !== undefined) {
              processedContent = processedContent?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                String(value)
              );
            }
          }
        }
      }

      setPrintContent(processedContent);
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setPrintContent("");
      printDataRef.current = null; // reset
    },
  });

  useEffect(() => {
    if (neesenEsekh === true) {
      setTurulZagvar(false);
    }
  }, [neesenEsekh]);

  async function mailIlgeeye() {
    if (
      !!songogdsonKhariltsagch &&
      !!songosonZagvar &&
      turul === "Тодорхойлолт"
    ) {
      const currentContent = getCurrentContent();
      const title = turul;
      let todorkhoilolt = {};

      if (!!currentContent) {
        const mailuud = [];

        if (!!songogdsonKhariltsagch) {
          let clientsToProcess = [];

          if (jagsaalt && Array.isArray(jagsaalt)) {
            const foundClient = jagsaalt.find(
              (client) =>
                client.id === songogdsonKhariltsagch ||
                client._id === songogdsonKhariltsagch
            );

            if (foundClient) {
              todorkhoilolt = {
                baiguullagiinNer: baiguullaga?.ner || "",
                baiguullagiinId: foundClient.baiguullagiinId || "",
                barilgiinId: foundClient.barilgiinId || "",
                ovog: foundClient.ovog || "",
                ner: foundClient.ner || "",
                register: foundClient.register,
                utas: foundClient.utas,
                gereeniiDugaar: Array.isArray(foundClient.gereenuud)
                  ? foundClient.gereenuud
                      .map((g) => g.gereeniiDugaar)
                      .filter(Boolean)
                      .join(", ")
                  : "",
                mailiinZagvariinId: songosonZagvar._id,
                mailKhayagTo: foundClient.mail,
                maililgeesenAjiltniiNer: ajiltan.ner,
                maililgeesenAjiltniiId: ajiltan._id,
              };
              clientsToProcess = [foundClient];
            }
          }

          clientsToProcess.forEach((a) => {
            if (a && a.mail) {
              var zagvar = `
              <div style="
                font-family: Arial, sans-serif;
                position: relative;
                font-size: 12px;
                padding-top: 5rem;
                padding-left: 7.3rem;
                padding-right: 3rem;
                padding-bottom: 3.54rem;
                color: #000;
                line-height: 1.5;
                min-height: 400px;
              ">
                <div style="margin-bottom: 20px; text-align: center;">
                  <h2 style="margin: 0; font-size: 18px; font-weight: bold;">${
                    title || "Тодорхойлолт"
                  }</h2>
                </div>
                
                <div style="min-height: 200px; word-wrap: break-word;">
                  ${currentContent}
                </div>
                ${
                  barilga?.gariinUseg
                    ? `
                <img src="${url}/file?path=gariinUseg/${barilga.gariinUseg}" 
                     style="
                       position: absolute;
                       bottom: -200px;
                       right: 380px;
                       width: 180px;
                       height: 140px;
                       z-index: 100;
                       opacity: 0.65;
                      
                     " 
                     alt="gariinUseg"/>
                `
                    : ""
                }
                
                ${
                  barilga?.tamga
                    ? `
                <img src="${url}/file?path=tamga/${barilga.tamga}" 
                     style="
                       position: absolute;
                       bottom: -200px;
                       right: 260px;
                       width: 200px;
                       height: 160px;
                       opacity: 0.65;
                     " 
                     alt="tamga"/>
                `
                    : ""
                }
              </div>
            `;

              let clientData = {
                ner: a.ner || "",
                register: a.register || "",
                utas: a.utas || "",
                turul: a.turul || "",
                khayag: a.khayag || "",
                ovog: a.ovog || "",
                talbainDugaar: Array.isArray(a.talbainDugaar)
                  ? a.talbainDugaar.join(", ")
                  : a.talbainDugaar || "",
                gereeniiDugaar: Array.isArray(a.gereenuud)
                  ? a.gereenuud
                      .map((g) => g.gereeniiDugaar)
                      .filter(Boolean)
                      .join(", ")
                  : "",
                ...a,
              };

              for (const [key, value] of Object.entries(clientData)) {
                if (value !== null && value !== undefined) {
                  zagvar = zagvar?.replace(
                    new RegExp(`&lt;${key}&gt;`, "g"),
                    String(value)
                  );
                }
              }

              mailuud.push({
                mail: a.mail,
                content: zagvar,
              });
            }
          });
        }

        if (mailuud.length > 0) {
          setLoading(true);

          try {
            const { data } = await uilchilgee(token).post(
              `/mailOlnoorIlgeeye`,
              {
                subject: title,
                mailuud,
                todorkhoilolt: todorkhoilolt,
              }
            );

            if (data.success === true) {
              notification.success({
                message: t("И-мэйл Амжилттай илгээлээ"),
              });
            }
          } catch (e) {
            aldaaBarigch(e);
          } finally {
            setLoading(false);
          }
        } else {
          notification.warning({
            message: t("И-мэйл хаягтай харилцагч олдсонгүй"),
          });
        }
      } else {
        notification.warning({
          message: t("Мэдэгдэл оруулна уу"),
        });
      }
    } else {
      notification.warning({
        message: t("Гарчиг оруулна уу"),
      });
    }
  }

  function send() {
    switch (turul) {
      case "Тодорхойлолт":
        mailIlgeeye();
        break;
    }
  }
  console.log(content);
  function smsZagvarNemya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>
        <div className="dark:text-[#E5E7EB]"> {t("Хаах")}</div>
      </Button>,
      <Button
        type="primary "
        onClick={() => ref.current.khadgalya(setWaiting(true))}
      >
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: `${data?.turul}`,
      icon: <FileExcelOutlined />,
      content: (
        <Burtgel
          ref={ref}
          setWaiting={setWaiting}
          data={data}
          value={content}
          token={token}
          turul={turul}
          barilgiinId={barilgiinId}
          onRefresh={mailiinZagvarMutate}
          medegdelZagvar={mailiinZagvarGaralt}
        />
      ),
      footer,
      width: 800,
      height: 500,
      bodyStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    });
  }
  function tuukhDelgerengui(data) {
    const read = true;
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>
        <div className="dark:text-[#E5E7EB]"> {t("Хаах")}</div>
      </Button>,
    ];
    modal({
      title: "Дэлгэрэнгүй",
      icon: <FileExcelOutlined />,
      content: (
        <Burtgel
          ref={ref}
          read={read}
          data={data}
          value={data}
          setWaiting={setWaiting}
          token={token}
          turul={turul}
          barilgiinId={barilgiinId}
          onRefresh={mailiinZagvarMutate}
          medegdelZagvar={mailiinZagvarGaralt}
        />
      ),
      footer,
      width: 800,
      height: 500,
      bodyStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    });
  }

  function zagvarUstgaya(mur) {
    setWaiting(true);
    deleteMethod("mailiinZagvar", token, mur?._id)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setWaiting(false);
          notification.success({ message: t("Устгагдлаа") });
          mailiinZagvarMutate();
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setWaiting(false);
      });
  }
  console.log(mailtuukhmailtuukhJagsaalt);
  function zagvarSongokh(data) {
    setSongosonZagvar(data);
  }
  return (
    <Admin
      title="Тодорхойлолт"
      khuudasniiNer="todorkhoilolt"
      setTurulZagvar={setTurulZagvar}
      setNeesenEsekh={setNeesenEsekh}
      fixedZagvarNeegdsenEsekh={turulZagvar}
      className="overflow-hidden p-5 pb-12 md:p-4 md:pb-0 lg:h-auto"
      onSearch={(search) =>
        setKhariltsagchKhuudaslalt((a) => ({ ...a, search }))
      }
      tsonkhniiId="68c8bfe7727027f1008c6f3d"
      loading={waiting}
    >
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-xl">
            <div className="flex flex-col items-center space-y-4">
              <Spin size="large" />
              <div className="text-lg font-medium text-gray-700">
                И-мэйл илгээж байна...
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="box col-span-12 xl:col-span-3">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setTurulZagvar(!turulZagvar);
          }}
          className={`fixed z-50 rounded-full border bg-green-600 p-2 text-2xl text-white transition-all  duration-300 md:hidden ${
            turulZagvar === true
              ? "right-[2vw] top-[10vh]"
              : neesenEsekh
              ? "right-full top-[100vh]"
              : "right-5 top-[25vh]"
          }`}
        >
          {turulZagvar !== true ? (
            <SnippetsOutlined />
          ) : (
            <EyeInvisibleOutlined />
          )}
        </div>

        <div
          className={`fixed z-40 mt-5 h-full rounded-md border-2 border-green-500 bg-white shadow-md transition-all duration-300 md:static md:w-auto md:border-none md:bg-transparent md:shadow-none ${
            turulZagvar === true
              ? " right-[5vw] top-[10vh] w-[90vw] "
              : " -right-full top-[30vh] w-[90vw] "
          } flex-col p-2 font-medium  `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className=" flex w-full justify-end">
            <Select
              bordered={false}
              className="md:w-50 !h-[36px] w-full rounded-md  border-[1px] text-gray-800   dark:text-gray-200"
              style={{ textOverflow: "ellipsis" }}
              showSearch
              filterOption={(o) => o}
              allowClear={true}
              onChange={(e) => setSongogdsonKhariltsagch(e)}
              onSearch={(search) =>
                setKhariltsagchKhuudaslalt((a) => ({ ...a, search }))
              }
              placeholder="Харилцагч сонгох"
            >
              {jagsaalt?.map((data) => (
                <Select.Option
                  key={data?._id}
                  className="text-black dark:text-gray-200 "
                >
                  {data?.ner}{" "}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="mt-5 flex px-1 pb-2">
            <button
              className={`ml-auto cursor-pointer rounded-md bg-green-500 px-4 py-2 text-center text-white`}
              onClick={() =>
                turul === "Тодорхойлолт"
                  ? smsZagvarNemya()
                  : router.push(
                      "/khyanalt/todorkhoilolt/todorkhoiloltZasakh/new"
                    )
              }
            >
              {t("Загвар үүсгэх")}
            </button>
          </div>

          <div
            className={` h-full h-medegdelHariltsagchPhone overflow-hidden overflow-y-scroll xl:block`}
          >
            <p>Загварууд</p>
            {mailiinZagvarGaralt?.jagsaalt?.map((a) => (
              <div>
                {a.turul === turul ? (
                  <div
                    key={a.ner}
                    className={`intro-x relative mt-2 flex cursor-pointer items-center rounded-md border p-2 shadow-md hover:border-green-800 ${
                      activeItem === a._id
                        ? "border-green-800"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      zagvarSongokh(a);
                      setActiveItem(a._id);
                    }}
                  >
                    <div className="ml-2 mr-1 overflow-hidden">
                      <div className="flex items-center">
                        <div className="font-medium">{a.ner}</div>
                      </div>
                    </div>
                    <div className="ml-auto flex flex-row space-x-2">
                      <Popconfirm
                        title="Загвар устгах уу?"
                        okText={t("Тийм")}
                        cancelText={t("Үгүй")}
                        onConfirm={() => zagvarUstgaya(a)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-black dark:bg-gray-800 dark:text-black">
                          <DeleteOutlined style={{ color: "red" }} />
                        </div>
                      </Popconfirm>
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-white dark:bg-gray-800"
                        onClick={() =>
                          turul === "Тодорхойлолт"
                            ? smsZagvarNemya(a)
                            : router.push(
                                `/khyanalt/todorkhoilolt/todorkhoiloltZasakh/${a._id}`
                              )
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
      </div>
      {!!songogdsonKhariltsagch ? (
        <div className="box jusity-between relative col-span-12 flex h-full min-h-[70vh] flex-col lg:col-span-6 lg:mt-0 xl:col-span-6 xl:h-H7HalfRem">
          <div
            className="mt-5 w-full space-y-2 p-2"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            {songosonZagvar && (
              <div>
                <Burtgel
                  ref={burtgelRef}
                  value={content}
                  data={songosonZagvar}
                  turul={turul}
                  onChange={setContent}
                  onTextChange={onTextChange}
                  height={500}
                />
              </div>
            )}
          </div>

          <div style={{ display: "none" }}>
            <div
              ref={printRef}
              style={{
                height: "100vh",
                position: "relative",
                paddingTop: "5rem",
                paddingLeft: "7.3rem",
                paddingRight: "3rem",
                paddingBottom: "3.54rem",
                fontSize: "12px",
                lineHeight: "1.5",
                fontFamily: "Arial, sans-serif",
                color: "#000",
              }}
            >
              <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <h2
                  style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}
                >
                  {turul || "Тодорхойлолт"}
                </h2>
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: printContent || getCurrentContent(),
                }}
                style={{
                  minHeight: "200px",
                  wordWrap: "break-word",
                }}
              />
              {barilga?.gariinUseg && (
                <img
                  src={`${url}/file?path=gariinUseg/${barilga.gariinUseg}`}
                  style={{
                    position: "absolute",
                    bottom: "300px",
                    right: "380px",
                    width: 180,
                    height: 140,
                    zIndex: 100,
                    opacity: 0.65,
                  }}
                  alt="gariinUseg"
                />
              )}
              {barilga?.tamga && (
                <img
                  src={`${url}/file?path=tamga/${barilga.tamga}`}
                  style={{
                    position: "absolute",
                    bottom: "300px",
                    right: "260px",
                    width: 200,
                    height: 160,
                    opacity: 0.65,
                  }}
                  alt="tamga"
                />
              )}
            </div>
          </div>
          {!!songogdsonKhariltsagch && !!songosonZagvar && (
            <div className="dark:border-dark-5 flex flex-col border-b border-gray-200 px-5 py-4 sm:flex-row">
              <div className="flex w-full justify-end">
                <div className="m-2">
                  <Button
                    type="primary"
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                  >
                    Хэвлэх
                  </Button>
                </div>
                <div className="m-2">
                  <Button
                    type="primary"
                    onClick={send}
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? "Илгээж байна..." : "Илгээх"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`box mt-0 hidden h-full min-h-[70vh] items-center lg:col-span-6 lg:mt-0 xl:col-span-6 xl:flex xl:h-H7HalfRem ${
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
              <div className="font-medium">{t("Өдрийн мэнд")}</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">
                {t("Та тодорхойлолт гаргах  харилцагчаа сонгоно уу.")}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="box jusity-between relative  col-span-3 flex h-full min-h-[70vh] flex-col overflow-y-auto p-2 lg:col-span-6 lg:mt-0 xl:col-span-3 xl:h-H7HalfRem">
        <div className="font-18 mb-2">Тодорхойлолт авсан түүх</div>
        <div className="h-full">
          {[...mailtuukhmailtuukhJagsaalt]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((mur, index) => (
              <div
                key={index}
                className="mb-3 rounded border border-gray-100 bg-green-600 p-2 text-gray-200"
              >
                <p className="font-medium">Харилцагч: {mur?.ner}</p>
                <p className="text-sm text-gray-100">
                  И-мэйл: {mur?.mailuud[0]?.mail}
                </p>
                <p className="text-sm text-gray-100">
                  Утас: {mur?.utas?.join(",")}
                </p>
                <p className="text-sm text-gray-100">
                  Тодорхойлолт өгсөн ажилтан: {mur?.maililgeesenAjiltniiNer}
                </p>
                <p className="text-sm text-gray-100">
                  Огноо:{" "}
                  {new Date(mur?.createdAt).toLocaleString("en-GB", {
                    timeZone: "Asia/Ulaanbaatar",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>

                <button
                  className="ml-auto flex cursor-pointer justify-end rounded-md bg-gray-200 px-4 py-1 text-center text-gray-800 hover:bg-gray-300"
                  onClick={() => {
                    printDataRef.current = mur?.mailuud[0]?.content;
                    handlePrint();
                  }}
                >
                  {t("Хэвлэх")}
                </button>
              </div>
            ))}
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Todorkhoilolt;
