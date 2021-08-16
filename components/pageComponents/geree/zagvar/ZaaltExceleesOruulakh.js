import React from "react";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { url } from "services/uilchilgee";
import _ from "lodash";

const props = {
  name: "file",
  action: `${url}/gereeniiZaaltTatya`,
};

function index({ token, destroy }, ref) {
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
      {...props}
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
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Upload>
  );
}

export default React.forwardRef(index);
