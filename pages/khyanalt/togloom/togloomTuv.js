import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import { Button, Card, DatePicker, Input, InputNumber, message, notification, Popconfirm, Popover, Select, Space, Table, TimePicker, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  DownOutlined,
  EyeOutlined,
  FileExcelOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import { modal } from "components/ant/Modal";
import _ from "lodash";
import useOrder from "tools/function/useOrder";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import KhuukhedBurtgel from "components/pageComponents/togloom/TsagBurtgel";
import useJagsaalt from "hooks/useJagsaalt";
import { useToololt } from "hooks/useToololt";
import Tulbur from "components/pageComponents/togloomiinTuv/Tulbur";
import { useTranslation } from "react-i18next";
import BaganiinSongolt from "components/table/BaganiinSongolt";
import { excelTatajAvya } from "../zogsool";
import { t } from "i18next";
import { ImQrcode } from "react-icons/im";
import { useQRCode } from "next-qrcode";
import { useReactToPrint } from "react-to-print";


const QrCodeAvakh = React.forwardRef(({ destroy, duusakhTsag , ekhlekhTsag }, ref) => {
  const khevlekhRef = useRef(null)
  const { Canvas } = useQRCode();
  const handlePrint = useReactToPrint({
    content: () => khevlekhRef.current,
  });

  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        handlePrint()
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [duusakhTsag]
  );

  return (
    <div className="">
        <div ref={khevlekhRef} className="w-full text-xs h-full flex flex-col justify-center gap-2 items-center">
          {/* <div className="w-[80%] max-w-[400px] text-justify"><div>Эхлэх хугацаа: {moment(ekhlekhTsag).format("YYYY-MM-DD HH:mm")}</div> <div>Дуусах хугацаа: {moment(duusakhTsag).format("YYYY-MM-DD HH:mm")}</div></div> */}
          {!!duusakhTsag ? <Canvas
          text={duusakhTsag}
          options={{
            level: 'M',
            margin: 3,
            scale: 4,
            width: 80,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          }}
        />: <div>Хоосон</div> }
        <div className="text-center max-w-[400px]">Энэхүү QR код нь манай тоглоомын төвд дээрх хугацаанд хүчинтэй болохыг анхаарна уу!</div>
        </div>
      </div>
  )
})


const TsutsalsanShaltgaan = React.forwardRef(({ destroy, confirm }, ref) => {
  const [shaltgaan, setTsutsalsanShaltgaan] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(shaltgaan);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [shaltgaan]
  );
  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);
  return (
    <div>
      <Input.TextArea
        value={shaltgaan}
        onChange={({ target }) => setTsutsalsanShaltgaan(target?.value)}
      />
    </div>
  );
});

const TsagSungakh = React.forwardRef(({ data, destroy, confirm, token }, ref) => {
  const [niitDun, setNiitDun] = useState();
  const [ khugatsaa, setKhugatsaa ] = useState();
  const [ ekhlekhTsag, setEkhlekhTsag ] = useState(data?.duusakhTsag);
  const [ duusakhTsag, setDuusakhTsag ] = useState(data?.duusakhTsag);
  const [ asragch, setAsragch ] = useState(data?.asragchiinTurul);



  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(niitDun, khugatsaa, ekhlekhTsag, duusakhTsag, data);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [niitDun, khugatsaa, ekhlekhTsag, duusakhTsag, data]
  );
  function onChangeKhugatsaa(v) {
    setDuusakhTsag(moment(ekhlekhTsag).add("minutes", v))
    setKhugatsaa(v)
  }

  useEffect(() => {
    if (khugatsaa > 0 || asragch.length > 0) {      
      uilchilgee(token)
        .post("/togloomiinDunBoduulya", { minut: khugatsaa || 0, asragchiinToo: asragch.length || 0 })
        .then(({ data }) => {
          if (!!data) {
            setNiitDun(data?.dun)
          } else {setNiitDun(undefined)}
        })
    } else {setNiitDun(undefined)}
  }, [khugatsaa, asragch])
  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center"><label className="w-48 text-end pr-4">{t("Асран хамгаалагч")}:</label><Select className="w-full" mode="multiple" value={asragch} onChange={(v) => {setAsragch(v);} } placeholder="Асран хамгаалагч">
          {["Аав", "Ээж", "Өвөө", "Эмээ", "Ах", "Эгч", "Бусад"].map((a) => {
            return <Select.Option key={a}>{t(a)}</Select.Option>
          })}
        </Select></div>
      <div className="flex items-center"><label className="w-48 pr-4 text-end">{t("Хугацаа/мин/")}:</label><InputNumber className="w-full" placeholder={t("Сунгах хугацаа/мин/")} onChange={(v)=> onChangeKhugatsaa(v)}/></div>
      <div className="flex items-center"><label className="w-48 pr-4 text-end">{t("Эхлэх цаг/мин/")}:</label><TimePicker showSecond={false} placeholder={t("Эхлэх цаг/мин/")} disabled className="w-full" value={moment(ekhlekhTsag)}  autoComplete="off" /></div>
      <div className="flex items-center"><label className="w-48 pr-4 text-end">{t("Дуусах цаг/мин/")}:</label><TimePicker showSecond={false} placeholder={t("Дуусах цаг/мин/")} disabled className="w-full" value={moment(duusakhTsag)} autoComplete="off" /></div>
      <div className="flex items-center"><label className="w-48 pr-4 text-end">{t("Дүн")}:</label><InputNumber value={niitDun} formatter={(value) =>
          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")} disabled={true} placeholder={t("Дүн")} min="1" className="w-full" /></div>
    </div>
  );
});

