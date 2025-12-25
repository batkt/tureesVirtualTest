import React from "react";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { url } from "services/uilchilgee";
import _ from "lodash";
import { toast } from "sonner";
import { t } from "i18next";

function ZagvarExceleesOruulakh(
  { token, destroy, zam, garchig, tailbar, nekhemjlelZagvar, barilgiinId },
  ref
) {
  const [aldaa, setAldaa] = React.useState(null);

  function garya() {
    destroy();
  }

  React.useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

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
    <div>
      <Upload
        type="drag"
        className="mt-2"
        multiple={false}
        name="file"
        action={`${url}/${zam}`}
        method="POST"
        headers={{ Authorization: `bearer ${token}` }}
        data={{
          turul: "nekhemjlel",
          excelNer: nekhemjlelZagvar?.ner,
          barilgiinId: barilgiinId,
        }}
        onChange={({ file }) => {
          if (file.response === "Amjilttai") {
            toast.success(t("Excel -ээс загвар амжилттай орууллаа"));
          }
          if (!!file.response?.aldaa) setAldaa(file.response?.aldaa);
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{t(garchig)}</p>
        <p className="ant-upload-hint">{t(tailbar)}</p>
      </Upload>
      {aldaa && (
        <div
          className="max-h-52 overflow-auto text-red-600"
          dangerouslySetInnerHTML={{
            __html: aldaa,
          }}
        />
      )}
    </div>
  );
}

export default React.forwardRef(ZagvarExceleesOruulakh);
