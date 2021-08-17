import React from "react";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { url } from "services/uilchilgee";
import _ from "lodash";

function index({ token, destroy, zam, garchig, tailbar }, ref) {
  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
    }),
    []
  );

  return (
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
          destroy();
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{garchig}</p>
      <p className="ant-upload-hint">{tailbar}</p>
    </Upload>
  );
}

export default React.forwardRef(index);
