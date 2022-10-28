import React, { useCallback, useEffect, useState } from "react";
import Admin from "components/Admin";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import readMethod from "tools/function/crud/readMethod";
import { Button, message, Select, Steps } from "antd";
import { useAuth } from "services/auth";
import YurunkhiiMedeelel from "components/pageComponents/gereebaiguulakh/YurunkhiiMedeelel";
import Zardal from "components/pageComponents/gereebaiguulakh/Zardal";
import KhurungiinBurtgel from "components/pageComponents/gereebaiguulakh/KhurungiinBurtgel";
import KhugatsaaBurtgel from "components/pageComponents/gereebaiguulakh/KhugatsaaBurtgel";
import TulburTootsoo from "components/pageComponents/gereebaiguulakh/TulburTootsoo";
import moment from "moment";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { url } from "services/uilchilgee";
import _ from "lodash";
import { useRouter } from "next/router";

const { Step } = Steps;

const steps = [
  {
    title: "Ерөнхий мэдээлэл",
    content: YurunkhiiMedeelel,
    zaaltiinTolgoi: "НЭГ. АГУУЛГА, ҮНДСЭН ЗҮЙЛ",
  },
  {
    title: "Гэрээний хугацаа",
    content: KhugatsaaBurtgel,
    zaaltiinTolgoi: "ХОЁР. ГЭРЭЭНИЙ ХУГАЦАА",
  },
  {
    title: "Түрээсийн талбай",
    content: KhurungiinBurtgel,
    zaaltiinTolgoi: "ДӨРӨВ. БАЙРЛАЛ, ДУГААР, ХЭМЖЭЭ",
  },
  {
    title: "Зардал бүртгэл",
    content: Zardal,
    zaaltiinTolgoi: "ГУРАВ. ЗАРДАЛ",
  },
  {
    title: "Төлбөр тооцоо",
    content: TulburTootsoo,
    zaaltiinTolgoi: "ТАВ.ТӨЛБӨР ТООЦОО",
  },
];

