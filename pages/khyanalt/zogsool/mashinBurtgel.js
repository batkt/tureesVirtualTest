import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import React, { useMemo, useState } from "react";
import { useAuth } from "services/auth";
import { Button, Card, Popconfirm, Popover, Space, Table } from "antd";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  MoreOutlined,
  PlusOutlined,
  SettingOutlined,
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
import { useTranslation } from "react-i18next";
import deleteMethod from "../../../tools/function/crud/deleteMethod";

function mashinBurtgel({ token }) {
  const { t } = useTranslation();
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
        too: formatNumber(
          mashinToololt?.reduce((a, b) => a + b.too, 0),
          0
        ),
      },
      {
        name: "Гэрээт",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Гэрээт")?.too,
          0
        ),
      },
      {
        name: "Түрээслэгч",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Түрээслэгч")?.too,
          0
        ),
      },
      {
        name: "Дотоод",
        too: formatNumber(
          mashinToololt?.find((a) => a._id === "Дотоод")?.too,
          0
        ),
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
        <Button onClick={() => excelref.current.khaaya()}>{t("Хаах")}</Button>
        <Button style={{ backgroundColor: "#209669", color: "#ffffff" }}>
          {t("Хадгалах")}
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
          zam='mashiniiExcelTatya'
          garchig='Excel файл аа чирч оруулах эсвэл сонгоно уу'
          tailbar='Машины мэдээлэл оруулах excel файл'
          zagvariinZam='mashiniiExcelAvya'
        />
      ),
      footer,
    });
  }

  function mashinUstgaya(data) {
    deleteMethod("mashin", token, data?._id).then(
      ({ data }) => data === "Amjilttai" && mashinMutate()
    );
  }

  function mashinBurtgekh(data) {
    let mashinBurtgekhButtonId = "mashinBurtgekhButtonId";
    const footer = [
      <Space>
        <Button onClick={() => mashinref.current.khaaya()}>{t("Хаах")}</Button>
        <Button
          type='primary'
          id={mashinBurtgekhButtonId}
          onClick={() => mashinref.current.khadgalya()}>
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <MashinBurtgel
          mashinBurtgekhButtonId={mashinBurtgekhButtonId}
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
      title='Машин бүртгэл'
      khuudasniiNer='mashinBurtgel'
      className='p-0 md:p-4'
      tsonkhniiId={"64546d9caf55fc853dd6812c"}
      onSearch={(search) =>
        setMashinKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }))
      }
      loading={isValidating}>
      <Card size='small' className='col-span-12 overflow-auto'>
        <div className='hideScroll flex w-full gap-4 overflow-hidden overflow-x-auto border-solid py-3 sm:grid sm:grid-cols-6 sm:p-0 md:gap-6 2xl:grid-cols-12'>
          {toololt.map((a, i) => (
            <div
              key={i}
              className={`zoom-in col-span-12 h-20 cursor-pointer rounded-xl border-2 border-green-600 sm:col-span-12 md:col-span-4 lg:col-span-3 ${
                a.name === turul ? "bg-green-50 dark:bg-gray-900" : ""
              }`}
              onClick={() => setTurul(a.name)}
              data-aos='zoom-out-down'
              data-aos-duration='1000'
              data-aos-delay={4 - i + "00"}>
              <div className='h-full w-[67vw] rounded-xl md:w-auto'>
                <div className='rounded-xl p-3'>
                  <div className='flex flex-row items-center space-x-2'>
                    <div className='text-3xl font-bold text-green-600'>
                      {a.too || 0}
                    </div>
                    <div className='text-base text-gray-500'>{t(a.name)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className='col-span-12'>
        <div
          className='flex flex-row'
          data-aos='zoom-out-up'
          data-aos-duration='1000'
          data-aos-delay='100'>
          <div></div>
          <div className='mb-5 ml-auto space-x-5 md:mb-0'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => mashinBurtgekh()}>
              {t("Машин нэмэх")}
            </Button>

            <Popover
              content={() => (
                <div className='flex w-32 flex-col'>
                  <a
                    className='flex cursor-pointer items-center space-x-2 rounded-lg p-1 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700 '
                    onClick={mashinOruulakhExcel}>
                    <UploadOutlined style={{ fontSize: "18px" }} />
                    <label>{t("Татах")}</label>
                  </a>
                </div>
              )}
              placement='bottom'
              trigger='click'>
              <Button
                type='primary'
                icon={<FileExcelOutlined style={{ fontSize: "16px" }} />}>
                <span>Excel</span>
                <DownOutlined width={5} />
              </Button>
            </Popover>
          </div>
        </div>
        <Table
          className='mt-8 hidden overflow-auto md:block'
          data-aos='fade-up'
          data-aos-duration='1000'
          data-aos-delay='300'
          tableLayout='auto'
          loading={!mashinGaralt}
          dataSource={mashinGaralt?.jagsaalt}
          scroll={{ y: "calc(100vh - 30rem)" }}
          size='small'
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
              title: t("Бүртгэсэн"),
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
              title: t("Нэр"),
              align: "left",
              dataIndex: "ezemshigchiinNer",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: t("Тайлбар"),
              width: "8rem",
              align: "center",
              dataIndex: "tailbar",
              showSorterTooltip: false,
            },
            {
              title: t("Утас"),
              align: "center",
              dataIndex: "ezemshigchiinUtas",
            },
            {
              title: t("Дугаар"),
              align: "center",
              dataIndex: "dugaar",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: t("Төрөл"),
              align: "center",
              dataIndex: "turul",
              showSorterTooltip: false,
              sorter: () => 0,
            },
            {
              title: () => <SettingOutlined />,
              width: "2rem",
              align: "center",
              render: (data) => (
                <div className='flex flex-row'>
                  <Popover
                    placement='bottom'
                    trigger='hover'
                    content={() => (
                      <div className='flex w-24 flex-col space-y-2'>
                        <a
                          className='ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700'
                          onClick={() => mashinBurtgekh(data)}>
                          <EditOutlined style={{ fontSize: "18px" }} />
                          <label>{t("Засах")}</label>
                        </a>
                        <Popconfirm
                          title={t("Машин устгах уу?")}
                          okText={t("Тийм")}
                          cancelText={t("Үгүй")}
                          onConfirm={() => mashinUstgaya(data)}>
                          <a className='ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700'>
                            <DeleteOutlined
                              className='text-red-600'
                              style={{ fontSize: "18px" }}
                            />
                            <label className='text-red-600'>
                              {t("Устгах")}
                            </label>
                          </a>
                        </Popconfirm>
                      </div>
                    )}>
                    <a className=' flex items-center justify-center  hover:scale-150 dark:hover:bg-gray-700'>
                      <MoreOutlined style={{ fontSize: "18px" }} />
                    </a>
                  </Popover>
                </div>
              ),
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
          cardListTuluv={"utas"}
          keyValue='uilchluulegch'
          className='block overflow-auto md:hidden'
          jagsaalt={mashinGaralt?.jagsaalt}
          Component={UilchluulegchTile}
        />
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default mashinBurtgel;
