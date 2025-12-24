import React, { useMemo, useEffect } from "react";
import { DatePicker, message, Select, Upload, Switch, Tooltip } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import uilchilgee, { url } from "services/uilchilgee";
import locale from "antd/lib/date-picker/locale/mn_MN";
import _ from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";
function GuilgeeEkhniiUldegdelExceleesOruulakhOlnoor(
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
  const [tureesEkhniiUldegdelEsekh, setTureesEkhniiUldegdelEsekh] =
    React.useState(true);
  const [aldaa, setAldaa] = React.useState(null);
  const { t, i18n } = useTranslation();

  const query = useMemo(
    () => ({
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
          placeholder={t("Огноо сонгох")}
        />
        <div className="flex justify-end gap-1">
          <label>{t("Түрээс эсэх")}: </label>
          <Switch
            checked={tureesEkhniiUldegdelEsekh}
            onChange={setTureesEkhniiUldegdelEsekh}
          />
        </div>
        {!tureesEkhniiUldegdelEsekh && (
          <Select
            placeholder={t("Ашиглалтын зардал")}
            onChange={setGereeniiZagvar}
            style={{ width: "100%" }}
          >
            {zardal?.jagsaalt?.map((a) => (
              <Select.Option key={a._id} value={a._id}>
                <div className="flex w-full justify-between border-b">
                  <p className="flex border-r bg-green-400 bg-opacity-10 pl-2 pr-2 text-left">
                    {a.ner}
                  </p>
                  <div className="flex w-full justify-between bg-blue-600 bg-opacity-5 pl-2 pr-2">
                    <p className={`mr-5 border-r text-right`}>{t(a.turul)}</p>
                    <p className="text-right">
                      {a.turul !== "Дурын" ? a.tariff : "Дурын"}
                      {a.turul !== "Дурын" && "₮"}
                    </p>
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        )}
      </div>
      <div className="mt-5" />
      {!!ognoo && (
        <Upload
          type="drag"
          multiple={false}
          name="file"
          data={{
            barilgiinId,
            ashiglaltiinId,
            tureesEkhniiUldegdelEsekh,
            ognoo: moment(ognoo).format("YYYY-MM-DD 00:00:00"),
          }}
          action={`${url}/${zam}`}
          method="POST"
          headers={{ Authorization: `bearer ${token}` }}
          beforeUpload={(file) => {
            if (!tureesEkhniiUldegdelEsekh && !ashiglaltiinId) {
              toast.warning(t("Ашиглалтын зардал сонгоно уу"));
              return false;
            }
            return file;
          }}
          onChange={({ file }) => {
            if (file.response === "Amjilttai") {
              toast.success(
                t("Эхний үлдэгдэл мэдээлэл Excel -ээс амжилттай орууллаа")
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

export default React.forwardRef(GuilgeeEkhniiUldegdelExceleesOruulakhOlnoor);
