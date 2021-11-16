import readMethod from "tools/function/crud/readMethod";
import { toWords } from "mon_num";
import moment from "moment";
import _ from "lodash";
import {useRouter} from "next/router";
import React from 'react'
import useSWR from "swr";

const fetcher =async (token,id)=>{
    if(!token || !id)
      return {}
    const { data: geree } = await readMethod(
      "geree",
      token,
      id
    );

    const { data } = await readMethod(
      "gereeniiZagvar",
      token,
      geree.gereeniiZagvariinId
    );

   
  
    if (!!data) {
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
      data.geree = geree;
    }

    return data;
}

function GereeBaiguulakh() {
  const {query} = useRouter()

  const { token,id} = query

  const { data } = useSWR(
    !!token && !!id
      ? [token, id]
      : null,
      fetcher,
    { revalidateOnFocus: false }
  )

  const {geree,...gereeniiZagvar} = data || {}
  console.log('geree',gereeniiZagvar)

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
            className="flex flex-row w-full p-1 relative group hover:bg-gray-100 rounded-md"
          >
            {mur.kharagdakhDugaar ? (
              <>
                <div className="text-center">{mur.kharagdakhDugaar}</div>
                <div
                  className="ml-5"
                  dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                />
              </>
            ) : (
              <div
                className="w-full text-center font-medium"
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
