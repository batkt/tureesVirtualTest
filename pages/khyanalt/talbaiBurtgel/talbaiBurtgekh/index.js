import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  MoreOutlined,
  PictureOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Form,
  Input,
  message,
  Popconfirm,
  Popover,
  Space,
  Table,
  Tag,
  Drawer,
} from "antd";
import Admin from "components/Admin";
import { modal } from "components/ant/Modal";
import CardList from "components/cardList";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import TalbaiTile from "components/pageComponents/talbai/TalbaiTile";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import { useTalbai } from "hooks/useTalbai";
import useTalbainToololt from "hooks/useTalbainToololt";
import _ from "lodash";
import moment from "moment";
import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import createMethod from "tools/function/crud/createMethod";
import formatNumber from "tools/function/formatNumber";
import useOrder from "tools/function/useOrder";
import Aos from "aos";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { MdOutlineInventory } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { TbBoxMultiple } from "react-icons/tb";
import { ImFileEmpty, ImFileText2 } from "react-icons/im";
import { useTranslation } from "react-i18next";

const Tailan = dynamic(() => import("components/konva/tailan"), { ssr: false });

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e && e.fileList;
};

function TalbaiSegment({ token, ...a }) {
  return (
    <div className="box dark:text-white">
      <div className="flex items-center px-5 py-2 shadow-none">
        <div className="flex gap-2 border-l-2 border-green-500 pl-4">
          <div className="font-medium">{a.ner}</div>
          <div className="font-medium text-gray-600 dark:text-gray-300">
            ({a.utga})
          </div>
        </div>
      </div>
    </div>
  );
}
function talbaiBurtgekh({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const formRef = useRef();
  const router = useRouter();
  const querys = router.query;
  const data = JSON.parse(querys.data || "{}");
  const excelref = useRef();
  const { TextArea } = Input;
  const { ajiltan, baiguullaga, barilgiinId } = useAuth();
  const [shuult, setShuult] = useState({
    query: { talbainDugaar: "105" },
  });
  const [query, setQuery] = useState({});
  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const {
    setTalbaiKhuudaslalt,
    talbainiiGaralt,
    talbainiiJagsaaltMutate,
    isValidating,
  } = useTalbai(token, baiguullaga?._id, query, order);

  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(token, baiguullaga?._id, undefined, shuult?.query);

  const [talbaiState, settalbaiState] = useState({
    kod: undefined,
    talbainKhemjee: undefined,
    tailbar: undefined,
    talbainNegjUne: undefined,
    talbainNiitUne: undefined,
    ashiglaltiinZardal: undefined,
    niitAshiglaltiinZardal: undefined,
    tureesiinTulbur: undefined,
    davkhar: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
    zasakhEsekh: false,
    ...data,
  });

  const { talbainToololt } = useTalbainToololt(token, barilgiinId);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [neesenEsekh, setNeesenEsekh] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const khyanaltiinDun = [
    {
      too: talbainToololt
        ?.filter((a) => a?._id !== "niitiinTalbai")
        ?.reduce((a, b) => a + b?.too, 0),
      mk: talbainToololt
        ?.filter((a) => a?._id !== "niitiinTalbai")
        ?.reduce((a, b) => a + b?.khemjee, 0),

      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <line x1="3" y1="21" x2="21" y2="21" />{" "}
          <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />{" "}
          <path d="M5 21v-10.15" /> <path d="M19 21v-10.15" />{" "}
          <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
        </svg>
      ),
      khuvi: 100,
      utga: "Нийт",
      query: {},
    },
    {
      too: talbainToololt?.find((a) => a._id === true)?.too || 0,
      mk: talbainToololt?.find((a) => a._id === true)?.khemjee || 0,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
          <circle cx="8.5" cy="7" r="4" />{" "}
          <polyline points="17 11 19 13 23 9" />
        </svg>
      ),
      khuvi: -30,
      utga: "Идэвхтэй",
      query: { idevkhiteiEsekh: true },
    },
    {
      too: talbainToololt?.find((a) => a._id === false)?.too || 0,
      mk: talbainToololt?.find((a) => a._id === false)?.khemjee || 0,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
          <circle cx="8.5" cy="7" r="4" />{" "}
          <line x1="18" y1="8" x2="23" y2="13" />{" "}
          <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
      ),
      khuvi: 100,
      utga: "Идэвхгүй",
      query: { idevkhiteiEsekh: false },
    },
    {
      too: talbainToololt?.find((a) => a._id === "niitiinTalbai")?.too || 0,
      mk: talbainToololt?.find((a) => a._id === "niitiinTalbai")?.khemjee || 0,
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <circle cx="9" cy="7" r="4" />{" "}
          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />{" "}
          <line x1="19" y1="7" x2="19" y2="10" />{" "}
          <line x1="19" y1="14" x2="19" y2="14.01" />
        </svg>
      ),
      khuvi: 100,
      utga: "Нийтийн эзэмшлийн талбай м²",
      query: { niitiinTalbaiEsekh: true },
    },
  ];

  function onChange(talbar, utga) {
    if (talbar === "talbainNegjUne") {
      let value = Number(utga) * Number(talbaiState.talbainKhemjee);
      if (
        (_.isNumber(Number(talbaiState.talbainNegjUne)) &&
          _.isNumber(utga) &&
          value) ||
        0
      ) {
        talbaiState.talbainNiitUne = value.toFixed(2);
        formRef.current.setFieldsValue({
          talbainNiitUne: talbaiState.talbainNiitUne,
        });
        talbaiState.tureesiinTulbur =
          Number(talbaiState.niitAshiglaltiinZardal || 0) +
          Number(talbaiState.talbainNiitUne || 0);
        formRef.current.setFieldsValue({
          tureesiinTulbur: talbaiState.tureesiinTulbur,
        });
      }
    }
    if (talbar === "ashiglaltiinZardal") {
      talbaiState.niitAshiglaltiinZardal = (
        utga * talbaiState.talbainKhemjee || 0
      ).toFixed(2);
      formRef.current.setFieldsValue({
        niitAshiglaltiinZardal: talbaiState.niitAshiglaltiinZardal,
      });
      talbaiState.tureesiinTulbur =
        Number(talbaiState.niitAshiglaltiinZardal || 0) +
        Number(talbaiState.talbainNiitUne || 0);
      formRef.current.setFieldsValue({
        tureesiinTulbur: talbaiState.tureesiinTulbur,
      });
    }
    if (talbar === "talbainNiitUne") {
      let value = Number(utga) / Number(talbaiState.talbainKhemjee);
      if (
        (_.isNumber(Number(talbaiState.talbainNegjUne)) &&
          _.isNumber(utga) &&
          value) ||
        0
      ) {
        talbaiState.talbainNegjUne = value.toFixed(2);
        formRef.current.setFieldsValue({
          talbainNegjUne: talbaiState.talbainNegjUne,
        });
        talbaiState.tureesiinTulbur =
          Number(talbaiState.niitAshiglaltiinZardal) + Number(utga);
        formRef.current.setFieldsValue({
          tureesiinTulbur: talbaiState.tureesiinTulbur,
        });
      }
    }
    if (talbar === "talbainKhemjee") {
      talbaiState.niitAshiglaltiinZardal = (
        utga * talbaiState.ashiglaltiinZardal || 0
      ).toFixed(2);
      if (!!talbaiState.niitAshiglaltiinZardal) {
        formRef.current.setFieldsValue({
          niitAshiglaltiinZardal: talbaiState.niitAshiglaltiinZardal,
        });
      }

      let value =
        talbaiState.talbainNegjUne === undefined
          ? Number(talbaiState.talbainNiitUne) / Number(utga)
          : Number(utga) * Number(talbaiState.talbainNegjUne);

      if (_.isNumber(value) && !_.isNaN(value)) {
        if (talbaiState.talbainNegjUne === undefined) {
          formRef.current.setFieldsValue({
            talbainNegjUne: value.toFixed(2),
          });
        } else {
          talbaiState.talbainNiitUne = value.toFixed(2);
          formRef.current.setFieldsValue({
            talbainNiitUne: value.toFixed(2),
          });
        }
      }
      if (
        talbaiState.talbainNiitUne > 0 &&
        talbaiState.niitAshiglaltiinZardal > 0
      ) {
        talbaiState.tureesiinTulbur =
          Number(talbaiState.talbainNiitUne) +
          Number(talbaiState.niitAshiglaltiinZardal);
        formRef.current.setFieldsValue({
          tureesiinTulbur: talbaiState.tureesiinTulbur,
        });
      }
    }
    if (talbar === "khurunguUne") {
      talbaiState.talbainNiitUne = (utga * talbaiState.talbainKhemjee).toFixed(
        2
      );
      formRef.current.setFieldsValue({});
    }
    settalbaiState((a) => ({ ...a, [talbar]: utga }));
  }
  function talbaiBurtgekh() {
    const khurunguud = formRef.current.getFieldsValue(khurunguud);
    talbaiState.baiguullagiinId = ajiltan?.baiguullagiinId;
    talbaiState.barilgiinId = barilgiinId;
    talbaiState.talbainKhemjee = parseFloat(talbaiState.talbainKhemjee?.toFixed(2));
    talbaiState.talbainKhemjeeMetrKube = parseFloat(talbaiState.talbainKhemjeeMetrKube?.toFixed(2));

    if (khurunguud?.khurunguud?.length > 0) {
      talbaiState.khurunguud = khurunguud.khurunguud;
      if (talbaiState.khurunguud[0].zurgiinId !== undefined) {
        talbaiState.khurunguud.map(
          (x) =>
            x.zurgiinId[0]?.response?.id &&
            (x.zurgiinId = x.zurgiinId[0].response.id)
        );
      }
    }

    setWaiting(true);
    if (talbaiState.zasakhEsekh === true) {
      uilchilgee(token)
        .post("/talbaiZasya", talbaiState)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            setWaiting(false);
            message.success(t("Бүртгэл амжилттай засагдлаа"));
            formRef.current.resetFields();
            talbainiiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            );
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else
      createMethod("talbai", token, talbaiState)
        .then(({ data }) => {
          if (data !== undefined) {
            setWaiting(false);
            message.success(t("Бүртгэл амжилттай хийгдлээ"));
            formRef.current.resetFields();
            talbainiiJagsaaltMutate(
              (s) => ({ ...s, jagsaalt: s.jagsaalt }),
              true
            );
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
  }

  function talbaiUstgay(mur) {
    setWaiting(true);
    uilchilgee(token)
      .post("/talbaiUstgaya", { id: mur._id })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setWaiting(false);
          talbainiiJagsaaltMutate();
          message.success(t("Устгагдлаа"));
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setWaiting(false);
      });
  }

  function onFinish() {
    talbaiBurtgekh();
    if (!talbaiState.ashiglaltiinZardal) {
      talbaiState.ashiglaltiinZardal = 0;
    }
  }

  function onRefresh() {
    talbainiiJagsaaltMutate();
  }

  function test(data) {
    const khurunguud = formRef.current.getFieldsValue(khurunguud);
    formRef.current.setFieldsValue({
      [khurunguud]: {
        ...khurunguud,
        ["niit"]: khurunguud.une * khurunguud.too,
      },
    });
  }
  const [form] = Form.useForm();

  const [waiting, setWaiting] = useState(false);

  function talbaiOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => talbainiiJagsaaltMutate().finally(() => duusgakh())}
        >
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ExceleesOruulakh
          ref={excelref}
          token={token}
          onFinish={onRefresh}
          barilgiinId={barilgiinId}
          zam="talbaiTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Талбайн excel файл"
          zagvariinZam="talbainZagvarAvya"
        />
      ),
      footer,
    });
  }
  function duusgakh() {
    message.success("Амжилттай бүртгэгдлээ");
    setTimeout(excelref.current.khaaya(), 2500);
  }

  return (
    <Admin
      title="Талбай бүртгэл"
      khuudasniiNer="talbaiBurtgekh"
      setNeesenEsekh={setNeesenEsekh}
      tsonkhniiId={"61c2c63e1c2830c4e6f90c8d"}
      className="p-0 md:p-4"
      onSearch={(search) =>
        setTalbaiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      loading={waiting || isValidating}
    >
      <Card
        size="small"
        className="col-span-12 mb-14 md:col-span-12 md:mb-0 xl:col-span-12"
      >
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`zoom-in relative h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 lg:col-span-3 ${
                  JSON.stringify(query) === JSON.stringify(mur.query)
                    ? "bg-green-50 dark:bg-gray-900"
                    : ""
                }`}
                onClick={() => setQuery(mur.query)}
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <div className="h-full  w-[70vw] rounded-xl sm:w-auto">
                  <div className="rounded-xl p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {t(mur.utga)}
                        </div>
                      </div>
                      <div>
                        <div className="absolute right-2 top-2 flex text-xs text-green-600">
                          {t("Нийт м")}²: {formatNumber(mur.mk)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="ml-auto place-content-end p-5 md:flex"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="200"
        >
          <div
            className="  w-full place-content-end  md:pr-4"
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Button
              onClick={showDrawer}
              type="primary"
              className="w-full md:w-auto"
              style={{ marginTop: "10px" }}
              icon={<PictureOutlined style={{ fontSize: "16px" }} />}
            >
              <span>{t("План зураг харах")}</span>
            </Button>
            <Drawer
              width={"100vw"}
              title={t("Нэгдсэн План зураг")}
              placement="right"
              onClose={onClose}
              visible={open}
            >
              {open && (
                <Tailan
                  davkhar={talbaiState.davkhar}
                  baiguullaga={baiguullaga}
                  barilgiinId={barilgiinId}
                  token={token}
                  points={data.bairshil}
                  onFinish={(v) => {
                    onChange("bairshil", v);
                    onClose();
                  }}
                />
              )}
            </Drawer>
          </div>
          <div
            className="flex place-content-end justify-between gap-4 "
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Link
              href={{
                pathname: "/khyanalt/talbaiBurtgel/talbaiBurtgekh/new",
                query: { barilgiinId },
              }}
            >
              <Button
                type="primary"
                className="w-full md:w-auto"
                style={{ marginTop: "10px" }}
                icon={<PlusOutlined style={{ fontSize: "16px" }} />}
              >
                <span>{t("Нэмэх")}</span>
              </Button>
            </Link>

            <Popover
              content={() => (
                <div className="flex w-32 flex-col pl-4 ">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700  "
                    onClick={talbaiOruulakhExcel}
                  >
                    <UploadOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Оруулах")}</label>
                  </a>
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={() => {
                      const { Excel } = require("antd-table-saveas-excel");
                      const excelExport = new Excel();
                      excelExport
                        .addSheet("түрээсийн талбай")
                        .addColumns([
                          {
                            title: t("Дугаар"),
                            dataIndex: "kod",
                          },
                          {
                            title: t("Давхар"),
                            dataIndex: "davkhar",
                          },
                          {
                            title: t("Талбай/м2/"),
                            dataIndex: "talbainKhemjee",
                          },

                          {
                            title: t("Нийт үнэ/₮/"),
                            dataIndex: "talbainNiitUne",

                            render: (talbainNiitUne) => {
                              return formatNumber(talbainNiitUne || 0);
                            },
                          },
                          {
                            title: t("Зардал"),
                            dataIndex: "niitAshiglaltiinZardal",
                          },
                          {
                            title: t("Төлбөр"),
                            dataIndex: "tureesiinTulbur",
                          },
                          {
                            title: t("Тайлбар"),
                            dataIndex: "tailbar",
                          },
                        ])
                        .addDataSource(talbainiiGaralt?.jagsaalt)
                        .saveAs(`${t("түрээсийн талбай")}.xlsx`);
                    }}
                  >
                    <DownloadOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Татах")}</label>
                  </a>
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <Button
                type="primary"
                className="w-full md:w-auto"
                style={{ marginTop: "10px" }}
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
          </div>
        </div>
        <div
          data-aos="fade-up-left"
          data-aos-duration="1000"
          data-aos-delay="200"
          data-aos-anchor-placement="top-bottom"
          className="mt-5 md:mt-0"
        >
          <p className="py-2 font-medium md:hidden">{t("Талбайн жагсаалт")}</p>
          <CardList
            tileProps={{ talbaiUstgay, barilgiinId }}
            keyValue="talbai"
            cardListTuluv={"utas"}
            neesenEsekh={neesenEsekh}
            className="block overflow-auto md:hidden"
            jagsaalt={talbainiiGaralt?.jagsaalt}
            Component={TalbaiTile}
            pagination={{
              current: talbainiiGaralt?.khuudasniiDugaar,
              pageSize: talbainiiGaralt?.khuudasniiKhemjee,
              total: talbainiiGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setTalbaiKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />

          <Table
            className={"mt-6 hidden md:block"}
            bordered
            size="small"
            loading={!talbainiiGaralt}
            tableLayout={"fixed"}
            rowKey={(row) => row._id}
            scroll={{ y: "calc(100vh - 28rem)" }}
            dataSource={talbainiiGaralt?.jagsaalt}
            onChange={onChangeTable}
            pagination={{
              current: talbainiiGaralt?.khuudasniiDugaar,
              pageSize: talbainiiGaralt?.khuudasniiKhemjee,
              total: talbainiiGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setTalbaiKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            columns={[
              {
                title: "№",
                key: "index",
                align: "center",
                className: "text-center",
                render: (text, record, index) =>
                  (talbainiiGaralt?.khuudasniiDugaar || 0) *
                    (talbainiiGaralt?.khuudasniiKhemjee || 0) -
                  (talbainiiGaralt?.khuudasniiKhemjee || 0) +
                  index +
                  1,
                width: "1rem",
              },
              {
                title: t("Бүртгэсэн Огноо"),
                dataIndex: "createdAt",
                ellipsis: true,
                width: "2.5rem",
                align: "center",
                render(createdAt) {
                  return moment(createdAt).format("YYYY-MM-DD hh:mm");
                },
              },
              {
                title: t("Дугаар"),
                dataIndex: "kod",
                ellipsis: true,
                width: "1.5rem",
                align: "center",
                showSorterTooltip: false,
                sorter: () => 0,
              },
              {
                title: t("Давхар"),
                dataIndex: "davkhar",
                ellipsis: true,
                width: "1.2rem",
                align: "center",
                showSorterTooltip: false,
                sorter: () => 0,
                defaultSortOrder: "descend",
              },
              {
                title: t("Талбай/м2/"),
                dataIndex: "talbainKhemjee",
                align: "center",
                ellipsis: true,
                width: "2.1rem",
                showSorterTooltip: false,
                defaultSortOrder: "descend",
                sorter: () => 0,
              },
              {
                title: t("Талбай/м3/"),
                dataIndex: "talbainKhemjeeMetrKube",
                align: "center",
                ellipsis: true,
                width: "2rem",
                showSorterTooltip: false,
                defaultSortOrder: "descend",
                sorter: () => 0,
              },
              {
                title: t("Нийт үнэ/₮/"),
                dataIndex: "talbainNiitUne",
                ellipsis: true,
                align: "center",
                render: (talbainNiitUne) => {
                  return formatNumber(talbainNiitUne || 0, 0);
                },
                showSorterTooltip: false,
                defaultSortOrder: "descend",
                sorter: () => 0,
                width: "2.5rem",
              },
              {
                title: t("Зардал"),
                dataIndex: "niitAshiglaltiinZardal",
                align: "center",
                render: (data) => {
                  return formatNumber(data, 0) + "₮";
                },
                showSorterTooltip: false,
                defaultSortOrder: "descend",
                sorter: () => 0,
                width: "2rem",
              },
              {
                title: t("Төлбөр"),
                dataIndex: "tureesiinTulbur",
                align: "center",
                render: (data) => {
                  return formatNumber(data, 0) + "₮";
                },
                showSorterTooltip: false,
                defaultSortOrder: "descend",
                sorter: () => 0,
                width: "2.5rem",
              },

              {
                title: t("Тайлбар"),
                dataIndex: "tailbar",
                ellipsis: true,
                width: "4.5rem",
                align: "center",
                render(a) {
                  return <div className="text-left">{a}</div>;
                },
              },

              {
                title: t("Төлөв"),
                dataIndex: "idevkhiteiEsekh",
                ellipsis: true,
                width: "2rem",
                align: "center",
                showSorterTooltip: false,
                sorter: () => 0,
                render(idevkhiteiEsekh) {
                  return (
                    <Tag
                      className={
                        idevkhiteiEsekh === true
                          ? "dark:bg-green-600 dark:text-white"
                          : "dark:bg-red-700 dark:text-white"
                      }
                      color={idevkhiteiEsekh === true ? "green" : "red"}
                    >
                      {idevkhiteiEsekh === true ? t("Идэвхтэй") : t("Идэвхгүй")}
                    </Tag>
                  );
                },
              },
              {
                title: t("Ангилал"),
                dataIndex: "segmentuud",
                ellipsis: true,
                width: "1.5rem",
                align: "center",
                render(segmentuud) {
                  if (segmentuud?.length > 0) {
                    return (
                      <Popover
                        trigger="hover"
                        content={
                          <div>
                            <CardList
                              keyValue="segment"
                              className="max-h-[70vh] overflow-y-scroll rounded-md bg-[#F3F4F6] px-3 py-2"
                              jagsaalt={segmentuud}
                              Component={TalbaiSegment}
                              componentProps={{ token }}
                            />
                          </div>
                        }
                      >
                        <a className=" flex items-center justify-center  hover:scale-150 ">
                          <ImFileText2 className="text-xl" />
                        </a>
                      </Popover>
                    );
                  } else
                    return (
                      <div className=" flex items-center justify-center">
                        <ImFileEmpty className="text-xl text-gray-500" />
                      </div>
                    );
                },
              },
              {
                title: t("Хөрөнгө"),
                align: "center",
                ellipsis: true,
                width: "1.5rem",
                render: (data) => {
                  return (
                    data?.khurunguud !== undefined && (
                      <div className="flex flex-row justify-center">
                        <Popover
                          trigger="hover"
                          content={
                            <Table
                              pagination={false}
                              size="small"
                              dataSource={data?.khurunguud}
                              columns={[
                                {
                                  title: t("Нэр"),
                                  dataIndex: "ner",
                                },
                                {
                                  title: t("Тоо"),
                                  dataIndex: "too",
                                  align: "center",
                                },
                                {
                                  title: t("Үнэ"),
                                  dataIndex: "une",
                                  align: "center",
                                  render: (data) => {
                                    return formatNumber(data) + "₮";
                                  },
                                },
                                {
                                  title: t("Нийт"),
                                  dataIndex: "niit",
                                  align: "center",
                                  render: (data) => {
                                    return formatNumber(data) + "₮";
                                  },
                                },
                              ]}
                            ></Table>
                          }
                        >
                          <a className="flex items-center justify-center  hover:scale-125 ">
                            <Badge count={data?.khurunguud?.length}>
                              <MdOutlineInventory className="text-xl dark:text-gray-300 " />
                            </Badge>
                          </a>
                        </Popover>
                      </div>
                    )
                  );
                },
              },
              {
                title: t("Түүх"),
                width: "1.5rem",
                align: "center",
                render: (data) => {
                  return (
                    <div className="flex flex-row justify-center">
                      <Popover
                        trigger="click"
                        placement="topLeft"
                        content={
                          <Table
                            style={{
                              display: "flex",
                            }}
                            pagination={false}
                            size="small"
                            dataSource={gereeniiMedeelel?.jagsaalt}
                            columns={[
                              {
                                title: `${t("Гэрээ")} №`,
                                dataIndex: "gereeniiDugaar",
                              },
                              {
                                title: t("Овог"),
                                dataIndex: "ovog",
                              },
                              {
                                title: t("Нэр"),
                                dataIndex: "ner",
                              },
                              {
                                title: t("Регистр"),
                                dataIndex: "register",
                              },
                              {
                                title: t("Төрөл"),
                                dataIndex: "turul",
                              },
                              {
                                title: t("Гэрээний огноо"),
                                dataIndex: "gereeniiOgnoo",
                                render: (data) => {
                                  return moment(data).format("YYYY-MM-DD");
                                },
                              },
                              {
                                title: t("Дуусах огноо"),
                                dataIndex: "duusakhOgnoo",
                                render: (data) => {
                                  return moment(data).format("YYYY-MM-DD");
                                },
                              },
                              {
                                title: t("Хугацаа"),
                                dataIndex: "khugatsaa",
                              },
                              {
                                title: t("Сарын түрээс"),
                                dataIndex: "sariinTurees",
                                align: "center",
                                render: (data) => {
                                  return formatNumber(data) + "₮";
                                },
                              },
                            ]}
                          ></Table>
                        }
                      >
                        <a className="flex items-center justify-center hover:scale-150">
                          <GiBackwardTime
                            className="text-2xl"
                            onClick={() =>
                              setShuult((a) => ({
                                ...a,
                                query: { talbainDugaar: data.kod },
                              }))
                            }
                          />
                        </a>
                      </Popover>
                    </div>
                  );
                },
              },
              {
                title: () => <SettingOutlined />,
                ellipsis: true,
                width: "1rem",
                align: "center",
                render: (data) => (
                  <div className="flex flex-row justify-center">
                    <Popover
                      placement="bottom"
                      trigger="click"
                      content={() => (
                        <div className="flex w-24 flex-col space-y-2">
                          <Link
                            href={{
                              pathname: `/khyanalt/talbaiBurtgel/talbaiBurtgekh/${data._id}`,
                              query: {
                                data: JSON.stringify(data),
                                barilgiinId,
                              },
                            }}
                          >
                            <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 ">
                              <EditOutlined style={{ fontSize: "18px" }} />
                              <label>{t("Засах")}</label>
                            </a>
                          </Link>
                          <Popconfirm
                            title="Талбай устгах уу?"
                            okText={t("Тийм")}
                            cancelText={t("Үгүй")}
                            onConfirm={() => talbaiUstgay(data)}
                          >
                            <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 ">
                              <DeleteOutlined
                                style={{ fontSize: "18px", color: "red" }}
                              />
                              <label>{t("Устгах")}</label>
                            </a>
                          </Popconfirm>
                        </div>
                      )}
                    >
                      <a className=" flex items-center justify-center  hover:scale-150">
                        <MoreOutlined style={{ fontSize: "18px" }} />
                      </a>
                    </Popover>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default talbaiBurtgekh;
