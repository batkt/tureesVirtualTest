import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "services/auth";
import { Card, Tabs, DatePicker, Table, Select } from "antd";
import {
  FileDoneOutlined,
  FileSearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import moment from "moment";
import useDans from "../../../hooks/khuulga/useDans";
import formatNumber from "../../../tools/function/formatNumber";
import useDansKhuulga from "../../../hooks/khuulga/useDansKhuulga";
const { RangePicker } = DatePicker;

const columns = [
  {
    title: "№",
    key: "index",
    width: "3rem",
    className: "text-center",
    render: (text, record, index) => index + 1,
  },
  { title: "Талбай", dataIndex: "ner", ellipsis: true },
  { title: "Гэрээ", dataIndex: "ner", ellipsis: true },
  { title: "Утас", dataIndex: "ner", ellipsis: true },
  { title: "Огноо", dataIndex: "ner", ellipsis: true },
  { title: "Гэрээний дүн", dataIndex: "ner", ellipsis: true },
  { title: "Хөнгөлөлт", dataIndex: "ner", ellipsis: true },
  { title: "Авлага дүн", dataIndex: "ner", ellipsis: true },
  { title: "Орлого", dataIndex: "ner", ellipsis: true },
  { title: "Гүйлгээний утга", dataIndex: "ner", ellipsis: true },
  { title: "Үлдэгдэл", dataIndex: "ner", ellipsis: true },
  { title: "Дараагийн төлөлт", dataIndex: "ner", ellipsis: true },
];

function AjiltanBurtgel({ token }) {
  const { ajiltan, baiguullaga } = useAuth();
  const router = useRouter();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = React.useState([moment(), moment()]);
  const { dans } = useDans(token);
  const [songogdsonDans, setSongogdsonDans] = React.useState(null);
  const { dansniiKhuulgaGaralt, setDansniiKhuulgaKhuudaslalt } = useDansKhuulga(
    token,
    baiguullaga?._id,
    songogdsonDans,
    ekhlekhOgnoo
  );

  function dansSongoy(number) {
    let songogdsonDans = dans?.accounts?.find((a) => a.number === number);
    setDansniiKhuulgaKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }));
    setSongogdsonDans(songogdsonDans);
  }

  return (
    <Admin
      title="Төлбөр тооцоо"
      khuudasniiNer="tulburTootsoo"
      className="p-0 md:p-4"
    >
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full grid grid-cols-12 gap-4">
          {[
            { too: 1, utga: "Нийт Авлага" },
            { too: 1, utga: "Хугацаа хэтэрсэн" },
            { too: 1, utga: "График төлөлттэй" },
            { too: 1, utga: "Өнөөдөр	 орж ирэх" },
            { too: 1, utga: "Бартерын дүн" },
            { too: 1, utga: "Нийт хөнгөлөлт" },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
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
        <Tabs size="large" style={{ marginTop: "20px" }}>
          <Tabs.TabPane
            key="1tab1"
            tab={
              <span>
                <FileDoneOutlined style={{ fontSize: "32px" }} />
                Авлага
              </span>
            }
          >
            <div>
              <RangePicker
                style={{ marginBottom: "15px" }}
                size="large"
                disabledTime
                defaultValue={[
                  moment(new Date(), "YYYY-MM-DD"),
                  moment(new Date(), "YYYY-MM-DD"),
                ]}
                format={"YYYY-MM-DD"}
              />
            </div>
            <div className="overflow-auto hidden md:block">
              <Table
                bordered
                scroll={{ y: "calc(100vh - 32rem)" }}
                size="small"
                columns={columns}
                dataSource={[{ key: "1" }]}
                rowKey={(a) => a._id}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            key="2tab2"
            tab={
              <span>
                <FileSearchOutlined style={{ fontSize: "32px" }} />
                Хуулга
              </span>
            }
          >
            <div className="w-full flex flex-row">
              <RangePicker
                style={{ marginBottom: "20px" }}
                value={ekhlekhOgnoo}
                onChange={setEkhlekhOgnoo}
              />
              <div className="w-40 ml-4">
                <Select
                  placeholder="Данс"
                  style={{ width: "100%" }}
                  onChange={dansSongoy}
                >
                  {dans?.accounts?.map((a) => (
                    <Select.Option key={a.number} value={a.number}>
                      <div>{a.number}</div>
                    </Select.Option>
                  ))}
                </Select>
              </div>
              {songogdsonDans && (
                <div className="p-1 flex flex-row space-x-2 ml-auto font-medium">
                  Үлдэгдэл: {formatNumber(songogdsonDans.balance)}{" "}
                  {songogdsonDans.currency}
                </div>
              )}
            </div>
            <Table
              bordered
              size="middle"
              scroll={{ y: "calc(100vh - 30rem)" }}
              columns={[
                {
                  title: "Огноо",
                  dataIndex: "tranDate",
                  width: "7rem",
                },
                {
                  title: "Цаг",
                  dataIndex: "time",
                  ellipsis: true,
                  width: "4rem",
                  render(a) {
                    return moment(new Date(a * 1000)).format("HH:mm");
                  },
                },
                {
                  title: "Гүйлгээний утга",
                  dataIndex: "description",
                },
                {
                  title: "Гүйлгээний дүн",
                  dataIndex: "amount",
                  ellipsis: true,
                  width: "9rem",
                  align: "right",
                  render(a) {
                    return `${formatNumber(a)}₮`;
                  },
                },
                {
                  title: "Шилжүүлсэн данс",
                  dataIndex: "relatedAccount",
                  ellipsis: true,
                  width: "10rem",
                },
                {
                  title: "Төлөв",
                  dataIndex: "ner",
                  ellipsis: true,
                  width: "4rem",
                  align: "center",
                  className: "text-yellow-500",
                  render() {
                    return <WarningOutlined />;
                  },
                },
                {
                  title: "Талбай",
                  dataIndex: "ner",
                  ellipsis: true,
                  width: "5rem",
                },
              ]}
              dataSource={dansniiKhuulgaGaralt?.transactions}
              pagination={{
                total: dansniiKhuulgaGaralt?.total?.count,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  setDansniiKhuulgaKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
              rowKey={(a) => a.record}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
