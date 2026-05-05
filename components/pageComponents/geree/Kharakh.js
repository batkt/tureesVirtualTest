import React, { useEffect, useState } from "react";
import uilchilgee, { url } from "services/uilchilgee";
import dynamic from "next/dynamic";
import { t } from "i18next";
import formatNumber from "tools/function/formatNumber";
import _ from "lodash";
import { EyeOutlined } from "@ant-design/icons";
const Konva = dynamic(() => import("components/konva"), { ssr: false });


function Kharakh({ data, print, token, baiguullaga, barilgiinId }, ref) {
  const { geree, ...gereeniiZagvar } = data;
  const barilga = baiguullaga?.barilguud.find(
    (a) => a._id === geree?.barilgiinId
  );
  const gereeMedeelel = React.useMemo(() => {
    if (!geree) return undefined;
    const hayag = geree.barilgiinKhayag ?? barilga?.khayag ?? "";
    if (geree.barilgiinKhayag === hayag) return geree;
    return { ...geree, barilgiinKhayag: hayag };
  }, [geree, barilga?.khayag]);
  const [akt, setAkt] = useState();
  const [zurguud, setZurguud] = useState();
  const [KharakhKhesguud, setKharakhKhesguud] = useState([1]);
  const [talbainuud, setTalbainuud] = useState();

  useEffect(() => {
    if (gereeMedeelel?.aktiinZagvariinId) {
      KharakhKhesguud.push(3);
      uilchilgee(token)
        .get(`/aktiinZagvar/${gereeMedeelel?.aktiinZagvariinId}`)
        .then(({ data }) => {
          if (!!data) {
            for (const [key, value] of Object.entries(gereeMedeelel || {})) {
                if (key === "segmentuud" && Array.isArray(value)) {
                  value.forEach((seg) => {
                    data.dedKhesguud
                      .filter(
                        (a) => !!a.zaalt && a.zaalt?.toLowerCase().indexOf(seg.ner.toLowerCase()) !== -1
                      )
                      .map((b) => {
                        return (b.zaalt = b.zaalt.replace(
                          new RegExp(`&lt;${seg.ner}&gt;`, "gi"),
                          seg.utga
                        ));
                      });
                  });
                } else {
                  data.dedKhesguud
                    .filter((a) => !!a.zaalt && a.zaalt?.toLowerCase().indexOf(key.toLowerCase()) !== -1)
                    .map((b) => {
                      b.zaalt = b.zaalt.replace(
                        new RegExp(`&lt;${key}&gt;`, "gi"),
                        key === "utas"
                          ? value[0]
                          : parseFloat(value) != NaN
                          ? key != "register"
                            ? value
                            : formatNumber(value)
                          : value
                      );
                    });
                }
              data.baruunTolgoi = data.baruunTolgoi?.replace(
                new RegExp(`&lt;${key}&gt;`, "gi"),
                key === "utas"
                  ? value[0]
                  : parseFloat(value) != NaN
                  ? key != "register"
                    ? value
                    : formatNumber(value)
                  : value
              );

              data.baruunKhul = data.baruunKhul?.replace(
                new RegExp(`&lt;${key}&gt;`, "gi"),
                key === "utas"
                  ? value[0]
                  : parseFloat(value) != NaN
                  ? key != "register"
                    ? value
                    : formatNumber(value)
                  : value
              );

              data.zuunKhul = data.zuunKhul?.replace(
                new RegExp(`&lt;${key}&gt;`, "gi"),
                key === "utas"
                  ? value[0]
                  : parseFloat(value) != NaN
                  ? key != "register"
                    ? value
                    : formatNumber(value)
                  : value
              );

              data.zuunTolgoi = data.zuunTolgoi?.replace(
                new RegExp(`&lt;${key}&gt;`, "gi"),
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
    if (gereeMedeelel?.talbainIdnuud?.length > 0) {
      KharakhKhesguud.push(2);
      uilchilgee(token)
        .get("/talbai", {
          params: { query: { _id: { $in: gereeMedeelel?.talbainIdnuud } } },
        })
        .then(({ data }) => {
          if (!!data) {
            setTalbainuud(data?.jagsaalt);
          }
        });
    }
    if (gereeMedeelel?.zurguud?.length > 0) {
      KharakhKhesguud.push(4);
      setZurguud(gereeMedeelel.zurguud);
    } else if (gereeMedeelel?._id) {
      uilchilgee(token)
        .get(`/gereeniiZurguud/${gereeMedeelel._id}`)
        .then(({ data }) => {
          if (data?.length) {
            setZurguud(data);
            KharakhKhesguud.push(4);
            setKharakhKhesguud([...KharakhKhesguud]);
          }
        });
    }

    setKharakhKhesguud([...KharakhKhesguud]);
  }, [gereeMedeelel, token]);

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
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 2.5cm 2.5cm 2.5cm 3cm;
          }
        }
      `}</style>
      <div className="absolute right-0 top-4 flex justify-end gap-5 px-10 font-semibold print:hidden z-10">
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
          {t("Гэрээ")}
        </div>
        {gereeMedeelel?.talbainIdnuud?.length > 0 && (
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
            {t("Талбай")}
          </div>
        )}
        {gereeMedeelel?.aktiinZagvariinId && (
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
        {gereeMedeelel?.zurguud && (
          <div
            onClick={() =>
              KharakhKhesguud.find((a) => a === 4)
                ? setKharakhKhesguud(KharakhKhesguud.filter((a) => a !== 4))
                : setKharakhKhesguud([...KharakhKhesguud, 4])
            }
            className={`flex w-28 cursor-pointer select-none items-center justify-center gap-2 rounded-md border-2 bg-opacity-5 ${
              KharakhKhesguud.find((a) => a === 4)
                ? "border-green-500 bg-green-500 text-green-600"
                : "border-gray-300 bg-black text-gray-400"
            }`}
          >
            <EyeOutlined className="" />
            PDF
          </div>
        )}
      </div>
      <div
        ref={ref}
        className="relative mt-0 items-center justify-center gap-10 pb-5 pl-3 print:gap-0 print:pb-0 print:pl-0"
        style={{ height: "calc( 100vh - 10rem )" }}
      >
        {KharakhKhesguud.find((a) => a === 1) && (
          <div>
            <div className="sticky top-0 text-2xl font-semibold opacity-30 print:hidden">
              {t("Гэрээ")}
            </div>
            <div
              className="flex w-full flex-col pt-10 space-y-1 bg-white p-[0] pl-[24mm] pr-[14mm] pb-[25mm] text-black shadow-lg dark:bg-gray-800 dark:text-white print:min-h-0 print:shadow-none print:pt-[25mm] print:pb-[25mm]"
              style={{ width: "210mm" }}
            >
              {gereeniiZagvar?.ner && (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="[&_*]:!text-black dark:[&_*]:!text-white"
                    dangerouslySetInnerHTML={{
                      __html: gereeniiZagvar?.zuunTolgoi,
                    }}
                  />
                  <div
                    className="[&_*]:!text-black dark:[&_*]:!text-white"
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
                    className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <div
                      className="w-full [&_*]:!text-black dark:[&_*]:!text-white"
                      dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                    />
                  </div>
                );
              })}
              {gereeniiZagvar?.ner && (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="[&_*]:!text-black dark:[&_*]:!text-white"
                    dangerouslySetInnerHTML={{
                      __html: gereeniiZagvar?.zuunKhul,
                    }}
                  />
                  <div
                    className="[&_*]:!text-black dark:[&_*]:!text-white"
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
              {t("Талбай")}
            </div>
            {Object.entries(_.groupBy(talbainuud, "davkhar")).map(
              ([davkhar, units], i) => {
                const aggregateKod = units.map((u) => u.kod).join(", ");
                const totalSurface = units.reduce(
                  (sum, u) => sum + (u.talbainKhemjee || 0),
                  0,
                );
                const totalRent = units.reduce(
                  (sum, u) => sum + (u.tureesiinTulbur || 0),
                  0,
                );

              
                const targetDavkhar = units[0]?.davkhar ?? davkhar;

                return (
                  <div
                    key={i}
                    className="flex w-full break-before-page flex-col justify-center space-y-1 bg-white pl-[24mm] pr-[14mm] text-black shadow-lg dark:bg-gray-800 dark:text-white print:shadow-none"
                    style={{ width: "210mm", height: "200mm" }}
                  >
                    <div className="font flex gap-3 text-lg mt-4">
                      <div className="font-bold">{t("Код")}:</div>
                      <div>{aggregateKod}</div>
                    </div>
                    <Konva
                      talbaiGereendKharakh={true}
                      baiguullaga={baiguullaga}
                      barilgiinId={barilgiinId}
                      token={token}
                      _id={units.map((u) => u._id)}
                      points={units.map((u) => u.bairshil)}
                      units={units}
                      davkhar={targetDavkhar}
                    />
                    <div className="flex gap-3">
                      <div className="font-semibold">{t("Хэмжээ")}:</div>
                      <div>{totalSurface.toFixed(2)}m²</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-semibold">{t("Сарын түрээс")}:</div>
                      <div>{formatNumber(totalRent)}₮</div>
                    </div>
                    <div className="flex gap-3">
                      <div className="font-semibold">{t("Давхар")}:</div>
                      <div>{davkhar}</div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        )}

        {KharakhKhesguud.find((a) => a === 3) && akt && (
          <div>
            <div className="sticky left-0 top-0 text-2xl font-semibold opacity-30 print:hidden">
              Акт
            </div>

            <div
              className=" flex w-full break-before-page flex-col space-y-1 bg-white p-[0] pl-[24mm] pr-[14mm] text-black shadow-lg dark:bg-gray-800 dark:text-white print:shadow-none"
              style={{ width: "210mm" }}
            >
              {akt?.ner && (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="[&_*]:!text-black dark:[&_*]:!text-white"
                    dangerouslySetInnerHTML={{
                      __html: akt?.zuunTolgoi,
                    }}
                  />
                  <div
                    className="[&_*]:!text-black dark:[&_*]:!text-white"
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
                    className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div
                      className="w-full [&_*]:!text-black dark:[&_*]:!text-white"
                      dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                    />
                  </div>
                );
              })}
              {akt?.ner && (
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="[&_*]:!text-black dark:[&_*]:!text-white"
                    dangerouslySetInnerHTML={{
                      __html: akt?.zuunKhul,
                    }}
                  />
                  <div
                    className="[&_*]:!text-black dark:[&_*]:!text-white"
                    dangerouslySetInnerHTML={{
                      __html: akt?.baruunKhul,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {gereeMedeelel?.zurguud?.length > 0 && (
          <div>
            <div className="sticky left-0 top-0 text-2xl font-semibold opacity-30 print:hidden">
              PDF
            </div>

            <div className="flex w-full flex-col space-y-4 bg-white p-[0] pl-[24mm] pr-[14mm] text-black shadow-lg dark:bg-gray-800 dark:text-white print:shadow-none">
              {gereeMedeelel.zurguud.map((mur) => (
                <img
                  key={mur}
                  src={`${url}/zuragAvya/jpg/${baiguullaga?._id}/${mur}`}
                  alt="zurag"
                  className="max-w-full rounded-lg border border-gray-200 dark:border-gray-700"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(Kharakh);
