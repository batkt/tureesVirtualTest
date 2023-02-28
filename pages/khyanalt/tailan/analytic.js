import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import TableRenderers from "react-pivottable/TableRenderers";
import "react-pivottable/pivottable.css";
import useTailan from "hooks/tailan/useTailan";
import moment from "moment";
import createPlotlyRenderers from "react-pivottable/PlotlyRenderers";
import dynamic from "next/dynamic";
import _ from "lodash";
import PivotTableUI from "react-pivottable/PivotTableUI";
import { useAuth } from "services/auth";
import formatNumber from "tools/function/formatNumber";
import { t } from "i18next";
import useJagsaalt from "hooks/useJagsaalt";
import { Button, DatePicker,  notification,  Popconfirm,  Select, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, FileExcelOutlined, PlusOutlined } from "@ant-design/icons";
import locale from "antd/lib/date-picker/locale/mn_MN";
import TailanZagvar from "components/pageComponents/tailan/TailanZagvar";
import { modal } from "components/ant/Modal";
import deleteMethod from "tools/function/crud/deleteMethod";

const DynamicPlot = dynamic(import("react-plotly.js"), {
  ssr: false,
});

const service = "analitikTailanAvya";

function converter(key) {
  let ret = undefined;
  switch (key) {
    case "aldangiinUldegdel":
      ret = "Алдангийн үлдэгдэл";
      break;
    case "baiguullagiinNer":
      ret = "Байгууллагын нэр";
      break;
    case "baritsaaAvakhDun":
      ret = "Барьцаа авах дүн";
      break;
    case "baritsaaAvakhKhugatsa":
      ret = "Барьцаа авах хугацаа";
      break;
    case "baritsaaBairshuulakhKhugatsaa":
      ret = "Барьцаа байршуулах хугацаа";
      break;
    case "baritsaaniiUldegdel":
      ret = "Барьцааны үлдэгдэл";
      break;
    case "khariltsagchiinKhayag":
      ret = "Хаяг";
      break;
    case "dans":
      ret = "Данс";
      break;
    case "daraagiinTulukhOgnoo":
      ret = "Дараагийн төлөх огноо";
      break;
    case "davkhar":
      ret = "Давхар";
      break;
    case "duusakhOgnoo":
      ret = "Дуусах огноо";
      break;
    case "gereeniiDugaar":
      ret = "Гэрээний дугаар";
      break;
    case "gereeniiOgnoo":
      ret = "Гэрээний огноо";
      break;
    case "idevkhiteiEsekh":
      ret = "Идэвхтэй эсэх";
      break;
    case "khugatsaa":
      ret = "Хугацаа";
      break;
    case "khungulukhEsekh":
      ret = "Хөнгөлөх эсэх";
      break;
    case "mail":
      ret = "И-мэйл";
      break;
    case "ner":
      ret = "Нэр";
      break;
    case "ovog":
      ret = "Овог";
      break;
    case "register":
      ret = "Регистр";
      break;
    case "sariinTurees":
      ret = "Сарын түрээс";
      break;
    case "segmentuud":
      ret = "Ангилал";
      break;
    case "talbainDugaar":
      ret = "Талбайн дугаар";
      break;
    case "talbainKhemjee":
      ret = "Талбайн хэмжээ";
      break;
    case "talbainNegjUne":
      ret = "Талбайн нэгж үнэ";
      break;
    case "talbainNiitUne":
      ret = "Талбайн нийт үнэ";
      break;
    case "tulukhUdur":
      ret = "Төлөх өдөр";
      break;
    case "tuluv":
      ret = "Төлөв";
      break;
    case "turul":
      ret = "Төрөл";
      break;
    case "uldegdel":
      ret = "Үлдэгдэл";
      break;
    case "utas":
      ret = "Утас";
      break;
    case "zardluud":
      ret = "Зардлууд";
      break;
    default:
      break;
  }
  return ret;
}

