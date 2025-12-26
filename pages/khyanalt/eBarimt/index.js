import moment from "moment";
import { useAuth } from "services/auth";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Card,
  DatePicker,
  message,
  Popconfirm,
  Spin,
  Select,
  Table as AntdTable,
} from "antd";
import { toast } from "sonner";
import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import { useMemo, useState, useEffect } from "react";
import useEBarimt from "hooks/useEBarimt";
import useEBarimtMedeelel from "hooks/useEBarimtMedeelel";
import { useBarimtToollolt } from "hooks/useEBarimt";
import useOrder from "tools/function/useOrder";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import { Excel } from "antd-table-saveas-excel";

const { RangePicker } = DatePicker;

const searchKeys = [
  "customerNo",
  "cashAmount",
  "billId",
  "id",
  "customerTin",
  "mashiniiDugaar",
  "gereeniiDugaar",
  "talbainDugaar",
  "togloomNer",
  "togloomUtas",
];

function EbarimtMedeelel({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const { t } = useTranslation();
  const { ajiltan, barilgiinId } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()]);

  const [loading, setLoading] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [uilchilgeeAvi, setUilchilgeeAvi] = useState();

  const query = useMemo(() => {
    const yavuulahQuery = {
      ustgasanOgnoo: { $exists: false },
      createdAt: ekhlekhOgnoo
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };

    if (uilchilgeeAvi) {
      if (uilchilgeeAvi === "Зогсоол") {
        yavuulahQuery.mashiniiDugaar = { $exists: true };
      } else if (uilchilgeeAvi === "Түрээс") {
        yavuulahQuery.gereeniiDugaar = { $exists: true };
      } else if (uilchilgeeAvi === "Тоглоом") {
        yavuulahQuery.togloomiinId = { $exists: true };
      }
    }

    return yavuulahQuery;
  }, [ekhlekhOgnoo, uilchilgeeAvi]);

  const queryToololt = useMemo(() => {
    const query = {
      barilgiinId: barilgiinId,
      baiguullagiinId: ajiltan?.baiguullagiinId,
      ekhlekhOgnoo: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
    };

    if (uilchilgeeAvi) {
      if (uilchilgeeAvi === "Зогсоол") {
        query.barimtTurul = "mashiniiDugaar";
      } else if (uilchilgeeAvi === "Түрээс") {
        query.barimtTurul = "gereeniiDugaar";
      } else if (uilchilgeeAvi === "Тоглоом") {
        query.barimtTurul = "togloomiinId";
      }
    }
    return query;
  }, [barilgiinId, ajiltan?.baiguullagiinId, ekhlekhOgnoo, uilchilgeeAvi]);

  const { order, onChangeTable } = useOrder({ createAt: -1 });

  const { eBarimtGaralt, eBarimtMutate, setEBarimtKhuudaslalt, isValidating } =
    useEBarimt(
      barilgiinId && token,
      ajiltan?.baiguullagiinId,
      query,
      order,
      searchKeys
    );

  const { eBarimtMedeelel, eBarimtMedeelelMutate } = useEBarimtMedeelel(
    barilgiinId && token,
    barilgiinId
  );
  const { ebarimtiinToololt, ebarimtiinToololtMutate } = useBarimtToollolt(
    barilgiinId && token,
    queryToololt
  );

  const khyanaltiinDun = [
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.avakhToo, 0)
          : 0,
      utga: t("Баримт авах тоо"),
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.avakhDun, 0)
          : 0,
      utga: t("Баримт авах дүн"),
    },

    {
      too: eBarimtGaralt?.niitMur || 0,
      utga: t("Баримт авсан тоо"),
    },

    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.ilgeesenDun, 0)
          : 0,
      utga: t("Баримт авсан дүн"),
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.butsaasanToo, 0)
          : 0,
      utga: t("Буцаалт хийгдсэн тоо"),
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.butsaasanDun, 0)
          : 0,
      utga: t("Буцаалт хийгдсэн дүн"),
    },
  ];

  function ebarimtIlgeeye() {
    if (loading === true) return;
    setLoading(true);
    setWaiting(true);
    uilchilgee(token)
      .post("/ebarimtIlgeeye", { barilgiinId: barilgiinId })
      .then(({ status }) => {
        status === 200 && toast.success("Баримт амжилттай илгээлээ");
        eBarimtMedeelelMutate();
        setWaiting(false);
        setLoading(false);
      })
      .catch((e) => {
        aldaaBarigch(e);
        setWaiting(false);
        setLoading(false);
      });
  }

  const columns = useMemo(() => {
    var shineColumn =
      uilchilgeeAvi === "Зогсоол"
        ? [
            {
              title: t("Машины дугаар"),
              dataIndex: "mashiniiDugaar",
              ellipsis: true,
              align: "center",
              render: (data) => {
                return data;
              },
              showSorterTooltip: false,
              sorter: () => 0,
            },
          ]
        : [];
    let shineColumn2 =
      uilchilgeeAvi === "Түрээс"
        ? [
            {
              title: t("Гэрээний дугаар"),
              dataIndex: "gereeniiDugaar",
              ellipsis: true,
              align: "center",
              showSorterTooltip: false,
              sorter: () => 0,
              render: (data) => {
                return data;
              },
            },
            {
              title: t("Регистр"),
              dataIndex: "customerNo",
              ellipsis: true,
              align: "center",
              render: (data) => {
                return data;
              },
            },
            {
              title: t("Талбайн дугаар"),
              dataIndex: "talbainDugaar",
              ellipsis: true,
              align: "center",
              showSorterTooltip: false,
              sorter: () => 0,
              render: (data) => {
                return data;
              },
            },
          ]
        : [];

    let shineColumn3 =
      uilchilgeeAvi === "Тоглоом"
        ? [
            {
              title: t("Нэр"),
              dataIndex: "togloomNer",
              align: "center",
              render: (data) => {
                return data;
              },
            },
            {
              title: t("Утас"),
              dataIndex: "togloomUtas",
              align: "center",
              render: (data) => {
                return data;
              },
            },
          ]
        : [];

    return [
      {
        title: t("№"),
        key: "index",
        align: "center",
        width: "60px",
        summary: true,
        render: (a, b, index) => {
          return index + 1;
        },
      },
      {
        title: t("Огноо"),
        dataIndex: "createdAt",
        ellipsis: true,
        align: "center",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD HH:mm:ss");
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Тайлант сар"),
        dataIndex: "reportMonth",
        ellipsis: true,
        align: "center",
        render: (reportMonth, data) => {
          return reportMonth ? reportMonth : data.date;
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },

      ...shineColumn,
      ...shineColumn2,
      ...shineColumn3,
      {
        title: <div className="text-center font-semibold">{t("Төрөл")}</div>,
        align: "center",
        width: "12rem",
        render(mur) {
          if (mur.type === "B2B_RECEIPT")
            return (
              <div className="flex flex-row space-x-2">
                <div>Байгууллага</div>
                <div>{mur.customerTin}</div>
              </div>
            );
          return <div>Иргэн</div>;
        },
      },
      {
        title: t("ДДТД"),
        dataIndex: "billId",
        width: "300px",
        align: "center",
        render: (data, object) => {
          if (!!object.billId) return object.billId;
          else return object.id;
        },
      },
      {
        title: t("Дүн"),
        dataIndex: "cashAmount",
        ellipsis: true,
        align: "right",
        summary: true,
        render: (data, object) => {
          if (!!object.cashAmount) return formatNumber(data);
          else return formatNumber(object.totalAmount);
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Үйлчилгээ"),
        dataIndex: "",
        ellipsis: true,
        align: "center",
        render: (data) => {
          return (
            <div>
              {data.mashiniiDugaar
                ? "Зогсоол"
                : data.gereeniiDugaar
                ? "Түрээс"
                : "Тоглоом"}
            </div>
          );
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        width: "60px",
        align: "center",
        render(data) {
          return (
            <Popconfirm
              title="ebarimt устгах уу?"
              okText={t("Тийм")}
              cancelText={t("Үгүй")}
              onConfirm={() => ebarimtUstgaya(data)}
            >
              <Button
                danger
                size="small"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          );
        },
      },
    ];
  }, [uilchilgeeAvi]);

  function ebarimtUstgaya(mur) {
    setWaiting(true);
    uilchilgee(token)
      .post("/ebarimtButsaaya", {
        ...mur,
        barilgiinId: barilgiinId,
        baiguullagiinId: ajiltan?.baiguullagiinId,
        ajiltniiNer: ajiltan?.ner,
      })
      .then(({ data }) => {
        if (!!data) {
          setWaiting(false);
          eBarimtMutate();

          ebarimtiinToololtMutate();
          toast.success(
            t("дугаартай баримт амжилттай ebarimt -с устгагдлаа", {
              dugaar: mur.billId || mur.id,
            })
          );
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setWaiting(false);
      });
  }

  function exceleerTatya() {
    const excel = new Excel();

    const excelCol = [
      {
        title: "Огноо",
        dataIndex: "createdAt",
        __style__: { h: "center" },
        render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
      },
      {
        title: "Тайлант сар",
        dataIndex: "reportMonth",
        __style__: { h: "center" },
        render: (date, row) => (date ? date : row.date),
      },

      ...(uilchilgeeAvi === "Зогсоол"
        ? [
            {
              title: "Машины дугаар",
              dataIndex: "mashiniiDugaar",
              __style__: { h: "center" },
            },
          ]
        : []),
      ...(uilchilgeeAvi === "Тоглоом"
        ? [
            {
              title: "Нэр",
              dataIndex: "togloomNer",
              __style__: { h: "center" },
            },
            {
              title: "Утас",
              dataIndex: "togloomUtas",
              __style__: { h: "center" },
            },
          ]
        : []),
      ...(uilchilgeeAvi === undefined
        ? [
            {
              title: "Гэрээний дугаар",
              __style__: { h: "center" },
              dataIndex: "gereeniiDugaar",
            },
            {
              title: "Регистр",
              __style__: { h: "center" },
              dataIndex: "customerNo",
            },
          ]
        : []),
      {
        title: "ДДТД",
        __style__: { h: "center", width: 35 },
        dataIndex: "id",
      },
      {
        title: "Дүн",
        dataIndex: "totalAmount",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (dun, row) => dun || row.totalAmount || 0,
      },
      {
        title: "Төрөл",
        dataIndex: "type",
        __style__: { h: "center", width: 30 },
        render: (type, row) =>
          type === "B2B_RECEIPT" ? `Байгууллага (${row.customerTin})` : "Иргэн",
      },
      {
        title: "Үйлчилгээ",
        __style__: { h: "center" },
        dataIndex: "",
        render: (_, row) =>
          row.mashiniiDugaar
            ? "Зогсоол"
            : row.gereeniiDugaar
            ? "Түрээс"
            : "Тоглоом",
      },
    ];

    excel
      .addSheet("eBarimt")
      .addColumns(excelCol)
      .addDataSource(eBarimtGaralt?.jagsaalt || [])
      .saveAs("eBarimt_tailan.xlsx");
  }

  return (
    <Admin
      khuudasniiNer="eBarimt"
      title="И-баримтын бүртгэл"
      className="p-0 md:p-5"
      onSearch={(search) => setEBarimtKhuudaslalt((a) => ({ ...a, search }))}
      tsonkhniiId="61c2c70a1c2830c4e6f90ccf"
      loading={waiting || isValidating}
    >
      <Card className="cardgrid col-span-12">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`group relative w-[67vw] cursor-pointer overflow-hidden rounded-2xl 
                  border-2 border-green-200 bg-green-50/60 transition-all duration-300 ease-out 
                  hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-gray-300 dark:border-green-900 
                  dark:bg-green-950/40 dark:hover:shadow-gray-800 sm:col-span-12 sm:w-auto lg:col-span-2`}
                data-aos="zoom-out-down"
                data-aos-duration="1000"
                data-aos-delay={6 - index + "00"}
              >
                <div className="relative h-full w-[67vw] overflow-hidden rounded-2xl md:w-auto">
                  <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                  <div className="relative h-full rounded-2xl p-3 sm:p-2.5">
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <div className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-2xl font-bold text-transparent">
                          {mur.too}
                        </div>
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {t(mur.utga)}
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-500 group-hover:w-full"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex w-full flex-col justify-between md:flex-row">
          <div className="flex gap-3">
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <RangePicker
                className="w-full md:w-auto"
                clearIcon
                style={{ marginBottom: "20px" }}
                size="middle"
                value={ekhlekhOgnoo}
                onChange={setEkhlekhOgnoo}
              />
            </div>
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              <Select
                className="w-full sm:w-36"
                placeholder={t("Үйлчилгээ")}
                onChange={(v) => setUilchilgeeAvi(v)}
                allowClear
              >
                <Select.Option key="Зогсоол" value="Зогсоол">
                  {t("Зогсоол")}
                </Select.Option>
                <Select.Option key="Тоглоом" value="Тоглоом">
                  {t("Тоглоом")}
                </Select.Option>
                <Select.Option key="Түрээс" value="Түрээс">
                  {t("Түрээс")}
                </Select.Option>
              </Select>
            </div>
          </div>
          <div
            className="mb-5 flex flex-row justify-between md:mb-0 md:space-x-2"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <Button onClick={exceleerTatya} type="primary">
              {t("Excel татах")}
            </Button>
            <Button
              title={t("Сүүлд илгээгдсэн огноо")}
              className="dark:bg-gray-800 dark:text-white  "
            >
              {moment(eBarimtMedeelel?.extraInfo?.lastSentDate).format(
                "YYYY-MM-DD"
              )}
            </Button>

            <Button
              danger
              onClick={ebarimtIlgeeye}
              className="border-red-400 dark:border-red-400 dark:bg-gray-900 "
            >
              <Spin spinning={loading}>
                {loading ? "" : t("Татварт илгээх")}{" "}
              </Spin>
            </Button>
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="300"
          data-aos-anchor-placement="top-bottom"
          className="overflow-x-auto"
        >
          <Table
            bordered
            tableLayout={"fixed"}
            size="small"
            rowClassName="hover:bg-blue-100"
            dataSource={eBarimtGaralt?.jagsaalt}
            pagination={{
              current: eBarimtGaralt?.khuudasniiDugaar,
              total: eBarimtGaralt?.niitMur,
              pageSizeOptions: [100, 300, 500],
              defaultPageSize: [500],
              showSizeChanger: true,

              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setEBarimtKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            onChange={onChangeTable}
            scroll={{ x: "max-content", y: "calc(100vh - 27rem)" }}
            rowKey={(row) => row._id}
            className="t-head"
            columns={columns}
            summary={(e) => (
              <AntdTable.Summary className="border " fixed={"bottom"}>
                <AntdTable.Summary.Cell>
                  <div className="space-x-2 truncate text-base font-bold ">
                    {t("Нийт")}
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell
                  colSpan={
                    uilchilgeeAvi === "Зогсоол"
                      ? 6
                      : uilchilgeeAvi === "Тоглоом"
                      ? 7
                      : uilchilgeeAvi === "Түрээс"
                      ? 8
                      : 5
                  }
                >
                  <div className="truncate text-right font-bold ">
                    {formatNumber(
                      e?.reduce(
                        (a, b) => a + (b?.cashAmount || b?.totalAmount || 0),
                        0
                      ),
                      2
                    )}
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
              </AntdTable.Summary>
            )}
          />
        </div>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default EbarimtMedeelel;
