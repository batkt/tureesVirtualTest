import moment from "moment";
import { useAuth } from "services/auth";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Card,
  DatePicker,
  message,
  Popconfirm,
  Spin,
} from "antd";

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import formatNumber from "tools/function/formatNumber";
import { useMemo, useState, useEffect } from "react";
import useEBarimt from "hooks/useEBarimt";
import useEBarimtMedeelel from "hooks/useEBarimtMedeelel";
import { useBarimtToollolt } from "hooks/useEBarimt";
import useOrder from "tools/function/useOrder";
import Aos from "aos";

const { RangePicker } = DatePicker;
//#endregion

function EbarimtMedeelel({ token }) {
  useEffect(() => {
    Aos.init();
  });
  const { ajiltan, barilgiinId } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()]);

  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    return {
      $or: [{ ustgasanOgnoo: null }, { ustgasanOgnoo: { $exists: false } }],
      createdAt: {
        $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
        $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
      },
    };
  }, [ekhlekhOgnoo]);

  const queryToololt = useMemo(() => {
    return {
      barilgiinId: barilgiinId,
      ekhlekhOgnoo: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
    };
  }, [ekhlekhOgnoo]);

  const { order, onChangeTable } = useOrder({ createAt: -1 });

  const { eBarimtGaralt, eBarimtMutate, setEBarimtKhuudaslalt } = useEBarimt(
    token,
    ajiltan?.baiguullagiinId,
    query,
    order
  );

  const { eBarimtMedeelel, eBarimtMedeelelMutate } = useEBarimtMedeelel(
    token,
    barilgiinId
  );
  const { ebarimtiinToololt } = useBarimtToollolt(token, queryToololt);
  const khyanaltiinDun = [
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.avakhToo)
          : 0,
      utga: "Баримт авах тоо",
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.avakhDun)
          : 0,
      utga: "Баримт авах дүн",
    },

    {
      too: eBarimtGaralt?.niitMur || 0,
      utga: "Баримт авсан тоо",
    },

    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.ilgeesenDun)
          : 0,
      utga: "Баримт авсан дүн",
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.butsaasanToo)
          : 0,
      utga: "Буцаалт хийгдсэн тоо",
    },
    {
      too:
        ebarimtiinToololt !== undefined
          ? formatNumber(ebarimtiinToololt.butsaasanDun)
          : 0,
      utga: "Буцаалт хийгдсэн дүн",
    },
  ];

  function ebarimtIlgeeye() {
    if (loading === true) return;
    setLoading(true);
    uilchilgee(token)
      .post("/ebarimtIlgeeye", { barilgiinId: barilgiinId })
      .then(({ status }) => {
        status === 200 && message.success("Баримт амжилттай илгээлээ");
        eBarimtMedeelelMutate();
        setLoading(false);
      })
      .catch(aldaaBarigch);
  }

  function ebarimtUstgaya(mur) {
    mur.barilgiinId = barilgiinId;
    uilchilgee(token)
      .post("/ebarimtButsaaya", mur)
      .then(({ data }) => {
        if (!!data) {
          eBarimtMutate();
          message.success(
            `${mur.billId} дугаартай баримт амжилттай ebarimt -с устгагдлаа`
          );
        }
      });
  }
  return (
    <Admin
      khuudasniiNer="eBarimt"
      title="И-баримтын бүртгэл"
      className="p-0 md:p-5"
      onSearch={(search) => setKhuudaslalt((a) => ({ ...a, search }))}
      tsonkhniiId="61c2c70a1c2830c4e6f90ccf"
    >
      <Card className="cardgrid col-span-12 p-5">
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {khyanaltiinDun.map((mur, index) => {
            return (
              <div
                key={index}
                className="intro-y zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 lg:col-span-2"
                data-aos="zoom-out-down"
                data-aos-duration="1000"
                data-aos-delay={6 - index + "00"}
              >
                <div className="h-full rounded-xl">
                  <div className="rounded-xl p-3">
                    <div className="flex">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {mur.too}
                        </div>
                        <div className="text-sm text-gray-500">{mur.utga}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex w-full flex-row justify-between">
          <RangePicker
            style={{ marginBottom: "20px" }}
            size="middle"
            value={ekhlekhOgnoo}
            onChange={setEkhlekhOgnoo}
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
          />
          <div
            className="flex flex-row space-x-2"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <Button title="Сүүлд илгээгдсэн огноо">
              {moment(eBarimtMedeelel?.extraInfo?.lastSentDate).format(
                "YYYY-MM-DD"
              )}
            </Button>

            <Button danger onClick={ebarimtIlgeeye}>
              <Spin spinning={loading}>{loading ? "" : "Татварт илгээх"}</Spin>
            </Button>
          </div>
        </div>

        <Table
          bordered
          tableLayout={"fixed"}
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="300"
          size="small"
          rowClassName="hover:bg-blue-100"
          dataSource={eBarimtGaralt?.jagsaalt}
          pagination={{
            current: eBarimtGaralt?.khuudasniiDugaar,
            pageSize: 100,
            total: eBarimtGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setEBarimtKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
          onChange={onChangeTable}
          scroll={{ y: "calc(100vh - 26rem)" }}
          rowKey={(row) => row._id}
          className="t-head"
          columns={[
            {
              title: "Огноо",
              dataIndex: "date",
              ellipsis: true,
              align: "center",
              render: (data) => {
                return moment(data).format("YYYY-MM-DD hh:mm:ss");
              },
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: "Гэрээний дугаар",
              dataIndex: "gereeniiDugaar",
              ellipsis: true,
              align: "center",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: "Утас",
              dataIndex: "utas",
              ellipsis: true,
              align: "center",
            },
            {
              title: "Талбайн дугаар",
              dataIndex: "talbainDugaar",
              ellipsis: true,
              align: "center",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: "ДДТД",
              dataIndex: "billId",
              width: "300px",
            },
            {
              title: "Дүн",
              dataIndex: "cashAmount",
              ellipsis: true,
              align: "center",
              render: (data) => {
                return formatNumber(data);
              },
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              width: "60px",
              align: "center",
              render(data) {
                return (
                  <Popconfirm
                    title="ebarimt устгах уу?"
                    okText="Тийм"
                    cancelText="Үгүй"
                    onConfirm={() => ebarimtUstgaya(data)}
                  >
                    <Button
                      danger
                      size="small"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      shape="circle"
                      icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                );
              },
            },
          ]}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default EbarimtMedeelel;
