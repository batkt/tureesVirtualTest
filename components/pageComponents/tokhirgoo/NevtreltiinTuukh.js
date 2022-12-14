import React, { useMemo, useState } from "react";
import { DatePicker, Table } from "antd";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";

function NevtreltiinTuukh({ token }) {
  const [loading, setLoading] = useState(false);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ])

  const columns = useMemo(() => [
    {
      title: "№",
      width: "3rem",
      align: "center",
      render: (text, record, index) =>
        (khariult?.khuudasniiDugaar || 0) * (khariult?.khuudasniiKhemjee || 0) -
        (khariult?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: "Огноо",
      dataIndex: "",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Веб хөтөч",
      dataIndex: "",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Хаанаас",
      dataIndex: "",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Төхөөрөмж",
      dataIndex: "",
      ellipsis: true,
      align: "center",
    },
    {
      title: "IP",
      dataIndex: "",
      ellipsis: true,
      align: "center",
    },
  ]);

  return (
    <>
      <div className="col-span-12 mt-5 ">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Нэвтрэлтийн түүх
            </h2>
            <DatePicker.RangePicker
              className="w-full md:w-auto"
              locale={locale}
              value={ognoo}
              onChange={setOgnoo}
            />
          </div>
          <div className="box p-5">
            <Table bordered size="small" scroll={{ y: "calc( 100vh - 12rem )" }} columns={columns} />
          </div>
        </div>
      </div>
    </>
  );
}

export default NevtreltiinTuukh;