function Tailan({ token }) {
  const { barilgiinId, baiguullaga } = useAuth();

  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const query = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      ekhlekhOgnoo: !!ognoo ? ognoo[0].format("YYYY-MM-DD 00:00:00") : undefined,
      duusakhOgnoo: !!ognoo ? ognoo[1].format("YYYY-MM-DD 00:00:00") : undefined,
    };
  }, [ognoo, barilgiinId]);

  const tailan = useTailan(service, token, query);
  const [table, setTable] = useState({});
  const [SSR, setSSR] = useState(false);
  const [selectValue, setSelectValue] = useState(null)
  const ref = useRef(null);
  const zagvarQuery = useMemo(() => {
    return {
      turul: "analytik",
    };
  }, []);

  const zagvar = useJagsaalt("/tailangiinZagvar", zagvarQuery);

  const data = useMemo(() => {
    let array = [];
    //return tailan?.tailanGaralt || [];

    if (tailan?.tailanGaralt?.length > 0) {
      tailan?.tailanGaralt.forEach((tmur) => {
        let murutga = Object.assign({},tmur)
        murutga.aldangiinUldegdel = formatNumber(tmur.aldangiinUldegdel) || 0;
        murutga.baiguullagiinNer = tmur.baiguullagiinNer || "";
        murutga.baritsaaAvakhDun = formatNumber(tmur.baritsaaAvakhDun) || 0;
        murutga.baritsaaAvakhKhugatsa = tmur.baritsaaAvakhKhugatsa || "";
        murutga.baritsaaBairshuulakhKhugatsaa =
          tmur.baritsaaBairshuulakhKhugatsaa || "";
          murutga.baritsaaniiUldegdel = formatNumber(tmur.baritsaaniiUldegdel) || 0;
          murutga.khariltsagchiinKhayag = tmur.khariltsagchiinKhayag || "";
          murutga.dans = tmur.dans || "";
          murutga.daraagiinTulukhOgnoo = tmur.daraagiinTulukhOgnoo || "";
          murutga.davkhar = tmur.davkhar || "";
          murutga.duusakhOgnoo = tmur.duusakhOgnoo || "";
          murutga.gereeniiDugaar = tmur.gereeniiDugaar || "";
          murutga.gereeniiOgnoo = tmur.gereeniiOgnoo || "";
          murutga.idevkhiteiEsekh = tmur.idevkhiteiEsekh || 0;
          murutga.khugatsaa = tmur.khugatsaa || "";
          murutga.khungulukhEsekh = tmur.khungulukhEsekh || "";
          murutga.mail = tmur.mail || "";
          murutga.ner = tmur.ner || "";
          murutga.ovog = tmur.ovog || "";
          murutga.register = tmur.register || "";
          murutga.sariinTurees = formatNumber(tmur.sariinTurees) || 0;
          murutga.segmentuud = tmur.segmentuud || "";
          murutga.talbainDugaar = tmur.talbainDugaar || "";
          murutga.talbainKhemjee = formatNumber(tmur.talbainKhemjee) || "";
          murutga.talbainNegjUne = formatNumber(tmur.talbainNegjUne) || "";
          murutga.talbainNiitUne = formatNumber(tmur.talbainNiitUne) || "";
          murutga.tulukhUdur = tmur.tulukhUdur || "";
          murutga.tuluv = tmur.tuluv || "";
          murutga.turul = tmur.turul || "";
          murutga.uldegdel = formatNumber(tmur.uldegdel) || 0;
          murutga.utas = tmur.utas || 0;
          murutga.zardluud = tmur.zardluud || 0;

        let mur = {};
        Object.entries(murutga).map((v) => {
          if (_.isObject(v[1]) || _.isArray(v[1])) murutga[v[0]] = "";
          else if (_.isNumber(v[1])) murutga[v[0]] = v[1];
          else if (moment(v[1], moment.ISO_8601, true).isValid()) {
            murutga[v[0]] = moment(v[1]).format("YYYY-MM-DD");
          }
          let key = t(converter(v[0]));
          if (key) {
            mur[key] = murutga[v[0]];
          }
        });
        array.push(mur);
      });
    }
    return array;
  }, [tailan]);

  const PlotlyRenderers = useMemo(() => {
    if (!SSR) {
      return createPlotlyRenderers(DynamicPlot);
    }
    return undefined;
  }, [SSR]);

  useLayoutEffect(() => {
    setSSR(typeof window === "undefined");
  }, []);

  function zagvarBurtgeye(data) {
    if (!!data.object) {
      data.object.data = undefined;
      data.object.tailanGaralt = undefined;
      data.object.isValidating = undefined;
      data.object.unusedOrientationCutoff = undefined;
    }
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "Загвар бүртгэл",
      icon: <PlusOutlined />,
      content: (
        <TailanZagvar
          ref={ref}
          data={data}
          setTable={setTable}
          setSelectValue={setSelectValue}
          token={token}
          barilgiinId={barilgiinId}
          baiguullagiinId={baiguullaga?._id}
          refresh={zagvar.refresh}
        />
      ),
      footer,
    });
  }

  return (
    <Admin
      title="Тайлан"
      khuudasniiNer="analytictailan"
      className="p-0 md:p-4"
      tsonkhniiId={"630448aaa612b4cdd5f1fc08"}
    >
      <div className="col-span-12 flex flex-col items-center gap-3 md:flex-row">
        <DatePicker.RangePicker
          className="w-full md:w-auto"
          locale={locale}
          value={ognoo}
          onChange={setOgnoo}
        />
        <div className="">
          <Select
          allowClear 
          value={selectValue}
            style={{ minWidth: "11rem" }}
            placeholder="Тайлангийн загвар"
            onChange={(v) => {      
              setSelectValue(v)        
              setTable(v === undefined ? {} : { ...zagvar.jagsaalt.find((a) => a._id === v)?.object });
            }}
          >
            {zagvar.jagsaalt.map((mur) => (
              <Select.Option value={mur._id} key={mur._id}>
                <div className="flex flex-row">
                  <Tooltip title={<div>{mur.ner}</div>}>
                  <div className="truncate">{mur.ner}</div>
                  </Tooltip>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      zagvarBurtgeye({...mur, object: table});
                    }}
                    className="ml-auto rounded-md px-1 text-yellow-500 hover:bg-yellow-400 hover:text-white"
                  >
                    <EditOutlined />
                  </div>
                  <Popconfirm
                    title="Гэрээний загвар устгах уу?"
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteMethod("tailangiinZagvar", token, mur._id).then(
                        ({data}) => {
                          if (data === "Amjilttai") {
                            notification.success({
                              message: "Амжилттай",
                              description: "Амжилттай устгалаа",
                            });
                            zagvar.refresh();
                            setSelectValue(null);
                            setTable({});
                          }                          
                        }
                      );
                    }}
                  >
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="ml-1 rounded-md px-1 text-red-500 hover:bg-red-400 hover:text-white"
                    >
                      <DeleteOutlined />
                    </div>
                  </Popconfirm>
                </div>
              </Select.Option>
            ))}
          </Select>          
        </div>
        <Button
        className="bg-white"
          onClick={() => zagvarBurtgeye({ object: table, turul: "analytik" })}
        >
          Загвар бүртгэх
        </Button>
        <Button
        className="bg-white"
          icon={<FileExcelOutlined />}
          onClick={() => {
            const { Excel } = require("antd-table-saveas-excel");
            const excel = new Excel();
            excel
              .addSheet("Аналитик тайлан")
              .addColumns(
                table.rows.map((mur) => {
                  return { title: mur, dataIndex: mur };
                })
              )
              .addDataSource(data)
              .saveAs("Аналитик тайлан.xlsx");
          }}
        >Excel</Button>
      </div>
      <div className="ag-theme-alpine col-span-12 overflow-auto" style={{height: "calc( 100vh - 12rem )"}}>
        {!SSR && !!PlotlyRenderers && (
          <PivotTableUI
            data={data}
            onChange={setTable}
            renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
            {...table}
          />
        )}
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Tailan;
