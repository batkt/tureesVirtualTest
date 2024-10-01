  import {
  Badge,
  Button,
  DatePicker,
  Input,
  message,
  notification,
  Popconfirm,
} from "antd";
import React, { useImperativeHandle, useMemo, useState } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { DeleteOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import { useNekhemjlekhiinTuukh } from "hooks/useNekhemjlekhiinTuukh";
import { useTranslation } from "react-i18next";
import locale from "antd/lib/date-picker/locale/mn_MN";
import useNekhemjlekh from "hooks/tulburTootsoo/useNekhemjlekh";
import useNekhemjlekhiinZagvar from "hooks/tulburTootsoo/useNekhemjlekhiinZagvar";

function NekhemjlekhiinTuukh(
  { token, data, refreshData, ognoo, ajiltan, barilgiinId },
  ref
) {
  const { t, i18n } = useTranslation();
  const [shineOgnoo, setShineOgnoo] = useState(undefined);
  const [search, setSearch] = useState("");
  const searchKeys = ["maililgeesenAjiltniiNer"];
  const [medeelel, setMedeelel] = React.useState();
  const [index, setIndex] = React.useState();
  const [zagvariinId, setZagvariinId] = React.useState();
  const { nekhemjlekhiinZagvar } = useNekhemjlekhiinZagvar(
    token,
    data.barilgiinId
  );

  const searchGenerator = (search, fields) => {
    if (!!search && !!fields)
      return {
        $or: fields.map((key) => ({ [key]: { $regex: search, $options: "i" } })),
      };
    else return {};
  };
  const query = useMemo(() => {
    return { createdAt: !!shineOgnoo ? { $gte: moment(shineOgnoo[0]).format("YYYY-MM-DD 00:00:00"), $lte: moment(shineOgnoo[1]).format("YYYY-MM-DD 23:59:59"), } : undefined, 
        baiguullagiinId: data.baiguullagiinId, barilgiinId: data.barilgiinId, gereeniiId: data._id, register: data.register, 
        ...searchGenerator(search, searchKeys)};
  }, [data, search, shineOgnoo]);

  const { nekhemjlekhiinTuukhJagsaalt, nekhemjlekhiinTuukhJagsaaltMutate } = useNekhemjlekhiinTuukh(
    token,
    query,
    );
  const [sortOrders, setSortOrders] = useState({
    maililgeesenOgnoo: null,
    ajiltan: null,
    uldegdel: null,
  });
  const [sortColumn, setSortColumn] = useState(null);

  const printRef = React.useRef(null);
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const toggleSortOrder = (column) => {
    const newSortOrders = { ...sortOrders };
    newSortOrders[column] = sortOrders[column] === "asc" ? "desc" : "asc";
    setSortOrders(newSortOrders);
    setSortColumn(column);
  };

  const sortedData = React.useMemo(() => {
    if (!nekhemjlekhiinTuukhJagsaalt) {
      return [];
    }
    const khuulsanData = [...nekhemjlekhiinTuukhJagsaalt.jagsaalt];
    khuulsanData.sort((a, b) => {
      const sortDaraalal = sortOrders[sortColumn];
      if (sortDaraalal === "asc") {
        if (sortColumn === "maililgeesenOgnoo") {
          return new Date(a[sortColumn]) - new Date(b[sortColumn]);
        }
        return a[sortColumn] - b[sortColumn];
      } else if (sortDaraalal === "desc") {
        if (sortColumn === "maililgeesenOgnoo") {
          return new Date(b[sortColumn]) - new Date(a[sortColumn]);
        }
        return b[sortColumn] - a[sortColumn];
      }
      return 0;
    });

    return khuulsanData;
  }, [nekhemjlekhiinTuukhJagsaalt, sortOrders, sortColumn, shineOgnoo]);

  function changedZagvar(row, i) { 
    setMedeelel(row.medeelel);
    setZagvariinId(row.nekhemjlekhiinZagvarId);
    setIndex(i);
  };

  const nekhemjlekh = useMemo(() => {
    if (zagvariinId && data)
      var zagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
        (a) => a._id === zagvariinId
      )?.nekhemjlekh;
    if (!!zagvar && !!medeelel) {
      for (const [key, value] of Object.entries(medeelel)) {
        if (key !== "nemeltNekhemjlekh")
          zagvar = zagvar?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
      }
      let nemeltNekhemjlekh = "";
      if (medeelel.hasOwnProperty("nemeltNekhemjlekh")) {
        medeelel.nemeltNekhemjlekh.forEach((a, index) => {
          let mur = `<tr><td><div style="text-align: center"><span class="se-custom-tag">${
            2 + (index + 1)
          }</span>​​<br /></div></td><td colspan="4" rowspan="1"><div>​<span class="se-custom-tag">&lt;nemeltNekhemjlekh.tailbar&gt;</span>​​<br /></div></td><td colspan="5" rowspan="1"><div>​<span class="se-custom-tag">&lt;nemeltNekhemjlekh.ognoo&gt;</span>​​<br /></div></td><td colspan="2" rowspan="1"><div style="text-align: right"><span class="se-custom-tag">&lt;nemeltNekhemjlekh.tulukhDun&gt;</span>​​<br /></div></td></tr>`;
          a.ognoo = moment(a.ognoo).format("YYYY-MM-DD");
          a.tulukhDun = formatNumber(a.tulukhDun);
          for (const [key, value] of Object.entries(a)) {
            mur = mur?.replace(
              new RegExp(`&lt;nemeltNekhemjlekh.${key}&gt;`, "g"),
              value
            );
          }
          nemeltNekhemjlekh += mur;
        });
      }
      zagvar = zagvar?.replace(
        new RegExp(
          `<tr><td colspan="12" rowspan="1"><div>​<span class="se-custom-tag">&lt;nemeltNekhemjlekh&gt;</span>​​<br></div></td></tr>`
        ),
        nemeltNekhemjlekh
      );
    }
    return { zagvar, mail: medeelel?.mail };
  }, [zagvariinId, medeelel, nekhemjlekhiinZagvar]);

  useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        handlePrint();
      },
      excelTatakh() {
        
      },
      refreshData() {
        nekhemjlekhiinTuukhJagsaaltMutate();
      },
    }),
    [printRef, nekhemjlekh]
  );

  return (
    <div className="">
      <div className="flex w-full dark:text-gray-50 dark:bg-gray-900">
        <div className="w-1/3">
            <div className="flex justify-between mb-1">
              <div className="justify-start">
                <DatePicker.RangePicker
                  className="w-full md:w-auto"
                  locale={locale}
                  value={shineOgnoo}
                  onChange={setShineOgnoo}
                />
              </div>    
              <div>
                <Input placeholder={t("Хайх /Ажилтан/")} type="text" onChange={({ target }) => { setSearch(target.value);}}></Input>
              </div>
            </div>
            {sortedData
              ?.map((a, i) => (
                <div className={`flex w-full flex-col p-3 max-h-[100px] overflow-x-scroll cursor-pointer border-l-2 border-r-2 border-b-2 dark:bg-gray-900 ${i === index ? "bg-[#646464] text-white" : "bg-gray-50"}`} onClick={() => changedZagvar(a, i)}>
                  <div className="flex justify-between font-bold">
                    <div>
                      {t("Үлдэгдэл")}
                    </div>
                    <div>
                      {formatNumber(a.turul === "khyamdral" && a.uldegdel < 0 ? 0 : a.uldegdel, 0)}  
                    </div>
                  </div>  
                  <div className="flex justify-between">
                    <div>
                      {a.createdAt && moment(a.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                    </div>  
                    <div className={`${i === index ? "text-white" : "text-blue-400"}`}>
                      {a.maililgeesenAjiltniiNer}
                    </div>  
                  </div>
                </div>
              ))
              .reverse()}
        </div>
        <div className="w-2/3 ml-5">
          <div className="flex w-full items-center justify-start gap-8 border-2 border-b-2 mb-3 p-3">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <div className="font-bold">{t("Гэрээний дугаар")}:</div>
                <div>{data?.gereeniiDugaar}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-bold">{t("Талбайн дугаар")}:</div>
                <div>{data?.talbainDugaar}</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <div className="font-bold">{t("Нэр")}:</div>
                <div>{data?.ner}</div>
              </div>
              <div className="flex gap-2">
                <div className="font-bold">{t("Утас")}:</div>
                <div>{data?.utas.join(",")}</div>
              </div>
            </div>
          </div>
          <div className="border-2 p-5 bg-gray-50">
            <div className="grid grid-cols-2 " ref={printRef}>
              <div
                key={`khevlekhNekhemjlel${nekhemjlekh}`}
                className="block a5 sun-editor-editable p-10"
                dangerouslySetInnerHTML={{ __html: nekhemjlekh.zagvar }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(NekhemjlekhiinTuukh);
