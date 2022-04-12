//#region import
import moment from "moment";
import { useAuth } from "services/auth";
import readMethod from "tools/function/crud/readMethod";
import {
  FileDoneOutlined,
  UserOutlined,
  HistoryOutlined,
  FileSyncOutlined,
  WarningOutlined,
  FileExcelOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  SettingOutlined,
  FieldTimeOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  RedoOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Table,
  Card,
  Popover,
  Popconfirm,
  Drawer,
  DatePicker,
  Button,
  Space,
  message,
  Input,
  notification,
  Menu,
  Checkbox,
} from "antd";
import { toWords } from "mon_num";
import Admin from "components/Admin";
import formatNumber from "tools/function/formatNumber";
import React, { useMemo, useEffect } from "react";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import { useGereeniiJagsaaltToollolt } from "hooks/useGereeniiJagsaalt";
import uilchilgee, { url } from "services/uilchilgee";
import GereeKharakh from "components/pageComponents/geree/Kharakh";
import router from "next/router";
import { useReactToPrint } from "react-to-print";
import locale from "antd/lib/date-picker/locale/mn_MN";
import GereeExceleesOruulakh from "components/pageComponents/geree/GereeExceleesOruulakh";
import Sungakh from "components/pageComponents/geree/Sungakh";
import { modal } from "components/ant/Modal";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import CardList from "components/cardList";
import GereeTile from "components/pageComponents/geree/GereeTile";
import useOrder from "tools/function/useOrder";
import Aos from "aos";

//#endregion

