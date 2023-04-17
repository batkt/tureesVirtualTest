import { Steps, Button, Spin, message, Switch, Form } from "antd";
import React from "react";
import formatNumber from "tools/function/formatNumber";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import moment from "moment";
import KhuvaajTulukh from "./KhuvaajTulukh";
import EBarimt from "./EBarimt";
import QRCode from "react-qr-code";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useEffect } from "react";
import { t } from "i18next";
import { useQRCode } from "next-qrcode";
//#endregion

function Tulbur(
  { destroy, data, token, ajiltan, baiguullaga, barilgiinId, onRefresh },
  ref
) {
  const { Canvas } = useQRCode();
  const [alkham, setAlkham] = React.useState(
    data?.tulburTulsunEsekh === true ? 2 : 1
  );
  const [khaanbank, setTerminal] = React.useState(false);
  const [tulbur, setTulbur] = React.useState((data?.dutuuDun ? [] : data?.tulbur) || []);
  const [eBarimt, setEBarimt] = React.useState(null);
  const [baiguullagaEsekh, setBaiguullagaEsekh] = React.useState(false);
  const [irgenEsekh, setIrgenEsekh] = React.useState(false);
  const [register, setRegister] = React.useState("");
  const [baiguullagiinMedeelel, setBaiguullaga] = React.useState();
  const [barimtKhevlekhEsekh, setBarimtKhevlekhEsekh] = React.useState(true);
  const [khunglult, setKhunglult] = React.useState({khungulukhDun: undefined , tailbar: undefined, tailbarTurul: undefined})
  const [khungulukhEsekh, setKhungulukhEsekh] = React.useState(false);
  const [ qpayerTulukh, setQpayerTulukh ] = React.useState(false)
  const [ loading, setLoading ] = React.useState(false)

  const eBarimtRef = React.useRef(null);

  const handlePrint = useReactToPrint({
    content: () => eBarimtRef.current,
  });

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        onRefresh();
        destroy();
      },
    }),
    []
  );

  function ebarimtAvya(id) {
    setLoading(true)
    if (!!eBarimt) handlePrint();
    else {
      if (baiguullagaEsekh === true && register?.toString().length !== 7) {
        message.warning(t("Байгууллагын регистр оруулна уу"));
        return;
      }
      const body = {
        id,
        ebarimtiinTurul: "togloom"
      };
      if (baiguullagaEsekh || irgenEsekh) {
        body.register = register;
        if (baiguullagaEsekh) body.turul = "3";
        else if (irgenEsekh) body.turul = "1";
      }

      uilchilgee(token)
        .post("/ebarimtShivye", body)
        .then(({ data }) => {
          if (data.success === true) {
            setEBarimt(data);
            setLoading(false)
            onRefresh();
          }
        })
        .catch(aldaaBarigch);
    }
  }

  useEffect(()=> {
    if (!!eBarimt) {      
      handlePrint();
    }
  },[eBarimt])

  useEffect(()=> {
    if (loading === true) {
      setTimeout(() => {
        setLoading(false)
      }, 8000);
    }
  },[loading])

  function batalgaajuulya(turul, val) {    
    if (turul === "khaan") {
      tulbur.find((a) => a.turul === "khaan").khariu = val;
      guilgeeniiTuukhKhadgalya(tulbur, () => {setAlkham(2); onRefresh()});
      setTulbur(tulbur);
    } else if ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) === tulbur.reduce((a, b) => a + b.dun, 0))
      setAlkham(2);
  }

  function batalgaajuuljDuusgakh() {
    setTerminal(false);
    tulbur.find((a) => a.turul === "khaan").isPayed = true;
    setTulbur([...tulbur]);
    if ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) === tulbur.reduce((a, b) => a + b.dun, 0)) {
      guilgeeniiTuukhKhadgalya(tulbur, () => {setAlkham(2); onRefresh()});
      setAlkham(2);
    }
  }

  function guilgeeniiTuukhKhadgalya(tulbur, callback) {
    if (khungulukhEsekh === true) {
      if (!khunglult.khungulukhDun || khunglult.khungulukhDun === "") {
        message.warn(t("Хөнгөлөх дүн оруулна уу"))
        return
      }
      if (!khunglult.tailbar || khunglult.tailbar === "") {
        message.warn(t("Хөнгөлөх шалтгаан оруулна уу"))
        return
      }
      
    }
    var index = tulbur.findIndex(a=> a.turul === "khunglukh")
    if (index > -1) {
      tulbur[index].tailbar = khunglult.tailbar
    }
    
    tulbur.forEach((a) => {
      a.ognoo = new Date();
        (a.baiguullagiinId = baiguullaga?._id),
        (a.barilgiinId = barilgiinId),
        (a.burtgesenAjiltan = ajiltan._id),
        (a.burtgesenAjiltaniiNer = ajiltan.ner),
        (a.togloominId = data._id)
    });
    uilchilgee(token)
      .post("/togloomiinTulburTulye", { tulbur, id:data._id })
      .then(callback)
      .catch(aldaaBarigch);
  }

  function batalgaajuulaltKhiiya() {
    if (((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
    tulbur
      .reduce((a, b) => a + b.dun, 0) || 0) > 0) {
      message.warn("Төлбөр дутуу байна!")
      return
    }
    if (((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
    tulbur
      .reduce((a, b) => a + b.dun, 0) || 0) < 0) {
      message.warn("Төлбөрийн дүнгээс хэтэрсэн байна!")
      return
    }
    const dun = tulbur.find((a) => a.turul === "khaan")?.dun;
    if (dun > 0) {
      axios
        .post(
          "http://127.0.0.1:27028",
          {
            service_name: "doSaleTransaction",
            service_params: {
              db_ref_no: moment().format("YYYYMMDDhhmmss00"),
              amount: String(dun),
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
            message.warning(data?.response?.response_msg);
          }
          setSongogdsonBank(null);
        })
        .catch(aldaaBarigch);
      setTerminal(true);
    }
      guilgeeniiTuukhKhadgalya(tulbur, () => {setAlkham(2); onRefresh()});
  }

  function khaaya() {
    destroy();
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
    <div className="w-full h-full">
      {eBarimt && (
          <div className="hidden">
            <div className="p-2" style={{ minWidth: "20rem" }} ref={eBarimtRef}>
              <table className="w-full">
                <colgroup>
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                  <col className="w-1/6" />
                </colgroup>
                <tbody className="text-xs">
                  <tr>
                    <td colSpan={6} className="text-center border">
                      {`${baiguullagaEsekh ? "ААН-д" : "Иргэнд"} очих баримт`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="text-center border">
                      {baiguullaga?.ner}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="font-medium border">
                      {t("Борлуулагч")}
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan={3}>
                      {t("Огноо")}
                    </td>
                    <td className="border" colSpan={3}>
                      {moment(eBarimt?.date).format("YYYY/MM/DD hh:mm:ss")}
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan={3}>
                      {t("ТТД")}
                    </td>
                    <td className="border" colSpan={3}>
                      {eBarimt?.registerNo}
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan={3}>
                      {t("ДДТД")}
                    </td>
                    <td className="border" colSpan={3}>
                      {eBarimt?.billId}
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan={3}>
                      {t("Касс")}
                    </td>
                    <td className="border" colSpan={3}>
                      {eBarimt?.posNo}
                    </td>
                  </tr>
                  <tr>
                    <td className="border" colSpan={3}>
                      {t("Кассчин")}
                    </td>
                    <td className="border" colSpan={3}>
                      {ajiltan?.ner}
                    </td>
                  </tr>
                  {baiguullagaEsekh && (
                    <>
                      <tr>
                        <td className="border" colSpan={6}>
                          {t("Худалдан авагч")}
                        </td>
                      </tr>
                      <tr>
                        <td className="border" colSpan={1}>
                          {t("ТТД")}
                        </td>
                        <td className="border" colSpan={5}>
                          {register}
                        </td>
                      </tr>
                      <tr>
                        <td className="border" colSpan={1}>
                          {t("Нэр")}
                        </td>
                        <td className="border" colSpan={5}>
                          {baiguullagiinMedeelel?.name}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td colSpan={6} className="border">
                      <br />
                    </td>
                  </tr>
                  <tr>
                    <td className="border text-center" colSpan={3}>
                      {t("Барааны нэр")}
                    </td>
                    <td className="border text-center">{t("Тоо")}</td>
                    <td className="border text-center">{t("Нэгж")}</td>
                    <td className="border text-center">{t("Дүн")}</td>
                  </tr>
                  {eBarimt?.stocks?.map((mur, index) => (
                    <tr key={`${index}-zakhialga`}>
                      <td colSpan={3} className="border text-right">
                        {mur.name}
                      </td>
                      <td className="border text-right">{mur.qty}</td>
                      <td className="border text-right">
                        {formatNumber(mur.unitPrice, 2)}
                      </td>
                      <td className="border text-right">
                        {formatNumber(mur.totalAmount, 2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={5} className="text-right border">
                      {t("НӨАТ-гүй дүн")}
                    </td>
                    <td className="border text-right">
                      {formatNumber(data.niitDun / 1.1, 2)}
                    </td>
                  </tr>
                  {data?.khungulukhKhuvi && (
                    <tr>
                      <td colSpan={5} className="text-right border">
                        {t("Хөнгөлөлт")}
                      </td>
                      <td className="border text-right">
                        {formatNumber(data.niitUndsenDun - data.niitDun)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={5} className="text-right border">
                      {t("НӨАТ-н дүн")}
                    </td>
                    <td className="border text-right">
                      {formatNumber(eBarimt?.vat, 2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="text-right border">
                      {t("Төлөх дүн")}
                    </td>
                    <td className="border text-right">
                      {formatNumber(eBarimt?.amount)}
                    </td>
                  </tr>
                  {tulbur?.belen && (
                    <tr>
                      <td colSpan={5} className="text-right border">
                        {t("Бэлнээр")}
                      </td>
                      <td className="border text-right">
                        {formatNumber(tulbur?.belen)}
                      </td>
                    </tr>
                  )}
                  {tulbur?.belenBus && (
                    <tr>
                      <td colSpan={5} className="text-right border">
                        {t("Бэлэн бусаар")}
                      </td>
                      <td className="border text-right">
                        {formatNumber(tulbur?.belenBus)}
                      </td>
                    </tr>
                  )}
                  {tulbur?.khariult && (
                    <tr>
                      <td colSpan={5} className="text-right border">
                        {t("Хариулт")}
                      </td>
                      <td className="border text-right">
                        {formatNumber(tulbur?.khariult)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={4} className="border">{`Е-Баримт ${baiguullagaEsekh ? "" : "уншуулах"
                      } дүн`}</td>
                    <td colSpan={2} className="border text-right">
                      {formatNumber(eBarimt?.amount)}
                    </td>
                  </tr>
                  {!baiguullagaEsekh && (
                    <tr>
                      <td colSpan={4} className="border">
                        {t("Сугалааны дугаар")}
                      </td>
                      <td colSpan={2} className="border">
                        {eBarimt?.lottery}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={6}>
                      <div className="w-full flex justify-center p-5">
                        <div className="w-40 h-40">
                          <QRCode value={eBarimt?.qrData} size={160} />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6}>
                      <div className="w-full border-dashed border-t-2 pt-5 mt-3 border-black h-full flex flex-col justify-center items-center">
                        <div className=" text-justify text-xs"><div>Эхлэх хугацаа: {moment(data?.ekhlekhTsag).format("YYYY-MM-DD HH:mm")}</div> <div>Дуусах хугацаа: {moment(data?.duusakhTsag).format("YYYY-MM-DD HH:mm")}</div></div>
                        <div className="w-full justify-center flex items-center"><Canvas
                          text={moment(data?.duusakhTsag).format("YYYYMMDDHHmmss")}
                          options={{
                            level: 'M',
                            margin: 3,
                            scale: 4,
                            width: 200,
                            color: {
                              dark: '#000000',
                              light: '#FFFFFF',
                            },
                          }}
                        />
                        </div>
                        <div className="text-center text-xs max-w-[400px]">Энэхүү QR код нь тоглох хүчинтэй хугацаанд зөвхөн нэг удаа нэвтэрч ороход ашиглагдахыг анхаарна уу!</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      <div className="pb-2">
        <Steps className="hidden" current={alkham}>
          <Steps.Step
            key="Төлбөр төлөх"
            subTitle={<span className="dark:text-gray-200">{t("Төлбөр төлөх")}</span>}
            onClick={() => setAlkham(1)}
          />
          <Steps.Step
            key="Төлбөрын баримт"
            subTitle={
              <span className="dark:text-gray-200">{t("Төлбөрын баримт")}</span>
            }
            onClick={() => setAlkham(2)}
          />
        </Steps>
      </div>
      <div className={`${alkham === 1 ? "" : "hidden"}`}>
        <div className="w-full table text-lg font-medium">
          <div className="table-row">
            <div className="table-cell p-2 border-dashed border-b-2 dark:text-gray-200">
              {t("Төлөх дүн")}
            </div>
            <div className="table-cell p-2 text-right border-dashed border-b-2 dark:text-gray-200">
              {formatNumber(
                (data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
                tulbur
                  .reduce((a, b) => a + b.dun, 0) || 0
              )}{" "}
              ₮
            </div>
          </div>
        </div>
        <KhuvaajTulukh
        token={token}
          tulbur={tulbur}
          data={data}
          qpayerTulukh={qpayerTulukh}
          setQpayerTulukh={setQpayerTulukh}
          khunglult={khunglult}
          setKhunglult={setKhunglult}
          setTulbur={setTulbur}
          batalgaajuulya={batalgaajuulya}
          ajiltan={ajiltan}
          khungulukhEsekh={khungulukhEsekh}
          setKhungulukhEsekh={setKhungulukhEsekh}
        />
        {khaanbank && tulbur.find((a) => a.turul === "khaan") && (
          <div className="col-span-3 flex flex-col items-center space-y-2 relative mt-5">
            <img
              src={"https://www.khanbank.com/assets/logos/khanbank-mn.png"}
              className="w-1/2"
            />
            <div id="loading">
              <Spin
                style={{ fontSize: "1.5rem" }}
                size="large"
                tip={t("Карт аа уншуулна уу!!")}
              />
            </div>
            <div className="flex flex-row space-x-5">
              <Button
                danger
                onClick={() => setTerminal(false)}
                icon={<CloseOutlined />}
              >
                {t("Цуцлах")}
              </Button>
              <Button
                type="primary"
                onClick={batalgaajuuljDuusgakh}
                icon={<CheckOutlined />}
              >
                {t("Баталгаажуулах")}
              </Button>
            </div>
          </div>
        )}
        <div className="w-full table text-lg font-medium mt-5">
          {tulbur.length > 0 && (
            <div className="table-row">
              <div className="table-cell p-2 border-dashed border-t-2 dark:text-gray-200">
                {t("Төлсөн дүн")}
              </div>
              <div className="table-cell p-2 text-right border-dashed border-t-2 dark:text-gray-200">
                {formatNumber(
                  tulbur
                    .reduce((a, b) => a + b.dun, 0)
                )}{" "}
                ₮
              </div>
            </div>
          )}          
        </div>
      </div>
      <EBarimt
        eBarimtRef={eBarimtRef}
        eBarimt={eBarimt}
        alkham={alkham}
        data={data}
        tulbur={tulbur}
        handlePrint={handlePrint}
        baiguullaga={baiguullaga}
        ajiltan={ajiltan}
        baiguullagaEsekh={baiguullagaEsekh}
        setBaiguullagaEsekh={setBaiguullagaEsekh}
        register={register}
        setRegister={setRegister}
        baiguullagiinMedeelel={baiguullagiinMedeelel}
        setBaiguullaga={setBaiguullaga}
        irgenEsekh={irgenEsekh}
        setIrgenEsekh={setIrgenEsekh}
        barimtKhevlekhEsekh={barimtKhevlekhEsekh}
        setBarimtKhevlekhEsekh={setBarimtKhevlekhEsekh}
      />     
      <div className="flex flex-row justify-between mt-5">
        <Button type="primary" danger onClick={khaaya}>
          {t("Хаах")}
        </Button>
        {alkham === 1 && !qpayerTulukh && (
          <Button type="primary" id="TogloomiinTuvTulburTovch" onClick={batalgaajuulaltKhiiya}>
            {t("Төлбөр төлөх")}
          </Button>
        )}

        {alkham === 2 && barimtKhevlekhEsekh === true && (
          <Button type="primary" loading={loading} onClick={() => ebarimtAvya(data?._id)}>
            {t("Хэвлэх")}
          </Button>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(Tulbur);
