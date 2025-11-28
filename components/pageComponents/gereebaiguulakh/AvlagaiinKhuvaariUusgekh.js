import React, { useEffect, useState } from "react";
import { Table } from "antd";
import moment from "moment";
import Aos from "aos";
import formatNumber from "tools/function/formatNumber";

function AvlagaiinKhuvaariUusgekh({
  ugugdul,
  t,
  baritsaaAvakhEsekh,
  baritsaaAvakhDun,
}) {
  return (
    <div className="w-full">
      <div className="space-y-2 divide-y-2">
        <Table
          scroll={{ y: "30vh" }}
          className="mt-2"
          dataSource={ugugdul}
          size="small"
          pagination={false}
          bordered
          columns={[
            {
              title: "№",
              key: "index",
              align: "center",
              className: "text-center",
              render: (a, b, index) => {
                return index + 1;
              },
              width: "0.4rem",
            },
            {
              title: t("Огноо"),
              dataIndex: "ognoo",
              ellipsis: true,
              width: "1.5rem",
              align: "center",
              render(ognoo) {
                return moment(ognoo).format("YYYY-MM-DD");
              },
            },
            {
              title: [t("Төлөх дүн"), "(₮)"],
              dataIndex: "tulukhDun",
              ellipsis: true,
              width: "1.5rem",
              align: "center",
              showSorterTooltip: false,
              render(tulukhDun, record, index) {
                if (index === 0 && baritsaaAvakhEsekh === true) {
                  return formatNumber(baritsaaAvakhDun || tulukhDun);
                }
                return formatNumber(tulukhDun);
              },
            },
            {
              title: t("Хөнгөлөлт"),
              dataIndex: "khyamdral",
              ellipsis: true,
              width: "1.5rem",
              align: "center",
              showSorterTooltip: false,
              render(khyamdral) {
                return formatNumber(khyamdral);
              },
            },
            {
              title: t("Тайлбар"),
              dataIndex: "tailbar",
              ellipsis: true,
              width: "1.5rem",
              align: "center",
              showSorterTooltip: false,
              render(a, b, index) {
                var tailbar = "";
                switch (b.turul) {
                  case "khuvaari":
                    tailbar = "Түрээсийн төлбөр";
                    break;
                  case "avlaga":
                  case "khungulult":
                    tailbar = a;
                    break;
                  default:
                    break;
                }
                return t(tailbar);
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

export default AvlagaiinKhuvaariUusgekh;
