import React, { useEffect, useState } from "react";
import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import useSanalGomdol from "hooks/medegdel/useSanalGomdol";
import ZagvarUusgekh from "components/pageComponents/medegdel/ZagvarUusgekh";
import getListMethod from "tools/function/crud/getListMethod";
import { Input, notification, Spin, Tooltip } from "antd";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useSWR from "swr";

import { uldegdeliinTurulKhurvuulya } from "./index";
import useKhariltsagch from "hooks/useKhariltsagch";
import { useAuth } from "services/auth";
import { useRouter } from "next/router";

const order = { updatedAt: -1 };

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
        <Tooltip placement="left" title={data.talbainDugaar}>
          <div className="truncate text-xl font-medium text-gray-50">
            {data.talbainDugaar}
          </div>
        </Tooltip>
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
  const [khariltsagch, setKhariltsagch] = useState(null);
  const { baiguullaga } = useAuth();
  const { khariltsagchiinGaralt, setKhariltsagchKhuudaslalt } = useKhariltsagch(
    token,
    baiguullaga?._id,
    100,
    undefined,
    order
  );
  const {
    sonorduulga,
    sonorduulgaMutate,
    jagsaalt,
    nextSonorduulga,
    setKhuudaslalt,
  } = useSanalGomdol(token, khariltsagch?._id);
  React.useEffect(() => {
    khariltsagch?.register &&
      getListMethod("geree", token, {
        query: { register: khariltsagch?.register || "" },
      }).then(({ data }) => {
        setGereenuud(data?.jagsaalt);
      });
  }, [khariltsagch]);

  const [gereenuud, setGereenuud] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  async function msgIlgeeye() {
    if (loading) {
      message.warning("Хүсэлт илгээгдсэн байна");
      return;
    }
    setContent("");
    setTitle("");
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
          notification.success({ message: "Санал Хүсэлт Амжилттай илгээлээ" });
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
  useEffect(() => {
    if (id) {
      setKhariltsagch(
        khariltsagchiinGaralt?.jagsaalt?.find((mur) => id === mur._id)
      );
    }
  }, [id, khariltsagchiinGaralt]);

  return (
    <Admin
      title="Санал хүсэлт"
      khuudasniiNer="sanalKhuselt"
      className="p-0 transition-all md:p-4"
      onSearch={(search) =>
        setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
    >
      <div
        className={`col-span-12 lg:col-span-6 ${
          khariltsagch === null ? "xl:col-span-4" : "xl:col-span-3"
        } `}
      >
        <div className="box p-5">
          <div className="relative w-full text-gray-700   dark:text-gray-300">
            <input
              type="text"
              className="w-full rounded-md bg-gray-100 px-2  py-1   dark:bg-gray-700"
              placeholder="Харилцагч хайх /Утас , Нэр, Регистр/"
              onSearch={(search) =>
                setKhariltsagchKhuudaslalt((a) => ({ ...a, search }))
              }
              onChange={({ target }) => {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                  setKhariltsagchKhuudaslalt((a) => ({
                    ...a,
                    search: target.value,
                  }));
                }, 300);
              }}
            />
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
              className="feather feather-search absolute inset-y-0 right-0 my-auto mr-3 mt-2 h-4 w-4"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div
            className="scrollbar-hidden mt-5 overflow-y-scroll"
            style={{ height: "calc(100vh - 13rem)" }}
          >
            {khariltsagchiinGaralt?.jagsaalt?.map((mur) => (
              <div
                className={`flex cursor-pointer flex-row items-center space-x-2 rounded-md p-2 ${
                  khariltsagch?._id === mur?._id
                    ? "bg-green-100 dark:bg-green-500"
                    : ""
                } `}
                key={mur?._id}
                onClick={() => setKhariltsagch(mur)}
              >
                <div className="image-fit relative h-10 w-10 flex-none rounded-full">
                  <img
                    alt="Rubick"
                    className="rounded-full"
                    src={
                      ((mur.register?.replace(/^\D+/g, "") % 100) / 10) % 2 < 1
                        ? "/profileFemale.svg"
                        : "/profile.svg"
                    }
                  />
                  <div className="bg-theme-9 absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white"></div>
                </div>
                <div
                  className={`truncate text-center text-xs text-gray-600  ${
                    khariltsagch?._id === mur?._id
                      ? "dark:text-gray-50"
                      : "dark:text-gray-400"
                  }`}
                >
                  {mur?.ner}
                </div>
                <div
                  className={`truncate text-center text-xs text-gray-600 ${
                    khariltsagch?._id === mur?._id
                      ? "dark:text-gray-50"
                      : "dark:text-gray-400"
                  }`}
                >
                  {mur?.register}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {khariltsagch !== null && (
        <div
          style={{ height: "calc(100vh - 7.5rem)" }}
          className="box col-span-3 space-y-5 overflow-y-auto p-5"
        >
          {gereenuud?.length < 1 ? (
            <div className="flex h-full w-full items-center justify-center text-lg font-medium">
              Харилцагч гэрээ байгуулаагүй байна!
            </div>
          ) : (
            gereenuud?.map((a) => (
              <Geree
                data={a}
                token={token}
                key={a._id}
                className="rounded-md border-2 border-green-400 p-2 "
              />
            ))
          )}
        </div>
      )}
      {khariltsagch !== null ? (
        <div className="col-span-6">
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
                    className={`relative mt-8 flex w-1/3 flex-col break-words rounded-xl border border-green-200 bg-green-500 p-3 ${
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
      ) : (
        <div className="box col-span-8 flex h-full items-center">
          <div className="mx-auto text-center">
            <div className="flex justify-center">
              <div className="image-fit z-10 h-16 w-16 flex-none overflow-hidden rounded-full">
                <img
                  alt="Rubick Tailwind HTML Admin Template"
                  src="/profile.svg"
                />
              </div>
              <div className="image-fit z-0 -ml-5 h-16 w-16 flex-none overflow-hidden rounded-full">
                <img
                  alt="Rubick Tailwind HTML Admin Template"
                  src="/profileFemale.svg"
                />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-medium">Өдрийн мэнд</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">
                Та санал хүсэлт илгээх харилцагчаа сонгоно уу.
              </div>
            </div>
          </div>
        </div>
      )}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default index;
