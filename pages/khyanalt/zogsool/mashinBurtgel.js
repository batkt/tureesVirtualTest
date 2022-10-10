import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import { Button, Card, Popover, Space, Table } from "antd";
import {
  DownOutlined,
  FileExcelOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CardList from "components/cardList";
import UilchluulegchTile from "components/pageComponents/zogsool/UilchluulegchTile";
import formatNumber from "tools/function/formatNumber";
import { useRef, useEffect } from "react";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import { modal } from "components/ant/Modal";
import useMashin, { useMashinToololt } from "hooks/useMashin";
import MashinBurtgel from "components/pageComponents/zogsool/MashinBurtgel";
import useOrder from "tools/function/useOrder";
import moment from "moment";
import Aos from "aos";

function mashinBurtgel({ token }) {
  const { baiguullaga, barilgiinId } = useAuth();
  const excelref = useRef(null);
  const mashinref = useRef(null);
  const [turul, setTurul] = useState("Нийт");

  const query = useMemo(() => {
    if (turul === "Нийт") return {};
    return { turul };
  }, [turul]);

  const { mashinToololt, mashinToololtMutate } = useMashinToololt(token);

  const { order, onChangeTable } = useOrder({});

  const { mashinGaralt, setMashinKhuudaslalt, mashinMutate, isValidating } =
    useMashin(token, baiguullaga?._id, query, order);

  const toololt = useMemo(() => {
    return [
      {
        name: "Нийт",
        too: formatNumber(mashinToololt?.reduce((a, b) => a + b.too, 0)),
      },
      {
        name: "Гэрээт",
        too: formatNumber(mashinToololt?.find((a) => a._id === "Гэрээт")?.too),
      },
      {
        name: "Түрээслэгч",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Түрээслэгч")?.too
        ),
      },
      {
        name: "Дотоод",
        too: formatNumber(mashinToololt?.find((a) => a._id === "Дотоод")?.too),
      },
    ];
  }, [mashinToololt, mashinGaralt]);

  function onRefresh() {
    mashinMutate();
    mashinToololtMutate();
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

  function mashinBurtgekh(data) {
    const footer = [
      <Space>
        <Button onClick={() => mashinref.current.khaaya()}>Хаах</Button>
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => mashinref.current.khadgalya()}
        >
          Хадгалах
        </Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <MashinBurtgel
          ref={mashinref}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          data={data}
        />
      ),
      footer,
    });
  }
  useEffect(() => {
    Aos.init({ once: true });
  });

  return (
    <Admin
      title="Машин бүртгэл"
      khuudasniiNer="mashinBurtgel"
      className="p-0 md:p-4"
      tsonkhniiId={"62ea0cad7c54f8189bdca52d"}
      onSearch={(search) =>
        setMashinKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
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
              data-aos-delay={4 - i + "00"}
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
        <div
          className="flex flex-row"
          data-aos="zoom-out-up"
          data-aos-duration="1000"
          data-aos-delay="100"
        >
          <div></div>
          <div className="ml-auto space-x-5">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => mashinBurtgekh()}
            >
              Машин нэмэх
            </Button>

            <Popover
              content={() => (
                <div className="flex w-32 flex-col">
                  <a
                    className="flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 "
                    onClick={mashinOruulakhExcel}
                  >
                    <UploadOutlined style={{ fontSize: "18px" }} />
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
        <Table
          className="mt-8 hidden overflow-auto md:block"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300"
          tableLayout="auto"
          loading={!mashinGaralt}
          dataSource={mashinGaralt?.jagsaalt}
          scroll={{ y: "calc(100vh - 30rem)" }}
          size="small"
          bordered
          onChange={onChangeTable}
          columns={[
            {
              title: "№",
              align: "center",
              dataIndex: "dugaar",
              width: "2rem",
              render: (text, record, index) =>
                (mashinGaralt?.khuudasniiDugaar || 0) *
                  (mashinGaralt?.khuudasniiKhemjee || 0) -
                (mashinGaralt?.khuudasniiKhemjee || 0) +
                index +
                1,
            },
            {
              title: "Бүртгэсэн",
              dataIndex: "createdAt",
              ellipsis: true,
              align: "center",
              render(date) {
                return moment(date).format("YYYY-MM-DD HH:mm");
              },
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: "Нэр",
              align: "left",
              dataIndex: "ezemshigchiinNer",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: "Регистр",
              align: "center",
              dataIndex: "ezemshigchiinRegister",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: "Утас",
              align: "center",
              dataIndex: "ezemshigchiinUtas",
            },
            {
              title: "Дугаар",
              align: "center",
              dataIndex: "dugaar",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: "Төрөл",
              align: "center",
              dataIndex: "turul",
              showSorterTooltip: false,
              sorter: () => 0,
            },
          ]}
          pagination={{
            current: mashinGaralt?.khuudasniiDugaar,
            pageSize: mashinGaralt?.khuudasniiKhemjee,
            total: mashinGaralt?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              setMashinKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
        <CardList
          keyValue="uilchluulegch"
          className="block overflow-auto md:hidden"
          jagsaalt={mashinGaralt?.jagsaalt}
          Component={UilchluulegchTile}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default mashinBurtgel;
