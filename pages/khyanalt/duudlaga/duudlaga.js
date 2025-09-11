"use client";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  FileExcelOutlined,
  SnippetsOutlined,
  UploadOutlined,
  StarOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Checkbox, Tooltip, Tag, Spin, Select } from "antd";
import moment from "moment";
import Admin from "components/Admin";
import { socket } from "services/uilchilgee";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import useJagsaalt from "hooks/useJagsaalt";
import { useAuth } from "services/auth";
import uilchilgee, { url } from "services/uilchilgee";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import updateMethod from "tools/function/crud/updateMethod";
import {
  Button,
  Image,
  Input,
  notification,
  Popconfirm,
  DatePicker,
  Card,
} from "antd";
import Aos from "aos";
import local from "antd/lib/date-picker/locale/mn_MN";
import DuudlagaNemekh from "components/pageComponents/duudlaga/duudlagaAjiltanNemekh";
import TextArea from "antd/lib/input/TextArea";
import { useRouter } from "next/router";
import useKhariltsagchDavkhraarAvya from "hooks/useKhariltsagchDavkhraarAvya";
import modal from "components/ant/Modal";

import { useTranslation } from "react-i18next";
import useDuudlaga from "hooks/useDuudlaga";
import useDuudlagaToollolt from "hooks/useDuudlaga";

var timeout = null;
const { RangePicker } = DatePicker;
const { Option } = Select;

const searchKeys = [
  "gereeniiDugaar",
  "talbainDugaar",
  "togloomNer",
  "togloomUtas",
  "ner",
  "register",
  "utas",
  "tailbar",
];

const formatNumber = (num, decimals = 0) => {
  if (num === undefined || num === null) return "0";
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const Tailbar = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tailbar, setTailbar] = useState("");

  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tailbar);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [tailbar]
  );
  const handleOk = async () => {
    if (onOk) await onOk();
    destroy();
  };
  return (
    <div>
      <Input.TextArea
        value={tailbar}
        onChange={({ target }) => setTailbar(target?.value)}
        placeholder="Цуцлах шалтгааныг бичнэ үү..."
        rows={4}
      />
    </div>
  );
});

const order = { updatedAt: -1 };

