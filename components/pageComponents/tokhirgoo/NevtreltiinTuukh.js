import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, Table } from "antd";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";
import useJagsaalt from "hooks/useJagsaalt";

const order = { createdAt: -1 };

function NevtreltiinTuukh({ token, baiguullaga, ajiltan, }) {
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ])
  const query = useMemo(() => {
    return {
      ajiltniiId: ajiltan._id,
      baiguullagiinId: baiguullaga._id,
      createdAt: ognoo
        ? {
          $gte: moment(ognoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ognoo[1]).format("YYYY-MM-DD 23:59:59"),
        }
        : undefined,
    };
  }, [ognoo, baiguullaga._id, ajiltan._id]);

  const data = useJagsaalt("/nevtreltiinTuukh", query, order)

  useEffect(() => {
    data.setKhuudaslalt((e) => ({ ...e, khuudasniiKhemjee: 10 }))
  }, [])

  const columns = useMemo(() => [
    {
      title: "№",
      width: "3rem",
      align: "center",
      render: (text, record, index) =>
        (data?.khuudasniiDugaar || 0) * (data?.khuudasniiKhemjee || 0) -
        (data?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: "Огноо",
      dataIndex: "ognoo",
      ellipsis: true,
      align: "center",
      render(a) { return moment(a).format("YYYY-MM-DD, HH:mm") }
    },
    {
      title: "Веб хөтөч",
      dataIndex: "browser",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Ажилтны нэр",
      dataIndex: "ajiltniiNer",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Төхөөрөмж",
      dataIndex: "uildliinSystem",
      ellipsis: true,
      align: "center",
    },
    {
      title: "IP",
      dataIndex: "ip",
      ellipsis: true,
      align: "center",
      render() { return "..." }
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
            <Table bordered size="small" dataSource={data?.jagsaalt} scroll={{ y: "calc( 100vh - 12rem )" }} columns={columns}
              pagination={{
                current: data?.khuudasniiDugaar,
                pageSize: data?.khuudasniiKhemjee,
                total: data?.niitMur,
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  data.setKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default NevtreltiinTuukh;
