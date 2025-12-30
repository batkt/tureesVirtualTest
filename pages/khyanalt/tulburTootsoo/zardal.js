import React, { useMemo, useRef, useState, useEffect } from "react";
import Admin from "components/Admin";
import _ from "lodash";
import {
  Button,
  DatePicker,
  Dropdown,
  Menu,
  Modal,
  notification,
  Popconfirm,
  Popover,
  Space,
  Table,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  MoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import ZardalBurtgekh from "components/pageComponents/zardal/ZardalBurtgekh";
import { useAuth } from "services/auth";
import { modal } from "components/ant/Modal";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import useZardal from "hooks/useZardal";
import useSWR from "swr";
import createMethod from "tools/function/crud/createMethod";
import getListMethod from "tools/function/crud/getListMethod";
import deleteMethod from "tools/function/crud/deleteMethod";

import formatNumber from "tools/function/formatNumber";
import moment from "moment";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const useZardaliinDun = (token, barilgiinId, idnuud, ognoo) => {
  const { data, mutate } = useSWR(
    ["zardliinDunAvya", ognoo, idnuud],
    (url, ognoo, idnuud) =>
      createMethod(url, token, {
        barilgiinId,
        idnuud,
        ekhlekhOgnoo: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
      }).then((a) => a.data),
    { revalidateOnFocus: false }
  );
  return { zardaliinDun: data, mutate };
};

const useDansniiKhuulga = (token, barilgiinId, zardliinBulgiinId, ognoo) => {
  const [khuudaslalt, setDansniiKhuulgaKhuudaslalt] = useState({
    khuudasniiDugaar: 1,
    khuudasniiKhemjee: 100,
    search: "",
  });

  const { data, mutate } = useSWR(
    token
      ? ["bankniiGuilgee", ognoo, zardliinBulgiinId, khuudaslalt, token]
      : null,
    (url, ognoo, zardliinBulgiinId, khuudaslaltParam, token) => {
      const { search: searchValue = "", ...khuudaslalt } = khuudaslaltParam || {};
      return getListMethod(url, token, {
        ...khuudaslalt,
        query: {
          barilgiinId,
          zardliinBulgiinId,
          $or: [
            {
              TxDt: {
                $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
              },
            },
            {
              tranDate: {
                $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
                $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
              },
            },
          ],
        },
        select: { TxDt: 1, dansniiDugaar: 1, Amt: 1, CtActnName: 1 },
      }).then((a) => a.data);
    },
    { revalidateOnFocus: false }
  );

  return {
    dansniiKhuulgaGaralt: data,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate: mutate,
  };
};

function pusher(list, zardal) {
  if (!!zardal?.dedKhesguud && zardal?.dedKhesguud.length > 0)
    zardal?.dedKhesguud.forEach((a) => pusher(list, a));
  list.push(zardal?._id);
}

function Dun({ token, barilgiinId, ognoo, zardal }) {
  const Idnuud = useMemo(() => {
    let idnuud = [];
    pusher(idnuud, zardal);
    return idnuud;
  }, [zardal]);

  const { zardaliinDun, mutate } = useZardaliinDun(
    token,
    barilgiinId,
    Idnuud,
    ognoo
  );

  zardal.mutate = mutate;

  return <div>{formatNumber(zardaliinDun)}</div>;
}

function ZardalMur({
  zardal,
  index,
  parent,
  token,
  barilgiinId,
  ognoo,
  baiguullagiinId,
  zardalBurtgekh,
  zardalUstgaya,
}) {
  const [showDed, setShowDed] = useState(false);

  const Idnuud = useMemo(() => {
    let idnuud = [];
    pusher(idnuud, zardal);
    return idnuud;
  }, [zardal]);

  const { zardaliinDun } = useZardaliinDun(token, barilgiinId, Idnuud, ognoo);

  const {
    dansniiKhuulgaGaralt,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate,
  } = useDansniiKhuulga(token, barilgiinId, zardal?._id, ognoo);

  function guilgeeUstgaya(guilgeeniiId) {
    uilchilgee(token)
      .post("/zardalTsutslaya", { guilgeeniiId })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай устгалаа.") });
          dansniiKhuulgaMutate();
        }
      });
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex w-full flex-row space-x-2">
        <div
          className="box flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-center"
          onClick={() => setShowDed(!showDed)}
        >
          {zardal.dedKhesguud ? (showDed ? "-" : "+") : ""}
        </div>
        <div
          className="box flex items-center rounded-sm px-2"
          style={{ width: `calc(100% - ${parent ? "21.25rem" : "23.5rem"})` }}
        >
          {zardal.ner}
        </div>
        <div
          className="box flex w-80 items-center rounded-sm px-2"
          style={{ width: !parent && "22.5rem" }}
        >
          {formatNumber(zardaliinDun || 0)}₮
        </div>
        {parent && (
          <Dropdown
            overlayClassName="p-2"
            overlay={
              <Menu className="p-2">
                <Menu.Item
                  key="Заалт нэмэх"
                  className="dark:hover:bg-dark-2 flex  items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700"
                  onClick={() => zardalUstgaya(zardal)}
                >
                  <DeleteOutlined />
                  <span>{t("Устгах")}</span>
                </Menu.Item>
                <Menu.Item
                  key="Заалт Excel-ээс оруулах"
                  className="dark:hover:bg-dark-2 flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700"
                  onClick={() => zardalBurtgekh(zardal)}
                >
                  <EditOutlined />
                  <span>{t("Засах")}</span>
                </Menu.Item>
              </Menu>
            }
            trigger="click"
            className="cursor-pointer"
          >
            <div className="box flex w-8 rotate-90 transform cursor-pointer items-center justify-center">
              <MoreOutlined style={{ display: "flex" }} />
            </div>
          </Dropdown>
        )}
      </div>
      {showDed && zardal.dedKhesguud && (
        <div className="w-full pl-12">
          <Zardal
            t={t}
            zardaluud={zardal.dedKhesguud}
            token={token}
            barilgiinId={barilgiinId}
            ognoo={ognoo}
            baiguullagiinId={baiguullagiinId}
          />
        </div>
      )}
      {showDed &&
        dansniiKhuulgaGaralt &&
        dansniiKhuulgaGaralt?.jagsaalt?.map((a) => (
          <div className="flex w-full flex-row space-x-4 pl-12 " key={a?._id}>
            <div className="box flex h-8 w-8 items-center justify-center rounded-sm text-center">
              {index + 1}
            </div>
            <div
              className="box flex items-center rounded-sm px-2"
              style={{ width: "calc(100% - 63.25rem)" }}
            >
              {a.dansniiDugaar}
            </div>
            <div className="box flex w-80 items-center rounded-sm px-2">
              {a.CtActnName}
            </div>
            <div className="box flex w-80 items-center rounded-sm px-2">
              {moment(a.TxDt).format("YYYY-MM-DD")}
            </div>
            <div className="box flex w-80 items-center rounded-sm px-2">
              {formatNumber(a.Amt || 0)}₮
            </div>
            <Popconfirm
              title="Холбогдсон зардал устгахдаа итгэлтэй байна уу?"
              okText={t("Тийм")}
              cancelText={t("Үгүй")}
              onConfirm={() => guilgeeUstgaya(a._id)}
              className="h-5 w-5"
            >
              <div className="box flex w-8 cursor-pointer items-center justify-center">
                <CloseOutlined style={{ display: "flex" }} />
              </div>
            </Popconfirm>
          </div>
        ))}
    </div>
  );
}

