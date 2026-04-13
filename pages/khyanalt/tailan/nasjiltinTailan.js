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
import ExcelJS from "exceljs";
import formatNumber from "tools/function/formatNumber";
import useNasjiltinTailan from "hooks/tailan/useNasjiltinTailan";
import { useAuth } from "services/auth";
import React, { Children, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";
import axios from "services/uilchilgee";

function nasjiltinTailan({ token }) {
  const { barilgiinId, baiguullaga, ajiltan } = useAuth();
  const [excelUnshijBaina, setExcelUnshijBaina] = useState(false);
  const [khadgalsanKhuudaslalt, setKhadgalsaKhuudaslalt] = useState(null);
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
  const [ognoo, setOgnoo] = useState(moment().endOf("month"));
  const handleDateChange = (date) => {
    setOgnoo(date);
  };
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: "print",
  });

  const segments = useJagsaalt("/segment");
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
    const q = {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      ekhlekhOgnoo: undefined,
      duusakhOgnoo: ognoo
        ? moment(ognoo).format("YYYY-MM-DD 23:59:59")
        : undefined,
      khariltsagchiinId: songogdsonIds.length > 0 ? songogdsonIds : undefined,
      turul: songogdsonTurul,
      segment: songogdsonTurul,
      yalgal: songogdsonTurul,
    };
    songogdsonSegments.forEach((s) => {
      if (s.ner) {
        q[s.ner] = songogdsonTurul;
      }
    });
    // Fallback common key
    if (songogdsonSegments.length > 0) {
      q["ялгах утга"] = songogdsonTurul;
    }
    return q;
  }, [
    ognoo,
    baiguullaga,
    barilgiinId,
    songogdsonIds,
    songogdsonTurul,
    songogdsonSegments,
  ]);

  const { nasjiltinTailan, unshijBaina, setTailanKhuudaslalt } =
    useNasjiltinTailan(token, query, reportSearchKeys, 500);


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
        title: t("Гэрээний дугаар"),
        dataIndex: "gereeniiDugaar",
        __style__: { h: "center" },
      },
      {
        title: t("Харилцагч"),
        dataIndex: "ner",
        __style__: { h: "center" },
      },
      {
        title: t("Талбайн дугаар"),
        dataIndex: "talbainDugaar",
        __style__: { h: "center" },
      },
      {
        title: t("Харилцагч РД"),
        dataIndex: "register",
        __style__: { h: "center" },
      },
      {
        title: t("Нийт дүн"),
        dataIndex: "niitDun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("Xөнгөлөлт"),
        dataIndex: "khungulult",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("Төлсөн дүн"),
        dataIndex: "tulsunDun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("Төлөх дүн"),
        dataIndex: "tulukhDun",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("0-30 хоног"),
        dataIndex: "avalaga0",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("31-60 хоног"),
        dataIndex: "avlaga31",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("61-90 хоног"),
        dataIndex: "avlaga61",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("91-120 хоног"),
        dataIndex: "avlaga91",
        __style__: { h: "right" },
        __numFmt__: "#,##0.00",
        __cellType__: "TypeNumeric",
        render: (une) => {
          return une || 0;
        },
      },
      {
        title: t("+120 хоног"),
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
      .addSheet(t("Насжилтын тайлан"))
      .addColumns(excelCol)
      .addDataSource(filteredDataSource)
      .saveAs(`${t("Насжилтын тайлан")}.xlsx`);
    setExcelUnshijBaina(false);
  }

  async function exceleerTatyaCopy() {
    setExcelUnshijBaina(true);

    try {
      // 1. Backend-ээс шинэ дата татах
      const res = await axios(token).post("/sankhuuShinjilgee", {
        baiguullagiinId: baiguullaga?._id,
        barilgiinId: barilgiinId,
        ekhlekhOgnoo: undefined,
        duusakhOgnoo: ognoo
          ? moment(ognoo).format("YYYY-MM-DD 23:59:59")
          : undefined,
        khariltsagchiinId:
          songogdsonIds.length > 0 ? songogdsonIds : undefined,
        khuudasniiKhemjee: 1000000,
        khuudasniiDugaar: 1,
      });

      const rows = res.data || [];

      // 2. Бүх сарыг цуглуулах (unique sar)
      const saruud = Array.from(
        new Set(rows.map((r) => r._id?.sar).filter(Boolean))
      ).sort();

      // 3. Гэрээ/талбайгаар мөр болгон групплэх
      const grouped = {};
      rows.forEach((r) => {
        const key = r._id?.gereeniiDugaar || `${r._id?.register}_${r._id?.talbainDugaar}`;

        if (!grouped[key]) {
          grouped[key] = {
            gereeniiDugaar: r._id?.gereeniiDugaar || "-",
            talbainDugaar: r._id?.talbainDugaar || "-",
            ner: r._id?.ner || "-",
            register: r._id?.register || "-",
            duusakhOgnoo: r._id?.duusakhOgnoo || "",
            gereeniiOgnoo: r._id?.gereeniiOgnoo || "",
            khugatsaa: r._id?.khugatsaa || 0,
            turul: r._id?.turul || "",
            davkhar: r._id?.davkhar || 0,
            tuluv: r._id?.tuluv || "",
            talbainNegjUne: r._id?.talbainNegjUne || 0,
            talbainNiitUne: r._id?.talbainNiitUne || 0,
            talbainKhemjee: r._id?.talbainKhemjee || 0,
            talbainKhemjeeMetrKube: r._id?.talbainKhemjeeMetrKube || 0,
            baritsaaAvakhDun: r._id?.baritsaaAvakhDun || 0,
            baritsaaniiAvsan: r._id?.baritsaaniiAvsan || 0,
            baritsaaniiUldegdel: r._id?.baritsaaniiUldegdel || 0,
            baritsaaAvakhKhugatsaa: r._id?.baritsaaAvakhKhugatsaa || 0,
            aldangiinUldegdel: r._id?.aldangiinUldegdel || 0,
            zoriulalt: r._id?.zoriulalt || "",
            tusgaiZoriulalt: r._id?.tusgaiZoriulalt || "",
            khariltsagchiinNershil: r._id?.khariltsagchiinNershil || "",
          };
        }

        const sar = r._id?.sar;
        if (sar) {
          grouped[key][`${sar}_tuluh`] = r.sariinTulukhDun || 0;
          grouped[key][`${sar}_tulsun`] = r.sariinTulsunDun || 0;
          grouped[key][`${sar}_khungulult`] = r.sariinKhungulult || 0;
          grouped[key][`${sar}_uldegdel`] = r.sariinUldegdel || 0;
        }
      });

      const excelData = Object.values(grouped);

      // 4. ExcelJS ашиглан merged header-тэй Excel үүсгэх
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Санхүү шинжилгээ");

      // 5. Эхний мөр: merged header (сар бүр)
      const headerRow1 = worksheet.addRow([]);
      headerRow1.height = 25;

      // Баз баганууд (4 багана)
      headerRow1.getCell(1).value = "Харилцагч";
      headerRow1.getCell(2).value = "Регистр";
      headerRow1.getCell(3).value = "Талбайн дугаар";
      headerRow1.getCell(4).value = "Гэрээний дугаар";
      headerRow1.getCell(5).value = "Гэрээний огноо";
      headerRow1.getCell(6).value = "Дуусах огноо";
      headerRow1.getCell(7).value = "Хугацаа (сар)";
      headerRow1.getCell(8).value = "Төрөл";
      headerRow1.getCell(9).value = "Давхар";
      headerRow1.getCell(10).value = "Төлөв";
      headerRow1.getCell(11).value = "Талбайн нэгж үнэ";
      headerRow1.getCell(12).value = "Талбайн нийт үнэ";
      headerRow1.getCell(13).value = "Талбайн хэмжээ (м²)";
      headerRow1.getCell(14).value = "Талбайн хэмжээ (м3)";
      headerRow1.getCell(15).value = "Барьцаа авах дүн";
      headerRow1.getCell(16).value = "Барьцаа төлсөн дүн";
      headerRow1.getCell(17).value = "Барьцаа үлдэгдэл дүн";
      headerRow1.getCell(18).value = "Барьцаа авах хугацаа (сар)";
      headerRow1.getCell(19).value = "Алдангийн үлдэгдэл";
      headerRow1.getCell(20).value = "Зориулалт";
      headerRow1.getCell(21).value = "Тусгай зориулалт";
      headerRow1.getCell(22).value = "Нэршил";

      // Сар бүрийн merged header
      let colIndex = 23;
      saruud.forEach((sar) => {
        const startCol = colIndex;
        const endCol = colIndex + 3; // 4 багана (Төлөх, Төлсөн, Хөнгөлөлт, Үлдэгдэл)

        worksheet.mergeCells(1, startCol, 1, endCol);
        const mergedCell = headerRow1.getCell(startCol);
        mergedCell.value = sar;
        mergedCell.alignment = { vertical: "middle", horizontal: "center" };
        mergedCell.font = { bold: true };
        mergedCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF90EE90" }, // Ногоон өнгө
        };
        mergedCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        colIndex = endCol + 1;
      });

      // Баз багануудын style
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].forEach((col) => {
        const cell = headerRow1.getCell(col);
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.font = { bold: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF90EE90" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // 6. Хоёр дахь мөр: дэд header (Төлөх, Төлсөн, Хөнгөлөлт, Үлдэгдэл)
      const headerRow2 = worksheet.addRow([]);
      headerRow2.height = 20;

      // Баз баганууд хоёр дахь мөрөнд хоосон
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].forEach((col) => {
        const cell = headerRow2.getCell(col);
        cell.value = "";
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF90EE90" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Сар бүрийн дэд header
      colIndex = 23;
      saruud.forEach((sar) => {
        const subHeaders = ["Төлөх", "Төлсөн", "Хөнгөлөлт", "Үлдэгдэл"];
        subHeaders.forEach((subHeader) => {
          const cell = headerRow2.getCell(colIndex);
          cell.value = subHeader;
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.font = { bold: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF90EE90" },
          };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          colIndex++;
        });
      });

      const totalStartCol = 23 + saruud.length * 4;
      worksheet.mergeCells(1, totalStartCol, 1, totalStartCol + 3);
      const totalHeader = headerRow1.getCell(totalStartCol);
      totalHeader.value = "Нийт";
      totalHeader.font = { bold: true };
      totalHeader.alignment = { vertical: "middle", horizontal: "center" };
      totalHeader.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF90EE90" },
      };
      totalHeader.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      ["Төлөх", "Төлсөн", "Хөнгөлөлт", "Үлдэгдэл"].forEach((h, i) => {
        const cell = headerRow2.getCell(totalStartCol + i);
        cell.value = h;
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF90EE90" },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });


      // 7. Өгөгдлийн мөрүүд
      excelData.forEach((row) => {
        const dataRow = worksheet.addRow([]);

        // Баз баганууд
        dataRow.getCell(1).value = row.ner;
        dataRow.getCell(2).value = row.register;
        dataRow.getCell(3).value = row.talbainDugaar;
        dataRow.getCell(4).value = row.gereeniiDugaar;
        dataRow.getCell(5).value = row.gereeniiOgnoo ? new Date(row.gereeniiOgnoo) : null;
        dataRow.getCell(5).numFmt = 'yyyy-mm-dd';
        dataRow.getCell(6).value = row.duusakhOgnoo ? new Date(row.duusakhOgnoo) : null;
        dataRow.getCell(6).numFmt = 'yyyy-mm-dd';
        dataRow.getCell(7).value = row.khugatsaa || 0;
        dataRow.getCell(8).value = row.turul || "";
        dataRow.getCell(9).value = row.davkhar || 0;
        dataRow.getCell(10).value = row.tuluv == 1 ? "Идэвхтэй" : "Цуцалсан";
        dataRow.getCell(11).value = row.talbainNegjUne || 0;
        dataRow.getCell(11).numFmt = "#,##0.00";
        dataRow.getCell(12).value = row.talbainNiitUne || 0;
        dataRow.getCell(12).numFmt = "#,##0.00";
        dataRow.getCell(13).value = row.talbainKhemjee || 0;
        dataRow.getCell(13).numFmt = "#,##0.00";
        dataRow.getCell(14).value = row.talbainKhemjeeMetrKube || 0;
        dataRow.getCell(14).numFmt = "#,##0.00";
        dataRow.getCell(15).value = row.baritsaaAvakhDun || 0;
        dataRow.getCell(15).numFmt = "#,##0.00";
        dataRow.getCell(16).value = row.baritsaaniiAvsan || 0;
        dataRow.getCell(16).numFmt = "#,##0.00";
        dataRow.getCell(17).value = row.baritsaaniiUldegdel || 0;
        dataRow.getCell(17).numFmt = "#,##0.00";
        dataRow.getCell(18).value = row.baritsaaAvakhKhugatsaa || 0;
        dataRow.getCell(18).numFmt = "#,##0.00";
        dataRow.getCell(19).value = row.aldangiinUldegdel || 0;
        dataRow.getCell(19).numFmt = "#,##0.00";
        dataRow.getCell(20).value = row.zoriulalt || "";
        dataRow.getCell(21).value = row.tusgaiZoriulalt || "";
        dataRow.getCell(22).value = row.khariltsagchiinNershil || "";



        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].forEach((col) => {
          const cell = dataRow.getCell(col);
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });

        // Сар бүрийн утгууд
        colIndex = 23;
        let rowTotal = {
          tuluh: 0,
          tulsun: 0,
          khungulult: 0,
          uldegdel: 0,
        };

        saruud.forEach((sar) => {
          const tuluh = row[`${sar}_tuluh`] || 0;
          const tulsun = row[`${sar}_tulsun`] || 0;
          const khungulult = row[`${sar}_khungulult`] || 0;
          const uldegdel = row[`${sar}_uldegdel`] || 0;

          // 👉 НИЙТ-д нэмэх
          rowTotal.tuluh += tuluh;
          rowTotal.tulsun += tulsun;
          rowTotal.khungulult += khungulult;
          rowTotal.uldegdel += uldegdel;

          [tuluh, tulsun, khungulult, uldegdel].forEach((value) => {
            const cell = dataRow.getCell(colIndex);
            cell.value = value;
            cell.numFmt = "#,##0.00";
            cell.alignment = { vertical: "middle", horizontal: "right" };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            colIndex++;
          });
        });

        [
          rowTotal.tuluh,
          rowTotal.tulsun,
          rowTotal.khungulult,
          rowTotal.uldegdel,
        ].forEach((value, i) => {
          const cell = dataRow.getCell(totalStartCol + i);
          cell.value = value;
          cell.numFmt = "#,##0.00";
          cell.font = { bold: true };
          cell.alignment = { vertical: "middle", horizontal: "right" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // 8. Баганын өргөнийг тохируулах
      worksheet.getColumn(1).width = 20; // Харилцагч
      worksheet.getColumn(2).width = 15; // Регистр
      worksheet.getColumn(3).width = 15; // Талбайн дугаар
      worksheet.getColumn(4).width = 18; // Гэрээний дугаар
      worksheet.getColumn(5).width = 15; // Гэрээний огноо
      worksheet.getColumn(6).width = 15; // Дуусах огноо        
      worksheet.getColumn(7).width = 12; // Хугацаа (сар)
      worksheet.getColumn(8).width = 12; // Төрөл
      worksheet.getColumn(9).width = 10; // Давхар
      worksheet.getColumn(10).width = 12; // Төлөв 
      worksheet.getColumn(11).width = 18; // Талбайн нэгж үнэ
      worksheet.getColumn(12).width = 18; // Талбайн нийт үнэ
      worksheet.getColumn(13).width = 15; // Талбайн хэмжээ (м²)
      worksheet.getColumn(14).width = 15; // Талбайн хэмжээ (м3)
      worksheet.getColumn(15).width = 18; // Барьцаа авах дүн
      worksheet.getColumn(16).width = 18; // Барьцаа төлсөн дүн
      worksheet.getColumn(17).width = 18; // Барьцаа үлдэгдэл дүн
      worksheet.getColumn(18).width = 20; // Барьцаа авах хугацаа (сар)
      worksheet.getColumn(19).width = 18; // Алдангийн үлдэгдэл
      worksheet.getColumn(20).width = 18; // Зориулалт
      worksheet.getColumn(21).width = 18; // Тусгай зориулалт
      worksheet.getColumn(22).width = 18; // Харилцагчийн нэршил

      // Сар бүрийн багануудын өргөн
      let colNum = 23;
      saruud.forEach(() => {
        for (let i = 0; i < 4; i++) {
          worksheet.getColumn(colNum).width = 15;
          colNum++;
        }
      });
      for (let i = 0; i < 4; i++) {
        worksheet.getColumn(colNum).width = 15;
        colNum++;
      }

      // 9. Excel файл татах
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "СанхүүШинжилгээ_саруудаар.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setExcelUnshijBaina(false);
    }
  }

  async function tatakhMsgTuukh() {
    setExcelUnshijBaina(true);
    try {
      const ekhlekhOgnoo = ognoo
        ? moment(ognoo).startOf("year").format("YYYY-MM-DD")
        : moment().startOf("year").format("YYYY-MM-DD");
      const duusakhOgnoo = ognoo
        ? moment(ognoo).endOf("year").format("YYYY-MM-DD")
        : moment().endOf("year").format("YYYY-MM-DD");

      const res = await axios(token).post("/msgTuukhEBarimtZogsoolSarBur", {
        ekhlekhOgnoo,
        duusakhOgnoo,
      });
      const data = res.data;


      let allMonths = new Set();
      data.forEach((row) => {
        if (row.monthly && Array.isArray(row.monthly)) {
          row.monthly.forEach((m) => {
            if (m._id && m._id.year && m._id.month) {
              allMonths.add(`${m._id.year}-${String(m._id.month).padStart(2, '0')}`);
            }
          });
        }
      });
      const sortedMonths = Array.from(allMonths).sort();


      const excelCol = [
        { title: "Регистр", dataIndex: "register", width: 15 },
        { title: "Байгууллага", dataIndex: "ner", width: 30 },
        { title: "Дотоод нэр", dataIndex: "dotoodNer", width: 20 },
      ];

      sortedMonths.forEach((m) => {
        excelCol.push({
          title: m,
          dataIndex: m,
          width: 15,
          style: { alignment: { horizontal: 'right' } }
        });
      });

      const excelData = data.map((row) => {
        const rowData = {
          register: row.register,
          ner: row.ner,
          dotoodNer: row.dotoodNer || "",
        };
        sortedMonths.forEach(m => rowData[m] = 0);

        if (row.monthly && Array.isArray(row.monthly)) {
          row.monthly.forEach((m) => {
            if (m._id && m._id.year && m._id.month) {
              const key = `${m._id.year}-${String(m._id.month).padStart(2, '0')}`;
              rowData[key] = m.count || 0;
            }
          });
        }
        return rowData;
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Авлага Excel");

      const headerRow = worksheet.addRow(excelCol.map(c => c.title));
      headerRow.font = { bold: true };
      headerRow.eachCell((cell, colNumber) => {
        cell.alignment = { horizontal: 'center' };
        cell.border = { bottom: { style: 'thin' } };
      });

      excelData.forEach(rowData => {
        const row = [];
        excelCol.forEach(col => {
          row.push(rowData[col.dataIndex]);
        });
        worksheet.addRow(row);
      });

      worksheet.columns = excelCol.map(c => ({ width: c.width }));


      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Avlaga_Excel_${ekhlekhOgnoo}_${duusakhOgnoo}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (e) {
      console.error(e);
    } finally {
      setExcelUnshijBaina(false);
    }
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
          return <div className="flex justify-center">{text}</div>;
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
          return <div className="flex justify-center">{text}</div>;
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
        title: t("Төлсөн дүн"),
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
        title: t("Төлөх дүн"),
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
        title: t("0-30 хоног"),
        dataIndex: "avalaga0",
        key: "avalaga0",
        align: "right",
        width: "12rem",
        className: "text-mashJijig",
        render: (text) => {
          return formatNumber(text, 2);
        },
      },
      {
        title: t("31-60 хоног"),
        dataIndex: "avlaga31",
        key: "avlaga31",

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
      title={t("Насжилтын тайлан")}
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
          style={{ maxWidth: "100px" }}
          locale={local}
          value={ognoo}
          picker="month"
          onChange={handleDateChange}
          placeholder={"Дуусах огноо"}
          format="YYYY-MM"
        />
        <Select
          className="overflow-y-scroll rounded-md  border-gray-400  md:w-[200px]"
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
              <div className="flex flex-col">
                <div className="flex justify-between font-semibold">
                  <span>{data?.ner}</span>
                  
                </div>
              </div>
            </Select.Option>
          ))}
        </Select>
        <Select
          className="rounded-md border-gray-400 md:w-[150px]"
          allowClear={true}
          value={songogdsonTurul}
          onChange={setSongogdsonTurul}
          placeholder={t("Төрөл сонгох")}
        >
          {turulOptions.map((opt) => (
            <Select.Option key={opt} value={opt}>
              {t(opt)}
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
                    {baiguullaga?._id === "612f457d185280db676d0b51" ? (
                      <Menu.Item
                        key="ExcelTatakhCopy"
                        onClick={() => tatakhMsgTuukh()}
                      >
                        {t("Авлага тайлан татах")}
                      </Menu.Item>
                    ) : null}
                    {ajiltan?.khereglechiinNer === "CAdmin1" ? (
                      <Menu.Item
                        key="MsgTuukhTatakh"
                        onClick={() => tatakhMsgTuukh()}
                      >
                        Авлага Excel
                      </Menu.Item>
                    ) : null}
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
      <div className="text-mashJijig col-span-12 mt-4 w-full overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-800 2xl:mt-0">
        <Table
          sticky={{ offsetHeader: 0 }}
          scroll={{ y: "calc(100vh - 19rem)", x: 2200 }}
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
                        className={`border border-gray-400 px-2 py-1 text-mashJijigiinJijig ${isNumberColumn(col.dataIndex)
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
