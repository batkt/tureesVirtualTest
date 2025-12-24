import { ArrowLeftOutlined, QrcodeOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  InputNumber,
  Select,
  Switch,
  message,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { t } from "i18next";
import React, { useEffect } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";

const qpayTulburiinKhelberuud = [
  {
    ner: "qpay",
    bgColor: "border-blue-800",
    src: "data:image/jpeg;base64,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",
  },
  {
    ner: "monpay",
    src: "https://play-lh.googleusercontent.com/GofyFzRM2Kwf3d47fl6FibZB7kE16Aljaodzc-ghiJmdiPpGljaqeop2T6JaURd8rw",
  },
  {
    ner: "socialpay",
    src: "https://play-lh.googleusercontent.com/-xjqjFYBmk1odZFvUnyobdiKu9pcgVf_7e-UnFXVL0pk2JpjSs71WkgFQUbpL47TmME",
  },
  // {
  //   ner: "pocket",
  //   src: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Pocket_logo.png",
  // },
  {
    ner: "toki",
    src: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.toki.mn%2F&psig=AOvVaw1ej7t5Vo6qLIhInQ0XNMEm&ust=1715243807766000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCJjD-6DT_YUDFQAAAAAdAAAAABAE",
  },
];

function KhuvaajTulukh({
  tulburiinKhelber,
  data,
  tulbur,
  setTulbur,
  ajiltan,
  khunglult,
  setKhunglult,
  khungulukhEsekh,
  setKhungulukhEsekh,
  qpayerTulukh,
  setQpayerTulukh,
  token,
  songogdTulburiinKhelber,
  songogdsonBank,
  setSongogdsonBank,
  setSongogdsonTulburiinKhelber,
  songogdsonBusadTurul,
  setSongogdsonBusadTurul,
  tuluv,
  setTuluv,
  setKhuleegdejBuiQpay,
  niitDun,
  khuleegdejBuiQpay,
  batalgaajuulaltKhiiya,
  setLoading,
  batalgaajuulya,
  setTerminal,
  guilgeeniiTuukhKhadgalya,
}) {
  const belenRef = React.useRef();
  const khariltsakhRef = React.useRef();
  const zeelRef = React.useRef();
  const khunglukhRef = React.useRef();
  const khaanRef = React.useRef();
  const tdbRef = React.useRef();
  const khasRef = React.useRef();
  const golomtRef = React.useRef();
  const kapitronRef = React.useRef();
  const turRef = React.useRef();

  const value = React.useMemo(() => {
    const belen = tulbur.find((a) => a.turul === "belen")?.dun;
    const khariltsakh = tulbur.find((a) => a.turul === "khariltsakh")?.dun;
    const khunglukh = tulbur.find((a) => a.turul === "khunglukh")?.dun;
    const khaan = tulbur.find((a) => a.turul === "khaan")?.dun;
    const tdb = tulbur.find((a) => a.turul === "tdb")?.dun;
    const khas = tulbur.find((a) => a.turul === "khas")?.dun;
    const golomt = tulbur.find((a) => a.turul === "golomt")?.dun;
    const kapitron = tulbur.find((a) => a.turul === "kapitron")?.dun;
    const tur = tulbur.find((a) => a.turul === "tur")?.dun;
    const qpay = tulbur.find((a) => a.turul === "qpay")?.dun;
    const monpay = tulbur.find((a) => a.turul === "monpay")?.dun;
    const socialpay = tulbur.find((a) => a.turul === "socialpay")?.dun;
    const toki = tulbur.find((a) => a.turul === "toki")?.dun;
    return {
      belen,
      khariltsakh,
      khunglukh,
      khaan,
      tdb,
      khas,
      golomt,
      kapitron,
      tur,
      qpay,
      monpay,
      socialpay,
      toki,
    };
  }, [tulbur]);

  function onChangeDun(v, k) {
    const index = tulbur.findIndex((a) => a.turul === k);
    if (index !== -1) tulbur[index] = { turul: k, dun: v };
    else tulbur.push({ turul: k, dun: v });
    if (
      (niitDun ? niitDun : data?.niitDun) <
      tulbur.reduce((a, b) => a + b.dun, 0)
    ) {
      var iluu =
        tulbur.reduce((a, b) => a + b.dun, 0) -
        (niitDun ? niitDun : data?.niitDun);
      if (index !== -1) tulbur[index] = { turul: k, dun: v - iluu };
      else tulbur.push({ turul: k, dun: v - iluu });
      document.getElementById("TogloomiinTuvTulburTovch").focus();
    }
    if (v === null) {
      tulbur.splice(index, 1);
      if (k === "khunglukh") {
        setKhungulukhEsekh(false);
      }
    } else if (k === "khunglukh") {
      setKhungulukhEsekh(true);
    }
    setTulbur([...tulbur]);
  }

  useEffect(() => {
    if (khungulukhEsekh === false) {
      const index = tulbur.findIndex((a) => a.turul === "khunglukh");
      if (index !== -1) {
        tulbur.splice(index, 1);
        setTulbur([...tulbur]);
      }
    }
  }, [khungulukhEsekh]);

  useEffect(() => {
    if (tulburiinKhelber === "khuvaajTulukh") belenRef.current.focus();
  }, [tulburiinKhelber]);

  function onKeyDown(e) {
    if (e.key === "Enter") {
      switch (e.target.name) {
        case "belen":
          khariltsakhRef.current.focus();
          khariltsakhRef.current.select();
          break;
        case "khariltsakh":
          zeelRef.current.focus();
          zeelRef.current.select();
          break;
        case "bogd":
          khaanRef.current.focus();
          khaanRef.current.select();
          break;

        default:
          break;
      }
    }
  }

  function onDoubleClick(e) {
    const tulukhDun =
      (niitDun ? niitDun : data?.tulukhDun) -
      tulbur
        .filter((a) => a.turul !== e.target.name)
        .reduce((a, b) => a + b.dun, 0);
    if (tulukhDun > 0) {
      const undsenModel = {
        ognoo: new Date(),
        zakhialgiinDugaar: data?.zakhialgiinDugaar,
        baiguullagiinId: data?.baiguullagiinId,
        burtgesenAjiltaniiId: ajiltan?._id,
        burtgesenAjiltaniiNer: ajiltan?.ner,
      };
      if (e.target.name === "khunglukh") {
        setKhunglult({ ...khunglult, khungulukhDun: tulukhDun });
        setKhungulukhEsekh(true);
      }
      const index = tulbur.findIndex((a) => a.turul === e.target.name);
      if (index !== -1)
        tulbur[index] = {
          ...undsenModel,
          turul: e.target.name,
          dun: tulukhDun,
          ognoo: new Date(),
        };
      else {
        tulbur.push({ ...undsenModel, turul: e.target.name, dun: tulukhDun });
      }
      setTulbur([...tulbur]);
    }
    if (tuluv === 2 && songogdsonBank?.talbar === "khaan" && tulukhDun > 0) {
      setTerminal(true);
      axios
        .post(
          "http://127.0.0.1:27028",
          {
            service_name: "doSaleTransaction",
            service_params: {
              db_ref_no: moment().format("YYYYMMDDhhmmss00"),
              amount: String(tulukhDun),
              vatps_bill_type: "1",
            },
          },
          { timeout: 4000000 }
        )
        .then(({ data }) => {
          if (data.status === true && data?.response?.response_code === "000") {
            batalgaajuulya("khaan", data?.response);
          } else if (
            data.status === true &&
            data?.response?.response_code === "366"
          ) {
            tulbur.find((a) => a.turul === "khaan").msg =
              data?.response?.response_msg;
            setTulbur(tulbur);
            toast.warning(data?.response?.response_msg);
            setLoading(false);
            setTerminal(false);
          }
          setSongogdsonBank(null);
        })
        .catch((e) => {
          setTerminal(false);
          setLoading(false);
        });
    }
  }

  const terminaluud = [
    {
      ner: "Хаан банк",
      talbar: "khaan",
      bgColor: "border-green-800",
      ref: khaanRef,
      zurag:
        "data:image/jpeg;base64,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",
    },
    {
      ner: "TDB банк",
      talbar: "tdb",
      bgColor: "border-sky-500",
      ref: tdbRef,
      zurag: "https://tz.mn/storage/uploads/slider/45adc5a14070aa.jpg",
    },
    {
      ner: "Xac банк",
      bgColor: "border-orange-500",
      talbar: "khas",
      ref: khasRef,
      zurag:
        "https://cdn6.aptoide.com/imgs/0/6/d/06df97a06fbc7622a775a7c414b69e87_icon.png",
    },
    {
      ner: "Голомт банк",
      bgColor: "border-purple-500",
      talbar: "golomt",
      ref: golomtRef,
      zurag:
        "https://play-lh.googleusercontent.com/9tUBesUsI4UIkpgO1MPIMLFvhDa_4vZE75TrVAUHFA7a0bJ7IIgeyh2r1QXs9VlmXmkX",
    },
    {
      ner: "Капитрон банк",
      bgColor: "border-red-500",
      talbar: "kapitron",
      ref: kapitronRef,
      zurag:
        "https://play-lh.googleusercontent.com/1PMmu0x2x_07XdPtLyTRe_4cffXDLFCG3xEoUTqUpy3eSJeB-C81dbyzZSnJjW907OA=w240-h480-rw",
    },
    {
      ner: "Төрийн банк",
      bgColor: "border-sky-500",
      talbar: "tur",
      ref: turRef,
      zurag:
        "https://play-lh.googleusercontent.com/KYQyVTgP4ZV60gxNOsKYssScNe17NMgHpO_nRY4WRBYj_4YTZ0e8t6zwh38sTFmyCco",
    },
  ];

  const busadKhelber = [
    {
      ner: "Бэлэн",
      talbar: "belen",
      ref: belenRef,
      bgColor: "from-green-800 to-pink-800 border-green-500",
      zurag:
        "https://static.vecteezy.com/system/resources/previews/012/958/770/original/payment-icon-for-shopping-online-3d-hand-holding-banknote-cartoon-businessman-wearing-suit-holds-money-floating-isolated-on-transparent-withdraw-money-easy-shopping-concept-3d-minimal-rendering-png.png",
    },
    {
      ner: "Дансаар",
      talbar: "khariltsakh",
      ref: khariltsakhRef,
      bgColor: "from-blue-800 to-yellow-700 border-blue-500",
      zurag:
        "https://static.vecteezy.com/system/resources/previews/012/487/823/original/3d-hand-press-pay-button-icon-phone-with-credit-card-float-on-transparent-mobile-banking-online-payment-service-withdraw-money-easy-shop-cashless-society-concept-cartoon-minimal-3d-render-png.png",
    },
  ];

  return (
    <div
      className={`mt-5 grid grid-cols-3 gap-4 overflow-y-auto border-2 p-4`}
      style={{ maxHeight: "calc( 100vh - 26rem )" }}
    >
      <div className="relative col-span-3 flex w-full justify-between rounded-md border dark:text-gray-200">
        <div
          className={`absolute top-0 ${
            tuluv === 1
              ? "right-2/3 bg-blue-600"
              : tuluv === 2
              ? "right-1/3 bg-green-600"
              : "right-0 bg-purple-600"
          } h-full w-1/3 rounded-md transition-all duration-200`}
        />
        <div
          onClick={() => {
            setTuluv(1);
          }}
          className={`z-10 flex h-10 w-1/3 cursor-pointer items-center justify-center rounded-md border text-center font-medium transition-all ${
            tuluv === 1 && "text-lg text-white"
          }`}
        >
          Бусад
        </div>
        <div
          onClick={() => {
            setTuluv(2);
          }}
          className={`z-10 flex h-10 w-1/3 cursor-pointer items-center justify-center rounded-md border text-center font-medium transition-all ${
            tuluv === 2 && "text-lg text-white"
          }`}
        >
          Карт
        </div>
        <div
          onClick={() => {
            setTuluv(3);
          }}
          className={`z-10 flex h-10 w-1/3 cursor-pointer items-center justify-center rounded-md border text-center font-medium transition-all ${
            tuluv === 3 && "text-lg text-white"
          }`}
        >
          Финтек
        </div>
      </div>

      {tuluv === 1 && (
        <div className="col-span-3 flex flex-col text-center text-lg font-medium">
          <div
            className={`grid transition-all ${
              songogdsonBusadTurul ? "grid-cols-6" : "grid-cols-3"
            }`}
          >
            {!songogdsonBusadTurul &&
              busadKhelber?.map((mur) => (
                <div
                  onClick={() => {
                    setSongogdsonBusadTurul(mur);
                  }}
                  className="group relative flex flex-col items-center justify-center py-3 transition-all hover:scale-105"
                  key={mur.ner}
                >
                  {value[mur.talbar] && (
                    <div
                      className={`absolute right-0 top-0 z-50 rounded-md border-2 bg-white px-2 ${mur.bgColor}`}
                    >
                      {value[mur.talbar]}
                    </div>
                  )}
                  <div
                    className={`flex items-center justify-center overflow-hidden  rounded-xl border-2 transition-all group-hover:scale-105 group-hover:shadow-md dark:bg-gradient-to-r ${mur.bgColor}`}
                    style={{ width: 100, height: 100 }}
                  >
                    <Image
                      className="transition-all group-hover:scale-105"
                      preview={false}
                      width={100}
                      src={mur.zurag}
                    />
                  </div>
                  <div className="dark:text-gray-200">{mur.ner}</div>
                </div>
              ))}
          </div>
          {songogdsonBusadTurul && (
            <div className="relative">
              <div
                onClick={() => {
                  setSongogdsonBusadTurul();
                }}
                className="absolute left-5 top-2 flex cursor-pointer dark:text-white"
              >
                <ArrowLeftOutlined />
              </div>
              <Image
                className="overflow-hidden rounded-xl transition-all"
                preview={false}
                width={100}
                src={songogdsonBusadTurul.zurag}
              />
            </div>
          )}
          <div
            className={`relative ${
              songogdsonBusadTurul?.talbar === "khunglukh" ? "h-36" : "h-12"
            } mt-2 w-full overflow-hidden`}
          >
            <div
              className={`absolute w-full transition-all ${
                songogdsonBusadTurul ? "top-0 delay-300" : "-top-full"
              }`}
            >
              {songogdsonBusadTurul &&
                (songogdsonBusadTurul.talbar === "khunglukh" ? (
                  <div>
                    <div className="space-y-2 text-lg font-medium">
                      <div className="flex w-full flex-row items-center bg-gray-100 pr-2 dark:bg-gray-900">
                        <div className="flex items-center justify-center border px-2 ">
                          <Image
                            preview={false}
                            width={40}
                            src={songogdsonBusadTurul.zurag}
                          />
                        </div>
                        <div className="w-3/4 border-b border-l border-t pl-2 text-left dark:text-gray-200">
                          {songogdsonBusadTurul.ner}
                        </div>
                        <InputNumber
                          autoComplete="off"
                          min={0}
                          ref={khunglukhRef}
                          placeholder="Мөнгөн дүн"
                          value={value.khunglukh}
                          name="khunglukh"
                          onDoubleClick={onDoubleClick}
                          onKeyDown={onKeyDown}
                          onChange={(v) => {
                            setKhunglult({ ...khunglult, khungulukhDun: v });
                            onChangeDun(v, "khunglukh");
                          }}
                          style={{ width: "50%" }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </div>
                      {khungulukhEsekh === true && (
                        <div>
                          <div className="flex w-full flex-row bg-green-100 dark:bg-green-900">
                            <div className="w-3/4 border-b border-l border-t pl-10 text-left dark:text-gray-200">
                              {t("Тайлбар")}
                            </div>
                            <Select
                              value={khunglult.tailbarTurul}
                              name="tailbar"
                              onChange={(v) => {
                                setKhunglult({
                                  ...khunglult,
                                  tailbarTurul: v,
                                  tailbar: v !== "Бусад" ? v : undefined,
                                });
                              }}
                              style={{ width: "230px" }}
                              placeholder={t("Тайлбар сонгох")}
                            >
                              <Select.Option key={"Төрсөн өдөр"}>
                                {t("Төрсөн өдөр")}
                              </Select.Option>
                              <Select.Option key={"Хөгжлийн бэрхшээлтэй"}>
                                {t("Хөгжлийн бэрхшээлтэй")}
                              </Select.Option>
                              <Select.Option key={"Бусад"}>
                                {t("Бусад")}
                              </Select.Option>
                            </Select>
                          </div>
                          {khunglult.tailbarTurul === "Бусад" && (
                            <div>
                              <TextArea
                                value={khunglult.tailbar}
                                placeholder={t("Тайлбар оруулна уу")}
                                onChange={(v) => {
                                  setKhunglult({
                                    ...khunglult,
                                    tailbar: v.target.value,
                                  });
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex w-full flex-row items-center bg-gray-100 pr-2 dark:bg-gray-900">
                      <div className="flex h-10 items-center justify-center border px-2 ">
                        <Image
                          preview={false}
                          width={40}
                          src={songogdsonBusadTurul.zurag}
                        />
                      </div>
                      <div className="w-3/4 border-b border-l border-t pl-2 text-left dark:text-gray-200">
                        {songogdsonBusadTurul.ner}
                      </div>
                      <InputNumber
                        placeholder="Мөнгөн дүн"
                        autoComplete="off"
                        ref={songogdsonBusadTurul.ref}
                        value={value[songogdsonBusadTurul.talbar]}
                        name={songogdsonBusadTurul.talbar}
                        onDoubleClick={onDoubleClick}
                        onKeyDown={onKeyDown}
                        onChange={(v) =>
                          onChangeDun(v, songogdsonBusadTurul.talbar)
                        }
                        style={{ width: "50%" }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {tuluv === 2 && (
        <div className="col-span-3 flex flex-col text-center text-lg font-medium">
          <div
            className={`grid transition-all ${
              songogdsonBank ? "grid-cols-6" : "grid-cols-3"
            }`}
          >
            {!songogdsonBank &&
              terminaluud?.map((mur) => (
                <div
                  onClick={() => setSongogdsonBank(mur)}
                  className="relative flex flex-col items-center justify-center py-3 transition-all hover:scale-110"
                  key={mur.ner}
                >
                  {value[mur.talbar] && (
                    <div
                      className={`absolute right-0 top-0 z-50 rounded-md border-2 bg-white px-2 ${mur.bgColor}`}
                    >
                      {value[mur.talbar]}
                    </div>
                  )}
                  <Image
                    className="overflow-hidden rounded-xl transition-all"
                    preview={false}
                    width={100}
                    src={mur.zurag}
                  />
                </div>
              ))}
          </div>
          {songogdsonBank && (
            <div className="relative">
              <div
                onClick={() => setSongogdsonBank()}
                className="absolute left-5 top-2 flex cursor-pointer dark:text-white"
              >
                <ArrowLeftOutlined />
              </div>
              <Image
                className="overflow-hidden rounded-xl transition-all"
                preview={false}
                width={100}
                src={songogdsonBank.zurag}
              />
            </div>
          )}
          <div className="relative mt-2 h-12 w-full overflow-hidden">
            <div
              className={`absolute w-full transition-all ${
                songogdsonBank ? "top-0 delay-300" : "-top-full"
              }`}
            >
              {songogdsonBank && (
                <div>
                  <div className="flex w-full flex-row items-center bg-gray-100 pr-2 dark:bg-gray-900">
                    <div className="flex items-center justify-center border px-2 ">
                      <Image
                        preview={false}
                        width={40}
                        src={songogdsonBank.zurag}
                      />
                    </div>
                    <div className="w-3/4 border-b border-l border-t pl-2 text-left dark:text-gray-200">
                      {songogdsonBank.ner}
                    </div>
                    <InputNumber
                      placeholder="Мөнгөн дүн"
                      autoComplete="off"
                      ref={songogdsonBank.ref}
                      value={value[songogdsonBank.talbar]}
                      name={songogdsonBank.talbar}
                      onDoubleClick={onDoubleClick}
                      onKeyDown={onKeyDown}
                      onChange={(v) => onChangeDun(v, songogdsonBank.talbar)}
                      style={{ width: "50%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tuluv === 3 && (
        <div className="col-span-3">
          <div className="grid grid-cols-3 transition-all">
            {!songogdTulburiinKhelber &&
              qpayTulburiinKhelberuud.map((mur) => {
                return (
                  <div
                    onClick={() =>
                      mur.ner === "qpay" && qpayerTulukh === "Tulugdsun"
                        ? toast.warning("Qpay-ээр төлөгдсөн")
                        : setSongogdsonTulburiinKhelber(mur)
                    }
                    key={mur.ner}
                    className="relative flex flex-col items-center justify-center py-3 transition-all hover:scale-110"
                  >
                    {value[mur.ner] && (
                      <div
                        className={`absolute right-0 top-0 z-50 rounded-md border-2 bg-white px-2 ${mur.bgColor}`}
                      >
                        {value[mur.ner]}
                      </div>
                    )}
                    <Image
                      className="overflow-hidden rounded-lg"
                      preview={false}
                      width={100}
                      src={mur.src}
                    />
                  </div>
                );
              })}
            {songogdTulburiinKhelber && (
              <div className="relative col-span-3 flex w-full justify-center">
                <div
                  onClick={() => {
                    setSongogdsonTulburiinKhelber();
                    songogdTulburiinKhelber.ner === "qpay" &&
                      !khuleegdejBuiQpay &&
                      onChangeDun(null, "qpay");
                  }}
                  className="absolute left-5 top-2 flex cursor-pointer text-lg transition-all hover:text-2xl hover:text-blue-400 dark:text-white"
                >
                  <ArrowLeftOutlined />
                </div>
                <Image
                  className="overflow-hidden rounded-xl transition-all"
                  preview={false}
                  width={100}
                  src={songogdTulburiinKhelber.src}
                />
              </div>
            )}
          </div>
          <div className="relative mt-2 h-12 w-full overflow-hidden">
            <div
              className={`absolute w-full transition-all ${
                songogdTulburiinKhelber ? "top-0 delay-300" : "-top-full"
              }`}
            >
              {songogdTulburiinKhelber && (
                <div>
                  {songogdTulburiinKhelber?.ner === "qpay" ? (
                    <div className="flex w-full flex-row items-center bg-gray-100 pr-2 dark:bg-gray-900">
                      <div className="flex items-center justify-center border px-2 ">
                        <Image
                          preview={false}
                          width={40}
                          src={songogdTulburiinKhelber.src}
                        />
                      </div>
                      <div className="w-3/4 border-b border-l border-t pl-2 text-left dark:text-gray-200">
                        {songogdTulburiinKhelber.ner}
                      </div>
                      <InputNumber
                        placeholder="Мөнгөн дүн"
                        autoComplete="off"
                        ref={songogdTulburiinKhelber.ref}
                        value={value[songogdTulburiinKhelber.ner]}
                        name={songogdTulburiinKhelber.ner}
                        onDoubleClick={onDoubleClick}
                        onKeyDown={onKeyDown}
                        onChange={(v) => {
                          onChangeDun(v, songogdTulburiinKhelber.ner);
                          songogdTulburiinKhelber.ner === "qpay" &&
                            (setQpayerTulukh(), setKhuleegdejBuiQpay());
                        }}
                        style={{ width: "50%" }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </div>
                  ) : (
                    <div className="animate-pulse text-center text-lg">
                      Тун удахгүй...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KhuvaajTulukh;
