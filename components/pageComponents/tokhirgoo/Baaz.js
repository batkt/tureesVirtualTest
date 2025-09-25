import React, { useMemo, useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import uilchilgee from "services/uilchilgee";
import { Button, DatePicker, Table } from "antd";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";
import useJagsaalt from "hooks/useJagsaalt";
import formatNumber from "tools/function/formatNumber";
import { t } from "i18next";

function Baaz({ token }) {
  const [loading, setLoading] = useState(false);
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  const backAwsanTuukh = useJagsaalt("/backTuukh");

  function backTatya() {
    setLoading(true);
    uilchilgee(token)
      .post("/backAvya", undefined, { responseType: "blob" })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
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
        (backAwsanTuukh?.khuudasniiDugaar || 0) *
          (backAwsanTuukh?.khuudasniiKhemjee || 0) -
        (backAwsanTuukh?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: t("Огноо"),
      dataIndex: "ognoo",
      ellipsis: true,
      align: "center",
      render(a) {
        return moment(a).format("YYYY-MM-DD, HH:mm");
      },
    },
    {
      title: t("Ажилтан"),
      dataIndex: "ajiltniiNer",
      ellipsis: true,
      align: "center",
    },
    {
      title: t("Хэмжээ"),
      dataIndex: "khemjee",
      ellipsis: true,
      align: "center",
      render(a) {
        return <div>{formatNumber(a)} /mb/</div>;
      },
    },
  ]);

  return (
    <>
      <div className="col-span-12 mt-5 lg:col-span-5 xl:col-span-4">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Мэдээллийн сан")}
            </h2>
          </div>
          <div className="box"></div>
          <div className="box">
            <div className="flex items-center p-5">
              <div className="border-l-2 border-green-500 pl-4">
                <div className="font-medium">{t("Системийн өгөгдөл")}</div>
                <div className="text-gray-600"></div>
              </div>
              <div className="ml-auto">
                <Button
                  loading={loading}
                  icon={<DownloadOutlined />}
                  onClick={backTatya}
                >
                  {t("Татах")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 mt-5 lg:col-span-7 xl:col-span-8">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Татсан түүх")}
            </h2>
            <DatePicker.RangePicker
              className="w-full md:w-auto"
              locale={locale}
              value={ognoo}
              onChange={setOgnoo}
            />
          </div>
          <div className="box p-5">
            <Table
              bordered
              size="small"
              dataSource={backAwsanTuukh?.jagsaalt}
              scroll={{ y: "calc( 100vh - 21rem )" }}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Baaz;
