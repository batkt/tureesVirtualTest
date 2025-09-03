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
import formatNumber from "tools/function/formatNumber";
import useNasjiltinTailan from "hooks/tailan/useNasjiltinTailan";
import { useAuth } from "services/auth";
import React, { Children, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";

function nasjiltinTailan({ token }) {
  const { barilgiinId, baiguullaga, ajiltan } = useAuth();
  const [excelUnshijBaina, setExcelUnshijBaina] = useState(false);
  const [khadgalsanKhuudaslalt, setKhadgalsaKhuudaslalt] = useState(null);
  const [shineBagana, setShineBagana] = useState([]);
  const { t } = useTranslation();

  const searchKeys = ["ner", "register", "gereeniiDugaar", "talbainDugaar"];
  const kharitsagchQuery = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      baiguullagiinId: baiguullaga?._id,
    };
  }, [baiguullaga, barilgiinId]);

  const khariltsagchiinGaralt = useJagsaalt(
    "/khariltsagch",
    kharitsagchQuery,
    undefined,
    undefined,
    searchKeys
  );
  const [songogdsonIds, setSongogdsonIds] = useState([]);

  const printRef = useRef(null);
  const [ognoo, setOgnoo] = useState(moment().endOf("month"));
  const handleDateChange = (date) => {
    setOgnoo(date);
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: "print",
  });

  const query = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      ekhlekhOgnoo: undefined,
      duusakhOgnoo: ognoo
        ? moment(ognoo).format("YYYY-MM-DD 23:59:59")
        : undefined,
      khariltsagchiinId: songogdsonIds.length > 0 ? songogdsonIds : undefined,
    };
  }, [ognoo, baiguullaga, barilgiinId, songogdsonIds]);

  const { nasjiltinTailan, unshijBaina, setTailanKhuudaslalt } =
    useNasjiltinTailan(token, query, searchKeys, 500);

  const dataSource = useMemo(() => {
    return (
      nasjiltinTailan?.map((item, index) => ({
        key: index.toString(),
        gereeniiDugaar: item.gereeniiDugaar || "-",
        ner: item.ner || "-",
        talbainDugaar: item.talbainDugaar || "-",
        register: item.register || "-",
        niitDun: item.niitDun || 0,
        khungulult: item.khungulult || 0,
        tulsunDun: item.tulsunDun || 0,
        tulukhDun: item.tulukhDun || 0,
        avalaga0: item.avalaga0 || 0,
        avlaga31: item.avlaga31 || 0,
        avlaga61: item.avlaga61 || 0,
        avlaga91: item.avlaga91 || 0,
        avlaga120: item.avlaga120 || 0,
      })) || []
    );
  }, [ognoo, nasjiltinTailan]);

  const filteredDataSource = useMemo(() => {
    return songogdsonIds.length > 0
      ? dataSource.filter((item) => songogdsonIds.includes(item.register))
      : dataSource;
  }, [dataSource, songogdsonIds]);

  const excelNemekhCol = useMemo(() => {
    return shineBagana.map((e, i) => {
      const column = {
        title: e?.title,
        dataIndex: e.dataIndex,
        __style__: { h: "center" },
      };

      if (JSON.stringify(e.dataIndex) === JSON.stringify(["gereeniiOgnoo"])) {
        column.render = (data) => {
          return moment(data).format("YYYY-MM-DD");
        };
      }
      if (JSON.stringify(e.dataIndex) === JSON.stringify(["utas"])) {
        column.render = (val, data) => {
          return data?.utas?.join(",");
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
        title: "Гэрээний дугаар",
        dataIndex: "gereeniiDugaar",
        __style__: { h: "center" },
      },
      {
        title: "Харилцагч",
        dataIndex: "ner",
        __style__: { h: "center" },
      },
      {
        title: "Талбайн дугаар",
        dataIndex: "talbainDugaar",
        __style__: { h: "center" },
      },
      {
        title: "Харилцагч РД",
        dataIndex: "register",
        __style__: { h: "center" },
      },
      {
        title: "Нийт дүн",
        dataIndex: "niitDun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: "Xөнгөлөлт",
        dataIndex: "khungulult",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: "Төлсөн дүн",
        dataIndex: "tulsunDun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: "Төлөх дүн",
        dataIndex: "tulukhDun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: "0-30 хоног",
        dataIndex: "avalaga0",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: "31-60 хоног",
        dataIndex: "avlaga31",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: "61-90 хоног",
        dataIndex: "avlaga61",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: "91-120 хоног",
        dataIndex: "avlaga91",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: "+120 хоног",
        dataIndex: "avlaga120",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      ...excelNemekhCol,
    ];

    excel
      .addSheet("Насжилтын тайлан")
      .addColumns(excelCol)
      .addDataSource(filteredDataSource)
      .saveAs("НасжилтынТайлан.xlsx");
    setExcelUnshijBaina(false);
  }
  const columns = useMemo(() => {
    var jagsaalt = [
      {
        title: "№",
        key: "index",
        align: "center",
        width: 50,
        className: "text-mashJijig",
        fixed: "left",
        render: (a, b, index) => {
          return index + 1;
        },
      },
      {
        title: t("Гэрээний дугаар"),
        dataIndex: "gereeniiDugaar",
        key: "gereeniiDugaar",
        align: "center",
        width: "12rem",
        className: "text-mashJijig",
        ellipsis: true,
        fixed: "left",
        onHeaderCell: () => ({ style: { textAlign: "center" } }),
        render: (text) => {
          return <div className="flex justify-start">{text}</div>;
        },
      },
      {
        title: t("Харилцагч"),
        dataIndex: "ner",
        key: "ner",
        align: "center",
        width: "12rem",
        className: "text-mashJijig",
        ellipsis: true,
        fixed: "left",
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),
        render: (text) => {
          return <div className="flex justify-start truncate">{text}</div>;
        },
      },
      {
        title: t("Талбайн дугаар"),
        dataIndex: "talbainDugaar",
        key: "talbainDugaar",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        fixed: "left",
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),
        render: (text) => {
          return <div className="flex justify-start">{text}</div>;
        },
      },
      {
        title: t("Харилцагч РД"),
        dataIndex: "register",
        key: "register",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        fixed: "left",
      },
      {
        title: t("Нийт дүн"),
        dataIndex: "niitDun",
        key: "niitDun",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,

        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },
      {
        title: t("Xөнгөлөлт"),
        dataIndex: "khungulult",
        key: "khungulult",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,

        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },

      {
        title: "Төлсөн дүн",
        dataIndex: "tulsunDun",
        key: "tulsunDun",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },
      {
        title: "Төлөх дүн",
        dataIndex: "tulukhDun",
        key: "tulukhDun",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },
      {
        title: "0-30 хоног",
        dataIndex: "avalaga0",
        key: "avalaga0",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },
      {
        title: "31-60 хоног",
        dataIndex: "avlaga31",
        key: "avlaga31",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },
      {
        title: "61-90 хоног",
        dataIndex: "avlaga61",
        key: "avlaga61",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },
      {
        title: "91-120 хоног",
        dataIndex: "avlaga91",
        key: "avlaga91",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },
      {
        title: "+120 хоног",
        dataIndex: "avlaga120",
        key: "avlaga120",
        align: "center",
        width: "8rem",
        className: "text-mashJijig",
        ellipsis: true,
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),

        render: (value) => (
          <div className="flex justify-end">{formatNumber(value, 2)}</div>
        ),
      },
    ];
    jagsaalt = [...jagsaalt, ...shineBagana];
    return jagsaalt;
  }, [shineBagana]);

  const isNumberColumn = (dataIndex) => {
    return [
      "niitDun",
      "khungulult",
      "tulsunDun",
      "tulukhDun",
      "avalaga0",
      "avlaga31",
      "avlaga61",
      "avlaga91",
      "avlaga120",
    ].includes(dataIndex);
  };

  return (
    <Admin
      title="Насжилтын тайлан"
      khuudasniiNer="nasjiltinTailan"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setTailanKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      loading={unshijBaina}
      tsonkhniiId={"683e6d781d7368c43b18eb31"}
    >
      <div className="col-span-12 grid grid-cols-2 items-center gap-5 px-5 md:px-0 lg:flex">
        <DatePicker
          className="col-span-2"
          locale={local}
          value={ognoo}
          picker="month"
          onChange={handleDateChange}
          placeholder={"Дуусах огноо"}
          format="YYYY-MM"
        />
        <Select
          bordered={false}
          className="overflow-y-scroll rounded-md border-[1px] border-gray-400 bg-white md:w-1/4"
          style={{ textOverflow: "ellipsis" }}
          showSearch
          mode="multiple"
          filterOption={(o) => o}
          allowClear={true}
          onSearch={(search) =>
            khariltsagchiinGaralt.setKhuudaslalt((a) => ({ ...a, search }))
          }
          onChange={(v) => {
            setSongogdsonIds(v);
          }}
          placeholder={t("Харилцагч сонгох")}
        >
          {khariltsagchiinGaralt?.jagsaalt?.map((data) => (
            <Select.Option
              key={data?.register || data?.customerTin}
              className="dark:text-gray-300"
            >
              <div className="flex w-[90%] justify-between">
                <span>{data?.register || data?.customerTin}</span>
                <span>{data?.ner}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
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
              Хэвлэх
            </button>
            <div className="dropdown h-8 w-1/2 sm:w-auto">
              <Dropdown
                overlay={
                  <Menu disabled={excelUnshijBaina}>
                    <Menu.Item
                      key="ExcelTatakh"
                      onClick={() => exceleerTatya()}
                    >
                      Тайлан татах
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
        </div>
      </div>
      <div className="text-mashJijig col-span-12 mt-12 flex items-center justify-center 2xl:mt-0">
        <Table
          sticky={{ offsetHeader: 0 }}
          scroll={{ y: "calc(100vh - 19rem)", x: "calc(100vw - 25rem)" }}
          tableLayout="fixed"
          bordered
          size="small"
          className="overflow-auto text-xs"
          columns={columns}
          dataSource={filteredDataSource}
          loading={unshijBaina}
          pagination={{
            current: nasjiltinTailan?.khuudasniiDugaar,
            total: nasjiltinTailan?.totalCount || 0,
            pageSizeOptions: [100, 300, 500],
            defaultPageSize: [500],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `Hийт ${total}`,
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
              <AntdTable.Summary.Cell index={3}></AntdTable.Summary.Cell>
              <AntdTable.Summary.Cell index={4}></AntdTable.Summary.Cell>
              {[
                "niitDun",
                "khungulult",
                "tulsunDun",
                "tulukhDun",
                "avalaga0",
                "avlaga31",
                "avlaga61",
                "avlaga91",
                "avlaga120",
              ].map((field, index) => {
                const sum = filteredDataSource.reduce(
                  (acc, cur) => acc + (cur[field] || 0),
                  0
                );
                return (
                  <AntdTable.Summary.Cell
                    key={field}
                    index={5 + shineBagana?.length + index}
                  >
                    <div className="truncate text-center font-bold ">
                      {formatNumber(sum, 2)}
                    </div>
                  </AntdTable.Summary.Cell>
                );
              })}
            </AntdTable.Summary>
          )}
        />

        {/* Hidden Printable Table */}
        <div className="hidden">
          <div ref={printRef}>
            <div className="flex w-full items-center justify-between text-sm">
              <div className="w-1/4 text-left text-sm">
                {ognoo ? (
                  <div>
                    Огноо: {moment(ognoo[0]).format("YYYY-MM-DD")}-{" "}
                    {moment(ognoo[1]).format("YYYY-MГД2405274M-DD")}
                  </div>
                ) : (
                  <div>{""}</div>
                )}
              </div>
              <div className="w-1/3 text-center text-sm font-bold">
                Насжилтын тайлан
              </div>
            </div>

            <table className="w-full border-2 border-gray-500">
              <thead className="bg-gray-400 text-black">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-400 px-2 py-1 text-center text-mashJijigiinJijig"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDataSource.map((item, index) => (
                  <tr key={item.key} className="border-gray-500">
                    <td className="border border-gray-400 px-2 py-1 text-center text-mashJijigiinJijig">
                      {index + 1}
                    </td>
                    {columns.slice(1).map((col, idx) => (
                      <td
                        key={idx}
                        className={`border border-gray-400 px-2 py-1 text-mashJijigiinJijig ${
                          isNumberColumn(col.dataIndex)
                            ? "text-right"
                            : "text-center"
                        }`}
                        style={{
                          whiteSpace:
                            col.dataIndex === "talbainDugaar"
                              ? "normal"
                              : "nowrap",
                          maxWidth:
                            col.dataIndex === "talbainDugaar"
                              ? "120px"
                              : "auto",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {isNumberColumn(col.dataIndex)
                          ? item[col.dataIndex]
                            ? formatNumber(item[col.dataIndex], 2)
                            : "\u00A0"
                          : item[col.dataIndex] || "\u00A0"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    className="border border-gray-400 px-2 py-1 text-center text-mashJijigiinJijig font-semibold"
                    colSpan={5}
                  >
                    Нийт:
                  </td>
                  {[
                    "niitDun",
                    "khungulult",
                    "tulsunDun",
                    "tulukhDun",
                    "avalaga0",
                    "avlaga31",
                    "avlaga61",
                    "avlaga91",
                    "avlaga120",
                  ].map((field) => {
                    const sum = filteredDataSource.reduce(
                      (acc, cur) => acc + (cur[field] || 0),
                      0
                    );
                    return (
                      <td
                        key={field}
                        className="border border-gray-400 px-2 py-1 text-right text-mashJijigiinJijig font-semibold"
                      >
                        {formatNumber(sum, 2)}
                      </td>
                    );
                  })}
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

export default nasjiltinTailan;
