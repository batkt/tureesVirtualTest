import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useEffect } from "react";
import { Card, DatePicker, Table, Button, Select, message, Switch } from "antd";
import { EditOutlined, FileExcelOutlined } from "@ant-design/icons";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useNekhemjlekh from "hooks/useNekhemjlekh";
import useNekhemjlekhDugaarlalt from "hooks/useNekhemjlekhDugaarlalt";
import useDans from "hooks/khuulga/useDans";
import _ from "lodash";
import { useReactToPrint } from "react-to-print";
import { toWords } from "mon_num";
import DunZasvar from "components/pageComponents/nekhemjlel/DunZasvar";
import { modal } from "components/ant/Modal";
import { useAuth } from "services/auth";

const Dun = (a) => {
  const dun = a.tuluvluguutEsekh
    ? a.niitUldegdel
    : a.eneSardTulukhDun + a.umnukhSariinUrTulbur;
  if (dun < 0) return <div>{toWords(dun * -1, { suffix: "n" })} төгрөг</div>;
  return <div>{toWords(dun, { suffix: "n" })} төгрөг</div>;
};

const turul = [
  { zurag: "/ikhNayad.png", ner: "Барааны нэхэмжлэх" },
  { zurag: "/ikhNayadKhuns.png", ner: "Хүнсны нэхэмжлэх" },
];

const ilgeekhTurul = "davkharaar";

