import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React from "react";
import { useAuth } from "services/auth";
import { Card, Tabs, DatePicker, Table, Select, Button } from "antd";
import {
  CheckOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FileSearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import moment from "moment";
import useDans from "../../../hooks/khuulga/useDans";
import formatNumber from "../../../tools/function/formatNumber";
import useDansKhuulga from "../../../hooks/khuulga/useDansKhuulga";
import VoucheraarTootsooKhiikh from "../../../components/pageComponents/tulbur/VoucheraarTootsooKhiikh";
import GuilgeeKholbokh from "../../../components/pageComponents/tulbur/GuilgeeKholbokh";
import _ from "lodash";
import { modal } from "components/ant/Modal";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
const { RangePicker } = DatePicker;

function AjiltanBurtgel({ token }) {
  const ref = React.useRef(null);
  const refGuilgee = React.useRef(null);
  const { baiguullaga } = useAuth();
  const [tab, setTab] = React.useState('1tab1');
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = React.useState([moment(), moment()]);
  const { dans } = useDans(token);
  const [songogdsonDans, setSongogdsonDans] = React.useState(null);
  const [order, setOrder] = React.useState({ tranDate: -1, time: 0 });
  const { dansniiKhuulgaGaralt, setDansniiKhuulgaKhuudaslalt,dansniiKhuulgaMutate } = useDansKhuulga(
    token,
    baiguullaga?._id,
    songogdsonDans,
    ekhlekhOgnoo,
    order
  );

  const query = React.useMemo(()=>{
    return {
      uldegdel:{'$gt': 0}
    }
  },[])

  const { gereeniiMedeelel, setGereeniiKhuudaslalt ,gereeniiMedeelelMutate} = useGereeniiJagsaalt(
    token,
    baiguullaga?._id,
    undefined,
    query
  );

  function dansSongoy(number) {
    let songogdsonDans = dans?.accounts?.find((a) => a.number === number);
    setDansniiKhuulgaKhuudaslalt((a) => ({ ...a, khuudasniiDugaar: 1 }));
    setSongogdsonDans(songogdsonDans);
  }

  function guilgeeKhiiya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: <VoucheraarTootsooKhiikh  
        data={data}
        ref={ref}
        token={token}
        baiguullagiinId={baiguullaga?._id}
        onFinish={gereeniiMedeelelMutate} 
      />,
      footer,
    });
  }

  function guilgeeKholbyo(data) {
    const footer = [
      <Button onClick={() => refGuilgee.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => refGuilgee.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <GuilgeeKholbokh
          data={data}
          ref={refGuilgee}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={dansniiKhuulgaMutate}
        />
      ),
      footer,
    });
  }

  const columns = [
    {
      title: "№",
      key: "index",
      width: "3rem",
      className: "text-center",
      render: (text, record, index) => index + 1,
    },
    { title: "Талбай", dataIndex: "talbainDugaar", ellipsis: true },
    { title: "Утас", dataIndex: "utas", ellipsis: true },
    {
      title: "Огноо",
      dataIndex: "gereeniiOgnoo",
      ellipsis: true,
      render(a) {
        return moment(a).format("YYYY-MM-DD");
      },
    },
    { title: "Түрээслэгч", dataIndex: "ner", ellipsis: true },
    { title: "Үлдэгдэл", dataIndex: "uldegdel", ellipsis: true,render(a){
      return formatNumber(a)
    } },
    {
      title: "Дараагийн төлөлт",
      dataIndex: "daraagiinTulukhOgnoo",
      ellipsis: true,
      render(a){
        return moment(a).format('YYYY-MM-DD')
      }
    },
    {
      title: "Үйлдэл",
      ellipsis: true,
      render: (row) => (
        <a
          onClick={() => guilgeeKhiiya(row)}
        >
          Гүйлгээ хийх
        </a>
      ),
    },
  ];

  return (
    <Admin
      title="Төлбөр тооцоо"
      khuudasniiNer="tulburTootsoo"
      className="p-0 md:p-4"
      onSearch={(search) =>{
        if(tab === '1tab1')
          setDansniiKhuulgaKhuudaslalt((a) => ({ ...a, search }))
        else if(tab === '2tab2')
          setGereeniiKhuudaslalt((a) => ({ ...a, search }))
      }}
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
        <Tabs size="large" style={{ marginTop: "20px" }} onChange={setTab}>
          <Tabs.TabPane
            key="1tab1"
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
                  sorter: true,
                  dataIndex: "tranDate",
                  width: "7rem",
                  render(date) {
                    return moment(date).format("YYYY-MM-DD");
                  },
                  onHeaderCell: (cell, index) => {
                    return {
                      onClick: () =>
                        setOrder((o) => ({
                          ...o,
                          tranDate: o.tranDate === -1 ? 1 : o.tranDate - 1,
                        })), // click header row
                    };
                  },
                },
                {
                  title: "Цаг",
                  sorter: true,
                  dataIndex: "time",
                  ellipsis: true,
                  width: "4rem",
                  render(a) {
                    if (_.isString(a))
                      return `${a.substring(0, 2)}:${a.substring(2, 4)}`;
                    return "";
                  },
                  onHeaderCell: (cell, index) => {
                    return {
                      onClick: () =>
                        setOrder((o) => ({
                          ...o,
                          time: o.time === -1 ? 1 : o.time - 1,
                        })), // click header row
                    };
                  },
                },
                {
                  title: "Гүйлгээний утга",
                  dataIndex: "description",
                },
                {
                  title: "Гүйлгээний дүн",
                  sorter: true,
                  dataIndex: "amount",
                  ellipsis: true,
                  width: "9rem",
                  className: "text-right",
                  showSorterTooltip: false,
                  render(a) {
                    return `${formatNumber(a)}₮`;
                  },
                  sorter: (a, b) =>
                    Number(a.amount || 0) - Number(b.amount || 0),
                },
                {
                  title: "Шилжүүлсэн данс",
                  align: "center",
                  dataIndex: "relatedAccount",
                  ellipsis: true,
                  width: "10rem",
                },
                {
                  title: "Төлөв",
                  width: "4rem",
                  align: "center",
                  render(a) {
                    return (
                      <div className='flex items-center justify-center'>
                        <Button
                          shape="circle"
                          className="ant-pagination-item-link"
                          onClick={()=>guilgeeKholbyo(a)}
                          icon={
                            <div className={`text-${!a?.kholbosonGereeniiId ? 'yellow' : 'green'}-500 flex items-center justify-center`}>
                              {!a?.kholbosonGereeniiId ? <WarningOutlined /> : <CheckOutlined/>}
                            </div>
                          }
                        />
                      </div>
                    );
                  },
                },
                {
                  title: "Талбай",
                  dataIndex: "ner",
                  ellipsis: true,
                  width: "5rem",
                },
              ]}
              dataSource={dansniiKhuulgaGaralt?.jagsaalt}
              pagination={{
                current: dansniiKhuulgaGaralt?.khuudasniiDugaar,
                pageSize: dansniiKhuulgaGaralt?.khuudasniiKhemjee,
                total: dansniiKhuulgaGaralt?.niitMur,
                showSizeChanger: true,
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
          <Tabs.TabPane
            key="2tab2"
            tab={
              <span>
                <FileDoneOutlined style={{ fontSize: "32px" }} />
                Авлага
              </span>
            }
          >
            <div className="flex flex-row ">
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
                loading={!gereeniiMedeelel}
                dataSource={gereeniiMedeelel?.jagsaalt}
                rowKey={(a) => a._id}
                pagination={{
                  current: gereeniiMedeelel?.khuudasniiDugaar,
                  pageSize: gereeniiMedeelel?.khuudasniiKhemjee,
                  total: gereeniiMedeelel?.niitMur,
                  showSizeChanger: true,
                  onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                    setGereeniiKhuudaslalt((kh) => ({
                      ...kh,
                      khuudasniiDugaar,
                      khuudasniiKhemjee,
                    })),
                }}
              />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
