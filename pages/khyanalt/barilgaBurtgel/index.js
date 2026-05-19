import React, { useState, useMemo, useEffect } from "react";
import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useAuth } from "services/auth";
import { Card, DatePicker, Select, Table, Badge, Typography, Tag } from "antd";
import { BankOutlined, RiseOutlined, FallOutlined, FilterOutlined, LockOutlined } from "@ant-design/icons";
import moment from "moment";
import useJagsaalt from "hooks/useJagsaalt";
import useAvlagaTovchoo from "hooks/tailan/useAvlagaTovchoo";
import formatNumber from "tools/function/formatNumber";
import { useTranslation } from "react-i18next";
import mnMN from "antd/lib/date-picker/locale/mn_MN";
import enUS from "antd/lib/date-picker/locale/en_US";
import Aos from "aos";
import useSWR from "swr";
import createMethod from "tools/function/crud/createMethod";
import { aldaaBarigch } from "services/uilchilgee";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function BarilgaBurtgel({ token }) {
  const { t, i18n } = useTranslation();
  const { baiguullaga, barilgiinId } = useAuth();
  
  const [ognoo, setOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  useEffect(() => {
    Aos.init({ once: true, duration: 800 });
  }, []);

  const ekhlekhOgnoo = ognoo?.[0] ? moment(ognoo[0]).startOf("day").format("YYYY-MM-DD 00:00:00") : undefined;
  const duusakhOgnoo = ognoo?.[1] ? moment(ognoo[1]).endOf("day").format("YYYY-MM-DD 23:59:59") : undefined;

  const orlogoQuery = useMemo(() => {
    const q = {
      baiguullagiinId: baiguullaga?._id,
      tuluv: { $ne: -1 },
      showTsutslagdsanAvlaga: true,
    };
    if (barilgiinId) q.barilgiinId = barilgiinId;
    return q;
  }, [baiguullaga, barilgiinId]);

  const { data: orlogoData, isValidating: orlogoLoading } = useJagsaalt(
    `/guitsetgelteiJagsaaltAvya/${ekhlekhOgnoo}/${duusakhOgnoo}`,
    orlogoQuery,
    undefined,
    undefined,
    [],
    null,
    100
  );

  const avlagaQuery = useMemo(() => {
    return {
      baiguullagiinId: baiguullaga?._id,
      barilgiinId: barilgiinId || undefined,
      ekhlekhOgnoo: ognoo?.[0] ? moment(ognoo[0]).startOf("day").toISOString() : undefined,
      duusakhOgnoo: ognoo?.[1] ? moment(ognoo[1]).endOf("day").toISOString() : undefined,
    };
  }, [baiguullaga, barilgiinId, ognoo]);

  const { avlagaTovchoo, unshijBaina: avlagaLoading } = useAvlagaTovchoo(
    token,
    avlagaQuery,
    [],
    100
  );

  const aldangiTuukhKharakhEsekh =
    baiguullaga?.tokhirgoo?.aldangiTuukhKharakhEsekh ||
    baiguullaga?._id === "6735c77a7fc60cd66deb2909" ||
    baiguullaga?._id === "6916c957511a8a4aebc1d65b";

  const avlagaDataSource = useMemo(() => {
    return (avlagaTovchoo?.jagsaalt || avlagaTovchoo || []).map((item) => {
      const aldangiBalance = Number(item.aldangiinUldegdel) || 0;
      const baritsaaBalance = Math.max(0, (Number(item.baritsaaAvakhDun) || 0) - (Number(item.baritsaaniiUldegdel) || 0));

      const adjustedEkhniiUldegdel = aldangiTuukhKharakhEsekh
        ? (Number(item.ekhniiUldegdel || 0) + aldangiBalance)
        : (Number(item.ekhniiUldegdel || 0) + baritsaaBalance + aldangiBalance);

      const adjustedEtssiinUldegdel = aldangiTuukhKharakhEsekh
        ? (Number(item.etssiinUldegdel || 0) + aldangiBalance)
        : (Number(item.etssiinUldegdel || 0) + baritsaaBalance + aldangiBalance);

      return {
        ...item,
        adjustedEkhniiUldegdel,
        adjustedEtssiinUldegdel,
      };
    });
  }, [avlagaTovchoo, aldangiTuukhKharakhEsekh]);

  const khyanaltiinDun = useMemo(() => {
    let avlagaSum = 0;
    let aldangiSum = 0;
    let baritsaaSum = 0;
    let orlogoSum = 0;

    avlagaDataSource.forEach(item => {
      avlagaSum += parseFloat(item.adjustedEtssiinUldegdel) || 0;
      aldangiSum += parseFloat(item.aldangiinUldegdel) || 0;
      baritsaaSum += parseFloat(item.baritsaaniiUldegdel) || 0;
    });

    (orlogoData?.jagsaalt || []).forEach(item => {
      orlogoSum += parseFloat(item.tulsunDun) || 0;
    });

    return [
      {
        too: formatNumber(avlagaSum),
        icon: (
          <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-sm">
            <FallOutlined className="text-xl text-white" />
          </div>
        ),
        utga: "Авлага",
      },
      {
        too: formatNumber(aldangiSum),
        icon: (
          <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-600 p-3 shadow-sm">
            <RiseOutlined className="text-xl text-white" />
          </div>
        ),
        utga: "Алданги",
      },
      {
        too: formatNumber(baritsaaSum),
        icon: (
          <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-3 shadow-sm">
            <LockOutlined className="text-xl text-white" />
          </div>
        ),
        utga: "Барьцаа",
      },
      {
        too: formatNumber(orlogoSum),
        icon: (
          <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 shadow-sm">
            <BankOutlined className="text-xl text-white" />
          </div>
        ),
        utga: "Орлого",
      },
    ];
  }, [avlagaDataSource, orlogoData]);

  const orlogoColumns = [
    {
      title: t("РД"),
      dataIndex: "register",
      width: 100,
    },
    {
      title: t("Нэр"),
      dataIndex: "ner",
      ellipsis: true,
      render: (v, record) => record.ner || record.ovog || "-",
    },
    {
      title: t("Талбай"),
      dataIndex: "talbainDugaar",
      width: 100,
      render: (data) => {
        const list = Array.isArray(data) ? data : data != null ? [data] : [];
        return (
          <div className="flex flex-wrap gap-1">
            {list.map((a, i) => (
              <Tag color="blue" key={i} className="m-0 border-0 shadow-sm">
                {a}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: t("Төлсөн дүн"),
      dataIndex: "tulsunDun",
      align: "right",
      width: 120,
      render: (v) => <span className="font-semibold text-green-600">{formatNumber(v)}</span>,
    }
  ];

  const avlagaColumns = [
    {
      title: t("Нэр"),
      dataIndex: "ner",
      ellipsis: true,
    },
    {
      title: t("Талбай"),
      dataIndex: "talbainDugaar",
      width: 100,
      render: (data) => {
        const list = Array.isArray(data) ? data : data != null ? [data] : [];
        return (
          <div className="flex flex-wrap gap-1">
            {list.map((a, i) => (
              <Tag color="volcano" key={i} className="m-0 border-0 shadow-sm">
                {a}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: t("Эхний үлд"),
      dataIndex: "adjustedEkhniiUldegdel",
      align: "right",
      width: 110,
      render: (v) => formatNumber(v),
    },
    {
      title: t("Төлөх"),
      dataIndex: "tulukhDun",
      align: "right",
      width: 110,
      render: (v) => formatNumber(v),
    },
    {
      title: t("Төлсөн"),
      dataIndex: "tulsunDun",
      align: "right",
      width: 110,
      render: (v) => <span className="font-medium text-green-600">{formatNumber(v)}</span>,
    },
    {
      title: t("Эцсийн үлд"),
      dataIndex: "adjustedEtssiinUldegdel",
      align: "right",
      width: 120,
      render: (v) => <span className="font-bold text-red-500">{formatNumber(v)}</span>,
    }
  ];

  return (
    <Admin
      khuudasniiNer="barilgaBurtgel"
      title="Хяналтын цонх"
      className="p-2 md:px-4 bg-gray-50 dark:bg-gray-900 min-h-screen"
      tsonkhniiId={"61c2c6271c2830c4e6f90c85"}
    >
      <div className="col-span-12 flex flex-col xl:col-span-12 gap-6 w-full mx-auto" data-aos="fade-in">
        
        {/* Header & Filters */}
        
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            
            <div className="flex flex-wrap items-center gap-3">
              <RangePicker
                locale={i18n.language === "mn" ? mnMN : enUS}
                value={ognoo}
                onChange={setOgnoo}
                className="rounded-xl py-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
          {khyanaltiinDun.map((mur, index) => (
            <div 
              key={index} 
              className="group overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="transform transition-transform group-hover:scale-110">
                  {mur.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {mur.too}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t(mur.utga)}
              </div>
            </div>
          ))}
        </div>

        {/* Two Panel Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Orlogo Panel */}
          <Card 
            className="rounded-2xl border-0 shadow-md bg-white dark:bg-gray-800 overflow-hidden flex flex-col"
            bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <RiseOutlined className="text-xl text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white m-0">
                      {t("Орлого")}
                    </h3>
                    
                  </div>
                </div>
                <Badge 
                  count={orlogoData?.jagsaalt?.length || 0} 
                  showZero 
                  style={{ backgroundColor: '#10b981' }} 
                />
              </div>
            </div>
            
            <div className="flex-1 p-0">
              <Table
                size="middle"
                columns={orlogoColumns}
                dataSource={orlogoData?.jagsaalt || []}
                loading={orlogoLoading}
                rowKey="_id"
                pagination={{ pageSize: 50, showSizeChanger: false }}
                scroll={{ y: 'calc(85vh - 380px)', x: 'max-content' }}
                className="border-none"
              />
            </div>
          </Card>

          {/* Avlaga Panel */}
          <Card 
            className="rounded-2xl border-0 shadow-md bg-white dark:bg-gray-800 overflow-hidden flex flex-col"
            bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-rose-50 to-white dark:from-gray-800 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                    <FallOutlined className="text-xl text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white m-0">
                      {t("Авлага")}
                    </h3>
                  </div>
                </div>
                <Badge 
                  count={avlagaDataSource.length} 
                  showZero 
                  style={{ backgroundColor: '#f43f5e' }} 
                />
              </div>
            </div>
            
            <div className="flex-1 p-0">
              <Table
                size="middle"
                columns={avlagaColumns}
                dataSource={avlagaDataSource}
                loading={avlagaLoading}
                rowKey={(record) => record.gereeniiId || record._id || Math.random()}
                pagination={{ pageSize: 50, showSizeChanger: false }}
                scroll={{ y: 'calc(85vh - 380px)', x: 'max-content' }}
                className="border-none"
              />
            </div>
          </Card>

        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default BarilgaBurtgel;