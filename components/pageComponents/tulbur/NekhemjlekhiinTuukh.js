import { DatePicker, Input } from "antd";
import React, { useImperativeHandle, useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import { useNekhemjlekhiinTuukh } from "hooks/useNekhemjlekhiinTuukh";
import { useTranslation } from "react-i18next";
import locale from "antd/lib/date-picker/locale/mn_MN";
import useNekhemjlekhiinZagvar from "hooks/tulburTootsoo/useNekhemjlekhiinZagvar";

function NekhemjlekhiinTuukh(
  { token, data, refreshData, ognoo, ajiltan, barilgiinId, baiguullaga },
  ref
) {
  const { t, i18n } = useTranslation();
  const [shineOgnoo, setShineOgnoo] = useState(undefined);
  const [search, setSearch] = useState("");
  const searchKeys = ["maililgeesenAjiltniiNer"];
  const [medeelel, setMedeelel] = React.useState();
  const [index, setIndex] = React.useState();
  const [zagvariinId, setZagvariinId] = React.useState();
  const [zagvarNekhemjlekh, setZagvarNekhemjlekh] = React.useState();
  const [zagvariinNer, setZagvariinNer] = React.useState();
  const order = { createdAt: -1 };
  const { nekhemjlekhiinZagvar } = useNekhemjlekhiinZagvar(
    token,
    data.barilgiinId
  );

  const searchGenerator = (search, fields) => {
    if (!!search && !!fields)
      return {
        $or: fields.map((key) => ({
          [key]: { $regex: search, $options: "i" },
        })),
      };
    else return {};
  };
  const query = useMemo(() => {
    return {
      createdAt: !!shineOgnoo
        ? {
            $gte: moment(shineOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(shineOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
      baiguullagiinId: data.baiguullagiinId,
      barilgiinId: data.barilgiinId,
      gereeniiId: data._id,
      register: data.register,
      ...searchGenerator(search, searchKeys),
    };
  }, [data, search, shineOgnoo]);

  const { nekhemjlekhiinTuukhJagsaalt, nekhemjlekhiinTuukhJagsaaltMutate } =
    useNekhemjlekhiinTuukh(token, query, order);
  const printRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  function changedZagvar(row, i) {
    setMedeelel(row.medeelel);
    setZagvariinId(row.nekhemjlekhiinZagvarId);
    setZagvariinNer(row.zagvariinNer);
    setZagvarNekhemjlekh(row.nekhemjlekh);
    setIndex(i);
  }

  const nekhemjlekh = useMemo(() => {
    var zagvar;
    if (zagvariinId && data)
      zagvar = nekhemjlekhiinZagvar?.jagsaalt?.find(
        (a) => a._id === zagvariinId
      );
    return {
      zagvar: zagvarNekhemjlekh,
      mail: medeelel?.mail,
      zagvariinNer: zagvariinNer,
      khuudasniiKhemjee: zagvar?.khuudasniiKhemjee,
      chiglel: zagvar?.chiglel,
      khatuuZagvarEsekh: zagvar?.khatuuZagvarEsekh,
    };
  }, [zagvariinId, medeelel, nekhemjlekhiinZagvar]);

  useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        handlePrint();
      },
      excelTatakh() {},
      refreshData() {
        nekhemjlekhiinTuukhJagsaaltMutate();
      },
    }),
    [printRef, nekhemjlekh]
  );

  return (
    <div className="">
      <div className="flex w-full dark:bg-gray-900 dark:text-gray-50">
        <div className="w-1/3 overflow-y-scroll" style={{ height: "80vh" }}>
          <div className="mb-1 flex justify-between">
            <div className="justify-start">
              <DatePicker.RangePicker
                className="w-full md:w-auto"
                locale={locale}
                value={shineOgnoo}
                onChange={setShineOgnoo}
                placeholder={[t("Эхлэх огноо"), t("Дуусах огноо")]} 
              />
            </div>
            <div>
              <Input
                placeholder={[t("Хайх /Ажилтан/")]}
                type="text"
                onChange={({ target }) => {
                  setSearch(target.value);
                }}
              ></Input>
            </div>
          </div>
          {nekhemjlekhiinTuukhJagsaalt?.jagsaalt.map((a, i) => (
            <div
              className={`flex max-h-[100px] w-full cursor-pointer flex-col border-b-2 border-l-2 border-r-2 p-3 dark:bg-gray-900 ${
                i === index ? "bg-green-600" : "bg-gray-50"
              }`}
              onClick={() => changedZagvar(a, i)}
            >
              <div className="flex justify-between font-bold">
                <div>{a.zagvariinNer}</div>
                <div>{formatNumber(a.medeelel?.niitUldegdel, 2)}</div>
              </div>
              <div className="flex justify-between">
                <div>
                  {a.createdAt &&
                    moment(a.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                </div>
                <div className={`${i === index ? "" : "text-blue-400"}`}>
                  {a.maililgeesenAjiltniiNer}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="ml-5 w-2/3">
          <div className="mb-3 flex w-full items-center justify-start gap-8 border-2 border-b-2 p-3">
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
          <div className="border-2 bg-gray-50 p-5 dark:text-black">
            <div className="flex justify-between">
              <div></div>
              <div>
                <div
                  onClick={() => {
                    setMedeelel(undefined);
                    setZagvariinId(undefined);
                    setZagvarNekhemjlekh(undefined);
                    setZagvariinNer(undefined);
                  }}
                  className="flex text-lg transition-all hover:text-red-500"
                >
                  <CloseCircleOutlined />
                </div>
              </div>
            </div>
            <div
              className={`grid w-full p-2 ${
                nekhemjlekh.khuudasniiKhemjee === "A4" ||
                nekhemjlekh.chiglel === "portrait"
                  ? ""
                  : "grid-cols-2"
              }`}
              ref={printRef}
            >
              <div
                key={`khevlekhNekhemjlel${nekhemjlekh}`}
                className={`block ${
                  nekhemjlekh.khatuuZagvarEsekh
                    ? "h-[6.845in] text-xs"
                    : "a5 sun-editor-editable p-10"
                } `}
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
