import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React from "react";
import { useRouter } from "next/router";
import { useAuth } from "services/auth";
import { Card, Tabs ,DatePicker,Table} from "antd";
import { FileDoneOutlined, FileSearchOutlined, PlusOutlined } from "@ant-design/icons";
import moment from 'moment'  
const {RangePicker} = DatePicker

const columns = [ {
    title: "№",
    key: "index",
    width:'3rem',
    className: "text-center",
    render: (text, record, index) =>
    index +1
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
]

function AjiltanBurtgel({ token }) {
    const { ajiltan, baiguullaga } = useAuth()
    const router = useRouter()
    const [ekhlekhOgnoo, setEkhlekhOgnoo] = React.useState([
      moment(new Date()).format("YYYY-MM-DD 00:00:00"),
      moment(new Date()).format("YYYY-MM-DD 23:59:59")
    ])

    return (
      <Admin title="Төлбөр тооцоо" khuudasniiNer="tulburTootsoo" className="p-0 md:p-4">
        <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full grid grid-cols-12 gap-4">
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              height: "50px",
              fontSize: "1.3rem",
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1890ff"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                color: "white"
              }}
            >
              <PlusOutlined style={{ fontSize: "24px" }} />
              <span style={{ marginLeft: "5px" }}>Гүйлгээ</span>
            </div>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2 focus:bg-blue-500 focus-within:bg-blue-500"
            style={{
              borderRadius: "10px",
              borderColor: "#1F618D",
              borderLeft: "5px solid #1F618D",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1F618D",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
                15
            </span>
            <span className="ml-4 2xl:text-xl">Бүх</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#1990ff",
              borderLeft: "5px solid #1990ff",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1990ff",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              10
            </span>
            <span className="ml-4 2xl:text-xl">Эхэлсэн</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#52BE80",
              borderLeft: "5px solid #52BE80",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#52BE80",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              5
            </span>
            <span className="ml-4 2xl:text-xl">Дууссан</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#FF7F50",
              borderLeft: "5px solid #FF7F50",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#FF7F50",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              15
            </span>
            <span className="ml-4 2xl:text-xl">Хувaaрилсан</span>
          </Card>
          <Card
            hoverable={true}
            className="col-span-12 lg:col-span-6 xl:col-span-4 2xl:col-span-2"
            style={{
              borderRadius: "10px",
              borderColor: "#1F618D",
              borderLeft: "5px solid #1F618D",
              height: "50px",
              fontSize: "1.4rem",
              display: "flex",
              alignItems: "center",
              padding: "10px"
            }}
          >
            <span
              style={{
                color: "#1F618D",
                fontWeight: "bold",
                fontSize: "1.5rem"
              }}
            >
              15
            </span>
            <span className="ml-4 2xl:text-xl">Цуцалсан</span>
          </Card>
        </div>
        <Tabs size="large" style={{ marginTop: "20px" }}>
          <Tabs.TabPane
            key="1"
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
                  moment(new Date(), "YYYY-MM-DD")
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
                dataSource={[{talbai:'йллл'}]}
              />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            key="2"
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
                moment(new Date(), "YYYY-MM-DD")
              ]}
            />
            <Table
              bordered
              size="middle"
              columns={[ {
                title: "№",
                key: "index",
                className: "text-center",
                render: (text, record, index) =>
                  index +1
              },
              { title: "Нэр", dataIndex: "ner", ellipsis: true },
            ]}
            dataSource={[{talbai:'йллл'}]}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
      </Admin>
    );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