function Zardal({
  zardaluud,
  parent,
  token,
  barilgiinId,
  ognoo,
  baiguullagiinId,
  zardalBurtgekh,
  zardalUstgaya,
  t,
}) {
  return (
    <div className={`w-full space-y-4 ${parent ? "zardalkhusnegt" : ""}`}>
      {zardaluud?.map((a, i) => (
        <ZardalMur
          t={t}
          key={a?._id}
          zardal={a}
          index={i}
          parent={parent}
          ognoo={ognoo}
          token={token}
          baiguullagiinId={baiguullagiinId}
          barilgiinId={barilgiinId}
          zardalBurtgekh={zardalBurtgekh}
          zardalUstgaya={zardalUstgaya}
        />
      ))}
    </div>
  );
}

function KholbosonZardalTable({ columns, garalt, pagination }) {
  return (
    <div className="py-2 pl-4">
      <Table
        size="small"
        dataSource={garalt?.jagsaalt}
        columns={columns}
        rowKey={(row) => row._id}
        pagination={pagination}
        bordered
      />
    </div>
  );
}

function ZardalExpander({ mur, token, barilgiinId, ognoo, onRefresh }) {
  const {
    dansniiKhuulgaGaralt,
    setDansniiKhuulgaKhuudaslalt,
    dansniiKhuulgaMutate,
  } = useDansniiKhuulga(mur && token, barilgiinId, mur?._id, ognoo);

  function guilgeeUstgaya(guilgeeniiId) {
    uilchilgee(token)
      .post("/zardalTsutslaya", { guilgeeniiId })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({ message: t("Амжилттай устгалаа.") });
          dansniiKhuulgaMutate();
          sergeeya();
        }
      });
  }

  function sergeeya() {
    onRefresh();
    mur.mutate && mur.mutate();
  }

  return (
    <div className="">
      {mur.dedKhesguud && mur.dedKhesguud?.length > 0 && (
        <div className="py-2 pl-4">
          <ZardalTable
            showHeader={false}
            zardal={mur}
            barilgiinId={barilgiinId}
            token={token}
            onRefresh={sergeeya}
            columns={[
              {
                title: "№",
                key: "index",
                width: "3rem",
                align: "center",
                render: (text, record, index) => index + 1,
              },
              {
                title: t("Дэд бүлэг"),
                dataIndex: "ner",
                ellipsis: true,
                align: "center",
              },
              {
                title: t("Дүн"),
                dataIndex: "davkhar",
                ellipsis: true,
                align: "left",
                width: "13rem",
                render(text, row) {
                  return (
                    <Dun
                      token={token}
                      zardal={row}
                      barilgiinId={barilgiinId}
                      ognoo={ognoo}
                    />
                  );
                },
              },
            ]}
            garalt={{ jagsaalt: mur.dedKhesguud }}
            pagination={false}
            ognoo={ognoo}
          />
        </div>
      )}
      {dansniiKhuulgaGaralt?.jagsaalt?.length > 0 && (
        <KholbosonZardalTable
          columns={[
            {
              title: "№",
              key: "index",
              width: "3rem",
              align: "center",
              render: (text, record, index) => index + 1,
            },
            {
              title: t("Хүлээн авагчийн дансны нэр"),
              dataIndex: "CtActnName",
              ellipsis: true,
              align: "center",
            },
            {
              title: t("Дансны дугаар"),
              dataIndex: "dansniiDugaar",
              ellipsis: true,
              align: "center",
              width: "10rem",
            },
            {
              title: t("Огноо"),
              dataIndex: "TxDt",
              ellipsis: true,
              align: "center",
              width: "10rem",
              render(TxDt) {
                return moment(TxDt).format("YYYY-MM-DD");
              },
            },
            {
              title: t("Дүн"),
              dataIndex: "Amt",
              ellipsis: true,
              align: "left",
              width: "10rem",
              render(Amt) {
                return formatNumber(Amt || 0);
              },
            },
            {
              title: <SettingOutlined />,
              ellipsis: true,
              align: "center",
              width: "3rem",
              render(a) {
                return (
                  <div className="flex items-center justify-center">
                    <Popconfirm
                      placement="left"
                      title={t(
                        "Холбогдсон зардал устгахдаа итгэлтэй байна уу?"
                      )}
                      okText={t("Тийм")}
                      cancelText={t("Үгүй")}
                      onConfirm={() => guilgeeUstgaya(a._id)}
                    >
                      <div className="hide-on-print flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border p-1 text-red-500">
                        <DeleteOutlined />
                      </div>
                    </Popconfirm>
                  </div>
                );
              },
            },
          ]}
          garalt={dansniiKhuulgaGaralt}
        />
      )}
    </div>
  );
}

