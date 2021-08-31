import React from "react";
import Admin from "components/Admin";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import createMethod from "tools/function/crud/createMethod";
import { message, Select, Steps } from "antd";
import { useAuth } from "services/auth";
import YurunkhiiMedeelel from "components/pageComponents/gereebaiguulakh/YurunkhiiMedeelel";
import Baritsaa from "components/pageComponents/gereebaiguulakh/Baritsaa";
import KhurungiinBurtgel from "components/pageComponents/gereebaiguulakh/KhurungiinBurtgel";
import KhugatsaaBurtgel from "components/pageComponents/gereebaiguulakh/KhugatsaaBurtgel";
import TulburTootsoo from "components/pageComponents/gereebaiguulakh/TulburTootsoo";
import moment from "moment";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import _ from "lodash";

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
    title: "Барьцаа бүртгэл",
    content: Baritsaa,
    zaaltiinTolgoi: "ГУРАВ. БАРЬЦАА",
  },
  {
    title: "Төлбөр тооцоо",
    content: TulburTootsoo,
    zaaltiinTolgoi: "ТАВ.ТӨЛБӨР ТООЦОО",
  },
];

function GereeBaiguulakh({ token }) {
  const { baiguullaga } = useAuth();
  const [current, setCurrent] = React.useState(0);
  const [khadgalakhGeree, setKhagalakhGeree] = React.useState({
    ognoo: new Date(),
    gereeniiDugaar: `ГД${moment(new Date()).format("YYMMDD")}`,
  });

  const [gereeniiZagvar, setGereeniiZagvar] = React.useState({});
  const { gereeniiZagvarGaralt, setGereeniiZagvarKhuudaslalt } =
    useGereeniiZagvar(token, baiguullaga?._id);

  const next = (data) => {
    if (current < 4) setCurrent(current + 1);
    if (!!data) {
      data.turul = data?.baiguullagaEsekh ? 'ААН' : 'Иргэн'
      data.baiguullagiinNer = baiguullaga.ner
      data.baiguullagiinId = baiguullaga._id
      data.gereeniiZagvariinId = gereeniiZagvar._id
      
      if (!!data?.unemlekhniiZurag)
        data.unemlekhniiZurag = _.get(data, "unemlekhniiZurag.0.response.id");

      if (!!data?.gerchilgeeniiZurag)
        data.gerchilgeeniiZurag = _.get(
          data,
          "gerchilgeeniiZurag.0.response.id"
        );

      if (!!data?.zuvshuurliinZurag)
        data.zuvshuurliinZurag = _.get(data, "zuvshuurliinZurag.0.response.id");

      createMethod("geree", token, data).then(({ data }) => {
        if (data === "Amjilttai") {
          setKhagalakhGeree({});
          setCurrent(0);
          message.success("Амжилттай хадгаллаа");
        }
      });
    }
  };

  const onChangeGereeniiZagvar = (_id) => {
    let gereeniiZagvar =
      gereeniiZagvarGaralt?.jagsaalt?.find((a) => a._id === _id) || {};
    setGereeniiZagvar({ ...gereeniiZagvar });
  };

  const alkhamiinGereeniiZagvar = React.useMemo(() => {
    let butsaakhUtga = _.cloneDeep(gereeniiZagvar);
    if (!butsaakhUtga?.dedKhesguud) return {};
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
        let duusakhOgnoo = moment(khadgalakhGeree.gereeniiOgnoo).add(
          khadgalakhGeree.khugatsaa,
          "M"
        );
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
      butsaakhUtga.baruunTolgoi = butsaakhUtga.baruunTolgoi?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
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
    >
      <div className="col-span-12 p-5 box">
        <div className="px-10">
          <Steps current={current}>
            {steps.map((item,index) => (
              <Step key={item.title} title={item.title} onStepClick={()=>(index < current) && setCurrent(index)} />
            ))}
          </Steps>
        </div>
        <div className="mt-3 grid grid-cols-12 gap-6">
          <div className="p-2 mt-3 bg-gray-50 col-span-4">
            <currentItem.content
              next={next}
              prev={prev}
              onChange={setKhagalakhGeree}
              value={khadgalakhGeree}
              token={token}
              baiguullaga={baiguullaga}
            />
          </div>
          <div
            className="p-2 mt-3 bg-gray-50 col-span-8"
            style={{ maxHeight: "calc(100vh - 15rem)", overflow: "auto" }}
          >
            {current === 0 && (
              <Select
                showSearch
                placeholder="Гэрээний загвар сонгох"
                className="w-full"
                size="large"
                value={null}
                filterOption={(o) => o}
                onSearch={(search) =>
                  setGereeniiZagvarKhuudaslalt((a) => ({ ...a, search }))
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
                    АЖЛЫН БАЙРНЫ ТҮРЭЭСИЙН ГЭРЭЭ
                  </div>
                </>
              )}
              {alkhamiinGereeniiZagvar?.dedKhesguud?.map((mur, index) => {
                return (
                  <div
                    key={`alkhamiinGereeniiZagvar${index}`}
                    className="flex flex-row w-full p-1 relative group hover:bg-gray-100 rounded-md"
                  >
                    {mur.kharagdakhDugaar ? (
                      <>
                        <div className="text-center">
                          {mur.kharagdakhDugaar}
                        </div>
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
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default GereeBaiguulakh;
