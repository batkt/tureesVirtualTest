import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, InputNumber, message } from "antd";
import React, { useImperativeHandle, useRef, useState } from "react";
import uilchilgee from "services/uilchilgee";

function TariffNemekh({data, baiguullaga, barilgiinId, token, destroy }, ref) {
    const [ajliinUdur, setAjliinUdur] = useState([]);
    const [tariff, setTariff] = useState([])
    useImperativeHandle(
        ref,
        () => ({
          ilgeeye() {
            
          },
          khaaya() {
            destroy();
          },
        }),
        [ajliinUdur, tariff, baiguullaga, barilgiinId, token]
      );
    
    const dolooKhonog = [
        { id: "1", ner: "Даваа" },
        { id: "2", ner: "Мягмар" },
        { id: "3", ner: "Лхагва" },
        { id: "4", ner: "Пүрэв" },
        { id: "5", ner: "Баасан" },
        { id: "6", ner: "Бямба" },
        { id: "0", ner: "Ням" },
      ];

  return (
    <div>
    <div className="grid grid-cols-7 gap-2">
          {dolooKhonog.map((a, i) => {
            return (
              <button
                className={`border rounded-md shadow-md w-full ${
                  ajliinUdur?.find((c) => c === a.id) !== undefined &&
                  "bg-blue-800 text-white"
                }`}
                key={i}
                onClick={() => {
                  (ajliinUdur.find((c) => c === a.id) === undefined
                    ? setAjliinUdur([...ajliinUdur, a.id])
                    : setAjliinUdur(ajliinUdur.filter((d) => d !== a.id)));                    
                }}
              >
                {a.ner}
              </button>
            );
          })}          
        </div>
        <Button className="mt-5" onClick={()=> {
                    setTariff([...tariff, {id: tariff.length}])                   
                }}>Tariff нэмэх</Button>
                <div className="space-y-3 mt-5">
                    {tariff.map((a, i)=> {
                        return <div className="flex bg-green-50 relative shadow-md  w-full border rounded-md justify-between px-10 py-2 gap-5" key={i}>
                            <div onClick={()=> setTariff(tariff.filter((a, index)=> index !== i))} className="flex absolute right-2 top-3 hover:text-red-500 transition-all text-lg"><CloseCircleOutlined/></div>
                            <InputNumber onChange={(v)=>{ tariff[i].minut = v; setTariff(tariff)}} className="w-full" placeholder="Минут"/>
                            <InputNumber onChange={(v)=> { tariff[i].tariff = v; setTariff(tariff)}} className="w-full" placeholder="Tariff"/>
                        </div>
                    })}
                </div>
        </div>
  );
}

export default React.forwardRef(TariffNemekh);