function TaskManagementSystem({ token }) {
  const [msj, onTextChange] = useState("");
  const { t, i18n } = useTranslation();
  const [tuluv, setTuluv] = useState("Идэвхтэй");
  const [duudlaga, setDuudlaga] = useState();
  const [setgegdel, setSetgegdel] = useState();
  const { ajiltan, barilgiinId } = useAuth();
  const inputRef = useRef();
  const [title, setTitle] = useState();
  const [khariltsagch, setKhariltsagch] = useState(null);
  const ChatRef = useRef();
  const [turulZagvar, setTurulZagvar] = useState(false);
  const [davkhar, setDavkhar] = useState(null);
  const messageEl = useRef(null);
  const [ner, setNer] = useState();
  const tailbarRef = useRef(null);
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState();
  const [songogdsonKhariltsagch, setSongogdsonKhariltsagch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [turulFilter, setTurulFilter] = useState("Бүгд");
  const [searchTerm, setSearchTerm] = useState("");

  const [expandedNames, setExpandedNames] = useState(new Set());

  const duudlagiinTurul = ["Сантехник", "Ус", "Цахилгаан"];

  const getStatusInfo = (tuluv) => {
    switch (tuluv) {
      case 0:
        return { text: "Идэвхтэй", color: "green" };
      case 1:
        return { text: "Дууссан", color: "blue" };
      case -1:
        return { text: "Цуцлагдсан", color: "red" };
      default:
        return { text: "Тодорхойгүй", color: "gray" };
    }
  };

  const toggleNameExpansion = (name) => {
    setExpandedNames((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const turul = useMemo(() => {
    switch (tuluv) {
      case "Идэвхтэй":
        return 0;
      case "Дууссан":
        return 1;
      case "Цуцлагдсан":
        return -1;
      default:
        return 0;
    }
  }, [tuluv]);

  const groupCallsByName = (jagsaalt) => {
    if (!jagsaalt) return [];

    const grouped = jagsaalt.reduce((acc, mur) => {
      const key = mur.khariltsagchiinNer;
      if (!acc[key]) {
        acc[key] = {
          ...mur,
          callCount: 1,
          allCalls: [mur],
        };
      } else {
        acc[key].callCount += 1;
        acc[key].allCalls.push(mur);

        if (new Date(mur.createdAt) > new Date(acc[key].createdAt)) {
          acc[key] = {
            ...mur,
            callCount: acc[key].callCount,
            allCalls: acc[key].allCalls,
          };
        }
      }
      return acc;
    }, {});

    return Object.values(grouped);
  };

  const query = useMemo(
    () => ({
      barilgiinId: barilgiinId,
      ajiltniiId: ajiltan?.erkh === "Admin" ? undefined : ajiltan?._id,
      baiguullagiinId: ajiltan?.baiguullagiinId,
      tuluv: turul,
      ...(ekhlekhOgnoo &&
        ekhlekhOgnoo.length === 2 && {
          startDate: ekhlekhOgnoo[0]?.startOf("day"),
          endDate: ekhlekhOgnoo[1]?.endOf("day"),
        }),
      ...(turulFilter !== "Бүгд" && { duudlagiinTurul: turulFilter }),
      ...(searchTerm && { search: searchTerm }),
    }),
    [ajiltan, turul, barilgiinId, ekhlekhOgnoo, turulFilter, searchTerm]
  );

  const updateTaskStatus = async (taskId, newStatus, reason = null) => {
    try {
      const updateData = {
        _id: taskId,
        tuluv: newStatus,
        ...(reason && { tailbar: reason }),
        updatedAt: new Date(),
      };

      const response = await updateMethod("sonorduulga", token, updateData);

      if (response.data) {
        notification.success({
          message: t("Амжилттай"),
          description: t("Төлөв амжилттай шинэчлэгдлээ"),
        });

        if (task?.mutate) {
          task.mutate();
        }

        if (duudlaga?._id === taskId) {
          setDuudlaga({ ...duudlaga, tuluv: newStatus });
        }
      }
    } catch (error) {
      console.error("Status update error:", error);
      notification.error({
        message: t("Алдаа"),
        description: t("Төлөв шинэчлэхэд алдаа гарлаа"),
      });
    }
  };
  const duudlagaDuusya = () => {
    if (!duudlaga?._id) return;
    updateTaskStatus(duudlaga._id, 1);
  };

  function duudlagaTsutslakh() {
    if (!duudlaga?._id) return;

    const footer = [
      <Button key="cancel" onClick={() => tailbarRef.current.khaaya()}>
        {t("Хаах")}
      </Button>,
      <Button
        key="confirm"
        type="primary"
        danger
        onClick={() => tailbarRef.current.khadgalya()}
      >
        {t("Цуцлах")}
      </Button>,
    ];

    modal({
      title: "Дуудлага цуцлах шалтгаан",
      content: (
        <Tailbar
          ref={tailbarRef}
          confirm={(tailbar) => {
            if (!tailbar?.trim()) {
              notification.warning({
                message: t("Анхаар"),
                description: t("Цуцлах шалтгааныг бичнэ үү"),
              });
              return;
            }
            updateTaskStatus(duudlaga._id, -1, tailbar);
          }}
        />
      ),
      footer,
    });
  }

  useEffect(() => {
    if (task?.mutate) {
      task.mutate();
    }
    setDuudlaga();
  }, [tuluv, barilgiinId, ekhlekhOgnoo, turulFilter, searchTerm]);

  const khariltsagchiinQuery = useMemo(() => {
    return {
      barilgiinId,
      ...(turulFilter !== "Бүгд" && { duudlagiinTurul: turulFilter }),
      ...(searchTerm && { search: searchTerm }),
    };
  }, [barilgiinId, turulFilter, searchTerm]);

  const { setKhariltsagchKhuudaslalt, jagsaalt } = useKhariltsagchDavkhraarAvya(
    token,
    khariltsagchiinQuery,
    davkhar,
    tuluv
  );

  const {
    duudlagaGaralt,
    duudlagaMutate,
    setDuudlagaKhuudaslalt,
    isValidating,
  } = useDuudlaga(
    barilgiinId && token,
    ajiltan?.baiguullagiinId,
    query,
    order,
    searchKeys
  );
  const { duudlagiinToololt } = useDuudlagaToollolt(token, query);

  const task = useJagsaalt(ajiltan && "/sonorduulga", query, order);

  const setgegdeliinQuery = useMemo(
    () => ({
      duudlagaId: duudlaga?._id,
    }),
    [duudlaga]
  );

  const duudlagaSetgegdel = useJagsaalt(
    duudlaga && "/setgegdel",
    setgegdeliinQuery,
    order
  );

  useEffect(() => {
    if (ajiltan?.baiguullagiinId) {
      const eventName = `appWebDuudlaga${ajiltan.baiguullagiinId}`;

      const handleSonorduulga = (sonorduulga) => {
        console.log("sonorduulga received:", sonorduulga);

        notification.success({
          message: "Шинэ дуудлага",
          description: "Шинэ дуудлага ирлээ",
        });

        if (duudlagaMutate) {
          duudlagaMutate();
        }

        if (task?.mutate) {
          task.mutate();
        }
      };

      socket().on(eventName, handleSonorduulga);

      return () => {
        socket().off(eventName, handleSonorduulga);
      };
    }
  }, [ajiltan?.baiguullagiinId, duudlagaMutate, task?.mutate]);

  // Enhanced search handler with proper debouncing
  const handleSearch = useCallback(
    (value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log("Search term set to:", value);
        setSearchTerm(value);

        // Update the khariltsagch search if needed
        if (setKhariltsagchKhuudaslalt) {
          setKhariltsagchKhuudaslalt((prev) => ({
            ...prev,
            search: value,
          }));
        }
      }, 300);
    },
    [setKhariltsagchKhuudaslalt]
  );

  function onScroll(e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {}, 300);
  }

  function khariltsagchSongokh(mur) {
    if (!mur || !mur._id) return;

    setSongogdsonKhariltsagch((prev) => {
      const index = prev.findIndex((a) => a._id === mur._id);
      if (index !== -1) {
        return prev.filter((item) => item._id !== mur._id);
      } else {
        return [...prev, mur];
      }
    });
  }

  useEffect(() => {
    Aos.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    setSetgegdel("");
  }, [duudlaga?._id]);

  function scrollTogsgolruu() {
    if (messageEl.current) {
      messageEl.current.scrollTo({
        top: messageEl.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  const send = useCallback(async () => {
    if (!msj?.trim()) {
      notification.warning({
        message: t("Анхаар"),
        description: t("Мессеж бичнэ үү"),
      });
      return;
    }

    if (songogdsonKhariltsagch.length === 0) {
      notification.warning({
        message: t("Анхаар"),
        description: t("Харилцагч сонгоно уу"),
      });
      return;
    }

    setLoading(true);

    try {
      const response = await uilchilgee(token).post("/sendMessage", {
        message: msj.trim(),
        recipients: songogdsonKhariltsagch.map((k) => k._id),
        barilgiinId: barilgiinId,
      });

      if (response.data === "Amjilttai") {
        notification.success({
          message: t("Мессеж илгээгдлээ"),
          description: `${songogdsonKhariltsagch.length} харилцагчид илгээгдлээ`,
        });
        onTextChange("");
        setSongogdsonKhariltsagch([]);
      }
    } catch (error) {
      notification.error({
        message: t("Алдаа"),
        description: t("Мессеж илгээхэд алдаа гарлаа"),
      });
    } finally {
      setLoading(false);
    }
  }, [msj, songogdsonKhariltsagch, barilgiinId, token, t]);

  const filteredJagsaalt = useMemo(() => {
    const dataSource = task?.jagsaalt || jagsaalt || [];

    if (!dataSource || dataSource.length === 0) return [];

    return dataSource.filter((item) => {
      let statusMatch = true;
      if (tuluv === "Идэвхтэй") statusMatch = item.tuluv === 0;
      else if (tuluv === "Дууссан") statusMatch = item.tuluv === 1;
      else if (tuluv === "Цуцлагдсан") statusMatch = item.tuluv === -1;

      const typeMatch =
        turulFilter === "Бүгд" ||
        item.duudlagiinTurul?.toLowerCase() === turulFilter.toLowerCase();

      let searchMatch = true;
      if (searchTerm && searchTerm.trim()) {
        const searchTermLower = searchTerm.toLowerCase().trim();

        searchMatch = searchKeys.some((key) => {
          const value = item[key];
          if (value && typeof value === "string") {
            return value.toLowerCase().includes(searchTermLower);
          }
          return false;
        });

        if (!searchMatch) {
          const additionalFields = [
            item.khariltsagchiinNer,
            item.khariltsagchiinRegister,
            item.khariltsagchiinUtas,
            item.title,
            item.message,
            item.duudlagiinTurul,
          ];

          searchMatch = additionalFields.some((field) => {
            if (field && typeof field === "string") {
              return field.toLowerCase().includes(searchTermLower);
            }
            return false;
          });
        }
      }

      let dateMatch = true;
      if (ekhlekhOgnoo && ekhlekhOgnoo.length === 2) {
        const itemDate = moment(item.createdAt);
        dateMatch = itemDate.isBetween(
          ekhlekhOgnoo[0],
          ekhlekhOgnoo[1],
          "day",
          "[]"
        );
      }

      return statusMatch && typeMatch && searchMatch && dateMatch;
    });
  }, [task?.jagsaalt, jagsaalt, tuluv, turulFilter, searchTerm, ekhlekhOgnoo]);

  const allDataQuery = useMemo(
    () => ({
      barilgiinId: barilgiinId,
      ajiltniiId: ajiltan?.erkh === "Admin" ? undefined : ajiltan?._id,
      baiguullagiinId: ajiltan?.baiguullagiinId,
    }),
    [ajiltan, barilgiinId]
  );

  const allDataTask = useJagsaalt(
    ajiltan && "/sonorduulga",
    allDataQuery,
    order
  );

  const khyanaltiinDun = useMemo(() => {
    const allData = allDataTask?.jagsaalt || [];
    const activeCount = allData.filter((item) => item.tuluv === 0).length || 0;
    const completedCount =
      allData.filter((item) => item.tuluv === 1).length || 0;
    const cancelledCount =
      allData.filter((item) => item.tuluv === -1).length || 0;

    return [
      {
        too: formatNumber(activeCount, 0),
        utga: t("Идэвхтэй"),
        status: "Идэвхтэй",
        onClick: () => setTuluv("Идэвхтэй"),
      },
      {
        too: formatNumber(completedCount, 0),
        utga: t("Дууссан"),
        status: "Дууссан",
        onClick: () => setTuluv("Дууссан"),
      },
      {
        too: formatNumber(cancelledCount, 0),
        utga: t("Цуцлагдсан"),
        status: "Цуцлагдсан",
        onClick: () => setTuluv("Цуцлагдсан"),
      },
    ];
  }, [allDataTask?.jagsaalt, t]);

  const [showResults, setShowResults] = useState(false);
  const Nemekh = () => {
    setDuudlaga(false);
    setShowResults(true);
    setTimeout(() => {
      document.getElementById("DuudlagaNemekhTextArea")?.focus();
    }, 300);
  };

  const khaakh = () => setShowResults(false);

  useEffect(() => {
    if (duudlaga) {
      setShowResults(false);
    }
  }, [duudlaga]);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id && task?.jagsaalt) {
      const selectedTask = task.jagsaalt.find((mur) => id === mur._id);
      setDuudlaga(selectedTask);
      scrollTogsgolruu();
    }
  }, [id, task?.jagsaalt]);

  const medegdelAvya = useJagsaalt("/sonorduulga", query, order, undefined);

  const renderCallList = () => {
    const groupedCalls = groupCallsByName(filteredJagsaalt);

    return groupedCalls?.map((mur) => {
      const statusInfo = getStatusInfo(mur.tuluv);
      const isExpanded = expandedNames.has(mur.khariltsagchiinNer);
      const hasMultipleCalls = mur.callCount > 1;

      return (
        <div key={mur?._id} className="mb-2">
          {!!mur._id ? (
            <>
              {/* Main call entry */}
              <div
                className={`grid cursor-pointer grid-cols-4 items-center gap-4 rounded-md p-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  khariltsagch?._id === mur?._id
                    ? "rounded-l-full bg-green-100 shadow-lg dark:bg-green-500"
                    : ""
                }`}
                onClick={() => {
                  setDuudlaga(mur);
                  setKhariltsagch(mur);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="image-fit relative h-10 w-10 flex-none rounded-full">
                    <div
                      className={`absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-${statusInfo.color}-500`}
                      title={statusInfo.text}
                    />

                    {mur.callCount > 1 && (
                      <div className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {mur.callCount}
                      </div>
                    )}
                    <img
                      alt="profileZurag"
                      className="rounded-full"
                      src="/profile.svg"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {mur.khariltsagchiinNer}{" "}
                        <span className="ml-2 text-xs text-gray-400">
                          ({mur.callCount} даалгавар)
                        </span>
                      </span>

                      {hasMultipleCalls && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNameExpansion(mur.khariltsagchiinNer);
                          }}
                          className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                        >
                          {mur.callCount} дуудлага {isExpanded ? "▼" : "▶"}
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {mur.khariltsagchiinRegister}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Tag color={statusInfo.color} size="small">
                    {t(statusInfo.text)}
                  </Tag>
                </div>

                <div className="flex justify-center">
                  {mur.duudlagiinTurul && (
                    <Tag size="small" color="processing">
                      {mur.duudlagiinTurul}
                    </Tag>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500">
                    {moment(mur.createdAt).format("MM-DD HH:mm")}
                  </span>
                  {hasMultipleCalls && (
                    <span className="text-xs text-blue-500">
                      Сүүлийн дуудлага
                    </span>
                  )}
                  <div className="flex cursor-pointer text-yellow-500 hover:text-yellow-600">
                    <StarOutlined />
                  </div>
                </div>
              </div>

              {hasMultipleCalls && isExpanded && (
                <div className="ml-6 mt-2 space-y-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                  <div className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Бүх дуудлагууд ({mur.allCalls.length}):
                  </div>
                  {mur.allCalls
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((call, index) => {
                      const callStatusInfo = getStatusInfo(call.tuluv);
                      return (
                        <div
                          key={call._id}
                          className={`cursor-pointer rounded-md border-l-2 p-2 transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 ${
                            call.tuluv === 0
                              ? "border-green-500"
                              : call.tuluv === 1
                              ? "border-blue-500"
                              : "border-red-500"
                          } ${
                            khariltsagch?._id === call._id
                              ? "bg-green-50 shadow-md dark:bg-green-900"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDuudlaga(call);
                            setKhariltsagch(call);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Tag color={callStatusInfo.color} size="small">
                                  {t(callStatusInfo.text)}
                                </Tag>
                                {call.duudlagiinTurul && (
                                  <Tag size="small" color="processing">
                                    {call.duudlagiinTurul}
                                  </Tag>
                                )}
                                {index === 0 && (
                                  <span className="rounded bg-blue-100 px-1 py-0.5 text-xs text-blue-600">
                                    Сүүлийн
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                                {call.title && (
                                  <div className="truncate">{call.title}</div>
                                )}
                                {call.message && (
                                  <div className="mt-1 max-w-xs truncate text-gray-500">
                                    {call.message}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">
                                {moment(call.createdAt).format("MM-DD HH:mm")}
                              </div>
                              <div className="mt-1 text-xs text-gray-400">
                                {moment(call.createdAt).fromNow()}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </>
          ) : null}
        </div>
      );
    });
  };

  return (
    <Admin
      khuudasniiNer="duudlaga"
      title="Дуудлага үйлчилгээ"
      tsonkhniiId={"64472be628c37d7cdda11a24"}
      className={"gap-5 p-2 pb-10 sm:p-6 md:pb-0"}
      onSearch={task.onSearch}
    >
      <div
        style={{ height: "calc(100vh - 8rem)" }}
        className="col-span-12 flex h-auto flex-col space-y-5 rounded-2xl bg-white p-2 dark:bg-gray-900 md:rounded-none md:rounded-l-2xl md:p-8 xl:col-span-5"
      >
        <Card className="cardgrid col-span-12">
          <div className="hideScroll flex w-full gap-6 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-3 sm:p-0 md:gap-3 2xl:grid-cols-3">
            {khyanaltiinDun.map((mur, index) => (
              <div
                key={index}
                className={`col-span-12 h-20 cursor-pointer rounded-xl border-2 transition-all duration-200 hover:shadow-lg sm:col-span-1 lg:col-span-1 ${
                  mur.status === tuluv
                    ? "border-green-600 bg-green-50 shadow-md dark:bg-green-900/20"
                    : "border-green-600 hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={mur.onClick}
              >
                <div className="h-full w-[67vw] rounded-xl md:w-auto">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {mur.too}
                        </div>
                        <div className="text-sm text-gray-500">{mur.utga}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="mb-2 grid grid-cols-1 gap-4 px-2 md:grid-cols-2">
          <RangePicker
            className="w-full"
            placeholder={[t("Эхлэх огноо"), t("Дуусах огноо")]}
            locale={local}
            size="middle"
            onChange={setEkhlekhOgnoo}
            value={ekhlekhOgnoo}
          />
          <Select
            className="w-full"
            placeholder={t("Төрөл сонгох")}
            value={turulFilter}
            onChange={setTurulFilter}
            size="middle"
          >
            <Option value="Бүгд">Бүгд</Option>
            <option value="Сантехник" />
            <option value="Цахилгаан" />
            <option value="Халаалтын систем" />
            <option value="Агааржуулалт" />
            <option value="Лифт засвар" />
            <option value="Ус" />
            <option value="Усны даралт" />
            <option value="Усны чанар" />
            <option value="Усны хоолой" />
            <option value="Бохир ус" />
            <option value="Ханын засвар" />
            <option value="Шалны засвар" />
            <option value="Тааз засвар" />
            <option value="Цонх засвар" />
            <option value="Хаалганы засвар" />
            <option value="Галын аюулгүй байдал" />
            <option value="Аюулгүй байдлын систем" />
            <option value="Дуу чимээ" />
            <option value="Гэрэлтүүлэг" />
            <option value="Цэвэрлэгээ" />
            <option value="Хогийн менежмент" />
            <option value="Халдвар хамгаалалт" />
            <option value="Интернет" />
            <option value="Кабелийн ТВ" />
            <option value="Утасны холбоо" />
            <option value="Лифт" />
            <option value="Паркинг" />
            <option value="Хамгаалалт" />
            <option value="Удирдлагын асуудал" />
            <option value="Санхүүгийн асуудал" />
            <option value="Бусад" />
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-5 rounded-xl bg-green-500 p-2 font-medium dark:bg-green-700 sm:text-lg lg:text-sm xl:text-base 2xl:text-xl">
          {["Идэвхтэй", "Дууссан", "Цуцлагдсан"].map((status, index) => (
            <div
              key={status}
              onClick={() => setTuluv(status)}
              className={`cursor-pointer rounded-lg p-1 text-center transition-all duration-200 ${
                tuluv === status
                  ? "bg-white text-gray-800 shadow-md dark:bg-gray-800 dark:text-gray-50"
                  : "text-gray-50 hover:bg-white/20"
              }`}
            >
              {t(status)}
            </div>
          ))}
        </div>

        <div className="box scrollbar-hidden h-full overflow-y-hidden p-5 xl:block">
          <div className="relative w-full text-gray-700 dark:text-gray-300">
            <input
              type="text"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
              placeholder={t("Хайх /Нэр, Регистр, Утас, Гэрээ, Талбай/")}
              onChange={({ target }) => handleSearch(target.value)}
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
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          <div className="scrollbar-hidden mt-2 h-medegdelHariltsagchPhone overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <Spin size="large" />
              </div>
            )}

            {filteredJagsaalt && filteredJagsaalt.length === 0 && (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <div className="text-center">
                  <div className="text-lg font-medium">
                    {t("Өгөгдөл олдсонгүй")}
                  </div>
                  <div className="mt-1 text-sm">
                    {t("Шүүлтүүрийг өөрчилж үзнэ үү")}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Нийт: {task?.jagsaalt?.length || 0}, Шүүгдсэн:{" "}
                    {filteredJagsaalt?.length || 0}
                  </div>
                </div>
              </div>
            )}

            {filteredJagsaalt?.map((mur) => {
              const statusInfo = getStatusInfo(mur.tuluv);

              return (
                <div key={mur?._id}>
                  {!!mur._id ? (
                    <div
                      className={`grid cursor-pointer grid-cols-4 items-center gap-4 rounded-md p-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        khariltsagch?._id === mur?._id
                          ? "rounded-l-full bg-green-100 shadow-lg dark:bg-green-500"
                          : ""
                      }`}
                      onClick={() => {
                        setDuudlaga(mur);
                        setKhariltsagch(mur);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="image-fit relative h-10 w-10 flex-none rounded-full">
                          <div
                            className={`absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-${statusInfo.color}-500`}
                            title={statusInfo.text}
                          />
                          <img
                            alt="profileZurag"
                            className="rounded-full"
                            src="/profile.svg"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {mur.khariltsagchiinNer}
                          </span>
                          <span className="text-xs text-gray-500">
                            {mur.khariltsagchiinRegister}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Tag color={statusInfo.color} size="small">
                          {t(statusInfo.text)}
                        </Tag>
                      </div>

                      <div className="flex justify-center">
                        {mur.duudlagiinTurul && (
                          <Tag size="small" color="processing">
                            {mur.duudlagiinTurul}
                          </Tag>
                        )}
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">
                          {moment(mur.createdAt).format("MM-DD HH:mm")}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>
                    {filteredJagsaalt?.filter((user) => user.tuluv === 0)
                      .length || 0}{" "}
                    {t("Идэвхтэй")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span>
                    {filteredJagsaalt?.filter((user) => user.tuluv === 1)
                      .length || 0}{" "}
                    {t("Дууссан")}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span>
                    {filteredJagsaalt?.filter((user) => user.tuluv === -1)
                      .length || 0}{" "}
                    {t("Цуцлагдсан")}
                  </span>
                </div>
              </div>
              <div className="text-sm font-medium">
                {t("Нийт")}: {filteredJagsaalt?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {duudlaga ? (
        <div
          style={{ height: "calc(100vh - 8rem)" }}
          className="relative col-span-12 flex h-full flex-col rounded-2xl bg-white p-1 dark:bg-gray-900 md:rounded-none md:rounded-r-2xl xl:col-span-7"
        >
          <div className="w-10/12 rounded-lg p-3 dark:bg-gray-900 sm:w-full">
            <div className="grid grid-cols-2 gap-3 rounded-lg border p-4 dark:bg-gray-900">
              <span className="col-span-1 text-xs text-gray-500">
                Огноо: {moment(khariltsagch.createdAt).format("MM-DD HH:mm")}
              </span>
              <div className="">Нэр: {duudlaga.khariltsagchiinNer}</div>
              {/* <div className="font-medium">
                Гэрээ: {duudlaga.khariltsagchiinGereeniiDugaar}
              </div> */}
              <div className="font-medium">Гарчиг: {duudlaga.title}</div>
              <div className="">Утас: {duudlaga.khariltsagchiinUtas}</div>
              {/* <div className="font-medium">
                Талбай: {duudlaga?.khariltsagchiinTalbainDugaar}
              </div> */}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            <div className="h-auto w-full break-words rounded-lg p-6 py-2">
              {duudlaga?.message || duudlaga?.tailbar}
            </div>

            {duudlaga?.tailbar && (
              <div className="mt-2 rounded-lg   p-2  ">
                <div className="text-sm font-medium text-red-600">
                  {t("Цуцалсан шалтгаан")}:
                </div>
                <div className="text-sm text-red-500">{duudlaga.tailbar}</div>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between p-4">
            <div className="flex">
              {duudlaga?.duudlagiinTurul && (
                <Tag size="small" color="processing">
                  Үйлчилгээ: {duudlaga.duudlagiinTurul}
                </Tag>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`${
                  duudlaga?.tuluv === -1 ? "hidden" : "flex"
                } space-x-2`}
              >
                {duudlaga?.tuluv === 0 && (
                  <Popconfirm
                    title="Дуудлагыг дуусгах уу?"
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={duudlagaDuusya}
                  >
                    <div className="cursor-pointer rounded-full bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600">
                      {t("Дуусгах")}
                    </div>
                  </Popconfirm>
                )}

                {duudlaga?.tuluv !== 1 && (
                  <Popconfirm
                    title="Дуудлагыг цуцлах уу?"
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={duudlagaTsutslakh}
                  >
                    <div className="cursor-pointer rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600">
                      {t("Цуцлах")}
                    </div>
                  </Popconfirm>
                )}
              </div>

              {duudlaga?.tuluv === 1 && (
                <div className="rounded-2xl bg-blue-500 px-3 py-1 text-white">
                  {t("Дууссан")}
                </div>
              )}
              {duudlaga?.tuluv === -1 && (
                <div className="rounded-2xl bg-red-500 px-3 py-1 text-white">
                  {t("Цуцлагдсан")}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative hidden gap-5 rounded-2xl bg-green-50 p-1 dark:bg-gray-900 md:rounded-none md:rounded-r-2xl xl:col-span-7">
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
                {t("Та дуудлага сонгож дэлгэрэнгүй мэдээлэл үзнэ үү.")}
              </div>
            </div>
          </div>
        </div>
      )}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;
export default TaskManagementSystem;
