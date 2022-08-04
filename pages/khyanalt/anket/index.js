import { Button, DatePicker, message, Table } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import moment from "moment";
import useOrder from "tools/function/useOrder";
import _ from "lodash";
const garalt = {
  khuudasniiDugaar: 1,
  khuudasniiKhemjee: 10,
};

import Admin from "components/Admin";
import router from "next/router";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;

function Khabea({ token }) {
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ]);

  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  const query = useMemo(
    () => ({
      createdAt: !!ekhlekhOgnoo
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    }),
    [ekhlekhOgnoo]
  );

  const survey = useJagsaalt("/survey", undefined, order);

  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "index",
        className: "text-center",
        width: "2rem",
        render: (text, record, index) => index + 1,
        sorter: () => 0,
      },
      {
        title: "Огноо",
        key: "createdAt",
        dataIndex: "createdAt",
        align: "center",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD HH:mm");
        },
        sorter: () => 0,
      },
      {
        title: "Нэр",
        key: "ner",
        dataIndex: "ner",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Утас",
        key: "utas",
        dataIndex: "utas",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "И-мэйл",
        key: "mail",
        dataIndex: "mail",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Чиглэл",
        key: "chiglel",
        dataIndex: "chiglel",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Хугацаа",
        key: "uilAjillagaa",
        dataIndex: "uilAjillagaa",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Ажилтан тоо",
        key: "ajiltniiToo",
        dataIndex: "ajiltniiToo",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Талбайн хэмжээ",
        key: "talbainKhemjee",
        dataIndex: "talbainKhemjee",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Давхар",
        align: "center",
        dataIndex: "",
        ellipsis: true,
        render: (data) => {
          var turul = Array.from(new Set(data?.davkhar)).toString();
          return turul;
        },
        sorter: () => 0,
      },
      {
        title: "Нэмэлт",
        key: "nemeltMedeelel",
        dataIndex: "nemeltMedeelel",
        ellipsis: true,
        align: "center",
        sorter: () => 0,
      },
    ],
    []
  );

  function onChangeOgnoo(date, dateString) {
    setEkhlekhOgnoo(date);
  }

  useEffect(() => {
    Aos.init({ once: true });
  });

  function anketNemekh(id) {
    router.push(`/khyanalt/anket/nemekh/${id}`);
  }
  function anketIlgeekh(id) {
    router.push(`/khyanalt/anket/${id}`);
  }

  return (
    <Admin
      title="Анкетын асуулга бэлдэх"
      khuudasniiNer="anket"
      tsonkhniiId={"62ea0d2b7c54f8189bdca54c"}
      onSearch={(search) =>
        setAsuulgiinKhuudaslalt((kh) => ({
          ...kh,
          khuudasniiDugaar: 1,
          search,
        }))
      }
    >
      <div className="col-span-12 p-0 md:p-5">
        <div className="box col-span-12 overflow-auto p-5 md:col-span-6 xl:col-span-9">
          <div
            className="flex justify-between"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <RangePicker
              style={{ marginBottom: "15px" }}
              size="large"
              disabledTime
              defaultValue={[
                moment(new Date(), "YYYY-MM-DD"),
                moment(new Date(), "YYYY-MM-DD"),
              ]}
              format={"YYYY-MM-DD"}
              onChange={onChangeOgnoo}
            />
            <div className="flex">
              <Button
                className="mr-3"
                style={{ backgroundColor: "#209669", color: "#ffffff" }}
                onClick={() => anketNemekh("new")}
              >
                <PlusOutlined />
                Анкет нэмэх
              </Button>
              <Button className="mr-3" onClick={() => anketIlgeekh("new")}>
                Анкет илгээх
                <SendOutlined />
              </Button>
            </div>
          </div>
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
            data-aos-anchor-placement="top-bottom"
          >
            <Table
              bordered
              size="small"
              tableLayout="fixed"
              scroll={{ y: "calc(100vh - 20rem)" }}
              onChange={(a, b, c) => onChangeTable(a, b, c)}
              rowClassName={(record, index) =>
                index % 2 === 0
                  ? "bg-white dark:bg-gray-600 h-0.5"
                  : "bg-gray-200 dark:bg-gray-800 h-0.5"
              }
              dataSource={survey?.jagsaalt}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default Khabea;
