import moment from "moment";
import React from "react";
import {
  EditOutlined,
  MoreOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Popover, Button, Popconfirm } from "antd";

function TogloomTile({
  dugaar,
  ezemshigchiinNer,
  createdAt,
  mashinBurtgekh,
  turul,
  data,
  tsenegliy,
  ezemshigchiinUtas,
}) {
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{dugaar}</div>
        <div className="ml-auto flex items-start text-sm font-medium">
          <Popover
            placement="bottom"
            trigger="click"
            content={() => (
              <div className="flex w-32 flex-col space-y-2">
                <Button
                  type="text"
                  className="flex items-start justify-start bg-gray-100 p-2 hover:bg-green-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-300"
                  icon={<DollarCircleOutlined />}
                  onClick={() => {
                    tsenegliy(data);
                  }}
                >
                  Цэнэглэх
                </Button>
                <Button
                  type="text"
                  className="flex items-start justify-start bg-gray-100 p-2 hover:bg-green-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-300"
                  icon={<EditOutlined />}
                  onClick={() => mashinBurtgekh(data)}
                >
                  Засах
                </Button>
                <Popconfirm
                  placement="left"
                  title="Машин устгах уу?"
                  okText="Тийм"
                  cancelText="Үгүй"
                >
                  <Button
                    type="text"
                    className="flex items-start justify-between p-2 hover:bg-red-100 dark:hover:bg-gray-700"
                    danger
                  >
                    Устгах
                  </Button>
                </Popconfirm>
              </div>
            )}
          >
            <Button
              size="small"
              icon={<MoreOutlined />}
              className="hover:scale-110"
            />
          </Popover>
        </div>
      </div>

      <div className="mt-1 flex w-full flex-row dark:text-gray-100">
        <div>{ezemshigchiinNer}</div>
        <div className="ml-auto font-medium">{turul}</div>
      </div>
      <div className="mt-1 flex w-full flex-row dark:text-gray-100">
        {ezemshigchiinUtas}
        <div className="ml-auto font-medium">
          {moment(createdAt).format("YYYY-MM-DD HH:mm:ss")}
        </div>
      </div>
    </div>
  );
}

export default TogloomTile;
