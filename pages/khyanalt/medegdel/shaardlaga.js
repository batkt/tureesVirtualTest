//#region import
import Admin from "components/Admin";
import { useEffect, useState, useRef, useMemo } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useAuth } from "services/auth";
import useMailiinZagvar from "hooks/useMailiinZagvar";
import {
  Button,
  Checkbox,
  Divider,
  Image,
  Input,
  message,
  notification,
  Spin,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ZagvarBurtgel from "components/pageComponents/medegdel/ZagvarBurtgel";
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh";
import deleteMethod from "tools/function/crud/deleteMethod";
import useSanalGomdol from "hooks/medegdel/useSanalGomdol";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import { modal } from "components/ant/Modal";
import Aos from "aos";
import TextArea from "antd/lib/input/TextArea";
import useOrder from "tools/function/useOrder";
import useJagsaalt from "hooks/useJagsaalt";
import { useRouter } from "next/router";
import getBase64 from "tools/function/getBase64";

//#endregion
export function uldegdeliinTurulKhurvuulya(turul) {
  var butsaahUtga = turul;
  switch (turul) {
    case "medegdel":
      butsaahUtga = "мэдэгдэл";
      break;
    case "gomdol":
      butsaahUtga = "гомдол";
      break;
    case "sanal":
      butsaahUtga = "санал";
      break;
  }

  return butsaahUtga;
}

var timeout = null;

function Khyanalt({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const { barilgiinId } = useAuth();
  const [turul, setTurul] = useState("App");
  const [khariltsagch, setKhariltsagch] = useState(null);
  const [davkhar, setDavkhar] = useState(null);
  const [content, setContent] = useState("");
  const [msj, onTextChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [turulZagvar, setTurulZagvar] = useState(false);

  const [kharakhZurgiinZam, setKharakhZurgiinZam] = useState(false);
  // const [songogdsonKhariltsagch, setsongogdsonKhariltsagch] = useState([]);
  /**Илгээх төрөл
   * enum {buunuur | davkharaar | avlagaar | gantsaar}
   *  */
  const [ilgeekhTurul, setIlgeekhTurul] = useState("gantsaar");
  const [tuluv, setTuluv] = useState("idevkhtei");
  const ref = useRef(null);
  function beforeUpload(file, callback) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    callback(file);
    return true;
  }

  const [zurag, setZurag] = useState();
  const [songogdsonKhariltsagch, setSongogdsonKhariltsagch] = useState([]);
  const query = useMemo(() => {
    return {
      barilgiinId,
    };
  }, [barilgiinId]);
  const khariltsagchiinMedeelel = useJagsaalt(
    "/khariltsagch",
    query,
    undefined,
    undefined,
    ["ner", "ovog", "utas"]
  );
  const { order } = useOrder({ createdAt: -1 });
  const shaardlagaQuery = useMemo(() => {
    return { turul: "shaardlaga" };
  }, [turul]);
  const { sonorduulga, sonorduulgaMutate, jagsaalt, nextSonorduulga } =
    useSanalGomdol(
      turul === "App" && token,
      khariltsagch?.khariltsagchiinId,
      shaardlagaQuery,
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

  function seeMore() {
    khariltsagchiinMedeelel.next();
  }

  function tamgaZuragKharakh(e, path) {
    setKharakhZurgiinZam(path);
    e.preventDefault();
    e.stopPropagation();
  }

  const ingeekhmSms = useMemo(() => {
    if (!khariltsagch) return msj;
    var utga = msj;
    for (const [key, value] of Object.entries(khariltsagch)) {
      utga = utga?.replace(new RegExp(`<${key}>`, "g"), value);
    }
    return utga;
  }, [khariltsagch, msj]);
  //#endregion

  async function appIlgeeye() {
    if (!!title) {
      if (content !== "") {
        if (songogdsonKhariltsagch.length > 0) {
          var khariu = { successCount: 0, failureCount: 0 };
          songogdsonKhariltsagch
            .filter((a) => !!a._id)
            .map((a, index, array) => {
              a.ovog = a.ovog || "";
              a.ner = a.ner || "";
              a.register = a.register || "";
              a.utas = a.utas || "";
              a.turul = a.turul || "";
              a.khayag = a.khayag || "";
              a.khayag = a.khayag || "";
              let body = msj;
              for (const [key, value] of Object.entries(a)) {
                body = body?.replace(new RegExp(`<${key}>`, "g"), value);
              }
              uilchilgee(token)
                .post(`/sanalKhadgalya`, {
                  firebaseToken: a?.firebaseToken,
                  khariltsagchiinId: a?._id,
                  barilgiinId: a.barilgiinId,
                  khariltsagchiinNer: a.ner,
                  zurgiinId: zurag,
                  zurguud: zurag,
                  turul: "shaardlaga",
                  title,
                  message: ingeekhmSms,
                })
                .then(({ data }) => {
                  zurag &&
                    uilchilgee(token).post("/confirmFile", {
                      filename: zurag,
                      path: "shaardlaga",
                    });
                  if (!!data?.successCount) khariu.successCount += 1;
                  else if (!!data?.failureCount) khariu.failureCount += 1;
                  if (index === array.length - 1) {
                    notification.success({
                      message: `Notification Амжилттай илгээлээ`,
                    });
                    setContent("");
                    setTitle("");
                    setZurag();
                    sonorduulgaMutate();
                  }
                });
              return;
            });
          return;
        }
        if (msj.length < 3600) {
          if (loading) {
            message.warning("Хүсэлт илгээгдсэн байна");
            return;
          }
          if (!!title) {
            khariltsagch.ovog = khariltsagch.ovog || "";
            khariltsagch.ner = khariltsagch.ner || "";
            khariltsagch.register = khariltsagch.register || "";
            khariltsagch.utas = khariltsagch.utas || "";
            khariltsagch.turul = khariltsagch.turul || "";
            khariltsagch.khayag = khariltsagch.khayag || "";
            khariltsagch.khayag = khariltsagch.khayag || "";
            setLoading(true);
            uilchilgee(token)
              .post(`/sanalKhadgalya`, {
                khariltsagchiinId: khariltsagch?._id,
                khariltsagchiinNer: khariltsagch?.ner,
                zurguud: zurag,
                turul: "shaardlaga",
                title,
                message: ingeekhmSms,
                firebaseToken: khariltsagch?.firebaseToken,
                barilgiinId: khariltsagch?.barilgiinId,
              })
              .then(({ data }) => {
                zurag &&
                  uilchilgee(token).post("/confirmFile", {
                    filename: zurag,
                    path: "shaardlaga",
                  });
                if (!!data?.successCount) khariu.successCount += 1;
                else if (!!data?.failureCount) khariu.failureCount += 1;
                if (index === array.length - 1) {
                  notification.success({
                    message: `Notification Амжилттай илгээлээ`,
                  });
                  setContent("");
                  setTitle("");
                  setZurag();
                  sonorduulgaMutate();
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
        } else {
          notification.warning({
            message: "Мэдэгдэл илгээх үсгийн тоо хэтэрсэн байна",
          });
        }
      } else {
        notification.warning({
          message: "Мэдэгдэл оруулна уу",
        });
      }
    } else {
      notification.warning({
        message: "Гарчиг оруулна уу",
      });
    }
  }

  function send() {
    if (!!title) {
      appIlgeeye();
    } else {
      notification.warning({ message: "Гарчиг заавал оруулна уу!" });
    }
  }
  function seen() {
    const seenList = [...jagsaalt, ...(sonorduulga?.jagsaalt || [])].filter(
      (a) => a.turul !== "medegdel" && a.kharsanEsekh !== true
    );
    if (seenList.length > 0) {
      const seenIds = seenList.map((a) => a._id);
      if (
        jagsaalt.filter(
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
            sonorduulga?.jagsaalt?.filter(
              (a) => a.turul !== "medegdel" && a.kharsanEsekh === false
            ).length > 0
          )
            sonorduulgaMutate();
        })
        .catch(aldaaBarigch);
    }
  }

  //#endregion
  function khariltsagchSongokh(mur) {
    if (khariltsagch === null) {
      setKhariltsagch(mur);
    } else setKhariltsagch(null);
    const index = songogdsonKhariltsagch.findIndex((a) => a._id === mur._id);
    index !== -1
      ? songogdsonKhariltsagch.splice(index, 1)
      : songogdsonKhariltsagch.push(mur);
    setSongogdsonKhariltsagch([...songogdsonKhariltsagch]);
  }
  return (
    <Admin
      title="Шаардлага"
      khuudasniiNer="shaardlaga"
      className=" overflow-hidden p-5 pb-14 md:p-4 md:pb-0 lg:h-auto"
      onSearch={(search) =>
        khariltsagchiinMedeelel.setKhuudaslalt((a) => ({ ...a, search }))
      }
      tsonkhniiId="61c2c68d1c2830c4e6f90ca5"
    >
      <div
        className="col-span-12 lg:col-span-6 xl:col-span-3 "
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className="box p-5 xl:block xl:h-H7HalfRem">
          <div className="relative w-full text-gray-700   dark:text-gray-300">
            <input
              type="text"
              className="w-full rounded-md bg-gray-100 px-2  py-1 dark:bg-gray-700"
              placeholder="Хайх /Нэр, Регистр, Утас, Гэрээ, Талбай/"
              onChange={({ target }) => {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                  khariltsagchiinMedeelel.setKhuudaslalt((a) => ({
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

          <div className=" mt-2  flex cursor-pointer flex-row items-center space-x-2 rounded-md p-2  ">
            <Checkbox
              checked={
                khariltsagchiinMedeelel?.jagsaalt?.length ===
                songogdsonKhariltsagch.length
              }
              onChange={(e) => {
                if (e.target.checked === true)
                  setSongogdsonKhariltsagch([
                    ...khariltsagchiinMedeelel?.jagsaalt,
                  ]);
                else setSongogdsonKhariltsagch([]);
              }}
            >
              <p className="pl-3">Бүгдийг сонгох</p>
            </Checkbox>
          </div>

          <div className="hideScroll h-medegdelHariltsagchPhone overflow-y-auto lg:h-scrollH ">
            {khariltsagchiinMedeelel?.jagsaalt?.map((mur) => (
              <div
                className={`flex cursor-pointer flex-row items-center space-x-4 rounded-md p-2 ${
                  khariltsagch?._id === mur?._id
                    ? "rounded-l-full bg-green-100 shadow-lg dark:bg-green-500 "
                    : ""
                } `}
                onClick={() => khariltsagchSongokh(mur)}
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
                      setSongogdsonKhariltsagch([...songogdsonKhariltsagch]);
                    }}
                  />
                </div>
                <div className="image-fit relative h-10 w-10 flex-none rounded-full ">
                  <img
                    alt="profileZurag"
                    className="rounded-full"
                    src={
                      ((mur.register?.replace(/^\D+/g, "") % 100) / 10) % 2 < 1
                        ? "/profileFemale.svg"
                        : "/profile.svg"
                    }
                  />
                </div>
                <div className="flex w-full justify-between truncate text-center text-xs text-gray-600 ">
                  <div> {mur?.ner}</div>
                  <div>{mur?.utas}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {khariltsagch || songogdsonKhariltsagch.length > 0 ? (
        <div className="box col-span-12 mt-0 flex h-full min-h-[70vh] flex-col lg:col-span-6 lg:mt-0 xl:col-span-9 xl:h-H7HalfRem">
          {songogdsonKhariltsagch.length <= 1 ? (
            <div className="dark:border-dark-5 flex flex-col border-b border-gray-200 px-5 py-4 sm:flex-row">
              {khariltsagch && (
                <div className="flex items-center">
                  <div className="mr-3 text-lg xl:hidden">
                    <ArrowLeftOutlined
                      onClick={() => khariltsagchSongokh(khariltsagch)}
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
                      {khariltsagch?.utas.length > 0 ? (
                        (console.log(khariltsagch.utas),
                        (
                          <div className="flex gap-1 ">
                            {khariltsagch?.utas.map((a, i) => (
                              <div key={i}>
                                {a}
                                {i !== khariltsagch.utas.length - 1 && ","}
                              </div>
                            ))}
                            <span className="mx-1">•</span> {turul}
                          </div>
                        ))
                      ) : (
                        <div className="flex">
                          <div>{khariltsagch?.utas}</div>
                          <span className="mx-1">•</span> {turul}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
          <div>
            {songogdsonKhariltsagch.length > 1 ? (
              <div
                className="col-span-12 space-y-10 overflow-auto rounded-r-xl  bg-white pb-10 dark:bg-[#121826] lg:col-span-6 lg:mt-5 xl:col-span-6 xl:h-H7HalfRem"
                style={{ height: "calc(100vh - 28rem)" }}
              >
                <div
                  className={`box flex h-full items-center ${
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
                      <p>
                        Сонгогдсон {songogdsonKhariltsagch.length} харилцагч
                        байна.
                      </p>
                      <div className="mt-1 text-gray-600 dark:text-gray-300">
                        Та шаардлага илгээнэ үү.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="col-span-12 flex min-h-[30vh] flex-col-reverse items-center overflow-auto rounded-r-xl px-10 pb-10 dark:bg-[#121826] lg:col-span-6 lg:mt-5 xl:col-span-6 xl:h-H7HalfRem"
                style={{ maxHeight: "calc(100vh - 32rem)" }}
                onScroll={(e) => {
                  if (
                    e.target.scrollHeight + e.target.scrollTop - 1 <
                      e.target.clientHeight &&
                    !!jagsaalt
                  ) {
                    nextSonorduulga();
                  }
                }}
              >
                {jagsaalt?.map((mur) =>
                  mur.khariltsagchiinId === khariltsagch?._id ? (
                    <div className="my-5 flex w-full items-center ">
                      <div className="relative w-10/12  rounded-lg bg-green-50 p-2  dark:bg-[#121826] sm:w-full">
                        <div className="flex flex-row flex-wrap items-center justify-between  ">
                          <div className="text-sm text-green-600">
                            Гарчиг: {mur.title}
                          </div>
                          {mur?.tuluv === 0 ? (
                            <div className="rounded-lg border-[1px] bg-red-500 p-1 text-white">
                              {" "}
                              Хүлээж аваагүй{" "}
                            </div>
                          ) : (
                            <div className="rounded-lg border-[1px] bg-green-400 p-1 text-white ">
                              {" "}
                              Хүлээж авсан{" "}
                            </div>
                          )}
                        </div>
                        <div className="flex">
                          <div className="w-full">
                            <div className="font-semibold">
                              Шаардлага: {mur.message}
                            </div>

                            <div>
                              {mur.zurguud.map((a, i) => (
                                <Image
                                  key={i}
                                  width={75}
                                  src={`${url}/file?path=shaardlaga/${a}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-11 w-11 rounded-full  bg-green-300 dark:bg-gray-800">
                        <img
                          src="/profile.svg"
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                )}
              </div>
            )}
          </div>

          <div
            className="w-full  space-y-3 px-3"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <Input
              rules={[{ required: true, message: "Гарчиг заавал оруулна уу!" }]}
              className="space-y-3"
              placeholder="Гарчиг"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
            <div className="space-y-3">
              <Upload
                showUploadList={false}
                multiple={false}
                name="file"
                maxCount={1}
                action={`${url}/upload`}
                method="POST"
                onChange={(v) => setZurag(v.file.response)}
                beforeUpload={(file) => {
                  function handleChange(img) {
                    getBase64(img, (img) => (ref.current.src = img));
                    ref.current.classList.remove("hidden");
                  }
                  return beforeUpload(file, handleChange);
                }}
              >
                <div className="flex flex-row space-x-1">
                  <div className="flex flex-row space-x-1">
                    {!zurag && (
                      <Button icon={<UploadOutlined />}>зураг оруулах</Button>
                    )}
                    <img ref={ref} width={200} src="" className="hidden" />
                    {!!zurag && <Button icon={<EditOutlined />}></Button>}
                  </div>
                </div>
              </Upload>
              <ZagvarUusgekh
                change={setContent}
                value={content}
                onTextChange={onTextChange}
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end space-x-2 p-2">
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
          className={`box col-span-12 flex h-[40vh] items-center lg:col-span-6 lg:h-full xl:col-span-9`}
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
                Та шаардлага илгээх харилцагчаа сонгоно уу.
              </div>
            </div>
          </div>
        </div>
      )}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Khyanalt;
