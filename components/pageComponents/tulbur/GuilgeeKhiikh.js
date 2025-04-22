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

function GuilgeeKhiikh(
  { data, token, onFinish, destroy, barilgiinId, khadgalyaButtonId, date, baiguullaga },
  ref
) {
  const [dun, setDun] = useState(0);
  const [ognoo, setOgnoo] = useState(moment().add(1, "month").startOf("month"));
  const [shineOgnoo, setShineOgnoo] = useState(moment());
  const [turul, setTurul] = useState("voucher");
  const [tailbar, setTailbar] = useState("");
  const [negjUne, setNegjUne] = useState("");
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
  const [tureesEkhniiUldegdelEsekh, setTureesEkhniiUldegdelEsekh] = React.useState(true);
  const [ashiglaltiinId, setAshiglaltiinId] = React.useState(null);
  const [ashiglaltiinNer, setAshiglaltiinNer] = React.useState(null);

  const [busadTurul, setBusadTurul] = useState();
  const [zardliinTurul, setZardliinTurul] = useState();
  const [nekhemjlekhDeerKharagdakh, setNekhemjlekhDeerKharagdakh] =
    useState(false);

  const tsakhilgaanKBTST = useMemo(() => {
    return baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? (suuliinZaalt - umnukhZaalt) * tsakhilgaanUrjver * guidliinKoep : 0;
  }, [tsakhilgaanUrjver, guidliinKoep, suuliinZaalt, umnukhZaalt]);

  const chadalDun = useMemo(() => {
    var bichiltKhonog = baiguullaga?.tokhirgoo?.bichiltKhonog || 0;
    var togtmolDun = baiguullaga?._id === "679aea9032299b7ba8462a77" ? 11520 : 15500;
    return bichiltKhonog > 0 && tsakhilgaanKBTST > 0 ? (tsakhilgaanKBTST/bichiltKhonog/12 * togtmolDun) : 0;
  }, [tsakhilgaanKBTST, baiguullaga?.tokhirgoo?.bichiltKhonog]);

  const tsekhDun = useMemo(() => {
    return negjUne * tsakhilgaanKBTST;
  }, [negjUne, tsakhilgaanKBTST]);

  const sekhDemjikhTulburDun = useMemo(() => {
    return (suuliinZaalt - umnukhZaalt) * tsakhilgaanUrjver * 23.79;
  }, [suuliinZaalt, umnukhZaalt, tsakhilgaanUrjver]);
    
  const niitDun = useMemo(() => {
    return chadalDun + tsekhDun + (baiguullaga?.tokhirgoo?.sekhDemjikhTulburAvakhEsekh ? sekhDemjikhTulburDun : 0);
  }, [chadalDun, tsekhDun]);

  const niitDunGaz = useMemo(() => {
    return (suuliinZaalt - umnukhZaalt) * togtmolGaz * negjUne;
  }, [suuliinZaalt, umnukhZaalt]);

  const query = useMemo(
    () => ({
      ner: data?.zardluud && { $in: data.zardluud.map((a) => a.ner) },
      turul: { $in: ["кВт", "1м3", "1м2", "кг"] },
      // tariff: { $exists: true },
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
            };
            break;
          case "voucher":
            guilgee = {
              turul: turul,
              tulsunDun: dun,
              tulukhDun: 0,
              ognoo: new Date(),
              gereeniiId: data?._id,
              tailbar,
              nekhemjlekhDeerKharagdakh: false,
              ekhniiUldegdelEsekh: false,
            };
            break;
          case "avlaga":
            if(tureesEkhniiUldegdelEsekh)
            {
              guilgee = {
                turul: 'khuvaari',
                undsenDun: dun,
                tulukhDun: dun,
                ognoo: ognoo,
                khyamdral: 0,
                gereeniiId: data?._id,
                tailbar,
                nekhemjlekhDeerKharagdakh: turul === "avlaga" ? nekhemjlekhDeerKharagdakh : false,
                ekhniiUldegdelEsekh: turul === "avlaga" ? ekhniiUldegdelEsekh : false,
                zardliinTurul: turul === "avlaga" ? "turees" : undefined,
              };
            }
            else
            {
              guilgee = {
                turul: turul,
                tulsunDun: turul === "voucher" ? dun : 0,
                tulukhDun: turul === "avlaga" ? dun : 0,
                ognoo: turul === "avlaga" ? ognoo : new Date(),
                gereeniiId: data?._id,
                tailbar,
                nekhemjlekhDeerKharagdakh: turul === "avlaga" ? nekhemjlekhDeerKharagdakh : false,
                ekhniiUldegdelEsekh: turul === "avlaga" ? ekhniiUldegdelEsekh : false,
                zardliinTurul: turul === "avlaga" ? zardliinTurul : undefined,
                zardliinId: turul === "avlaga" ? ashiglaltiinId : undefined,
                zardliinNer: turul === "avlaga" ? ashiglaltiinNer : undefined,
              };
            }
            break;
          case "ashiglalt":
            {
              if (
                (khemjikhNegj === "кВт" || khemjikhNegj === "1м3" || khemjikhNegj === "кг") &&
                umnukhZaalt > suuliinZaalt
              ) {
                notification.warning({
                  message: t("Сүүлийн заалт өмнөх заалтаас их байх ёстой."),
                });
                return;
              }
              if (
                (khemjikhNegj === "кВт" || khemjikhNegj === "1м3" || khemjikhNegj === "кг") &&
                ognoo > new Date()
              ) {
                notification.warning({
                  message: t("Ирээдүйн огноогоор заалт оруулах боломжгүй!"),
                });
                return;
              }
              var tempDun = m2argaarBodokhEsekh ? dun * data?.talbainKhemjee  : ((tailbar === "Хүйтэн ус" || tailbar === "Халуун ус") && bodokhArga === "Khatuu" ? (tseverUsDun * dun + bokhirUsDun * dun + (tailbar === "Халуун ус" ? usKhalaasniiDun * dun : 0)) : (baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? niitDun : khemjikhNegj === "кг" ? niitDunGaz : negjUne * (tsakhilgaanUrjver || 1) * (dun || 0)))
              guilgee = {
                turul: "avlaga",
                tulsunDun: 0,
                tulukhDun: nuatBodokhEsekh
                  ? (suuriKhuraamj +  tempDun) * 1.1
                  : (suuriKhuraamj + tempDun),
                negj: dun && dun,
                khemjikhNegj: khemjikhNegj,
                tariff: negjUne,
                tseverUsDun: tseverUsDun * dun,
                bokhirUsDun: bokhirUsDun * dun,
                usKhalaasanDun: (tailbar === "Халуун ус" ? usKhalaasniiDun * dun : 0),
                suuriKhuraamj: suuriKhuraamj,
                tsakhilgaanUrjver: tsakhilgaanUrjver,
                ognoo: moment(ognoo).format("YYYY-MM-DD 00:00:00"),
                gereeniiId: data?._id,
                tailbar,
                nekhemjlekhDeerKharagdakh,
                nuatBodokhEsekh,
                tsakhilgaanKBTST: baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? tsakhilgaanKBTST : 0,
                guidliinKoep: baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? guidliinKoep : 0,
                bichiltKhonog: baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? (baiguullaga?.tokhirgoo?.bichiltKhonog || 0) : 0,
                tsekhDun: baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? tsekhDun : 0,
                chadalDun: baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? chadalDun : 0,
                sekhDemjikhTulburDun: baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? sekhDemjikhTulburDun : 0,
                togtmolUtga: khemjikhNegj === "кг" ? togtmolGaz : 0,
              };
              if (khemjikhNegj === "кВт" || khemjikhNegj === "1м3" || khemjikhNegj === "кг" ) {
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
    if (e.target.value === "ashiglalt") {
      setOgnoo(moment());
    } else {
      setOgnoo(ankhanOgnoo);
    }
  }

  function changedArgaar(e){
    if(e)
      setDun(negjUne);
    else
    {
      umnukhZaaltFn(umnukhZaalt)
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
        <div className="flex w-full items-center justify-between gap-2">
          <DatePicker
            className="w-full"
            id="dataPicker1"
            locale={i18n.language === "mn" && locale}
            value={ognoo}
            onChange={(v) => {
              setOgnoo(v);
              // document.getElementById("guilgeeDunInputNumber").focus();
            }}
          />    
          <div className="flex justify-end gap-1 w-full">
            <label>{t("Түрээс эсэх")}: </label>
            <Switch checked={tureesEkhniiUldegdelEsekh} onChange={setTureesEkhniiUldegdelEsekh} />
          </div>
          {!tureesEkhniiUldegdelEsekh && (
            <Select
            placeholder={t("Ашиглалтын зардал")}
            onChange={(v) => {
                const tukhainZardal = zardalAll.jagsaalt.find((a) => a._id === v);
                var tempTurul = tukhainZardal?.ner?.includes("Менежментийн төлбөр") ? "management" : 
                            tukhainZardal?.ner === "Дулаан" ? "dulaan" : 
                              tukhainZardal?.ner === "Цахилгаан" ? "tsakhilgaan" :
                                tukhainZardal?.ner === "Халуун ус" ? "khulaanUs" :
                                  tukhainZardal?.ner === "Ус" ? "us" :
                                    tukhainZardal?.ner === "Хүйтэн ус" ? "khuitenUs" :
                                      tukhainZardal?.ner === "Хөрөнгийн менежмент" || tukhainZardal?.ner === "Худалдааны менежмент" ? "managementGoto" : "busad";
                setAshiglaltiinId(v);
                setAshiglaltiinNer(tukhainZardal.ner);
                setZardliinTurul(tempTurul);
              }
            }
            style={{ width: "100%" }}
            >
            {zardalAll?.jagsaalt?.map((a) => (
              <Select.Option key={a._id} value={a._id}>
              <div className="w-full flex justify-between border-b">
                <p className="flex border-r bg-green-400 bg-opacity-10 pl-2 pr-2 text-left">
                {a.ner}
                </p>
                <div className="w-full justify-between flex bg-blue-600 bg-opacity-5 pl-2 pr-2">
                <p className={`border-r text-right mr-5`}>{t(a.turul)}</p>
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
          <div className="w-full bflex flex-row justify-between">
            <div />
            <div className="flex justify-end space-x-2">
              <label>{data.talbainKhemjee + t(" м² аргаар бодох эсэх")}:</label>
              <Switch checked={m2argaarBodokhEsekh} onChange={(e) => changedArgaar(e)} />
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
          <Option value="aldangi">{t("Алданги")}</Option>
          <Option value="tulultBurtgekh">{t("Төлөлт бүртгэх")}</Option>
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
            style={{ width: "85%" }}
            onChange={(v) => {
              const utga = zardal.jagsaalt.find((a) => a._id === v);
              setBodokhArga(utga.bodokhArga);
              setTsakhilgaanUrjver(utga.ner === "Цахилгаан" ? (utga.tsakhilgaanUrjver || 1) : 1);
              setTogtmolGaz(utga.togtmolUtga || 0);
              setNegjUne(utga.tariff || 0);
              setTseverUsDun(utga.tseverUsDun || 0)
              setBokhirUsDun(utga.bokhirUsDun || 0)
              setUsKhalaasniiDun(utga.usKhalaasniiDun || 0)
              setTailbar(utga.ner);
              setKhemjikhNegj(utga.turul);
              setSuuriKhuraamj(Number(utga.suuriKhuraamj || 0));
              setSuuliinZaalt(null);
              setDun(0);
              if (utga.turul === "кВт" || utga.turul === "1м3" || utga.turul === "кг") {
                var suuliinGuilgee = guilgeeniiTuukh.filter(
                  (x) => x.khemjikhNegj == utga.turul && x.tailbar == utga.ner
                );
                if (!!suuliinGuilgee && suuliinGuilgee.length > 0)
                  suuliinGuilgee = suuliinGuilgee[suuliinGuilgee.length - 1];
                if (!!suuliinGuilgee?.suuliinZaalt) {
                  setUmnukhZaalt(suuliinGuilgee.suuliinZaalt);
                  setUmnukhZaalttaiEsekh(true);
                } 
                else 
                {
                  setUmnukhZaalt(0);
                  setUmnukhZaalttaiEsekh(false);
                }
              }
            }}
            id="select2"
            placeholder={t("Зардлын төрөл")}
          >
            {zardal.jagsaalt?.map((mur) =>
              // mur.turul !== "1м2" ? (
                <Select.Option key={mur._id} value={mur._id}>
                  <div className="w-full flex justify-between border-b">
                    <p className="flex border-r bg-green-400 bg-opacity-10 pl-2 pr-2 text-left">
                      {mur.ner}
                    </p>
                    <div className="w-full justify-between flex bg-blue-600 bg-opacity-5 pl-2 pr-2">
                      <p className={`border-r text-right mr-5`}>{t(mur.turul)}</p>
                      <p className="text-right">
                        {mur.turul !== "Дурын" ? formatNumber(mur.tariff) : "Дурын"}
                        {mur.turul !== "Дурын" && "₮"}
                      </p>
                    </div>
                  </div>
                </Select.Option>
              // ) : (
              //   ""
              // )
            )}
          </Select>
        )}
        {negjUne > 0 && turul === "ashiglalt" && (
          <div
            className="flex justify-end p-2 dark:text-gray-100"
            style={{ width: "49%" }}
          >
            {t("Нэгж үнэ ")}: { (formatNumber(negjUne, 2)) }
          </div>
        )}
        {!m2argaarBodokhEsekh && tseverUsDun > 0 && (tailbar === "Хүйтэн ус" || tailbar === "Халуун ус")  && bodokhArga === "Khatuu" && (
          <div
            className="flex justify-end p-2 dark:text-gray-100"
            style={{ width: "49%" }}
          >
            {t("Цэвэр ус")}: {formatNumber(tseverUsDun, 2)}
          </div>
        )}
        {!m2argaarBodokhEsekh && bokhirUsDun > 0 && (tailbar === "Хүйтэн ус" || tailbar === "Халуун ус") && bodokhArga === "Khatuu" && (
          <div
            className="flex justify-end p-2 dark:text-gray-100"
            style={{ width: "49%" }}
          >
            {t("Бохир ус")}: {formatNumber(bokhirUsDun, 2)}
          </div>
        )}
        {!m2argaarBodokhEsekh && usKhalaasniiDun > 0 && tailbar === "Халуун ус" && bodokhArga === "Khatuu" && (
          <div
            className="flex justify-end p-2 dark:text-gray-100"
            style={{ width: "49%" }}
          >
            {t("Ус халаасан")}: {formatNumber(usKhalaasniiDun, 2)}
          </div>
        )}
      </div>
      {turul === "ashiglalt" && !m2argaarBodokhEsekh && (khemjikhNegj === "кВт" || khemjikhNegj === "1м3" || khemjikhNegj === "кг") ? (
        <div className="flex w-full justify-between">
          <div style={{ width: "49%" }}>
            <div>Өмнөх заалт</div>
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
        />
      )}
      {busadTurul === "tulultBurtgekh" && (
        <DatePicker
          locale={i18n.language === "mn" && locale}
          value={shineOgnoo}
          onChange={(v) => {
            setShineOgnoo(v);
          }}
        />
      )}
      {turul === "ashiglalt" && tailbar === "Цахилгаан" && baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && (
        <div className="flex w-full items-start justify-between">
          <div style={{ width: "34%" }}>
            <div>Гүйдлийн коэффициент </div>
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%", textAlign: "center" }}
              value={guidliinKoep}
              onChange={(v) => { setGuidliinKoep(v) }}
              min={0}
            />
          </div>
          <div style={{ width: "34%" }}>
            <div>Бичилтийн хоног {baiguullaga?.tokhirgoo?.bichiltKhonog}</div>
          </div>
          <div style={{ width: "30%" }}>
            <div className="flex justify-end">Хэрэглээ/кВт.ц/ {formatNumber(tsakhilgaanKBTST || 0)}</div>
          </div>
        </div>
      )}
      {turul === "ashiglalt" && tailbar === "Цахилгаан" && baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && (
        <div className="flex w-full items-start justify-between">
          <div style={{ width: "48%" }}>
            <div className="flex justify-start">ЦЭХ төлбөр/төг/ {formatNumber(tsekhDun || 0)}</div>
          </div>
          <div style={{ width: "48%" }}>
            <div className="flex justify-end">Чадлын төлбөр/төг/ {formatNumber(chadalDun || 0)}</div>
          </div>
        </div>
      )}
       {turul === "ashiglalt" && tailbar === "Цахилгаан" && baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && baiguullaga?.tokhirgoo?.sekhDemjikhTulburAvakhEsekh && (
        <div className="flex w-full items-start justify-between">
          <div style={{ width: "48%" }}>
            <div className="flex justify-start">Сэх дэмжих төлбөр {formatNumber(sekhDemjikhTulburDun || 0)}</div>
          </div>
        </div>
      )}
      {turul === "ashiglalt" && (
        <div className="flex w-full items-start justify-between">
          <div>Суурь хураамж: {formatNumber(suuriKhuraamj || 0, 2)}</div>
          {tailbar === "Цахилгаан" ? (<div>КВЦТ: {formatNumber((tsakhilgaanUrjver || 1), 4)}</div>) : ""}
          {khemjikhNegj === "кг" ? (<div>Тогтмол: {formatNumber((togtmolGaz || 0), 4)}</div>) : ""}
          <div
            className={`${nuatBodokhEsekh ? "p-0" : "p-2"}dark:text-gray-100`}
          >
            {nuatBodokhEsekh && negjUne > 0 && (
              <div className="flex w-full flex-col items-start justify-center gap-2 border-b border-dashed">
                <div className="flex w-full items-center justify-between gap-2">
                  <div>Бодсон үнэ: </div>
                  <div>
                    {formatNumber((m2argaarBodokhEsekh ? dun * data?.talbainKhemjee : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? niitDun : khemjikhNegj === "кг" ? niitDunGaz : negjUne * dun * tsakhilgaanUrjver) + (suuriKhuraamj || 0) || 0, 2)}
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-2">
                  <div>НӨАТ:</div>
                  <div>
                    {formatNumber(
                      ((m2argaarBodokhEsekh ? dun * data?.talbainKhemjee : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? niitDun : khemjikhNegj === "кг" ? niitDunGaz : negjUne * dun * tsakhilgaanUrjver) + (suuriKhuraamj || 0) || 0) / 10
                    )}
                  </div>
                </div>
              </div>
            )}
            {negjUne > 0 && !nuatBodokhEsekh && (
              <div className="flex w-full items-center justify-between gap-2">
                <div>{t("Нийт үнэ")}:</div>
                <div>
                  {formatNumber((m2argaarBodokhEsekh ? dun * data?.talbainKhemjee : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? niitDun : khemjikhNegj === "кг" ? niitDunGaz : negjUne * dun * tsakhilgaanUrjver) + (suuriKhuraamj || 0) || 0, 2)}
                </div>
              </div>
            )}
            {negjUne > 0 && nuatBodokhEsekh && (
              <div className="flex w-full items-center justify-between gap-2">
                <div>{t("Нийт үнэ")}:</div>
                <div>
                  {formatNumber(
                    ((m2argaarBodokhEsekh ? dun * data?.talbainKhemjee : baiguullaga?.tokhirgoo?.guidelBuchiltKhonogEsekh && tailbar === "Цахилгаан" ? niitDun : khemjikhNegj === "кг" ? niitDunGaz : negjUne * dun * tsakhilgaanUrjver) + (suuriKhuraamj || 0) || 0) * 1.1
                  )}
                </div>
              </div>
            )}

            {!m2argaarBodokhEsekh && nuatBodokhEsekh && (tailbar === "Хүйтэн ус" || tailbar === "Халуун ус") && bodokhArga === "Khatuu" && (
              <div className="flex w-full flex-col items-start justify-center gap-2 border-b border-dashed">
                <div className="flex w-full items-center justify-between gap-2">
                  <div>Цэвэр усны дүн: </div>
                  <div>
                    {formatNumber(tseverUsDun * dun || 0, 2)}
                  </div>
                </div>  
                <div className="flex w-full items-center justify-between gap-2">  
                  <div>Бохир усны дүн: </div>
                  <div>
                    {formatNumber(bokhirUsDun * dun || 0, 2)}
                  </div>
                </div>  
                {tailbar === "Халуун ус" ? 
                  (<div className="flex w-full items-center justify-between gap-2"> 
                    <div>Ус халаасны дүн: </div>
                    <div>
                      {formatNumber(usKhalaasniiDun * dun || 0, 2)}
                    </div>
                  </div>) : ""}
                <div className="flex w-full items-center justify-between gap-2">
                  <div>НӨАТ:</div>
                  <div>
                    {formatNumber(
                      (tseverUsDun * dun + bokhirUsDun * dun + (tailbar === "Халуун ус" ? usKhalaasniiDun * dun : 0) + (suuriKhuraamj || 0) || 0) / 10
                    )}
                  </div>
                </div>
              </div>
            )}
            {!m2argaarBodokhEsekh && (tailbar === "Хүйтэн ус" || tailbar === "Халуун ус") && bodokhArga === "Khatuu" && !nuatBodokhEsekh && (
              <div className="flex w-full items-center justify-between gap-2">
                <div>{t("Нөатгүй дүн")}:</div>
                <div>
                  {formatNumber(tseverUsDun * dun + bokhirUsDun * dun + (tailbar === "Халуун ус" ? usKhalaasniiDun * dun : 0) + (suuriKhuraamj || 0) || 0, 2)}
                </div>
              </div>
            )}
            {!m2argaarBodokhEsekh && (tailbar === "Хүйтэн ус" || tailbar === "Халуун ус") && bodokhArga === "Khatuu" && nuatBodokhEsekh && (
              <div className="flex w-full items-center justify-between gap-2">
                <div>Нийт дүн: </div>
                <div>
                  {formatNumber(
                    (tseverUsDun * dun + bokhirUsDun * dun + (tailbar === "Халуун ус" ? usKhalaasniiDun * dun : 0) + (suuriKhuraamj || 0) || 0) * 1.1
                  )}
                </div>
              </div>
            )}
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
      {turul === "avlaga" && (
        <div className="flex flex-row justify-between">
          <div />
          <div className="space-x-2">
            <label>{t("Эхний үлдэгдэл эсэх")}:</label>
            <Switch checked={ekhniiUldegdelEsekh} onChange={setEkhniiUldegdelEsekh} />
          </div>
        </div>
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
      {turul === "ashiglalt" && (
        <div className="flex flex-row justify-between">
          <div />
          <div className="space-x-2">
            <label>{t("НӨАТ бодох эсэх")}:</label>
            <Switch checked={nuatBodokhEsekh} onChange={setNuatBodokhEsekh} />
          </div>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeKhiikh);
