import { Dropdown, Empty, Input } from "antd";
import { SolutionOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";

const KhariltsagchiinLavlakh = ({
  value,
  onChange,
  onChangeRegister,
  baiguullagaEsekh,
  baiguullaga,
  barilgiinId,
  focuser,
  khadgalsabRegister,
}) => {
  const { t } = useTranslation();
  const [dropDownNeekhEsekh, setDropDownNeekhEsekh] = useState(false);
  const searchKeys = ["ner", "register", "customerTin"];
  const kharitsagchQuery = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      turul: baiguullagaEsekh === true ? "ААН" : "Иргэн",
      tuluv: { $nin: ["0", 0, "-1", -1] },
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
  khariltsagchiinGaralt.setKhuudaslalt((a) => ({
    ...a,
    jagsaalt: [],
    search: "",
    khuudasniiKhemjee: 20,
    khuudasniiDugaar: 1,
  }));
}, [baiguullagaEsekh]);

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
      onOpenChange={(open) => {
  setDropDownNeekhEsekh(open);
  if (open) {
    khariltsagchiinGaralt.setKhuudaslalt((a) => ({
      ...a,
      search: "",      
      jagsaalt: [],
      khuudasniiDugaar: 1,
    }));
    khariltsagchiinGaralt.mutate();
  }
}}
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
                  const newValue = mur.register
                    ? mur.register
                    : mur.customerTin;
                  onChange(newValue);
                  onChangeRegister({ target: { value: newValue }, selectedCustomer: mur });
                  setDropDownNeekhEsekh(false);
                }}
                className="relative flex cursor-pointer items-center justify-between px-1 py-1 hover:dark:text-blue-500 hover:text-green-500"
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
        value={value}
        placeholder={t("Регистр, Бүртгэлийн дугаар")}
        prefix={<SolutionOutlined />}
        onChange={(e) => {
          onChange(e.target.value);
          onChangeRegister(e);
          khariltsagchKhaikh(e.target.value);
        }}
      />
    </Dropdown>
  );
};

export default KhariltsagchiinLavlakh;