function tulburTootsoo({ token }) {
  const printRef = React.useRef(null);
  const dunZasvarRef = React.useRef(null);
  const { baiguullaga, barilgiinId } = useAuth();

  const [tuluvluguutEsekh, setTuluvluguutEsekh] = React.useState(false);
  const [ognoo, setOgnoo] = React.useState(moment());
  const [barimt, setBarimt] = React.useState();
  const [davkhar, setDavkhar] = React.useState();
  const [songogdsonDans, setDans] = React.useState();

  const [nekhemjleliinJagsaalt, setNekhemjleliinJagsaalt] = React.useState([]);
  const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } =
    useNekhemjlekh(token, ognoo, davkhar, ilgeekhTurul);

  const { dugaarlalt, dugaarlaltMutate, dugaarlaltKhadgalya } =
    useNekhemjlekhDugaarlalt(token);

  const { dans } = useDans(token);

  const [songogdsonGereenuud, setSongogdsonGereenuud] = React.useState([]);

  useEffect(() => {
    if (!!nekhemjlel) setNekhemjleliinJagsaalt([...nekhemjlel?.jagsaalt]);
  }, [nekhemjlel]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      if (songogdsonGereenuud?.length > 0)
        dugaarlaltKhadgalya(songogdsonGereenuud?.length + dugaarlalt - 1, () =>
          dugaarlaltMutate()
        );
    },
  });

  function hevlekh() {
    if (!songogdsonDans) {
      message.warning("Данс сонгоно уу");
      return;
    }
    if (!barimt) {
      message.warning("Нэхэмжлэхийн төрөл сонгоно уу");
      return;
    }
    if (!songogdsonGereenuud || songogdsonGereenuud?.length === 0) {
      message.warning("Гэрээ сонгоно уу");
      return;
    }
    handlePrint();
  }

  function nekhemjlelZasya(mur, index) {
    const footer = [
      <Button onClick={() => dunZasvarRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => dunZasvarRef.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "Нэхэмжлэл засвар",
      icon: <FileExcelOutlined />,
      content: (
        <DunZasvar
          ref={dunZasvarRef}
          data={mur}
          index={index}
          setNekhemjleliinJagsaalt={setNekhemjleliinJagsaalt}
          nekhemjleliinJagsaalt={nekhemjleliinJagsaalt}
          songogdsonGereenuud={songogdsonGereenuud}
          setSongogdsonGereenuud={setSongogdsonGereenuud}
        />
      ),
      footer,
    });
  }

  return (
    <Admin
      title="Нэхэмжлэл"
      khuudasniiNer="nekhemjlel"
      className="p-0 md:p-4"
      onSearch={(search) => {
        setNekhemjlelKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      }}
    >
      <Card className="col-span-12 cardgrid">
        <div className="w-full grid grid-cols-2" ref={printRef}>
          {songogdsonGereenuud?.map((a, i) => (
            <div key={`print${a._id}`} className="print p-10 a5">
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td colSpan={6}>
                      <img src={barimt} className="w-28" />
                    </td>
                    <td colSpan={6} className="text-right">
                      Сангийн сайдын 2017 оны 12 дугаар сарын 5-ны өдрийн 347
                      тоот тушаалын
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={12}>
                      <div className="flex items-center justify-center">
                        <div className="p-2 px-10 border">
                          <div>НЭХЭМЖЛЭЛ</div>{" "}
                          <div>
                            №{moment().format("YY")}/{dugaarlalt + i}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6}>
                      <div>НЭХЭМЖЛЭГЧ БАЙГУУЛЛАГА</div>
                      <div>НЭР: ИХ НАЯД ПЛАЗА ХХК</div>
                      <div>КОМПАНИЙН РД: 6481523</div>
                      <div>
                        ДАНС:{" "}
                        {songogdsonDans?.length === 9
                          ? "Худалдаа хөгжлийн банк"
                          : "Хаан банк"}{" "}
                        {songogdsonDans} (MNT)
                      </div>
                      <div>
                        ХАЯГ: Их Наяд Плаза 5-р давхар 15-р хороо, Хан-Уул
                        дүүрэг
                      </div>
                      <div>Утас: 7709-1155, 8900-9090, 8810-9549</div>
                    </td>
                    <td colSpan={2}></td>
                    <td colSpan={4}>
                      <div className="w-full h-full flex flex-col">
                        <div>ТӨЛӨГЧ БАЙГУУЛЛАГА:</div>
                        <div>НЭР: {a.ner}</div>
                        <div>РД: {a.register}</div>
                        <div>ХАЯГ: </div>
                        <div>УТАС: {a.utas}</div>
                        <div>ТАЛБАЙ: {a.talbainDugaar}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border">№</td>
                    <td className="border" colSpan={6}>
                      БАРАА, ҮЙЛЧИЛГЭЭНИЙ НЭР
                    </td>
                    <td className="border">ТОО ШИРХЭГ /М2/</td>
                    <td className="border">НЭГЖ ҮНЭ</td>
                    <td className="border" colSpan={2}>
                      НИЙТ ҮНЭ
                    </td>
                  </tr>
                  <tr>
                    <td className="border">{1}</td>
                    <td className="border" colSpan={6}>
                      {moment(ognoo).format("MM")}-р сарын түрээсийн төлбөр
                    </td>
                    <td className="border">{a.talbainKhemjee}</td>
                    <td className="border">
                      {formatNumber(a.talbainNegjUne)}₮
                    </td>
                    <td className="border" colSpan={2}>
                      {formatNumber(
                        tuluvluguutEsekh ? a.niitUldegdel : a.eneSardTulukhDun
                      )}
                      ₮
                    </td>
                  </tr>
                  {!tuluvluguutEsekh && (
                    <tr>
                      <td className="border">{2}</td>
                      <td className="border" colSpan={6}>
                        Өмнөх хуримтлагдсан өр төлбөр
                      </td>
                      <td className="border">{a.talbainKhemjee}</td>
                      <td className="border">
                        {formatNumber(a.talbainNegjUne)}₮
                      </td>
                      <td className="border" colSpan={2}>
                        {formatNumber(a.umnukhSariinUrTulbur)}₮
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={10} className="text-right">
                      ДҮН
                    </td>
                    <td className="border">
                      {formatNumber(
                        tuluvluguutEsekh
                          ? a.niitUldegdel
                          : a.eneSardTulukhDun + a.umnukhSariinUrTulbur
                      )}
                      ₮
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={10} className="text-right">
                      НИЙТ ДҮН
                    </td>
                    <td className="border">
                      {formatNumber(
                        tuluvluguutEsekh
                          ? a.niitUldegdel
                          : a.eneSardTulukhDun + a.umnukhSariinUrTulbur
                      )}
                      ₮
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={12}>
                      Мөнгөн дүн: (үсгээр){" "}
                      <Dun tuluvluguutEsekh={tuluvluguutEsekh} {...a} />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6}>(Тамга)</td>
                    <td colSpan={6}>
                      <div>
                        Дарга:................................/Б.Мөнхзул/
                      </div>
                      <div>
                        Хүлээн
                        авсан:................../........................./
                      </div>
                      <div>Нягтлан бодогч:................/Ц.Эрдэнэцэцэг/</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <div className="w-full grid grid-cols-12 gap-4">
          {[
            { too: nekhemjlel?.niitMur || 0, utga: "Нийт" },
            { too: 0, utga: "Тодорхойгүй" },
            { too: 0, utga: "Холбогдсон" },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-4 intro-y cursor-pointer zoom-in"
              >
                <div className="h-full rounded-xl">
                  <div className="p-3 rounded-xl">
                    <div className="flex">
                      <div>
                        <div className="text-3xl text-green-600 font-bold">
                          {mur.too}
                        </div>
                        <div className="text-base text-gray-500">
                          {mur.utga}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-green-600 text-2xl">
                          {mur.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full flex flex-row mt-5">
          <DatePicker
            style={{ marginBottom: "20px" }}
            value={ognoo}
            onChange={setOgnoo}
          />
          <div className="ml-auto space-x-2">
            <Switch
              title="Төлөвлөөт эсэх"
              onChange={setTuluvluguutEsekh}
              defaultChecked={tuluvluguutEsekh}
            />
            <Select placeholder="Дансны төрөл" onChange={setDans}>
              {[
                ...(dans?.accounts || []),
                ...[{ number: "441000527" }, { number: "441000528" }],
              ]
                ?.filter((a) => a.type !== "L")
                .map((a) => (
                  <Select.Option key={a.number} value={a.number}>
                    <div>{a.number}</div>
                  </Select.Option>
                ))}
            </Select>
            <Select
              allowClear
              placeholder="Давхар"
              onChange={(v) => {
                setDavkhar(v);
                setSongogdsonGereenuud([]);
              }}
            >
              {baiguullaga?.barilguud[0]?.davkharuud.map((a) => (
                <Select.Option key={a._id} value={a.davkhar}>
                  {a.davkhar}
                </Select.Option>
              ))}
            </Select>
            <Select placeholder="Нэхэмжлэхийн төрөл" onChange={setBarimt}>
              {turul.map((a) => (
                <Select.Option key={a.ner} value={a.zurag}>
                  {a.ner}
                </Select.Option>
              ))}
            </Select>
            <Button type="primary" onClick={hevlekh}>
              Хэвлэх
            </Button>
          </div>
        </div>
        <Table
          bordered
          size="small"
          scroll={{ y: "calc(100vh - 25rem)" }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: songogdsonGereenuud?.map((a) => a._id),
            onChange: (selectedRowKeys, selectedRows) => {
              setSongogdsonGereenuud(selectedRows);
            },
          }}
          columns={[
            {
              title: "Гэрээ №",
              dataIndex: "gereeniiDugaar",
              width: "7rem",
              align: "center",
            },
            {
              title: "Талбай №",
              sorter: (a, b) => a.talbainDugaar - b.talbainDugaar,
              dataIndex: "talbainDugaar",
              width: "7rem",
              align: "center",
            },
            {
              title: "Дараагийн төлөх огноо",
              sorter: (a, b) =>
                moment(a.talbainDugaar).diff(moment(b.talbainDugaar), "hour"),
              dataIndex: "daraagiinTulukhOgnoo",
              render(a) {
                return moment(a).format("YYYY-MM-DD");
              },
              ellipsis: true,
              align: "center",
            },
            {
              title: "Өмнөх хуримтлагдсан өр төлбөр",
              sorter: (a, b) => a.umnukhSariinUrTulbur - b.umnukhSariinUrTulbur,
              dataIndex: "umnukhSariinUrTulbur",
              render(a) {
                return formatNumber(a);
              },
              ellipsis: true,
              align: "center",
            },
            {
              title: "Энэ сард төлөх дүн",
              sorter: (a, b) => a.eneSardTulukhDun - b.eneSardTulukhDun,
              dataIndex: "eneSardTulukhDun",
              render(a) {
                return formatNumber(a);
              },
              ellipsis: true,
              align: "center",
            },
            {
              title: "Нийт үлдэгдэл",
              sorter: (a, b) => a.niitUldegdel - b.niitUldegdel,
              dataIndex: "niitUldegdel",
              render(a) {
                return formatNumber(a);
              },
              ellipsis: true,
              align: "center",
            },
            {
              title: "Төлөв",
              width: "4rem",
              dataIndex: "tuluv",
              align: "center",
              render(a, record, index) {
                return (
                  <div className="flex items-center justify-center">
                    <Button
                      shape="circle"
                      size="small"
                      icon={
                        <div
                          className={`text-yellow-500 flex items-center justify-center`}
                          onClick={() => nekhemjlelZasya(record, index)}
                        >
                          <EditOutlined style={{ fontSize: "18px" }} />
                        </div>
                      }
                    />
                  </div>
                );
              },
            },
          ]}
          dataSource={nekhemjleliinJagsaalt}
          pagination={false}
          rowKey={(a) => a._id}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default tulburTootsoo;
