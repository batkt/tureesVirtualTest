import {
  Button,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Modal,
  notification,
  Radio,
} from "antd";
import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import uilchilgee from "services/uilchilgee";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";
import formatNumber from "tools/function/formatNumber";
import BaritsaaKhuulga from "./BaritsaaKhuulga";
import { OrderedListOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import { useTranslation } from "react-i18next";

function labelTurul(guilgeeTurul) {
  var text;
  switch (guilgeeTurul) {
    case "ashiglakh":
      text = "Барьцаа ашиглах";
      break;
    default:
      text = "Барьцаа төлөх";
      break;
  }
  return text;
}

function BaritsaaUdirdlaga(
  { data, token, onFinish, destroy, baritsaaUdirdanKhadgalyaaId },
  ref
) {
  const khuulgaRef = React.useRef(null);
  const [dun, setDun] = useState(0);
  const [ognoo, setOgnoo] = useState(moment());
  const { t, i18n } = useTranslation();
  const [turul, setTurul] = useState("tululkh");
  const [tulukhUldegdel, setTulukhUldegdel] = useState(
    (data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0)
  );
  const [ashiglakhUldegdel, setAshiglakhUldegdel] = useState(
    data.baritsaaniiUldegdel
  );
  const [tailbar, setTailbar] = useState("");

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        if (!dun) {
          notification.warning({ message: t("Барьцааны дүн оруулна уу") });
          return;
        }
        if (!ognoo) {
          notification.warning({ message: t("Барьцааны Огноо оруулна уу") });
          return;
        }

        if (turul === "ashiglakh" && dun > data?.baritsaaniiUldegdel) {
          notification.warning({
            message: t("Барьцаа үлдэгдлээс их дүнгээр гүйлгээ хийж болохгүй!"),
          });
          setDun(data?.baritsaaniiUldegdel);
          return;
        }

        if (
          turul === "tululkh" &&
          dun > (data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0)
        ) {
          notification.warning({
            message: t(
              "Барьцаа төлөх дүнгээс их дүнгээр гүйлгээ хийж болохгүй!"
            ),
          });
          setDun(
            (data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0)
          );
          return;
        }

        if (turul === "ashiglakh" && !tailbar) {
          notification.warning({ message: t("Тайлбар оруулна уу!") });
          return;
        }

        const baritsaaniiGuilgee = {
          gereeniiId: data?._id,
          ognoo,
          orlogo: 0,
          zarlaga: 0,
          tailbar,
        };
        if (turul === "ashiglakh") baritsaaniiGuilgee["zarlaga"] = dun;
        else baritsaaniiGuilgee["orlogo"] = dun;

        uilchilgee(token)
          .post("/baritsaaniiGuilgeeKhiie", baritsaaniiGuilgee)
          .then(() => {
            notification.success({
              message: t("Амжилттай"),
            });
            _.isFunction(onFinish) && onFinish();
            destroy();
          });
      },
    }),
    [dun, turul, tailbar, ognoo]
  );

  function tuukhKharya() {
    const footer = [
      <Button onClick={() => khuulgaRef.current.khaaya()}>{t("Хаах")}</Button>,
    ];
    modal({
      title: t("Барьцаа төлбөрийн хуулга"),
      width: "750px",
      icon: <OrderedListOutlined />,
      content: (
        <BaritsaaKhuulga
          tulukhUldegdel={tulukhUldegdel}
          ashiglakhUldegdel={ashiglakhUldegdel}
          setAshiglakhUldegdel={setAshiglakhUldegdel}
          setTulukhUldegdel={setTulukhUldegdel}
          data={data}
          ref={khuulgaRef}
          token={token}
          onFinish={onFinish}
        />
      ),
      footer,
    });
  }

  function garya() {
    if (dun !== 0 || tailbar !== "")
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }

    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [dun, tailbar]);

  useEffect(() => {
    document.getElementById("dunInputNumber").focus();
  }, []);

  const focuser = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        switch (e.target.id) {
          case "dunInputNumber":
            document.getElementById("textArea").focus();
            break;
          case "dunInputNumber":
            document.getElementById("textArea").focus();
            break;
          case "textArea":
            document.getElementById(baritsaaUdirdanKhadgalyaaId).focus();
            break;
          default:
            break;
        }
      }
    },
    [turul]
  );

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-center">
        <Radio.Group
          onChange={(e) => {
            setTurul(e.target.value);
            setOgnoo(moment());
          }}
          value={turul}
        >
          <Radio value={"tululkh"}>{t("Барьцаа төлөх")}</Radio>
          <Radio value={"ashiglakh"}>{t("Барьцаа ашиглах")}</Radio>
        </Radio.Group>
      </div>
      <Divider />
      <div className="flex flex-row dark:text-gray-200">
        <div>{t(labelTurul(turul))}</div>
        <div className="ml-auto">
          {formatNumber(
            turul === "ashiglakh" ? ashiglakhUldegdel : tulukhUldegdel
          )}
        </div>
      </div>
      <DatePicker
        locale={i18n.language === "mn" && locale}
        value={ognoo}
        onChange={(v) => {
          setOgnoo(v);
          document.getElementById("dunInputNumber").focus();
        }}
      />
      <InputNumber
        onKeyDown={focuser}
        autoFocus="true"
        id="dunInputNumber"
        value={dun}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        placeholder={t("Дүн")}
        style={{ width: "100%" }}
        onChange={setDun}
        onDoubleClick={() =>
          setDun(
            turul === "ashiglakh"
              ? data.baritsaaniiUldegdel
              : (data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0)
          )
        }
      />
      <Input.TextArea
        onKeyDown={focuser}
        id="textArea"
        placeholder={t("Тайлбар")}
        value={tailbar}
        onChange={(e) => setTailbar(e.target.value)}
      />

      <Button type="primary" onClick={tuukhKharya} className="mt-2">
        {t("Барьцааны хуулга")}
      </Button>
    </div>
  );
}

export default React.forwardRef(BaritsaaUdirdlaga);
