import { Button, Switch, Tooltip, Transfer } from "antd";
import Admin from "components/Admin";
import React, { useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import readMethod from "tools/function/crud/readMethod";

const tsonknuud = [
  {
    key: "/khyanalt/geree/gereeBurtgel",
    ner: "Гэрээний жагсаалт",
    tailbar:
      "Нийт түрээслэгчтэй байгуулсан гэрээний төлөв хөтлөх, засвар оруулах, дэлгэрэнгүй мэдээллийг нь харах боломжтой\n",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/geree/gereeBaiguulakh",
    ner: "Гэрээ байгуулах",
    tailbar:
      "Шинээр харилцагчтай алхамын дагуу, нөхцлөө тохиролцон уян хатан байдлаар гэрээ байгуулах боломтой.",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/geree/zagvar",
    ner: "Гэрээний загвар",
    tailbar:
      "Байгууллага өөрсдийн үйлчилгээнд санал болгох гэрээний загваруудыг динамик хэлбэрээр оруулах боломжтой ба гэрээ байгуулах үед гэрээний загвар сонгож дуусгасны дараа систем тухайн гэрээний нөхцлийн дагуу хугацаа, төлбөр гэх мэт тооцоолуурууд ажиллана.\n",
    tokhirgoo: [
      {
        ner: "Бүх гэрээг харах",
        utga: "bukhGereeKharakhEsekh",
        tailbar: "Бүх гэрээг харах эрхтэй эсэх.",
      },
      {
        ner: "Бүх гэрээг засах",
        utga: "bukhGereeZasakhEsekh",
        tailbar: "Бүх гэрээг засах эрхтэй эсэх.",
      },
    ],
  },
  {
    key: "/khyanalt/barilgaBurtgel",
    ner: "Барилга бүртгэл",
    tailbar:
      "Байгууллага систем ашиглах барилгын мэдээллийн үүнд бүртгэж өгөх юм. Түүний дагуу ажилтан болон удирдах албаны хүмүүс барилга тус бүрийн үйл ажиллагаатай танилцах, явцын мэдээллийг харж болох юм. Мөн олон барилга бүртгэх боломжтой.\n",
    tokhirgoo: [
      {
        ner: "Барилга бүртгэх эрх",
        utga: "barilgaBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/talbaiBurtgel/talbaiBurtgekh",
    ner: "Талбай бүртгэл",
    tailbar:
      "Түрээсээр олгох талбайн дугаар, үнэ, м2, хөрөнгийн бүртгэл, давхар, тухайн талбайн ашиглалтын зардал тус бүрийг оруулан бүртгэх\n",
    tokhirgoo: [
      {
        ner: "Талбай бүртгэх эрх",
        utga: "talbaiBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/ajiltan/ajiltanBurtgel",
    ner: "Ажилтан бүртгэл",
    tailbar:
      "Барилгын үйл ажиллагааг хариуцсан ажилчдын бүртгэл мэдээлэл болон ажлын эрх үүргийг оруулж тохиргоо хийх боломжтой.\n",
    tokhirgoo: [
      {
        ner: "Ажилтан бүртгэх эрх",
        utga: "ajiltanBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/khariltsagchBurtgel",
    ner: "Харилцагч бүртгэх",
    tailbar:
      "Гэрээ байгуулсан иргэн болон харилцагчийн дэлгэрэнгүй мэдээллийг хөтлөх, түүхийг хадгална.",
    tokhirgoo: [
      {
        ner: "Харилцагч бүртгэх эрх",
        utga: "khariltsagchBurtgekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/medegdel",
    ner: "Мэдэгдэл",
    tailbar:
      "Мэдээ мэдээлэл, төлбөрийг мэдэгдэл, санал хүсэлтийг- майл, мессеж, апп ашиглах илгээх, хүлээн авах юм.",
    tokhirgoo: [
      {
        ner: "Мэдэгдэл олноор илгээх эсэх",
        utga: "medegdelOlnoorIlgeekhEsekh",
      },
      {
        ner: "Мэдэгдэл илгээх эсэх",
        utga: "medegdelIlgeekhEsekh",
      },
      {
        ner: "Санал хүсэлт шийдвэрлэх эсэх",
        utga: "sanalKhuseltShiidverlekhEsekh",
      },
      {
        ner: "Мэйл илгээх эсэх",
        utga: "mailIlgeekhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/tulburTootsoo",
    ner: "Дансны хуулга",
    tailbar:
      "Байгууллагын харилцахын төлбөр хүлээж авах банкны дансны орлогын хуулгыг таниж систем түрээслэгчдийн авлага, түрээсийн төлбөрийг автоматаар гүйлгээнд холбох юм.",
    tokhirgoo: [
      {
        ner: "Гүйлгээ холбох эрхтэй эсэх",
        utga: "guilgeeKholbokhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/tulburTootsoo/guilgeeniiTuukh",
    ner: "Гүйлгээний жагсаалт",
    tailbar:
      "Түрээслэгчдийн сарын төлбөр, өмнө хуримтлагдсан төлбөр, дансны гүйлгээ, кассын гүйлгээ, авлага үүсгэх, төлөвлөгөө, гүйцэтгэл, авлагын түүхийн мэдээллийг хөтлөх гүйлгээний цонх юм.\n",
    tokhirgoo: [
      {
        ner: "Бүх гүйлгээг харах эсэх",
        utga: "bukhGuilgeeKharakhEsekh",
      },
    ],
  },
  {
    key: "/khyanalt/tulburTootsoo/nekhemjlel",
    ner: "Нэхэмжлэл хэвлэх",
    tailbar:
      "Түрээслэгч тус бүрээр өмнө авлага, сарын түрээсийн дүнгээр нийтээр давхраар, дансаар гэх мэт ялгаж олноор хэвлэх боломжтой.\n",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/tulburTootsoo/khungulult",
    ner: "Хөнгөлөлт",
    tailbar:
      "Харилцагчдадаа хадгалах, урамшуулах зорилгоор давхар, үйл ажиллагаагаар нь хамааруулан олон төрлийн сонголтоор хөнгөлөлт оруулах. Мөн хөнгөлөлтийн зориулалт, шалтгаан түүхийн мэдээллийг хөтлөнө.",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/eBarimt",
    ner: "И-Баримт",
    tailbar:
      "Дансаар орж ирсэн болон кассаар хийгдсэн төлбөрийн гүйлгээнд системээс и-баримт автоматаар хэвлэх олгож илгээх боломжтой.",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/zogsool",
    ner: "Зогсоол",
    tailbar:
      "Барилгын үүдэнд байрлах зогсоолын удирдлага, хяналт, тооцооллыг таны гарт олгоно.",
    tokhirgoo: [],
  },
  {
    key: "/khyanalt/tailan",
    ner: "Тайлан",
    tailbar:
      "Борлуулалтын\nАшигийн тооцоо\nЗардлын тооцоо\nАвлагын насжилтаар\n",
    tokhirgoo: [],
  },
];

function index({ token, data }) {
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [tokhirgoo, setTokhirgoo] = useState([]);
  const [khiikhTokhirgoo, setkhiikhTokhirgoo] = useState([]);

  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
    setkhiikhTokhirgoo(
      tsonknuud.filter((a) => !!nextTargetKeys.find((b) => b === a.key))
    );
  };

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  return (
    <Admin title={"Ажилтны эрхийн тохиргоо"} dedKhuudas className="p-5">
      <div className="box col-span-12 p-2 flex flex-row">
        {data?.ner}
        {data?.ovog}
        {data?.register}
        <div className="ml-auto">
          <Button type="primary">Хадгалах</Button>
        </div>
      </div>
      <div className="box col-span-6 p-2">
        <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
          <h2 className="font-medium text-base mr-auto dark:text-gray-200">
            Цонхны эрх
          </h2>
        </div>
        <Transfer
          listStyle={{ height: "100%", width: "45%", marginTop: 10 }}
          dataSource={tsonknuud}
          titles={["Цонхнууд", "Цонхны эрх"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={(item) => (
            <Tooltip title={item.tailbar}>
              <div>{item.ner}</div>
            </Tooltip>
          )}
          oneWay
        />
      </div>
      <div className="box col-span-6 p-2">
        <div className="flex items-center pt-5 px-5 pb-2 border-b border-gray-200 dark:border-dark-5">
          <h2 className="font-medium text-base mr-auto dark:text-gray-200">
            Шинэчлэлт хийх эрх
          </h2>
        </div>
        {khiikhTokhirgoo
          .map((a) => [...a.tokhirgoo])
          .flat()
          .map((mur) => (
            <div className="box" key={mur.ner}>
              <div className="flex items-center p-5">
                <div className="border-l-2 border-green-500 pl-4">
                  <div className="font-medium">{mur.ner}</div>
                  <div className="text-gray-600">{mur.tailbar}</div>
                </div>
                <div className="ml-auto">
                  <Switch
                    checked={!!tokhirgoo?.find((a) => mur.ner === a)}
                    onChange={(checked) => {
                      setTokhirgoo((a) => {
                        if (!checked) {
                          const index = a.findIndex((b) => b === mur.ner);
                          a.splice(index, 1);
                        } else a.push(mur.ner);
                        return [...a];
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </Admin>
  );
}

const ugudulAvchirya = async (ctx, session) => {
  const { data } = await readMethod(
    "ajiltan",
    session.tureestoken,
    ctx.query.id
  );
  return data;
};

export const getServerSideProps = (ctx) => shalgaltKhiikh(ctx, ugudulAvchirya);

export default index;
