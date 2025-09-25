import { Dropdown, Empty, Input } from "antd";
import { SolutionOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";

const KhariltsagchiinLavlakh = ({
  onChangeRegister,
  baiguullagaEsekh,
  baiguullaga,
  barilgiinId,
  focuser,
  khadgalsabRegister,
}) => {
  const { t } = useTranslation();
  const [register, setRegister] = useState(null);
  const [dropDownNeekhEsekh, setDropDownNeekhEsekh] = useState(false);
  const searchKeys = ["ner", "register", "customerTin"];
  const kharitsagchQuery = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      baiguullagiinId: baiguullaga?._id,
      turul: baiguullagaEsekh === true ? "ААН" : "Иргэн",
    };
  }, [baiguullaga, barilgiinId, baiguullagaEsekh]);
  const khariltsagchiinGaralt = useJagsaalt(
    "/khariltsagch",
    kharitsagchQuery,
    undefined,
    undefined,
    searchKeys
  );

  useEffect(() => {
    setRegister(null);
    khariltsagchiinGaralt.mutate();
    khariltsagchiinGaralt.setKhuudaslalt((a) => ({
      ...a,
      jagsaalt: [],
      khuudasniiKhemjee: 20,
      khuudasniiDugaar: 1,
    }));
  }, [baiguullagaEsekh]);

  useEffect(() => {
    if (!!khadgalsabRegister) {
      setRegister(khadgalsabRegister);
    }
  }, []);

  function onScroll(e) {
    if (
      e.target.scrollHeight - e.target.scrollTop - 1 < e.target.clientHeight &&
      !!khariltsagchiinGaralt &&
      khariltsagchiinGaralt?.data?.jagsaalt.length === 20 &&
      khariltsagchiinGaralt.khuudaslalt.khuudasniiDugaar <
        khariltsagchiinGaralt?.data?.niitKhuudas
    ) {
      khariltsagchiinGaralt.setKhuudaslalt((kh) => ({
        ...kh,
        khuudasniiDugaar: kh.khuudasniiDugaar + 1,
        khuudasniiKhemjee: 20,
        jagsaalt: [
          ...(kh.jagsaalt || []),
          ...khariltsagchiinGaralt?.data.jagsaalt,
        ],
      }));
    }
  }
  useEffect(() => {
    khariltsagchiinGaralt.setKhuudaslalt((a) => ({
      ...a,
      khuudasniiKhemjee: 20,
    }));
  }, []);

  function khariltsagchKhaikh(v) {
    khariltsagchiinGaralt.setKhuudaslalt((a) => ({
      ...a,
      jagsaalt: [],
      search: v,
      khuudasniiDugaar: 1,
    }));
  }

  return (
    <Dropdown
      trigger={"click"}
      open={dropDownNeekhEsekh}
      onOpenChange={() => setDropDownNeekhEsekh(!dropDownNeekhEsekh)}
      overlay={
        <div
          className="divide-y bg-white px-2 py-1 shadow-lg drop-shadow-2xl dark:bg-gray-700 dark:text-gray-200"
          style={{ maxHeight: "30vh", overflow: "auto" }}
          onScroll={onScroll}
        >
          {khariltsagchiinGaralt?.jagsaalt?.map((mur, i) => {
            const target = {};
            target.value = mur.register ? mur.register : mur.customerTin;
            return (
              <div
                key={i}
                onClick={() => {
                  setRegister(mur.register ? mur.register : mur.customerTin);
                  onChangeRegister({ target });
                  setDropDownNeekhEsekh(false);
                }}
                className="relative flex cursor-pointer items-center justify-between px-1 py-1 hover:bg-gray-100"
              >
                <div>{mur.register ? mur.register : mur.customerTin}</div>
                <div>{mur.ner}</div>
              </div>
            );
          })}
          {!!khariltsagchiinGaralt &&
            !(khariltsagchiinGaralt?.jagsaalt?.length > 0) && (
              <div className="flex h-full justify-center">
                <Empty description="Хоосон байна" />
              </div>
            )}
        </div>
      }
    >
      <Input
        onKeyUp={focuser}
        onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
        allowClear
        value={register}
        placeholder={t("Регистр, Бүртгэлийн дугаар")}
        prefix={<SolutionOutlined />}
        onChange={(e) => {
          onChangeRegister(e);
          setRegister(e.target.value);
          khariltsagchKhaikh(e.target.value);
        }}
      />
    </Dropdown>
  );
};

export default KhariltsagchiinLavlakh;
