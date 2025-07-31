import { Button, DatePicker, Input, message, Popconfirm } from "antd";
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
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [aldangiinUldegdel, setAldangiinUldegdel] = useState(undefined);
  
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
  });
  const [sortColumn, setSortColumn] = useState(null);
  const tailbarRef = React.useRef(null);
  const printRef = React.useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Check if user has permission to edit aldalgi
  const canEditAldalgi = useMemo(() => {
    // Admin always has permission
    if (ajiltan?.erkh === "Admin") return true;
    
    // Get the permission array for aldangiinUldegdelZasakhEsekh
    const permissionArray = _.get(ajiltan, `tokhirgoo.aldangiinUldegdelZasakhEsekh`);
    
    // If permission array doesn't exist or is undefined, no permission
    if (!permissionArray || !Array.isArray(permissionArray)) {
      return false;
    }
    
    // Check if current building ID is in the permission array
    return permissionArray.includes(barilgiinId);
  }, [ajiltan, barilgiinId]);

  const hadgalakhHandler = () => {
    axios(token)
      .post("/gereeniiAldangiZasya", {
        aldangiDun: Number(aldangiDun),
        tailbar: zasahTailbar,
        gereeniiId: data?._id,
        barilgiinId: data?.barilgiinId,
        gereeniiDugaar: data?.gereeniiDugaar
      })
      .then(() => {
        message.success(t("Амжилттай хадгалагдлаа"));
        closeModal();
        setAldangiDun("");
        setZasahTailbar("");
        guilgeeniiAldangiTuukhMutate(); 
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
      excelTatakh() {},
      refreshData() {
        guilgeeniiAldangiTuukhMutate();
        setAldangiinUldegdel(undefined);
      },
    }),
    [printRef]
  );

  useEffect(() => {
    if (!aldangiinUldegdel)
      axios(token)
        .get("/geree", {
          params: {
            query: { _id: data?._id, tuluv: { $ne: -1 } },
            select: { aldangiinUldegdel: 1 },
          },
        })
        .then(({ data }) => {
          if (!!data && data.jagsaalt?.length > 0) {
            setAldangiinUldegdel(data.jagsaalt[0].aldangiinUldegdel);
          }
        });
  }, [guilgeeniiAldangiTuukh]);

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
          
          {/* Conditionally rendered Modal Button */}
          {canEditAldalgi && (
            <button
              onClick={openModal}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-200 whitespace-nowrap"
            >
              {t("Алданги засах")}
            </button>
          )}
        </div>

        {/* Table */}
        <table className="w-full mt-4">
          <thead className="w-full">
            <tr className="flex min-w-[50rem] divide-x divide-white border-b border-gray-200 bg-gray-200 pr-1 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
              <td
                onClick={() => toggleSortOrder("ognoo")}
                className="min-w-[8rem] overflow-hidden p-1 text-center cursor-pointer"
              >
                {t("Огноо")}
              </td>
              <td
                onClick={() => toggleSortOrder("ajiltan")}
                className="min-w-[8rem] overflow-hidden p-1 text-center cursor-pointer"
              >
                {t("Ажилтан")}
              </td>
              <td
                onClick={() => toggleSortOrder("tulukhAldangi")}
                className="min-w-[8rem] overflow-hidden p-1 text-center cursor-pointer"
              >
                {t("Төлөх алданги")}
              </td>
              <td
                onClick={() => toggleSortOrder("tulsunAldangi")}
                className="min-w-[8rem] overflow-hidden p-1 text-center cursor-pointer"
              >
                {t("Төлсөн алданги")}
              </td>
              <td
                onClick={() => toggleSortOrder("dansniiDugaar")}
                className="min-w-[8rem] overflow-hidden p-1 text-center cursor-pointer"
              >
                {t("Данс")}
              </td>
              <td
                onClick={() => toggleSortOrder("tulsunDans")}
                className="min-w-[8rem] overflow-hidden p-1 text-center cursor-pointer"
              >
                {t("Төлсөн данс")}
              </td>
              <td
                onClick={() => toggleSortOrder("tailbar")}
                className="w-full min-w-[8rem] overflow-hidden p-1 text-center cursor-pointer"
              >
                {t("Тайлбар")}
              </td>
              <td
                onClick={() => toggleSortOrder("burtgesenOgnoo")}
                className="min-w-[7rem] p-1 text-center cursor-pointer"
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
                <tr key={i} className="flex min-w-[50rem] divide-x border-b border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
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
                  <td className="flex min-w-[10rem] justify-center p-1 text-center ">
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
      </div>

      {/* Modal - Only show if user has permission and modal is open */}
      {canEditAldalgi && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={closeModal}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-md shadow-xl w-[500px] max-w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b">
              <h2 className="text-base font-semibold text-gray-800">
                {t("Алданги засах")}
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {t("Алданги засах дүнг оруулна уу.")}
                </label>
                <input
                  type="number"
                  value={aldangiDun}
                  onChange={(e) => setAldangiDun(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:ring-green-200"
                />
              </div>
              <div>
                <textarea
                    rows={3}
                    value={zasahTailbar}
                    onChange={(e) => setZasahTailbar(e.target.value)}
                    placeholder={t("Тайлбар")}
                    className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:ring-green-200"
                  />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-6 py-3 border-t">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100"
              >
                {t("Хаах")}
              </button>
              <button
                onClick={hadgalakhHandler}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                {t("Хадгалах")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeniiTuukhAldangi);