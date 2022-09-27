import React, { useEffect } from "react";
import { Input, InputNumber, Table } from "antd";
import moment from "moment";
import { CloseCircleOutlined } from "@ant-design/icons";
import Aos from "aos";

function AvlagaiinKhuvaariUusgekh({ ugugdul }) {
  return (
    <div className="w-full">
      <div className="space-y-2 divide-y-2">
        <Table
          className="mt-2"
          dataSource={ugugdul}
          size="small"
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
              width: "0.5rem",
            },
            {
              title: "Огноо",
              dataIndex: "ognoo",
              ellipsis: true,
              width: "2.5rem",
              align: "center",
              render(ognoo) {
                return moment(ognoo).format("YYYY-MM-DD hh:mm");
              },
            },
            {
              title: "Төлөх дүн",
              dataIndex: "tulukhDun",
              ellipsis: true,
              width: "1.5rem",
              align: "center",
              showSorterTooltip: false,
            },
            {
              title: "Төрөл",
              dataIndex: "turul",
              ellipsis: true,
              width: "1.5rem",
              align: "center",
              showSorterTooltip: false,
              render(a) {
                let turulMongloor = "";
                switch (a) {
                  case "khuvaari":
                    turulMongloor = "Хуваарь";
                    break;
                  case "avlaga":
                    turulMongloor = "Авлага";
                    break;
                  default:
                    turulMongloor = a;
                    break;
                }
                return turulMongloor;
              },
            },
            {
              title: "Тайлбар",
              dataIndex: "tailbar",
              ellipsis: true,
              width: "1.5rem",
              align: "center",
              showSorterTooltip: false,
            },
          ]}
        />
      </div>
    </div>
  );
}

export default AvlagaiinKhuvaariUusgekh;
