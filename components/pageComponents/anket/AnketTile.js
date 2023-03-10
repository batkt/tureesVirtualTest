import { Button, Tag } from "antd";
import React, { useMemo, useState } from "react";
import moment from "moment";
import useJagsaalt from "hooks/useJagsaalt";
import { t } from "i18next";

function AnketTile({ turul, ner, createdAt, _id }) {
  const query = useMemo(() => {
    let asuultiinId = _id;
    return { asuultiinId };
  }, [khariult]);
  const khariult = useJagsaalt("/khariult", query);
  const [khariultKharakh, setKhariultKharakh] = useState(false);
  return (
    <div className="mb-3 rounded-md border border-solid border-gray-400 bg-white p-2 shadow-2xl dark:bg-gray-900">
      <div className="flex w-full flex-row">
        <div className="font-bold dark:text-gray-100">{ner}</div>

        <div className="ml-auto text-sm font-medium text-gray-600 dark:text-gray-200">
          {moment(createdAt).format("YYYY-MM-DD")}
        </div>
      </div>
      <div className="flex w-full flex-row dark:text-gray-100">
        <div>{turul}</div>
        <div className="ml-auto font-medium"></div>
      </div>

      <div className="mt-1 border-t-2">
        <Button
          onClick={() =>
            khariultKharakh === false
              ? setKhariultKharakh(true)
              : setKhariultKharakh(false)
          }
          className="mt-2 flex w-full"
        >
          {khariultKharakh === false
            ? "Асуулт, хариулт харах"
            : "Асуулт, хариулт хаах"}
        </Button>
        <div className="mt-1 flex flex-row justify-between ">
          {khariultKharakh && (
            <div className="flex h-[70vh] w-full flex-col gap-2 overflow-y-auto">
              {khariult?.jagsaalt?.map((mur, index) => {
                return (
                  <div
                    className="mt-3 flex w-full flex-col rounded-md border p-2"
                    key={index}
                  >
                    <div className="flex justify-between">
                      <div className="border-b ">{index + 1})</div>
                      <div className="border-b">
                        {moment(mur.ognoo).format("YYYY-MM-DD, HH:mm")}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between border-b">
                      <div className="flex items-center">
                        {t("Асуулт")}:
                        <div className="ml-1 h-3 w-3 rounded-full bg-green-600" />
                      </div>
                      <div className="flex items-center">
                        {t("Хариулт")}:
                        <div className="ml-1 h-3 w-3 rounded-full bg-blue-500" />
                      </div>
                    </div>
                    {mur?.khariultuud?.map((a, i) => {
                      return (
                        <div
                          className="flex w-full flex-wrap justify-between border-b"
                          key={i}
                        >
                          <div className="flex gap-1">
                            {i + 1}.
                            <div className="text-green-600">{a.asuult}</div>-
                          </div>
                          <div className="text-blue-500">{a.khariult}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnketTile;
