import {
  Dropdown,
  Empty,
  Input,
} from "antd";
import {
  SolutionOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";

const KhariltsagchiinLavlakh = ({
  onChangeRegister,
  baiguullagaEsekh,
  baiguullaga,
  barilgiinId,
  focuser,
  khadgalsabRegister,
}) => {
  const [register, setRegister] = useState(null)
  const [dropDownNeekhEsekh, setDropDownNeekhEsekh] = useState(false);
  const searchKeys = ["ner", "register"];
  const kharitsagchQuery = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      baiguullagiinId: baiguullaga?._id,
      turul: baiguullagaEsekh ? "ААН" : "Иргэн"
    };
  }, [baiguullaga, barilgiinId, baiguullagaEsekh]);
  const khariltsagchiinGaralt = useJagsaalt("/khariltsagch", kharitsagchQuery, undefined, undefined, searchKeys);

  useEffect(() => {
    setRegister(null)
  }, [baiguullagaEsekh])

  useEffect(() => {
    if (!!khadgalsabRegister) {
      setRegister(khadgalsabRegister)
    }
  }, [])

  function onScroll(e) {
    if (
      e.target.scrollHeight - e.target.scrollTop - 1 < e.target.clientHeight &&
      !!khariltsagchiinGaralt &&
      khariltsagchiinGaralt?.data?.jagsaalt.length === 20
    ) {
      khariltsagchiinGaralt.setKhuudaslalt((kh) => ({
        ...kh,
        khuudasniiDugaar: kh.khuudasniiDugaar + 1,
        khuudasniiKhemjee: 20,
        jagsaalt: [...kh.jagsaalt || [], ...khariltsagchiinGaralt?.data.jagsaalt],
      }));
    }
  }
  useEffect(() => {
    khariltsagchiinGaralt.setKhuudaslalt((a) => ({
      ...a,
      khuudasniiKhemjee: 20,
    }))
  }, []);

  function khariltsagchKhaikh(v) {
    khariltsagchiinGaralt.setKhuudaslalt((a) => ({
      ...a,
      jagsaalt: [],
      search: v,
      khuudasniiDugaar: 1,
    }))
  }

  return (
    <Dropdown trigger={"click"}
      open={dropDownNeekhEsekh}
      onOpenChange={() => setDropDownNeekhEsekh(!dropDownNeekhEsekh)}
      overlay={
        <div
          className="bg-white dark:bg-gray-700 dark:text-gray-200 divide-y py-1 drop-shadow-2xl shadow-lg px-2"
          style={{ maxHeight: "30vh", overflow: "auto" }}
          onScroll={onScroll}
        >
          {khariltsagchiinGaralt?.jagsaalt?.map((mur, i) => {
            const target = {};
            target.value = mur.register;
            return (
              <div key={i} onClick={() => { setRegister(mur.register); onChangeRegister({ target }); setDropDownNeekhEsekh(false) }} className="relative px-1 hover:bg-gray-100 py-1 flex cursor-pointer items-center justify-between">
                <div>{mur.register}</div><div>{mur.ner}</div>
              </div>
            );
          })}
          {!!khariltsagchiinGaralt && !(khariltsagchiinGaralt?.jagsaalt?.length > 0) && (
            <div className="h-full justify-center flex">
              <Empty description="Хоосон байна" />
            </div>
          )}
        </div>
      }>
      <Input
        onKeyUp={focuser}
        onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
        allowClear
        maxLength={baiguullagaEsekh ? 7 : 10}
        value={register}
        placeholder="Регистр"
        prefix={<SolutionOutlined />}
        onChange={(e) => { onChangeRegister(e); setRegister(e.target.value); khariltsagchKhaikh(e.target.value) }}
      />
    </Dropdown>
  );
};

export default KhariltsagchiinLavlakh;
