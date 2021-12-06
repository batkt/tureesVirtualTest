import React from "react";
import Admin from "components/Admin";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import updateMethod from "tools/function/crud/updateMethod";
import readMethod from "tools/function/crud/readMethod";
import { Button, message, Select, Steps } from "antd";
import { useAuth } from "services/auth";
import YurunkhiiMedeelel from "components/pageComponents/gereebaiguulakh/YurunkhiiMedeelel";
import Baritsaa from "components/pageComponents/gereebaiguulakh/Baritsaa";
import KhurungiinBurtgel from "components/pageComponents/gereebaiguulakh/KhurungiinBurtgel";
import KhugatsaaBurtgel from "components/pageComponents/gereebaiguulakh/KhugatsaaBurtgel";
import TulburTootsoo from "components/pageComponents/gereebaiguulakh/TulburTootsoo";
import moment from "moment";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import {url} from "services/uilchilgee";
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

function GereeBaiguulakh({ token,data }) {
  const { baiguullaga ,barilgiinId} = useAuth();
  const router = useRouter()
  const [current, setCurrent] = React.useState(0);
  const [khadgalakhGeree, setKhagalakhGeree] = React.useState(data || {
    ognoo: new Date(),
    gereeniiDugaar: `ГД${moment(new Date()).format("YYMMDD")}`,
  });

  const [gereeniiZagvar, setGereeniiZagvar] = React.useState(data?.gereeniiZagvar || {});
  const { gereeniiZagvarGaralt, setGereeniiZagvarKhuudaslalt } =
    useGereeniiZagvar(token, baiguullaga?._id);

  const next = (data) => {
    if (current < 4) setCurrent(current + 1);
    if (!!data) {
      khadgalya(data)
    }
  };

  function khadgalya(data) {
      data.turul = data?.baiguullagaEsekh ? 'ААН' : 'Иргэн'
      data.baiguullagiinNer = baiguullaga.ner
      data.baiguullagiinId = baiguullaga._id
      data.gereeniiZagvariinId = gereeniiZagvar._id
      data.barilgiinId = barilgiinId
      
      if (!!data?.unemlekhniiZurag)
        data.unemlekhniiZurag = _.get(data, "unemlekhniiZurag.0.response.id");

      if (!!data?.gerchilgeeniiZurag)
        data.gerchilgeeniiZurag = _.get(
          data,
          "gerchilgeeniiZurag.0.response.id"
        );

      if (!!data?.zuvshuurliinZurag)
        data.zuvshuurliinZurag = _.get(data, "zuvshuurliinZurag.0.response.id");

      updateMethod("geree", token, data).then(({ data }) => {
        if (data === "Amjilttai") {
          setKhagalakhGeree({});
          setCurrent(0);
          router.back()
          message.success("Амжилттай хадгаллаа");
        }
      });
  }

  const onChangeGereeniiZagvar = (_id) => {
    let gereeniiZagvar =
      gereeniiZagvarGaralt?.jagsaalt?.find((a) => a._id === _id) || {};
    setGereeniiZagvar({ ...gereeniiZagvar });
  };

  const alkhamiinGereeniiZagvar = React.useMemo(() => {
    let butsaakhUtga = _.cloneDeep(gereeniiZagvar);
    if (!butsaakhUtga?.dedKhesguud) return {};

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
    }
    butsaakhUtga.dedKhesguud = butsaakhUtga.dedKhesguud.filter(
      (a) => a.khamaarakhKheseg === steps[current].title
    );
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
      hideSearch
      dedKhuudas
    >
      <div className="col-span-12 p-5 box">
        <div className="px-10">
          <Steps current={current}>
            {steps.map((item,index) => (
              <Step key={item.title} title={item.title} onStepClick={()=>setCurrent(index)}/>
            ))}
          </Steps>
        </div>
        <div className="mt-3 grid grid-cols-12 gap-6">
          <div className="p-2 mt-3 bg-gray-50 dark:bg-gray-900 col-span-4">
            <currentItem.content
              next={next}
              prev={prev}
              onChange={setKhagalakhGeree}
              value={khadgalakhGeree}
              token={token}
              baiguullaga={baiguullaga}
              zasvar
            />
            {JSON.stringify(data) !== JSON.stringify(khadgalakhGeree) && <Button type='primary' style={{width:'100%',marginTop:10}} onClick={()=>khadgalya(khadgalakhGeree)}>Хадгалах</Button>}
          </div>
          <div
            className="p-2 mt-3 bg-gray-50 dark:bg-gray-900 col-span-8"
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
                  setGereeniiZagvarKhuudaslalt((a) => ({ ...a, search,khuudasniiDugaar:1 }))
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

const ugudulAvchirya = async (ctx,session) => {
  const {data} = await readMethod('geree',session.tureestoken,ctx.query.id)
  data.baiguullagaEsekh = data.turul === 'ААН' ? true : false;
  
  if (!!data?.unemlekhniiZurag){
    _.set(data, "unemlekhniiZurag",[{
      uid: '-1',
      name: data?.unemlekhniiZurag,
      status: 'done',
      url: `${url}/zuragAvya/unemlekhniiZurag/${data?.baiguullagiinId}/${data?.unemlekhniiZurag}`,
      thumbUrl: `${url}/zuragAvya/unemlekhniiZurag/${data?.baiguullagiinId}/${data?.unemlekhniiZurag}`,
      response:{
        id:data?.unemlekhniiZurag
      }
    }]);
  }

  if (!!data?.gerchilgeeniiZurag){
    _.set(data, "gerchilgeeniiZurag",[{
      uid: '-1',
      name: data?.gerchilgeeniiZurag,
      status: 'done',
      url: `${url}/zuragAvya/gerchilgeeniiZurag/${data?.baiguullagiinId}/${data?.gerchilgeeniiZurag}`,
      thumbUrl: `${url}/zuragAvya/gerchilgeeniiZurag/${data?.baiguullagiinId}/${data?.gerchilgeeniiZurag}`,
      response:{
        id:data?.gerchilgeeniiZurag
      }
    }]);
  }

  if (!!data?.zuvshuurliinZurag){
    _.set(data, "zuvshuurliinZurag",[{
      uid: '-1',
      name: data?.zuvshuurliinZurag,
      status: 'done',
      url: `${url}/zuragAvya/zuvshuurliinZurag/${data?.baiguullagiinId}/${data?.zuvshuurliinZurag}`,
      thumbUrl: `${url}/zuragAvya/zuvshuurliinZurag/${data?.baiguullagiinId}/${data?.zuvshuurliinZurag}`,
      response:{
        id:data?.zuvshuurliinZurag
      }
    }]);
  }
  var gereeniiZagvar = {data:null}
  if(data?.gereeniiZagvariinId)
    gereeniiZagvar = await readMethod('gereeniiZagvar',session.tureestoken,data.gereeniiZagvariinId)
    
  data.gereeniiZagvar = gereeniiZagvar.data
  return data
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx,ugudulAvchirya);

export default GereeBaiguulakh;
