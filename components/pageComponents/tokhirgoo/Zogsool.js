import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Input,
  notification,
  InputNumber,
  Card,
  Table,
  Tooltip,
  Popover,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  CloseCircleOutlined,
  SettingOutlined,
  EditOutlined,
  RedoOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import uilchilgee from "services/uilchilgee";
import { useTranslation } from "react-i18next";
import { modal } from "../../ant/Modal";
import ZogsoolBurtgekh from "./ZogsoolBurtgekh";
import moment from "moment";
import useJagsaalt from "../../../hooks/useJagsaalt";
import deleteMethod from "../../../tools/function/crud/deleteMethod";
import SmsZagvar from "./SmsZagvar";
import useOrder from "tools/function/useOrder";

function Zogsool({
  token,
  baiguullaga,
  baiguullagaMutate,
  barilgiinId,
  setSongogdsonTsonkhniiIndex,
}) {
  const { t } = useTranslation();
  const ref = React.useRef(null);
  const { order } = useOrder({ createdAt: -1 });

  const khariltsagchiinMsjTuukhKharakh = useMemo(() => {
    return { barilgiinId: barilgiinId };
  });

  const query = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga._id,
      barilgiinId: barilgiinId,
    };
  }, [baiguullaga._id, barilgiinId]);

  const msjTuukh = useJagsaalt(
    "/msgTuukh",
    khariltsagchiinMsjTuukhKharakh,
    order
  );

  const jagsaalt = useJagsaalt("/zogsoolJagsaalt", query, { createdAt: -1 });
  useEffect(() => {
    jagsaalt.setKhuudaslalt((e) => ({ ...e, khuudasniiKhemjee: 10 }));
  }, []);
  const columns = useMemo(() => [
    {
      title: "№",
      width: "3rem",
      align: "center",
      render: (text, record, index) =>
        (jagsaalt?.data?.khuudasniiDugaar || 0) *
          (jagsaalt?.data?.khuudasniiKhemjee || 0) -
        (jagsaalt?.data?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: t("Зогсоолын нэр"),
      dataIndex: "ner",
      ellipsis: true,
      width: "8rem",
      align: "center",
    },
    {
      title: t("Дотор зогоол эсэх"),
      dataIndex: "ajiltniiNer",
      ellipsis: true,
      width: "7rem",
      align: "center",
    },
    {
      title: t("Хаалганы тоо"),
      dataIndex: "khaalga",
      width: "10rem",
      ellipsis: true,
      align: "center",
      render(a, b) {
        return <div>{a.length > 0 ? a.length : "-"}</div>;
      },
    },
    {
      title: "Зогсоолын тоо",
      width: "8rem",
      dataIndex: "too",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Үнэ",
      width: "7rem",
      dataIndex: "undsenUne",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Огноо"),
      dataIndex: "ognoo",
      width: "9rem",
      ellipsis: true,
      align: "center",
      render(a) {
        return moment(a).format("YYYY-MM-DD, HH:mm");
      },
    },
    {
      title: () => <SettingOutlined />,
      width: "2rem",
      align: "center",
      render: (data) => (
        <div className="flex flex-row">
          <Popover
            placement="bottom"
            trigger="hover"
            content={() => (
              <div className="flex w-24 flex-col space-y-2">
                <a
                  className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                  onClick={() => zogsoolBurtegye(data, "zasah")}
                >
                  <EditOutlined style={{ fontSize: "18px" }} />
                  <label>{t("Засах")}</label>
                </a>
                <Popconfirm
                  title={t("Зогсоол устгах уу?")}
                  okText={t("Тийм")}
                  cancelText={t("Үгүй")}
                  onConfirm={() => zogsoolUstgaya(data)}
                >
                  <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
                    <DeleteOutlined
                      className="text-red-600"
                      style={{ fontSize: "18px" }}
                    />
                    <label className="text-red-600">{t("Устгах")}</label>
                  </a>
                </Popconfirm>
              </div>
            )}
          >
            <a className=" flex items-center justify-center  hover:scale-150 dark:hover:bg-gray-700">
              <MoreOutlined style={{ fontSize: "18px" }} />
            </a>
          </Popover>
        </div>
      ),
    },
  ]);

  const smsColumns = useMemo(() => [
    {
      title: "№",
      width: "3rem",
      align: "center",
      render: (text, record, index) =>
        (msjTuukh?.data?.khuudasniiDugaar || 0) *
          (msjTuukh?.data?.khuudasniiKhemjee || 0) -
        (msjTuukh?.data?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: t("Огноо"),
      dataIndex: "createdAt",
      width: "9rem",
      ellipsis: true,
      align: "center",
      render(a) {
        return moment(a).format("YYYY-MM-DD, HH:mm");
      },
    },
    {
      title: t("Дугаар"),
      dataIndex: "dugaar",
      width: "9rem",
      ellipsis: true,
      align: "center",
      render(a, data) {
        return (
          <Popover
            content={
              <div>
                <div>
                  {data.dugaar.map((e) => (
                    <div>{e}</div>
                  ))}
                </div>
              </div>
            }
            placement={"top"}
          >
            {data.dugaar[0]}
          </Popover>
        );
      },
    },
    {
      title: "",
      dataIndex: "msg",
      width: "9rem",
      ellipsis: true,
      align: "center",
      render(a, data) {
        return (
          <Popover
            content={
              <div>
                <div>{a}</div>
              </div>
            }
            placement={"top"}
          >
            <div className="truncate">{data?.msg}</div>
          </Popover>
        );
      },
    },
  ]);

  function zogsoolUstgaya(data) {
    deleteMethod("parking", token, data?._id).then(
      ({ data }) => data === "Amjilttai" && jagsaalt.refresh()
    );
  }

  function zogsoolBurtegye(data, p) {
    const d = p === "zasah" ? data : null;
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      top: 0,
      width: 1400,
      title: t("Зогсоол бүртгэх"),
      icon: <PlusOutlined />,
      content: (
        <ZogsoolBurtgekh
          ref={ref}
          data={d}
          jagsaalt={jagsaalt.jagsaalt}
          barilgiinId={barilgiinId}
          token={token}
          refresh={jagsaalt.refresh}
        />
      ),
      footer,
    });
  }

  function smsZagvar() {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      top: 0,
      width: 400,
      title: "Загвар бүртгэх",
      icon: <PlusOutlined />,
      content: (
        <SmsZagvar
          barilgiinId={barilgiinId}
          token={token}
          ref={ref}
          baiguullaga={baiguullaga}
          baiguullagaMutate={baiguullagaMutate}
          // jagsaalt={jagsaalt.jagsaalt}
          // refresh={jagsaalt.refresh}
        />
      ),
      footer,
    });
  }

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-12">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Зогсоол тохиргоо")}
            </h2>
            <div
              className="dark:border-dark-5 flex items-center justify-end pb-2"
              onClick={() => zogsoolBurtegye(jagsaalt, null)}
            >
              <Button type="primary">Зогсоол бүртгэх</Button>
            </div>
          </div>
        </div>
        <div className="box p-5">
          <Table
            bordered
            size="small"
            dataSource={jagsaalt?.jagsaalt}
            scroll={{ y: "calc( 100vh - 21rem )" }}
            columns={columns}
            pagination={{
              current: jagsaalt?.data?.khuudasniiDugaar,
              pageSize: jagsaalt?.data?.khuudasniiKhemjee,
              total: jagsaalt?.data?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                jagsaalt.setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
        </div>

        <div className="box mt-5 ">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {/* {t("Зогсоол тохиргоо")} */}
              СМС тохиргоо
            </h2>
            <div
              className="dark:border-dark-5 flex items-center justify-end pb-2"
              onClick={() => smsZagvar()}
            >
              <Button type="primary">СМС загвар</Button>
            </div>
          </div>
        </div>
        <div className="box p-5" style={{ minHeight: "10vh" }}>
          <Table
            bordered
            size="small"
            dataSource={msjTuukh?.jagsaalt}
            scroll={{ y: "calc( 100vh - 45rem )" }}
            columns={smsColumns}
            pagination={{
              current: msjTuukh?.data?.khuudasniiDugaar,
              pageSize: msjTuukh?.data?.khuudasniiKhemjee,
              total: msjTuukh?.data?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                msjTuukh.setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Zogsool;

{
  /*

useEffect(() => {
    if (baiguullaga !== undefined) {
      setZogsoolTokhirgoo({
        zogsooliinMinut: baiguullaga?.tokhirgoo?.zogsooliinMinut,
        zogsooliinDun: baiguullaga?.tokhirgoo?.zogsooliinDun,
        zogsooliinKhungulukhMinut:
          baiguullaga?.tokhirgoo?.zogsooliinKhungulukhMinut,
      });
    }
  }, [baiguullaga]);

const isChanged = useMemo(() => {
      if (!zogsoolTokhirgoo) return false;
      return (
        baiguullaga?.tokhirgoo?.zogsooliinMinut !==
        zogsoolTokhirgoo["zogsooliinMinut"] ||
        baiguullaga?.tokhirgoo?.zogsooliinDun !==
        zogsoolTokhirgoo["zogsooliinDun"] ||
        baiguullaga?.tokhirgoo?.zogsooliinKhungulukhMinut !==
        zogsoolTokhirgoo["zogsooliinKhungulukhMinut"]
      );
    }, [zogsoolTokhirgoo, baiguullaga]);

<div className="box mt-5 lg:mt-0">
  <div className="w-full flex py-8 px-5 2xl:flex-row flex-col justify-between items-center 2xl:gap-20 gap-8">
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <h2 className="text-xl">Орох Камер</h2>
      <div className="border aspect-[3/2] w-full flex justify-center items-center bg-gray-400"><p>cameraOroh</p></div>
    </div>
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <h2 className="text-xl">Гарах Камер</h2>
      <div className="border aspect-[3/2] w-full flex justify-center items-center bg-gray-400"><p>cameraGarah</p></div>
    </div>
  </div>
</div>
<div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
    <div className="box w-full p-5 flex flex-col 2xl:gap-10 gap-5">
    <div className="border 2xl:aspect-[3/2] aspect-square flex justify-center items-center bg-gray-400"><p>Camera1</p></div>
<div className="grid 2xl:grid-cols-2 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-5 2xl:gap-20">
    <div className="border 2xl:aspect-[3/2] xl:aspect-[3/2] lg:aspect-[3/2] aspect-square bg-gray-400"><p>Camera2</p></div>
<div className="border 2xl:aspect-[3/2] xl:aspect-[3/2] lg:aspect-[3/2] aspect-square bg-gray-400"><p>Camera3</p></div>
<div className="border 2xl:aspect-[3/2] xl:aspect-[3/2] lg:aspect-[3/2] aspect-square bg-gray-400"><p>Camera4</p></div>
<div className="border 2xl:aspect-[3/2] xl:aspect-[3/2] lg:aspect-[3/2] aspect-square bg-gray-400"><p>Camera5</p></div>
</div>
</div>
</div>*/
}
