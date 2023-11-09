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
import { useTranslation } from "react-i18next";
import { useGereeGuilgee } from "hooks/useGereeniiJagsaalt";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";

function GuilgeeKhiikh(
  { data, token, onFinish, destroy, barilgiinId, khadgalyaButtonId, date },
  ref
) {
  const [dun, setDun] = useState(0);
  const [ognoo, setOgnoo] = useState(moment().add(1, "month").startOf("month"));
  const [turul, setTurul] = useState("voucher");
  const [tailbar, setTailbar] = useState("");
  const [negjUne, setNegjUne] = useState("");
  const [umnukhZaalt, setUmnukhZaalt] = useState(0);
  const [suuliinZaalt, setSuuliinZaalt] = useState(null);
  const [khemjikhNegj, setKhemjikhNegj] = useState("");
  const [suuriKhuraamj, setSuuriKhuraamj] = useState(null);
  const { t, i18n } = useTranslation();

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
  const { guilgeeniiTuukh, guilgeeniiTuukhMutate } = useGereeGuilgee(
    token,
    data?._id,
    date
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
        if (!dun && !suuriKhuraamj) {
          notification.warning({ message: t("Та дүн оруулна уу") });
          return;
        }
        let guilgee = {};
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
          case "ashiglalt":
            {
              if (
                (khemjikhNegj === "кВт" || khemjikhNegj === "1м3") &&
                umnukhZaalt > suuliinZaalt
              ) {
                notification.warning({
                  message: t("Сүүлийн заалт өмнөх заалтаас их байх ёстой."),
                });
                return;
              }
              guilgee = {
                turul: "avlaga",
                tulsunDun: 0,
                tulukhDun: suuriKhuraamj + negjUne * (dun || 0),
                negj: dun && dun,
                khemjikhNegj: khemjikhNegj,
                tariff: negjUne,
                ognoo: moment(ognoo).format("YYYY-MM-DD 00:00:00"),
                gereeniiId: data?._id,
                tailbar,
                nekhemjlekhDeerKharagdakh,
              };
              if (khemjikhNegj === "кВт" || khemjikhNegj === "1м3") {
                guilgee["suuliinZaalt"] = suuliinZaalt;
                guilgee["umnukhZaalt"] = umnukhZaalt;
              }
            }
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
    [
      dun,
      turul,
      tailbar,
      nekhemjlekhDeerKharagdakh,
      busadTurul,
      negjUne,
      ognoo,
      suuliinZaalt,
      umnukhZaalt,
    ]
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
    return text;
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
  }, [dun, tailbar, negjUne, nekhemjlekhDeerKharagdakh, busadTurul]);

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
  function suuliinZaaltFn(v) {
    setSuuliinZaalt(v);
    if (umnukhZaalt && umnukhZaalt < v) {
      setDun(v - umnukhZaalt);
    } else setDun(0);
  }

  function umnukhZaaltFn(v) {
    setUmnukhZaalt(v);
    if (suuliinZaalt && suuliinZaalt > v) {
      setDun(suuliinZaalt - v);
    } else setDun(0);
  }

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
          <Radio value={"ashiglalt"}>{t("Ашиглалт")}</Radio>
          <Radio value={"busad"}>{t("Бусад")} </Radio>
        </Radio.Group>
      </div>
      <Divider />
      <label>{t(labelTurul(turul))}</label>
      {turul === "avlaga" && (
        <DatePicker.MonthPicker
          id="dataPicker1"
          locale={i18n.language === "mn" && locale}
          value={ognoo}
          onChange={(v) => {
            setOgnoo(v);
            // document.getElementById("guilgeeDunInputNumber").focus();
          }}
        />
      )}
      {turul === "ashiglalt" && (
        <DatePicker
          id="dataPicker2"
          locale={i18n.language === "mn" && locale}
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
          placeholder={t("Гүйлгээ хийх төрөл")}
          onChange={(v) => {
            setBusadTurul(v);
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
      <div className="flex w-full items-center justify-between">
        {turul === "ashiglalt" && (
          <Select
            style={{ width: "49%" }}
            onChange={(v) => {
              const utga = zardal.jagsaalt.find((a) => a._id === v);
              setNegjUne(utga.tariff || 0);
              setTailbar(utga.ner);
              setKhemjikhNegj(utga.turul);
              setSuuriKhuraamj(Number(utga.suuriKhuraamj));
              setSuuliinZaalt(null);
              if (utga.turul === "кВт" || utga.turul === "1м3") {
                var suuliinGuilgee = guilgeeniiTuukh.filter(
                  (x) => x.khemjikhNegj == utga.turul && x.tailbar == utga.ner
                );
                if (!!suuliinGuilgee && suuliinGuilgee.length > 0)
                  suuliinGuilgee = suuliinGuilgee[suuliinGuilgee.length - 1];
                if (!!suuliinGuilgee?.umnukhZaalt)
                  setUmnukhZaalt(suuliinGuilgee[i].umnukhZaalt);
                else setUmnukhZaalt(0);
              }
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
        {negjUne && turul === "ashiglalt" && (
          <div
            className="flex justify-end p-2 dark:text-gray-100"
            style={{ width: "49%" }}
          >
            {t("Нэгж үнэ")}: {formatNumber(negjUne, 2)}
          </div>
        )}
      </div>
      {khemjikhNegj === "кВт" || khemjikhNegj === "1м3" ? (
        <div className="flex w-full justify-between">
          <div style={{ width: "49%" }}>
            <div>Өмнөх заалт</div>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              placeholder={`Тоолуурын заалт (${khemjikhNegj})`}
              style={{ width: "100%", textAlign: "center" }}
              value={umnukhZaalt}
              onChange={umnukhZaaltFn}
              min={0}
            />
          </div>
          <div style={{ width: "49%" }}>
            <div>Сүүлийн заалт </div>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder={`Тоолуурын заалт (${khemjikhNegj})`}
              style={{ width: "100%", textAlign: "center" }}
              value={suuliinZaalt}
              onChange={suuliinZaaltFn}
              min={0}
            />
          </div>
        </div>
      ) : (
        <InputNumber
          onKeyDown={focuser}
          id="guilgeeDunInputNumber"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          placeholder={t(turul === "ashiglalt" ? "Нэгж" : "Дүн")}
          style={{ width: "100%", textAlign: "center" }}
          value={dun}
          onChange={(v) => setDun(v)}
          min={0}
        />
      )}
      {turul === "ashiglalt" && (
        <div className="flex w-full items-center justify-between">
          <div>Суурь хураамж: {formatNumber(suuriKhuraamj || 0, 2)}</div>
          <div className="p-2 dark:text-gray-100">
            {t("Нийт үнэ")}:{" "}
            {negjUne &&
              formatNumber(negjUne * dun + (suuriKhuraamj || 0) || 0, 2)}
          </div>
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
      {(turul === "avlaga" || turul === "ashiglalt") && (
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
