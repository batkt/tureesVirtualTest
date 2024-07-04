import React, { useMemo, useEffect } from "react";
import { DatePicker, message, Select, Upload, Switch } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import uilchilgee, { url } from "services/uilchilgee";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import locale from "antd/lib/date-picker/locale/mn_MN";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";

function GuilgeeExceleesOruulakhOlnoor(
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
  const [ashiglaltiinId, setGereeniiZagvar] = React.useState(null);
  const [ognoo, setOgnoo] = React.useState(null);
  const [nuatBodokhEsekh, setNuatBodokhEsekh] = React.useState(true);
  const [aldaa, setAldaa] = React.useState(null);
  const { t, i18n } = useTranslation();

  const query = useMemo(
    () => ({
      turul: { $in: ["кВт", "1м3"] },
      barilgiinId,
    }),
    [barilgiinId]
  );

  const zardal = useJagsaalt(
    "/ashiglaltiinZardluud",
    query,
    undefined,
    undefined,
    undefined,
    token
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
      .get(`/${zagvariinZam}`, { responseType: "blob" })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
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
      <DatePicker
          value={ognoo}
          onChange={setOgnoo}
          allowClear={false}
          locale={locale}
          style={{ width: "49%" }}
        />
        <Select
          placeholder={t("Ашиглалтын зардал")}
          onChange={setGereeniiZagvar}
          style={{ width: "100%" }}
        >
          {zardal?.jagsaalt?.map((a) => (
            <Select.Option key={a._id} value={a._id}>
              {a.ner}
            </Select.Option>
          ))}
        </Select>
        <div className="space-x-2">
          <label>{t("НӨАТ бодох эсэх")}:</label>
          <Switch checked={nuatBodokhEsekh} onChange={setNuatBodokhEsekh} />
        </div>
      </div>
      <div className="mt-5" />
      {!!ashiglaltiinId && !!ognoo && (
        <Upload
          type="drag"
          multiple={false}
          name="file"
          data={{
            barilgiinId,
            ashiglaltiinId,
            nuatBodokhEsekh,
            ognoo: moment(ognoo).format("YYYY-MM-DD 00:00:00"),
          }}
          action={`${url}/${zam}`}
          method="POST"
          headers={{ Authorization: `bearer ${token}` }}
          beforeUpload={(file) => {
            if (!ashiglaltiinId) {
              message.warning(t("Гүйлгээний загвар сонгоно уу"));
              return false;
            }
            return file;
          }}
          onChange={({ file }) => {
            if (file.response === "Amjilttai") {
              message.success(
                t("Гүйлгээний мэдээлэл Excel -ээс амжилттай орууллаа")
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
          {t("Загвар татах")}
        </a>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeExceleesOruulakhOlnoor);
