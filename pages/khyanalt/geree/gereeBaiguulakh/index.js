import React from "react";
import Admin from "components/Admin";
import uilchilgee from "services/uilchilgee";
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

const { Step } = Steps;

const steps = [
  {
    title: "Ерөнхий мэдээлэл",
    content: YurunkhiiMedeelel,
  },
  {
    title: "Барьцаа бүртгэл",
    content: Baritsaa,
  },
  {
    title: "Хөрөнгийн бүртгэл",
    content: KhurungiinBurtgel,
  },
  {
    title: "Гэрээний хугацаа",
    content: KhugatsaaBurtgel,
  },
  {
    title: "Төлбөр тооцоо",
    content: TulburTootsoo,
  },
];

function GereeBaiguulakh({ token }) {
  const { baiguullaga } = useAuth();
  const [current, setCurrent] = React.useState(0);
  const [khadgalakhGeree, setKhagalakhGeree] = React.useState({
    ognoo: new Date(),
  });
  const [gereeniiZagvar, setGereeniiZagvar] = React.useState({});
  const { gereeniiZagvarGaralt, setGereeniiZagvarKhuudaslalt } =
    useGereeniiZagvar(token, baiguullaga?._id);

  const next = (data) => {
    if (current < 4) setCurrent(current + 1);
    if (!!data) {
      data.gereeniiDugaar = `ГД${moment(new Date()).format("YYMMDD")}`;
      data.gereeniiOgnoo = new Date();
      createMethod("geree", token, data).then(({ data }) => {
        if (!!data) {
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
    uilchilgee(token)
      .get("/gereeniiZaalt", {
        query: {
          _id: gereeniiZagvar.dedKhesguud,
        },
      })
      .then(({ data }) => {
        if (!!data?.jagsaalt) {
          gereeniiZagvar.dedKhesguud = data?.jagsaalt;
          setGereeniiZagvar({ ...gereeniiZagvar });
        }
      });
  };

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
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
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
            />
          </div>
          <div className="p-2 mt-3 bg-gray-50 col-span-8">
            <Select
              showSearch
              placeholder="Үйлчилгээ сонгох"
              className="w-full"
              placeholder="Үйлчилгээ сонгох"
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
            <div className="w-full space-y-2">
              {current === 0 && (
                <>
                  <div className="flex flex-row justify-between">
                    <div>
                      БАТЛАВ: ИХ НАЯД ПЛАЗА ХХК <br />
                      ГҮЙЦЭТГЭХ ЗАХИРАЛ <br />
                      .......................................... /Д.БИЛГҮҮНДОРЖ/
                    </div>
                    <div>
                      БАТЛАВ:
                      <br />
                      _____________________________ХХК, ИРГЭН
                      <br />
                      ЗАХИРАЛ
                      <br />
                      ......................................................./..................................../
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div>
                      {moment(khadgalakhGeree.ognoo).format("YYYY")} он{" "}
                      {moment(khadgalakhGeree.ognoo).format("MM")} сар{" "}
                      {moment(khadgalakhGeree.ognoo).format("DD")} өдөр
                    </div>
                    <div>№</div>
                    <div>Улаанбаатар хот</div>
                  </div>
                  <div className="w-full text-center font-medium">
                    АЖЛЫН БАЙРНЫ ТҮРЭЭСИЙН ГЭРЭЭ
                  </div>
                  <div className="w-full text-center font-medium">
                    НЭГ. АГУУЛГА, ҮНДСЭН ЗҮЙЛ
                  </div>
                </>
              )}
              {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
                return (
                  <div className="flex flex-row">
                    <div>
                      {mur.khamaarakhKheseg || 1}.{index + 1}:
                    </div>
                    <div
                      className="ml-5"
                      dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                    />
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
