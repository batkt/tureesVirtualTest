import React, { useState } from "react";
import { Button, Input, Popconfirm, Tooltip, notification } from "antd";
import uilchilgee from "services/uilchilgee";
import { useTranslation } from "react-i18next";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import UtasBurtgel from "./UtasBurtgel";

const DugaarTile = ({ t, baiguullaga, baiguullagaMutate, token }) => {
  const data = baiguullaga.tokhirgoo.msgAvakhDugaar;
  const tokhirgoo = baiguullaga.tokhirgoo;

  function ustgaya(mur) {
    const ustgasanData = data.filter((utga) => utga !== mur);
    const medegdelTokhirgoo = {
      msgAvakhTurul: tokhirgoo.msgAvakhTurul,
      msgAvakhDugaar: ustgasanData,
    };
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: medegdelTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай устгалаа") });
          baiguullagaMutate();
        }
      });
  }

  console.log("baiguullaga", baiguullaga);
  return data?.map((mur, index) => {
    return (
      <div className="box w-full border-y" key={index}>
        <div className="flex w-full items-center p-5">
          <div className="w-full border-l-2 border-green-500 pl-4">
            <div className="font-medium">{mur}</div>
          </div>
          <div className="ml-5 flex w-full justify-end space-x-2">
            <Popconfirm
              title={t("Утас устгах уу?")}
              okText={t("Тийм")}
              cancelText={t("Үгүй")}
              onConfirm={() => ustgaya(mur)}
            >
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 fill-current p-2 text-white">
                <Tooltip title="Устгах">
                  <DeleteOutlined size={20} />
                </Tooltip>
              </div>
            </Popconfirm>
          </div>
        </div>
      </div>
    );
  });
};

function Medegdel({
  token,
  baiguullaga,
  baiguullagaMutate,
  setSongogdsonTsonkhniiIndex,
}) {
  const [medegdelTokhirgoo, setMedegdelTokhirgoo] = useState(
    baiguullaga
      ? {
          msgIlgeekhDugaar: baiguullaga.tokhirgoo.msgIlgeekhDugaar,
          msgIlgeekhKey: baiguullaga.tokhirgoo.msgIlgeekhKey,
        }
      : null
  );

  const ref = React.useRef(null);
  const { t } = useTranslation();

  const khungulultiinTokhirgooKhadgalya = () => {
    uilchilgee(token)
      .post("/baiguullagaTokhirgooZasya", { tokhirgoo: medegdelTokhirgoo })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай засагдлаа") });
          baiguullagaMutate();
          setSongogdsonTsonkhniiIndex(5);
        }
      });
  };

  function utasBurtgey(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: "Утасны бүртгэл",
      icon: <PlusOutlined />,
      content: (
        <UtasBurtgel
          baiguullagaMutate={baiguullagaMutate}
          baiguullaga={baiguullaga}
          ref={ref}
          token={token}
        />
      ),
      footer,
    });
  }

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("СМС тохиргоо")}
            </h2>
          </div>

          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("СМС илгээх түлхүүр")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  defaultValue={baiguullaga?.tokhirgoo?.msgIlgeekhKey}
                  onChange={({ target }) =>
                    setMedegdelTokhirgoo((a) => ({
                      ...(a || {}),
                      msgIlgeekhKey: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("СМС илгээх дугаар")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Input
                  defaultValue={baiguullaga?.tokhirgoo?.msgIlgeekhDugaar}
                  onChange={({ target }) =>
                    setMedegdelTokhirgoo((a) => ({
                      ...(a || {}),
                      msgIlgeekhDugaar: target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pb-2 pt-2 ${
              !!medegdelTokhirgoo ? "flex" : "hidden"
            }`}
          >
            <Button type="primary" onClick={khungulultiinTokhirgooKhadgalya}>
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>

      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="flex flex-col px-5 pb-2 pt-5">
            <div className="flex justify-between">
              <h2 className="mr-auto text-base font-medium dark:text-gray-200">
                Мэдэгдэл илгээх дугаар
              </h2>
              <div
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 fill-current p-2 text-white"
                onClick={() => utasBurtgey()}
              >
                <Tooltip title={t("Нэмэх")}>
                  <PlusOutlined />
                </Tooltip>
              </div>
            </div>
          </div>
          <DugaarTile
            t={t}
            token={token}
            baiguullaga={baiguullaga}
            baiguullagaMutate={baiguullagaMutate}
            zasya={utasBurtgey}
          />
        </div>
      </div>
      {/* <div className='xxl:col-span-4 col-span-12 mt-5 lg:col-span-5'></div> */}
    </>
  );
}

export default Medegdel;