function DuusakhTsagAvii({ v, data, onRefresh }) {
  const [duussan, setDuussan] = useState(false)
  const tsagTootsoolur = () => {
    const today = moment(new Date()).format("YYYYMMDD");
    const duusakhUdur = moment(v).format("YYYYMMDD");
    const odooginTsag = Number(moment(new Date()).format("HH")) * 60 * 60 + Number(moment(new Date()).format("mm")) * 60 + Number(moment(new Date()).format("ss"));
    const ekhlekhTsag = Number(moment(data?.ekhlekhTsag).format("HH")) * 60 * 60 + Number(moment(data?.ekhlekhTsag).format("mm")) * 60 + Number(moment(data?.ekhlekhTsag).format("ss"));
    const duusakhTsag = Number(moment(v).format("HH")) * 60 * 60 + Number(moment(v).format("mm")) * 60 + Number(moment(v).format("ss"))

    const difference = duusakhTsag - odooginTsag;
    const difference2 = duusakhTsag - ekhlekhTsag;
    let timeLeft = "Дууссан";    
    if (Number(today) <= Number(duusakhUdur)) {
      if (ekhlekhTsag > odooginTsag) {
        var tsag = Math.floor(difference2 / 60 / 60)
        var minut = Math.floor((difference2 - (tsag * 60 * 60)) / 60)
        var second = Math.floor((difference2 - (tsag * 60 * 60) - (minut * 60)))
        timeLeft = {
          hours: tsag,
          minutes: minut,
          seconds: second,
          ekhlekhTsagBoloogui: true
        };
      } else if (difference > 0) {
        var tsag = Math.floor(difference / 60 / 60)
        var minut = Math.floor((difference - (tsag * 60 * 60)) / 60)
        var second = Math.floor((difference - (tsag * 60 * 60) - (minut * 60)))
        timeLeft = {
          hours: tsag,
          minutes: minut,
          seconds: second,
        };
        if (difference < 300 && duussan === false) {
          setDuussan("duhsun")
        }
      } else if (difference === 0) {
        notification.warning({ duration: 0, message: t("Цаг дууслаа"), description: (`${data.ovog} овогтой ${data.ner} цаг дууссан байна!`) });
      } else if (duussan === "duhsun") {
        setDuussan(true);
        onRefresh()
      }
    }

    return timeLeft;
  };

  useEffect(() => {
    if (duussan === true) {
      setTimeout(() => {
        setDuussan(false)
      }, 5000);
    }
  }, [duussan])

  function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
      r = "0" + r;
    }
    return r;
  }

  const [timeLeft, setTimeLeft] = useState("Тооцоолж байна");

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(tsagTootsoolur());
    }, 1000);
  }, [timeLeft, v]);

  if (timeLeft === "Тооцоолж байна") {
    return <div className="animate-pulse">{t("Тооцоолж байна")}</div>
  } else if (timeLeft === "Дууссан") {
    return <div className={`bg-red-500 ${duussan === true && "animate-bounce-fast "} text-white font-medium border cursor-default rounded-lg`}>{t("Дууссан")}</div>
  } else
    return (
      <Popover content={timeLeft?.ekhlekhTsagBoloogui === true && <div>{moment(data?.ekhlekhTsag).format("HH:mm")}-аас эхэлнэ</div>}><div className={`${duussan === "duhsun" ? "bg-yellow-500" : timeLeft?.ekhlekhTsagBoloogui === true ? "bg-blue-600" : "bg-green-500"} text-white font-medium border cursor-default rounded-lg transition-colors`}>{FormatNumberLength(timeLeft.hours, 2)}:{FormatNumberLength(timeLeft.minutes, 2)}:{FormatNumberLength(timeLeft.seconds, 2)}</div></Popover>
    )
}
const searchKeys = ["ner", "utas", "ovog"]
function togloom1() {
  const { t, i18n } = useTranslation()
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();

  const [ognoo, setOgnoo] = useState([
    moment(),
    moment(),
  ]);
  const mashinref = useRef(null);
  const [turul, setTurul] = useState({ shuult:{"tuluv": undefined}});
  const tulburRef = React.useRef(null)
  const [shineBagana, setShineBagana] = useState([]);

  const { toololt, toololtMutate } = useToololt(
    "/togloomiinToololtAvya",
    token,
    ognoo
  );

  const togloomiinDun = useToololt(
    "/togloomiinDunAvya",
    token,
    ognoo
  );
  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  function tsutslakh(data) {
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        {t("Цуцлах")}
      </Button>,
    ];
    modal({
      title: (<div className="flex w-full justify-between items-center">{t("Цуцлах шалтгаан")} <div className="text-xl hover:text-red-400" onClick={() => tailbarRef.current.khaaya()}><CloseCircleOutlined /></div></div>),
      content: (
        <TsutsalsanShaltgaan
          ref={tailbarRef}
          confirm={(shaltgaan) =>
            uilchilgee(token)
              .post("/togloomTsutslaya", {
                id: data._id,
                shaltgaan,
              })
              .then(({ data }) => {
                if (data === "Amjilttai") {
                  message.success("Цуцлагдлаа");
                }
              })
              .finally(() => onRefresh())
          }
        />
      ),
      footer,
    });
  }
  function sungakh(data) {
    const footer = [
      <Button onClick={() => sungakhRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => sungakhRef.current.khadgalya()}>
        {t("Сунгах")}
      </Button>,
    ];
    modal({
      title: (<div className="flex w-full justify-between items-center">{t("Цаг сунгах")}<div className="text-xl hover:text-red-400" onClick={() => sungakhRef.current.khaaya()}><CloseCircleOutlined /></div></div>),
      content: (
        <TsagSungakh
          ref={sungakhRef}
          token={token}
          data={data}
          confirm={(niitDun, khugatsaa, ekhlekhTsag, duusakhTsag, data) =>
            uilchilgee(token)
              .post("/togloomSungaya", {
                khugatsaa,
                niitDun,
                ekhlekhTsag,
                duusakhTsag,
                id: data?._id
              })
              .then(({ data }) => {
                if (data === "Amjilttai") {
                  message.success(t("Цаг амжилттай сунагдлаа"));
                  togloominTuviinGaralt.mutate();
                }
              }).catch(aldaaBarigch)
              .finally(() => onRefresh())
          }
        />
      ),
      footer,
    });
  }

  const query = useMemo(() => {
    return {
      ognoo: ognoo
        ? {
          $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        }
        : undefined,
      ...turul.shuult,
    };
  }, [ognoo, turul]);

  const togloominTuviinGaralt = useJagsaalt("togloomiinTuv", query, order, undefined, searchKeys);
  const tailbarRef = React.useRef(null)
  const sungakhRef = React.useRef(null)


  const toololtGaralt = useMemo(
    () => [
      {
        name: "Нийт",
        too: toololt?.length > 0 && (toololt[0]?.tsutsalsan + toololt[0]?.tulsun + toololt[0]?.tuluugui + toololt[0]?.ekhlesen),
        shuult: { "tuluv": undefined }
      },
      {
        name: "Эхэлсэн",
        too: formatNumber(
          toololt?.length > 0 ? toololt[0]?.ekhlesen : 0,
          0
        ),
        shuult: {
           "$and": [
            {
              ekhlekhTsag: { $lte: new Date() }
            },
            {
              duusakhTsag: { $gt: new Date() }
            },
            {
              tuluv: { $ne: -1 }
            },
          ],
        }
      },
      {
        name: "Цуцлагдсан",
        too: formatNumber(
          toololt?.length > 0 ? toololt[0]?.tsutsalsan : 0,
          0
        ),
        shuult: { "tuluv": -1 }
      },
      {
        name: "Төлсөн",
        too: formatNumber(
          toololt?.length > 0 ? toololt[0]?.tulsun : 0,
          0
        ),
        shuult: {
           "$and" : [
            {
              duusakhTsag: { $lte: new Date() },
            },
            {
              tulburTulsunEsekh: { $eq: true },
            },
          ],
        }
      },
      {
        name: "Төлөөгүй",
        too: formatNumber(
          toololt?.length > 0 ? toololt[0].tuluugui : 0,
          0
        ),
        shuult: {
          "$and" : [
            {
              duusakhTsag: { $lte: new Date() },
            },
            {
              tuluv: { $ne: -1 }
            },
            {
              $or: [
                {
                  tulburTulsunEsekh: { $eq: false },
                },
                {
                  tulburTulsunEsekh: { $not: { $eq: true } },
                },
              ],
            },
          ],
        }
      },
      {
        name: "Хөнгөлсөн",
        too: formatNumber(
          toololt?.length > 0 ? toololt[0]?.khungulsun : 0,
          0
        ),
        shuult: { "khungulsunEsekh" : true }
      },
    ],
    [toololt]
  );

  function onRefresh() {
    toololtMutate();
    togloomiinDun.toololtMutate();
    togloominTuviinGaralt.mutate();
  }

  useEffect(()=> {
    setShineBagana([])
  },[i18n.language])

  function tulburTulyu(data) {
    modal({
      title: (
        <div className="w-full flex flex-row justify-between">
          <div>{t("Тооцоо хийх")}</div>
          <div className="flex items-center">{data?.ovog?.charAt(0)}.{data?.ner}
            <div className="text-xl ml-5 hover:text-red-400" onClick={() => tulburRef.current.khaaya()}><CloseCircleOutlined /></div></div>
        </div>
      ),
      content: (
        <Tulbur
          ref={tulburRef}
          data={_.cloneDeep(data)}
          token={token}
          baiguullaga={baiguullaga}
          barilgiinId={barilgiinId}
          ajiltan={ajiltan}
          onRefresh={onRefresh}
        />
      ),
      footer: false,
    });
  }


  const qrRef = useRef();  
  

  function qrKhevlekh(duusakhTsag, ekhlekhTsag) {    
    const today = moment(new Date()).format("YYYYMMDD");
          const duusakhUdur = moment(duusakhTsag).format("YYYYMMDD");
          const odooginTsag = Number(moment(new Date()).format("HH")) * 60 * 60 + Number(moment(new Date()).format("mm")) * 60 + Number(moment(new Date()).format("ss"));
          const duusakhTsag2 = Number(moment(duusakhTsag).format("HH")) * 60 * 60 + Number(moment(duusakhTsag).format("mm")) * 60 + Number(moment(duusakhTsag).format("ss"))
          const difference = Number(String(duusakhUdur) + String(duusakhTsag2)) - Number(String(today) + String(odooginTsag));

    if (Number(today) <= Number(duusakhUdur)) {
      if (difference > 0) {
        const footer = [
          <Button onClick={() => qrRef.current.khaaya()}>{t("Хаах")}</Button>,
          <Button onClick={() => qrRef.current.khadgalya()}>{t("Хэвлэх")}</Button>,
        ];
        modal({
          title: `Нэвтрэх QRcode`,
          icon: <ImQrcode/>,
          content: (
            <QrCodeAvakh
              ref={qrRef}
              duusakhTsag={duusakhTsag}
              ekhlekhTsag={ekhlekhTsag}
            />
          ),
          footer,
        });
      } else message.warn("Цаг дууссан байна!")
    } else message.warn("Цаг дууссан байна!")
  } 

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        align: "center",
        width: "2.5rem",
        render: (text, record, index) =>
          (togloominTuviinGaralt?.data?.khuudasniiDugaar || 0) *
          (togloominTuviinGaralt?.data?.khuudasniiKhemjee || 0) -
          (togloominTuviinGaralt?.data?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: t("Овог"),
        align: "center",
        dataIndex: "ovog",
        width: "10rem",
        showSorterTooltip: false,
        render: (v) => <div className="w-full text-left">{v}</div>
      },
      {
        title: t("Нэр"),
        align: "center",
        dataIndex: "ner",
        width: "10rem",
        showSorterTooltip: false,
        render: (v) => <div className="w-full text-left">{v}</div>
      },
      {
        title: t("Нас"),
        align: "center",
        dataIndex: "nas",
        width: "4rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Утас"),
        align: "center",
        dataIndex: "utas",
        width: "6rem",
        showSorterTooltip: false,
      },
      {
        title: t("Хугацаа/мин/"),
        align: "center",
        width: "8rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "khugatsaa",
      },
      {
        title: t("Эхлэх цаг"),
        align: "center",
        width: "9rem",
        dataIndex: "ekhlekhTsag",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (v) => {
          return moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Сунгасан/мин/"),
        align: "center",
        width: "8.5rem",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "sungasanMinut",
        render:(data)=> !!data ? data : 0
      },
      {
        title: t("Төлөв"),
        align: "center",
        width: "10rem",
        dataIndex: "tuluv",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (v, data) => {
          return data.tuluv === -1 ? <Popover content={<div className="dark:text-gray-200"><div className="font-medium">Тайлбар:</div> <div className="text-center">-{data?.tsutsalsanShaltgaan}</div></div>}><div className="bg-gray-500 text-white cursor-pointer font-medium border rounded-lg">Цуцлагдсан</div></Popover>
            : data.tuluv === 3 ? <div className="bg-green-500 text-white cursor-pointer font-medium border rounded-lg">Гарсан</div>
              : <DuusakhTsagAvii v={data.duusakhTsag} data={data} onRefresh={onRefresh}/>;
        },
      },
    ];
    return [
      ...jagsaalt,
      ...shineBagana,
      {
        title: t("нийт дүн"),
        align: "center",
        width: "9rem",
        dataIndex: "niitDun",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (v) => {
          return <div className="w-full text-right">{formatNumber(v, 0)}</div>
        },
      },
      {
        title: t("Хөнгөлсөн дүн"),
        dataIndex: "khungulsunDun",
        align: "center",
        width: "10rem",
        showSorterTooltip: false,
        render: (v, data) => {
          const khunglukh = data?.tulbur?.find(a => a.turul === "khunglukh")
          return <div className="w-full flex items-center">{!!khunglukh?.tailbar && <Popover content={<div className="dark:text-gray-200"><div className="font-medium">Тайлбар:</div> <div className="text-center">{khunglukh?.tailbar}</div></div>} ><div className="w-full flex justify-center text-lg text-blue-500"><EyeOutlined className="cursor-pointer" /></div></Popover>} <div className="w-full text-right">{khunglukh ? formatNumber(v, 0) : 0}</div></div>
        },
      },
      {
        fixed: "right",
        width: "5rem",
        title: "QR",
        align: "center",
        render:(a, data)=> <div className="flex w-full justify-center"><div onClick={()=> qrKhevlekh(data?.duusakhTsag, data?.ekhlekhTsag)} className="p-2 bg-gray-200 hover:bg-white transition-all cursor-pointer border-white hover:text-black text-xl rounded-full border-2"><ImQrcode/></div></div>
      },
      {
        fixed: "right",
        width: "10rem",
        title: t("Төлбөр"),
        align: "center",
        ellipsis: true,
        render: (data) => {
          return (
            data.tuluv !== -1 && (data?.tulburTulsunEsekh !== true ||
              data?.ebarimtAvsanEsekh !== true) ? (
              <div className="flex justify-center">
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      data?.tulburTulsunEsekh !== true ? "#FF8505" : "#253985",
                  }}
                  // type={`${data?.tulbur === [] ? "primary" : "warning"}`}
                  size="small"
                  // danger={data?.tuluv === "3"}
                  // icon={<DollarCircleOutlined className="text-white" />}
                  onClick={() => tulburTulyu(data)}
                >
                  {data?.tulburTulsunEsekh !== true? (
                    <div className="text-white flex  justify-center items-center space-x-2">
                      <div className="flex justify-center items-center">
                        <DollarCircleOutlined />
                      </div>
                      <div className="flex justify-center items-center">
                        {t("Төлбөр")}
                      </div>
                    </div>
                  ) : (
                    <div className="text-white flex  justify-center items-center space-x-2 ">
                      <div className="flex justify-center items-center">
                        <PaperClipOutlined />
                      </div>
                      <div className="flex justify-center items-center">
                        {t("И-Баримт")}
                      </div>
                    </div>
                  )}
                </Button>
              </div>
            )
              : (
                <div className="flex justify-center">
                  <Button
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#0CB20C",

                    }}
                    // type={`${data?.tulbur === [] ? "primary" : "warning"}`}
                    size="small"
                  // danger={data?.tuluv === "3"}
                  // icon={<DollarCircleOutlined className="text-white" />}
                  >
                    <div className="text-white flex  justify-center items-center space-x-2">
                      <div className="flex justify-center items-center">
                        <CheckCircleOutlined />
                      </div>
                      <div className="flex justify-center items-center">
                        {t("Дууссан")}
                      </div>
                    </div>
                  </Button>
                </div>
              )
          );
        },
      },
      {
        title: () => <SettingOutlined />,
        ellipsis: true,
        fixed: "right",
        width: "3rem",
        align: "center",
        render: (data, v) => {
          const today = moment(new Date()).format("YYYYMMDD");
          const duusakhUdur = moment(data.duusakhTsag).format("YYYYMMDD");
          const odooginTsag = Number(moment(new Date()).format("HH")) * 60 * 60 + Number(moment(new Date()).format("mm")) * 60 + Number(moment(new Date()).format("ss"));
          const duusakhTsag = Number(moment(data.duusakhTsag).format("HH")) * 60 * 60 + Number(moment(data.duusakhTsag).format("mm")) * 60 + Number(moment(data.duusakhTsag).format("ss"))
          const difference = Number(String(duusakhUdur) + String(duusakhTsag)) - Number(String(today) + String(odooginTsag));
          const ner = data?.ner
          const ovog = data?.ovog
          if (-1 !== data?.tuluv && (data.tulburTulsunEsekh === true || (Number(today) <= Number(duusakhUdur) && difference > 0))) {
            return <div className="flex flex-row justify-center">
              <Popover
              zIndex={10}              
                placement="bottom"
                trigger="hover"
                content={() => (
                  <div className="flex flex-col space-y-2">
                    {data?.tuluv !== 3 && <Popconfirm
                      disabled={data?.tuluv === 3}
                      title={<div>Та үйлчлүүлэгчийн цаг сунгах гэж байна 
                      <div>үргэлжлүүлэх бол тийм товчийг дарна уу</div></div>}
                      okText={t("Тийм")}
                      cancelText={t("Үгүй")}
                      onConfirm={() => sungakh(data)}
                    >
                      <div
                        className={`text-md cursor-pointer rounded-full text-center bg-green-500 py-1 px-3 font-medium text-gray-50`}
                      >
                        {t("Сунгах")}
                      </div>
                    </Popconfirm>}
                    {Number(today) <= Number(duusakhUdur) && difference > 0 && data?.tulburTulsunEsekh !== true && <Popconfirm
                      title={`Та цуцлахдаа итгэлтэй байна уу?`}
                      okText={t("Тийм")}
                      cancelText={t("Үгүй")}
                      onConfirm={() => {tsutslakh(data)}}
                    >
                      <div
                        className={`text-md cursor-pointer rounded-full bg-yellow-500 py-1 px-3 font-medium text-gray-50`}
                      >
                        {t("Цуцлах")}
                      </div>
                    </Popconfirm>}
                    {data.tulburTulsunEsekh === true && difference < 1 && <Popconfirm
                      disabled={data?.tuluv === 3}
                      title={`Та үйлчлүүлэгчийг гаргахдаа итгэлтэй байна уу?`}
                      okText={t("Тийм")}
                      cancelText={t("Үгүй")}
                      onConfirm={() => uilchilgee(token)
                        .post("/khuukhedGargaya", { id: data._id })
                        .then(({ data }) => {
                          if (data === "Amjilttai") {
                            message.success(`${ovog.charAt(0)}.${ner} гарлаа`)
                          }
                        })
                        .finally(() => onRefresh())}
                    >
                      <div
                        className={`text-md cursor-pointer rounded-full bg-${3 === data?.tuluv
                            ? "green"
                            : "blue"
                          }-500 py-1 px-3 font-medium text-gray-50`}
                      >
                        {3 === data?.tuluv
                          ? t("Гарсан")
                          : t("Гаргах")}
                      </div>
                    </Popconfirm>}                    
                  </div>
                )}
              >
                <a className=" flex items-center justify-center  hover:scale-150">
                  <MoreOutlined style={{ fontSize: "18px" }} />
                </a>
              </Popover>
            </div>
          }
        }
      }
      ,]
  }, [turul, token, baiguullaga, barilgiinId, shineBagana, ajiltan, togloominTuviinGaralt, t, onRefresh]);

  useEffect(() => {
    Aos.init({ once: true });
  });

  function khuukhedBurtgekh(data) {
    modal({
      title: (<div className="flex w-full justify-between items-center">{t("Хүүхдийн цаг бүртгэл")} <div className="text-xl hover:text-red-400" onClick={() => mashinref.current.khaaya()}><CloseCircleOutlined /></div></div>),
      icon: <FileExcelOutlined />,
      content: (
        <KhuukhedBurtgel
          ref={mashinref}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          data={data}
        />
      ),
      footer: false
    });
  }

  return (
    <Admin
      title="Тоглоомын төв"
      khuudasniiNer="togloomTuv"
      onSearch={(search) =>
        togloominTuviinGaralt.setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      className="p-0 md:p-4"
      tsonkhniiId={"64113e5d8505554744a87713"}
    >      
      <Card size="small" className="col-span-12 overflow-auto">
        <div className="hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12">
          {toololtGaralt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-2 ${a.name === turul?.name ? "bg-green-50 dark:bg-gray-900" : ""
                }`}
              onClick={() => setTurul({ shuult:a.shuult, name: a.name })}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
              data-aos-delay={1 + i + "00"}
            >
              <div className="h-full w-[67vw] rounded-xl md:w-auto">
                <div className="rounded-xl p-3">
                  <div className="flex flex-row items-center space-x-2">
                    <div className="text-3xl font-bold text-green-600">
                      {a.too || 0}
                    </div>
                    <div className="text-base text-gray-500">{t(`${a.name}`)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="col-span-12">
        <div className="flex flex-col gap-5 md:flex-row">
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <DatePicker.RangePicker
              className="w-full md:w-auto"
              size="middle"
              allowClear={false}
              value={ognoo}
              onChange={setOgnoo}
            />
          </div>
          <div
            className="mb-5 flex w-full items-center justify-between md:ml-auto md:mb-0"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <div className="flex flex-row space-x-2 p-1 text-xs font-medium md:text-base">
              {t("Тоглоомын орлого")} : {!!togloomiinDun?.toololt ? formatNumber(togloomiinDun?.toololt[0]?.dun) : 0}
              ₮
            </div>
            <div className="flex">
              <Button
                style={{ marginRight: "10px" }}
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => khuukhedBurtgekh()}
              >
                {t("Бүртгэл")}
              </Button>
              <BaganiinSongolt
                shineBagana={shineBagana}
                setShineBagana={setShineBagana}
                columns={[
                  {
                    title: t("Хүйс"),
                    align: "center",
                    dataIndex: "khuis",
                    width: "6rem",
                    showSorterTooltip: false,
                    render: (a) => <div>{a === 1 ? "Эрэгтэй" : "Эмэгтэй"}</div>
                  },
                  {
                    title: t("Төрөл"),
                    align: "center",
                    dataIndex: "turul",
                    width: "7rem",
                    showSorterTooltip: false,
                  },
                  {
                    title: t("Хэлбэр"),
                    align: "center",
                    dataIndex: "khelber",
                    width: "7rem",
                    showSorterTooltip: false,
                    render: (v, data) => {
                      const jagsaalt = data?.tulbur.filter(a => a.turul !== "khunglukh")
                      var utga = undefined
                      if (jagsaalt.length > 0) {
                        switch (jagsaalt[0].turul) {
                          case "belen":
                            utga = "Бэлэн"
                            break;
                          case "khariltsakh":
                            utga = "Харилцах"
                            break;
                          default: utga = data?.tulbur[0].turul
                            break;
                        }
                      }
                      return <div>{t(`${utga}`)}</div>
                    }
                  },
                  {
                    title: t("Асран хамгаалагч"),
                    align: "center",
                    dataIndex: "asragchiinTurul",
                    width: "10rem",
                    showSorterTooltip: false,
                    render: (data) => {
                      return <Popover content={<div>{data?.map((data, index) => <div key={index}>{data}</div>)}</div>}>
                        <div className="w-full flex justify-center text-lg text-blue-500"><EyeOutlined className="cursor-pointer" /></div>
                      </Popover>
                    }
                  },
                ]}
              />
              <Popover
                content={() => (
                  <div className="flex w-32 flex-col">

                    <a
                      className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                      onClick={() => {
                        excelTatajAvya(token,'togloomiinTuv',togloominTuviinGaralt.data?.niitMur,[
                          {
                            title: t("Овог"),
                            dataIndex: "ovog",
                            ellipsis: true,
                          },
                          { title: t("Нэр"), dataIndex: "ner", ellipsis: true },
                          {
                            title: t("Нэр"),
                            dataIndex: "ner",
                            ellipsis: true,
                            width: "5rem",
                          },
                          {
                            title: t("Нас"),
                            dataIndex: "nas",
                            ellipsis: true,
                            align: "center",
                          },
                          {
                            title: t("Хүйс"),
                            dataIndex: "khuis",
                            ellipsis: true,
                            align: "center",
                            render: (a) => <div>{a === 1 ? "Эрэгтэй" : "Эмэгтэй"}</div>
                          },
                          {
                            title: t("Утас"),
                            dataIndex: "utas",
                            ellipsis: true,
                            align: "center"
                          },
                          {
                            title: t("Хугацаа /мин/"),
                            dataIndex: "khugatsaa",
                            ellipsis: true,
                            align: "center",
                          },
                          {
                            title: t("Эхлэх цаг"),
                            dataIndex: "ekhlekhTsag",
                            ellipsis: true,                              
                            render: (data) => {
                              return moment(data).format("YYYY-MM-DD HH:mm");
                            },
                          },
                          {
                            title: t("Сунгасан/мин/"),
                            dataIndex: "sungsanMinut",
                            render:(data)=> !!data ? data : 0
                          },
                          {
                            title: t("Дуусах цаг"),
                            dataIndex: "duusakhTsag",
                            ellipsis: true,

                            render: (data) => {
                              return moment(data).format("YYYY-MM-DD HH:mm");
                            },
                          },
                          {
                            title: t("нийт дүн"),
                            dataIndex: "niitDun",
                            ellipsis: true,
                            render: (data) => {
                              return formatNumber(data, 0)
                            },
                          },
                          {
                            title: t("Хөнгөлсөн дүн"),
                            dataIndex: "khungulsunDun",
                            ellipsis: true,
                            render: (data) => {
                              return formatNumber(data, 0)
                            },
                          },
                          {
                            title: t("Хэлбэр"),
                            align: "center",
                            dataIndex: "tulbur",
                            ellipsis: true,
                            render: (data) => {
                              const jagsaalt = data?.filter(a => a.turul !== "khunglukh")
                              var utga = ""
                              if (jagsaalt?.length > 0) {
                                switch (jagsaalt[0].turul) {
                                  case "belen":
                                    utga = "Бэлэн"
                                    break;
                                  case "khariltsakh":
                                    utga = "Харилцах"
                                    break;
                                  default: utga = data?.[0].turul
                                    break;
                                }
                              }
                              return t(utga)
                            }
                          },
                          {
                            title: t("Асран хамгаалагч"),
                            dataIndex: "asragchiinTurul",
                            ellipsis: true,
                            render: (data) => {
                              return data?.map((data) => data)?.join(',')
                            }
                          },                            
                        ],query,order,'Тоглоомын төв')
                       
                      }}
                    >
                      <DownloadOutlined style={{ fontSize: "18px" }} />
                      <label>{t("Татах")}</label>
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
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="300"
          data-aos-anchor-placement="top-bottom"
        >
          <Table
            className="mt-8 hidden overflow-auto md:block"
            dataSource={togloominTuviinGaralt?.jagsaalt}
            scroll={{ y: "calc(100vh - 30rem)" }}
            size="small"
            bordered
            rowKey={(row) => row._id}
            columns={columns}
            onChange={onChangeTable}
            pagination={{
              current: togloominTuviinGaralt?.data?.khuudasniiDugaar,
              pageSize: togloominTuviinGaralt?.data?.khuudasniiKhemjee,
              total: togloominTuviinGaralt?.data?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                togloominTuviinGaralt.setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
          <CardList
            cardListTuluv={"utas"}
            keyValue="uilchluulegch"
            className="block overflow-auto md:hidden"
            jagsaalt={togloominTuviinGaralt?.jagsaalt}
            Component={UilchluulegchTile}
          />
        </div>
      </Card>
    </Admin>
  );
}

export default togloom1;
