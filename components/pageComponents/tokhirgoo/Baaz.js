import React, { useMemo, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import uilchilgee from "services/uilchilgee";
import { Button, DatePicker, Table } from "antd";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";

function Baaz({ token }) {
  const [loading, setLoading] = useState(false);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  function backTatya() {
    setLoading(true);
    uilchilgee(token)
      .post("/backAvya", undefined, { responseType: "blob" })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // the filename you want
        a.download = `backup.rar`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .finally(() => setLoading(false));
  }

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
      title: "Ажилтан",
      dataIndex: "",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Хэмжээ",
      dataIndex: "",
      ellipsis: true,
      align: "center",
    },
  ]);

  return (
    <>
      <div className="xl:col-span-4 col-span-12 mt-5 lg:col-span-5">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Мэдээллийн сан
            </h2>
          </div>
          <div className="box"></div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">Системийн өгөгдөл</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Button
                  loading={loading}
                  icon={<DownloadOutlined />}
                  onClick={backTatya}
                >
                  Татах
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:col-span-8 col-span-12 mt-5 lg:col-span-7">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Татсан түүх
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

export default Baaz;
