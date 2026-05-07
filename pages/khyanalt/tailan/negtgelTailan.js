import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import local from "antd/lib/date-picker/locale/mn_MN";
import {
  DatePicker,
  Select,
  Table,
  Dropdown,
  Menu,
  Button,
  Spin,
  Checkbox,
  Tooltip,
  Table as AntdTable,
} from "antd";
import { Excel } from "antd-table-saveas-excel";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import useNegtgelTailan from "hooks/tailan/useNegtgelTailan";
import { useAuth } from "services/auth";
import React, { Children, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { flushSync } from "react-dom";
import useJagsaalt from "hooks/useJagsaalt";
import BaganiinSongolt from "components/table/BaganiinSongolt";
import { useTranslation } from "react-i18next";

function negtgelTailan({ token }) {
  const { barilgiinId, baiguullaga, ajiltan } = useAuth();
  const [excelUnshijBaina, setExcelUnshijBaina] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [khadgalsanKhuudaslalt, setKhadgalsaKhuudaslalt] = useState(null);
  const [niitDunJagsaalt, setNiitDunJagsaalt] = useState([]);
  const [avlaga, setAvlaga] = useState([]);
  const [jagsaaltOgnoo, setJagsaaltOgnoo] = useState([]);
  const [shineBagana, setShineBagana] = useState([]);
  const { t } = useTranslation();

  const searchKeys = [
    "ner",
    "register",
    "customerTin",
    "gereeniiDugaar",
    "talbainDugaar",
  ];

  const reportSearchKeys = [
    "ner",
    "register",
    "customerTin",
    "gereeniiDugaar",
    "talbainDugaar",
  ];

  const customerSelect = {
    ner: 1,
    register: 1,
    customerTin: 1,
    gereeniiDugaar: 1,
    talbainDugaar: 1,
  };
  const kharitsagchQuery = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      baiguullagiinId: baiguullaga?._id,
    };
  }, [baiguullaga, barilgiinId]);
  const khariltsagchiinGaralt = useJagsaalt(
    "/geree",
    kharitsagchQuery,
    undefined,
    customerSelect,
    searchKeys
  );
  const [songogdsonIds, setSongogdsonIds] = useState([]);
  const [songogdsonTurul, setSongogdsonTurul] = useState();

  const printRef = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: " ",
    onBeforePrint: () => {
      flushSync(() => setIsPrinting(true));
      return Promise.resolve();
    },
    onAfterPrint: () => setIsPrinting(false),
    pageStyle: `@media print {
      @page { 
        size: landscape;
        margin: 0 !important;
      }
    }`,
  });
  const segments = useJagsaalt("/segment", undefined, undefined, undefined, undefined, undefined, 1000);
  const turulOptions = useMemo(() => {
    const allOptions = segments?.jagsaalt?.reduce((acc, current) => {
      if (current.utguud && Array.isArray(current.utguud)) {
        return [...acc, ...current.utguud];
      }
      return acc;
    }, []);
    return [
      ...new Set(allOptions?.filter((opt) => opt !== null && opt !== undefined)),
    ];
  }, [segments.jagsaalt]);

  const songogdsonSegments = useMemo(() => {
    return (
      segments?.jagsaalt?.filter((s) => s.utguud?.includes(songogdsonTurul)) ||
      []
    );
  }, [segments.jagsaalt, songogdsonTurul]);

  const query = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      ekhlekhOgnoo: ognoo && ognoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: ognoo && ognoo[1].format("YYYY-MM-DD 23:59:59"),
      khariltsagchiinId: songogdsonIds.length > 0 ? songogdsonIds : undefined,
      songogdsonTurul: songogdsonTurul,
    };
  }, [
    ognoo,
    baiguullaga,
    barilgiinId,
    songogdsonIds,
    songogdsonTurul,
    songogdsonSegments,
  ]);
  const { tailanGaralt, unshijBaina, setTailanKhuudaslalt } = useNegtgelTailan(
    token,
    query,
    reportSearchKeys,
    500
  );


  const excelNemekhCol = useMemo(() => {
    return shineBagana.map((e, i) => {
      const column = {
        title: e?.title,
        dataIndex: e.dataIndex,
        __style__: { h: "center" },
      };

      if (
        JSON.stringify(e.dataIndex) === JSON.stringify(["_id", "gereeniiOgnoo"])
      ) {
        column.render = (data) => {
          return moment(data).format("YYYY-MM-DD");
        };
      }
      if (JSON.stringify(e.dataIndex) === JSON.stringify(["_id", "utas"])) {
        column.render = (val, data) => {
          return data?._id?.utas?.join(",");
        };
      }
      return column;
    });
  }, [shineBagana]);

  function exceleerTatya() {
    const excel = new Excel();
    setExcelUnshijBaina(true);
    var excelCol = [
      {
        title: t("Регистер/ТИН"),
        dataIndex: "_id",
        render: (id) => {
          return id?.register;
        },
      },
      {
        title: t("Харилцагч нэр"),
        dataIndex: "_id",
        render: (id) => {
          return id?.ner;
        },
      },
      {
        title: t("Талбайн хэмжээ"),
        dataIndex: ["_id", "talbainKhemjee"],
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("Түрээс үнэ"),
        dataIndex: ["_id", "talbainNegjUne"],
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      ...excelNemekhCol,
    ];
    jagsaaltOgnoo.forEach((a) => {
      var col = {
        title: a,
        dataIndex: "avlaga",
        children: avlaga
          .filter((v) => v.ognoo === a)
          .map((assessment, colIndex) => {
            return {
              title: assessment.tailbar,
              dataIndex: "avlaga",
              __style__: { h: "right", fontName: "arial" },
              __numFmt__: "#,##0.00",
              __cellType__: "TypeNumeric",
              render: (values) => {
                var tempVal = values.filter(
                  (value) =>
                    moment(value.ognoo).format("YYYY-MM") ===
                      assessment.ognoo &&
                    (value.tailbar === assessment.tailbar ||
                      (assessment.tailbar === "Менежмент нэгж" &&
                        value.tailbar?.includes("Менежментийн төлбөр")))
                );
                var sumTulukhDun = tempVal
                  .filter((v) => v.tulukhDun > 0)
                  .reduce((a, b) => a + b.tulukhDun, 0);
                return assessment.tailbar === "Менежмент нэгж"
                  ? sumTulukhDun / (tempVal[0]?.talbainKhemjee || 1) || 0
                  : sumTulukhDun || 0;
              },
            };
          }),
      };
      excelCol.push(col);
    });
    excelCol.push({
      title: t("Нийт"),
      dataIndex: "niitTulukhDun",
      __style__: { h: "right" },
      __numFmt__: "#,##0.00",
      __cellType__: "TypeNumeric",
      render: (une) => {
        return une || 0;
      },
    });
    excel
      .addSheet(t("Нэгтгэл тайлан"))
      .addColumns(excelCol)
      .addDataSource(tailanGaralt)
      .saveAs(`${t("Нэгтгэл тайлан")}.xlsx`);
    setExcelUnshijBaina(false);
  }

  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        align: "center",
        width: "3rem",
        className: "text-mashJijig",
        fixed: "left",
        render: (a, b, index) => {
          return index + 1;
        },
      },
      {
        title: t("Регистер/ТИН"),
        dataIndex: "_id",
        width: "12rem",
        className: "text-mashJijig",
        ellipsis: true,
        align: "center",
        fixed: "left",
        render: (b) => {
          return <div className="flex justify-start">{b?.register}</div>;
        },
      },
      {
        title: t("Харилцагч нэр"),
        dataIndex: "_id",
        className: "text-mashJijig",
        width: "12rem",
        align: "center",
        ellipsis: true,
        fixed: "left",
        render: (a) => {
          return <div className="flex justify-start truncate">{a?.ner}</div>;
        },
      },
      {
        title: t("Талбайн хэмжээ"),
        className: "text-mashJijig",
        dataIndex: ["_id", "talbainKhemjee"],
        width: "8rem",
        ellipsis: true,
        align: "center",
        fixed: "left",
        render: (e) => {
          return formatNumber(e, 2);
        },
      },
      {
        title: t("Түрээс үнэ"),
        className: "text-mashJijig",
        dataIndex: ["_id", "talbainNegjUne"],
        width: "8rem",
        ellipsis: true,
        align: "center",
        fixed: "left",
        render: (e) => {
          return formatNumber(e, 2);
        },
      },
    ];
    jagsaalt = [...jagsaalt, ...shineBagana];
    var avlaga = [];
    var jagsaaltOgnoo = [];
    (Array.isArray(tailanGaralt) ? tailanGaralt : [])?.forEach((a) => {
      a.avlaga?.forEach((b) => {
        var tempOgnoo = moment(b.ognoo).format("YYYY-MM");
        if (jagsaaltOgnoo.filter((a) => a === tempOgnoo)?.length === 0)
          jagsaaltOgnoo.push(tempOgnoo);
        if (
          avlaga.filter((c) => c.tailbar === b.tailbar && c.ognoo === tempOgnoo)
            ?.length === 0
        ) {
          if (b.tailbar?.includes("Менежментийн төлбөр"))
            avlaga.push({
              tailbar: "Менежмент нэгж",
              ognoo: tempOgnoo,
              index: Number(tempOgnoo?.split("-")[1]),
            });
          avlaga.push({
            tailbar: b.tailbar,
            ognoo: tempOgnoo,
            index: Number(tempOgnoo?.split("-")[1]),
          });
        }
      });
    });
    avlaga.sort((a, b) => a.index - b.index);
    setJagsaaltOgnoo(jagsaaltOgnoo);
    setAvlaga(avlaga);
    var temp = [];
    var niitDunJagsaalt = [];
    var indexVal = 0;
    jagsaaltOgnoo.sort();
    jagsaaltOgnoo.forEach((a) => {
      var col = {
        title: a,
        dataIndex: "avlaga",
        className: "text-mashJijig",
        align: "center",
        ellipsis: true,
        children: avlaga
          .filter((v) => v.ognoo === a)
          .map((assessment, colIndex) => {
            indexVal += colIndex;
            return {
              title: assessment.tailbar,
              className: "text-mashJijig",
              dataIndex: "avlaga",
              align: "center",
              width: "12rem",
              summary: true,
              render: (values) => {
                values.map((value, index) => {
                  var tempOgnoo = moment(value.ognoo).format("YYYY-MM");
                  if (
                    (value.tailbar === assessment.tailbar && tempOgnoo === a) ||
                    assessment.tailbar === "Менежмент нэгж"
                  ) {
                    var tempDun =
                      assessment.tailbar === "Менежмент нэгж"
                        ? 0
                        : value.tulukhDun || 0;
                    var filterDun = niitDunJagsaalt.filter(
                      (t) => t.key === a + ";" + assessment.tailbar
                    );
                    if (filterDun?.length === 0)
                      niitDunJagsaalt.push({
                        key: a + ";" + assessment.tailbar,
                        dun: tempDun,
                        columnIndex: indexVal,
                      });
                    else {
                      niitDunJagsaalt.splice(
                        niitDunJagsaalt.indexOf(filterDun[0]),
                        1
                      );
                      niitDunJagsaalt.push({
                        key: a + ";" + assessment.tailbar,
                        dun: filterDun[0].dun + tempDun,
                        columnIndex: filterDun[0].columnIndex,
                      });
                    }
                  }
                });
                if (assessment.tailbar === "Менежмент нэгж") {
                  var valFilter = values?.filter(
                    (e) =>
                      e.tailbar?.includes("Менежментийн төлбөр") &&
                      moment(e.ognoo).format("YYYY-MM") === a &&
                      e.tulukhDun > 0
                  );
                  var dun = valFilter?.reduce((a, b) => a + b.tulukhDun, 0);
                  return (
                    <div className="flex justify-center truncate">
                      {valFilter?.length > 0
                        ? formatNumber(
                            dun / (valFilter[0]?.talbainKhemjee || 1) || 0
                          )
                        : ""}
                    </div>
                  );
                } else {
                  var valFilterDun = values?.filter(
                    (s) =>
                      s.tailbar === assessment.tailbar &&
                      moment(s.ognoo).format("YYYY-MM") === a &&
                      s.tulukhDun > 0
                  );
                  return (
                    <div className="flex justify-end truncate">
                      {valFilterDun?.length > 0
                        ? formatNumber(
                            valFilterDun?.reduce((a, b) => a + b.tulukhDun, 0)
                          )
                        : ""}
                    </div>
                  );
                }
              },
            };
          }),
      };
      temp.push(col);
      indexVal++;
    });
    setNiitDunJagsaalt(niitDunJagsaalt);
    temp.push({
      title: t("Нийт"),
      className: "text-mashJijig",
      dataIndex: "niitTulukhDun",
      width: "8rem",
      ellipsis: true,
      align: "right",
      fixed: "right",
      render: (e) => {
        return formatNumber(e, 2);
      },
    });
    jagsaalt = [...jagsaalt, ...temp];
    return jagsaalt;
  }, [shineBagana, tailanGaralt]);

  return (
    <Admin
      title={t("Нэгтгэл тайлан")}
      khuudasniiNer="negtgelTailan"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setTailanKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      loading={unshijBaina}
      tsonkhniiId={"671388c72b3e39a4d67b5f30"}
    >
      <div className="col-span-12 flex flex-col gap-4 px-5 md:px-0 lg:flex-row lg:items-center">
        <div className="w-full lg:w-auto">
          <DatePicker.RangePicker
            className="w-full"
            value={ognoo}
            onChange={setOgnoo}
          />
        </div>
        <div className="w-full lg:w-72">
          <Select
            className="w-full rounded-md border-gray-400"
            style={{ textOverflow: "ellipsis" }}
            showSearch
            mode="multiple"
            filterOption={(input, option) => {
              const search = input.toLowerCase();
              return (
                option?.ner?.toLowerCase().includes(search) ||
                option?.register?.toLowerCase().includes(search) ||
                option?.gereeniiDugaar?.toLowerCase().includes(search) ||
                option?.talbainDugaar?.toLowerCase().includes(search)
              );
            }}
            allowClear={true}
            onSearch={(search) =>
              khariltsagchiinGaralt.setKhuudaslalt((a) => ({ ...a, search }))
            }
            onChange={(v) => {
              setSongogdsonIds(v);
            }}
            placeholder={t("Харилцагч сонгох")}
          >
            {[
              ...new Map(
                khariltsagchiinGaralt?.jagsaalt?.map((data) => [
                  data?.register || data?.customerTin,
                  data,
                ])
              ).values(),
            ].map((data) => (
              <Select.Option
                key={data?.register || data?.customerTin}
                value={data?.register || data?.customerTin}
                label={data?.ner}
                ner={data?.ner || ""}
                register={data?.register || data?.customerTin || ""}
                gereeniiDugaar={data?.gereeniiDugaar || ""}
                talbainDugaar={data?.talbainDugaar || ""}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{data?.ner}</span>
                  <span className="text-xs text-gray-400">
                    {[data?.gereeniiDugaar, data?.talbainDugaar]
                      .filter(Boolean)
                      .join(" | ")}
                  </span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="w-full lg:w-56">
          <Select
            className="w-full rounded-md border-gray-400"
            allowClear={true}
            showSearch
            value={songogdsonTurul}
            onChange={setSongogdsonTurul}
            placeholder={t("Төрөл сонгох")}
          >
          {segments?.jagsaalt
            ?.filter((s) => s.ner)
            ?.map((segment) => {
              const hasUtguud = segment.utguud?.some((u) => u);
              if (hasUtguud) {
                return (
                  <Select.OptGroup
                    key={segment._id}
                    label={`${t(segment.ner)} (${t(segment.turul || "бусад")})`}
                  >
                    {segment.utguud
                      ?.filter((o) => o)
                      ?.map((opt, i) => (
                        <Select.Option
                          key={`${segment._id}-${opt}-${i}`}
                          value={opt}
                        >
                          {t(opt)}
                        </Select.Option>
                      ))}
                  </Select.OptGroup>
                );
              }
              return (
                <Select.Option key={segment._id} value={segment.ner}>
                  {t(segment.ner)}
                </Select.Option>
              );
            })}
        </Select>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="flex h-8">
            <button
              onClick={handlePrint}
              id="tabulator-print"
              className="btn btn-outline-secondary mr-2 text-sm font-normal sm:w-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                icon-name="printer"
                data-lucide="printer"
                className="lucide lucide-printer mr-2 h-4 w-4"
              >
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              {t("Хэвлэх")}
            </button>
            <div className="dropdown h-8 w-1/2 sm:w-auto">
              <Dropdown
                overlay={
                  <Menu disabled={excelUnshijBaina}>
                    <Menu.Item
                      key="ExcelTatakh"
                      onClick={() => exceleerTatya()}
                    >
                      {t("Тайлан татах")}
                    </Menu.Item>
                  </Menu>
                }
                trigger="click"
                className="cursor-pointer"
                disabled={excelUnshijBaina}
              >
                <button
                  className="dropdown-toggle btn btn-outline-secondary h-8 w-full text-sm font-normal sm:w-auto "
                  aria-expanded="false"
                  data-tw-toggle="dropdown"
                >
                  {excelUnshijBaina ? (
                    <Spin className="mr-3 h-[24px] w-[24px]" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      icon-name="file-text"
                      data-lucide="file-text"
                      className="lucide lucide-file-text mr-2 h-4 w-4"
                    >
                      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <line x1="10" y1="9" x2="8" y2="9"></line>
                    </svg>
                  )}{" "}
                  Excel{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    icon-name="chevron-down"
                    data-lucide="chevron-down"
                    className="lucide lucide-chevron-down ml-auto h-4 w-4 sm:ml-2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </Dropdown>
            </div>
          </div>
          <BaganiinSongolt
            shineBagana={shineBagana}
            setShineBagana={setShineBagana}
            columns={[
              {
                key: "gereeniiDugaar",
                title: t("Гэрээ №"),
                dataIndex: ["_id", "gereeniiDugaar"],
                className: "text-center",
                align: "center",
                ellipsis: true,
                width: "7rem",
              },
              {
                title: t("Гэрээний огноо"),
                dataIndex: ["_id", "gereeniiOgnoo"],
                ellipsis: true,
                width: "8rem",
                align: "center",
                render(date) {
                  return moment(date).format("YYYY-MM-DD");
                },
                showSorterTooltip: false,
                sorter: () => 0,
              },
              {
                title: t("Овог"),
                dataIndex: ["_id", "ovog"],
                align: "center",
                ellipsis: true,
                width: "6rem",
              },
              {
                title: t("Утас"),
                dataIndex: ["_id", "utas"],
                align: "center",
                ellipsis: true,
                width: "6rem",
              },
              {
                title: t("И-мэйл"),
                dataIndex: ["_id", "mail"],
                align: "center",
                ellipsis: true,
                width: "6rem",
              },
              {
                title: t("Талбайн №"),
                dataIndex: ["_id", "talbainDugaar"],
                className: "text-center",
                align: "center",
                ellipsis: true,
                width: "7rem",
              },
            ]}
          />
        </div>
      </div>
      <div className="text-mashJijig col-span-12 mt-4 w-full overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800 2xl:mt-0">
        <Table
          sticky={{ offsetHeader: 0 }}
          scroll={{ y: "calc(100vh - 19rem)", x: 1600 }}
          tableLayout="fixed"
          bordered
          size="small"
          className="overflow-hidden text-xs"
          pagination={{
            current: tailanGaralt?.khuudasniiDugaar,
            total: tailanGaralt?.length,
            pageSizeOptions: [100, 300, 500],
            defaultPageSize: [500],
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) => {
              setTailanKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              }));
              setKhadgalsaKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              }));
            },
          }}
          summary={(e) => (
            <AntdTable.Summary className="border " fixed={"bottom"}>
              <AntdTable.Summary.Cell index={0} colSpan={1}>
                <div className="space-x-2 truncate text-base font-bold ">
                  {t("Нийт")}
                </div>
              </AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell index={1}></AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell index={2}></AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell index={3}>
                <div className="truncate text-center font-bold ">
                  {formatNumber(
                    e?.reduce((a, b) => a + (b?._id?.talbainKhemjee || 0), 0),
                    2
                  )}
                </div>
              </AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell
                index={4}
                colSpan={shineBagana?.length > 0 ? shineBagana?.length + 1 : 1}
              ></AntdTable.Summary.Cell>
              {avlaga?.map((mur, index) => {
                var dun = niitDunJagsaalt
                  ?.filter((a) => a.key === mur.ognoo + ";" + mur.tailbar)
                  .reduce((a, b) => a + (b.dun || 0), 0);
                return (
                  <AntdTable.Summary.Cell
                    index={4 + shineBagana?.length + index + 1}
                  >
                    <div className="truncate text-right font-bold ">
                      {formatNumber(dun)}
                    </div>
                  </AntdTable.Summary.Cell>
                );
              })}
              <AntdTable.Summary.Cell
                index={4 + niitDunJagsaalt?.length + shineBagana?.length + 1}
              >
                <div className="truncate text-right font-bold ">
                  {formatNumber(
                    e?.reduce((a, b) => a + (b?.niitTulukhDun || 0), 0),
                    2
                  )}
                </div>
              </AntdTable.Summary.Cell>
            </AntdTable.Summary>
          )}
          dataSource={tailanGaralt || []}
          columns={columns}
        />
        <div 
          style={isPrinting ? { display: 'block' } : { position: 'absolute', top: '-10000px', left: '-10000px', width: '210mm' }}
        >
          <div ref={printRef} className="print-show print-container">
            <div className="flex w-full items-center justify-between text-sm">
              <div className="w-1/3 text-left text-sm">
                {ognoo ? (
                  <div>
                    {t("Огноо")}: {moment(ognoo[0]).format("YYYY-MM-DD")}-{" "}
                    {moment(ognoo[1]).format("YYYY-MM-DD")}
                  </div>
                ) : (
                  <div>{""}</div>
                )}
              </div>
              <div className="w-1/3 text-center text-sm font-bold">
                {t("Нэгтгэл тайлан")}
              </div>
            </div>
            <table className="w-full border-2 border-gray-500">
              <thead>
                <tr className="bg-gray-400 text-white">
                  <th
                    className="border border-gray-400 text-mashJijigiinJijig"
                    rowSpan={2}
                  >
                    №
                  </th>
                  <th
                    className="border border-gray-400 text-mashJijigiinJijig"
                    rowSpan={2}
                  >
                    {t("Харилцагчийн регистер/Бүртгэлийн дугаар")}
                  </th>
                  <th
                    className="border border-gray-400 text-mashJijigiinJijig"
                    rowSpan={2}
                  >
                    {t("Харилцагч нэр")}
                  </th>
                  <th
                    className="border border-gray-400 text-mashJijigiinJijig"
                    rowSpan={2}
                  >
                    {t("Талбайн хэмжээ")}
                  </th>
                  <th
                    className="border border-gray-400 text-mashJijigiinJijig"
                    rowSpan={2}
                  >
                    {t("Түрээс үнэ")}
                  </th>
                  {shineBagana?.map((murOgnoo, index) => {
                    return (
                      <React.Fragment key={index}>
                        <th
                          className="border border-gray-400 text-mashJijigiinJijig"
                          rowSpan={2}
                        >
                          {murOgnoo.title}
                        </th>
                      </React.Fragment>
                    );
                  })}
                  {jagsaaltOgnoo?.map((murOgnoo, index) => {
                    return (
                      <React.Fragment key={index}>
                        <th
                          className="border border-gray-400 text-mashJijigiinJijig"
                          colSpan={
                            avlaga?.filter((a) => a.ognoo === murOgnoo)?.length
                          }
                        >
                          {murOgnoo}
                        </th>
                      </React.Fragment>
                    );
                  })}
                  <th
                    className="border border-gray-400 text-mashJijigiinJijig"
                    rowSpan={2}
                  >
                    {t("Нийт")}
                  </th>
                </tr>
                <tr className="bg-gray-400 text-white">
                  {avlaga?.map((murAvlaga, index) => {
                    return (
                      <React.Fragment key={index}>
                        <th className="border border-gray-400 text-mashJijigiinJijig">
                          {murAvlaga.tailbar}
                        </th>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(tailanGaralt) ? tailanGaralt : [])?.map(
                  (mur, index) => {
                    return (
                      <React.Fragment key={index}>
                        <tr className="border-gray-500">
                          <td
                            className="border border-gray-400 text-center text-mashJijigiinJijig"
                            key={index}
                          >
                            {index + 1}
                          </td>
                          <td className="border border-gray-400 pl-4 text-mashJijigiinJijig">
                            {mur?._id?.register}
                          </td>
                          <td className="border border-gray-400 text-mashJijigiinJijig">
                            {mur?._id?.ner}
                          </td>
                          <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                            {formatNumber(mur?._id?.talbainKhemjee)}
                          </td>
                          <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                            {formatNumber(mur?._id?.talbainNegjUne)}
                          </td>
                          {shineBagana?.map((murShine, index) => {
                            return (
                              <React.Fragment key={index}>
                                <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                                  {JSON.stringify(murShine.dataIndex) ===
                                  JSON.stringify(["_id", "gereeniiDugaar"])
                                    ? mur?._id?.gereeniiDugaar
                                    : JSON.stringify(murShine.dataIndex) ===
                                      JSON.stringify(["_id", "gereeniiOgnoo"])
                                    ? moment(mur?._id?.gereeniiOgnoo).format(
                                        "YYYY-MM-DD"
                                      )
                                    : JSON.stringify(murShine.dataIndex) ===
                                      JSON.stringify(["_id", "ovog"])
                                    ? mur?._id?.ovog
                                    : JSON.stringify(murShine.dataIndex) ===
                                      JSON.stringify(["_id", "utas"])
                                    ? mur?._id?.utas
                                    : JSON.stringify(murShine.dataIndex) ===
                                      JSON.stringify(["_id", "mail"])
                                    ? mur?._id?.mail
                                    : JSON.stringify(murShine.dataIndex) ===
                                      JSON.stringify(["_id", "talbainDugaar"])
                                    ? mur?._id?.talbainDugaar
                                    : ""}
                                </td>
                              </React.Fragment>
                            );
                          })}
                          {avlaga?.map((murAvlaga, index) => {
                            var tempAvlaga = mur.avlaga?.filter(
                              (v) =>
                                moment(v.ognoo).format("YYYY-MM") ===
                                  murAvlaga.ognoo &&
                                (v.tailbar === murAvlaga.tailbar ||
                                  (murAvlaga.tailbar === "Менежмент нэгж" &&
                                    v.tailbar?.includes("Менежментийн төлбөр")))
                            );
                            var sumTulukhDun = tempAvlaga
                              .filter((v) => v.tulukhDun > 0)
                              .reduce((a, b) => a + b.tulukhDun, 0);
                            return (
                              <React.Fragment key={index}>
                                <th className="border border-gray-400 text-mashJijigiinJijig">
                                  {murAvlaga.tailbar === "Менежмент нэгж" ? (
                                    <div className="flex justify-center truncate">
                                      {tempAvlaga?.length > 0
                                        ? formatNumber(
                                            sumTulukhDun /
                                              (tempAvlaga[0]?.talbainKhemjee ||
                                                1) || 0
                                          )
                                        : ""}
                                    </div>
                                  ) : (
                                    <div className="flex justify-end truncate">
                                      {sumTulukhDun > 0
                                        ? formatNumber(sumTulukhDun)
                                        : ""}
                                    </div>
                                  )}
                                </th>
                              </React.Fragment>
                            );
                          })}
                          <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                            {formatNumber(mur?.niitTulukhDun)}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="1"
                    className="border border-gray-400 text-mashJijigiinJijig"
                  >
                    {t("Нийт")}
                  </td>
                  <td></td>
                  <td></td>
                  <td className="border border-gray-400 text-center text-mashJijigiinJijig">
                    {" "}
                    {formatNumber(
                      (Array.isArray(tailanGaralt) ? tailanGaralt : [])?.reduce(
                        (a, b) => a + (b?._id?.talbainKhemjee || 0),
                        0
                      ),
                      2
                    )}{" "}
                  </td>
                  <td
                    colSpan={
                      shineBagana?.length > 0 ? shineBagana?.length + 1 : 1
                    }
                  ></td>
                  {avlaga?.map((murAvlaga, index) => {
                    var niitTulukhDun = 0;
                    (Array.isArray(tailanGaralt) ? tailanGaralt : [])?.map(
                      (mur, index) => {
                        var tempAvlaga = mur?.avlaga?.filter(
                          (v) =>
                            moment(v.ognoo).format("YYYY-MM") ===
                              murAvlaga.ognoo &&
                            (v.tailbar === murAvlaga.tailbar ||
                              (murAvlaga.tailbar === "Менежмент нэгж" &&
                                v.tailbar?.includes("Менежментийн төлбөр")))
                        );
                        var value = tempAvlaga
                          .filter((v) => v.tulukhDun > 0)
                          .reduce((a, b) => a + b.tulukhDun, 0);
                        niitTulukhDun += value || 0;
                      }
                    );
                    return (
                      <React.Fragment key={index}>
                        <th className="border border-gray-400 text-mashJijigiinJijig">
                          {murAvlaga.tailbar === "Менежмент нэгж" ? (
                            ""
                          ) : (
                            <div className="flex justify-end truncate">
                              {niitTulukhDun > 0
                                ? formatNumber(niitTulukhDun)
                                : ""}
                            </div>
                          )}
                        </th>
                      </React.Fragment>
                    );
                  })}
                  <td className="border border-gray-400 text-right text-mashJijigiinJijig">
                    {" "}
                    {formatNumber(
                      (Array.isArray(tailanGaralt) ? tailanGaralt : [])?.reduce(
                        (a, b) => a + (b?.niitTulukhDun || 0),
                        0
                      ),
                      2
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
            <table className="ml-4 mt-4">
              <tfoot>
                <tr>
                  <td colSpan="3"></td>
                  <td colSpan="3" className="text-right italic">
                    Тайлан гаргасан:
                  </td>
                  <td>
                    ................................/
                    {ajiltan?.ovog && ajiltan?.ovog[0]}
                    {ajiltan?.ovog && "."}
                    {ajiltan?.ner}/
                  </td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td colSpan="3" className="text-right italic">
                    Хянасан нягтлан бодогч:
                  </td>
                  <td> ................................</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default negtgelTailan;
