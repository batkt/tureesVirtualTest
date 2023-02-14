import {
  DatePicker,
  Divider,
  Input,
  InputNumber,
  notification,
  Radio,
  Switch,
  Select,
  Modal,
} from "antd";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";
import formatNumber from "tools/function/formatNumber";
import useJagsaalt from "hooks/useJagsaalt";
import { t } from "i18next";

function GuilgeeKhiikh(
  { data, token, onFinish, destroy, barilgiinId, khadgalyaButtonId },
  ref
) {
  const [dun, setDun] = useState("");
  const [ognoo, setOgnoo] = useState(moment().add(1, "month").startOf("month"));
  const [turul, setTurul] = useState("voucher");
  const [tailbar, setTailbar] = useState("");
  const [negjUne, setNegjUne] = useState("");
  const [khemjikhNegj, setKhemjikhNegj] = useState("");

  const [busadTurul, setBusadTurul] = useState();
  const [nekhemjlekhDeerKharagdakh, setNekhemjlekhDeerKharagdakh] =
    useState(false);

  const query = useMemo(
    () => ({
      ner: data?.zardluud && { $in: data.zardluud.map((a) => a.ner) },
      turul: { $nin: ["Тогтмол", "Дурын"] },
      tariff: { $exists: true },
      barilgiinId,
    }),
    [data, barilgiinId]
  );

  const zardal = useJagsaalt(
    data?.zardluud && "/ashiglaltiinZardluud",
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
      khadgalya() {
        if (!dun) {
          notification.warning({ message: t("Та дүн оруулна уу") });
          return;
        }

        var guilgee = {};

        switch (turul) {
          case "busad":
            if (!busadTurul) {
              notification.warning({
                message: t("Та гүйлгээний төрөлөө сонгоно уу"),
              });
              return;
            }
            guilgee = {
              turul: busadTurul,
              tulsunDun: busadTurul === "aldangi" ? 0 : dun,
              tulukhDun: 0,
              tulsunAldangi: busadTurul === "aldangi" ? dun : 0,
              tulukhAldangi: 0,
              ognoo: new Date(),
              gereeniiId: data?._id,
              tailbar,
            };
            break;
          case "voucher":
          case "avlaga":
            guilgee = {
              turul: turul,
              tulsunDun: turul === "voucher" ? dun : 0,
              tulukhDun: turul === "avlaga" ? dun : 0,
              ognoo:
                turul === "avlaga"
                  ? moment(ognoo).startOf("month").format("YYYY-MM-DD 00:00:00")
                  : new Date(),
              gereeniiId: data?._id,
              tailbar,
              nekhemjlekhDeerKharagdakh:
                turul === "avlaga" ? nekhemjlekhDeerKharagdakh : false,
            };
            break;
          case "ahiglalt":
            guilgee = {
              turul: "avlaga",
              tulsunDun: 0,
              tulukhDun: negjUne * dun,
              negj: dun,
              khemjikhNegj: khemjikhNegj,
              tariff: negjUne,
              ognoo: moment(ognoo).format("YYYY-MM-DD 00:00:00"),
              gereeniiId: data?._id,
              tailbar,
              nekhemjlekhDeerKharagdakh,
            };
            break;
          default:
            break;
        }

        uilchilgee(token)
          .post("/gereeniiGuilgeeKhadgalya", {
            guilgee: guilgee,
          })
          .then(() => {
            notification.success({
              message: t("Амжилттай"),
            });
            _.isFunction(data.mutate) && data.mutate();
            _.isFunction(onFinish) && onFinish();

            destroy();
          })
          .catch(aldaaBarigch);
      },
    }),
    [dun, turul, tailbar, nekhemjlekhDeerKharagdakh, busadTurul, negjUne, ognoo]
  );
  function labelTurul(guilgeeTurul) {
    var text;
    switch (guilgeeTurul) {
      case "avlaga":
        text = "Авлага үүсгэх";
        break;
      case "voucher":
        text = "Ваучераар тооцоо хийх";
        break;
      case "barter":
        text = "Бусад";
        break;
      default:
        break;
    }
    return t(text);
  }

  function garya() {
    if (
      dun !== "" ||
      tailbar !== "" ||
      negjUne !== "" ||
      nekhemjlekhDeerKharagdakh !== false ||
      busadTurul !== undefined
    )
      Modal.confirm({
        content: `Та хадгалахгүй гарахдаа итгэлтэй байна уу?`,
        okText: "Тийм",
        cancelText: "Үгүй",
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
  }, [dun, tailbar, negjUne, nekhemjlekhDeerKharagdakh, busadTurul]);

  useEffect(() => {
    document.getElementById("guilgeeDunInputNumber").focus();
  }, []);

  const focuser = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        switch (e.target.id) {
          case "guilgeeDunInputNumber":
            if (turul !== "voucher") {
              document.getElementById("textArea").focus();
            } else document.getElementById(khadgalyaButtonId).focus();
            break;

          case "textArea":
            document.getElementById(khadgalyaButtonId).focus();
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
      <div className="flex w-full pb-4 ">
        <Radio.Group
          onChange={(e) => {
            setTurul(e.target.value);
            setDun("");
            setTailbar("");
          }}
          value={turul}
          className="grid w-full grid-cols-2 justify-between sm:flex"
        >
          <Radio value={"voucher"}>{t("Ваучераар")}</Radio>
          <Radio value={"avlaga"}>{t("Авлага")}</Radio>
          <Radio value={"ahiglalt"}>{t("Ашиглалт")}</Radio>
          <Radio value={"busad"}>{t("Бусад")} </Radio>
        </Radio.Group>
      </div>
      <Divider />
      <label>{labelTurul(turul)}</label>
      {turul === "avlaga" && (
        <DatePicker.MonthPicker
          id="dataPicker1"
          locale={locale}
          value={ognoo}
          onChange={(v) => {
            setOgnoo(v);
            document.getElementById("guilgeeDunInputNumber").focus();
          }}
        />
      )}
      {turul === "ahiglalt" && (
        <DatePicker
          id="dataPicker2"
          locale={locale}
          value={ognoo}
          onChange={(v) => {
            setOgnoo(v);
            document.getElementById("select2").focus();
          }}
        />
      )}
      {turul === "busad" && (
        <Select
          id="select"
          placeholder="Гүйлгээ хийх төрөл"
          onChange={(v) => {
            setBusadTurul(v);
            document.getElementById("guilgeeDunInputNumber").focus();
          }}
        >
          <Option value="barter">{t("Бартер")}</Option>
          <Option value="zalruulga">{t("Залруулга")}</Option>
          <Option value="aldangi">{t("Алданги")}</Option>
        </Select>
      )}
      {busadTurul === "aldangi" && (
        <div>
          {t("Алдангийн үлдэгдэл")}: {formatNumber(data?.aldangiinUldegdel, 2)}
        </div>
      )}
      {turul === "ahiglalt" && (
        <Select
          onChange={(v) => {
            const utga = zardal.jagsaalt.find((a) => a._id === v);
            setNegjUne(utga.tariff || 0);
            setTailbar(utga.ner);
            setKhemjikhNegj(utga.turul);
            document.getElementById("guilgeeDunInputNumber").focus();
          }}
          id="select2"
          placeholder={t("Зардлын төрөл")}
        >
          {zardal.jagsaalt?.map((mur) =>
            mur.turul !== "1м2" ? (
              <Select.Option key={mur._id} value={mur._id}>
                <div>
                  {mur.ner}/{mur.turul}
                </div>
              </Select.Option>
            ) : (
              ""
            )
          )}
        </Select>
      )}
      {negjUne && turul === "ahiglalt" && (
        <div className="p-2 dark:text-gray-100">
          {t("Нэгж үнэ")}: {formatNumber(negjUne, 2)}
        </div>
      )}
      <InputNumber
        onKeyDown={focuser}
        id="guilgeeDunInputNumber"
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        placeholder={turul === "ahiglalt" ? "Нэгж" : "Дүн"}
        style={{ width: "100%", textAlign: "center" }}
        value={dun}
        onChange={(v) => setDun(v)}
        min={0}
      />
      {negjUne && turul === "ahiglalt" && (
        <div className="p-2 dark:text-gray-100">
          {t("Нийт үнэ")}: {formatNumber(negjUne * dun || 0, 2)}
        </div>
      )}
      {(turul === "avlaga" || turul === "busad") && (
        <Input.TextArea
          onKeyDown={focuser}
          id="textArea"
          placeholder={t("Тайлбар")}
          value={tailbar}
          onChange={(e) => setTailbar(e.target.value)}
        />
      )}
      {(turul === "avlaga" || turul === "ahiglalt") && (
        <div className="flex flex-row justify-between">
          <div />
          <div className="space-x-2">
            <label>{t("Нэхэмжлэх дээр харах эсэх")}:</label>
            <Switch
              checked={nekhemjlekhDeerKharagdakh}
              onChange={setNekhemjlekhDeerKharagdakh}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeKhiikh);