const sheet = [
  {
    title: "Бүртгэсэн",
    dataIndex: "createdAt",
    ellipsis: true,
    className: "text-center",
    align: "center",
    render(date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
  },
  {
    title: "Гэрээ",
    dataIndex: "gereeniiDugaar",
    className: "text-center",
    align: "center",
    ellipsis: true,
  },
  {
    title: "Нэр",
    dataIndex: "ner",
    className: "text-center",
    align: "center",
    ellipsis: true,
  },
  {
    title: "Регистр",
    dataIndex: "register",
    className: "text-center",
    align: "center",
    ellipsis: true,
  },
  {
    title: "Талбай",
    dataIndex: "talbainDugaar",
    className: "text-center",
    align: "center",
    ellipsis: true,
  },

  {
    title: "Төрөл",
    dataIndex: "turul",
    align: "center",
    className: "text-center",
    ellipsis: true,
  },

  {
    title: "Талбай /м2/",
    dataIndex: "talbainKhemjee",
    align: "center",
    className: "text-center",
    ellipsis: true,
    render: (talbainKhemjee) => {
      return `${talbainKhemjee} м2`;
    },
    showSorterTooltip: false,
  },
  {
    title: "Төлбөр",
    dataIndex: "sariinTurees",
    className: "text-center",
    align: "center",
    ellipsis: true,
    render: (sariinTurees) => {
      return formatNumber(sariinTurees || 0);
    },
    showSorterTooltip: false,
  },
  {
    title: "Эхлэх",
    dataIndex: "gereeniiOgnoo",
    className: "text-center",
    align: "center",
    ellipsis: true,
    render: (data) => {
      return moment(data).format("YYYY-MM-DD");
    },
  },
  {
    title: "Дуусах хоног",
    dataIndex: "duusakhOgnoo",
    className: "text-center",
    align: "center",
    ellipsis: true,
    render: (duusakhOgnoo) => {
      return moment(duusakhOgnoo).diff(moment(new Date()), "days");
    },
  },
  {
    title: "Дуусах",
    dataIndex: "duusakhOgnoo",
    className: "text-center",
    align: "center",
    ellipsis: true,
    render: (data) => {
      return moment(data).format("YYYY-MM-DD");
    },
    showSorterTooltip: false,
    defaultSortOrder: "descend",
  },
  {
    title: "Ажилтан",
    dataIndex: "burtgesenAjiltaniiNer",
    className: "text-center",
    align: "center",
    ellipsis: true,
    render: () => {
      return "Админ";
    },
  },
];

function excelTatajAvya(token, service, mur, sheet, query, order, sheetName) {
  uilchilgee(token)
    .get(service, {
      params: { query, order, khuudasniiKhemjee: mur, khuudasniiDugaar: 1 },
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

const Tailbar = React.forwardRef(
  ({ token, destroy, confirm, data, service }, ref) => {
    const [shaltgaan, setTailbar] = React.useState("");
    const [duusakhOgnoo, setDuusakhOgnoo] = React.useState(moment());
    const [sergeekhOgnoo, setSergeekhOgnoo] = React.useState(moment());

    React.useImperativeHandle(
      ref,
      () => ({
        khadgalya() {
          uilchilgee(token)
            .post(service, {
              gereeniiId: data?._id,
              barilgiinId: data?.barilgiinId,
              shaltgaan,
              duusakhOgnoo,
              sergeekhOgnoo,
            })
            .then(({ data }) => {
              if (data === "Amjilttai") {
                message.success("Гэрээ амжилттай цуцаллаа");
                confirm(shaltgaan);
                destroy();
              }
            });
        },
        khaaya() {
          destroy();
        },
      }),
      [shaltgaan, duusakhOgnoo, sergeekhOgnoo]
    );

    return (
      <div className="w-full space-y-2">
        <div className="w-full space-y-1 font-medium">
          <div className="flex w-full flex-row justify-between">
            <div className="text-right">
              {service === "/gereeSergeeye" ? "Сэргээх огноо:" : "Эхлэх огноо:"}
            </div>
            {service === "/gereeSergeeye" ? (
              <DatePicker value={sergeekhOgnoo} onChange={setSergeekhOgnoo} />
            ) : (
              <div>{moment(data?.gereeniiOgnoo).format("YYYY-MM-DD")}</div>
            )}
          </div>
          <div className="flex w-full flex-row justify-between">
            <div className="text-right">Дуусах огноо:</div>
            {service === "/gereeSergeeye" ? (
              <DatePicker value={duusakhOgnoo} onChange={setDuusakhOgnoo} />
            ) : (
              <div>{moment(data?.duusakhOgnoo).format("YYYY-MM-DD")}</div>
            )}
          </div>
          {service !== "/gereeSergeeye" && (
            <div className="flex w-full flex-row justify-between">
              <div className="text-right">Ашигласан хоног:</div>
              <div>
                {moment(new Date()).diff(moment(data?.gereeniiOgnoo), "day")}
              </div>
            </div>
          )}
          {service !== "/gereeSergeeye" && (
            <div className="flex w-full flex-row justify-between">
              <div className="text-right">Авлагын дүн:</div>
              <div>{formatNumber(data?.uldegdel)}</div>
            </div>
          )}
        </div>

        <Input.TextArea
          value={shaltgaan}
          onChange={({ target }) => setTailbar(target?.value)}
        />
      </div>
    );
  }
);

const select = {
  _id: 1,
  gereeniiDugaar: 1,
  gereeniiOgnoo: 1,
  turul: 1,
  ovog: 1,
  ner: 1,
  register: 1,
  albanTushaal: 1,
  zakhirliinOvog: 1,
  zakhirliinNer: 1,
  utas: 1,
  mail: 1,
  khayag: 1,
  khugatsaa: 1,
  duusakhOgnoo: 1,
  sariinTurees: 1,
  zuvshuurliinZurag: 1,
  talbainDugaar: 1,
  talbainNegjUne: 1,
  talbainNiitUne: 1,
  talbainKhemjee: 1,
  davkhar: 1,
  baritsaaBairshuulakhKhugatsaa: 1,
  baritsaaAvakhKhugatsaa: 1,
  baiguullagiinId: 1,
  baiguullagiinNer: 1,
  barilgiinId: 1,
  gereeniiZagvariinId: 1,
  tulukhUdur: 1,
  tuluv: 1,
  dans: 1,
  gereeniiTuukhuud: 1,
};

function ZakhialgiinKhyanalt() {
  //#region const
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [shuult, setShuult] = React.useState({
    utga: "Хэвийн",
    query: {
      tuluv: { $nin: [-1] },
      duusakhOgnoo: { $gte: new Date() },
    },
  });
  const { order, onChangeTable } = useOrder({ createdAt: -1 });
  const { gereeniiMedeelel, gereeniiMedeelelMutate, setGereeniiKhuudaslalt } =
    useGereeniiJagsaalt(
      token,
      baiguullaga?._id,
      undefined,
      shuult?.query,
      undefined,
      1000,
      order,
      select
    );
  const { gereeToollolt, gereeToolloltMutate } =
    useGereeniiJagsaaltToollolt(token);
  const [kharuulakhGeree, setKharuulakhGeree] = React.useState(null);
  const [gereeniiTokhirgoo, setGereeniiTokhirgoo] = React.useState(null);

  const componentRef = React.useRef();
  const excelref = React.useRef();
  const tailbarRef = React.useRef();
  const sungaltRef = React.useRef();

  const [shineBagana, setShineBagana] = React.useState([]);
  useEffect(() => {
    Aos.init();
  });
  //#endregion

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const khyanaltiinDun = [
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.kheviin, 0)
          : 0,

      icon: <FileDoneOutlined />,
      utga: "Хэвийн",
      color: "text-green-500",
      selectedColor: "bg-green-100",
      border: "border-green-500",
      query: {
        tuluv: { $nin: [-1] },
        duusakhOgnoo: { $gte: new Date() },
      },
    },
    {
      too: 0,
      icon: <UserOutlined />,
      utga: "Онцгой",
      color: "text-green-500",
      selectedColor: "bg-green-100",
      border: "border-green-500",
      query: {},
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.khugatsaaKhetersen, 0)
          : 0,
      icon: <HistoryOutlined />,
      utga: "Хугацаа хэтэрсэн",
      color: "text-red-500",
      selectedColor: "bg-red-100",
      border: "border-red-500",
      query: {
        tuluv: { $ne: -1 },
        duusakhOgnoo: { $lte: new Date() },
      },
    },
    {
      too: 0,
      icon: <FileSyncOutlined />,
      utga: "Хаагдсан",
      color: "text-blue-500",
      selectedColor: "bg-blue-100",
      border: "border-blue-500",
      query: { tuluv: 9 },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.sungakh, 0)
          : 0,
      icon: <WarningOutlined />,
      utga: "Сунгах гэрээ",
      color: "text-yellow-500",
      selectedColor: "bg-yellow-100",
      border: "border-yellow-500",
      query: {
        tuluv: { $ne: -1 },
        duusakhOgnoo: { $lte: moment(new Date()).add(1, "month") },
      },
    },
    {
      too:
        gereeToollolt !== undefined
          ? gereeToollolt?.reduce((a, b) => b.tsutsalsan, 0)
          : 0,
      icon: <FileExcelOutlined />,
      utga: "Цуцласан",
      color: "text-gray-800",
      selectedColor: "bg-gray-200",
      border: "border-gray-800",
      query: { tuluv: -1 },
    },
  ];

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "Бүртгэсэн",
        dataIndex: "createdAt",
        ellipsis: true,
        align: "center",
        width: "8rem",
        render(date) {
          return moment(date).format("YYYY-MM-DD HH:mm");
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: "Гэрээ",
        dataIndex: "gereeniiDugaar",
        align: "center",
        ellipsis: true,
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: "Талбай",
        dataIndex: "talbainDugaar",
        align: "center",
        ellipsis: true,
        width: "5rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: "Нэр",
        dataIndex: "ner",
        align: "left",
        ellipsis: true,
        maxWidth: "12rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: "Регистр",
        dataIndex: "register",
        align: "center",
        ellipsis: true,
        maxWidth: "15rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: "Талбай /м2/",
        dataIndex: "talbainKhemjee",
        align: "center",
        ellipsis: true,
        render: (talbainKhemjee) => {
          return `${talbainKhemjee} м2`;
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: "Төлбөр",
        dataIndex: "sariinTurees",
        align: "right",
        ellipsis: true,
        render: (sariinTurees) => {
          return formatNumber(sariinTurees || 0);
        },
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: "Эхлэх",
        dataIndex: "gereeniiOgnoo",
        align: "center",
        ellipsis: true,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD");
        },
      },
      {
        title: "Өдөр",
        dataIndex: "udur",
        align: "center",
        ellipsis: true,
        render: (t, row) => {
          return moment(row.duusakhOgnoo).diff(moment(new Date()), "days");
        },
        showSorterTooltip: false,
        sorter: (a, b) =>
          moment(a.duusakhOgnoo).diff(moment(new Date()), "days") -
          moment(b.duusakhOgnoo).diff(moment(new Date()), "days"),
      },
      {
        title: shuult.utga === "Цуцласан" ? "Цуцлагдсан" : "Дуусах",
        dataIndex:
          shuult.utga === "Цуцласан" ? "gereeniiTuukhuud" : "duusakhOgnoo",
        align: "center",
        ellipsis: true,
        render: (data) => {
          let ognoo =
            shuult.utga === "Цуцласан"
              ? data?.find((a) => a.turul === "Tsutslakh")?.khiisenOgnoo
              : data;
          return moment(ognoo).format("YYYY-MM-DD");
        },
        showSorterTooltip: false,
        defaultSortOrder: "descend",
        sorter: () => 0,
      },
      {
        title: "Ажилтан",
        dataIndex: "burtgesenAjiltaniiNer",
        align: "center",
        ellipsis: true,
        render: () => {
          return "Админ";
        },
      },
    ];

    return [
      ...jagsaalt,
      ...shineBagana,
      {
        title: () => <SettingOutlined />,
        fixed: "right",
        className: "text-center",
        align: "center",
        width: "3rem",
        render: (data) => (
          <div className="flex flex-row justify-center">
            <Popover
              onVisibleChange={(visible) =>
                setGereeniiTokhirgoo(visible === true ? data?._id : null)
              }
              visible={data?._id === gereeniiTokhirgoo}
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  <a
                    className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100"
                    onClick={() => gereeKharya(data)}
                  >
                    <EyeOutlined style={{ fontSize: "18px" }} />{" "}
                    <label> Харах</label>
                  </a>
                  {shuult.utga !== "Цуцласан" && (
                    <a
                      className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100"
                      onClick={() => {
                        if (
                          ajiltan?.erkh === "Admin" ||
                          !!_.get(ajiltan, `tokhirgoo.gereeZasakhErkh`)?.find(
                            (a) => a === data.barilgiinId
                          )
                        )
                          router.push(
                            `/khyanalt/geree/gereeBaiguulakh/${data._id}`
                          );
                        else
                          notification.warning({
                            message: "Таньд гэрээ засах эрх байхгүй байна.",
                          });
                      }}
                    >
                      <EditOutlined style={{ fontSize: "18px" }} />
                      <label> Засах</label>
                    </a>
                  )}
                  {shuult.utga !== "Цуцласан" && (
                    <a
                      className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100"
                      onClick={() => gereeSungaya(data)}
                    >
                      <FieldTimeOutlined style={{ fontSize: "18px" }} />
                      <label> Сунгах</label>
                    </a>
                  )}
                  {shuult.utga !== "Цуцласан" && (
                    <Popconfirm
                      title="Цуцлахдаа итгэлтэй байна уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => gereeTsutsalya(data)}
                    >
                      <a className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100">
                        <MinusCircleOutlined style={{ fontSize: "18px" }} />
                        <label> Цуцлах</label>
                      </a>
                    </Popconfirm>
                  )}
                  {shuult.utga === "Цуцласан" && (
                    <Popconfirm
                      title="Сэргээх үйлдэл хийхдээ итгэлтэй байна уу?"
                      okText="Тийм"
                      cancelText="Үгүй"
                      onConfirm={() => gereeSergeeye(data)}
                    >
                      <a className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100">
                        <RedoOutlined style={{ fontSize: "18px" }} />
                        <label> Сэргээх</label>
                      </a>
                    </Popconfirm>
                  )}
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <a className="flex items-center justify-center rounded-full hover:bg-gray-200">
                <MoreOutlined style={{ fontSize: "18px" }} />
              </a>
            </Popover>
          </div>
        ),
      },
    ];
  }, [baiguullaga, token, gereeniiTokhirgoo, shuult, shineBagana]);

  function refresh() {
    gereeniiMedeelelMutate();
    gereeToolloltMutate();
  }

  //#region dialogs
  function gereeTsutsalya(data) {
    setGereeniiTokhirgoo(null);
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        Цуцлах
      </Button>,
    ];
    modal({
      width: "20vw",
      title: "Цуцалсан шалтгаан",
      icon: <MinusCircleOutlined />,
      content: (
        <Tailbar
          service="/gereeTsutslaya"
          ref={tailbarRef}
          data={data}
          token={token}
          confirm={() => refresh()}
        />
      ),
      footer,
    });
  }

  function gereeSergeeye(data) {
    setGereeniiTokhirgoo(null);
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        Сэргээх
      </Button>,
    ];
    modal({
      width: "20vw",
      title: "Сэргээх шалтгаан",
      icon: <MinusCircleOutlined />,
      content: (
        <Tailbar
          service="/gereeSergeeye"
          ref={tailbarRef}
          data={data}
          token={token}
          confirm={() => refresh()}
        />
      ),
      footer,
    });
  }

  function gereeSungaya(data) {
    setGereeniiTokhirgoo(null);
    const footer = [
      <Button onClick={() => sungaltRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => sungaltRef.current.khadgalya()}>
        Сунгах
      </Button>,
    ];
    modal({
      width: "20vw",
      title: "Гэрээ сунгах",
      icon: <MinusCircleOutlined />,
      content: (
        <Sungakh
          ref={sungaltRef}
          data={data}
          token={token}
          confirm={() => refresh()}
        />
      ),
      footer,
    });
  }

  function gereeKharya(geree) {
    readMethod("gereeniiZagvar", token, geree.gereeniiZagvariinId).then(
      ({ data }) => {
        if (!!data) {
          if (geree.gereeniiOgnoo) {
            geree.ekhlekhOn = moment(geree.gereeniiOgnoo).format("YYYY");
            geree.ekhelkhSar = moment(geree.gereeniiOgnoo).format("MM");
            geree.ekhlekhUdur = moment(geree.gereeniiOgnoo).format("DD");
            if (geree.khugatsaa > 0) {
              let duusakhOgnoo = moment(geree.gereeniiOgnoo).add(
                geree.khugatsaa,
                "M"
              );
              geree.duusakhOn = duusakhOgnoo.format("YYYY");
              geree.duusakhSar = duusakhOgnoo.format("MM");
              geree.duusakhUdur = duusakhOgnoo.format("DD");
            }
          }
          geree.talbainNegjUneUsgeer = toWords(geree.talbainNegjUne);
          geree.talbainNiitUneUsgeer = toWords(geree.talbainNiitUne);

          for (const [key, value] of Object.entries(geree)) {
            data.dedKhesguud
              .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
              .map((b) => {
                b.zaalt = b.zaalt.replace(
                  new RegExp(`&lt;${key}&gt;`, "g"),
                  value
                );
              });
            data.baruunTolgoi = data.baruunTolgoi?.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              value
            );
          }
          data.geree = geree;
          setKharuulakhGeree(data);
          setGereeniiTokhirgoo(null);
        }
      }
    );
  }

  function gereeOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GereeExceleesOruulakh
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          onFinish={refresh}
          zam="gereeniiExcelTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Харилцагч загварын excel файл"
          zagvariinZam="gereeniiExcelAvya"
        />
      ),
      footer,
    });
  }
  function baganaNemekh(e, ner, utga) {
    if (e.target.checked === true) {
      var nemekhBagana = {
        title: ner,
        dataIndex: utga,
        ellipsis: true,
        width: "5rem",
        showSorterTooltip: false,
        sorter: () => 0,
      };
      shineBagana.push(nemekhBagana);
      setShineBagana([...shineBagana]);
    } else {
      var khasakh = shineBagana.filter(function (item) {
        return item.dataIndex !== utga;
      });
      setShineBagana([...khasakh]);
    }
  }
  const menu = (
    <Menu className="contents self-center">
      <Menu.Item key="1">
        <Checkbox
          value={"khugatsaa"}
          onClick={(e) => baganaNemekh(e, "Хугацаа", "khugatsaa")}
        >
          Хугацаа
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="2">
        <Checkbox
          value={"davkhar"}
          onClick={(e) => baganaNemekh(e, "Давхар", "davkhar")}
        >
          Давхар
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="3">
        <Checkbox
          value={"utas"}
          onClick={(e) => baganaNemekh(e, "Утас", "utas")}
        >
          Утас
        </Checkbox>
      </Menu.Item>
      <Menu.Item key="4">
        <Checkbox
          value={"turul"}
          onClick={(e) => baganaNemekh(e, "Төрөл", "turul")}
        >
          Төрөл
        </Checkbox>
      </Menu.Item>
    </Menu>
  );

  function excelTatakh() {
    excelTatajAvya(
      token,
      "/geree",
      gereeniiMedeelel.niitMur,
      sheet,
      shuult.query,
      order,
      "гэрээний жагсаалт"
    );
  }

  //#endregion

  return (
    <Admin
      khuudasniiNer="gereeBurtgel"
      title="Гэрээний жагсаалт"
      className="p-0 md:p-5"
      tsonkhniiId="61c2c5dc1c2830c4e6f90c6d"
      onSearch={(search) =>
        setGereeniiKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <Drawer
        title={kharuulakhGeree?.gereeniiDugaar}
        width={"50vw"}
        onClose={() => setKharuulakhGeree(null)}
        visible={!!kharuulakhGeree}
        footer={
          <div>
            <button onClick={handlePrint}>Хэвлэх</button>
          </div>
        }
      >
        {!!kharuulakhGeree && (
          <GereeKharakh
            ref={componentRef}
            print={handlePrint}
            data={kharuulakhGeree}
          />
        )}
      </Drawer>
      <Card className="cardgrid col-span-12 p-5">
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className={`border-2 ${
                  mur?.utga === shuult?.utga ? mur.border : "border-green-500"
                } intro-y zoom-in col-span-12 cursor-pointer rounded-xl sm:col-span-12 lg:col-span-2 ${
                  mur?.utga === shuult?.utga ? mur.selectedColor : ""
                }`}
                onClick={() => setShuult(mur)}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <div className="h-full rounded-xl">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div
                          className={`text-3xl ${
                            mur?.utga === shuult?.utga
                              ? mur.color
                              : "text-green-500"
                          } font-bold`}
                        >
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div
                          className={`${
                            mur?.utga === shuult?.utga
                              ? mur.color
                              : "text-green-500"
                          } text-2xl`}
                        >
                          {mur.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-row">
          <DatePicker.RangePicker
            locale={locale}
            data-aos="zoom-in-right"
            data-aos-duration="1000"
            data-aos-delay="300"
          />
          <div
            className="ml-auto flex place-content-end"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <Popover
              content={() => (
                <div className="contents w-32 flex-col">{menu}</div>
              )}
              style={{ padding: 0 }}
              placement="bottom"
              trigger="click"
            >
              <Button
                style={{ marginRight: "10px" }}
                type="primary"
                icon={<UnorderedListOutlined style={{ fontSize: "16px" }} />}
              >
                <span>Багана</span>
              </Button>
            </Popover>
            <Popover
              content={() => (
                <div className="flex w-32 flex-col">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100"
                    onClick={gereeOruulakhExcel}
                  >
                    <UploadOutlined style={{ fontSize: "18px" }} />
                    <label>Оруулах</label>
                  </a>
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100"
                    onClick={excelTatakh}
                  >
                    <DownloadOutlined style={{ fontSize: "18px" }} />
                    <label>Татах</label>
                  </a>
                </div>
              )}
              style={{ padding: 0 }}
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
          </div>
        </div>
        <div className="mt-8 hidden overflow-auto md:block">
          <Table
            bordered
            tableLayout="auto"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
            scroll={{ y: "calc(100vh - 32rem)" }}
            size="small"
            loading={!gereeniiMedeelel}
            rowKey={(row) => row._id}
            onChange={(a, b, c) =>
              !JSON.stringify(c).includes("udur") && onChangeTable(a, b, c)
            }
            columns={columns}
            dataSource={gereeniiMedeelel?.jagsaalt}
            pagination={{
              current: gereeniiMedeelel?.khuudasniiDugaar,
              pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
              total: gereeniiMedeelel?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setGereeniiKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
        </div>
        <CardList
          keyValue="geree"
          className="block overflow-auto md:hidden"
          jagsaalt={gereeniiMedeelel?.jagsaalt}
          Component={GereeTile}
          componentProps={{ router }}
          pagination={{
            current: gereeniiMedeelel?.khuudasniiDugaar,
            pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
            total: gereeniiMedeelel?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setKhuudaslalt((kh) => ({
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

export default ZakhialgiinKhyanalt;
