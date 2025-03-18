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
  Table as AntdTable
} from "antd";

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

const { RangePicker } = DatePicker;

const searchKeys = ["customerNo", "cashAmount", "billId", "id", "customerTin", "mashiniiDugaar", "gereeniiDugaar", "talbainDugaar"];
//#endregion

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

  console.log(uilchilgeeAvi, "uilchilgeeAviuilchilgeeAvi");

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
  }, [ekhlekhOgnoo, uilchilgeeAvi]);

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
  const { ebarimtiinToololt } = useBarimtToollolt(
    barilgiinId && token,
    queryToololt
  );

  const khyanaltiinDun = [
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.avakhToo, 0)
          : 0,
      utga: "Баримт авах тоо",
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.avakhDun, 0)
          : 0,
      utga: "Баримт авах дүн",
    },

    {
      too: eBarimtGaralt?.niitMur || 0,
      utga: "Баримт авсан тоо",
    },

    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.ilgeesenDun, 0)
          : 0,
      utga: "Баримт авсан дүн",
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.butsaasanToo, 0)
          : 0,
      utga: "Буцаалт хийгдсэн тоо",
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.butsaasanDun, 0)
          : 0,
      utga: "Буцаалт хийгдсэн дүн",
    },
  ];

  function ebarimtIlgeeye() {
    if (loading === true) return;
    setLoading(true);
    setWaiting(true);
    uilchilgee(token)
      .post("/ebarimtIlgeeye", { barilgiinId: barilgiinId })
      .then(({ status }) => {
        status === 200 && message.success("Баримт амжилттай илгээлээ");
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
    return [
      {
        title: t("№"),
        key: "index",
        align: "center",
        width: "60px",
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
        title: t("Гэрээний дугаар"),
        dataIndex: "gereeniiDugaar",
        ellipsis: true,
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Регистр"),
        dataIndex: "customerNo",
        ellipsis: true,
        align: "center",
      },
      {
        title: t("Талбайн дугаар"),
        dataIndex: "talbainDugaar",
        ellipsis: true,
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      ...shineColumn,
      {
        title: <div className="text-center font-semibold">Төрөл</div>,
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
        title: "Үйлчилгээ",
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
    //mur.barilgiinId = barilgiinId;
    uilchilgee(token)
      .post("/ebarimtButsaaya", mur)
      .then(({ data }) => {
        if (!!data) {
          setWaiting(false);
          eBarimtMutate();
          message.success(
            t("дугаартай баримт амжилттай ebarimt -с устгагдлаа", {
              dugaar: mur.billId,
            })
          );
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
        setWaiting(false);
      });
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
                className="zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 lg:col-span-2"
                data-aos="zoom-out-down"
                data-aos-duration="1000"
                data-aos-delay={6 - index + "00"}
              >
                <div className="h-full w-[67vw] rounded-xl md:w-auto">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {mur.too}
                        </div>
                        <div className="text-sm text-gray-500">
                          {t(mur.utga)}
                        </div>
                      </div>
                    </div>
                  </div>
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
                placeholder="Үйлчилгээ"
                onChange={(v) => setUilchilgeeAvi(v)}
                allowClear
              >
                <Select.Option key="Зогсоол" value="Зогсоол">
                  Зогсоол
                </Select.Option>
                <Select.Option key="Тоглоом" value="Тоглоом">
                  Тоглоом
                </Select.Option>
                <Select.Option key="Түрээс" value="Түрээс">
                  Түрээс
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
              // current: eBarimtGaralt?.khuudasniiDugaar,
              // pageSize: 100,
              // total: eBarimtGaralt?.niitMur,
              // showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setEBarimtKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
            onChange={onChangeTable}
            scroll={{ y: "calc(100vh - 27rem)" }}
            rowKey={(row) => row._id}
            className="t-head"
            columns={columns}
            summary={(e) => (
              <AntdTable.Summary className="border " fixed={'bottom'}>
                <AntdTable.Summary.Cell>
                  <div className="space-x-2 truncate text-base font-bold ">
                    Нийт
                  </div>
                </AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell></AntdTable.Summary.Cell>
                <AntdTable.Summary.Cell colSpan={uilchilgeeAvi === "Зогсоол" ? 2 : 1}>
                  <div className="truncate text-right font-bold ">
                    {formatNumber(
                      e?.reduce((a, b) => a + (b?.cashAmount || b?.totalAmount || 0), 0),
                      2
                    )}
                  </div>
                </AntdTable.Summary.Cell>
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
