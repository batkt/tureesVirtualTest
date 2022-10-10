import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useState, useMemo } from "react";
import { useAuth } from "services/auth";
import { Button, Card, DatePicker, message, Popover, Space, Table } from "antd";
import {
  DownloadOutlined,
  DownOutlined,
  FileExcelOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import useZogsool, { useZogsoolToololt } from "hooks/useZogsool";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import { modal } from "components/ant/Modal";
import _ from "lodash";
import useOrder from "tools/function/useOrder";
import useSWR from "swr";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";

function excelTatajAvya(token, service, mur, sheet, query, order, sheetName) {
  message.loading("Өгөгдөл боловсруулж байна та түр хүлээнэ!", 100000);
  uilchilgee(token)
    .get(service, {
      params: { query, order, khuudasniiKhemjee: mur, khuudasniiDugaar: 1 },
    })
    .then(({ data }) => {
      const { Excel } = require("antd-table-saveas-excel");
      const excel = new Excel();
      excel
        .addSheet(sheetName)
        .addColumns(sheet)
        .addDataSource(data?.jagsaalt)
        .saveAs(sheetName + ".xlsx");
    })
    .catch(aldaaBarigch)
    .finally(() => message.destroy());
}

function Zogsool({ token }) {
  const { baiguullaga, barilgiinId } = useAuth();
  const excelref = useRef(null);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [turul, setTurul] = useState(undefined);

  const { zogsoolToololt, zogsoolToololtMutate } = useZogsoolToololt(
    token,
    ognoo
  );

  const zogsooliinMedeelel = useSWR(
    ["/zogsooliinDunAvya", token, ognoo],
    (url, token, ognoo) =>
      uilchilgee(token)
        .post(url, {
          ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        })
        .then((a) => a.data)
        .catch(aldaaBarigch)
  );

  const { order, onChangeTable } = useOrder({ check_in_time: -1 });

  const query = useMemo(() => {
    return {
      check_in_time: ognoo
        ? {
            $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
      turul: turul === "Үйлчлүүлэгч" ? null : turul,
    };
  }, [ognoo, turul]);

  const { zogsoolGaralt, setZogsoolKhuudaslalt, zogsoolMutate, isValidating } =
    useZogsool(token, baiguullaga?._id, query, order);

  const toololt = useMemo(
    () => [
      {
        name: "Үйлчлүүлэгч",
        too: formatNumber(zogsoolToololt?.find((a) => a._id === null)?.too, 0),
      },
      {
        name: "Түрээслэгч",
        too: formatNumber(
          zogsoolToololt?.find((a) => a._id === "Түрээслэгч")?.too,
          0
        ),
      },
      {
        name: "Гэрээт",
        too: formatNumber(
          zogsoolToololt?.find((a) => a._id === "Гэрээт")?.too,
          0
        ),
      },
      {
        name: "Дотоод",
        too: formatNumber(
          zogsoolToololt?.find((a) => a._id === "Дотоод")?.too,
          0
        ),
      },
    ],
    [zogsoolToololt, zogsoolGaralt]
  );

  function onRefresh() {
    zogsoolToololtMutate();
    zogsoolMutate();
  }

  function mashinOruulakhExcel() {
    const footer = [
      <Space>
        <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>
        <Button style={{ backgroundColor: "#209669", color: "#ffffff" }}>
          Хадгалах
        </Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ExceleesOruulakh
          ref={excelref}
          token={token}
          onFinish={onRefresh}
          barilgiinId={barilgiinId}
          zam="mashiniiExcelTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Машины мэдээлэл оруулах excel файл"
          zagvariinZam="mashiniiExcelAvya"
        />
      ),
      footer,
    });
  }

  const columns = useMemo(() => {
    const col = [
      {
        title: "№",
        align: "center",
        dataIndex: "dugaar",
        width: "2rem",
        render: (text, record, index) =>
          (zogsoolGaralt?.khuudasniiDugaar || 0) *
            (zogsoolGaralt?.khuudasniiKhemjee || 0) -
          (zogsoolGaralt?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
      {
        title: "Машин",
        align: "center",
        dataIndex: "car_number",
        showSorterTooltip: false,
        sorter: () => 0,
      },
    ];
    if (turul === "Түрээслэгч") {
      col.push({
        title: "Талбай",
        align: "center",
        dataIndex: "mashin",
        showSorterTooltip: false,
        sorter: () => 0,
        render(m) {
          return m?.ezemshigchiinTalbainDugaar;
        },
      });
      col.push({
        title: "Гэрээ",
        align: "center",
        dataIndex: "mashin",
        showSorterTooltip: false,
        sorter: () => 0,
        render(m) {
          return m?.gereeniiDugaar;
        },
      });
    }
    return [
      ...col,
      {
        title: "Орсон",
        align: "center",
        dataIndex: "check_in_time",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: "Гарсан",
        align: "center",
        dataIndex: "check_out_time",
        showSorterTooltip: false,
        sorter: () => 0,
        render(v) {
          return v && moment(v).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: "Хугацаа",
        align: "center",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "khugatsaa",
      },
      {
        title: "Төлбөр",
        align: "right",
        showSorterTooltip: false,
        sorter: () => 0,
        dataIndex: "tulbur",
        render(v) {
          return formatNumber(v);
        },
      },
    ];
  }, [turul]);

  useEffect(() => {
    Aos.init({ once: true });
  });

  function excelTatakh() {
    excelTatajAvya(
      token,
      "/zogsool",
      zogsoolGaralt.niitMur,
      columns,
      query,
      order,
      "Зогсоол"
    );
  }

  return (
    <Admin
      title="Зогсоол"
      khuudasniiNer="zogsool"
      className="p-0 md:p-4"
      onSearch={(search) =>
        setZogsoolKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      tsonkhniiId="61c2c7481c2830c4e6f90ce1"
      loading={isValidating}
    >
      <Card size="small" className="col-span-12 overflow-auto p-5">
        <div className="grid w-full grid-cols-12 gap-6 border-solid">
          {toololt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-4 lg:col-span-3 ${
                a.name === turul ? "bg-green-50 dark:bg-gray-900" : ""
              }`}
              onClick={() => setTurul(a.name)}
              data-aos="zoom-out-down"
              data-aos-duration="1000"
              data-aos-delay={1 + i + "00"}
            >
              <div className="h-full rounded-xl">
                <div className="rounded-xl p-3">
                  <div className="flex flex-row items-center space-x-2">
                    <div className="text-3xl font-bold text-green-600">
                      {a.too || 0}
                    </div>
                    <div className="text-base text-gray-500">{a.name}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="col-span-12">
        <div className="flex flex-row">
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <DatePicker.RangePicker
              size="small"
              value={ognoo}
              onChange={setOgnoo}
            />
          </div>
          <div className="ml-5 flex flex-row space-x-2 p-1 font-medium">
            Зогсоолын орлого : {formatNumber(zogsooliinMedeelel?.data)}₮
          </div>
          <div
            className="ml-auto"
            data-aos="fade-left"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <Popover
              content={() => (
                <div className="flex w-32 flex-col space-y-2">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={mashinOruulakhExcel}
                  >
                    <UploadOutlined style={{ fontSize: "18px" }} />
                    <label>Оруулах</label>
                  </a>
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={excelTatakh}
                  >
                    <DownloadOutlined style={{ fontSize: "18px" }} />
                    <label>Татах</label>
                  </a>
                </div>
              )}
              placement="bottom"
              trigger="click"
            >
              <Button
                type="primary"
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}
              >
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
          </div>
        </div>
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="300"
          data-aos-anchor-placement="top-bottom"
        >
          <Table
            className="mt-8 hidden overflow-auto md:block"
            tableLayout="auto"
            loading={!zogsoolGaralt}
            dataSource={zogsoolGaralt?.jagsaalt}
            scroll={{ y: "calc(100vh - 30rem)" }}
            size="small"
            bordered
            rowKey={(row) => row._id}
            columns={columns}
            onChange={onChangeTable}
            pagination={{
              current: zogsoolGaralt?.khuudasniiDugaar,
              pageSize: zogsoolGaralt?.khuudasniiKhemjee,
              total: zogsoolGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setZogsoolKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
          <CardList
            keyValue="uilchluulegch"
            className="block overflow-auto md:hidden"
            jagsaalt={zogsoolGaralt?.jagsaalt}
            Component={UilchluulegchTile}
          />
        </div>
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default Zogsool;