function GereeBaiguulakh({ token, data }) {
  const { baiguullaga, barilgiinId } = useAuth();
  const router = useRouter();
  const [current, setCurrent] = React.useState(0);
  const [khadgalakhGeree, setKhagalakhGeree] = React.useState(
    _.cloneDeep(data) || {
      ognoo: new Date(),
      gereeniiDugaar: `ГД${moment(new Date()).format("YYMMDD")}`,
    }
  );

  const [gereeniiZagvar, setGereeniiZagvar] = React.useState(
    data?.gereeniiZagvar || {}
  );
  const { gereeniiZagvarGaralt, setGereeniiZagvarKhuudaslalt } =
    useGereeniiZagvar(token, baiguullaga?._id);
  const [waiting, setWaiting] = useState(false);

  const next = (data) => {
    if (current < 4) {
      setCurrent(current + 1);
    }
    if (!!data) {
      khadgalya(data);
    }
  };
  useEffect(() => {
    if (current === 0) {
      var elem = document.getElementById("erunkhiiMedeelel");
      elem?.scrollIntoView();
    }
    if (current === 1) {
      var elem = document.getElementById("gereeniiKhugatsaa");
      elem?.scrollIntoView();
    }
    if (current === 2) {
      var elem = document.getElementById("tureesiinTalbai");
      elem?.scrollIntoView();
    }
    if (current === 3) {
      var elem = document.getElementById("baritsaaBurtgel");
      elem?.scrollIntoView();
    }
    if (current === 4) {
      var elem = document.getElementById("tulburToostoo");
      elem?.scrollIntoView();
    }
  }, [current]);

  function khadgalya(data) {
    setWaiting(true);
    data.turul = data?.baiguullagaEsekh ? "ААН" : "Иргэн";
    data.baiguullagiinNer = baiguullaga.ner;
    data.baiguullagiinId = baiguullaga._id;
    data.gereeniiZagvariinId = gereeniiZagvar._id;
    data.barilgiinId = barilgiinId;
    data.turGereeEsekh = gereeniiZagvar?.turGereeEsekh;

    if (!!data?.unemlekhniiZurag)
      data.unemlekhniiZurag =
        _.get(data, "unemlekhniiZurag.0.response.id") || null;

    if (!!data?.gerchilgeeniiZurag)
      data.gerchilgeeniiZurag =
        _.get(data, "gerchilgeeniiZurag.0.response.id") || null;

    if (!!data?.zuvshuurliinZurag)
      data.zuvshuurliinZurag =
        _.get(data, "zuvshuurliinZurag.0.response.id") || null;

    uilchilgee(token)
      .post("/gereeZasya", data)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setKhagalakhGeree({});
          router.back();
          message.success("Амжилттай хадгаллаа");
        }
      });
  }

  const onChangeGereeniiZagvar = (_id) => {
    let gereeniiZagvar =
      gereeniiZagvarGaralt?.jagsaalt?.find((a) => a._id === _id) || {};
    setGereeniiZagvar({ ...gereeniiZagvar });
    document.getElementById("gereeniiKhugatsaaButton").focus();
  };

  const alkhamiinGereeniiZagvar = React.useMemo(() => {
    if (gereeniiZagvar === undefined) return;
    let butsaakhUtga = _.cloneDeep(gereeniiZagvar);
    if (!butsaakhUtga?.dedKhesguud)
      butsaakhUtga.dedKhesguud = butsaakhUtga?.dedKhesguud?.filter(
        (a) => a.khamaarakhKheseg === steps[current].title
      );
    if (khadgalakhGeree.gereeniiOgnoo) {
      khadgalakhGeree.ekhlekhOn = moment(khadgalakhGeree.gereeniiOgnoo).format(
        "YYYY"
      );
      khadgalakhGeree.ekhelkhSar = moment(khadgalakhGeree.gereeniiOgnoo).format(
        "MM"
      );
      khadgalakhGeree.ekhlekhUdur = moment(
        khadgalakhGeree.gereeniiOgnoo
      ).format("DD");
      if (khadgalakhGeree.khugatsaa > 0) {
        // let duusakhOgnoo = moment(khadgalakhGeree.gereeniiOgnoo).add(
        //   khadgalakhGeree.khugatsaa,
        //   "months"
        // )
        let duusakhOgnoo = moment(khadgalakhGeree.duusakhOgnoo);

        khadgalakhGeree.duusakhOn = duusakhOgnoo.format("YYYY");
        khadgalakhGeree.duusakhSar = duusakhOgnoo.format("MM");
        khadgalakhGeree.duusakhUdur = duusakhOgnoo.format("DD");
      }
    }

    for (const [key, value] of Object.entries(khadgalakhGeree)) {
      butsaakhUtga.dedKhesguud
        ?.filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
        .map((b) => {
          b.zaalt = b.zaalt.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
        });
      butsaakhUtga.baruunTolgoi = butsaakhUtga.baruunTolgoi?.replace(
        new RegExp(`&lt;${key}&gt;`, "g"),
        value
      );
    }

    return butsaakhUtga;
  }, [gereeniiZagvar, khadgalakhGeree, current]);

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const currentItem = steps[current];
  const gereeniiZagvariinId = "gereeniiZagvar";

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
      hideSearch
      dedKhuudas
      loading={waiting}
    >
      <div className="box col-span-12 p-5">
        <div className="px-10">
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step
                key={item.title}
                title={item.title}
                onStepClick={() => setCurrent(index)}
              />
            ))}
          </Steps>
        </div>
        <div className="mt-3 grid grid-cols-12 gap-6">
          <div className="col-span-12 mt-3 bg-gray-50 p-2 dark:bg-gray-900 lg:col-span-6 2xl:col-span-4">
            <currentItem.content
              next={next}
              prev={prev}
              onChange={setKhagalakhGeree}
              value={khadgalakhGeree}
              token={token}
              baiguullaga={baiguullaga}
              gereeniiZagvar={gereeniiZagvar}
              zasvar
              barilgiinId={barilgiinId}
              gereeniiZagvariinId={gereeniiZagvariinId}
            />
            {JSON.stringify(data) !== JSON.stringify(khadgalakhGeree) && (
              <Button
                type="primary"
                style={{ width: "100%", marginTop: 10 }}
                onClick={() => khadgalya(khadgalakhGeree)}
              >
                Хадгалах
              </Button>
            )}
          </div>
          <div
            className="col-span-12 mt-3 bg-gray-50 p-2 dark:bg-gray-900 lg:col-span-6 2xl:col-span-8"
            style={{
              maxHeight: "calc(100vh - 17rem)",
              overflow: "auto",
              scrollBehavior: "smooth",
            }}
          >
            {current === 0 && (
              <Select
                showSearch
                id={gereeniiZagvariinId}
                placeholder="Гэрээний загвар сонгох"
                className="w-full"
                size="large"
                value={null}
                filterOption={(o) => o}
                onSearch={(search) =>
                  setGereeniiZagvarKhuudaslalt((a) => ({
                    ...a,
                    search,
                    khuudasniiDugaar: 1,
                  }))
                }
                onChange={onChangeGereeniiZagvar}
              >
                {gereeniiZagvarGaralt?.jagsaalt?.map((mur) => {
                  return (
                    <Select.Option key={mur._id}>
                      <div dangerouslySetInnerHTML={{ __html: mur.ner }} />
                    </Select.Option>
                  );
                })}
              </Select>
            )}
            <div className="w-full space-y-2">
              {current === 0 && gereeniiZagvar?.ner && (
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
                </>
              )}
              {alkhamiinGereeniiZagvar?.dedKhesguud?.map((mur, index) => {
                return (
                  <div
                    id={
                      mur.khamaarakhKheseg === "Ерөнхий мэдээлэл"
                        ? "erunkhiiMedeelel"
                        : mur.khamaarakhKheseg === "Гэрээний хугацаа"
                        ? "gereeniiKhugatsaa"
                        : mur.khamaarakhKheseg === "Түрээсийн талбай"
                        ? "tureesiinTalbai"
                        : mur.khamaarakhKheseg === "Барьцаа бүртгэл"
                        ? "baritsaaBurtgel"
                        : mur.khamaarakhKheseg === "Төлбөр тооцоо"
                        ? "tulburToostoo"
                        : ""
                    }
                    key={`alkhamiinGereeniiZagvar${index}`}
                    className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {mur.kharagdakhDugaar ? (
                      <>
                        <div className="text-center">
                          {mur.kharagdakhDugaar}
                        </div>
                        <div
                          className={`${
                            mur.zaalt?.includes("table")
                              ? "sun-editor-editable"
                              : ""
                          } ml-5 w-full p-0`}
                          dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                        />
                      </>
                    ) : (
                      <div
                        className="w-full text-center"
                        dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx, session) => {
  const { data } = await readMethod("geree", session.tureestoken, ctx.query.id);
  data.baiguullagaEsekh = data.turul === "ААН" ? true : false;

  if (!!data?.unemlekhniiZurag && data?.unemlekhniiZurag !== "") {
    _.set(data, "unemlekhniiZurag", [
      {
        uid: "-1",
        name: data?.unemlekhniiZurag,
        status: "done",
        url: `${url}/zuragAvya/unemlekhniiZurag/${data?.baiguullagiinId}/${data?.unemlekhniiZurag}`,
        thumbUrl: `${url}/zuragAvya/unemlekhniiZurag/${data?.baiguullagiinId}/${data?.unemlekhniiZurag}`,
        response: {
          id: data?.unemlekhniiZurag,
        },
      },
    ]);
  }

  if (!!data?.gerchilgeeniiZurag && data?.gerchilgeeniiZurag !== "") {
    _.set(data, "gerchilgeeniiZurag", [
      {
        uid: "-1",
        name: data?.gerchilgeeniiZurag,
        status: "done",
        url: `${url}/zuragAvya/gerchilgeeniiZurag/${data?.baiguullagiinId}/${data?.gerchilgeeniiZurag}`,
        thumbUrl: `${url}/zuragAvya/gerchilgeeniiZurag/${data?.baiguullagiinId}/${data?.gerchilgeeniiZurag}`,
        response: {
          id: data?.gerchilgeeniiZurag,
        },
      },
    ]);
  }

  if (!!data?.zuvshuurliinZurag && data?.zuvshuurliinZurag !== "") {
    _.set(data, "zuvshuurliinZurag", [
      {
        uid: "-1",
        name: data?.zuvshuurliinZurag,
        status: "done",
        url: `${url}/zuragAvya/zuvshuurliinZurag/${data?.baiguullagiinId}/${data?.zuvshuurliinZurag}`,
        thumbUrl: `${url}/zuragAvya/zuvshuurliinZurag/${data?.baiguullagiinId}/${data?.zuvshuurliinZurag}`,
        response: {
          id: data?.zuvshuurliinZurag,
        },
      },
    ]);
  }
  var gereeniiZagvar = { data: null };
  if (data?.gereeniiZagvariinId)
    gereeniiZagvar = await readMethod(
      "gereeniiZagvar",
      session.tureestoken,
      data.gereeniiZagvariinId
    );

  data.gereeniiZagvar = gereeniiZagvar.data;
  data.baritsaaAvakhEsekh = data.baritsaaAvakhDun > 0;
  return data;
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx, ugudulAvchirya);

export default GereeBaiguulakh;
