import {
  InputNumber,
  Modal,
  notification,
  Select,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import _ from "lodash";
import React from "react";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import formatNumber from "../../../tools/function/formatNumber";
import getListMethod from "../../../tools/function/crud/getListMethod";
import uilchilgee, { aldaaBarigch } from "../../../services/uilchilgee";
import moment from "moment";
import { MinusCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { t } from "i18next";

function GereeniiUldegdel({ ugugdul, token, barilgiinId }) {
  const { data } = useSWR(
    !!ugugdul?.gereeniiDugaar && !!barilgiinId
      ? ["/uldegdelBodyo", barilgiinId, ugugdul?.gereeniiDugaar]
      : null,
    (url, barilgiinId, gereeniiDugaar) =>
      uilchilgee(token)
        .post(url, { barilgiinId, gereeniiDugaar })
        .then(({ data }) => data)
        .catch(aldaaBarigch),
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <div
      className={`text-right font-medium ${
        data?.uldegdel > 0 ? "text-red-500" : "text-green-500"
      }`}
    >
      {!data ? <Spin size="small" /> : formatNumber(data?.uldegdel)}
    </div>
  );
}

function GuilgeeKholbokh(
  { data, token, baiguullagiinId, barilgiinId, onFinish, destroy, dans },
  ref
) {
  const [geree, setGeree] = React.useState(null);
  const [olnoorKholbokhEsekh, setOlnoorKholbokhEsekh] = React.useState(false);
  const [khaagdsanGereeEsekh, setKhaagdsanGereeEsekh] = React.useState(false);
  const [magadlaltaiGereenuud, setMagadlaltaiGereenuud] = React.useState([]);
  const [tulult, setTulult] = React.useState([{}]);

  const query = React.useMemo(() => {
    return { tuluv: khaagdsanGereeEsekh ? -1 : { $nin: [-1] }, barilgiinId };
  }, [khaagdsanGereeEsekh]);

  const { gereeniiMedeelel, setGereeniiKhuudaslalt } = useGereeniiJagsaalt(
    token,
    baiguullagiinId,
    undefined,
    query
  );

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        if (
          (olnoorKholbokhEsekh && !tulult.filter((a) => !!a.gereeniiId)) ||
          (!olnoorKholbokhEsekh && !geree)
        ) {
          notification.warning({ message: t("Та гэрээгээ сонгоно уу") });
          return;
        }
        let niitDun = data?.kholbosonDun || 0;
        tulult.forEach((a) => {
          !!a.tulsunDun && (niitDun += a.tulsunDun || 0);
        });
        if (olnoorKholbokhEsekh && niitDun - (data?.kholbosonDun || 0) === 0) {
          notification.warning({
            message: t("Төлөх дүн оруулна уу"),
          });
          return;
        }
        if (niitDun > data[`${dans?.bank === "tdb" ? "Amt" : "amount"}`]) {
          notification.warning({
            message: t(
              "Таны оруулсан дүн гүйлгээний дүнгээс илүү гарсан байна"
            ),
          });
          return;
        }
        if (
          (!!geree || olnoorKholbokhEsekh) &&
          gereeniiMedeelel.jagsaalt.length > 0
        ) {
          var songogdson = gereeniiMedeelel.jagsaalt.find(
            (x) => x._id === geree
          );
          let kholbokhDun =
            data[`${dans?.bank === "tdb" ? "Amt" : "amount"}`] - niitDun;
          if (
            songogdson?.baritsaaAvakhDun > songogdson?.baritsaaniiUldegdel &&
            kholbokhDun > 0
          ) {
            let baritsaaAvakhDun =
              songogdson.baritsaaAvakhDun > kholbokhDun
                ? kholbokhDun
                : songogdson.baritsaaAvakhDun;

            Modal.confirm({
              content: `${formatNumber(
                baritsaaAvakhDun
              )}₮ барьцааг төлбөрт суутгах уу?`,
              okText: t("Тийм"),
              cancelText: t("Үгүй"),
              onOk: () => {
                uilchilgee(token)
                  .post("/baritsaaniiGuilgeeKhiie", {
                    gereeniiId: geree,
                    guilgeeniiId: data._id,
                    orlogo: baritsaaAvakhDun,
                    zarlaga: 0,
                    ognoo: moment(data.tranDate),
                  })
                  .then(({ data }) => {
                    if (data === "Amjilttai") {
                      notification.success({
                        message: t("Амжилттай"),
                      });
                      _.isFunction(onFinish) && onFinish();
                      destroy();
                    }
                  })
                  .catch(aldaaBarigch);
              },
              onCancel: () => {
                Modal.confirm({
                  content: `${data.dansniiDugaar} гүйлгээг холбохдоо итгэлтэй байна уу?`,
                  okText: t("Тийм"),
                  cancelText: t("Үгүй"),
                  onOk: () => {
                    let guilgeenuud = [];
                    if (olnoorKholbokhEsekh)
                      guilgeenuud = tulult.filter((a) => !!a.gereeniiId);
                    else
                      guilgeenuud = [
                        {
                          turul: "bank",
                          tulsunDun:
                            data[`${dans?.bank === "tdb" ? "Amt" : "amount"}`] -
                            (data?.kholbosonDun || 0),
                          ognoo: moment(
                            data[
                              `${dans?.bank === "tdb" ? "TxDt" : "tranDate"}`
                            ]
                          ),
                          guilgeeniiId: data._id,
                          gereeniiId: geree,
                          dansniiDugaar: data.dansniiDugaar,
                          tulsunDans:
                            data[
                              `${
                                dans?.bank === "tdb"
                                  ? "CtAcntOrg"
                                  : "relatedAccount"
                              }`
                            ],
                        },
                      ];
                    uilchilgee(token)
                      .post("/tulultOlnoorKhadgalya", { guilgeenuud })
                      .then(({ data }) => {
                        if (data === "Amjilttai") {
                          notification.success({
                            message: t("Амжилттай"),
                          });
                          _.isFunction(onFinish) && onFinish();
                          destroy();
                        }
                      })
                      .catch(aldaaBarigch);
                  },
                });
              },
            });
          } else {
            Modal.confirm({
              content: `${data.dansniiDugaar} гүйлгээг холбохдоо итгэлтэй байна уу?`,
              okText: t("Тийм"),
              cancelText: t("Үгүй"),
              onOk: () => {
                let guilgeenuud = [];
                if (olnoorKholbokhEsekh)
                  guilgeenuud = tulult.filter((a) => !!a.gereeniiId);
                else
                  guilgeenuud = [
                    {
                      turul: "bank",
                      tulsunDun:
                        data[`${dans?.bank === "tdb" ? "Amt" : "amount"}`] -
                        (data?.kholbosonDun || 0),
                      ognoo: moment(
                        data[`${dans?.bank === "tdb" ? "TxDt" : "tranDate"}`]
                      ),
                      guilgeeniiId: data._id,
                      gereeniiId: geree,
                      dansniiDugaar: data.dansniiDugaar,
                      tulsunDans:
                        data[
                          `${
                            dans?.bank === "tdb"
                              ? "CtAcntOrg"
                              : "relatedAccount"
                          }`
                        ],
                    },
                  ];
                uilchilgee(token)
                  .post("/tulultOlnoorKhadgalya", { guilgeenuud })
                  .then(({ data }) => {
                    if (data === "Amjilttai") {
                      notification.success({
                        message: t("Амжилттай"),
                      });
                      _.isFunction(onFinish) && onFinish();
                      destroy();
                    }
                  })
                  .catch(aldaaBarigch);
              },
            });
          }
        }
      },
    }),
    [geree, tulult, olnoorKholbokhEsekh, gereeniiMedeelel]
  );

  React.useEffect(() => {
    data?.magadlaltaiGereenuud &&
      getListMethod("geree", token, {
        query: { _id: data?.magadlaltaiGereenuud, barilgiinId },
      }).then(({ data }) => {
        setMagadlaltaiGereenuud(data?.jagsaalt);
      });
  }, []);

  function onChange(index, key, v) {
    if (key === "gereeniiId") {
      setTulult((a) => {
        const i = a.indexOf((a) => a.gereeniiId === v);
        if (i === -1 && a.length === index + 1) a.push({});
        _.set(a, `${index}.${key}`, v);
        _.set(a, `${index}.turul`, "bank");
        _.set(
          a,
          `${index}.ognoo`,
          moment(data[`${dans?.bank === "tdb" ? "TxDt" : "tranDate"}`])
        );
        _.set(a, `${index}.guilgeeniiId`, data._id);
        _.set(a, `${index}.dansniiDugaar`, data.dansniiDugaar);
        _.set(
          a,
          `${index}.tulsunDans`,
          data[`${dans?.bank === "tdb" ? "CtAcntOrg" : "relatedAccount"}`]
        );

        return [...a];
      });
    } else
      setTulult((a) => {
        _.set(a, `${index}.${key}`, v);
        return [...a];
      });
  }

  function tooBugluyu(index) {
    setTulult((a) => {
      let sum = 0;
      a.forEach((a, i) => {
        i !== index && !!a.tulsunDun && (sum += a.tulsunDun);
      });
      if (!!data?.kholbosonDun) sum += data?.kholbosonDun;
      _.set(
        a,
        `${index}.tulsunDun`,
        data[`${dans?.bank === "tdb" ? "Amt" : "amount"}`] - sum
      );
      return [...a];
    });
  }

  function murKhasya(index) {
    setTulult((a) => {
      a.splice(index, 1);
      return [...a];
    });
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      {magadlaltaiGereenuud?.length > 0 && (
        <div>
          <div className="py-2 text-lg font-medium">
            {t("Санал болгох гэрээ сонгох")}
          </div>
          <div className="grid grid-cols-12 gap-1 p-2">
            <div className="col-span-2"></div>
            <div className="col-span-3"></div>
            <div className="col-span-2"></div>
            <div className="col-span-1 text-center font-bold">
              {t("Талбай")}
            </div>
            <div className="col-span-2 text-right font-bold">
              {t("Үлдэгдэл")}
            </div>
            <div className="col-span-2 text-right font-bold">
              {t("Барьцаа")}
            </div>
          </div>
          {magadlaltaiGereenuud.map((a, i) => (
            <div
              className={`zoom-in grid grid-cols-12 gap-1 border-b border-l border-r p-2 ${
                i === 0 ? "border-t" : ""
              } ${a?._id === geree ? "bg-green-100" : ""}`}
              key={a?._id}
              onClick={() => setGeree(a?._id)}
            >
              <div className="col-span-2 font-medium">{a?.gereeniiDugaar}</div>
              <div className="col-span-3">{a?.ner}</div>
              <div className="col-span-2 font-medium">{a?.utas}</div>
              <div className="col-span-1 text-center">{a?.talbainDugaar}</div>
              <div className="col-span-2 text-right">
                {formatNumber(a?.uldegdel)}₮
              </div>
              <div className="col-span-2 text-right">
                {a.baritsaaniiUldegdel === 0 ? (
                  <CheckCircleOutlined
                    style={{
                      fontSize: "16px",
                      color: "green",
                      marginRight: "20px",
                    }}
                  />
                ) : (
                  formatNumber(a.baritsaaniiUldegdel)
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-row items-center justify-between">
        <label className="text-lg font-medium">
          {t("Гүйлгээнд талбай холбох")}
        </label>
        <Tooltip title="Олон гэрээнд холбох эсэх?">
          <Switch
            checked={olnoorKholbokhEsekh}
            onChange={setOlnoorKholbokhEsekh}
            title="Олон гэрээнд холбох эсэх?"
          />
        </Tooltip>
      </div>

      {!olnoorKholbokhEsekh && (
        <Select
          placeholder="Талбай"
          onSearch={(search) =>
            setGereeniiKhuudaslalt((a) => ({
              ...a,
              search,
              khuudasniiDugaar: 1,
            }))
          }
          onChange={setGeree}
          filterOption={(o) => o}
          showSearch
        >
          {gereeniiMedeelel?.jagsaalt?.map((mur) => {
            return (
              <Select.Option key={mur._id} value={mur._id}>
                <div className="grid grid-cols-5">
                  <div className="flex flex-row space-x-2">
                    <label>{t("Нэр")}:</label>
                    <div>{mur.ner}</div>
                  </div>
                  <div className="flex flex-row space-x-2">
                    <label>{t("Регистр")}:</label>
                    <div>{mur.register}</div>
                  </div>
                  <div className="flex flex-row space-x-2">
                    <label>{t("Талбай")}:</label>
                    <div>{mur.talbainDugaar}</div>
                  </div>
                  <GereeniiUldegdel
                    ugugdul={mur}
                    token={token}
                    barilgiinId={barilgiinId}
                  />
                  <div className="text-right">
                    {mur.baritsaaniiUldegdel === 0 ? (
                      <CheckCircleOutlined
                        style={{
                          fontSize: "16px",
                          color: "green",
                          marginRight: "20px",
                        }}
                      />
                    ) : (
                      formatNumber(mur.baritsaaniiUldegdel)
                    )}
                  </div>
                </div>
              </Select.Option>
            );
          })}
        </Select>
      )}
      {olnoorKholbokhEsekh && (
        <div className="space-y-1">
          <div className="grid grid-cols-3 font-medium">
            <div className="col-span-2">{t("Гэрээ")}</div>
            <div>{t("Төлөх дүн")}</div>
          </div>
          {tulult?.map((a, i) => (
            <div className="grid grid-cols-3" key={`geree-${i}`}>
              <div className="col-span-2">
                <Select
                  placeholder="Талбай"
                  onSearch={(search) =>
                    setGereeniiKhuudaslalt((a) => ({
                      ...a,
                      search,
                      khuudasniiDugaar: 1,
                    }))
                  }
                  value={a.gereeniiId}
                  onChange={(v) => onChange(i, "gereeniiId", v)}
                  filterOption={(o) => o}
                  style={{ width: "100%" }}
                  showSearch
                >
                  {gereeniiMedeelel?.jagsaalt?.map((mur) => {
                    return (
                      <Select.Option key={mur._id} value={mur._id}>
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-row space-x-2">
                            <label>{t("Талбай")}:</label>
                            <div>{mur.talbainDugaar}</div>
                          </div>
                          <div className="flex flex-row">
                            <div>{formatNumber(mur.uldegdel)}₮</div>
                          </div>
                          <div className="flex flex-row">
                            <div>
                              {mur.baritsaaniiUldegdel === 0 ? (
                                <CheckCircleOutlined
                                  style={{
                                    fontSize: "16px",
                                    color: "green",
                                    marginRight: "20px",
                                  }}
                                />
                              ) : (
                                formatNumber(mur.baritsaaniiUldegdel)
                              )}
                            </div>
                          </div>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
              <div className="flex flex-row space-x-2">
                <InputNumber
                  style={{ width: "100%" }}
                  value={a.tulsunDun || 0}
                  onChange={(v) => onChange(i, "tulsunDun", v)}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  onDoubleClick={() => tooBugluyu(i)}
                />
                <MinusCircleOutlined
                  className={`cursor-pointer rounded-full p-1 `}
                  style={{ display: tulult.length > 1 ? "flex" : "none" }}
                  onClick={() => murKhasya(i)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <label className="text-lg font-medium">{t("Гүйлгээний мэдээлэл")}</label>
      <div className="grid grid-cols-2">
        <div className="space-x-2 p-2">
          <span className="font-medium">{t("Данс")}:</span>
          <span>{data?.dansniiDugaar}</span>
        </div>
        <div className="space-x-2 p-2 text-right">
          <span className="font-medium">{t("Гүйлгээний дүн")}:</span>
          <span>
            {formatNumber(
              data[`${dans?.bank === "tdb" ? "Amt" : "amount"}`],
              2
            )}
            ₮
          </span>
        </div>
        <div className="col-span-2 flex flex-row space-x-2 border-t p-2">
          <div className="font-medium">{t("Тайлбар")}:</div>
          <div>
            {data[`${dans?.bank === "tdb" ? "TxAddInf" : "description"}`]}
          </div>
        </div>
        {!!data?.kholbosonDun && (
          <div className="col-span-2 flex flex-row space-x-2 border-t p-2">
            <div className="font-medium">{t("Холбогдсон дүн")}:</div>
            <div>{formatNumber(data?.kholbosonDun, 2)}</div>
          </div>
        )}
        <div>
          <label className="text-sm font-bold text-gray-600">
            {t("Хаагдсан гэрээ холбох эсэх")}{" "}
          </label>
          <Tooltip title={t("Хаагдсан гэрээ холбох эсэх")}>
            <Switch
              checked={khaagdsanGereeEsekh}
              onChange={(v) => {
                setKhaagdsanGereeEsekh(v);
                setGeree(null);
              }}
              title={t("Хаагдсан гэрээ холбох эсэх")}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeKholbokh);
