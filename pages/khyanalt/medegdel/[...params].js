import React, { useState } from "react";
import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import readMethod from "tools/function/crud/readMethod";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useSanalGomdol from "hooks/medegdel/useSanalGomdol";
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh";
import { Input, Spin } from "antd";
import moment from "moment";
import getListMethod from "tools/function/crud/getListMethod";
import formatNumber from "tools/function/formatNumber";
import useSWR from "swr";

import { uldegdeliinTurulKhurvuulya } from "./index";

function GereeniiUldegdel({ label = "", ugugdul, token, barilgiinId }) {
  const { data } = useSWR(
    !!ugugdul?.gereeniiDugaar && !!barilgiinId
      ? ["/uldegdelBodyo", barilgiinId, ugugdul?.gereeniiDugaar]
      : null,
    (url, barilgiinId, gereeniiDugaar) =>
      uilchilgee(token)
        .post(url, { barilgiinId, gereeniiDugaar })
        .then(({ data }) => data)
        .catch(aldaaBarigch),
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <div
      className={`font-medium ${
        data?.uldegdel > 0 ? "text-red-500" : "text-green-500"
      }`}
    >
      {!data ? (
        <Spin size="small" />
      ) : (
        `${label}:${formatNumber(data?.uldegdel)}`
      )}
    </div>
  );
}

function Geree({ data, token }) {
  return (
    <div
      key={data._id}
      className="grid grid-cols-5 rounded-md border-2 border-green-400"
    >
      <div className="flex h-full flex-col justify-center bg-green-500 p-2 text-center text-white">
        <div className="text-xl font-medium text-gray-50">
          {data.talbainDugaar}
        </div>
        <div className="font-medium text-gray-200">{data.talbainKhemjee}m2</div>
      </div>
      <div className="col-span-4 space-y-3 divide-y p-2">
        <div className="flex flex-row justify-between text-center">
          <div>
            <div className="text-xs text-gray-500">Гэрээний дугаар</div>
            <div>{data.gereeniiDugaar}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Эхлэх огноо</div>
            <div>{moment(data.gereeniiOgnoo).format("YYYY-MM-DD")}</div>
          </div>
          {`--->`}
          <div>
            <div className="text-xs text-gray-500">Дуусах огноо</div>
            <div>{moment(data.duusakhOgnoo).format("YYYY-MM-DD")}</div>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div>
            <label>Сарын түрээс:</label>
            {formatNumber(data.sariinTurees)}
          </div>
          <GereeniiUldegdel
            label="Үлдэгдэл"
            ugugdul={data}
            token={token}
            barilgiinId={data.barilgiinId}
          />
        </div>
      </div>
    </div>
  );
}

var timeout = false;

