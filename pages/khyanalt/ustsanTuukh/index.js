import { Button, Card, DatePicker, Modal, Popover, Select, Table } from "antd";
import Admin from "components/Admin";
import moment from "moment";
import useJagsaalt from "hooks/useJagsaalt";
import React, { useEffect, useMemo, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import router from "next/router";
import CardList from "components/cardList";
import UstsanTuukhTile from "components/pageComponents/ustsanTuukh/UstsanTuukhTile";
import formatNumber from "tools/function/formatNumber";
import { useAuth } from "services/auth";
import { EyeOutlined, FileExcelOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import DelgerenguiKharakh from "components/pageComponents/ustsanTuukh/MedegdelKharakh";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import BaganiinSongolt from "components/table/BaganiinSongolt";
const { RangePicker } = DatePicker;
const order = { createdAt: -1 };

const searchKeys = ["ajiltniiNer", "tailbar", "object.gereeniiDugaar"];
const turluud = [
  {
    turul: "gereeniiZagvar",
    text: "Гэрээний загвар",
  },
  {
    turul: "Talbai",
    text: "Талбай",
  },
  {
    turul: "ajiltan",
    text: "Ажилтан бүртгэл",
  },
  {
    turul: "khariltsagch",
    text: "Харилцагч",
  },
  {
    turul: "nekhemjlekhiinZagvar",
    text: "Нэхэмжлэл",
  },
  {
    turul: "zardal",
    text: "Зардал",
  },
  {
    turul: "eBarimt",
    text: "E-Barimt",
  },
  {
    turul: "mashin",
    text: "Зогсоол",
  },
  {
    turul: "anket",
    text: "Анкет",
  },
  {
    turul: "gereeniiGuilgee",
    text: "Гүйлгээ",
  },

  {
    turul: "voucher",
    text: "Ваучер",
  },
  {
    turul: "baritsaa",
    text: "Барьцаа",
  },
  {
    turul: "avlaga",
    text: "Авлага",
  },
  {
    turul: "blockMashin",
    text: "Блок машин",
  },
  {
    turul: "barter",
    text: "Бартер",
  },
  {
    turul: "zalruulga",
    text: "Залруулга",
  },
  {
    turul: "aldangi",
    text: "Алданги",
  },
  {
    turul: "dans",
    text: "Данс",
  },
  {
    turul: "khungulult",
    text: "Хөнгөлөлт",
  },
  {
    turul: "tulultBurtgekh",
    text: "Төлөлт бүртгэх",
  },
  {
    turul: "SMS",
    text: "Мэдэгдэл",
  },
  {
    turul: "App",
    text: "Мэдэгдэл (App)",
  },
  {
    turul: "Mail",
    text: "Мэдэгдэл (Mail)",
  },
];

function UstsanTuukh() {
  const { t } = useTranslation();
  const { barilgiinId } = useAuth();
  const [ajiltankhaikh, setAjiltankhaikh] = useState();
  const [turul, setTurul] = useState();
  const ref = React.useRef();
  const [shineBagana, setShineBagana] = useState([]);
  const [cls, setCls] = useState();
  const [shuukhOgnoo, setShuukhOgnoo] = useState([
    moment().subtract(1, "months"),
    moment(),
  ]);
  const query = useMemo(() => {
    const classValue =
      turul === "ajiltan"
        ? "ajiltan"
        : turul === "Talbai"
        ? "Talbai"
        : turul === "khariltsagch"
        ? "Khariltsagch"
        : turul === "gereeniiZagvar"
        ? "gereeniiZagvar"
        : turul === "nekhemjlekhiinZagvar"
        ? "nekhemjlekhiinZagvar"
        : turul === "zardal"
        ? "zardal"
        : turul === "mashin"
        ? "mashin"
        : turul === "blockMashin"
        ? "blockMashin"
        : cls;

    return {
      baiguullagiinId: barilgiinId,
      ajiltniiId: ajiltankhaikh,
      "object.turul": turul,
      class: classValue,
      createdAt: shuukhOgnoo
        ? {
            $gte: moment(shuukhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(shuukhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
  }, [ajiltankhaikh, shuukhOgnoo, turul, barilgiinId, searchKeys]);

  const ustsanBarimt = useJagsaalt(
    "/ustsanBarimt",
    query,
    order,
    undefined,
    searchKeys
  );
  const ajiltanKhariltsagch = useJagsaalt(
    "/ustsanBarimtTurees",
    query,
    order,
    undefined,
    searchKeys
  );

  const combinedData = useMemo(() => {
    if (turul === "ajiltan") {
      return ajiltanKhariltsagch?.jagsaalt || [];
    }
    return ustsanBarimt?.jagsaalt || [];
  }, [turul, ustsanBarimt?.jagsaalt, ajiltanKhariltsagch?.jagsaalt]);

  const { turulColumns } = React.useMemo(() => {
    let turulColumns = [];
    switch (turul) {
      case "gereeniiZagvar":
        turulColumns.push({
          title: "Нэр",
          width: "5rem",
          align: "center",
          render: (gereeNer) => {
            return (
              <>
                <div>{gereeNer.object.ner}</div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "talbai":
        turulColumns.push({
          title: "Талбайн дугаар",
          width: "3rem",
          align: "center",
          render: (talbai) => {
            return (
              <>
                <div>{talbai.object.kod}</div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "ajiltan":
        turulColumns.push({
          title: "Регистр",
          width: "2rem",
          align: "center",
          render: (ajiltanBurtgel) => {
            return (
              <>
                <div>{ajiltanBurtgel.object.register}</div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "khariltsagch":
        turulColumns.push({
          title: "Регистр",
          width: "2rem",
          align: "center",
          render: (khariltsagch) => {
            return (
              <>
                <div>{khariltsagch.object.register}</div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "nekhemjlekhiinZagvar":
        turulColumns.push({
          title: "Нэр",
          width: "3rem",
          align: "center",
          render: (nekhemjlekhiinZagvar) => {
            return (
              <>
                <div>{nekhemjlekhiinZagvar.object.ner}</div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "voucher":
        turulColumns.push({
          title: "Төлсөн дүн",
          width: "3rem",
          align: "right",
          render: (tulsunDun) => {
            return (
              <>
                <div
                  className={`${
                    tulsunDun.object.tulsunDun > 0
                      ? "text-green-600 "
                      : "text-red-500"
                  }`}
                >
                  {formatNumber(tulsunDun.object.tulsunDun, 0) || 0}
                </div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "aldangi":
        turulColumns.push({
          title: "Төлсөн дүн",
          width: "3rem",
          align: "right",
          render: (tulsunDun) => {
            return (
              <>
                <div
                  className={`${
                    tulsunDun.object.tulsunDun > 0
                      ? "text-green-600 "
                      : "text-red-500"
                  }`}
                >
                  {formatNumber(tulsunDun.object.tulsunDun, 0)}
                </div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "baritsaa":
        turulColumns.push({
          title: "Төлсөн дүн",
          width: "3rem",
          align: "right",
          render: (tulsunDun) => {
            return (
              <>
                <div
                  className={`${
                    tulsunDun.object.tulsunDun > 0
                      ? "text-green-600 "
                      : "text-red-500"
                  }`}
                >
                  {formatNumber(tulsunDun.object.tulsunDun, 0)}
                </div>
              </>
            );
          },
          sorter: () => 0,
        });
        turulColumns.push({
          title: "Орлого",
          width: "3rem",
          align: "center",
          render: (tulukhDun) => {
            return (
              <>
                <div
                  className={`${
                    tulukhDun.object.orlogo > 0
                      ? "text-green-600 "
                      : "text-red-500"
                  }`}
                >
                  {formatNumber(tulukhDun.object.orlogo, 0) || 0}
                </div>
              </>
            );
          },
          sorter: () => 0,
        });
        turulColumns.push({
          title: "Тайлбар",
          width: "3rem",
          align: "center",
          render: (tulukhDun) => {
            return (
              <>
                <div className="text-center">{tulukhDun.object.tailbar}</div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "ashiglalt":
        turulColumns.push({
          title: "Төлсөн дүн",
          width: "3rem",
          align: "right",
          render: (tulsunDun) => {
            return (
              <>
                <div
                  className={`${
                    tulsunDun.object.tulsunDun > 0
                      ? "text-green-600 "
                      : "text-red-500"
                  }`}
                >
                  {formatNumber(tulsunDun.object.tulsunDun, 0)}
                </div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "avlaga":
        turulColumns.push({
          title: "Төлсөн дүн",
          width: "3rem",
          align: "right",
          render: (tulsunDun) => {
            return (
              <>
                <div
                  className={`${
                    tulsunDun.object.tulsunDun > 0
                      ? "text-green-600 "
                      : "text-red-500"
                  }`}
                >
                  {formatNumber(tulsunDun.object.tulsunDun, 0) || 0}
                </div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "zalruulga":
        turulColumns.push({
          title: "Төлсөн дүн",
          width: "3rem",
          align: "right",
          render: (tulsunDun) => {
            return (
              <>
                <div
                  className={`${
                    tulsunDun.object.tulsunDun > 0
                      ? "text-green-600 "
                      : "text-red-500"
                  }`}
                >
                  {formatNumber(tulsunDun.object.tulsunDun, 0) || 0}
                </div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "barter":
        turulColumns.push({
          title: "Төлсөн дүн",
          width: "3rem",
          align: "right",
          render: (tulsunDun) => {
            return (
              <>
                <div
                  className={`${
                    tulsunDun.object.tulsunDun > 0
                      ? "text-green-600 "
                      : "text-red-500"
                  }`}
                >
                  {formatNumber(tulsunDun.object.tulsunDun, 0) || 0}
                </div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      case "Иргэн":
        turulColumns.push({
          title: "Нэр",
          width: "3rem",
          align: "right",
          render: (khariltsagchNer) => {
            return (
              <>
                <div className="text-center">{khariltsagchNer.object.ner}</div>
              </>
            );
          },
          sorter: () => 0,
        });
        break;
      default:
        break;
    }
    return { turulColumns };
  }, [turul]);

  const ajiltan = useJagsaalt("/ajiltan");

  function medeelelKharakh(mur) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
    ];
    modal({
      title: t("Дэлгэрэнгүй Мэдээлэл"),
      icon: <FileExcelOutlined />,
      content: <DelgerenguiKharakh ref={ref} data={mur} />,
      width: "25vw",
      footer,
      onCancel: () => {
        ref.current.khaaya();
      },
    });
  }

  const columns = useMemo(() => {
    return [
      {
        title: t("Устгасан огноо"),
        dataIndex: "createdAt",
        align: "center",
        ellipsis: true,
        width: "4rem",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD HH:mm");
        },
      },
      ...shineBagana,
      {
        title: t("Төрөл"),
        dataIndex: "class",
        align: "left",
        ellipsis: true,
        width: "4rem",
        showSorterTooltip: false,
        render: (mur) => {
          var text;
          switch (mur) {
            case "gereeniiZagvar":
              text = "Гэрээний загвар";
              break;
            case "Talbai":
              text = "Талбай";
              break;
            case "baritsaa":
              text = "Барьцаа";
              break;
            case "baritsaaAshiglalt":
              text = "Барьцаа ашиглалт";
              break;
            case "baritsaaGuilgee":
              text = "Барьцаа гүйлгээ";
              break;
            case "ajiltan":
              text = "Ажилтан бүртгэл";
              break;
            case "Khariltsagch":
              text = "Харилцагч";
              break;
            case "asuult":
              text = "АсуултT";
              break;
            case "nekhemjlekhiinZagvar":
              text = "Нэхэмжлэл загвар";
              break;
            case "zardal":
              text = "Зардлын жагсаалт";
              break;
            case "eBarimt":
              text = "И-баримтын бүртгэл";
              break;
            case "mashin":
              text = "Зогсоол";
              break;
            case "blockMashin":
              text = "Блок машин";
              break;
            case "anket":
              text = "Анкетын асуулга бэлдэх";
              break;
            case "gereeniiGuilgee":
              text = "Гэрээний гүйлгээ";
              break;
            case "mailiinZagvar":
              text = "Мэдэгдэл";
              break;
            case "khungulult":
              text = "Хөнгөлөлт";
              break;
            case "ashiglaltiinZardluud":
              text = "Ашиглалтын зардал";
              break;

            default:
              text = mur;
              break;
          }
          return t(text);
        },
        sorter: () => 0,
      },
      {
        title: t("Устгасан шалтгаан"),
        align: "left",
        ellipsis: true,
        width: "5rem",
        showSorterTooltip: false,
        render: (tailbar) => {
          return (
            <>
              <div>{tailbar?.tailbar}</div>
            </>
          );
        },
      },
      ...turulColumns,
      {
        title: t("Хийсэн"),
        align: "left",
        ellipsis: true,
        width: "3rem",
        showSorterTooltip: false,
        render: (tailbar) => {
          return (
            <>
              <div>
                {tailbar?.object?.guilgeeKhiisenAjiltniiNer ||
                  tailbar?.guilgeeKhiisenAjiltniiNer}
              </div>
            </>
          );
        },
      },
      {
        title: t("Огноо"),
        align: "center",
        ellipsis: true,
        width: "3rem",
        showSorterTooltip: false,
        render: (tailbar) => {
          return (
            <>
              <div>
                {moment(
                  tailbar?.object?.createdAt ||
                    tailbar?.object?.guilgeeKhiisenOgnoo ||
                    tailbar?.object?.ognoo
                ).format("YYYY-MM-DD")}
              </div>
            </>
          );
        },
      },
      {
        title: t("Устгасан"),
        dataIndex: "ajiltniiNer",
        align: "left",
        ellipsis: true,
        width: "3rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Тайлбар"),
        width: "2rem",
        dataIndex: "tuluv",
        align: "center",
        render(a, record, index) {
          return (
            <div className="flex items-center justify-center">
              <Button
                className=" dark:bg-gray-700"
                shape="circle"
                size="small"
                icon={
                  <div
                    className={`flex items-center justify-center  dark:bg-gray-700 `}
                    onClick={() => medeelelKharakh(record, index)}
                  >
                    <EyeOutlined
                      style={{ fontSize: "16px" }}
                      className=" dark:bg-gray-700"
                    />
                  </div>
                }
              />
            </div>
          );
        },
      },
    ];
  });
  function ognooShuultOnChange(e) {
    if (e === null) {
      setShuukhOgnoo(undefined);
    } else setShuukhOgnoo([moment(e[0]), moment(e[1])]);
  }
  useEffect(() => {
    Aos.init({ once: true });
  }, []);
  return (
    <Admin
      title="Устгасан түүх"
      tsonkhniiId={"64472c0428c37d7cdda11a32"}
      khuudasniiNer="ustsanTuukh"
      onSearch={(search) =>
        ustsanBarimt.setKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      loading={ustsanBarimt.isValidating}
      className="p-0 md:p-4"
    >
      <Card className="col-span-12 rounded-md bg-white dark:bg-gray-900">
        <div
          className="flex flex-col-reverse gap-3 sm:flex-row"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="300"
        >
          <RangePicker
            style={{ marginBottom: "20px" }}
            size="middle"
            value={shuukhOgnoo}
            onChange={ognooShuultOnChange}
          />

          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="600"
          >
            <Select
              className="w-full sm:w-36"
              placeholder={t("Ажилтан")}
              onChange={(v) => setAjiltankhaikh(v)}
              allowClear
            >
              {ajiltan?.jagsaalt.map((a) => (
                <Select.Option key={a._id} value={a._id}>
                  {a.ner}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="900"
          >
            <Select
              className="w-full sm:w-36"
              placeholder={t("Төрөл")}
              onChange={(v) => setTurul(v)}
              allowClear
            >
              {turluud.map((a) => (
                <Select.Option value={a.turul}>{t(a.text)}</Select.Option>
              ))}
            </Select>
          </div>
          <div className="ml-auto hidden justify-end md:flex">
            <BaganiinSongolt
              shineBagana={shineBagana}
              setShineBagana={setShineBagana}
              columns={[
                {
                  title: t("Гэрээний дугаар"),
                  width: "4rem",
                  dataIndex: ["object", "gereeniiDugaar"],
                  summary: true,
                  align: "center",
                  render: (a) => {
                    return <div className="w-full text-center">{a}</div>;
                  },
                },
                {
                  title: t("Талбай"),
                  width: "4rem",
                  dataIndex: ["object", "kod"],
                  summary: true,
                  align: "center",
                  render: (a) => {
                    return <div className="w-full text-right">{a}</div>;
                  },
                },
                {
                  title: t("Харилцагч"),
                  width: "4rem",
                  dataIndex: ["object", "ner"],
                  summary: true,
                  align: "center",
                  render: (a) => {
                    return <div className="w-full text-right">{a}</div>;
                  },
                },
                {
                  title: t("Төлөх дүн"),
                  width: "3rem",
                  dataIndex: ["object", "tulukhDun"],
                  summary: true,
                  align: "center",
                  render: (a) => {
                    return (
                      <div className="text-right">{formatNumber(a) || 0}</div>
                    );
                  },
                },
              ]}
            />
          </div>
        </div>
        <Table
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300"
          bordered
          size="small"
          className="hidden overflow-auto md:block"
          columns={columns}
          scroll={{ y: "calc(100vh - 20rem)" }}
          dataSource={combinedData}
          rowKey={(row) => row._id}
          pagination={{
            current: Number(ustsanBarimt?.data?.khuudasniiDugaar),
            pageSize: ustsanBarimt?.data?.khuudasniiKhemjee,
            total: ustsanBarimt?.data?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              ustsanBarimt.setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
        <CardList
          keyValue="ustsanBarimt"
          className="block overflow-auto md:hidden"
          jagsaalt={combinedData}
          Component={UstsanTuukhTile}
          componentProps={{ router }}
          pagination={{
            current: ustsanBarimt?.data?.khuudasniiDugaar,
            pageSize: ustsanBarimt?.data?.khuudasniiKhemjee,
            total: ustsanBarimt?.data?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              ustsanBarimt.setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default UstsanTuukh;
