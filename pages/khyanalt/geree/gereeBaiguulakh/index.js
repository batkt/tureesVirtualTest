import React, { useState } from "react";
import Admin from "components/Admin";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import createMethod from "tools/function/crud/createMethod";
import { message, notification, Select, Steps } from "antd";
import { useAuth } from "services/auth";
import YurunkhiiMedeelel from "components/pageComponents/gereebaiguulakh/YurunkhiiMedeelel";
import Zardal from "components/pageComponents/gereebaiguulakh/Zardal";
import KhurungiinBurtgel from "components/pageComponents/gereebaiguulakh/KhurungiinBurtgel";
import KhugatsaaBurtgel from "components/pageComponents/gereebaiguulakh/KhugatsaaBurtgel";
import TulburTootsoo from "components/pageComponents/gereebaiguulakh/TulburTootsoo";
import moment from "moment";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import _ from "lodash";
import Aos from "aos";
import { useEffect } from "react";
import { aldaaBarigch } from "services/uilchilgee";

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

function GereeBaiguulakh({ token }) {
  const { baiguullaga, barilgiinId } = useAuth();
  useEffect(() => {
    Aos.init({ once: true });
  });

  const zagvarRef = React.useRef();
  const [current, setCurrent] = React.useState(0);
  const [khadgalakhGeree, setKhagalakhGeree] = React.useState({
    ognoo: new Date(),
    gereeniiDugaar: `ГД${moment(new Date()).format("YYMMDD")}`,
    baritsaaAvakhKhugatsaa: 1,
    baritsaaAvakhSar: _.get(baiguullaga, "tokhirgoo.baritsaaAvakhSar"),
  });
  const [waiting, setWaiting] = useState(false);

  const [gereeniiZagvar, setGereeniiZagvar] = React.useState();
  const { gereeniiZagvarGaralt, setGereeniiZagvarKhuudaslalt } =
    useGereeniiZagvar(token, baiguullaga?._id);

  const next = (data) => {
    if (current === 0 && !gereeniiZagvar) {
      message.warning("Гэрээний загвар сонгоно уу!");
      zagvarRef.current.focus();
      return;
    }
    if (current === 1) {
      if (!khadgalakhGeree?.tulukhUdur) {
        notification.warning({
          message: "Төлөлт хийх өдөр заавал оруулна уу!",
        });
        return;
      }
      if (!khadgalakhGeree?.khugatsaa) {
        notification.warning({
          message: "Гэрээний хугацаа заавал оруулна уу!",
        });
        return;
      }
    }

    if (current < 4) setCurrent(current + 1);
    if (!!data) {
      data.turul = data?.baiguullagaEsekh ? "ААН" : "Иргэн";
      data.baiguullagiinNer = baiguullaga.ner;
      data.baiguullagiinId = baiguullaga._id;
      data.gereeniiZagvariinId = gereeniiZagvar._id;
      data.barilgiinId = barilgiinId;
      if (gereeniiZagvar?.turGereeEsekh !== true) {
        _.set(data.avlaga, "guilgeenuud", [
          ...(data.avlaga.guilgeenuud || []),
          {
            turul: "baritsaa",
            ognoo: data.gereeniiOgnoo,
            khyamdral: 0,
            undsenDun: data?.baritsaaAvakhDun,
            tulukhDun: data?.baritsaaAvakhDun,
          },
        ]);
      }

      if (!!data?.unemlekhniiZurag)
        data.unemlekhniiZurag = _.get(data, "unemlekhniiZurag.0.response.id");

      if (!!data?.gerchilgeeniiZurag)
        data.gerchilgeeniiZurag = _.get(
          data,
          "gerchilgeeniiZurag.0.response.id"
        );

      if (!!data?.zuvshuurliinZurag)
        data.zuvshuurliinZurag = _.get(data, "zuvshuurliinZurag.0.response.id");
      setWaiting(true);
      createMethod("gereeKhadgalya", token, data)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            setKhagalakhGeree({});
            setCurrent(0);
            message.success("Амжилттай хадгаллаа");
            setWaiting(false);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    }
  };

  function alkhamSoliyo(index) {
    if (current === 0 && !gereeniiZagvar) {
      message.warning("Гэрээний загвар сонгоно уу!");
      zagvarRef.current.focus();
      return;
    }
    if (current === 1 && index > current) {
      if (!khadgalakhGeree?.tulukhUdur) {
        notification.warning({
          message: "Төлөлт хийх өдөр заавал оруулна уу!",
        });
        return;
      }
    }
    setCurrent(index);
  }

  const onChangeGereeniiZagvar = (_id) => {
    let gereeniiZagvar =
      gereeniiZagvarGaralt?.jagsaalt?.find((a) => a._id === _id) || {};
    setGereeniiZagvar({ ...gereeniiZagvar });
  };

  const alkhamiinGereeniiZagvar = React.useMemo(() => {
    if (gereeniiZagvar === undefined) return;
    let butsaakhUtga = _.cloneDeep(gereeniiZagvar);
    if (!butsaakhUtga?.dedKhesguud)
      butsaakhUtga.dedKhesguud = butsaakhUtga.dedKhesguud.filter(
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
        .filter((a) => !!a.zaalt && a.zaalt?.indexOf(key) !== -1)
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

  return (
    <Admin
      khuudasniiNer="gereeBaiguulakh"
      title="Гэрээ байгуулах"
      className="grid grid-cols-12 gap-6 p-5"
      tsonkhniiId={"61c2c5f91c2830c4e6f90c75"}
      loading={waiting}
    >
      <div className="box col-span-12 p-5">
        <div className="contents px-10">
          <Steps current={current}>
            {steps.map((item, index) => (
              <Step
                key={item.title}
                title={item.title}
                onStepClick={() => alkhamSoliyo(index)}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              />
            ))}
          </Steps>
        </div>
        <div className="mt-3 grid grid-cols-12 gap-6 md:col-span-12">
          <div className="col-span-12 mt-3 bg-gray-50 p-2 dark:bg-gray-900 lg:col-span-6 2xl:col-span-4">
            <currentItem.content
              next={next}
              prev={prev}
              onChange={setKhagalakhGeree}
              value={khadgalakhGeree}
              token={token}
              baiguullaga={baiguullaga}
              barilgiinId={barilgiinId}
              gereeniiZagvar={gereeniiZagvar}
            />
          </div>
          <div
            className="col-span-12 mt-3 bg-gray-50 p-2 dark:bg-gray-900 lg:col-span-6 2xl:col-span-8"
            style={{ maxHeight: "calc(100vh - 17rem)", overflow: "auto" }}
            data-aos="fade-right"
            data-aos-delay="300"
            data-aos-duration="1000"
          >
            {current === 0 && (
              <Select
                ref={zagvarRef}
                showSearch
                placeholder="Гэрээний загвар сонгох"
                className="w-full"
                size="large"
                value={gereeniiZagvar?.ner ? gereeniiZagvar?.ner : null}
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
                      <div className="flex justify-between">
                        <p>{mur.ner}</p>
                        <p className="text-gray-500">
                          {mur.turGereeEsekh === true
                            ? "/Түр гэрээ/"
                            : "/Үндсэн гэрээ/"}
                        </p>
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            )}
            <div className="w-full space-y-2">
              {current === 0 && alkhamiinGereeniiZagvar?.ner && (
                <>
                  <div className="flex flex-row justify-between">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: alkhamiinGereeniiZagvar?.zuunTolgoi,
                      }}
                    />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: alkhamiinGereeniiZagvar?.baruunTolgoi,
                      }}
                    />
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>
                      {moment(khadgalakhGeree.ognoo).format("YYYY")} он{" "}
                      {moment(khadgalakhGeree.ognoo).format("MM")} сар{" "}
                      {moment(khadgalakhGeree.ognoo).format("DD")} өдөр
                    </div>
                    <div>№:{khadgalakhGeree.gereeniiDugaar}</div>
                    <div>Улаанбаатар хот</div>
                  </div>
                  <div className="w-full text-center font-medium">
                    АЖЛЫН БАЙРНЫ ТҮРЭЭСИЙН
                    {gereeniiZagvar.turGereeEsekh === true && " ТҮР"} ГЭРЭЭ
                  </div>
                </>
              )}
              {alkhamiinGereeniiZagvar?.dedKhesguud?.map((mur, index) => {
                return (
                  <div
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

export const getServerSideProps = shalgaltKhiikh;

export default GereeBaiguulakh;
