import React, { useEffect, useState } from "react";
import Admin from "components/Admin";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import readMethod from "tools/function/crud/readMethod";
import { Button, message, Modal, notification, Select, Steps } from "antd";
import { useAuth } from "services/auth";
import YurunkhiiMedeelel from "components/pageComponents/gereebaiguulakh/YurunkhiiMedeelel";
import Zardal from "components/pageComponents/gereebaiguulakh/Zardal";
import KhurungiinBurtgel from "components/pageComponents/gereebaiguulakh/KhurungiinBurtgel";
import KhugatsaaBurtgel from "components/pageComponents/gereebaiguulakh/KhugatsaaBurtgel";
import TulburTootsoo from "components/pageComponents/gereebaiguulakh/TulburTootsoo";
import moment from "moment";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { url } from "services/uilchilgee";
import _ from "lodash";
import { useRouter } from "next/router";
import compareFields from "tools/function/compareFields";
import { EyeInvisibleOutlined, FileTextOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import useAktiinZagvar from "hooks/useAktiinZagvar";
import dynamic from "next/dynamic";
import formatNumber from "tools/function/formatNumber";
import createMethod from "tools/function/crud/createMethod";

const Konva = dynamic(() => import("components/konva"), { ssr: false });

const { Step } = Steps;

const steps = [
  {
    title: "Ерөнхий мэдээлэл",
    content: YurunkhiiMedeelel,
    zaaltiinTolgoi: "НЭГ. АГУУЛГА, ҮНДСЭН ЗҮЙЛ",
  },
  {
    title: "Гэрээний хугацаа",
    content: KhugatsaaBurtgel,
    zaaltiinTolgoi: "ХОЁР. ГЭРЭЭНИЙ ХУГАЦАА",
  },
  {
    title: "Түрээсийн талбай",
    content: KhurungiinBurtgel,
    zaaltiinTolgoi: "ДӨРӨВ. БАЙРЛАЛ, ДУГААР, ХЭМЖЭЭ",
  },
  {
    title: "Зардал бүртгэл",
    content: Zardal,
    zaaltiinTolgoi: "ГУРАВ. ЗАРДАЛ",
  },
  {
    title: "Төлбөр тооцоо",
    content: TulburTootsoo,
    zaaltiinTolgoi: "ТАВ.ТӨЛБӨР ТООЦОО",
  },
];

function GereeBaiguulakh({ token, data }) {
  const { t } = useTranslation();
  const { baiguullaga, barilgiinId } = useAuth();
  const router = useRouter();
  const [current, setCurrent] = React.useState(0);
  const [dutuuAlkham, setDutuuAlkham] = useState([]);
  const [khadgalakhGeree, setKhagalakhGeree] = React.useState(
    _.cloneDeep(data) || {
      ognoo: new Date(),
      gereeniiDugaar: `ГД${moment(new Date()).format("YYMMDD")}`,
    }
  );

  const [gereeniiZagvar, setGereeniiZagvar] = React.useState(
    data?.gereeniiZagvar || {}
  );
  const [aktiinZagvar, setAktiinZagvar] = React.useState();
  const { gereeniiZagvarGaralt, setGereeniiZagvarKhuudaslalt } =
    useGereeniiZagvar(token, baiguullaga?._id);
  const { aktiinZagvarGaralt, setAktiinZagvarKhuudaslalt } = useAktiinZagvar(
    token,
    baiguullaga?._id
  );
  const [waiting, setWaiting] = useState(false);
  const [gereekharakhTovch, setGereekharakhTovch] = useState(false);

  const next = (data) => {
    if (current < 4) {
      setCurrent(current + 1);
    }
    if (!!data) {
      khadgalya(data);
    }
  };
  useEffect(() => {
    if (!!data?.aktiinZagvariinId) {
      uilchilgee(token)
        .get(`/aktiinZagvar/${data?.aktiinZagvariinId}`)
        .then(({ data }) => setAktiinZagvar(data));
    }
  }, [data]);
  useEffect(() => {
    if (current === 0) {
      var elem = document.getElementById("erunkhiiMedeelel");
      elem?.scrollIntoView();
    }
    if (current === 1) {
      var elem = document.getElementById("gereeniiKhugatsaa");
      elem?.scrollIntoView();
    }
    if (current === 2) {
      var elem = document.getElementById("tureesiinTalbai");
      elem?.scrollIntoView();
    }
    if (current === 3) {
      var elem = document.getElementById("baritsaaBurtgel");
      elem?.scrollIntoView();
    }
    if (current === 4) {
      var elem = document.getElementById("tulburToostoo");
      elem?.scrollIntoView();
    }
  }, [current]);

  function khadgalya(data) {
    var utgaShalgakh = [];
    if (
      !data.dans ||
      !data.gereeniiDugaar ||
      !data.utas ||
      (data.baiguullagaEsekh === true
        ? !data.zakhirliinNer || !data.zakhirliinOvog || !data.ner
        : !data.ner || !data.ovog) ||
      !gereeniiZagvar
    ) {
      utgaShalgakh.push(0);
      notification.warning({
        message: t("Гэрээ болон Ерөнхий мэдээллээ бүрэн оруулна уу!"),
      });
    }
    if (
      !data.duusakhOgnoo ||
      !data.duusakhOn ||
      !data.duusakhSar ||
      !data.duusakhUdur ||
      !data.ekhelkhSar ||
      !data.ekhlekhOn ||
      !data.ekhlekhUdur ||
      !data.khugatsaa ||
      !data.tulukhUdur ||
      !data.gereeniiOgnoo ||
      !khadgalakhGeree?.tulukhUdur ||
      !khadgalakhGeree?.khugatsaa
    ) {
      utgaShalgakh.push(1);
      notification.warning({
        message: t("Гэрээний хугацаагаа бүрэн оруулна уу!"),
      });
    }
    if (!data.talbainIdnuud || !data.talbainKhemjee) {
      utgaShalgakh.push(2);
      notification.warning({ message: t("Талбай мэдээллээ оруулна уу!") });
    }
    if (
      gereeniiZagvar?.turGereeEsekh !== true &&
      data.baritsaaAvakhEsekh === true &&
      data.baritsaaBairshuulakhKhugatsaa === (undefined || null)
    ) {
      utgaShalgakh.push(4);
      notification.warning({ message: t("барьцаа хугацаа оруулна уу!") });
    }
    if (utgaShalgakh.length > 0) {
      setDutuuAlkham(utgaShalgakh);
      return;
    }
    setWaiting(true);
    data.turul = data?.baiguullagaEsekh ? "ААН" : "Иргэн";
    data.baiguullagiinNer = baiguullaga.ner;
    data.baiguullagiinId = baiguullaga._id;
    data.gereeniiZagvariinId = gereeniiZagvar._id;
    data.barilgiinId = barilgiinId;
    data.turGereeEsekh = gereeniiZagvar?.turGereeEsekh;

    if (!!data?.unemlekhniiZurag)
      data.unemlekhniiZurag =
        _.get(data, "unemlekhniiZurag.0.response.id") || null;

    if (!!data?.gerchilgeeniiZurag)
      data.gerchilgeeniiZurag =
        _.get(data, "gerchilgeeniiZurag.0.response.id") || null;

    if (!!data?.zuvshuurliinZurag)
      data.zuvshuurliinZurag =
        _.get(data, "zuvshuurliinZurag.0.response.id") || null;
    
    createMethod("gereeZasya", token, data)  
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setKhagalakhGeree({});
          router.back();
          setTimeout(() => {
            window.location.reload();
          }, 600);
          message.success(t("Амжилттай хадгаллаа"));
        }
      });
  }

  const onChangeGereeniiZagvar = (_id) => {
    let gereeniiZagvar =
      gereeniiZagvarGaralt?.jagsaalt?.find((a) => a._id === _id) || {};
    setGereeniiZagvar({ ...gereeniiZagvar });
    document.getElementById("gereeniiKhugatsaaButton").focus();
  };

  function garya() {
    if (
      compareFields(data, khadgalakhGeree, [
        "baiguullagaEsekh",
        "baritsaaAvakhDun",
        "baritsaaAvakhEsekh",
        "baritsaaAvakhKhugatsaa",
        "baritsaaBairshuulakhKhugatsaa",
        "baritsaaniiUldegdel",
        "dans",
        "davkhar",
        "duusakhOgnoo",
        "gereeniiDugaar",
        "gereeniiOgnoo",
        "gereeniiZagvar",
        "gereeniiZagvariinId",
        "khugatsaa",
        "mail",
        "ner",
        "ovog",
        "register",
        "sariinTurees",
        "segmentuud",
        "talbainDugaar",
        "talbainIdnuud",
        "talbainKhemjee",
        "talbainNegjUne",
        "talbainNiitUne",
        "tulukhUdur",
        "tuluv",
        "turul",
        "utas",
        "zardluud",
        "avlaga",
      ])
    )
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: () => {
          router.back(),
            setTimeout(() => {
              window.location.reload();
            }, 600);
        },
      });
    else {
      router.back(),
        setTimeout(() => {
          window.location.reload();
        }, 600);
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
  }, [khadgalakhGeree]);

  const alkhamiinAktiinZagvar = React.useMemo(() => {
    if (aktiinZagvar === undefined) return;
    let butsaakhUtga = _.cloneDeep(aktiinZagvar);
    if (!butsaakhUtga?.dedKhesguud)
      butsaakhUtga.dedKhesguud = butsaakhUtga.dedKhesguud.filter(
        (a) => a.khamaarakhKheseg === steps[current].title
      );
    if (khadgalakhGeree.gereeniiOgnoo) {
      khadgalakhGeree.ekhlekhOn = moment(khadgalakhGeree.gereeniiOgnoo).format(
        "YYYY"
      );
      khadgalakhGeree.ekhelkhSar = moment(khadgalakhGeree.gereeniiOgnoo).format(
        "MM"
      );
      khadgalakhGeree.ekhlekhUdur = moment(
        khadgalakhGeree.gereeniiOgnoo
      ).format("DD");
      if (khadgalakhGeree.khugatsaa > 0) {
        // let duusakhOgnoo = moment(khadgalakhGeree.gereeniiOgnoo).add(
        //   khadgalakhGeree.khugatsaa,
        //   "months"
        // )
        let duusakhOgnoo = moment(khadgalakhGeree.duusakhOgnoo);

        khadgalakhGeree.duusakhOn = duusakhOgnoo.format("YYYY");
        khadgalakhGeree.duusakhSar = duusakhOgnoo.format("MM");
        khadgalakhGeree.duusakhUdur = duusakhOgnoo.format("DD");
      }
    }

    for (const [key, value] of Object.entries(khadgalakhGeree)) {
      butsaakhUtga.dedKhesguud
        .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
        .map((b) => {
          b.zaalt = b.zaalt.replace(
            new RegExp(`&lt;${key}&gt;`, "g"), 
            key === "utas" ? value[0] : (key === "talbainNegjUne" || key === "talbainNiitUne" || key === "baritsaaAvakhDun") ? formatNumber(value) : value
              // : parseFloat(value) != NaN
              // ? key != "register"
              //   ? value
              //   : formatNumber(value)
              // : value
          );
        });
      butsaakhUtga.baruunTolgoi = butsaakhUtga.baruunTolgoi?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
    }
    return butsaakhUtga;
  }, [aktiinZagvar, khadgalakhGeree, current]);

  const alkhamiinGereeniiZagvar = React.useMemo(() => {
    if (gereeniiZagvar === undefined) return;
    let butsaakhUtga = _.cloneDeep(gereeniiZagvar);
    if (!butsaakhUtga?.dedKhesguud)
      butsaakhUtga.dedKhesguud = butsaakhUtga?.dedKhesguud?.filter(
        (a) => a.khamaarakhKheseg === steps[current].title
      );
    if (khadgalakhGeree.gereeniiOgnoo) {
      khadgalakhGeree.ekhlekhOn = moment(khadgalakhGeree.gereeniiOgnoo).format(
        "YYYY"
      );
      khadgalakhGeree.ekhelkhSar = moment(khadgalakhGeree.gereeniiOgnoo).format(
        "MM"
      );
      khadgalakhGeree.ekhlekhUdur = moment(
        khadgalakhGeree.gereeniiOgnoo
      ).format("DD");
      if (khadgalakhGeree.khugatsaa > 0) {
        // let duusakhOgnoo = moment(khadgalakhGeree.gereeniiOgnoo).add(
        //   khadgalakhGeree.khugatsaa,
        //   "months"
        // )
        let duusakhOgnoo = moment(khadgalakhGeree.duusakhOgnoo);

        khadgalakhGeree.duusakhOn = duusakhOgnoo.format("YYYY");
        khadgalakhGeree.duusakhSar = duusakhOgnoo.format("MM");
        khadgalakhGeree.duusakhUdur = duusakhOgnoo.format("DD");
      }
    }

    for (const [key, value] of Object.entries(khadgalakhGeree)) {
      if (key === "zardluud") {
        value.map((mur) => {
          butsaakhUtga?.dedKhesguud
            ?.filter(
              (a) => !!a.zaalt && a.zaalt?.indexOf(`${mur.ner}.tariff`) !== -1
            )
            .map((b) => {
              b.zaalt = b.zaalt.replace(new RegExp(`&lt;${mur.ner}.tariff&gt;`, "g"), formatNumber(mur.tariff));
            });
        });
        value.map((mur) => {
          butsaakhUtga?.dedKhesguud
            ?.filter(
              (a) => !!a.zaalt && a.zaalt?.indexOf(`${mur.ner}.tulukhDun`) !== -1
            )
            .map((b) => {
              b.zaalt = b.zaalt.replace(new RegExp(`&lt;${mur.ner}.tulukhDun&gt;`, "g"), formatNumber(mur.tulukhDun));
            });
        });
        value.map((mur) => {
          butsaakhUtga?.dedKhesguud
            ?.filter(
              (a) => !!a.zaalt && a.zaalt?.indexOf(`${mur.ner}.tariffUsgeer`) !== -1
            )
            .map((b) => {
              b.zaalt = b.zaalt.replace(new RegExp(`&lt;${mur.ner}.tariffUsgeer&gt;`, "g"), mur.tariffUsgeer);
            });
        });
      } else {
        butsaakhUtga.dedKhesguud
          ?.filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
          .map((b) => {
            b.zaalt = b.zaalt.replace(
              new RegExp(`&lt;${key}&gt;`, "g"),
              key === "utas" ? value[0] : (key === "talbainNegjUne" || key === "talbainNiitUne" || key === "baritsaaAvakhDun") ? formatNumber(value) : value
                // : parseFloat(value) != NaN
                // ? key != "register"
                //   ? value
                //   : formatNumber(value)
                // : value
            );
          });
      }
      butsaakhUtga.baruunTolgoi = butsaakhUtga.baruunTolgoi?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
    }

    return butsaakhUtga;
  }, [gereeniiZagvar, khadgalakhGeree, current]);

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const currentItem = steps[current];
  const gereeniiZagvariinId = "gereeniiZagvar";

  const onChange = (value) => {
    setCurrent(value);
    const find = dutuuAlkham.filter((a) => a !== value);
    setDutuuAlkham(find);
  };

  function onBack() {
    router.back();
    setTimeout(() => {
      window.location.reload();
    }, 600);
  }

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
      onBack={onBack}
      setTurulZagvar={setGereekharakhTovch}
      loading={waiting}
      fixedZagvarNeegdsenEsekh={gereekharakhTovch}
    >
      <div className="box col-span-12 p-5">
        <div className="px-10">
          <Steps onChange={onChange} current={current}>
            {steps.map((item, index) => (
              <Step
                status={
                  dutuuAlkham?.find((a) => a === index) === index && "error"
                }
                value={index}
                key={item.title}
                title={t(item.title)}
              />
            ))}
          </Steps>
        </div>
        <div className="mt-3 grid grid-cols-12 gap-6">
          <div className="col-span-12 mt-3 bg-gray-50 p-2 dark:bg-gray-900 lg:col-span-6 2xl:col-span-4">
            <currentItem.content
              t={t}
              next={next}
              prev={prev}
              onChange={setKhagalakhGeree}
              setAktiinZagvar={setAktiinZagvar}
              value={khadgalakhGeree}
              token={token}
              baiguullaga={baiguullaga}
              gereeniiZagvar={gereeniiZagvar}
              barilgiinId={barilgiinId}
              gereeniiZagvariinId={gereeniiZagvariinId}
              gereeniiZagvarGaralt={gereeniiZagvarGaralt}
              aktiinZagvarGaralt={aktiinZagvarGaralt}
              setAktiinZagvarKhuudaslalt={setAktiinZagvarKhuudaslalt}
              onChangeGereeniiZagvar={onChangeGereeniiZagvar}
              setGereeniiZagvarKhuudaslalt={setGereeniiZagvarKhuudaslalt}
            />
            {JSON.stringify(data) !== JSON.stringify(khadgalakhGeree) && (
              <Button
                type="primary"
                style={{ width: "100%", marginTop: 10 }}
                onClick={() => khadgalya(khadgalakhGeree)}
              >
                Хадгалах
              </Button>
            )}
          </div>
          {!!gereeniiZagvar && (
            <div
              className={`${
                gereekharakhTovch !== true
                  ? "bottom-20 right-5"
                  : "bottom-[72vh] right-1"
              } fixed z-50 rounded-full border-2 bg-green-600 p-2 text-2xl text-white transition-all duration-300 md:hidden`}
            >
              {gereekharakhTovch !== true ? (
                <FileTextOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    setGereekharakhTovch(true);
                  }}
                />
              ) : (
                <EyeInvisibleOutlined
                  onClick={(e) => {
                    e.stopPropagation(), setGereekharakhTovch(false);
                  }}
                />
              )}
            </div>
          )}
          <div
            className={`fixed top-40 col-span-12 mt-3 w-[91vw] transition-all duration-300 md:w-auto ${
              gereekharakhTovch !== true ? " -right-full" : " right-4"
            } border-2 border-green-600 bg-gray-50 p-2 dark:bg-gray-900 md:static md:border-0 ${
              gereekharakhTovch !== true ? "hidden md:block" : ""
            } lg:col-span-6 2xl:col-span-8`}
            style={{
              maxHeight: "calc(100vh - 17rem)",
              overflow: "auto",
              scrollBehavior: "smooth",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {current === 0 && (
              <Select
                showSearch
                id={gereeniiZagvariinId}
                placeholder="Гэрээний загвар сонгох"
                className="hidden w-full md:block"
                size="large"
                value={null}
                filterOption={(o) => o}
                onSearch={(search) =>
                  setGereeniiZagvarKhuudaslalt((a) => ({
                    ...a,
                    search,
                    khuudasniiDugaar: 1,
                  }))
                }
                onChange={onChangeGereeniiZagvar}
              >
                {gereeniiZagvarGaralt?.jagsaalt?.map((mur) => {
                  return (
                    <Select.Option key={mur._id}>
                      <div className="flex justify-between">
                        <p>{mur.ner}</p>
                        <p className="text-gray-500">
                          /
                          {mur.turGereeEsekh === true
                            ? t("Түр гэрээ")
                            : t("Үндсэн гэрээ")}
                          /
                        </p>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            )}
            <div className="flex w-full flex-col items-center justify-center gap-10">
              <div
                className="flex flex-col space-y-1 bg-white p-[15mm] pl-[24mm] pr-[14mm] text-black"
                style={{ width: "210mm" }}
              >
                {current === 0 && gereeniiZagvar?.ner && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: gereeniiZagvar?.zuunTolgoi,
                        }}
                      />
                      <div
                        dangerouslySetInnerHTML={{
                          __html: gereeniiZagvar?.baruunTolgoi,
                        }}
                      />
                    </div>
                  </>
                )}
                {alkhamiinGereeniiZagvar?.dedKhesguud?.map((mur, index) => {
                  return (
                    <div
                      id={
                        mur.khamaarakhKheseg === "Ерөнхий мэдээлэл"
                          ? "erunkhiiMedeelel"
                          : mur.khamaarakhKheseg === "Гэрээний хугацаа"
                          ? "gereeniiKhugatsaa"
                          : mur.khamaarakhKheseg === "Түрээсийн талбай"
                          ? "tureesiinTalbai"
                          : mur.khamaarakhKheseg === "Барьцаа бүртгэл"
                          ? "baritsaaBurtgel"
                          : mur.khamaarakhKheseg === "Төлбөр тооцоо"
                          ? "tulburToostoo"
                          : ""
                      }
                      key={`alkhamiinGereeniiZagvar${index}`}
                      className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-100"
                    >
                      <div
                        className="sun-editor-editable w-full text-center"
                        dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                      />
                    </div>
                  );
                })}
              </div>
              {khadgalakhGeree?.talbainuud?.length > 0 &&
                khadgalakhGeree?.talbainuud?.map((a, i) => {
                  return (
                    <div
                      key={i}
                      className="relative flex w-full flex-col justify-center space-y-1 bg-white p-[15mm] pl-[24mm] pr-[14mm] text-black"
                      style={{ width: "210mm", height: "297mm" }}
                    >
                      <div className="absolute left-5 top-5 flex gap-3 text-lg font-semibold">
                        <div>{t("Код")}:</div>
                        <div>{a?.kod}</div>
                      </div>
                      <Konva
                        talbaiGereendKharakh={true}
                        baiguullaga={baiguullaga}
                        barilgiinId={barilgiinId}
                        token={token}
                        _id={a._id}
                        points={a.bairshil}
                        davkhar={a.davkhar}
                      />
                      <div className="flex gap-3">
                        <div>{t("Хэмжээ")}:</div>
                        <div>
                          {a.talbainKhemjee || 0}м<sup>2</sup>
                        </div>
                      </div>
                      {a.talbainKhemjeeMetrKube && (
                        <div className="flex gap-3">
                          <div>{t("Хэмжээ м3")}:</div>talbainNiitUne
                          <div>
                            {a.talbainKhemjeeMetrKube || 0}м<sup>3</sup>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <div>{t("Сарын түрээс")}:</div>
                        <div>{formatNumber(a.tureesiinTulbur || 0)}₮</div>
                      </div>
                      <div className="flex gap-3">
                        <div>{t("Давхар")}:</div>
                        <div>{a.davkhar}</div>
                      </div>
                    </div>
                  );
                })}
              {baiguullaga?.tokhirgoo?.aktAshiglakhEsekh === true && (
                <div
                  className="flex w-full flex-col space-y-1 bg-white p-[15mm] pl-[24mm] pr-[14mm] text-black"
                  style={{ width: "210mm" }}
                >
                  {current === 0 && alkhamiinAktiinZagvar?.ner && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: alkhamiinAktiinZagvar?.zuunTolgoi,
                          }}
                        />
                        <div
                          dangerouslySetInnerHTML={{
                            __html: alkhamiinAktiinZagvar?.baruunTolgoi,
                          }}
                        />
                      </div>
                    </>
                  )}
                  {alkhamiinAktiinZagvar?.dedKhesguud?.map((mur, index) => {
                    return (
                      <div
                        id={
                          mur.khamaarakhKheseg === "Ерөнхий мэдээлэл"
                            ? "erunkhiiMedeelel"
                            : mur.khamaarakhKheseg === "Гэрээний хугацаа"
                            ? "gereeniiKhugatsaa"
                            : mur.khamaarakhKheseg === "Түрээсийн талбай"
                            ? "tureesiinTalbai"
                            : mur.khamaarakhKheseg === "Барьцаа бүртгэл"
                            ? "baritsaaBurtgel"
                            : mur.khamaarakhKheseg === "Төлбөр тооцоо"
                            ? "tulburToostoo"
                            : ""
                        }
                        key={`alkhamiinAktiinZagvar${index}`}
                        className="group relative flex w-full flex-row rounded-md hover:bg-gray-100 dark:hover:bg-gray-100"
                      >
                        <div
                          className="w-full"
                          dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx, session) => {
  const { data } = await readMethod("geree", session.tureestoken, ctx.query.id);
  data.baiguullagaEsekh = data.turul === "ААН" ? true : false;

  if (!!data?.unemlekhniiZurag && data?.unemlekhniiZurag !== "") {
    _.set(data, "unemlekhniiZurag", [
      {
        uid: "-1",
        name: data?.unemlekhniiZurag,
        status: "done",
        url: `${url}/zuragAvya/unemlekhniiZurag/${data?.baiguullagiinId}/${data?.unemlekhniiZurag}`,
        thumbUrl: `${url}/zuragAvya/unemlekhniiZurag/${data?.baiguullagiinId}/${data?.unemlekhniiZurag}`,
        response: {
          id: data?.unemlekhniiZurag,
        },
      },
    ]);
  }

  if (!!data?.gerchilgeeniiZurag && data?.gerchilgeeniiZurag !== "") {
    _.set(data, "gerchilgeeniiZurag", [
      {
        uid: "-1",
        name: data?.gerchilgeeniiZurag,
        status: "done",
        url: `${url}/zuragAvya/gerchilgeeniiZurag/${data?.baiguullagiinId}/${data?.gerchilgeeniiZurag}`,
        thumbUrl: `${url}/zuragAvya/gerchilgeeniiZurag/${data?.baiguullagiinId}/${data?.gerchilgeeniiZurag}`,
        response: {
          id: data?.gerchilgeeniiZurag,
        },
      },
    ]);
  }

  if (!!data?.zuvshuurliinZurag && data?.zuvshuurliinZurag !== "") {
    _.set(data, "zuvshuurliinZurag", [
      {
        uid: "-1",
        name: data?.zuvshuurliinZurag,
        status: "done",
        url: `${url}/zuragAvya/zuvshuurliinZurag/${data?.baiguullagiinId}/${data?.zuvshuurliinZurag}`,
        thumbUrl: `${url}/zuragAvya/zuvshuurliinZurag/${data?.baiguullagiinId}/${data?.zuvshuurliinZurag}`,
        response: {
          id: data?.zuvshuurliinZurag,
        },
      },
    ]);
  }
  var gereeniiZagvar = { data: null };
  if (data?.gereeniiZagvariinId)
    gereeniiZagvar = await readMethod(
      "gereeniiZagvar",
      session.tureestoken,
      data.gereeniiZagvariinId
    );

  data.gereeniiZagvar = gereeniiZagvar.data;
  data.baritsaaAvakhEsekh = data.baritsaaAvakhDun > 0;
  return data;
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx, ugudulAvchirya);

export default GereeBaiguulakh;
