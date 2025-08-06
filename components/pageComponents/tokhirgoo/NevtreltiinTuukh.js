import React, { useEffect, useMemo, useState } from "react";
import { DatePicker, Table, Tooltip } from "antd";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";
import useJagsaalt from "hooks/useJagsaalt";
import { useTranslation } from "react-i18next";

const order = { createdAt: -1 };

function NevtreltiinTuukh({ token, baiguullaga, ajiltan }) {
  const { t } = useTranslation();
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
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

  const data = useJagsaalt("/nevtreltiinTuukh", query, order);

  useEffect(() => {
    data.setKhuudaslalt((e) => ({ ...e, khuudasniiKhemjee: 10 }));
  }, []);

  const columns = useMemo(() => [
    {
      title: "№",
      width: "3rem",
      align: "center",
      render: (text, record, index) =>
        (data?.data?.khuudasniiDugaar || 0) *
          (data?.data?.khuudasniiKhemjee || 0) -
        (data?.data?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: t("Огноо"),
      dataIndex: "ognoo",
      width: "9rem",
      ellipsis: true,
      align: "center",
      render(a) {
        return moment(a).format("YYYY-MM-DD, HH:mm");
      },
    },
    {
      title: t("Веб хөтөч"),
      dataIndex: "browser",
      ellipsis: true,
      width: "8rem",
      align: "center",
    },
    {
      title: t("Ажилтны нэр"),
      dataIndex: "ajiltniiNer",
      ellipsis: true,
      width: "7rem",
      align: "center",
    },
    {
      title: t("Байршил"),
      dataIndex: "bairshilKhot",
      width: "10rem",
      ellipsis: true,
      align: "center",
      render(a, b) {
        return (
          <Tooltip
            title={
              <div className="flex text-center">
                {b.bairshilKhot}
                {!!b.bairshilKhot && !!b.bairshilUls && <p>,</p>}{" "}
                {b.bairshilUls}
              </div>
            }
          >
            <div className="flex justify-center gap-1 text-center">
              {b.bairshilKhot}
              {!!b.bairshilKhot && !!b.bairshilUls && <p>,</p>} {b.bairshilUls}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: t("Төхөөрөмж"),
      width: "8rem",
      dataIndex: "uildliinSystem",
      ellipsis: true,
      align: "center",
    },
    {
      title: "IP",
      width: "7rem",
      dataIndex: "ip",
      ellipsis: true,
      align: "center",
    },
  ]);
  return (
    <>
      <div className="col-span-12 mt-5 ">
        <div className="intro-y box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Нэвтрэлтийн түүх")}
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
              dataSource={data?.jagsaalt}
              scroll={{ y: "calc( 100vh - 21rem )" }}
              columns={columns}
              pagination={{
                current: data?.data?.khuudasniiDugaar,
                pageSize: data?.data?.khuudasniiKhemjee,
                total: data?.data?.niitMur,
                showSizeChanger: true,
                onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                  data.setKhuudaslalt((kh) => ({
                    ...kh,
                    khuudasniiDugaar,
                    khuudasniiKhemjee,
                  })),
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default NevtreltiinTuukh;
