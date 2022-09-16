import readMethod from "tools/function/crud/readMethod";
import { toWords } from "mon_num";
import moment from "moment";
import _ from "lodash";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { renderToString } from "react-dom/server";

const fetcher = async (token, id, turul) => {
  if (!token || !id) return {};
  const { data: geree } = await readMethod("geree", token, id);

  const { data } = await readMethod(
    "gereeniiZagvar",
    token,
    turul === "gereeniiZagvar" ? id : geree.gereeniiZagvariinId
  );

  if (!!data) {
    if (turul !== "gereeniiZagvar") {
      if (geree.gereeniiOgnoo) {
        geree.ekhlekhOn = moment(geree.gereeniiOgnoo).format("YYYY");
        geree.ekhelkhSar = moment(geree.gereeniiOgnoo).format("MM");
        geree.ekhlekhUdur = moment(geree.gereeniiOgnoo).format("DD");
        if (geree.khugatsaa > 0) {
          let duusakhOgnoo = moment(geree.gereeniiOgnoo).add(
            geree.khugatsaa,
            "M"
          );
          geree.duusakhOn = duusakhOgnoo.format("YYYY");
          geree.duusakhSar = duusakhOgnoo.format("MM");
          geree.duusakhUdur = duusakhOgnoo.format("DD");
        }
      }
      geree.talbainNegjUneUsgeer = toWords(geree.talbainNegjUne);
      geree.talbainNiitUneUsgeer = toWords(geree.talbainNiitUne);
      geree.gariinUseg = renderToString(
        <span style={{ position: "absolute" }}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/df/Sign_of_V._K._Novikov.png"
            style={{
              width: 100,
              height: 50,
              transform: "translate(-50%, -30%)",
            }}
          />
        </span>
      );
      geree.tamga = renderToString(
        <span style={{ position: "absolute", zIndex: 1 }}>
          <img
            src="https://www.onlygfx.com/wp-content/uploads/2017/12/empty-stamp-8.png"
            style={{
              width: 115,
              height: 100,
              transform: "translate(-10%, -50%)",
              opacity: 0.65,
            }}
          />
        </span>
      );

      for (const [key, value] of Object.entries(geree)) {
        data.dedKhesguud
          .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
          .map((b) => {
            b.zaalt = b.zaalt.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
          });
        if (!!data?.baruunTolgoi)
          data.baruunTolgoi = data.baruunTolgoi?.replace(
            new RegExp(`&lt;${key}&gt;`, "g"),
            value
          );
      }
    }
    data.geree = geree || {};
  }

  return data;
};

function GereeBaiguulakh() {
  const { query } = useRouter();

  const { token, id, turul } = query;
  console.log(token, id, turul);

  const { data } = useSWR(
    !!token && !!id ? [token, id, turul] : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const { geree, ...gereeniiZagvar } = data || {};

  return (
    <div className="w-full space-y-2 p-5">
      {gereeniiZagvar?.ner && (
        <>
          <div className="flex flex-row justify-between">
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
          <div className="flex flex-row justify-between">
            <div>
              {moment(geree.ognoo).format("YYYY")} он{" "}
              {moment(geree.ognoo).format("MM")} сар{" "}
              {moment(geree.ognoo).format("DD")} өдөр
            </div>
            <div>№:{geree.gereeniiDugaar}</div>
            <div>Улаанбаатар хот</div>
          </div>
          <div className="w-full text-center font-medium">
            АЖЛЫН БАЙРНЫ ТҮРЭЭСИЙН ГЭРЭЭ
          </div>
        </>
      )}
      {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
        return (
          <div
            key={`alkhamiinGereeniiZagvar${index}`}
            className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mur.kharagdakhDugaar ? (
              <>
                <div className="text-center">{mur.kharagdakhDugaar}</div>
                <div
                  className="break-word ml-5 text-justify"
                  dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                />
              </>
            ) : (
              <div
                className="break-word w-full text-center font-medium"
                dangerouslySetInnerHTML={{ __html: mur.zaalt }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GereeBaiguulakh;
