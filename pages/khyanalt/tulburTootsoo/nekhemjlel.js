import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React from "react";
import { Card, DatePicker, Table, Button, Select, message } from "antd";
import {
  CheckOutlined,
  ExclamationOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import useNekhemjlekh from "hooks/useNekhemjlekh";
import _ from "lodash";
import { useReactToPrint } from "react-to-print";
import {toWords} from 'mon_num'
const turul = [
  {zurag:'/ikhNayad.png',ner:'Барааны нэхэмжлэх'},
  {zurag:'/ikhNayadKhuns.png',ner:'Хүнсны нэхэмжлэх'},
]

function tulburTootsoo({ token }) {
  const printRef = React.useRef(null);
  const [ognoo, setOgnoo] = React.useState(moment());
  const [barimt, setBarimt] = React.useState();
  const { nekhemjlel, setNekhemjlelKhuudaslalt, nekhemjlelMutate } =
    useNekhemjlekh(token, ognoo);

  const [songogdsonGereenuud, setSongogdsonGereenuud] = React.useState(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  function hevlekh() {
    if(!barimt)
    {
      message.warning('Нэхэмжлэхийн төрөл сонгоно уу')
      return
    }
    if(!songogdsonGereenuud || songogdsonGereenuud?.length === 0)
    {
      message.warning('Гэрээ сонгоно уу')
      return
    }
    handlePrint()
  }

  return (
    <Admin
      title="Нэхэмжлэл"
      khuudasniiNer="nekhemjlel"
      className="p-0 md:p-4"
      onSearch={(search) => {
        setNekhemjlelKhuudaslalt((a) => ({ ...a, search }));
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
                          <div>НЭХЭМЖЛЭЛ</div> <div>№21/205</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6}>
                      <div>НЭХЭМЖЛЭГЧ БАЙГУУЛЛАГА</div>
                      <div>КОМПАНИЙН НЭР: ИХ НАЯД ПЛАЗА ХХК</div>
                      <div>КОМПАНИЙН РД: 6481523</div>
                      <div>ДАНС: Хаан банк 5129062239 (MNT)</div>
                      <div>
                        ХАЯГ: Их Наяд Плаза 5-р давхар 15-р хороо, Хан-Уул
                        дүүрэг
                      </div>
                      <div>Утас: 7709-1155, 8900-9090, 8888-0140</div>
                    </td>
                    <td colSpan={2}></td>
                    <td colSpan={4}>
                      <div className='w-full h-full flex flex-col'>
                      <div>ТӨЛӨГЧ БАЙГУУЛЛАГА:</div>
                      <div>КОМПАНИЙН НЭР: {a.ner}</div>
                      <div>КОМПАНИЙН РД: </div>
                      <div>ХАЯГ: </div>
                      <div>УТАС: {a.utas}</div>
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
                      <td className="border">{i + 1}</td>
                      <td className="border" colSpan={6}>
                      11-р сарын түрээсийн төлбөр
                      </td>
                      <td className="border">{a.talbainKhemjee}</td>
                      <td className="border">{formatNumber(a.talbainNegjUne)}₮</td>
                      <td className="border" colSpan={2}>
                        {formatNumber(a.talbainNiitUne)}₮
                      </td>
                    </tr>
                    <tr>
                      <td className="border">{i + 1}</td>
                      <td className="border" colSpan={6}>
                      Өмнөх хуримтлагдсан өр төлбөр
                      </td>
                      <td className="border">{a.talbainKhemjee}</td>
                      <td className="border">{formatNumber(a.talbainNegjUne)}₮</td>
                      <td className="border" colSpan={2}>
                        {formatNumber(a.uldegdel)}₮
                      </td>
                    </tr>
                  <tr>
                    <td colSpan={10} className="text-right">
                      ДҮН
                    </td>
                    <td className="border">{formatNumber(a.eneSardTulukhDun)}₮</td>
                  </tr>
                  <tr>
                    <td colSpan={10} className="text-right">
                      НӨАТ
                    </td>
                    <td className="border"></td>
                  </tr>
                  <tr>
                    <td colSpan={10} className="text-right">
                      ХЯМДРАЛ
                    </td>
                    <td className="border"></td>
                  </tr>
                  <tr>
                    <td colSpan={10} className="text-right">
                      НИЙТ ДҮН
                    </td>
                    <td className="border">{formatNumber(a.eneSardTulukhDun)}₮</td>
                  </tr>
                  <tr>
                    <td colSpan={12}>
                      Мөнгөн дүн: (үсгээр) {toWords(a.eneSardTulukhDun,{suffix:'n'})} төгрөг
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

          <div className="ml-auto">
            <Select placeholder='Нэхэмжлэхийн төрөл' onChange={setBarimt}>
              {turul.map(a=><Select.Option key={a.ner} value={a.zurag}>{a.ner}</Select.Option>)}
            </Select>
            <Button onClick={hevlekh}>Хэвлэх</Button>
          </div>
        </div>
        <Table
          bordered
          size="small"
          scroll={{ y: "calc(100vh - 30rem)" }}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              setSongogdsonGereenuud(selectedRows);
            },
          }}
          columns={[
            {
              title: "Гэрээний дугаар",
              sorter: true,
              dataIndex: "gereeniiDugaar",
              width: "7rem",
            },
            {
              title: "Талбайн дугаар",
              sorter: true,
              dataIndex: "talbainDugaar",
              width: "7rem",
            },
            {
              title: "Дараагийн төлөх огноо",
              sorter: true,
              dataIndex: "daraagiinTulukhOgnoo",
              render(a) {
                return moment(a).format("YYYY-MM-DD");
              },
              ellipsis: true,
            },
            {
              title: "Өмнөх хуримтлагдсан өр төлбөр",
              sorter: true,
              dataIndex: "uldegdel",
              render(a) {
                return formatNumber(a);
              },
              ellipsis: true,
            },
            {
              title: "Энэ сард төлөх дүн",
              sorter: true,
              dataIndex: "eneSardTulukhDun",
              render(a) {
                return formatNumber(a);
              },
              ellipsis: true,
            },
            {
              title: "Төлөв",
              width: "4rem",
              align: "center",
              render(a) {
                return (
                  <div className="flex items-center justify-center">
                    <Button
                      shape="circle"
                      className="ant-pagination-item-link"
                      onClick={() => guilgeeKholbyo(a)}
                      icon={
                        <div
                          className={`text-${
                            !a?.kholbosonGereeniiId
                              ? a?.magadlaltaiGereenuud?.length > 0
                                ? "yellow"
                                : "red"
                              : "green"
                          }-500 flex items-center justify-center`}
                        >
                          {!a?.kholbosonGereeniiId ? (
                            a?.magadlaltaiGereenuud?.length > 0 ? (
                              <QuestionOutlined style={{ fontSize: "22px" }} />
                            ) : (
                              <ExclamationOutlined
                                style={{ fontSize: "22px" }}
                              />
                            )
                          ) : (
                            <CheckOutlined style={{ fontSize: "22px" }} />
                          )}
                        </div>
                      }
                    />
                  </div>
                );
              },
            },
            {
              title: "Талбай",
              dataIndex: "kholbosonTalbainId",
              ellipsis: true,
              width: "5rem",
            },
          ]}
          dataSource={nekhemjlel?.jagsaalt}
          pagination={{
            current: nekhemjlel?.khuudasniiDugaar,
            pageSize: nekhemjlel?.khuudasniiKhemjee,
            total: nekhemjlel?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setNekhemjlelKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
          rowKey={(a) => a._id}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default tulburTootsoo;
