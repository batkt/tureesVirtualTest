import React from "react";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { url } from "services/uilchilgee";
import _ from "lodash";

function index(
  { token, destroy, zam, garchig, tailbar, zagvariinZam, onFinish },
  ref
) {
  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
    }),
    []
  );

  return (
    <div>
      <Upload
        type="drag"
        multiple={false}
        name="file"
        action={`${url}/${zam}`}
        method="POST"
        headers={{ Authorization: `bearer ${token}` }}
        onChange={({ file }) => {
          if (file.response === "Amjilttai") {
            message.success("Гэрээний заалт Excel -ээс амжилттай орууллаа");
          }
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{garchig}</p>
        <p className="ant-upload-hint">{tailbar}</p>
      </Upload>
      {zagvariinZam && (
        <a
          className="cursor-pointer text-blue-600 font-medium"
          href={url + `/${zagvariinZam}`}
          download
        >
          Загвар татах
        </a>
      )}
    </div>
  );
}

export default React.forwardRef(index);
