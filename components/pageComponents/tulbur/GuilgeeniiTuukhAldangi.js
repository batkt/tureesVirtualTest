import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Tabs,
} from "antd";
import useJagsaalt from "hooks/useJagsaalt";
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import _ from "lodash";
import useGereeAldangiGuilgee from "hooks/useGereeniiAldangiJagsaalt";
import { useTranslation } from "react-i18next";
import locale from "antd/lib/date-picker/locale/mn_MN";
import axios, { aldaaBarigch } from "services/uilchilgee";
import { DeleteOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import * as XLSX from "xlsx-js-style";

const Tailbar = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tailbar, setTailbar] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tailbar);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [tailbar]
  );
  return (
    <div>
      <Input.TextArea
        value={tailbar}
        onChange={({ target }) => setTailbar(target?.value)}
      />
    </div>
  );
});

function GuilgeeniiTuukhAldangi(
  { token, data, refreshData, ognoo, ajiltan, barilgiinId },
  ref
) {
  const { t, i18n } = useTranslation();
  const [aldangiDun, setAldangiDun] = useState("");
  const [zasahTailbar, setZasahTailbar] = useState("");
  const [shineOgnoo, setShineOgnoo] = useState(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [aldangiinUldegdel, setAldangiinUldegdel] = useState(undefined);

  const query = useMemo(() => {
    return {
      gereeniiId: data?._id,
    };
  }, [data?._id]);

  const aldangiinTuukh = useJagsaalt(
    "/aldangiinTuukh",
    query,
    undefined,
    undefined,
    undefined,
    token
  );
  const { guilgeeniiAldangiTuukh, guilgeeniiAldangiTuukhMutate } =
    useGereeAldangiGuilgee(token, data?._id, ognoo, shineOgnoo);

  const [sortOrders, setSortOrders] = useState({
    ognoo: null,
    tulukhAldangi: null,
    tulsunAldangi: null,
    dansniiDugaar: null,
    tulsunDans: null,
    ajiltan: null,
    tailbar: null,
    burtgesenOgnoo: null,
    aldangiBodsonOgnoo: null,
    uldegdel: null,
    aldangi: null,
  });
  const [sortColumn, setSortColumn] = useState(null);
  const tailbarRef = React.useRef(null);
  const printRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const fetchAldangiinUldegdel = () => {
    axios(token)
      .get("/geree", {
        params: {
          query: { _id: data?._id, tuluv: { $ne: -1 } },
          select: { aldangiinUldegdel: 1 },
        },
      })
      .then(({ data }) => {
        if (data?.jagsaalt?.length > 0) {
          setAldangiinUldegdel(data.jagsaalt[0].aldangiinUldegdel);
        }
      })
      .catch(aldaaBarigch);
  };

  const canEditAldalgi = useMemo(() => {
    if (ajiltan?.erkh === "Admin") return true;

    const permissionArray = _.get(
      ajiltan,
      `tokhirgoo.aldangiinUldegdelZasakhEsekh`
    );

    if (!permissionArray || !Array.isArray(permissionArray)) {
      return false;
    }

    return permissionArray.includes(barilgiinId);
  }, [ajiltan, barilgiinId]);

  const hadgalakhHandler = () => {
    if (isSubmitting) return;

    if (aldangiDun === "" || aldangiDun === null || aldangiDun === undefined) {
      message.error(t("Алданги дүнг оруулна уу"));
      return;
    }
    const newValue = Number(aldangiDun);
    if (newValue === aldangiinUldegdel) {
      message.warning(t("Алданги өөрчлөгдөөгүй байна"));
      return;
    }

    setIsSubmitting(true);
    axios(token)
      .post("/gereeniiAldangiZasya", {
        khuuchinAldangiDun: data?.aldangiinUldegdel,
        aldangiDun: Number(aldangiDun),
        tailbar: zasahTailbar,
        gereeniiId: data?._id,
        barilgiinId: data?.barilgiinId,
        gereeniiDugaar: data?.gereeniiDugaar,
      })
      .then(() => {
        message.success(t("Амжилттай хадгалагдлаа"));
        closeModal();
        setAldangiDun("");
        setZasahTailbar("");
        guilgeeniiAldangiTuukhMutate();
        fetchAldangiinUldegdel();

        refreshData();
      })
      .catch(aldaaBarigch);
  };

  const toggleSortOrder = (column) => {
    const newSortOrders = { ...sortOrders };
    newSortOrders[column] = sortOrders[column] === "asc" ? "desc" : "asc";
    setSortOrders(newSortOrders);
    setSortColumn(column);
  };

  const sortedData = React.useMemo(() => {
    if (!guilgeeniiAldangiTuukh) {
      return [];
    }
    const khuulsanData = [...guilgeeniiAldangiTuukh];
    khuulsanData.sort((a, b) => {
      const sortDaraalal = sortOrders[sortColumn];
      if (sortDaraalal === "asc") {
        if (sortColumn === "ognoo") {
          return new Date(a[sortColumn]) - new Date(b[sortColumn]);
        }
        return a[sortColumn] - b[sortColumn];
      } else if (sortDaraalal === "desc") {
        if (sortColumn === "ognoo") {
          return new Date(b[sortColumn]) - new Date(a[sortColumn]);
        }
        return b[sortColumn] - a[sortColumn];
      }
      return 0;
    });

    return khuulsanData;
  }, [guilgeeniiAldangiTuukh, sortOrders, sortColumn, shineOgnoo]);

  useImperativeHandle(
    ref,
    () => ({
      khevlekh() {
        handlePrint();
      },
      excelTatakh() {
        exceleerTatya();
      },
      refreshData() {
        guilgeeniiAldangiTuukhMutate();
        setAldangiinUldegdel(undefined);
      },
    }),
    [printRef, guilgeeniiAldangiTuukh]
  );

  const exceleerTatya = async () => {
    try {
      const wb = XLSX?.utils.book_new();
      const dataSubset = guilgeeniiAldangiTuukh?.reverse().map((item) => {
        return {
          Огноо: moment(item.ognoo).format("YYYY/MM/DD"),
          Ажилтан: item.guilgeeKhiisenAjiltniiNer || "",
          "Төлөх алданги": item.tulukhAldangi || 0,
          "Төлсөн алданги": item.tulsunAldangi || item.tulsunDun || 0,
          Данс: item.dansniiDugaar || "",
          "Төлсөн данс": item.tulsunDans || "",
          Тайлбар: item.tailbar || "",
          "Бүртгэсэн огноо": moment(item.guilgeeKhiisenOgnoo).format(
            "YYYY/MM/DD"
          ),
        };
      });
      const ws = XLSX?.utils.json_to_sheet(dataSubset);
      if (ws) {
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { r: R, c: C };
            const cell = ws[XLSX.utils.encode_cell(cellAddress)];
            if (!cell.s) {
              cell.s = {};
            }
            cell.s.border = {
              top: { style: "thin", color: { auto: 1 } },
              bottom: { style: "thin", color: { auto: 1 } },
              left: { style: "thin", color: { auto: 1 } },
              right: { style: "thin", color: { auto: 1 } },
            };
          }
        }
        var wscols = [
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
          { wch: 20 },
        ];

        ws["!cols"] = wscols;
        const headerStyle = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: "88C849" },
          },
          border: {
            top: { style: "thin", color: { auto: 1 } },
            bottom: { style: "thin", color: { auto: 1 } },
            left: { style: "thin", color: { auto: 1 } },
            right: { style: "thin", color: { auto: 1 } },
          },
        };
        ws["A1"].s = headerStyle;
        ws["B1"].s = headerStyle;
        ws["C1"].s = headerStyle;
        ws["D1"].s = headerStyle;
        ws["E1"].s = headerStyle;
        ws["F1"].s = headerStyle;
        ws["G1"].s = headerStyle;
        ws["H1"].s = headerStyle;
        XLSX?.utils.book_append_sheet(wb, ws, "гүйлгээ");
        wb.Custprops;
        XLSX?.writeFile(
          wb,
          data?.gereeniiDugaar + " гэрээний алдангийн хуулга.xlsx",
          {
            WTF: true,
            cellStyles: true,
          }
        );
      }
    } catch (e) {
      aldaaBarigch(e.message);
    }
  };

  useEffect(() => {
    fetchAldangiinUldegdel();
  }, []);

  function tulultUstgaya({
    guilgeeniiId,
    tulsunDun,
    tulukhDun,
    _id,
    turul,
    khyamdral,
  }) {
    if (turul === "baritsaa")
      axios(token)
        .post("/baritsaaniiGuilgeeUstgaya", {
          gereeniiId: data?._id,
          objectiinId: _id,
          zarlaga: tulsunDun || 0,
          orlogo: tulukhDun || 0,
          barilgiinId: data?.barilgiinId,
        })
        .then(({ data }) => {
          if (data) {
            message.success(t("Төлөлт амжилттай устгагдлаа!"));
            refreshData();
            guilgeeniiAldangiTuukhMutate();
          }
        })
        .catch(aldaaBarigch);
    else {
      const footer = [
        <Button onClick={() => tailbarRef.current.khaaya()}>
          {t("Хаах")}
        </Button>,
        <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
          Устгах
        </Button>,
      ];
      modal({
        title: "Төлөлт устгах шалтгаан",
        icon: <DeleteOutlined />,
        content: (
          <Tailbar
            ref={tailbarRef}
            confirm={(tailbar) =>
              axios(token)
                .post("/tulultUstgaya", {
                  turul,
                  guilgeeniiId,
                  gereeniiId: data?._id,
                  tulsunDun,
                  tulukhDun,
                  khyamdral,
                  objectiinId: _id,
                  tailbar,
                  talbainDugaar: data?.talbainDugaar,
                  barilgiinId: data?.barilgiinId,
                })
                .then(({ data }) => {
                  if (data) {
                    message.success(t("Төлөлт амжилттай устгагдлаа!"));
                    refreshData();
                    guilgeeniiAldangiTuukhMutate();
                    setAldangiinUldegdel(undefined);
                  }
                })
                .catch(aldaaBarigch)
            }
          />
        ),
        footer,
      });
    }
  }

  const TableContent = () => (
    <table className="mt-4 w-full">
      <thead className="w-full">
        <tr className="flex min-w-[50rem] divide-x divide-white border-b border-gray-200 bg-gray-200 pr-1 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
          <td
            onClick={() => toggleSortOrder("ognoo")}
            className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
          >
            {t("Огноо")}
          </td>
          <td
            onClick={() => toggleSortOrder("ajiltan")}
            className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
          >
            {t("Ажилтан")}
          </td>
          <td
            onClick={() => toggleSortOrder("tulukhAldangi")}
            className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
          >
            {t("Төлөх алданги")}
          </td>
          <td
            onClick={() => toggleSortOrder("tulsunAldangi")}
            className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
          >
            {t("Төлсөн алданги")}
          </td>
          <td
            onClick={() => toggleSortOrder("dansniiDugaar")}
            className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
          >
            {t("Данс")}
          </td>
          <td
            onClick={() => toggleSortOrder("tulsunDans")}
            className="min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
          >
            {t("Төлсөн данс")}
          </td>
          <td
            onClick={() => toggleSortOrder("tailbar")}
            className="w-full min-w-[8rem] cursor-pointer overflow-hidden p-1 text-center"
          >
            {t("Тайлбар")}
          </td>
          <td
            onClick={() => toggleSortOrder("burtgesenOgnoo")}
            className="min-w-[16rem] cursor-pointer p-1 text-center"
          >
            {t("Бүртгэсэн огноо")}
          </td>
        </tr>
      </thead>
      <tbody
        className="min-w-[50rem] overflow-y-scroll"
        style={{ height: "calc(90vh - 15rem)" }}
      >
        {sortedData
          ?.map((a, i) => (
            <tr
              key={i}
              className="flex min-w-[50rem] divide-x border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400"
            >
              <td className="min-w-[8rem] overflow-hidden p-1 text-center">
                {moment(a.ognoo).format("YYYY-MM-DD")}
              </td>
              <td className="min-w-[8rem] overflow-hidden p-1">
                {a.guilgeeKhiisenAjiltniiNer}
              </td>
              <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                {formatNumber(a.tulukhAldangi, 0)}
              </td>
              <td className="min-w-[8rem] overflow-hidden p-1 text-end">
                {formatNumber(a.tulsunAldangi || a.tulsunDun, 0)}
              </td>
              <td className="flex min-w-[8rem] justify-center p-1 text-center ">
                {a.dansniiDugaar}
              </td>
              <td className="flex min-w-[8rem] justify-center p-1 text-center ">
                {a.tulsunDans}
              </td>
              <td className="flex w-full min-w-[8rem] justify-between overflow-hidden p-1">
                {a.tailbar}
              </td>
              <td className="flex w-full justify-center p-1 text-center ">
                {a.guilgeeKhiisenOgnoo &&
                  moment(a.guilgeeKhiisenOgnoo).format("YYYY-MM-DD HH:mm:ss")}
              </td>
              <td className="flex min-w-[3rem] justify-center border-none">
                {(ajiltan?.erkh === "Admin" ||
                  !!_.get(ajiltan, `tokhirgoo.guilgeeUstgakhErkh`)?.find(
                    (a) => a === barilgiinId
                  )) &&
                  (a.turul === "avlaga" ||
                    a.turul === "voucher" ||
                    a.turul === "barter" ||
                    a.turul === "bank" ||
                    a.turul === "khyamdral" ||
                    a.turul === "aldangi" ||
                    a.turul === "zalruulga" ||
                    a.turul === "baritsaa" ||
                    a.turul === "qpay" ||
                    a.turul === "tulultBurtgekh") && (
                    <Popconfirm
                      title={t("Төлөлт устгах уу?")}
                      okText={t("Тийм")}
                      cancelText={t("Үгүй")}
                      onConfirm={() => tulultUstgaya(a)}
                    >
                      <div className="hide-on-print flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border p-1 text-red-500">
                        <DeleteOutlined />
                      </div>
                    </Popconfirm>
                  )}
              </td>
            </tr>
          ))
          .reverse()}
      </tbody>
    </table>
  );
  const TableContent2 = () => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[50rem]">
        <thead className="border-b border-gray-200 bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            <th
              onClick={() => toggleSortOrder("uldegdel")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Үлдэгдэл")}
            </th>
            <th
              onClick={() => toggleSortOrder("aldangi")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Алданги")}
            </th>
            <th
              onClick={() => toggleSortOrder("ognoo")}
              className="min-w-[8rem] cursor-pointer p-1 text-center"
            >
              {t("Алдангийн өдөр")}
            </th>
          </tr>
        </thead>
        <tbody
          className="overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 15rem)" }}
        >
          {aldangiinTuukh.jagsaalt?.map((a, i) => (
            <tr
              key={i}
              className="border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400"
            >
              <td className="min-w-[8rem] p-1 text-center">
                {formatNumber(a.uldegdel, 0)}
              </td>
              <td className="min-w-[8rem] p-1 text-center">
                {formatNumber(a.aldangi, 0)}
              </td>
              <td className="min-w-[8rem] p-1 text-center">
                {moment(a.aldangiBodsonOgnoo).format("YYYY-MM-DD")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="">
      <div ref={printRef} className="flex flex-col">
        <div className="flex w-full items-center justify-start gap-8 dark:text-white">
          <div className="">
            <DatePicker.RangePicker
              value={shineOgnoo}
              onChange={(v) => setShineOgnoo(v)}
              locale={i18n.language === "mn" && locale}
              allowClear
              picker="month"
              disabledDate={(e) => e && e > moment().endOf("day")}
            />
          </div>
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
          <div className="flex flex-col">
            <div className="flex gap-2">
              <div className="font-bold">{t("Регистр")}:</div>
              <div>{data?.register}</div>
            </div>
            <div className="flex gap-2">
              <div className="font-bold">{t("Алдангийн үлдэгдэл")}:</div>
              <div>{formatNumber(aldangiinUldegdel, 2)}</div>
            </div>
          </div>

          {canEditAldalgi && (
            <div className="ml-auto">
              <Button
                type="primary"
                onClick={openModal}
                className="whitespace-nowrap"
              >
                {t("Алданги засах")}
              </Button>
            </div>
          )}
        </div>

        <Tabs
          defaultActiveKey={activeTab}
          activeKey={activeTab}
          items={[
            {
              key: "1",
              label: t("Төлсөн алданги"),
              children: <TableContent />,
            },
            {
              key: "2",
              label: t("Бодогдсон алданги"),
              children: <TableContent2 />,
            },
          ]}
          onChange={(v) => {
            setActiveTab(v);
          }}
        />
      </div>

      {canEditAldalgi && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={closeModal}
          ></div>

          <div className="relative w-[500px] max-w-full rounded-md bg-white text-black shadow-xl dark:bg-gray-800 dark:text-gray-400">
            <div className="flex items-center justify-between border-b px-6 py-3 text-black dark:bg-gray-800 dark:text-gray-400">
              <h2 className="text-md text-black dark:text-gray-100">
                {t("Алданги засах")}
              </h2>
            </div>

            <div className="space-y-4 px-6 py-4 text-black dark:bg-gray-800 dark:text-gray-400">
              <div>
                <label className="text-md mb-1 block font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {t("Алданги засах дүнг оруулна уу")}
                </label>
                <InputNumber
                  placeholder="Дүнгээ оруулна уу..."
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  style={{ width: "100%", textAlign: "center" }}
                  value={aldangiDun === "" ? undefined : Number(aldangiDun)}
                  onChange={(value) =>
                    setAldangiDun(value === undefined ? "" : value?.toString())
                  }
                />
              </div>
              <div>
                <Input.TextArea
                  id="textArea"
                  placeholder={t("Тайлбар")}
                  value={zasahTailbar}
                  onChange={(e) => setZasahTailbar(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t px-6 py-3 dark:bg-gray-800 dark:text-gray-400">
              <Button type="default" onClick={closeModal}>
                {t("Хаах")}
              </Button>
              <Button type="primary" onClick={hadgalakhHandler}>
                {t("Хадгалах")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeniiTuukhAldangi);
