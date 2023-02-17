import _ from "lodash";
import React, { useEffect } from "react";
import axios, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useSWR from "swr";
import { message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { t } from "i18next";

const fetcher = (url, token, gereeniiId) =>
  axios(token)
    .get(`${url}/${gereeniiId}`)
    .then((res) => {
      return res.data;
    })
    .catch(aldaaBarigch);

function useBaritsaa(token, gereeniiId) {
  const { data, mutate } = useSWR(
    !!token ? ["/baritsaaTulultAvya", token, gereeniiId] : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return {
    baritsaaKhuulga: data,
    baritsaaKhuulgaMutate: mutate,
  };
}

function BaritsaaKhuulga({ data, token, onFinish, destroy, tulukhUldegdel, ashiglakhUldegdel, setAshiglakhUldegdel, setTulukhUldegdel }, ref) {
  const { baritsaaKhuulga, baritsaaKhuulgaMutate } = useBaritsaa(
    token,
    data?._id
  );

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
    }),
    []
  );

  function baritsaaniiGuilgeeUstgaya({ _id, orlogo, zarlaga, guilgeeniiId }) {
    if (orlogo !== 0) {
      setTulukhUldegdel(tulukhUldegdel + orlogo)
      setAshiglakhUldegdel(ashiglakhUldegdel - orlogo)
    }
    if (zarlaga !== 0) {
      setTulukhUldegdel(tulukhUldegdel - zarlaga)
      setAshiglakhUldegdel(ashiglakhUldegdel + zarlaga)
    }

    axios(token)
      .post("/baritsaaniiGuilgeeUstgaya", {
        gereeniiId: data?._id,
        objectiinId: _id,
        zarlaga: zarlaga || 0,
        orlogo: orlogo || 0,
        barilgiinId: data?.barilgiinId,
        guilgeeniiId,
      })
      .then(({ data }) => {
        if (data) {
          message.success(t("Төлөлт амжилттай устгагдлаа!"));
          baritsaaKhuulgaMutate();
          onFinish();
        }
      })
      .catch(aldaaBarigch);
  }
  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  return (
    <div className="flex overflow-auto flex-col space-y-2">
      <div className="grid grid-cols-5 min-w-[700px] border-b border-gray-200 bg-gray-200 text-gray-700  dark:bg-gray-800 dark:text-gray-400">
        <div className="p-1">№</div>
        <div className="p-1">{t("Огноо")}</div>
        <div className="p-1">{t("Орлого")}</div>
        <div className="p-1">{t("Зарлага")}</div>
        <div className="p-1">{t("Тайлбар")}</div>
      </div>
      {baritsaaKhuulga
        ?.map((a, i) => (
          <div className="grid grid-cols-5 border-b min-w-[700px] border-gray-200 bg-gray-50 text-gray-700 hover:bg-green-100 dark:bg-gray-700 dark:text-gray-400">
            <div className="p-1">{i + 1}</div>
            <div className="p-1">{moment(a.ognoo).format("YYYY-MM-DD")}</div>
            <div className="p-1">{formatNumber(a.orlogo, 0)}</div>
            <div className="p-1">{formatNumber(a.zarlaga, 0)}</div>
            <div className="flex justify-between p-1">
              {a.tailbar}
              {
                <div className="contents justify-between">
                  <Popconfirm
                    title={t("Төлөлт устгах уу?")}
                    okText={t("Тийм")}
                    cancelText={t("Үгүй")}
                    onConfirm={() => baritsaaniiGuilgeeUstgaya(a)}
                  >
                    <div className="hide-on-print ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border p-1 text-red-500">
                      <DeleteOutlined />
                    </div>
                  </Popconfirm>
                </div>
              }
            </div>
          </div>
        ))
        .reverse()}
    </div>
  );
}

export default React.forwardRef(BaritsaaKhuulga);