function index({ token, data }) {
  const [content, setContent] = useState("");
  const [body, onTextChange] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    sonorduulga,
    sonorduulgaMutate,
    jagsaalt,
    nextSonorduulga,
    setKhuudaslalt,
  } = useSanalGomdol(token, data?.khariltsagch?._id);
  const { khariltsagch, gereenuud } = data || {};

  async function msgIlgeeye() {
    if (loading) {
      message.warning("Хүсэлт илгээгдсэн байна");
      return;
    }

    setLoading(true);
    uilchilgee(token)
      .post(`/sonorduulgaIlgeeye`, {
        firebaseToken: khariltsagch.firebaseToken,
        khariltsagchiinId: khariltsagch._id,
        barilgiinId: khariltsagch.barilgiinId,
        khariltsagchiinNer: khariltsagch.ner,
        medeelel: { title, body },
      })
      .then(({ data }) => {
        if (!!data?.successCount) {
          sonorduulga.jagsaalt.unshift({
            khariltsagchiinId: khariltsagch._id,
            barilgiinId: khariltsagch.barilgiinId,
            khariltsagchiinNer: khariltsagch.ner,
            title,
            message: body,
            turul: "medegdel",
          });
          sonorduulgaMutate({ ...sonorduulga }, false);
          notification.success({ message: "СМС Амжилттай илгээлээ" });
          setLoading(false);
        } else if (!!data?.failureCount) {
          notification.warning({
            description: _.get(data, "results.0.error.message"),
            message: _.get(data, "results.0.error.code"),
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
        aldaaBarigch(e);
      });
  }

  function seen() {
    const seenList = [...jagsaalt, ...(sonorduulga?.jagsaalt || [])].filter(
      (a) => a.turul !== "medegdel" && a.kharsanEsekh !== true
    );
    if (seenList.length > 0) {
      const seenIds = seenList.map((a) => a._id);
      if (
        jagsaalt.filter(
          (a) => a.turul !== "medegdel" && a.kharsanEsekh === false
        ).length > 0
      )
        setKhuudaslalt((a) => {
          a.jagsaalt.forEach((b) => {
            if (b.turul !== "medegdel" && b.kharsanEsekh === false)
              b.kharsanEsekh = true;
          });
          return a;
        });
      uilchilgee(token)
        .post("/sanalKharlaa", { id: seenIds })
        .then(() => {
          if (
            sonorduulga?.jagsaalt?.filter(
              (a) => a.turul !== "medegdel" && a.kharsanEsekh === false
            ).length > 0
          )
            sonorduulgaMutate();
        })
        .catch(aldaaBarigch);
    }
  }

  function onScroll(e) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      seen();
    }, 300);

    if (e.target.scrollHeight + e.target.scrollTop === e.target.clientHeight) {
      nextSonorduulga();
    }
  }

  return (
    <Admin
      dedKhuudas
      title="Мэдэгдэл"
      khuudasniiNer="medegdel"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setKhuudaslalt && setKhuudaslalt((a) => ({ ...a, search }))
      }
    >
      <div className="box col-span-3 space-y-5 p-5">
        {gereenuud?.map((a) => (
          <Geree
            data={a}
            token={token}
            key={a._id}
            className="rounded-md border-2 border-green-400 p-2 "
          />
        ))}
      </div>
      <div className="col-span-9">
        <div className="box flex h-full flex-col">
          <div className="dark:border-dark-5 flex flex-col border-b border-gray-200 px-5 py-4 sm:flex-row">
            {khariltsagch && (
              <div className="flex items-center">
                <div className="image-fit relative h-10 w-10 flex-none sm:h-12 sm:w-12">
                  <img
                    alt="Rubick Tailwind HTML Admin Template"
                    className="rounded-full"
                    src={
                      ((khariltsagch.register?.replace(/^\D+/g, "") % 100) /
                        10) %
                        2 <
                      1
                        ? "/profileFemale.svg"
                        : "/profile.svg"
                    }
                  />
                </div>
                <div className="ml-3 mr-auto">
                  <div className="text-base font-medium">
                    {khariltsagch?.ner}
                  </div>
                  <div className="text-xs text-gray-600 sm:text-sm">
                    {khariltsagch?.utas} <span className="mx-1">•</span> SMS
                  </div>
                </div>
              </div>
            )}
            <div className="ml-auto flex items-center space-x-2 font-medium"></div>
          </div>
          <div
            className="flex flex-col-reverse overflow-y-auto p-5"
            style={{ maxHeight: "calc(100vh - 28rem)" }}
            onScroll={onScroll}
          >
            {[...jagsaalt, ...(sonorduulga?.jagsaalt || [])]?.map((a) => {
              return (
                <div
                  key={a._id}
                  className={`relative mt-8 flex w-1/3 flex-col rounded-xl border border-green-200 bg-green-500 p-3 ${
                    a.turul === "medegdel"
                      ? "ml-auto rounded-br-none bg-blue-500"
                      : "rounded-bl-none"
                  }`}
                >
                  <span className="text-white">{a.message}</span>
                  <div
                    className={`absolute right-2 h-5 w-5 fill-current text-white ${
                      a.kharsanEsekh === true ? "" : "hidden"
                    }`}
                  >
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 12.5L5.57574 16.5757C5.81005 16.8101 6.18995 16.8101 6.42426 16.5757L9 14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M16 7L12 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M7 12L11.5757 16.5757C11.8101 16.8101 12.1899 16.8101 12.4243 16.5757L22 7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span className="absolute -bottom-5 text-xs font-medium text-gray-500">
                    {moment(a.createdAt).format("YYYY-MM-DD hh:mm")}
                  </span>
                  <span className="absolute right-0 -bottom-5 text-gray-500">
                    {uldegdeliinTurulKhurvuulya(a.turul)}
                  </span>
                </div>
              );
            })}
          </div>
          {(sonorduulga || jagsaalt.length > 0) && (
            <div className="mt-auto w-full p-2">
              <Input
                placeholder="Гарчиг"
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
              <ZagvarUusgekh
                change={setContent}
                value={content}
                onTextChange={onTextChange}
              />
            </div>
          )}

          <div className="flex w-full items-center justify-end space-x-2 p-2">
            <label className="font-medium">СМС Илгээх</label>
            <div
              onClick={msgIlgeeye}
              className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full bg-green-600 text-white sm:h-10 sm:w-10"
            >
              {loading ? (
                <Spin size="small" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx, session) => {
  const { data } = await readMethod(
    "sanalGomdol",
    session?.tureestoken,
    ctx.query.params[1]
  );

  const khariltsagch = await readMethod(
    "khariltsagch",
    session?.tureestoken,
    data?.khariltsagchiinId
  );
  const gereenuud = await getListMethod("geree", session?.tureestoken, {
    query: { register: khariltsagch?.data?.register || "" },
  });
  data.khariltsagch = khariltsagch?.data || {};
  data.gereenuud = gereenuud?.data?.jagsaalt;
  return data;
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx, ugudulAvchirya);

export default index;
