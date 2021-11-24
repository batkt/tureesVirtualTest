import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React from "react";
import { useAuth } from "services/auth";
import { Card, Table, Button, DatePicker } from "antd";
import { FileExcelOutlined } from "@ant-design/icons";
import moment from "moment";
import formatNumber from "../../../tools/function/formatNumber";
import GuilgeeKhiikh from "../../../components/pageComponents/tulbur/GuilgeeKhiikh";
import Khungulukh from "../../../components/pageComponents/tulbur/Khungulukh";
import GuilgeeniiTuukh from "../../../components/pageComponents/tulbur/GuilgeeniiTuukh";
import _ from "lodash";
import { modal } from "components/ant/Modal";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import useGuilgeeniiToololtAvya from "hooks/useGuilgeeniiToololtAvya";

function guilgeeniiTuukh({ token }) {
  const ref = React.useRef(null);
  const refTuukh = React.useRef(null);
  const { baiguullaga } = useAuth();
  const [delgegdsenGeree, setDelgegdsenGeree] = React.useState(null);
  const [ognoo, setOgnoo] = React.useState([moment(moment().startOf("month").format('YYYY-MM-DD 00:00:00')),moment(moment().endOf("month").format('YYYY-MM-DD 23:59:59'))]);
  const [turul, setTurul] = React.useState('');
  
  const { guilgeeniiToololt } = useGuilgeeniiToololtAvya(
    token,
    ognoo
  );
  const query = React.useMemo(() => {
    if(turul === 'uglug')
      return {
        'avlaga.guilgeenuud.ognoo': {
          '$lte': moment(ognoo[1]).format("YYYY-MM-DD 23:59:59")
        },
        'baiguullagiinId': baiguullaga._id,
        'tuluv': {
          '$ne': -1
        },
        "uldegdel": {
          "$lt": 0
        }
      }
    else if(turul === 'avlaga')
      return {
        'avlaga.guilgeenuud.ognoo': {
          '$lte': moment(ognoo[1]).format("YYYY-MM-DD 23:59:59")
        },
        'baiguullagiinId': baiguullaga._id,
        'tuluv': {
          '$ne': -1
        },
        "uldegdel": {
          "$gte": 0
        }
      }
    else if(turul === 'khugatsaaKhetersen')
      return {
        'daraagiinTulukhOgnoo': {
          '$lte': moment(ognoo[1]).format("YYYY-MM-DD 23:59:59")
        },
        'baiguullagiinId': baiguullaga._id,
        'tuluv': {
          '$ne': -1
        },
        "uldegdel": {
          "$gte": 0
        }
      }
    else if(turul === 'eneSardTulukh')
      return {
          'avlaga.guilgeenuud.ognoo': {
            '$gte': moment(ognoo[0]).startOf("month").format("YYYY-MM-DD 00:00:00"),
            '$lte': moment(ognoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59")
          },
          'baiguullagiinId': baiguullaga?._id,
          'avlaga.guilgeenuud.tulukhDun': {
            '$gt': 0
        }
      }
    else if(turul === 'eneSardTulsun')
      return {
        'avlaga.guilgeenuud.ognoo': {
          '$gte': moment(ognoo[0]).startOf("month").format("YYYY-MM-DD 00:00:00"),
          '$lte': moment(ognoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59")
        },
        'baiguullagiinId': baiguullaga?._id,
        'avlaga.guilgeenuud.tulsunDun': {
          '$gt': 0
        }
      }
    else if(turul === 'khungulult')
      return {
          'avlaga.guilgeenuud.ognoo': {
            '$gte': moment(ognoo[0]).startOf("month").format("YYYY-MM-DD 00:00:00"),
            '$lte': moment(ognoo[1]).endOf("month").format("YYYY-MM-DD 23:59:59")
          },
          'baiguullagiinId': baiguullaga?._id,
          'avlaga.guilgeenuud.khyamdral': {
            '$gt': 0
        }
      }
    return {};
  }, [turul,ognoo]);

  

  const { gereeniiMedeelel, setGereeniiKhuudaslalt, gereeniiMedeelelMutate } =
    useGereeniiJagsaalt(token, baiguullaga?._id, undefined, query);

  function onChangeTurul(turul) {
    setTurul(turul)
    setGereeniiKhuudaslalt(a=>({...a,khuudasniiDugaar:1}))
  }

  function refreshData() {
    gereeniiMedeelelMutate();
    refTuukh.current?.refreshData()
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
      content: (
        <GuilgeeKhiikh
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={refreshData}
        />
      ),
      footer,
    });
  }

  function khungulultKhiiya(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <Khungulukh
          data={data}
          ref={ref}
          token={token}
          baiguullagiinId={baiguullaga?._id}
          onFinish={refreshData}
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
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Талбай",
      dataIndex: "talbainDugaar",
      ellipsis: true,
      align: "center",
      width: "5rem",
    },
    {
      title: "Давхар",
      dataIndex: "davkhar",
      ellipsis: true,
      align: "center",
      width: "5rem",
      showSorterTooltip: false,
      defaultSortOrder: "descend",
      sorter: (a, b) => Number(a.davkhar || 0) - Number(b.davkhar || 0),
    },
    {
      title: "Түрээслэгч",
      dataIndex: "ner",
      ellipsis: true,
      align: "center",
      width: "12rem",
    },
    { title: "Утас", dataIndex: "utas", ellipsis: true, align: "center" },
    {
      title: "Үлдэгдэл",
      dataIndex: "uldegdel",
      ellipsis: true,
      align: "right",
      render(a) {
        return (
          <div
            className={`font-medium ${
              a > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {formatNumber(a)}
          </div>
        );
      },
      showSorterTooltip: false,
      defaultSortOrder: "descend",
      sorter: (a, b) => Number(a.uldegdel || 0) - Number(b.uldegdel || 0),
    },
    {
      title: "Гэрээний огноо",
      dataIndex: "gereeniiOgnoo",
      ellipsis: true,
      align: "center",
      render(a) {
        return moment(a).format("YYYY-MM-DD");
      },
    },
    {
      title: "Үйлдэл",
      ellipsis: true,
      render: (row) => (
        <>
          <a onClick={() => guilgeeKhiiya(row)}>Гүйлгээ хийх</a>
          <a onClick={() => khungulultKhiiya(row)} className="ml-6">Хөнгөлөх</a>
          {row?._id === delgegdsenGeree && (
            <a className="ml-6" onClick={() => refTuukh.current.khevlekh()}>
              Хэвлэх
            </a>
          )}
        </>
      ),
    },
  ];

  return (
    <Admin
      title="Гүйлгээний түүх"
      khuudasniiNer="guilgeeniiTuukh"
      className="p-0 md:p-4"
      onSearch={(search) => {
        setGereeniiKhuudaslalt((a) => ({ ...a, search,khuudasniiDugaar:1 }));
      }}
    >
      <Card className="col-span-12 p-5 cardgrid">
        <div className="w-full grid grid-cols-12 gap-4">
          {[
            {
              too: formatNumber(_.get(guilgeeniiToololt, "avlaga.0.dun") || 0),
              turul:'avlaga',
              utga: "Нийт Авлага",
            },
            {
              too: formatNumber(_.get(guilgeeniiToololt, "uglug.0.dun") || 0),
              turul:'uglug',
              utga: "Нийт Өглөг",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "khugatsaaKhetersen.0.dun") || 0
              ),
              turul:'khugatsaaKhetersen',
              utga: "Хугацаа хэтэрсэн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulukh.0.dun") || 0
              ),
              turul:'eneSardTulukh',
              utga: "Сард орж ирэх дүн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "eneSardTulsun.0.dun") || 0
              ),
              turul:'eneSardTulsun',
              utga: "Гүйцэтгэлийн дүн",
            },
            {
              too: formatNumber(
                _.get(guilgeeniiToololt, "khungulult.0.dun") || 0
              ),
              turul:'khungulult',
              utga: "Нийт хөнгөлөлт",
            },
          ].map((mur, index) => {
            return (
              <div
                key={`${index}toololt`}
                className="border-2 border-green-600 rounded-xl col-span-12 sm:col-span-12 lg:col-span-2 intro-y cursor-pointer zoom-in"
                onClick={()=>onChangeTurul(mur?.turul)}
              >
                <div className="h-full rounded-xl">
                  <div className="p-3 rounded-xl">
                    <div className="flex">
                      <div>
                        <div className="text-2xl text-green-600 font-bold">
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
        <div className="flex flex-row mt-5">
          <DatePicker.RangePicker value={ognoo} onChange={setOgnoo}/>
        </div>
        <div className="overflow-auto hidden md:block mt-5">
          <Table
            scroll={{ y: "calc(100vh - 26rem)" }}
            size="small"
            bordered
            columns={columns}
            loading={!gereeniiMedeelel}
            dataSource={gereeniiMedeelel?.jagsaalt}
            rowKey={(a) => a._id}
            className="t-head"
            rowClassName={(record, index) =>
              index % 2 === 0
                ? "bg-white dark:bg-gray-600"
                : "bg-gray-200 dark:bg-gray-800"
            }
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
            expandable={{
              expandedRowRender: (mur) =>
                mur?._id === delgegdsenGeree && (
                  <GuilgeeniiTuukh
                    ref={refTuukh}
                    mur={mur}
                    token={token}
                    ognoo={ognoo}
                    data={mur}
                    refreshData={refreshData}
                  />
                ),
              expandedRowKeys: [delgegdsenGeree],
              expandedRowClassName: (a, index) =>
                index % 2 === 0
                  ? "bg-white dark:bg-gray-600"
                  : "bg-gray-200 dark:bg-gray-800",
              onExpand: (a, b) => setDelgegdsenGeree(a === true && b._id),
            }}
          />
        </div>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default guilgeeniiTuukh;
