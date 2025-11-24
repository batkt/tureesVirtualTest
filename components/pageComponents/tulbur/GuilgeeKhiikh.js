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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";
import formatNumber from "tools/function/formatNumber";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";
import { useGereeGuilgee } from "hooks/useGereeniiJagsaalt";

function GuilgeeKhiikh(
  {
    data,
    token,
    onFinish,
    destroy,
    barilgiinId,
    khadgalyaButtonId,
    date,
    baiguullaga,
  },
  ref
) {
  const [dun, setDun] = useState(0);
  const [ognoo, setOgnoo] = useState(moment().add(1, "month").startOf("month"));
  const [shineOgnoo, setShineOgnoo] = useState(moment());
  const [turul, setTurul] = useState("voucher");
  const [tailbar, setTailbar] = useState("");
  const [negjUne, setNegjUne] = useState(undefined);
  const [tseverUsDun, setTseverUsDun] = useState("");
  const [bokhirUsDun, setBokhirUsDun] = useState("");
  const [usKhalaasniiDun, setUsKhalaasniiDun] = useState("");
  const [tsakhilgaanUrjver, setTsakhilgaanUrjver] = useState("");
  const [togtmolGaz, setTogtmolGaz] = useState("");
  const [bodokhArga, setBodokhArga] = useState("");
  const [umnukhZaalt, setUmnukhZaalt] = useState(0);
  const [guidliinKoep, setGuidliinKoep] = useState(0);
  const [umnukhZaalttaiEsekh, setUmnukhZaalttaiEsekh] = useState(false);
  const [suuliinZaalt, setSuuliinZaalt] = useState(null);
  const [khemjikhNegj, setKhemjikhNegj] = useState("");
  const [suuriKhuraamj, setSuuriKhuraamj] = useState(null);
  const { t, i18n } = useTranslation();
  const [nuatBodokhEsekh, setNuatBodokhEsekh] = useState(true);
  const [ekhniiUldegdelEsekh, setEkhniiUldegdelEsekh] = useState(false);
  const [m2argaarBodokhEsekh, setM2argaarBodokhEsekh] = useState(false);
  const [tureesEkhniiUldegdelEsekh, setTureesEkhniiUldegdelEsekh] =
    React.useState(false);
  const [ashiglaltiinId, setAshiglaltiinId] = React.useState(undefined);
  const [ashiglaltiinNer, setAshiglaltiinNer] = React.useState(undefined);

  const [busadTurul, setBusadTurul] = useState();
  const [zardliinTurul, setZardliinTurul] = useState();
  const [nekhemjlekhDeerKharagdakh, setNekhemjlekhDeerKharagdakh] =
    useState(false);

  const tsakhilgaanKBTST = useMemo(() => {
    return baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
      tailbar?.includes("Цахилгаан")
      ? (suuliinZaalt - umnukhZaalt) * tsakhilgaanUrjver * guidliinKoep
      : 0;
  }, [tsakhilgaanUrjver, guidliinKoep, suuliinZaalt, umnukhZaalt]);

  const chadalDun = useMemo(() => {
    var bichiltKhonog = baiguullaga?.tokhirgoo?.bichiltKhonog || 0;
    var togtmolDun =
      baiguullaga?._id === "679aea9032299b7ba8462a77" ? 11520 : 15500;
    return bichiltKhonog > 0 && tsakhilgaanKBTST > 0
      ? (tsakhilgaanKBTST / bichiltKhonog / 12) * togtmolDun
      : 0;
  }, [tsakhilgaanKBTST, baiguullaga?.tokhirgoo?.bichiltKhonog]);

  const tsekhDun = useMemo(() => {
    return negjUne * tsakhilgaanKBTST;
  }, [negjUne, tsakhilgaanKBTST]);

  const sekhDemjikhTulburDun = useMemo(() => {
    if (baiguullaga?.tokhirgoo?.guidliinKoepEsekh)
      // kaidu
      return (
        (suuliinZaalt - umnukhZaalt) * tsakhilgaanUrjver * guidliinKoep * 23.79
      );
    else return (suuliinZaalt - umnukhZaalt) * tsakhilgaanUrjver * 23.79;
  }, [
    suuliinZaalt,
    umnukhZaalt,
    tsakhilgaanUrjver,
    tsakhilgaanKBTST,
    guidliinKoep,
  ]);

  const niitDun = useMemo(() => {
    return (
      chadalDun +
      tsekhDun +
      (baiguullaga?.tokhirgoo?.sekhDemjikhTulburAvakhEsekh
        ? sekhDemjikhTulburDun
        : 0)
    );
  }, [chadalDun, tsekhDun]);

  const niitDunGaz = useMemo(() => {
    return (suuliinZaalt - umnukhZaalt) * togtmolGaz * negjUne;
  }, [suuliinZaalt, umnukhZaalt]);

  const query = useMemo(
    () => ({
      ner: data?.zardluud && { $in: data.zardluud.map((a) => a.ner) },
      turul: { $in: ["кВт", "1м3", "1м2", "кг"] },
      barilgiinId,
    }),
    [data, barilgiinId]
  );
  const queryZardal = useMemo(
    () => ({
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

  const zardalAll = useJagsaalt(
    "/ashiglaltiinZardluud",
    queryZardal,
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
        if (
          turul === "avlaga" &&
          busadTurul === "ashiglalt" &&
          !tureesEkhniiUldegdelEsekh &&
          !ashiglaltiinId
        ) {
          notification.warning({
            message: "Алдаа",
            description: "Ашиглалтын зардлыг сонгоно уу.",
          });
          return;
        }
        if (!dun && !suuriKhuraamj) {
          notification.warning({ message: t("Та дүн оруулна уу") });
          return;
        }
        if (!ognoo) {
          notification.warning({ message: t("Огноо сонгоно уу") });
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
              ognoo: shineOgnoo,
              gereeniiId: data?._id,
              tailbar,
              aldangiinTurul:
                busadTurul === "aldangi" ? "aldangiTulult" : undefined,
            };
            break;
          case "voucher":
            guilgee = {
              turul: turul,
              tulsunDun: dun,
              tulukhDun: 0,
              ognoo: ognoo,
              gereeniiId: data?._id,
              tailbar,
              nekhemjlekhDeerKharagdakh: false,
              ekhniiUldegdelEsekh: false,
            };
            break;
          case "avlaga":
            if (tureesEkhniiUldegdelEsekh) {
              guilgee = {
                turul: "khuvaari",
                undsenDun: dun,
                tulukhDun: dun,
                ognoo: ognoo,
                khyamdral: 0,
                gereeniiId: data?._id,
                tailbar,
                nekhemjlekhDeerKharagdakh:
                  turul === "avlaga" ? nekhemjlekhDeerKharagdakh : false,
                ekhniiUldegdelEsekh:
                  turul === "avlaga" ? ekhniiUldegdelEsekh : false,
                zardliinTurul: turul === "avlaga" ? "turees" : undefined,
              };
            } else {
              guilgee = {
                turul: turul,
                tulsunDun: turul === "voucher" ? dun : 0,
                tulukhDun: turul === "avlaga" ? dun : 0,
                ognoo: turul === "avlaga" ? ognoo : new Date(),
                gereeniiId: data?._id,
                tailbar,
                tariff: negjUne,
                nekhemjlekhDeerKharagdakh:
                  turul === "avlaga" ? nekhemjlekhDeerKharagdakh : false,
                ekhniiUldegdelEsekh:
                  turul === "avlaga" ? ekhniiUldegdelEsekh : false,
                zardliinTurul: turul === "avlaga" ? zardliinTurul : undefined,
                zardliinId: turul === "avlaga" ? ashiglaltiinId : undefined,
                zardliinNer: turul === "avlaga" ? ashiglaltiinNer : undefined,
              };
            }
            break;
          case "torguuli":
            guilgee = {
              nuatBodokhEsekh,
              gereeniiId: data?._id,
              turul: turul,
              tulsunDun: 0,
              tulukhDun: dun,
              tulukhNUAT: nuatBodokhEsekh ? Math.abs(dun / 1.1 / 10) : 0,
              tulukhNuatgui: nuatBodokhEsekh
                ? dun - Math.abs(dun / 1.1 / 10)
                : 0,
              ognoo: ognoo,
              tailbar,
              nekhemjlekhDeerKharagdakh: nekhemjlekhDeerKharagdakh,
            };
            break;
          case "ashiglalt":
            {
              if (
                (khemjikhNegj === "кВт" ||
                  khemjikhNegj === "1м3" ||
                  khemjikhNegj === "кг") &&
                umnukhZaalt > suuliinZaalt
              ) {
                notification.warning({
                  message: t("Сүүлийн заалт өмнөх заалтаас их байх ёстой."),
                });
                return;
              }
              if (
                (khemjikhNegj === "кВт" ||
                  khemjikhNegj === "1м3" ||
                  khemjikhNegj === "кг") &&
                ognoo > new Date()
              ) {
                notification.warning({
                  message: t("Ирээдүйн огноогоор заалт оруулах боломжгүй!"),
                });
                return;
              }
              var tempDun = m2argaarBodokhEsekh
                ? dun * data?.talbainKhemjee
                : (tailbar?.includes("Хүйтэн ус") ||
                    tailbar?.includes("Халуун ус")) &&
                  bodokhArga === "Khatuu"
                ? tseverUsDun * dun +
                  bokhirUsDun * dun +
                  (tailbar?.includes("Халуун ус") ? usKhalaasniiDun * dun : 0)
                : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                  tailbar?.includes("Цахилгаан")
                ? niitDun
                : khemjikhNegj === "кг"
                ? niitDunGaz
                : negjUne * (tsakhilgaanUrjver || 1) * (dun || 0);
              guilgee = {
                turul: "avlaga",
                tulsunDun: 0,
                tulukhDun: nuatBodokhEsekh
                  ? (suuriKhuraamj + tempDun) * 1.1
                  : suuriKhuraamj + tempDun,
                negj: dun && dun,
                khemjikhNegj: khemjikhNegj,
                tariff: negjUne,
                tseverUsDun: tseverUsDun * dun,
                bokhirUsDun: bokhirUsDun * dun,
                usKhalaasanDun: tailbar?.includes("Халуун ус")
                  ? usKhalaasniiDun * dun
                  : 0,
                suuriKhuraamj: suuriKhuraamj,
                tsakhilgaanUrjver: tsakhilgaanUrjver,
                ognoo: moment(ognoo).format("YYYY-MM-DD 00:00:00"),
                gereeniiId: data?._id,
                tailbar,
                nekhemjlekhDeerKharagdakh,
                nuatBodokhEsekh,
                tsakhilgaanKBTST:
                  baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                  tailbar?.includes("Цахилгаан")
                    ? tsakhilgaanKBTST
                    : 0,
                guidliinKoep:
                  baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                  tailbar?.includes("Цахилгаан")
                    ? guidliinKoep
                    : 0,
                bichiltKhonog:
                  baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                  tailbar?.includes("Цахилгаан")
                    ? baiguullaga?.tokhirgoo?.bichiltKhonog || 0
                    : 0,
                tsekhDun:
                  baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                  tailbar?.includes("Цахилгаан")
                    ? tsekhDun
                    : 0,
                chadalDun:
                  baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                  tailbar?.includes("Цахилгаан")
                    ? chadalDun
                    : 0,
                sekhDemjikhTulburDun:
                  baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                  tailbar?.includes("Цахилгаан")
                    ? sekhDemjikhTulburDun
                    : 0,
                togtmolUtga: khemjikhNegj === "кг" ? togtmolGaz : 0,
              };
              if (
                khemjikhNegj === "кВт" ||
                khemjikhNegj === "1м3" ||
                khemjikhNegj === "кг"
              ) {
                guilgee["suuliinZaalt"] = suuliinZaalt;
                guilgee["umnukhZaalt"] = umnukhZaalt;
              }
            }
            break;
          default:
            break;
        }
        const saveButton = document.getElementById(khadgalyaButtonId);
        saveButton?.setAttribute("disabled", true);
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
          .catch((error) => {
            saveButton?.removeAttribute("disabled");
            aldaaBarigch(error);
          });
      },
    }),
    [
      dun,
      turul,
      tailbar,
      nekhemjlekhDeerKharagdakh,
      ekhniiUldegdelEsekh,
      zardliinTurul,
      busadTurul,
      negjUne,
      ognoo,
      suuliinZaalt,
      umnukhZaalt,
      nuatBodokhEsekh,
      guidliinKoep,
      tsakhilgaanKBTST,
      niitDun,
      tsekhDun,
      chadalDun,
      tureesEkhniiUldegdelEsekh,
      ashiglaltiinId,
      ashiglaltiinNer,
      niitDunGaz,
      togtmolGaz,
      khadgalyaButtonId,
    ]
  );

  const ankhniiUtga = useRef({
    dun,
    tailbar,
    negjUne,
    nekhemjlekhDeerKharagdakh,
    busadTurul,
  });

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
    const uurchlugdsunUtga =
      dun !== ankhniiUtga.current.dun ||
      tailbar !== ankhniiUtga.current.tailbar ||
      negjUne !== ankhniiUtga.current.negjUne ||
      nekhemjlekhDeerKharagdakh !==
        ankhniiUtga.current.nekhemjlekhDeerKharagdakh ||
      busadTurul !== ankhniiUtga.current.busadTurul;

    if (uurchlugdsunUtga) {
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    } else {
      destroy();
    }
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
    if ((umnukhZaalt || umnukhZaalt == 0) && umnukhZaalt < v) {
      setDun(v - umnukhZaalt);
    } else setDun(0);
  }

  function umnukhZaaltFn(v) {
    setUmnukhZaalt(v);
    if (suuliinZaalt && suuliinZaalt > v) {
      setDun(suuliinZaalt - v);
    } else setDun(0);
  }

  function handleTurulUurchlult(e) {
    const ankhanOgnoo = ognoo;
    setTurul(e.target.value);
    setTureesEkhniiUldegdelEsekh(false);

    if (e.target.value === "ashiglalt" || e.target.value === "torguuli") {
      setOgnoo(moment());
    } else {
      setOgnoo(ankhanOgnoo);
    }
  }

  function changedArgaar(e) {
    if (e) setDun(negjUne);
    else {
      umnukhZaaltFn(umnukhZaalt);
      suuliinZaaltFn(suuliinZaalt);
    }
    setM2argaarBodokhEsekh(e);
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex w-full pb-4 ">
        <Radio.Group
          onChange={(e) => {
            handleTurulUurchlult(e);
            setDun(0);
            setTailbar("");
          }}
          value={turul}
          className="flex w-full flex-wrap items-center gap-4"
        >
          <Radio value={"voucher"}>{t("Ваучераар")}</Radio>
          <Radio value={"avlaga"}>{t("Авлага")}</Radio>
          <Radio value={"torguuli"}>{t("Торгууль")}</Radio>
          <Radio value={"ashiglalt"}>{t("Ашиглалт")}</Radio>
          <Radio value={"busad"}>{t("Бусад")} </Radio>
        </Radio.Group>
      </div>
      <Divider />
      <label>{t(labelTurul(turul))}</label>
      {turul === "voucher" && (
        <div className="flex w-full items-center justify-between gap-2">
          <DatePicker
            id="dataPicker1"
            locale={i18n.language === "mn" && locale}
            value={ognoo}
            onChange={(v) => {
              setOgnoo(v);
            }}
          />
        </div>
      )}
      {turul === "torguuli" && (
        <div className="flex w-full items-center justify-between gap-2">
          <DatePicker
            id="dataPicker1"
            locale={i18n.language === "mn" && locale}
            value={ognoo}
            onChange={(v) => {
              setOgnoo(v);
            }}
          />
        </div>
      )}
      {turul === "avlaga" && (
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-center gap-2">
            <DatePicker
              className="flex-1"
              id="dataPicker1"
              locale={i18n.language === "mn" && locale}
              value={ognoo}
              onChange={(v) => setOgnoo(v)}
            />

            <Select
              id="select"
              placeholder={t("Гүйлгээ хийх төрөл")}
              defaultValue={"avlaga"}
              onChange={(v) => {
                setBusadTurul(v);
                if (v === "ashiglalt") {
                  setZardliinTurul(undefined);
                  setTureesEkhniiUldegdelEsekh(false);
                } else if (v === "turees") {
                  setTureesEkhniiUldegdelEsekh(true);
                  setZardliinTurul(undefined);
                } else {
                  setTureesEkhniiUldegdelEsekh(false);
                  setZardliinTurul(undefined);
                }
              }}
              className="flex-1"
            >
              <Option value="avlaga">{t("Авлага")}</Option>
              <Option value="turees">{t("Түрээс")}</Option>
              <Option value="ashiglalt">{t("Ашиглалтын зардал")}</Option>
            </Select>
          </div>

          {busadTurul === "ashiglalt" && (
            <>
              {!tureesEkhniiUldegdelEsekh && (
                <Select
                  placeholder={t("Ашиглалтын зардал")}
                  onChange={(v) => {
                    const tukhainZardal = zardalAll.jagsaalt.find(
                      (a) => a._id === v
                    );
                    var tempTurul = tukhainZardal?.ner?.includes(
                      "Менежментийн төлбөр"
                    )
                      ? "management"
                      : tukhainZardal?.ner === "Дулаан"
                      ? "dulaan"
                      : tukhainZardal?.ner?.includes("Цахилгаан")
                      ? "tsakhilgaan"
                      : tukhainZardal?.ner?.includes("Халуун ус")
                      ? "khulaanUs"
                      : tukhainZardal?.ner === "Ус"
                      ? "us"
                      : tukhainZardal?.ner?.includes("Хүйтэн ус")
                      ? "khuitenUs"
                      : tukhainZardal?.ner?.includes("Хөрөнгийн менежмент") ||
                        tukhainZardal?.ner?.includes("Худалдааны менежмент")
                      ? "managementGoto"
                      : "busad";
                    setAshiglaltiinId(v);
                    setNegjUne(tukhainZardal.tariff);
                    setAshiglaltiinNer(tukhainZardal.ner);
                    setZardliinTurul(tempTurul);
                  }}
                  className="w-full"
                >
                  {zardalAll?.jagsaalt?.map((a) => (
                    <Select.Option key={a._id} value={a._id}>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-1">
                        <p className="min-w-[120px] max-w-[200px] truncate border-r bg-green-400 bg-opacity-10 px-2 text-left">
                          {a.ner}
                        </p>
                        <div className="flex flex-1 justify-between gap-2 bg-blue-600 bg-opacity-5 px-2">
                          <p className="text-right">{t(a.turul)}</p>
                          <p className="whitespace-nowrap text-right">
                            {a.turul !== "Дурын" ? `${a.tariff}₮` : "Дурын"}
                          </p>
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              )}
            </>
          )}
        </div>
      )}

      {turul === "ashiglalt" && (
        <div className="flex w-full items-center justify-between gap-2">
          <DatePicker
            className="w-full"
            id="dataPicker2"
            locale={i18n.language === "mn" && locale}
            value={ognoo}
            onChange={(v) => {
              setOgnoo(v);
              document.getElementById("select2").focus();
            }}
          />
          <div className="bflex w-full flex-row justify-between">
            <div />
            <div className="flex justify-end space-x-2">
              <label>
                {data.talbainKhemjee} {t("м² аргаар бодох эсэх")}
              </label>

              <Switch
                checked={m2argaarBodokhEsekh}
                onChange={(e) => changedArgaar(e)}
              />
            </div>
          </div>
        </div>
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
          <Option value="aldangi">{t("Алданги төлөлт")}</Option>
          <Option value="tulultBurtgekh">{t("Төлөлт бүртгэх")}</Option>
        </Select>
      )}
      {busadTurul === "aldangi" && (
        <div className="dark:text-white">
          {t("Алдангийн үлдэгдэл")}: {formatNumber(data?.aldangiinUldegdel, 2)}
        </div>
      )}
      {busadTurul === "tulultBurtgekh" && (
        <DatePicker
          locale={i18n.language === "mn" && locale}
          value={shineOgnoo}
          onChange={(v) => setShineOgnoo(v ? v.startOf("day") : null)}
        />
      )}
      {busadTurul === "aldangi" && (
        <DatePicker
          locale={i18n.language === "mn" && locale}
          value={shineOgnoo}
          onChange={(v) => setShineOgnoo(v ? v.startOf("day") : null)}
        />
      )}
      {busadTurul === "barter" && (
        <DatePicker
          locale={i18n.language === "mn" && locale}
          value={shineOgnoo}
          onChange={(v) => setShineOgnoo(v ? v.startOf("day") : null)}
        />
      )}

      {busadTurul === "zalruulga" && (
        <DatePicker
          locale={i18n.language === "mn" && locale}
          value={shineOgnoo}
          onChange={(v) => setShineOgnoo(v ? v.startOf("day") : null)}
        />
      )}
      <div className="flex w-full items-center justify-between">
        {turul === "ashiglalt" && (
          <Select
            style={{ width: "85%" }}
            onChange={(v) => {
              const utga = zardal.jagsaalt.find((a) => a._id === v);
              setBodokhArga(utga.bodokhArga);
              setTsakhilgaanUrjver(
                utga.ner?.includes("Цахилгаан")
                  ? utga.tsakhilgaanUrjver || 1
                  : 1
              );
              setTogtmolGaz(utga.togtmolUtga || 0);
              setNegjUne(utga.tariff || 0);
              setTseverUsDun(utga.tseverUsDun || 0);
              setBokhirUsDun(utga.bokhirUsDun || 0);
              setUsKhalaasniiDun(utga.usKhalaasniiDun || 0);
              setTailbar(utga.ner);
              setKhemjikhNegj(utga.turul);
              setSuuriKhuraamj(Number(utga.suuriKhuraamj || 0));
              setSuuliinZaalt(null);
              setDun(0);
              if (
                utga.turul === "кВт" ||
                utga.turul === "1м3" ||
                utga.turul === "кг"
              ) {
                var suuliinGuilgee = guilgeeniiTuukh.filter(
                  (x) => x.khemjikhNegj == utga.turul && x.tailbar == utga.ner
                );
                if (!!suuliinGuilgee && suuliinGuilgee.length > 0)
                  suuliinGuilgee = suuliinGuilgee[suuliinGuilgee.length - 1];
                if (!!suuliinGuilgee?.suuliinZaalt) {
                  setUmnukhZaalt(suuliinGuilgee.suuliinZaalt);
                  setUmnukhZaalttaiEsekh(true);
                } else {
                  setUmnukhZaalt(0);
                  setUmnukhZaalttaiEsekh(false);
                }
              }
            }}
            id="select2"
            placeholder={t("Зардлын төрөл")}
          >
            {zardal.jagsaalt?.map((mur) => (
              // mur.turul !== "1м2" ? (
              <Select.Option key={mur._id} value={mur._id}>
                <div className="flex w-full justify-between border-b">
                  <p className="flex border-r bg-green-400 bg-opacity-10 pl-2 pr-2 text-left">
                    {mur.ner}
                  </p>
                  <div className="flex w-full justify-between bg-blue-600 bg-opacity-5 pl-2 pr-2">
                    <p className={`mr-5 border-r text-right`}>{t(mur.turul)}</p>
                    <p className="text-right">
                      {mur.turul !== "Дурын"
                        ? formatNumber(mur.tariff)
                        : "Дурын"}
                      {mur.turul !== "Дурын" && "₮"}
                    </p>
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        )}
        {negjUne > 0 && turul === "ashiglalt" && (
          <div
            className="flex justify-end p-2 dark:text-gray-100"
            style={{ width: "49%" }}
          >
            {t("Нэгж үнэ ")}: {formatNumber(negjUne, 2)}
          </div>
        )}
        {!m2argaarBodokhEsekh &&
          tseverUsDun > 0 &&
          (tailbar?.includes("Хүйтэн ус") || tailbar?.includes("Халуун ус")) &&
          bodokhArga === "Khatuu" && (
            <div
              className="flex justify-end p-2 dark:text-gray-100"
              style={{ width: "49%" }}
            >
              {t("Цэвэр ус")}: {formatNumber(tseverUsDun, 2)}
            </div>
          )}
        {!m2argaarBodokhEsekh &&
          bokhirUsDun > 0 &&
          (tailbar?.includes("Хүйтэн ус") || tailbar?.includes("Халуун ус")) &&
          bodokhArga === "Khatuu" && (
            <div
              className="flex justify-end p-2 dark:text-gray-100"
              style={{ width: "49%" }}
            >
              {t("Бохир ус")}: {formatNumber(bokhirUsDun, 2)}
            </div>
          )}
        {!m2argaarBodokhEsekh &&
          usKhalaasniiDun > 0 &&
          tailbar?.includes("Халуун ус") &&
          bodokhArga === "Khatuu" && (
            <div
              className="flex justify-end p-2 dark:text-gray-100"
              style={{ width: "49%" }}
            >
              {t("Ус халаасан")}: {formatNumber(usKhalaasniiDun, 2)}
            </div>
          )}
      </div>
      {turul === "ashiglalt" &&
      !m2argaarBodokhEsekh &&
      (khemjikhNegj === "кВт" ||
        khemjikhNegj === "1м3" ||
        khemjikhNegj === "кг") ? (
        <div className="flex w-full justify-between dark:text-[#E5E7EB]">
          <div style={{ width: "49%" }}>
            <div className="dark:text-white">Өмнөх заалт</div>
            <InputNumber
              disabled={umnukhZaalttaiEsekh}
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
            <div className="dark:text-white">Сүүлийн заалт </div>
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
        />
      )}
      {turul === "ashiglalt" &&
        tailbar?.includes("Цахилгаан") &&
        baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && (
          <div className="flex  w-full items-start justify-between dark:text-[#E5E7EB]">
            <div style={{ width: "34%" }}>
              <div>Гүйдлийн коэффициент </div>
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                style={{ width: "100%", textAlign: "center" }}
                value={guidliinKoep}
                onChange={(v) => {
                  setGuidliinKoep(v);
                }}
                min={0}
              />
            </div>
            <div style={{ width: "34%" }}>
              <div>Бичилтийн хоног {baiguullaga?.tokhirgoo?.bichiltKhonog}</div>
            </div>
            <div style={{ width: "30%" }}>
              <div className="flex justify-end">
                Хэрэглээ/кВт.ц/ {formatNumber(tsakhilgaanKBTST || 0)}
              </div>
            </div>
          </div>
        )}
      {turul === "ashiglalt" &&
        tailbar?.includes("Цахилгаан") &&
        baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && (
          <div className="flex w-full items-start justify-between dark:text-[#E5E7EB]">
            <div style={{ width: "48%" }}>
              <div className="flex justify-start">
                ЦЭХ төлбөр/төг/ {formatNumber(tsekhDun || 0)}
              </div>
            </div>
            <div style={{ width: "48%" }}>
              <div className="flex justify-end">
                Чадлын төлбөр/төг/ {formatNumber(chadalDun || 0)}
              </div>
            </div>
          </div>
        )}
      {turul === "ashiglalt" &&
        tailbar?.includes("Цахилгаан") &&
        baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
        baiguullaga?.tokhirgoo?.sekhDemjikhTulburAvakhEsekh && (
          <div className="flex w-full items-start justify-between dark:text-[#E5E7EB]">
            <div style={{ width: "48%" }}>
              <div className="flex justify-start">
                Сэх дэмжих төлбөр {formatNumber(sekhDemjikhTulburDun || 0)}
              </div>
            </div>
          </div>
        )}
      {turul === "ashiglalt" && (
        <div className="flex w-full items-start justify-between dark:text-[#E5E7EB]">
          <div>
            {t("Суурь хураамж")}: {formatNumber(suuriKhuraamj || 0, 2)}
          </div>
          {tailbar?.includes("Цахилгаан") ? (
            <div>КВЦТ: {formatNumber(tsakhilgaanUrjver || 1, 4)}</div>
          ) : (
            ""
          )}
          {khemjikhNegj === "кг" ? (
            <div>Тогтмол: {formatNumber(togtmolGaz || 0, 4)}</div>
          ) : (
            ""
          )}
          <div
            className={`${nuatBodokhEsekh ? "p-0" : "p-2"}dark:text-gray-100`}
          >
            {nuatBodokhEsekh && negjUne > 0 && (
              <div className="flex w-full flex-col items-start justify-center gap-2 border-b border-dashed dark:text-[#E5E7EB]">
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="dark:text-white">Бодсон үнэ: </div>
                  <div className="dark:text-white">
                    {formatNumber(
                      (m2argaarBodokhEsekh
                        ? dun * data?.talbainKhemjee
                        : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                          tailbar?.includes("Цахилгаан")
                        ? niitDun
                        : khemjikhNegj === "кг"
                        ? niitDunGaz
                        : negjUne * dun * tsakhilgaanUrjver) +
                        (suuriKhuraamj || 0) || 0,
                      2
                    )}
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="dark:text-white">НӨАТ:</div>
                  <div className="dark:text-white">
                    {formatNumber(
                      ((m2argaarBodokhEsekh
                        ? dun * data?.talbainKhemjee
                        : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                          tailbar?.includes("Цахилгаан")
                        ? niitDun
                        : khemjikhNegj === "кг"
                        ? niitDunGaz
                        : negjUne * dun * tsakhilgaanUrjver) +
                        (suuriKhuraamj || 0) || 0) / 10
                    )}
                  </div>
                </div>
              </div>
            )}
            {negjUne > 0 && !nuatBodokhEsekh && (
              <div className="flex w-full items-center justify-between gap-2">
                <div className="dark:text-white">{t("Нийт үнэ")}:</div>
                <div className="dark:text-white">
                  {formatNumber(
                    (m2argaarBodokhEsekh
                      ? dun * data?.talbainKhemjee
                      : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                        tailbar?.includes("Цахилгаан")
                      ? niitDun
                      : khemjikhNegj === "кг"
                      ? niitDunGaz
                      : negjUne * dun * tsakhilgaanUrjver) +
                      (suuriKhuraamj || 0) || 0,
                    2
                  )}
                </div>
              </div>
            )}
            {negjUne > 0 && nuatBodokhEsekh && (
              <div className="flex w-full items-center justify-between gap-2">
                <div className="dark:text-white">{t("Нийт үнэ")}:</div>
                <div className="dark:text-white">
                  {formatNumber(
                    ((m2argaarBodokhEsekh
                      ? dun * data?.talbainKhemjee
                      : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh &&
                        tailbar?.includes("Цахилгаан")
                      ? niitDun
                      : khemjikhNegj === "кг"
                      ? niitDunGaz
                      : negjUne * dun * tsakhilgaanUrjver) +
                      (suuriKhuraamj || 0) || 0) * 1.1
                  )}
                </div>
              </div>
            )}

            {!m2argaarBodokhEsekh &&
              nuatBodokhEsekh &&
              (tailbar?.includes("Хүйтэн ус") ||
                tailbar?.includes("Халуун ус")) &&
              bodokhArga === "Khatuu" && (
                <div className="flex w-full flex-col items-start justify-center gap-2 border-b border-dashed">
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="dark:text-white">Цэвэр усны дүн: </div>
                    <div className="dark:text-white">
                      {formatNumber(tseverUsDun * dun || 0, 2)}
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="dark:text-white">Бохир усны дүн: </div>
                    <div className="dark:text-white">
                      {formatNumber(bokhirUsDun * dun || 0, 2)}
                    </div>
                  </div>
                  {tailbar?.includes("Халуун ус") ? (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="dark:text-white">Ус халаасны дүн: </div>
                      <div className="dark:text-white">
                        {formatNumber(usKhalaasniiDun * dun || 0, 2)}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="dark:text-white">НӨАТ:</div>
                    <div className="dark:text-white">
                      {formatNumber(
                        (tseverUsDun * dun +
                          bokhirUsDun * dun +
                          (tailbar?.includes("Халуун ус")
                            ? usKhalaasniiDun * dun
                            : 0) +
                          (suuriKhuraamj || 0) || 0) / 10
                      )}
                    </div>
                  </div>
                </div>
              )}
            {!m2argaarBodokhEsekh &&
              (tailbar?.includes("Хүйтэн ус") ||
                tailbar?.includes("Халуун ус")) &&
              bodokhArga === "Khatuu" &&
              !nuatBodokhEsekh && (
                <div className="flex w-full items-center justify-between gap-2">
                  <div>{t("Нөатгүй дүн")}:</div>
                  <div>
                    {formatNumber(
                      tseverUsDun * dun +
                        bokhirUsDun * dun +
                        (tailbar?.includes("Халуун ус")
                          ? usKhalaasniiDun * dun
                          : 0) +
                        (suuriKhuraamj || 0) || 0,
                      2
                    )}
                  </div>
                </div>
              )}
            {!m2argaarBodokhEsekh &&
              (tailbar?.includes("Хүйтэн ус") ||
                tailbar?.includes("Халуун ус")) &&
              bodokhArga === "Khatuu" &&
              nuatBodokhEsekh && (
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="dark:text-white">Нийт дүн: </div>
                  <div className="dark:text-white">
                    {formatNumber(
                      (tseverUsDun * dun +
                        bokhirUsDun * dun +
                        (tailbar?.includes("Халуун ус")
                          ? usKhalaasniiDun * dun
                          : 0) +
                        (suuriKhuraamj || 0) || 0) * 1.1
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
      {(turul === "avlaga" || turul === "busad" || turul === "torguuli") && (
        <Input.TextArea
          onKeyDown={focuser}
          id="textArea"
          placeholder={t("Тайлбар")}
          value={tailbar}
          onChange={(e) => setTailbar(e.target.value)}
        />
      )}
      {turul === "avlaga" && (
        <div className="flex flex-row justify-between">
          <div />
          <div className="space-x-2">
            <label>{t("Эхний үлдэгдэл эсэх")}:</label>
            <Switch
              checked={ekhniiUldegdelEsekh}
              onChange={setEkhniiUldegdelEsekh}
            />
          </div>
        </div>
      )}
      {(turul === "avlaga" ||
        turul === "ashiglalt" ||
        turul === "torguuli") && (
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
      {turul === "ashiglalt" ||
        (turul === "torguuli" && (
          <div className="flex flex-row justify-between">
            <div />
            <div className="space-x-2">
              <label>{t("НӨАТ бодох эсэх")}:</label>
              <Switch checked={nuatBodokhEsekh} onChange={setNuatBodokhEsekh} />
            </div>
          </div>
        ))}
    </div>
  );
}

export default React.forwardRef(GuilgeeKhiikh);
