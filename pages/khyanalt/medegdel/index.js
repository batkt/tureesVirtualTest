import Admin from "components/Admin";
import { useEffect, useState, useRef, useMemo } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { Tooltip, Tag } from "antd";
import { useAuth } from "services/auth";
import _ from "lodash";
import useMailiinZagvar from "hooks/useMailiinZagvar";
import Modal from "antd/lib/modal/Modal";
import { toast } from "sonner";
import {
  Button,
  Checkbox,
  Input,
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
} from "@ant-design/icons";
import moment from "moment";
import router from "next/router";
import ZagvarBurtgel from "components/pageComponents/medegdel/ZagvarBurtgel";
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh";
import deleteMethod from "tools/function/crud/deleteMethod";
import createMethod from "tools/function/crud/createMethod";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch, url, socket } from "services/uilchilgee";
import { modal } from "components/ant/Modal";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";
import useOrder from "tools/function/useOrder";
import useKhariltsagchDavkhraarAvya from "hooks/useKhariltsagchDavkhraarAvya";
import { useTranslation } from "react-i18next";

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
  msjTuukh,
}) {
  const { data, mutate } = useSWR(
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
  useEffect(() => {
    mutate();
  }, [msjTuukh]);
  return (
    <div className="ml-6 flex flex-col-reverse text-center xl:flex-col xl:text-center">
      <span>{text}</span> <span className="font-medium ">{data || 0}</span>
    </div>
  );
}

function Khyanalt({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const { baiguullaga, barilgiinId } = useAuth();
  const { t } = useTranslation();
  const [khariltsagch, setKhariltsagch] = useState(null);
  const [davkhar, setDavkhar] = useState(null);
  const [content, setContent] = useState();
  const [ner, setNer] = useState();
  const [msj, onTextChange] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState();

  const [turulZagvar, setTurulZagvar] = useState(false);
  const [geree, setGeree] = useState(null);
  const [tuluv, setTuluv] = useState("Бүгд");
  const [waiting, setWaiting] = useState(false);
  const ref = useRef(null);
  const [zurag, setZurag] = useState();
  const [songogdsonKhariltsagch, setSongogdsonKhariltsagch] = useState([]);
  const [turul, setTurul] = useState("SMS");

  const khariltsagchiinQuery = useMemo(() => {
    return {
      barilgiinId,
    };
  }, [barilgiinId, tuluv]);

  const { setKhariltsagchKhuudaslalt, jagsaalt } = useKhariltsagchDavkhraarAvya(
    token,
    khariltsagchiinQuery,
    davkhar,
    tuluv
  );

  const { mailiinZagvarGaralt, mailiinZagvarMutate } = useMailiinZagvar(
    token,
    turul
  );
  const [neesenEsekh, setNeesenEsekh] = useState(false);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (baiguullaga?._id) {
       const clientSocket = socket();
       clientSocket.on(`mailProgress-${baiguullaga._id}`, (data) => {
         setProgress(data);
       });
       return () => clientSocket.disconnect();
    }
  }, [baiguullaga]);

  useEffect(() => {
    setSongogdsonKhariltsagch([]);
  }, [tuluv]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (loading) {
        if (!window.confirm(t("Мэдэгдэл илгээгдэж дуусаагүй байна. Та хуудсаа солихдоо итгэлтэй байна уу?"))) {
          router.events.emit('routeChangeError');
          throw `Route change to ${url} was aborted.`;
        }
      }
    };

    const handleBeforeUnload = (e) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [loading, t]);

  const query = useMemo(() => {
    return {
      turul: {
        $in: [
          "medegdel",
          "Mail",
          "SMS",
          "App",
          "sanal",
          "gomdol",
        ],
      },
      khuleenAvagchiinId: khariltsagch?._id,
    };
  }, [khariltsagch]);

  const { order } = useOrder({ createdAt: -1 });
  const medegdelAvya = useJagsaalt("/sonorduulga", query, order, undefined);

  const khariltsagchiinMsjTuukhKharakh = useMemo(() => {
    return { barilgiinId: barilgiinId, dugaar: khariltsagch?.utas };
  });

  const msjTuukh = useJagsaalt(
    "/msgTuukh",
    khariltsagchiinMsjTuukhKharakh,
    order
  );

  useEffect(() => {
    if (khariltsagch?._id) {
      uilchilgee(token)
        .get(`/geree`, {
          params: { khariltsagchiinId: khariltsagch._id },
        })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setGeree(data[0]);
          } else {
            setGeree(null);
          }
        })
        .catch((error) => {
          aldaaBarigch(error);
          setGeree(null);
        });
    } else {
      setGeree(null);
    }
  }, [khariltsagch, token]);

  useEffect(() => {
    if (neesenEsekh === true) {
      setTurulZagvar(false);
    }
  }, [neesenEsekh]);

  const ingeekhmSms = useMemo(() => {
    // If msj is empty, try to extract plain text from content (HTML)
    let textToUse = msj;
    if (!textToUse && content) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      textToUse = tempDiv.textContent || tempDiv.innerText || "";
    }

    if (!khariltsagch) return textToUse || "";
    var utga = textToUse || "";

    // Deep flatten function
    const flattenObject = (obj, prefix = "", result = {}) => {
      if (!obj || typeof obj !== "object") return result;

      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];

          if (
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            !(value instanceof Date)
          ) {
            // Recursively flatten nested objects
            flattenObject(value, key, result);
          } else if (!Array.isArray(value)) {
            // Add with original key name (no prefix)
            result[key] = value;
          }
        }
      }

      return result;
    };

    const khariltsagchData = flattenObject(khariltsagch || {});
    const gereeData = flattenObject(geree || {});

    const allData = { ...khariltsagchData, ...gereeData };

    for (const [key, value] of Object.entries(allData)) {
      if (value !== null && value !== undefined && value !== "") {
        const regex = new RegExp(`<${key}>`, "g");
        utga = utga?.replace(regex, value);
      }
    }

    return utga;
  }, [khariltsagch, geree, msj, content]);

  async function appIlgeeye() {
    if (!!title) {
      if (content !== "") {
        if (songogdsonKhariltsagch.length > 0) {
          var khariu = { successCount: 0, failureCount: 0 };
          songogdsonKhariltsagch
            .filter((a) => !!a._id)
            .map((a, index, array) => {
              let body = msj;
              a.ovog = a.ovog || "";
              a.ner = a.ner || "";
              a.register = a.register || "";
              a.utas = a.utas || "";
              a.turul = a.turul || "";
              a.khayag = a.khayag || "";
              a.khayag = a.khayag || "";
              for (const [key, value] of Object.entries(a)) {
                body = body?.replace(new RegExp(`<${key}>`, "g"), value);
              }
              uilchilgee(token)
                .post(`/sonorduulgaIlgeeye`, {
                  firebaseToken: a?.firebaseToken,
                  khariltsagchiinId: a?._id,
                  barilgiinId: a.barilgiinId,
                  khariltsagchiinNer: a.ner,
                  zurgiinId: a.zurag,
                  medeelel: { title, body: ingeekhmSms },
                })
                .then(({ data }) => {
                  if (!!data?.successCount) khariu.successCount += 1;
                  else if (!!data?.failureCount) khariu.failureCount += 1;
                  if (index === array.length - 1) {
                    toast.success(t("Notification Амжилттай илгээлээ"));
                    setLoading(false);
                    onTextChange("");
                    setContent("");
                    setTitle("");
                    medegdelAvya.mutate();
                    setNer(undefined);
                  }
                });
              return;
            });
          return;
        }
        if (msj.length < 3600) {
          if (loading) {
            toast.warning(t("Хүсэлт илгээгдсэн байна"));
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
                  toast.success(t("Notification Амжилттай илгээлээ"));
                  onTextChange("");
                  setContent("");
                  setTitle("");
                  setNer(undefined);
                  medegdelAvya.mutate();
                  setLoading(false);
                } else if (!!data?.failureCount) {
                  toast.error(_.get(data, "results.0.error.message"), {
                    description: _.get(data, "results.0.error.code"),
                  });
                  setLoading(false);
                }
              })
              .catch((e) => {
                setLoading(false);
                aldaaBarigch(e);
              });
          } else {
            toast.warning(t("Гарчиг заавал оруулна уу"));
          }
        } else {
          toast.warning(t("Мэдэгдэл илгээх үсгийн тоо хэтэрсэн байна"));
        }
      } else {
        toast.warning(t("Мэдэгдэл оруулна уу"));
      }
    } else {
      toast.warning(t("Гарчиг оруулна уу"));
    }
  }

  async function msgIlgeeye() {
    if (content !== "") {
      if (loading) {
        toast.warning(t("Хүсэлт илгээгдсэн байна"));
        return;
      }
      var msgnuud = [];
      // Extract plain text from content (HTML) if msj is empty
      let textToUse = msj;
      if (!textToUse && content) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        textToUse = tempDiv.textContent || tempDiv.innerText || "";
      }

      if (songogdsonKhariltsagch.length > 0)
        songogdsonKhariltsagch.map((a) => {
          var text = textToUse || "";
          a.ovog = a.ovog || "";
          a.ner = a.ner || "";
          a.register = a.register || "";
          a.utas = a.utas || "";
          a.turul = a.turul || "";
          a.khayag = a.khayag || "";
          a.khayag = a.khayag || "";
          for (const [key, value] of Object.entries(a)) {
            text = text?.replace(new RegExp(`<${key}>`, "g"), value);
          }
          if (_.isArray(a.utas))
            a.utas.map((to) =>
              msgnuud.push({
                to,
                text,
                khariltsagchiinId: a._id,
                khariltsagchiinNer: a.ner,
                barilgiinId: a.barilgiinId,
              })
            );
          else
            msgnuud.push({
              to: a.utas,
              text,
              khariltsagchiinId: a._id,
              khariltsagchiinNer: a.ner,
              barilgiinId: a.barilgiinId,
            });
        });
      else if (!!khariltsagch) {
        // Ensure ingeekhmSms is not empty - extract from content if needed
        let finalText = ingeekhmSms || "";
        if (!finalText && content) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = content;
          finalText = tempDiv.textContent || tempDiv.innerText || "";
        }

        if (_.isArray(khariltsagch?.utas))
          khariltsagch?.utas.map((to) =>
            msgnuud.push({
              to,
              text: finalText,
              khariltsagchiinId: khariltsagch._id,
              khariltsagchiinNer: khariltsagch.ner,
              barilgiinId: khariltsagch.barilgiinId || barilgiinId,
            })
          );
        else
          msgnuud.push({
            to: khariltsagch?.utas,
            text: finalText,
            khariltsagchiinId: khariltsagch._id,
            khariltsagchiinNer: khariltsagch.ner,
            barilgiinId: khariltsagch.barilgiinId || barilgiinId,
          });
      } else {
        toast.warning(t("Та SMS илгээх гэрээгээ сонгоно уу"));
        return;
      }
      if (!(msgnuud.length > 0)) {
        toast.warning(t("Илгээх мэдээлэл байхгүй байна"));
        return;
      }

      setLoading(true);
      uilchilgee(token)
        .post(`/msgIlgeeye`, { barilgiinId, msgnuud })
        .then(({ data }) => {
          if (data && data[0].Result === "SUCCESS") {
            toast.success(t("SMS Амжилттай илгээлээ"));
            setContent("");
            setTitle("");
            msjTuukh.mutate();
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
          aldaaBarigch(e);
        });
    } else {
      toast.warning(t("Мэдэгдэл оруулна уу"));
    }
  }
  async function mailIlgeeye() {
    if (!!title) {
      if (content !== " " && content !== "") {
        const mailuud = [];
        if (songogdsonKhariltsagch?.length > 0) {
          songogdsonKhariltsagch.forEach((a) => {
            var zagvar = content;
            if (a.turul === "ААН") {
              a.ovog = "";
            }
            a.ner = a.ner || "";
            a.register = a.register || "";
            a.utas = a.utas || "";
            a.turul = a.turul || "";
            a.khayag = a.khayag || "";

            for (const [key, value] of Object.entries(a)) {
              zagvar = zagvar?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                value
              );
            }
            if (!!a.mail) {
              mailuud.push({
                mail: a.mail,
                content: zagvar,
                khariltsagchiinId: a._id,
                khariltsagchiinNer: a.ner,
                barilgiinId: a.barilgiinId,
              });
            }
          });
        }

        if (mailuud.length === 0) {
          toast.warning(t("Сонгосон харилцагчдад майл хаяг байхгүй байна"));
          return;
        }

        setProgress(null);
        setLoading(true);
        uilchilgee(token)
          .post(`/mailOlnoorIlgeeye`, {
            subject: title,
            mailuud,
            turul: "Mail",
          })
          .then(({ data }) => {
            if (data === "Amjilttai" || data?.result === "Amjilttai") {
              if (data?.failedMails && data.failedMails.length > 0) {
                toast.error(
                  <div>
                    <div className="font-bold">Амжилтгүй илгээлт: {data.failedMails.length}</div>
                    <div className="mt-1 max-h-40 overflow-y-auto text-xs">
                      {data.failedMails.map((a, i) => (
                        <div key={i} className="mb-1 border-b border-gray-300 pb-1 text-gray-800 dark:border-gray-600 dark:text-gray-200">
                          <div className="font-semibold">{a.ner} ({a.mail})</div>
                          <div className="text-red-500">{a.aldaa}</div>
                        </div>
                      ))}
                    </div>
                  </div>,
                  { duration: 10000 }
                );
              } else {
                toast.success(t("И-мэйл Амжилттай илгээлээ"));
              }

              if (khariltsagch && songogdsonKhariltsagch.length === 1) {
                medegdelAvya.jagsaalt.unshift({
                  khariltsagchiinId: khariltsagch._id,
                  barilgiinId: khariltsagch.barilgiinId,
                  khariltsagchiinNer: khariltsagch.ner,
                  title,
                  message: ingeekhmSms,
                  turul: "Mail",
                  createdAt: new Date(),
                });
              }

              setContent("");
              setTitle("");
              setNer("");
              setSongogdsonKhariltsagch([]);
              medegdelAvya.mutate();
              setLoading(false);
            } else {
              toast.error(t("И-мэйл илгээхэд алдаа гарлаа"));
              setLoading(false);
            }
          })
          .catch((e) => {
            setLoading(false);
            aldaaBarigch(e);
            toast.error(t("И-мэйл илгээхэд алдаа гарлаа"), {
              description: e?.response?.data?.message || e.message,
            });
          });
      } else {
        toast.warning(t("Мэдэгдэл оруулна уу"));
      }
    } else {
      toast.warning(t("Гарчиг оруулна уу"));
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
    let modalInstance;

    const footer = [
      <Button onClick={() => ref.current.khaaya()}>
        <div className="dark:text-[#E5E7EB]"> {t("Хаах")}</div>
      </Button>,
      <Button
        type="primary"
        onClick={() => {
          const formData = ref.current.getFormData();

          if (!formData?.ner || formData.ner.trim() === "") {
            toast.warning(t("Гарчиг оруулна уу"));
            return;
          }

          if (!formData?.mail || formData.mail.trim() === "") {
            toast.warning(t("Агуулга оруулна уу"));
            return;
          }

          ref.current.khadgalya(setWaiting(true));
        }}
      >
        {t("Хадгалах")}
      </Button>,
    ];

    modalInstance = modal({
      title: `${turul} ${t("Загвар үүсгэх")}`,
      icon: <FileExcelOutlined />,
      width: 1200,
      content: (
        <ZagvarBurtgel
          ref={ref}
          onClose={() => modalInstance.destroy()}
          setWaiting={setWaiting}
          data={data}
          token={token}
          turul={turul}
          barilgiinId={barilgiinId}
          onRefresh={mailiinZagvarMutate}
          medegdelZagvar={mailiinZagvarGaralt}
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
          toast.success(t("Устгагдлаа"), {
            description: `"${mur?.ner}" ${t("загвар амжилттай устгагдлаа")}`,
          });
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
        medegdelAvya?.setKhuudaslalt((a) => {
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
            medegdelAvya?.mutate();
        })
        .catch(aldaaBarigch);
    }
  }

  function davkharuudSongokh(e) {
    setDavkhar(e);
  }

  function turulSongokh(mur) {
    setTurul(mur);
    setContent("");
    setTitle("");
    setNer("");
  }

  function onScroll(e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      seen();
    }, 300);
  }

  function zagvarSongokh(a) {
    setTitle(a.ner);
    setContent(a.mail);
    setNer(a.ner);
  }

  function khariltsagchSongokh(mur) {
    let turHadgalakh = mur;
    const index = songogdsonKhariltsagch.findIndex((a) => a._id === mur._id);
    index !== -1
      ? (songogdsonKhariltsagch.splice(index, 1), (turHadgalakh = undefined))
      : songogdsonKhariltsagch.push(mur);
    setSongogdsonKhariltsagch([...songogdsonKhariltsagch]);
  }
  return (
    <Admin
      title="Мэдэгдэл"
      khuudasniiNer="medegdel"
      setTurulZagvar={setTurulZagvar}
      setNeesenEsekh={setNeesenEsekh}
      fixedZagvarNeegdsenEsekh={turulZagvar}
      className="overflow-hidden p-5 pb-12 md:p-4 md:pb-0 lg:h-auto"
      onSearch={(search) =>
        setKhariltsagchKhuudaslalt((a) => ({ ...a, search }))
      }
      tsonkhniiId="61c2c68d1c2830c4e6f90ca5"
      loading={waiting}
    >
      <div className="box col-span-12 xl:col-span-3">
        <div className="p-2" data-aos="fade-right" data-aos-duration="1000">
          <div className="rounded-md border p-2 shadow-md">
            <div className="grid grid-cols-3 gap-1 font-medium" role="tablist">
              {["SMS", "App", "Mail"].map((mur) => (
                <div
                  key={mur}
                  className={`flex-1 cursor-pointer rounded-md py-2 text-center transition-colors ${
                    turul === mur
                      ? "bg-green-500 text-white"
                      : "border-x hover:bg-green-500"
                  }`}
                  onClick={() => turulSongokh(mur)}
                >
                  {mur}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="mx-2 mt-2 grid grid-cols-12 items-center space-x-3 rounded-md border p-2 pl-3 shadow-md"
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="100"
        >
          <div className="col-span-6">
            <Select
              className="w-full"
              value={tuluv}
              onChange={setTuluv}
              defaultValue={undefined}
              style={{ width: "100%" }}
            >
              {[
                { key: 1, v: "Идэвхтэй" },
                { key: 0, v: "Идэвхгүй" },
                { key: undefined, v: "Бүгд" },
              ].map((a) => (
                <Select.Option key={String(a.key)} value={a.key}>
                  {t(a.v)}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="col-span-6">
            <Select
              mode="multiple"
              allowClear
              placeholder={t("Давхар сонгох")}
              onChange={(e) => davkharuudSongokh(e)}
              style={{ width: "100%" }}
            >
              {baiguullaga?.barilguud
                ?.find((a) => a._id === barilgiinId)
                ?.davkharuud.map((a) => (
                  <Select.Option key={a._id} value={a.davkhar} w="100px">
                    {a.davkhar}
                  </Select.Option>
                ))}
            </Select>
          </div>
        </div>
        {turul === "SMS" ? (
          <div
            className="mx-2 my-4 flex flex-row items-center justify-between rounded-md border p-2 px-10 shadow-md"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <div>
              <p className="rounded-md bg-white text-sm dark:bg-gray-900">
                SMS
              </p>
            </div>
            <div>
              <IlgeesenToo
                msjTuukh={msjTuukh}
                barilgiinId={barilgiinId}
                baiguullagiinId={baiguullaga?._id}
                ekhlekhOgnoo={dateCount.yearStart}
                duusakhOgnoo={dateCount.yearEnd}
                token={token}
                text={t("Нийт")}
                turul={turul}
              />
            </div>
            <div>
              <IlgeesenToo
                msjTuukh={msjTuukh}
                barilgiinId={barilgiinId}
                baiguullagiinId={baiguullaga?._id}
                ekhlekhOgnoo={dateCount.monthStart}
                duusakhOgnoo={dateCount.monthEnd}
                token={token}
                text={t("Энэ сард")}
                turul={turul}
              />
            </div>
          </div>
        ) : null}
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
          className={`fixed z-40 mt-5 rounded-md border-2 border-green-500 bg-white shadow-md transition-all duration-300 md:static md:w-auto md:border-none md:bg-transparent md:shadow-none ${
            turulZagvar === true
              ? " right-[5vw] top-[10vh] w-[90vw] "
              : " -right-full top-[30vh] w-[90vw] "
          } flex-col p-2 font-medium  `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex px-1 pb-2">
            <p>
              {turul} {t("загвар")}
            </p>

            <button
              className={`ml-auto cursor-pointer rounded-md bg-green-500 px-4 py-2 text-center text-white`}
              onClick={() =>
                turul === "SMS"
                  ? smsZagvarNemya()
                  : turul === "App"
                  ? smsZagvarNemya()
                  : router.push("/khyanalt/medegdel/mailMedegdel/new")
              }
            >
              {t("Загвар үүсгэх")}
            </button>
          </div>
          <div
            className={` h-medegdelHariltsagchPhone overflow-hidden overflow-y-scroll xl:block`}
          >
            {mailiinZagvarGaralt?.jagsaalt?.map((a) => (
              <div>
                {a.turul === turul ? (
                  <div
                    key={a.ner}
                    className="intro-x relative mt-2 flex cursor-pointer items-center rounded-md border p-2 shadow-md"
                    onClick={() => zagvarSongokh(a)}
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
                        okText={t("Тийм")}
                        cancelText={t("Үгүй")}
                        onConfirm={() => zagvarUstgaya(a)}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-red-500 dark:bg-gray-800 dark:text-red-500">
                          <DeleteOutlined />
                        </div>
                      </Popconfirm>
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 fill-current p-2 text-blue-500 dark:bg-gray-800 dark:text-blue-400"
                        onClick={() =>
                          turul === "SMS" || turul === "App"
                            ? smsZagvarNemya(a)
                            : router.push(
                                `/khyanalt/medegdel/mailMedegdel/${a._id}`
                              )
                        }
                      >
                        <EditOutlined />
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
      <div
        className={`col-span-12 lg:col-span-6 xl:col-span-3`}
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <div className={`box p-5 xl:block`}>
          <div className="relative w-full text-gray-700 dark:text-gray-300">
            <input
              type="text"
              className="block w-full rounded-md border border-slate-300 bg-white  px-3 py-1 text-sm shadow-sm focus:border-[#8aaaef] focus:outline-none focus:ring-1
              focus:ring-[#8aaaef] dark:bg-gray-500 "
              placeholder={t("Хайх /Нэр, Регистр, Утас, Гэрээ, Талбай/")}
              onChange={({ target }) => {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                  setKhariltsagchKhuudaslalt((a) => ({
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
          <div className="mt-2 flex cursor-pointer flex-row items-center justify-between space-x-4 space-y-2 rounded-md p-2 ">
            <Checkbox
              checked={jagsaalt?.length === songogdsonKhariltsagch.length}
              onChange={(e) => {
                if (e.target.checked === true)
                  setSongogdsonKhariltsagch([...jagsaalt]);
                else setSongogdsonKhariltsagch([]);
              }}
            >
              <p className="pl-3">{t("Бүгдийг сонгох")}</p>
            </Checkbox>
            <div>
              {songogdsonKhariltsagch.length}/{jagsaalt?.length}
            </div>
          </div>
          <div className="scrollbar-hidden h-medegdelHariltsagchPhone overflow-y-auto lg:h-scrollH">
            {jagsaalt?.map((mur) => (
              <div>
                {!!mur._id ? (
                  <div
                    className={`flex cursor-pointer flex-row items-center space-x-4  rounded-md p-2 ${
                      khariltsagch?._id === mur?._id
                        ? "rounded-l-full bg-green-100 shadow-lg  dark:bg-green-500 "
                        : ""
                    } `}
                    key={mur?._id}
                    onClick={() => khariltsagchSongokh(mur)}
                  >
                    <div>
                      <Checkbox
                        onClick={(e) => e.stopPropagation()}
                        checked={
                          songogdsonKhariltsagch.findIndex(
                            (a) => a._id === mur._id
                          ) !== -1
                        }
                        onChange={(e) => {
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
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="text-xs">{mur?.ner}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                        {Array.isArray(mur?.utas) && mur.utas.length > 0 ? (
                          <div className="flex w-full justify-end gap-1">
                            {mur.utas.map((a, i) => (
                              <div key={i}>
                                {a}
                                {i !== mur.utas.length - 1 && ","}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex w-full justify-end">
                            <div>
                              {typeof mur?.utas === "string" ? mur.utas : ""}
                            </div>
                          </div>
                        )}

                        {!!mur?.talbainDugaar ? (
                          <Tooltip
                            title={
                              <div className="flex flex-wrap gap-2">
                                {mur?.talbainDugaar?.map((dugaar, index) => (
                                  <Tag
                                    key={index}
                                    color="transparent"
                                    className="m-0"
                                  >
                                    {dugaar}
                                  </Tag>
                                ))}
                              </div>
                            }
                            overlayClassName="max-w-[300px]"
                          >
                            <div className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md bg-green-100 px-3 py-2 text-xs transition hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 sm:text-sm">
                              <div className="max-w-[120px] truncate text-gray-800 dark:text-white">
                                {mur?.talbainDugaar?.[0] ?? "—"}
                              </div>
                              <div className="max-w-[140px] truncate text-gray-600 dark:text-gray-300">
                                {mur?.talbainDugaar?.length > 1
                                  ? `+${mur.talbainDugaar.length - 1}`
                                  : ""}
                              </div>
                            </div>
                          </Tooltip>
                        ) : (
                          <div className="flex items-center justify-center rounded-lg bg-blue-500 px-2 py-1 text-xs text-gray-200 dark:bg-blue-700 dark:text-white">
                            <div>{mur?.talbainDugaar}</div>
                          </div>
                        )}
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
      {khariltsagch || songogdsonKhariltsagch.length > 0 ? (
        <div className="box relative col-span-12 mt-0 flex h-full min-h-[70vh] flex-col lg:col-span-6 lg:mt-0 xl:col-span-6 xl:h-H7HalfRem">
          {songogdsonKhariltsagch.length < 2 ? (
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
                        <div className="flex gap-1 ">
                          {khariltsagch?.utas.map((a, i) => (
                            <div key={i}>
                              {a}
                              {i !== khariltsagch.utas.length - 1 && ","}
                            </div>
                          ))}
                          <span className="mx-1">•</span> {turul}
                        </div>
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
          {songogdsonKhariltsagch.length > 1 ? (
            <div
              className="col-span-12 space-y-10 overflow-auto rounded-r-xl  bg-white pb-10 dark:bg-[#121826] lg:col-span-6 lg:mt-5 xl:col-span-6 xl:h-H7HalfRem"
              style={{
                height: ` ${
                  turul === "App"
                    ? "calc(100vh - 26rem)"
                    : turul === "SMS"
                    ? "calc(100vh - 21rem)"
                    : turul === "Mail"
                    ? "calc(100vh - 24rem)"
                    : ""
                } `,
              }}
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
                    <div className="font-medium">{t("Өдрийн мэнд")}</div>
                    <p>
                      {t("Сонгогдсон харилцагч байна.", {
                        count: songogdsonKhariltsagch.length,
                      })}
                    </p>
                    <div className="mt-1 text-gray-600 dark:text-gray-300">
                      {t("Та шаардлага илгээнэ үү.")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="w-full"
              data-aos="fade-left"
              data-aos-duration="1000"
            >
              <div
                className="col-span-12 flex min-h-[30vh] flex-col-reverse items-center overflow-y-auto rounded-r-xl px-10 pb-10 dark:bg-[#121826] lg:col-span-6 lg:mt-5 xl:col-span-6 xl:h-H7HalfRem"
                style={{
                  maxHeight: ` ${
                    turul === "App"
                      ? "calc(100vh - 31rem)"
                      : turul === "SMS"
                      ? "calc(100vh - 26rem)"
                      : turul === "Mail"
                      ? "calc(100vh - 28.5rem)"
                      : ""
                  } `,
                  height: ` ${
                    turul === "App"
                      ? "calc(100vh - 31rem)"
                      : turul === "SMS"
                      ? "calc(100vh - 26rem)"
                      : turul === "Mail"
                      ? "calc(100vh - 28.5rem)"
                      : ""
                  } `,
                }}
                onScroll={onScroll}
              >
                {medegdelAvya?.jagsaalt.map((a) => {
                  return (
                    <div
                      key={a._id || Math.random()}
                      className={`relative my-5 flex w-full flex-col rounded-xl border border-green-200 p-3 ${
                        a.turul === "medegdel" ||
                        a.turul === "Mail" ||
                        a.turul === "SMS" ||
                        a.turul === "App" ||
                        a.turul === "shaardlaga"
                          ? "ml-auto rounded-br-none bg-green-500"
                          : "rounded-bl-none bg-blue-500"
                      }`}
                    >
                      {/* Title харуулах (Mail-д байвал) */}
                      {a.title && (
                        <span className="mb-1 font-semibold text-white">
                          {a.title}
                        </span>
                      )}

                      <span className="w-full break-words text-justify text-white">
                        {a.message}
                      </span>

                      <div
                        className={`absolute right-2 h-5 w-5 fill-current text-white ${
                          a.kharsanEsekh === true ? "" : "hidden"
                        }`}
                      >
                        {/* SVG icon */}
                      </div>

                      <span className="absolute -bottom-5 text-xs font-medium text-gray-500">
                        {moment(a.createdAt).format("YYYY-MM-DD hh:mm")}
                      </span>

                      <span className="absolute -bottom-5 right-0 text-xs text-gray-500">
                        {a.turul === "medegdel"
                          ? t("Мэдэгдэл")
                          : a.turul === "sanal"
                          ? t("Санал")
                          : a.turul === "gomdol"
                          ? t("Гомдол")
                          : a.turul === "duudlaga"
                          ? t("Дуудлага")
                          : a.turul === "shaardlaga"
                          ? t("Шаардлага")
                          : a.turul}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div
            className="w-full space-y-2 p-2"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            {turul !== "SMS" && (
              <div>
                <Input
                  className="space-y-3"
                  placeholder="Гарчиг"
                  value={!!ner ? ner : title}
                  onChange={({ target }) => setTitle(target.value)}
                />
              </div>
            )}

            {turul !== "App" ? (
              <div>
                <ZagvarUusgekh
                  change={setContent}
                  value={content}
                  onTextChange={onTextChange}
                  height={100}
                />
              </div>
            ) : (
              <div className="space-y-2 ">
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
                          {t("Зураг оруулах")}
                        </Button>
                      </div>
                    </Upload>
                  </div>
                </div>
                <div>
                  <ZagvarUusgekh
                    change={setContent}
                    height={100}
                    value={content}
                    onTextChange={onTextChange}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="absolute bottom-3 z-50 flex w-full items-center justify-between space-x-2 p-4">
            <div className="text-xs font-semibold ">{msj.length}/160</div>
            <div className="flex items-center justify-between space-x-3">
              {progress && loading && turul === "Mail" && (
                <div className="mr-2 font-semibold text-green-600">
                   {progress.sent} / {progress.total}
                </div>
              )}
              <label className="font-medium dark:!text-white">
                {turul} {t("Илгээх")}
              </label>
              <div
                onClick={loading ? undefined : send}
                className={`h-8 w-8 ${loading ? "cursor-not-allowed" : "cursor-pointer"} sm:h-8 sm:w-8 bg-green-${
                  loading ? "200" : "600"
                } flex flex-none items-center justify-center rounded-full text-white `}
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
              <div className="mt-1 text-gray-800 dark:text-gray-300">
                {t("Та мэдэгдэл илгээх харилцагчаа сонгоно уу.")}
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
