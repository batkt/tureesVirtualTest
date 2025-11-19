import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import {
  Button,
  Card,
  Popconfirm,
  Popover,
  Space,
  Tabs,
  Table,
  Tooltip,
  message,
  notification,
  Modal,
  Form,
  Input,
} from "antd";
import {
  DeleteOutlined,
  DollarCircleOutlined,
  DownOutlined,
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  MoreOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";

import { useRef, useEffect } from "react";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import { modal } from "components/ant/Modal";
import { useZochin, useZochinToololt } from "hooks/useZochin";
import useOrder from "tools/function/useOrder";
import moment from "moment";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import deleteMethod from "../../../tools/function/crud/deleteMethod";
import TogloomTile from "components/pageComponents/togloom/TogloomTile";
import uilchilgee from "services/uilchilgee";
import { useRouter } from "next/router";
import Tseneglekh from "components/pageComponents/zogsool/Tseneglekh";
import ZochinBurtgel from "components/pageComponents/zogsool/ZochinBurtgel";

function orshinSuugch({ token }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { baiguullaga, barilgiinId, ajiltan, baiguullagiinId } = useAuth();
  const excelref = useRef(null);
  const tseneglekhRef = useRef(null);
  const mashinref = useRef(null);
  const [turul, setTurul] = useState("Нийт");
  const [tuluv, setTuluv] = useState("");
  const [udurShuult, setUdurShuult] = useState("niit");
  const [songogdsonMashin, setSongogdsonMashin] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [butsaakh, setButsaakh] = useState(false);
  const [khelber, setKhelber] = useState("1");
  const [nuutsUgKhariltsagch, setNuutsUgKhariltsagch] = useState();
  const [resetForm] = Form.useForm();

  const formRef = useRef();

  const query = useMemo(() => {
    var query = {};
    if (turul !== "Нийт") {
      query.turul = turul;
      if (turul === "Гэрээт") {
        if (udurShuult === "idevkhitei") {
          query.duusakhOgnoo = {
            $gt: moment(),
          };
        }
        if (udurShuult === "idevkhigui") {
          query.duusakhOgnoo = {
            $lte: moment(),
          };
        }
        if (udurShuult === "niit") {
          query.duusakhOgnoo = undefined;
        }
      }
      if (tuluv !== "") {
        if (tuluv !== "Үнэгүй") {
          query.khungulultTurul = tuluv;
        } else {
          query.tuluv = tuluv;
        }
      }
      return query;
    }
  }, [turul, tuluv, udurShuult]);

  const { order, onChangeTable } = useOrder({
    createdAt: -1,
  });

  const {
    setZochinKhuudaslalt,
    zochinGaralt,
    zochinMutate,
    isValidating,
    zochinHadgalya,
    isLoading: zochinSaveLoading,
  } = useZochin(token, baiguullaga?._id, 10, query, order);

  const { khariltsagchToololt, khariltsagchToololtMutate } =
    useZochinToololt(token);

  useEffect(() => {
    if (zochinGaralt && !butsaakh) {
      const fetchData = async () => {
        try {
          const response = await uilchilgee(token).get("mashin/tooAvya", {
            params: {
              khuudasniiKhemjee: zochinGaralt.niitMur,
              query: {
                turul: "Гэрээт",
                duusakhOgnoo: {
                  $lte: moment().add(2, "day"),
                  $gt: moment(),
                },
              },
            },
          });
          if (response?.data?.niitMur > 0) {
            notification.warning({
              message: t(
                `Хугацаа дуусах ${response?.data?.niitMur} машин байна`
              ),
            });
          }
          setButsaakh(true);
        } catch (error) {
          message.error(error);
        }
      };
      fetchData();
    }
  }, [zochinGaralt, butsaakh]);

  const tsenegliy = (data) => {
    const footer = [
      <Space>
        <Button type="default" onClick={() => tseneglekhRef.current.khaaya()}>
          {t("Хаах")}
        </Button>
        <Button
          type="primary"
          onClick={() => tseneglekhRef.current.khadgalya()}
        >
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      content: (
        <Tseneglekh
          ref={tseneglekhRef}
          token={token}
          data={data}
          barilgiinId={barilgiinId}
          mutate={zochinMutate}
        />
      ),
      footer,
    });
  };

  const nuutsUgModalKhaah = () => {
    setNuutsUgKhariltsagch(false);
  };

  function shineNuutsUgSolikh(talbar, utga) {
    setNuutsUgKhariltsagch((a) => ({ ...a, [talbar]: utga }));
  }

  function nuutsUgSolikh() {
    let { errors } = resetForm.getFieldsError();
    if (!!errors) {
      return;
    }
    if (nuutsUgKhariltsagch.nuutsUg === nuutsUgKhariltsagch.davtanNuutsUg) {
      uilchilgee(token)
        .put(`/khariltsagch/${nuutsUgKhariltsagch._id}`, {
          _id: nuutsUgKhariltsagch._id,
          nuutsUg: nuutsUgKhariltsagch.nuutsUg,
        })
        .then(({ data }) => {
          if (data !== undefined) {
            notification.success({
              message: t("Мэдэгдэл"),
              description: t("Нууц үг амжилттай шинэчлэгдлээ"),
            });
            setNuutsUgKhariltsagch(false);
            resetForm.resetFields();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else
      notification.warning({
        message: t("Мэдэгдэл"),
        description: t("Нууц үг таарсангүй"),
      });
  }

  const columns = useMemo(() => {
    return [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "2rem",
        render: (text, record, index) =>
          (zochinGaralt?.khuudasniiDugaar || 0) *
            (zochinGaralt?.khuudasniiKhemjee || 0) -
          (zochinGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Бүртгэсэн"),
        dataIndex: "createdAt",
        width: "8rem",
        ellipsis: true,
        align: "center",
        render(date) {
          return moment(date).format("YYYY-MM-DD HH:mm");
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Нэр"),
        align: "left",
        width: "8rem",
        dataIndex: "ner",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Утас"),
        width: "7rem",
        align: "center",
        dataIndex: "utas",
      },
      {
        title: t("Дугаар"),
        width: "6rem",
        align: "center",
        dataIndex: "mashiniiDugaar",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Төрөл"),
        align: "center",
        width: "10rem",
        dataIndex: "zochinTurul",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Тайлбар"),
        width: "12rem",
        align: "center",
        dataIndex: "zochinTailbar",
        showSorterTooltip: false,
        render: (v) => (
          <Tooltip title={v}>
            <div className="w-full cursor-help truncate break-words text-left">
              {v}
            </div>
          </Tooltip>
        ),
      },
      {
        title: t("Тоот"),
        width: "12rem",
        align: "center",
        dataIndex: "ezenToot",
        showSorterTooltip: false,
        render: (v) => (
          <Tooltip title={v}>
            <div className="w-full cursor-help truncate break-words text-left">
              {v}
            </div>
          </Tooltip>
        ),
      },
      {
        title: () => <SettingOutlined />,
        width: "2rem",
        align: "center",
        render: (data) => (
          <div className="flex flex-row justify-center">
            <Popover
              zIndex={99}
              placement="bottom"
              trigger="hover"
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  {data?.turul !== "Дотоод" && (
                    <a
                      className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        tsenegliy(data);
                      }}
                    >
                      <DollarCircleOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Цэнэглэх")}</label>
                    </a>
                  )}
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      zochinBurtgekh(data);
                    }}
                  >
                    <EditOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Засах")}</label>
                  </a>
                  <Popconfirm
                    title={t("Нууц үг сэргээх үү?")}
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={() => setNuutsUgKhariltsagch(data)}
                  >
                    <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
                      <RedoOutlined
                        className="text-green-600"
                        style={{ fontSize: "18px" }}
                      />
                      <label className="text-green-600">{t("Нууц үг")}</label>
                    </a>
                  </Popconfirm>
                  <Popconfirm
                    placement="left"
                    title={t("Машин устгах уу?")}
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={() => mashinUstgaya(data)}
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
              <a className="flex items-center justify-center hover:scale-150 dark:hover:bg-gray-700">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },
    ];
  }, [turul, baiguullaga, barilgiinId, tuluv, udurShuult, zochinGaralt]);

  function onRefresh() {
    zochinMutate();
    khariltsagchToololtMutate();
  }

  function excelTatajAvya(token, service, mur, sheet, query, order, sheetName) {
    uilchilgee(token)
      .get(service, {
        params: { query, order, khuudasniiKhemjee: mur },
      })
      .then(({ data }) => {
        const { Excel } = require("antd-table-saveas-excel");
        const excel = new Excel();
        excel
          .addSheet(sheetName)
          .addColumns(sheet)
          .addDataSource(data?.jagsaalt)
          .saveAs(sheetName + ".xlsx");
      });
  }

  function mashinOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
        <Button style={{ backgroundColor: "#209669", color: "#ffffff" }}>
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
          zam="mashiniiExcelTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Машины мэдээлэл оруулах excel файл"
          zagvariinZam="mashiniiExcelAvya"
        />
      ),
      footer,
    });
  }

  async function mashinUstgaya(data) {
    let khariltsagchIds = [];

    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === "string") {
        khariltsagchIds = data.filter((id) => id && typeof id === "string");
      } else {
        khariltsagchIds = data
          .map((item) => item._id || item.id)
          .filter((id) => id);
      }
    } else if (data && data.jagsaalt && Array.isArray(data.jagsaalt)) {
      khariltsagchIds = data.jagsaalt
        .map((item) => item._id || item.id)
        .filter((id) => id);
    } else if (data && (data._id || data.id)) {
      khariltsagchIds = [data._id || data.id];
    } else if (
      data &&
      data.selectedItems &&
      Array.isArray(data.selectedItems)
    ) {
      khariltsagchIds = data.selectedItems
        .map((item) => item._id || item.id)
        .filter((id) => id);
    } else {
      message.error(t("Машин сонгоно уу"));
      return;
    }

    if (khariltsagchIds.length === 0) {
      message.error(t("Машин сонгоно уу"));
      return;
    }

    try {
      const khariltsagchPromises = khariltsagchIds.map((khariltsagchId) =>
        uilchilgee(token).get(`khariltsagch/${khariltsagchId}`)
      );
      const khariltsagchResponses = await Promise.all(khariltsagchPromises);

      const mashiniiDugaarList = khariltsagchResponses
        .filter((response) => response.data?.mashiniiDugaar)
        .map((response) => response.data.mashiniiDugaar);

      const mashinPromises = mashiniiDugaarList.map((dugaar) =>
        uilchilgee(token).get("mashin", {
          params: {
            query: {
              baiguullagiinId,
              barilgiinId,
              dugaar,
            },
          },
        })
      );
      const mashinResponses = await Promise.all(mashinPromises);

      const mashinIds = mashinResponses
        .flatMap((response) => response.data?.jagsaalt || [])
        .map((record) => record._id)
        .filter((id) => id);

      const khariltsagchDeletePromises = khariltsagchIds.map((khariltsagchId) =>
        deleteMethod("khariltsagch", token, khariltsagchId)
      );

      const mashinDeletePromises = mashinIds.map((mashinId) =>
        deleteMethod("mashin", token, mashinId)
      );

      const results = await Promise.all([
        ...khariltsagchDeletePromises,
        ...mashinDeletePromises,
      ]);

      const allSuccessful = results.every(
        (result) => result.data === "Amjilttai" || result.data?.success
      );

      setSongogdsonMashin([]);
      if (allSuccessful) {
        zochinMutate();
        khariltsagchToololtMutate();
        message.success(
          t(`${khariltsagchIds.length} машин амжилттай устгагдлаа`)
        );
      } else {
        message.error(t("Зарим машин устгаж чадсангүй"));
      }
    } catch (error) {
      message.error(
        t("Алдаа гарлаа: ") + (error.response?.data?.message || error.message)
      );
    }
  }

  async function mashinUstgayaSafe(data) {
    const maxRetries = 10;
    let retries = 0;
    let processedData = data;

    while (retries < maxRetries) {
      if (
        processedData &&
        processedData.jagsaalt &&
        Array.isArray(processedData.jagsaalt) &&
        processedData.jagsaalt.length > 0
      ) {
        break;
      }

      if (Array.isArray(processedData) && processedData.length > 0) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
      retries++;
    }

    if (retries >= maxRetries) {
      message.error(t("Машин сонгоно уу"));
      return;
    }

    return mashinUstgaya(processedData);
  }
  function zochinBurtgekh(data) {
    let zochinBurtgekhButtonId = "zochinBurtgekhButtonId";
    const footer = [
      <Space key="footer">
        <Button
          onClick={() => mashinref.current.khaaya()}
          disabled={zochinSaveLoading}
        >
          {t("Хаах")}
        </Button>
        <Button
          type="primary"
          id={zochinBurtgekhButtonId}
          onClick={() => mashinref.current.khadgalya()}
          loading={zochinSaveLoading}
        >
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      title: data ? t("Зочин засах") : t("Зочин нэмэх"),
      icon: <PlusOutlined />,
      content: (
        <ZochinBurtgel
          zochinBurtgekhButtonId={zochinBurtgekhButtonId}
          ref={mashinref}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          baiguullagiinId={baiguullaga?._id}
          dotorGadnaTsagEsekh={baiguullaga?.tokhirgoo?.dotorGadnaTsagEsekh}
          data={data}
          ajiltan={ajiltan}
        />
      ),
      footer,
      maskClosable: !zochinSaveLoading,
      closable: !zochinSaveLoading,
    });
  }

  useEffect(() => {
    Aos.init({ once: true });
  });
  return (
    <Admin
      title="Оршин суугч"
      khuudasniiNer="orshinSuugch"
      className="p-0 md:p-4"
      tsonkhniiId={"68999410a7176eab66165f1b"}
      onSearch={(search) => {
        setZochinKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }));
      }}
      loading={isValidating}
    >
      <Card className="col-span-12">
        <div
          className="flex flex-row"
          data-aos="zoom-out-up"
          data-aos-duration="1000"
          data-aos-delay="100"
        >
          <div className="mb-5 ml-auto flex items-center justify-center space-x-5 md:mb-0">
            {khelber === "1" ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => zochinBurtgekh()}
                loading={zochinSaveLoading}
              >
                {t("Машин нэмэх")}
              </Button>
            ) : (
              ""
            )}

            <Popover
              content={() => (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex w-32 flex-col">
                    <a
                      className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                      onClick={mashinOruulakhExcel}
                    >
                      <UploadOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Оруулах")}</label>
                    </a>
                  </div>
                  <div className="flex w-32 flex-col">
                    <a
                      className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                      onClick={() =>
                        khelber === "1"
                          ? excelTatajAvya(
                              token,
                              "/khariltsagch",
                              zochinGaralt?.niitMur,
                              [
                                {
                                  title: t("Бүртгэсэн"),
                                  dataIndex: "createdAt",
                                  render(date) {
                                    return moment(date).format(
                                      "YYYY-MM-DD HH:mm"
                                    );
                                  },
                                },
                                {
                                  title: t("Нэр"),
                                  dataIndex: "ner",
                                },
                                {
                                  title: t("Утас"),
                                  dataIndex: "utas",
                                },
                                {
                                  title: t("Дугаар"),
                                  dataIndex: "mashiniiDugaar",
                                },
                                {
                                  title: t("Төрөл"),
                                  dataIndex: "zochinTurul",
                                },

                                {
                                  title: "Хөнгөлөлт",
                                  dataIndex: "khungulultTurul",
                                  render: (a, b) => {
                                    return b.tuluv !== "Үнэгүй"
                                      ? a === "togtmolTsag"
                                        ? b.uldegdelKhungulukhKhugatsaa + "мин"
                                        : a === "khuviKhungulult"
                                        ? b.khungulult
                                        : ""
                                      : b.tuluv;
                                  },
                                },
                                {
                                  title: t("Тайлбар"),
                                  dataIndex: "zochinTailbar",
                                },
                              ],
                              query,
                              order,
                              "Оршин суугчийн машины бүртгэл"
                            )
                          : excelTatajAvya(token, undefined, undefined)
                      }
                    >
                      <DownloadOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Татах")}</label>
                    </a>
                  </div>
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <Button
                type="primary"
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
            <Popconfirm
              placement="left"
              title={t("Машин устгах уу?")}
              okText={t("Тийм")}
              cancelText={t("Үгүй")}
              onConfirm={() => {
                if (activeTab === "1") {
                  mashinUstgaya(songogdsonMashin);
                }
              }}
            >
              <Button
                className="border-red-400 dark:border-red-400 dark:bg-gray-900"
                icon={<DeleteOutlined />}
                disabled={zochinSaveLoading}
              >
                {t("Устгах")}
              </Button>
            </Popconfirm>
          </div>
        </div>
        <Tabs
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          items={[
            {
              key: "1",
              label: t("Оршин суугч бүртгэх"),
              children: (
                <Table
                  className="hidden overflow-auto md:block"
                  tableLayout="fixed"
                  loading={!zochinGaralt || zochinSaveLoading}
                  dataSource={zochinGaralt?.jagsaalt}
                  scroll={{ y: "calc(100vh - 30rem)" }}
                  size="small"
                  bordered
                  rowKey={(record) => record._id}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: songogdsonMashin,
                    onChange: (selectedRowKeys) => {
                      setSongogdsonMashin(selectedRowKeys);
                    },
                    getCheckboxProps: () => ({
                      disabled: zochinSaveLoading,
                    }),
                  }}
                  onChange={onChangeTable}
                  columns={columns}
                  pagination={{
                    current: zochinGaralt?.khuudasniiDugaar,
                    pageSize: zochinGaralt?.khuudasniiKhemjee,
                    total: zochinGaralt?.niitMur,
                    showSizeChanger: true,
                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                      setZochinKhuudaslalt((kh) => ({
                        ...kh,
                        khuudasniiDugaar,
                        khuudasniiKhemjee,
                      })),
                    disabled: zochinSaveLoading,
                  }}
                />
              ),
            },
          ]}
          onChange={(v) => {
            setKhelber(v);
            setActiveTab(v);
          }}
          disabled={zochinSaveLoading}
        />
        <Modal
          title={t("Нууц үг сэргээх")}
          open={!!nuutsUgKhariltsagch}
          onOk={() => nuutsUgSolikh(nuutsUgKhariltsagch)}
          onCancel={nuutsUgModalKhaah}
          okText={t("Сэргээх")}
          cancelText={t("Цуцлах")}
        >
          <Form
            autoComplete={"off"}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            ref={formRef}
          >
            <Form.Item
              label={t("Нууц үг сэргээх")}
              name="sergesenNuutsUg"
              onChange={(e) => shineNuutsUgSolikh("nuutsUg", e.target.value)}
              rules={[
                {
                  required: true,
                  message: t("Нууц үг оруулна уу"),
                },
              ]}
            >
              <Input.Password style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label={t("Нууц үг давтан оруулах")} name="davtanNuutsUg">
              <Input.Password
                onChange={(e) =>
                  shineNuutsUgSolikh("davtanNuutsUg", e.target.value)
                }
              />
            </Form.Item>
          </Form>
        </Modal>
        <CardList
          cardListTuluv={"utas"}
          keyValue="uilchluulegch"
          className="block overflow-auto md:hidden"
          jagsaalt={zochinGaralt?.jagsaalt}
          Component={TogloomTile}
        />
      </Card>

      {zochinSaveLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-gray-700 dark:text-gray-300">
                {t("Хадгалж байна...")}
              </span>
            </div>
          </div>
        </div>
      )}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default orshinSuugch;
