import { Button, Card, DatePicker, Modal, Popover, Select, Table } from "antd";
import Admin from "components/Admin";
import moment from "moment";
import useJagsaalt from "hooks/useJagsaalt";
import React, { useEffect, useMemo, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import router from "next/router";
import CardList from "components/cardList";
import UstsanTuukhTile from "components/pageComponents/ustsanTuukh/UstsanTuukhTile";
import formatNumber from "tools/function/formatNumber";
import { useAuth } from "services/auth";
import { EyeOutlined, FileExcelOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import ZassanDelgerenguiKharakh from "components/pageComponents/zassanTuukh/ZassanMedegdelKharakh";
import Aos from "aos";
import { useTranslation } from "react-i18next";

const { RangePicker } = DatePicker;
const order = { createdAt: -1 };

const searchKeys = ["className", "ajiltniiNer", "classDugaar"];
const turluud = [
  {
    turul: "Geree",
    text: "Гэрээ",
  },
  {
    turul: "Talbai",
    text: "Талбай бүртгэл",
  },
  {
    turul: "Aldangi",
    text: "Алданги",
  },
];

function ZassanTuukh() {
  const { t } = useTranslation();
  const { token, ajiltan, baiguullaga, barilgiinId } = useAuth();
  const [ajiltankhaikh, setAjiltankhaikh] = useState();
  const [turul, setTurul] = useState();
  const ref = React.useRef();
  const [shuukhOgnoo, setShuukhOgnoo] = useState([
    moment().subtract(1, "months"),
    moment(),
  ]);
  const query = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId,
      ajiltniiId: ajiltankhaikh,
      classType: turul,
      createdAt: shuukhOgnoo
        ? {
            $gte: moment(shuukhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(shuukhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
  }, [ajiltankhaikh, shuukhOgnoo, turul, baiguullaga, barilgiinId]);

  const zassanBarimt = useJagsaalt(
    "/zassanBarimt",
    query,
    order,
    undefined,
    searchKeys
  );
  const ajiltanJagsaalt = useJagsaalt("/ajiltan");

  function medeelelKharakh(mur) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
    ];
    modal({
      title: t("Дэлгэрэнгүй Мэдээлэл"),
      icon: <FileExcelOutlined />,
      content: (
        <ZassanDelgerenguiKharakh
          ref={ref}
          data={mur}
          token={token}
          barilgiinId={barilgiinId}
          baiguullaga={baiguullaga}
          ajiltan={ajiltan}
        />
      ),
      width: "80vw",
      footer,
    });
  }

  const columns = useMemo(() => {
    return [
      {
        title: t("Огноо"),
        dataIndex: "classOgnoo",
        align: "center",
        ellipsis: true,
        width: "3rem",
        showSorterTooltip: false,
        render: (a) => {
          return (
            <>
              <div>{moment(a).format("YYYY-MM-DD")}</div>
            </>
          );
        },
      },
      {
        title: t("Төрөл"),
        dataIndex: "className",
        align: "left",
        ellipsis: true,
        width: "3rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Дугаар"),
        width: "5rem",
        dataIndex: "classDugaar",
        align: "center",
        sorter: () => 0,
      },
      {
        title: t("Зассан ажилтан"),
        dataIndex: "ajiltniiNer",
        align: "left",
        ellipsis: true,
        width: "3rem",
        showSorterTooltip: false,
        sorter: () => 0,
      },
      {
        title: t("Зассан огноо"),
        dataIndex: "createdAt",
        align: "center",
        ellipsis: true,
        width: "3rem",
        showSorterTooltip: false,
        sorter: () => 0,
        render: (data) => {
          return moment(data).format("YYYY-MM-DD HH:mm");
        },
      },
      {
        title: t("Өөрчлөлт"),
        width: "2rem",
        align: "center",
        render(a, record, index) {
          return (
            <div className="flex items-center justify-center">
              <Button
                className=" dark:bg-gray-700 "
                shape="circle"
                size="small"
                icon={
                  <div
                    className={`flex items-center justify-center  dark:bg-gray-700 `}
                    onClick={() => medeelelKharakh(record, index)}
                  >
                    <EyeOutlined
                      style={{ fontSize: "16px" }}
                      className=" dark:bg-gray-700 "
                    />
                  </div>
                }
              />
            </div>
          );
        },
      },
    ];
  });

  function ognooShuultOnChange(e) {
    if (e === null) {
      setShuukhOgnoo(undefined);
    } else setShuukhOgnoo([moment(e[0]), moment(e[1])]);
  }
  useEffect(() => {
    Aos.init({ once: true });
  });
  return (
    <Admin
      title={t("Зассан түүх")}
      tsonkhniiId={"67069bc4bc5cedcb985779e9"}
      khuudasniiNer="zassanTuukh"
      onSearch={(search) =>
        zassanBarimt.setKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }))
      }
      loading={zassanBarimt.isValidating}
      className="p-0 md:p-4"
    >
      <Card className="col-span-12 rounded-md bg-white dark:bg-gray-900">
        <div
          className="flex flex-col-reverse gap-3 sm:flex-row"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="300"
        >
          <RangePicker
            style={{ marginBottom: "20px" }}
            size="middle"
            value={shuukhOgnoo}
            onChange={ognooShuultOnChange}
          />
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="600"
          >
            <Select
              className="w-full sm:w-36"
              placeholder={t("Ажилтан")}
              onChange={(v) => setAjiltankhaikh(v)}
              allowClear
            >
              {ajiltanJagsaalt?.jagsaalt.map((a) => (
                <Select.Option key={a._id} value={a._id}>
                  {a.ner}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="900"
          >
            <Select
              className="w-full sm:w-36"
              placeholder={t("Төрөл")}
              onChange={(v) => setTurul(v)}
              allowClear
            >
              {turluud.map((a) => (
                <Select.Option value={a.turul}>{t(a.text)}</Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <Table
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300"
          bordered
          size="small"
          className="hidden overflow-auto md:block"
          columns={columns}
          scroll={{ y: "calc(100vh - 20rem)" }}
          dataSource={zassanBarimt?.jagsaalt}
          rowKey={(row) => row._id}
          pagination={{
            current: Number(zassanBarimt?.data?.khuudasniiDugaar),
            pageSize: zassanBarimt?.data?.khuudasniiKhemjee,
            total: zassanBarimt?.data?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              zassanBarimt.setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        />
        {/* <CardList
          keyValue="zassanBarimt"
          className="block overflow-auto md:hidden"
          jagsaalt={zassanBarimt?.jagsaalt}
          Component={UstsanTuukhTile}
          componentProps={{ router }}
          pagination={{
            current: zassanBarimt?.data?.khuudasniiDugaar,
            pageSize: zassanBarimt?.data?.khuudasniiKhemjee,
            total: zassanBarimt?.data?.niitMur,
            showSizeChanger: true,
            onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
              zassanBarimt.setKhuudaslalt((kh) => ({
                ...kh,
                khuudasniiDugaar,
                khuudasniiKhemjee,
              })),
          }}
        /> */}
      </Card>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ZassanTuukh;
