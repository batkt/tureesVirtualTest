import { Button, Form, InputNumber, Select, Switch, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { t } from "i18next";
import React, { useEffect } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function KhuvaajTulukh({ tulburiinKhelber, data, tulbur, setTulbur, ajiltan, khunglult, setKhunglult, khungulukhEsekh, setKhungulukhEsekh, qpayerTulukh, setQpayerTulukh, token }) {
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
    const khunglukh = tulbur.find((a) => a.turul === "khunglukh")?.dun;
    const khariltsakh = tulbur.find((a) => a.turul === "khariltsakh")?.dun;
    const bogd = tulbur.find((a) => a.turul === "bogd")?.dun;
    const khaan = tulbur.find((a) => a.turul === "khaan")?.dun;
    const tdb = tulbur.find((a) => a.turul === "tdb")?.dun;
    const khas = tulbur.find((a) => a.turul === "khas")?.dun;
    const golomt = tulbur.find((a) => a.turul === "golomt")?.dun;
    const kapitron = tulbur.find((a) => a.turul === "kapitron")?.dun;
    const tur = tulbur.find((a) => a.turul === "tur")?.dun;
    return {
      belen,
      khariltsakh,
      bogd,
      khaan,
      khunglukh,
      tdb,
      khas,
      golomt,
      kapitron,
      tur,
    };
  }, [tulbur]);

  function onChangeDun(v, k) {
    const index = tulbur.findIndex((a) => a.turul === k);
    if (index !== -1) tulbur[index] = { turul: k, dun: v };
    else tulbur.push({ turul: k, dun: v });
    if ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) < tulbur.reduce((a, b) => a + b.dun, 0)) {
      var iluu = tulbur.reduce((a, b) => a + b.dun, 0) - (data?.dutuuDun ? data?.dutuuDun : data?.niitDun)
      if (index !== -1) tulbur[index] = { turul: k, dun: v - iluu };
      else tulbur.push({ turul: k, dun: v - iluu }); 
      document.getElementById("TogloomiinTuvTulburTovch").focus()
    }
    setTulbur([...tulbur]);
  }

  useEffect(()=> {
    if (khungulukhEsekh === false) {
      const index = tulbur.findIndex((a) => a.turul === "khunglukh");
      if ( index !== -1) {
        tulbur.splice(index, 1);
        setTulbur([...tulbur]);
      }
    }
  },[khungulukhEsekh])

  function qpayAvakh() {
    var dun = data?.niitDun - tulbur.reduce((a, b) => a + b.dun, 0);
    if (dun === 0) {
     message.warning("Төлөх дүн байхгүй байна");
     return 
   }
     
     uilchilgee(token)
     .post("/qpayGargaya", {dun, zakhialgiinDugaar: `${data?._id}${dun}`})
     .then(({data})=>{
      onChangeDun(dun, "qpay")
       setQpayerTulukh(data.khariu); 
     })
     .catch(aldaaBarigch)
   }

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
    (data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
      tulbur
        .filter((a) => a.turul !== e.target.name)
        .reduce((a, b) => a + b.dun, 0);
    if (tulukhDun > 0) {
      const undsenModel = {
        ognoo: new Date(),
        zakhialgiinDugaar: data?.zakhialgiinDugaar,
        baiguullagiinId: data?.baiguullagiinId,
        burtgesenAjiltan: ajiltan?._id,
        burtgesenAjiltaniiNer: ajiltan?.ner,
      };
      if (e.target.name === "khunglukh") {
        setKhunglult({...khunglult, khungulukhDun: tulukhDun})
      }
      const index = tulbur.findIndex((a) => a.turul === e.target.name);
      if (index !== -1)
        tulbur[index] = {
          ...undsenModel,
          turul: e.target.name,
          dun: tulukhDun,
          ognoo: new Date(),
        };
      else
        tulbur.push({ ...undsenModel, turul: e.target.name, dun: tulukhDun });
      setTulbur([...tulbur]);
    }
  }

  const terminaluud = [
    {
      ner: "Хаан банк",
      talbar: "khaan",
      ref: khaanRef,
    },
    {
      ner: "TDB банк",
      talbar: "tdb",
      ref: tdbRef,
    },
    {
      ner: "Xac банк",
      talbar: "khas",
      ref: khasRef,
    },
    {
      ner: "Голомт банк",
      talbar: "golomt",
      ref: golomtRef,
    },
    {
      ner: "Капитрон банк",
      talbar: "kapitron",
      ref: kapitronRef,
    },
    {
      ner: "Төрийн банк",
      talbar: "tur",
      ref: turRef,
    },
  ];

  return (
    <div className={`grid grid-cols-3 gap-4 mt-5 border-2 p-4 overflow-y-auto`} style={{maxHeight: "calc( 100vh - 26rem )"}}>
      <div className="flex w-full col-span-3"><Button onClick={()=> {!qpayerTulukh ? qpayAvakh() : (setQpayerTulukh(), onChangeDun(null, "qpay"))}} style={{width: "100%"}}>{!!qpayerTulukh ? t("Буцах") : t("QPay-ээр төлөх")}</Button></div>
      {!!qpayerTulukh 
      ? <div className="flex col-span-3 justify-center items-center w-full">
        <img src={qpayerTulukh?.qr_image}/>
      </div> 
      : <div className="col-span-3">
        <Form.Item labelCol={{ flex: '110px'}} label={t("Хөнгөлөх эсэх")}> 
        <Switch disabled={!value.khunglukh && ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
            tulbur
              .reduce((a, b) => a + b.dun, 0) || 0) === 0} checked={khungulukhEsekh} onChange={(v)=> setKhungulukhEsekh(v) }/>
        </Form.Item>
        {khungulukhEsekh === true && <div className="font-medium text-lg space-y-2">          
          <div className="w-full flex flex-row bg-green-100 dark:bg-green-900">
          <div className="w-3/4 pl-10 text-left border-b border-t border-l dark:text-gray-200">
          {t("Хөнгөлөх дүн")}
          </div>
          <InputNumber
          disabled={!value.khunglukh && ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
            tulbur
              .reduce((a, b) => a + b.dun, 0) || 0) === 0}
            autoComplete="off"
            min={0}
            ref={khunglukhRef}
            value={value.khunglukh}
            name="khunglukh"
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown}
            onChange={(v) => {setKhunglult({...khunglult, khungulukhDun: v}); onChangeDun(v, "khunglukh")}}
            style={{ width: "25%" }}            
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </div>
        <div className="w-full flex flex-row bg-green-100 dark:bg-green-900">
          <div className="w-3/4 pl-10 text-left border-b border-t border-l dark:text-gray-200">
           {t("Тайлбар")}
          </div>
          <Select
            value={khunglult.tailbarTurul}
            name="tailbar"
            onChange={(v) => {setKhunglult({...khunglult, tailbarTurul: v, tailbar: v !== "Бусад" ? v : undefined})}}
            style={{ width: "230px" }}
            placeholder={t("Тайлбар сонгох")}
          >
            <Select.Option key={"Төрсөн өдөр"}>{t("Төрсөн өдөр")}</Select.Option>
            <Select.Option key={"Хөгжлийн бэрхшээлтэй"}>{t("Хөгжлийн бэрхшээлтэй")}</Select.Option>
            <Select.Option key={"Бусад"}>{t("Бусад")}</Select.Option>
          </Select>
        </div>
        {khunglult.tailbarTurul === "Бусад" && <div>
          <TextArea value={khunglult.tailbar} placeholder={t("Тайлбар оруулна уу")} onChange={(v)=> {setKhunglult({...khunglult, tailbar: v.target.value})}}/>
          </div>}
        </div>}
      </div>}
      <div className="col-span-3 flex flex-col text-center cursor-pointer font-medium text-lg">
        <div className="w-full flex flex-row bg-gray-100 dark:bg-gray-900">
          <div className="w-3/4 pl-10 text-left border-b border-t border-l dark:text-gray-200">
            {t("Бэлэн")}
          </div>
          <InputNumber
          disabled={!value.belen && ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
            tulbur
              .reduce((a, b) => a + b.dun, 0) || 0) === 0}
          min={0} 
            autoComplete="off"
            ref={belenRef}
            value={value.belen}
            name="belen"
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown}
            onChange={(v) => onChangeDun(v, "belen")}
            style={{ width: "25%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </div>
        <div className="w-full border-l border-r h-2" />
        <div className="w-full flex flex-row bg-gray-100 dark:bg-gray-900">
          <div className="w-3/4 pl-10 text-left border-b border-t border-l dark:text-gray-200">
            {t("Харилцах")}
          </div>
          <InputNumber
          disabled={!value.khariltsakh && ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
            tulbur
              .reduce((a, b) => a + b.dun, 0) || 0) === 0}
          min={0}
            autoComplete="off"
            ref={khariltsakhRef}
            value={value.khariltsakh}
            name="khariltsakh"
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown}
            onChange={(v) => onChangeDun(v, "khariltsakh")}
            style={{ width: "25%" }}            
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </div>
        <div className="w-full border-l border-r h-2 " />
        <div className="w-full flex flex-row bg-gray-100 dark:bg-gray-900">
          <div className="w-3/4 pl-10 text-left border-b border-t border-l dark:text-gray-200">
            {t("Богд банк")}
          </div>
          <InputNumber
          disabled={!value.bogd && ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
            tulbur
              .reduce((a, b) => a + b.dun, 0) || 0) === 0}
            autoComplete="off"
            ref={zeelRef}
            min={0}
            value={value.bogd}
            name="bogd"
            onDoubleClick={onDoubleClick}
            onKeyDown={onKeyDown}
            onChange={(v) => onChangeDun(v, "bogd")}
            style={{ width: "25%" }}            
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </div>
        {terminaluud?.map((mur) => (
          <div key={mur.ner}>
            <div className="w-full border-l border-r h-2 " />
            <div className="w-full flex flex-row bg-gray-100 dark:bg-gray-900">
              <div className="w-3/4 pl-10 border-b border-t text-left border-l dark:text-gray-200">
                {t(`${mur.ner}`)}
              </div>
              <InputNumber
              disabled={!value[mur.talbar] && ((data?.dutuuDun ? data?.dutuuDun : data?.niitDun) -
                tulbur
                  .reduce((a, b) => a + b.dun, 0) || 0) === 0}
                autoComplete="off"
                ref={mur.ref}
                min={0}
                value={value[mur.talbar]}
                name={mur.talbar}
                onDoubleClick={onDoubleClick}
                onKeyDown={onKeyDown}
                onChange={(v) => onChangeDun(v, mur.talbar)}
                style={{ width: "25%" }}               
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
  );
}

export default KhuvaajTulukh;
