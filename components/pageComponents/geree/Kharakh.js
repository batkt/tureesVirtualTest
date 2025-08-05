import React, { useEffect, useState } from "react";
import moment from "moment";
import uilchilgee, { url } from "services/uilchilgee";
import { toWords } from "mon_num";
import { renderToString } from "react-dom/server";
import dynamic from "next/dynamic";
import { t } from "i18next";
import formatNumber from "tools/function/formatNumber";
import { Checkbox } from "antd";
import { EyeOutlined } from "@ant-design/icons";
const Konva = dynamic(() => import("components/konva"), { ssr: false });

function Kharakh({ data, print, token, baiguullaga, barilgiinId }, ref) {
  const { geree, ...gereeniiZagvar } = data;
  const barilga = baiguullaga?.barilguud.find(
    (a) => a._id === geree?.barilgiinId
  );
  const [akt, setAkt] = useState();
  const [KharakhKhesguud, setKharakhKhesguud] = useState([1]);
  const [talbainuud, setTalbainuud] = useState();

  useEffect(() => {
    if (geree?.aktiinZagvariinId) {
      KharakhKhesguud.push(3);
      uilchilgee(token)
        .get(`/aktiinZagvar/${geree?.aktiinZagvariinId}`)
        .then(({ data }) => {
          if (!!data) {
            for (const [key, value] of Object.entries(geree)) {
              data.dedKhesguud
                .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
                .map((b) => {
                  b.zaalt = b.zaalt.replace(
                    new RegExp(`&lt;${key}&gt;`, "g"),
                    key === "utas"
                      ? value[0]
                      : parseFloat(value) != NaN
                      ? key != "register"
                        ? value
                        : formatNumber(value)
                      : value
                  );
                });
              data.baruunTolgoi = data.baruunTolgoi?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                key === "utas"
                  ? value[0]
                  : parseFloat(value) != NaN
                  ? key != "register"
                    ? value
                    : formatNumber(value)
                  : value
              );

              data.baruunKhul = data.baruunKhul?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                key === "utas"
                  ? value[0]
                  : parseFloat(value) != NaN
                  ? key != "register"
                    ? value
                    : formatNumber(value)
                  : value
              );

              data.baruunTolgoi = data.baruunTolgoi?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                key === "utas"
                  ? value[0]
                  : parseFloat(value) != NaN
                  ? key != "register"
                    ? value
                    : formatNumber(value)
                  : value
              );

              data.zuunKhul = data.zuunKhul?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                key === "utas"
                  ? value[0]
                  : parseFloat(value) != NaN
                  ? key != "register"
                    ? value
                    : formatNumber(value)
                  : value
              );

              data.zuunTolgoi = data.zuunTolgoi?.replace(
                new RegExp(`&lt;${key}&gt;`, "g"),
                key === "utas"
                  ? value[0]
                  : parseFloat(value) != NaN
                  ? key != "register"
                    ? value
                    : formatNumber(value)
                  : value
              );
            }

            setAkt(data);
          }
        });
    }
    if (geree?.talbainIdnuud?.length > 0) {
      KharakhKhesguud.push(2);
      uilchilgee(token)
        .get("/talbai", {
          params: { query: { _id: { $in: geree?.talbainIdnuud } } },
        })
        .then(({ data }) => {
          if (!!data) {
            setTalbainuud(data?.jagsaalt);
          }
        });
    }
    setKharakhKhesguud([...KharakhKhesguud]);
  }, [geree, barilga]);

  React.useEffect(() => {
    const keydown = (e) => {
      if (e.ctrlKey === true && e.key === "p" && print) {
        e.preventDefault();
        e.stopPropagation();
        print();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  return (
    <div>
      <div className="absolute right-0 top-4 flex justify-end gap-5 px-10 font-semibold">
        <div
          onClick={() =>
            KharakhKhesguud.find((a) => a === 1)
              ? setKharakhKhesguud(KharakhKhesguud.filter((a) => a !== 1))
              : setKharakhKhesguud([...KharakhKhesguud, 1])
          }
          className={`flex w-28 cursor-pointer select-none items-center justify-center gap-2 rounded-md border-2 bg-opacity-5 ${
            KharakhKhesguud.find((a) => a === 1)
              ? "border-green-500 bg-green-500 text-green-600"
              : "border-gray-300 bg-black text-gray-400"
          }`}
        >
          <EyeOutlined />
          Гэрээ
        </div>
        {geree?.talbainIdnuud?.length > 0 && (
          <div
            onClick={() =>
              KharakhKhesguud.find((a) => a === 2)
                ? setKharakhKhesguud(KharakhKhesguud.filter((a) => a !== 2))
                : setKharakhKhesguud([...KharakhKhesguud, 2])
            }
            className={`flex w-28 cursor-pointer select-none items-center justify-center gap-2 rounded-md border-2 bg-opacity-5 ${
              KharakhKhesguud.find((a) => a === 2)
                ? "border-green-500 bg-green-500 text-green-600"
                : "border-gray-300 bg-black text-gray-400"
            }`}
          >
            <EyeOutlined />
            Талбай
          </div>
        )}
        {geree?.aktiinZagvariinId && (
          <div
            onClick={() =>
              KharakhKhesguud.find((a) => a === 3)
                ? setKharakhKhesguud(KharakhKhesguud.filter((a) => a !== 3))
                : setKharakhKhesguud([...KharakhKhesguud, 3])
            }
            className={`flex w-28 cursor-pointer select-none items-center justify-center gap-2 rounded-md border-2 bg-opacity-5 ${
              KharakhKhesguud.find((a) => a === 3)
                ? "border-green-500 bg-green-500 text-green-600"
                : "border-gray-300 bg-black text-gray-400"
            }`}
          >
            <EyeOutlined className="" />
            Акт
          </div>
        )}
      </div>
      <div
        ref={ref}
        className="relative mt-0 items-center justify-center gap-10  pb-5 pl-3 print:gap-0 print:pb-0 print:pl-0"
        style={{ height: "calc( 100vh - 10rem )" }}
      >
        {KharakhKhesguud.find((a) => a === 1) && (
          <div>
            <div className="sticky top-0 text-2xl font-semibold opacity-30 print:hidden">
              Гэрээ
            </div>
            <div
              className=" flex w-full dark:dark:bg-gray-800 hover:bg-gray-900 text-white flex-col space-y-1 bg-white p-[0] pl-[24mm] pr-[14mm] text-black shadow-lg print:min-h-0 print:shadow-none"
              style={{ width: "210mm" }}
            >
              {gereeniiZagvar?.ner && (
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
              )}
              {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
                return (
                  <div
                    key={`alkhamiinGereeniiZagvar${index}`}
                    className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-900 "
                  >
                    <div
                      className="w-full"
                      dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                    />
                  </div>
                );
              })}
              {gereeniiZagvar?.ner && (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: gereeniiZagvar?.zuunKhul,
                    }}
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: gereeniiZagvar?.baruunKhul,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {KharakhKhesguud.find((a) => a === 2) && talbainuud?.length > 0 && (
          <div>
            <div className="sticky left-0 top-0 text-2xl font-semibold opacity-30 print:hidden">
              Талбай
            </div>
            {talbainuud?.map((a, i) => {
              return (
                <div
                  key={i}
                  className="flex w-full break-before-page flex-col justify-center space-y-1 bg-white pl-[24mm] pr-[14mm] dark:text-white text-black shadow-lg print:shadow-none"
                  style={{ width: "210mm", height: "200mm" }}
                >
                  <div className="font flex gap-3 text-lg">
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
                    <div>{a.talbainKhemjee || 0}m²</div>
                  </div>
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
          </div>
        )}
        {KharakhKhesguud.find((a) => a === 3) && akt && (
          <div>
            <div className="sticky left-0 top-0 text-2xl font-semibold opacity-30 print:hidden">
              Акт
            </div>

            <div
              className=" flex w-full break-before-page flex-col space-y-1 bg-white p-[0] pl-[24mm] pr-[14mm] dark:text-white text-black shadow-lg print:shadow-none"
              style={{ width: "210mm" }}
            >
              {akt?.ner && (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: akt?.zuunTolgoi,
                    }}
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: akt?.baruunTolgoi,
                    }}
                  />
                </div>
              )}
              {akt?.dedKhesguud?.map((mur, index) => {
                return (
                  <div
                    key={`alkhamiinGereeniiZagvar${index}`}
                    className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-100 "
                  >
                    <div
                      className="w-full"
                      dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                    />
                  </div>
                );
              })}
              {akt?.ner && (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: akt?.zuunKhul,
                    }}
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: akt?.baruunKhul,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(Kharakh);