function ZardalTable({
  columns,
  garalt,
  pagination,
  token,
  barilgiinId,
  ognoo,
  rowClassName,
  showHeader,
  expandedRowClassName,
  onRefresh,
}) {
  const [expandedKeys, setExpandedKeys] = useState([]);

  return (
    <Table
      bordered
      size="small"
      scroll={{ y: "calc(100vh - 20rem)" }}
      dataSource={garalt?.jagsaalt}
      columns={columns}
      rowClassName={rowClassName}
      showHeader={showHeader}
      expandable={{
        expandedRowRender: (mur) =>
          expandedKeys.includes(mur._id) && (
            <ZardalExpander
              mur={mur}
              onRefresh={onRefresh}
              barilgiinId={barilgiinId}
              columns={columns}
              ognoo={ognoo}
              token={token}
            />
          ),
        expandedRowKeys: expandedKeys,
        expandedRowClassName: expandedRowClassName,
        onExpand: (a, b) => {
          if (true === a) expandedKeys.push(b._id);
          else {
            const index = expandedKeys.indexOf(b._id);
            expandedKeys.splice(index, 1);
          }
          setExpandedKeys([...expandedKeys]);
        },
      }}
      rowKey={(row) => row._id}
      pagination={pagination}
    />
  );
}

function zardal({ token }) {
  const { t } = useTranslation();
  const { barilgiinId, baiguullaga } = useAuth();
  const zardalRef = useRef(null);
  const [ognoo, setOgnoo] = useState([moment(), moment()]);

  const { zardalGaralt, setZardalKhuudaslalt, zardalMutate, isValidating } =
    useZardal(token, baiguullaga?._id);

  function onRefresh() {
    zardalMutate();
  }

  function zardalBurtgekh(data) {
    const footer = [
      <Space>
        <Button onClick={() => zardalRef.current.khaaya()}>{t("Хаах")}</Button>
        <Button type="primary" onClick={() => zardalRef.current.khadgalya()}>
          {t("Хадгалах")}
        </Button>
      </Space>,
    ];
    modal({
      title: t("Зардлын бүлэг үүсгэх"),
      icon: <FileExcelOutlined />,
      width: 850,
      content: (
        <ZardalBurtgekh
          t={t}
          ref={zardalRef}
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          data={_.cloneDeep(data)}
        />
      ),
      footer,
    });
  }

  function zardalUstgaya(data) {
    function ustgaya() {
      deleteMethod("zardal", token, data._id)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({ message: "Амжилттай устгагдлаа" });
            onRefresh();
          }
        })
        .catch(aldaaBarigch);
    }
    Modal.confirm({
      onOk: ustgaya,
      content: (
        <div>
          <strong>{data.ner}</strong> зардал устгахдаа итгэлтэй байна уу?
        </div>
      ),
      okText: t("Тийм"),
      cancelText: t("Үгүй"),
    });
  }
  useEffect(() => {
    Aos.init({ once: true });
  });
  return (
    <Admin
      title="Зардлын жагсаалт"
      khuudasniiNer="zardal"
      className="p-4"
      onSearch={(searchValue) =>
        setZardalKhuudaslalt((a) => ({
          ...a,
          search: searchValue,
          khuudasniiDugaar: 1,
        }))
      }
      tsonkhniiId="62ea0bf67c54f8189bdca517"
      loading={isValidating}
    >
      <div className="col-span-12 space-y-5">
        <div className="flex w-full flex-col md:mt-0 md:flex-row">
          <div data-aos="fade-right" data-aos-duration="1000">
            <DatePicker.RangePicker
              className="w-full md:w-auto"
              value={ognoo}
              onChange={setOgnoo}
            />
          </div>
          <button
            style={{
              backgroundColor: "#209669",
              display: "flex",
              justifyContent: "center",
            }}
            className="dropdown-toggle btn box ml-auto mt-3 w-full  bg-green-500 px-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 md:mt-0 md:w-auto"
            aria-expanded="false"
            onClick={() => zardalBurtgekh()}
            data-aos="fade-left"
            data-aos-duration="1000"
          >
            <span className="flex h-5 w-5 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-plus h-4 w-4"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </span>
            <span>{t("Зардал бүртгэх")}</span>
          </button>
        </div>
      </div>
      <div
        className="box col-span-12"
        data-aos="fade-left"
        data-aos-duration="1000"
      >
        <ZardalTable
          token={token}
          onRefresh={onRefresh}
          barilgiinId={barilgiinId}
          garalt={zardalGaralt}
          ognoo={ognoo}
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "bg-white dark:bg-gray-600"
              : "bg-gray-200 dark:bg-gray-800"
          }
          expandedRowClassName={(a, index) =>
            index % 2 === 0
              ? "bg-white dark:bg-gray-600"
              : "bg-gray-200 dark:bg-gray-800"
          }
          columns={[
            {
              title: "№",
              key: "index",
              width: "3rem",
              align: "center",
              render: (text, record, index) => index + 1,
            },
            {
              title: t("Зардлын бүлэг"),
              dataIndex: "ner",
              ellipsis: true,
              align: "center",
              width: "65vw",
            },
            {
              title: t("Дүн"),
              dataIndex: "davkhar",
              ellipsis: true,
              align: "center",
              width: "10rem",
              render(text, row) {
                return (
                  <Dun
                    token={token}
                    zardal={row}
                    barilgiinId={barilgiinId}
                    ognoo={ognoo}
                  />
                );
              },
            },
            {
              title: <SettingOutlined />,
              dataIndex: "davkhar",
              ellipsis: true,
              align: "center",
              width: "3rem",
              render(z, mur) {
                return (
                  <div className="absolute flex flex-row justify-center">
                    <Popover
                      placement="left"
                      trigger="click"
                      content={() => (
                        <div className="flex w-full flex-col space-y-2">
                          <a
                            className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700"
                            onClick={() => zardalBurtgekh(mur)}
                          >
                            <EditOutlined
                              className=""
                              style={{ fontSize: "18px", color: "green" }}
                            />
                            <label>{t("Засах")}</label>
                          </a>
                          <Popconfirm
                            className=""
                            title="Та зардал устгах гэж байна үргэлжлүүлэх үү?"
                            okText={t("Тийм")}
                            cancelText={t("Үгүй")}
                            onConfirm={() => zardalUstgaya(mur)}
                          >
                            <a className="ant-dropdown-link flex w-full items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:hover:bg-gray-700">
                              <DeleteOutlined
                                className="px-3"
                                style={{ fontSize: "18px", color: "red" }}
                              />
                              <label>{t("Устгах")}</label>
                            </a>
                          </Popconfirm>
                        </div>
                      )}
                    >
                      <a className=" flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700">
                        <MoreOutlined style={{ fontSize: "18px" }} />
                      </a>
                    </Popover>
                  </div>
                );
              },
            },
          ]}
        />
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default zardal;
