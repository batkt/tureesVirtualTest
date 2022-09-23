import React from "react";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { url } from "services/uilchilgee";
import _ from "lodash";

function index(
  {
    token,
    destroy,
    zam,
    garchig,
    tailbar,
    zagvariinZam,
    onFinish,
    barilgiinId,
  },
  ref
) {
  const [aldaa, setAldaa] = React.useState(null);
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
        data={{ barilgiinId }}
        onChange={({ file }) => {
          if (file.response === "Amjilttai") {
            _.isFunction(onFinish) && onFinish();
            message.success("Excel -ээс мэдээлэл амжилттай орууллаа");
            destroy();
          } else if (!!file.response?.aldaa) setAldaa(file.response?.aldaa);
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{garchig}</p>
        <p className="ant-upload-hint">{tailbar}</p>
      </Upload>
      {aldaa && (
        <div
          className="max-h-52 overflow-auto text-red-600"
          dangerouslySetInnerHTML={{
            __html: aldaa,
          }}
        />
      )}
      <div className="mt-5" />
      {zagvariinZam && (
        <a
          className="cursor-pointer font-medium text-blue-600"
          target="_blank"
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
