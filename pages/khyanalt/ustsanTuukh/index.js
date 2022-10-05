import { Card, DatePicker, Select, Table } from "antd";
import Admin from "components/Admin";
import moment from "moment";
import useJagsaalt from "hooks/useJagsaalt";
import React, { useMemo, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import router from "next/router";
import CardList from "components/cardList";
import UstsanTuukhTile from "components/pageComponents/ustsanTuukh/UstsanTuukhTile";

const { RangePicker } = DatePicker;
const order = { createdAt: -1 };

const searchKeys = ["ajiltniiNer"];
const turluud = [
  {
    turul: "gereeniiZagvar",
    text: "Гэрээний загвар",
  },
  {
    turul: "talbai",
    text: "Талбай",
  },
  {
    turul: "ajiltan",
    text: "Ажилтан бүртгэл",
  },
  {
    turul: "khariltsagch",
    text: "Харилцагч",
  },
  {
    turul: "medegdel",
    text: "Мэдэгдэл",
  },
  {
    turul: "nekhemjlekhiinZagvar",
    text: "Нэхэмжлэл загвар",
  },
  {
    turul: "zardal",
    text: "Зардлын жагсаалт",
  },
  {
    turul: "eBarimt",
    text: "И-баримтын бүртгэл",
  },
  {
    turul: "zogsool",
    text: "Зогсоол",
  },
  {
    turul: "anket",
    text: "Анкетын асуулга бэлдэх",
  },
];


function UstsanTuukh() {
  const [query, setQuery] = useState({
    ajiltniiId: undefined,
    class: undefined,
  });

  const ustsanBarimt = useJagsaalt(
    "/ustsanBarimt",
    query,
    order,
    undefined,
    searchKeys
  );
  const ajiltan = useJagsaalt("/ajiltan");

  const { turulColumns } = React.useMemo(() => {
    let turulColumns = [];
    switch (query.class) {
      case "gereeniiZagvar":
        turulColumns.push({
          title: "Нэр",
          width: "5rem",
          align: "center",
          render: (gereeNer) => {
            return <>
              <div>{gereeNer.object.ner}</div>
            </>
          },
          sorter: () => 0,
        });
        break;
      case "talbai":
        turulColumns.push({
          title: "Талбайн дугаар",
          width: "3rem",
          align: "center",
          render: (talbai) => {
            return <>
              <div>{talbai.object.kod}</div>
            </>
          },
          sorter: () => 0,
        });
        break;
      case "ajiltan":
        turulColumns.push({
          title: "Регистр",
          width: "2rem",
          align: "center",
          render: (ajiltanBurtgel) => {
            console.log(ajiltanBurtgel)
            return <>
              <div>{ajiltanBurtgel.object.register}</div>
            </>
          },
          sorter: () => 0,
        });
        break;
      case "khariltsagch":
        turulColumns.push({
          title: "Регистр",
          width: "2rem",
          align: "center",
          render: (khariltsagch) => {
            return <>
              <div>{khariltsagch.object.register}</div>
            </>
          },
          sorter: () => 0,
        });
        break;
      case "nekhemjlekhiinZagvar":
        turulColumns.push({
          title: "Нэр",
          width: "3rem",
          align: "center",
          render: (nekhemjlekhiinZagvar) => {
            return <>
              <div>{nekhemjlekhiinZagvar.object.ner}</div>
            </>
          },
          sorter: () => 0,
        });
        break;
      default:
        break;
    }
    return { turulColumns };
  }, [query.class]);


  console.log(ustsanBarimt)
  const columns = useMemo(() => {
    return [
      {
        title: "Огноо",
        dataIndex: "createdAt",
        align: "center",
        ellipsis: true,
        width: "6rem",
        showSorterTooltip: false,
        render: (createdAt) => {
          return moment(createdAt).format("YYYY-MM-DD hh:mm");
        },
        sorter: () => 0,
      },

      {
        title: "Төрөл",
        dataIndex: "class",
        align: "left",
        ellipsis: true,
        width: "6rem",
        showSorterTooltip: false,
        render: (mur) => {
          var text;
          switch (mur) {
            case "gereeniiZagvar":
              text = "Гэрээний загвар";
              break;
            case "talbai":
              text = "Талбай";
              break;
            case "Talbai":
              text = "Талбай";
              break;
            case "ajiltan":
              text = "Ажилтан бүртгэл";
              break;
            case "Khariltsagch":
              text = "Харилцагч";
              break;
            case "khariltsagch":
              text = "Харилцагч";
              break;
            case "khariltsagch":
              text = "Харилцагч";
              break;
            case "asuult":
              text = "Асуулт";
              break;
            case "nekhemjlekhiinZagvar":
              text = "Нэхэмжлэл загвар";
              break;
            case "zardal":
              text = "Зардлын жагсаалт";
              break;
            case "eBarimt":
              text = "И-баримтын бүртгэл";
              break;
            case "zogsool":
              text = "Зогсоол";
              break;
            case "anket":
              text = "Анкетын асуулга бэлдэх";
              break;
            case "gereeniiGuilgee":
              text = "Гэрээний гүйлгээ";
              break;
            case "mailiinZagvar":
              text = "И-мэйл загвар";
              break;
            default:
              text = mur;
              break;
          }
          return text;
        },
        sorter: () => 0,
      },
      {
        title: "Устгасан шалтгаан",
        align: "center",
        ellipsis: true,
        width: "7rem",
        showSorterTooltip: false,
        render: (tailbar) => {
          return <>
            <div>{tailbar?.object?.tailbar || tailbar?.tailbar}</div>
          </>
        }
      },
      ...turulColumns,
      {
        title: "Ажилтны нэр",
        dataIndex: "ajiltniiNer",
        align: "center",
        ellipsis: true,
        width: "7rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },

    ];
  });

  function ognooShuultOnChange(e) {
    setQuery({
      ...query,
      createdAt: e
        ? {
          $gte: moment(e[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(e[1]).format("YYYY-MM-DD 23:59:59"),
        }
        : undefined,
    });
  }

  return (
    <Admin
      title="Устгасан түүх"
      khuudasniiNer="ustsanTuukh"
      onSearch={(search) =>
        ustsanBarimt.setKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      loading={ustsanBarimt.isValidating}
      className="p-0 md:p-4"
    >
      <Card className="col-span-12 rounded-md bg-white dark:bg-gray-900">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <RangePicker
            style={{ marginBottom: "20px" }}
            size="middle"
            onChange={ognooShuultOnChange}
          />
          <div>
            <Select
              className="w-full sm:w-36"
              placeholder="Ажилтан"
              onChange={(v) => setQuery({ ...query, ajiltniiId: v })}
              allowClear
            >
              {ajiltan?.jagsaalt.map((a) => (
                <Select.Option key={a._id} value={a._id}>
                  {a.ner}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <Select
              className="w-full sm:w-36"
              placeholder="Төрөл"
              onChange={(v) => setQuery({ ...query, class: v })}
              allowClear
            >
              {turluud.map((a) => (
                <Select.Option value={a.turul}>{a.text}</Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <Table
          bordered
          size="small"
          className="hidden overflow-auto md:block"
          columns={columns}
          scroll={{ y: "calc(100vh - 20rem)" }}
          dataSource={ustsanBarimt?.jagsaalt}
          rowKey={(row) => row._id}
          pagination={{
            current: Number(ustsanBarimt?.data?.khuudasniiDugaar),
            pageSize: ustsanBarimt?.data?.khuudasniiKhemjee,
            total: ustsanBarimt?.data?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              ustsanBarimt.setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
        <CardList
          keyValue="ustsanBarimt"
          className="block overflow-auto md:hidden"
          jagsaalt={ustsanBarimt?.jagsaalt}
          Component={UstsanTuukhTile}
          componentProps={{ router }}
          pagination={{
            current: ustsanBarimt?.data?.khuudasniiDugaar,
            pageSize: ustsanBarimt?.data?.khuudasniiKhemjee,
            total: ustsanBarimt?.data?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              ustsanBarimt.setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default UstsanTuukh;
