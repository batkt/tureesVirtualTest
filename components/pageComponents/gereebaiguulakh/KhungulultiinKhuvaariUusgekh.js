import React from "react";
import { Button, Table } from "antd";
import moment from "moment";
import { SettingOutlined, DeleteOutlined } from "@ant-design/icons";
import formatNumber from "tools/function/formatNumber";

function KhungulultiinKhuvaariUusgekh({ ugugdul, t, hungulultUstgakh }) {
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
              title: t("Э/огноо"),
              width: "0.8rem",
              dataIndex: "ognoonuud",
              ellipsis: true,
              align: "center",
              render: (data) => {
                return moment(data && data[0]).format("YYYY-MM-DD");
              },
            },
            {
              title: t("Д/огноо"),
              width: "0.8rem",
              dataIndex: "ognoonuud",
              ellipsis: true,
              align: "center",
              render: (data) => {
                return moment(data && data[data?.length - 1]).format(
                  "YYYY-MM-DD"
                );
              },
            },
            {
              title: t("Хөнгөлөлт %"),
              dataIndex: "khungulukhKhuvi",
              ellipsis: true,
              width: "1rem",
              align: "center",
            },
            {
              title: t("Хөнгөлөлт"),
              dataIndex: "khungulultiinDun",
              ellipsis: true,
              width: "1rem",
              align: "center",
              render: (data) => {
                return formatNumber(data);
              },
            },
            {
              title: () => <SettingOutlined />,
              width: "0.4rem",
              align: "center",
              render: (data) => (
                <div className="flex flex-row justify-center">
                  <Button
                    onClick={() => {
                      hungulultUstgakh(data.key);
                    }}
                    className="ml-1"
                    icon={
                      <DeleteOutlined
                        style={{ fontSize: "12px", color: "red" }}
                      />
                    }
                  ></Button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default KhungulultiinKhuvaariUusgekh;
