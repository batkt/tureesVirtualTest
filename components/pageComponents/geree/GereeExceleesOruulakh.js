import React, { useEffect } from "react";
import { DatePicker, message, Select, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import uilchilgee, { url } from "services/uilchilgee";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import local from "antd/lib/date-picker/locale/mn_MN";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
function GereeExceleesOruulakh(
  {
    token,
    destroy,
    zam,
    garchig,
    tailbar,
    zagvariinZam,
    onFinish,
    baiguullaga,
    barilgiinId,
  },
  ref
) {
  const [zagvariinId, setGereeniiZagvar] = React.useState(null);
  const [ognoo, setOgnoo] = React.useState(null);
  const [aldaa, setAldaa] = React.useState(null);
  const { t, i18n } = useTranslation();
  const query = { turGereeEsekh: { $ne: true } };
  const { gereeniiZagvarGaralt } = useGereeniiZagvar(
    token,
    baiguullaga?._id,
    barilgiinId,
    query
  );

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

  function zagvarAvya() {
    uilchilgee(token)
      .get(`/${zagvariinZam}/${barilgiinId}`, { responseType: "blob" })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        a.download = `${zagvariinZam}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <div>
      <div className="grid w-full grid-cols-2 gap-4">
        <DatePicker.MonthPicker
          locale={i18n.language === "mn" && local}
          onChange={setOgnoo}
        />
        <Select
          placeholder={t("Гэрээний загвар")}
          onChange={setGereeniiZagvar}
          style={{ width: "100%" }}
        >
          {gereeniiZagvarGaralt?.jagsaalt?.map((a) => (
            <Select.Option key={a._id} value={a._id}>
              {a.ner}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="mt-5" />
      {!!zagvariinId && !!ognoo && (
        <Upload
          type="drag"
          multiple={false}
          name="file"
          data={{
            barilgiinId,
            zagvariinId,
            ognoo: moment(ognoo).format("YYYY-MM-01 00:00:00"),
          }}
          action={`${url}/${zam}`}
          method="POST"
          headers={{ Authorization: `bearer ${token}` }}
          beforeUpload={(file) => {
            if (!zagvariinId) {
              message.warning(t("Гэрээний загвар сонгоно уу"));
              return false;
            }
            return file;
          }}
          onChange={({ file }) => {
            if (file.response === "Amjilttai") {
              message.success(
                t("Гэрээний мэдээлэл Excel -ээс амжилттай орууллаа")
              );
              _.isFunction(onFinish) && onFinish();
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
      )}
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
          onClick={zagvarAvya}
        >
          Загвар татах
        </a>
      )}
    </div>
  );
}

export default React.forwardRef(GereeExceleesOruulakh);
