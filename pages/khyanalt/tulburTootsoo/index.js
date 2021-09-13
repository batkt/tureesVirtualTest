import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "services/auth";
import { Card, Tabs, DatePicker, Table } from "antd";
import {
  FileDoneOutlined,
  FileSearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
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
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = React.useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ]);

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
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            key="2tab2"
            tab={
              <span>
                <FileSearchOutlined style={{ fontSize: "32px" }} />
                Төлөгдсөн
              </span>
            }
          >
            <RangePicker
              style={{ marginBottom: "20px" }}
              size="large"
              defaultValue={[
                moment(new Date(), "YYYY-MM-DD"),
                moment(new Date(), "YYYY-MM-DD"),
              ]}
            />
            <Table
              bordered
              size="middle"
              columns={[
                {
                  title: "№",
                  key: "index",
                  className: "text-center",
                  render: (text, record, index) => index + 1,
                },
                { title: "Нэр", dataIndex: "ner", ellipsis: true },
              ]}
              dataSource={[]}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
