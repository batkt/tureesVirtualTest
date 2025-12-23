import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useMemo, useEffect, useState } from "react";
import { aldaaBarigch, url } from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Button, Popover, Calendar, Select, DatePicker } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  PieChartFilled,
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import _ from "lodash";
import router from "next/router";
import CardList from "components/cardList";
import BarilgaTile from "components/pageComponents/barilga/BarilgaTile";
import Aos from "aos";
import useSWR from "swr";
import createMethod from "tools/function/crud/createMethod";
import moment from "moment";
import React from "react";
import { Pie, Doughnut, Line } from "react-chartjs-2";
import useAvlagiinChartSalbaraar from "hooks/tailan/useAvlagiinChartSalbaraar";
import useOrlogiinChartSalbaraarAvya from "hooks/tailan/useOrlogiinChartSalbaraarAvya";
import useLineChart from "hooks/tailan/useLineChart";
import locale from "antd/lib/date-picker/locale/mn_MN";
import formatNumber from "tools/function/formatNumber";
import local from "antd/lib/date-picker/locale/mn_MN";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
function BarilgaBurtgel({ token }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { baiguullaga, barilgiinId } = useAuth();
  const [ognoo, setOgnoo] = useState(new Date());
  const [nariivchlal, setNariivchlal] = useState("day");
  const isDark = theme === "dark";

  const [lineOgnoo, setLineOgnoo] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);

  const barilgaToololt = useSWR(
    !!token ? ["khyanakhSambariinUgugdul", token, lineOgnoo] : null,
    (url, token, lineOgnoo) =>
      createMethod(url, token, {
        ekhlekhOgnoo: lineOgnoo[0].startOf().format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: lineOgnoo[1].endOf().format("YYYY-MM-DD 23:59:59"),
      })
        .then(({ data }) => data)
        .catch(aldaaBarigch),
    { revalidateOnFocus: false }
  );

  const khyanaltiinDun = useMemo(() => {
    return [
      {
        too: baiguullaga?.barilguud?.length || 0,
        icon: (
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
        khuvi: 100,
        utga: "Нийт Барилга",
      },
      {
        too: formatNumber(barilgaToololt?.data?.tulsunDun),
        icon: (
          <svg
            className="h-8 w-8 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />{" "}
            <polyline points="17 6 23 6 23 12" />
          </svg>
        ),
        khuvi: 30,
        utga: "Түрээсийн орлого",
      },
      {
        too: formatNumber(barilgaToololt?.data?.dutuu),
        icon: (
          <svg
            className="h-8 w-8 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />{" "}
            <polyline points="17 18 23 18 23 12" />
          </svg>
        ),
        khuvi: 100,
        utga: "Төлбөр дутуу",
      },
      {
        too:
          0 ||
          barilgaToololt?.data?.khariu?.reduce((a, b) => a + b.too, 0) +
            "/" +
            0 ||
          barilgaToololt?.data?.khariu?.find((a) => a._id === true)?.too,
        icon: (
          <svg
            className="h-8 w-8 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
            <circle cx="9" cy="7" r="4" />{" "}
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />{" "}
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
        khuvi: (
          (100 * 0 ||
            barilgaToololt?.data?.khariu?.find((a) => a._id === true)?.too) /
            0 || barilgaToololt?.data?.khariu?.reduce((a, b) => a + b.too, 0)
        )?.toFixed(0),
        utga: "Түрээслэгч",
      },
    ];
  }, [barilgaToololt]);

  function barilgaBurtgel(id) {
    router.push(`/khyanalt/barilgaBurtgel/${id}`);
  }

  useEffect(() => {
    Aos.init({ once: true });
  });
  const query = useMemo(() => {
    return {
      nariivchlal,
      ekhlekhOgnoo: lineOgnoo && lineOgnoo[0].format("YYYY-MM-DD 00:00:00"),
      duusakhOgnoo: lineOgnoo && lineOgnoo[1].format("YYYY-MM-DD 23:59:59"),
    };
  }, [lineOgnoo, nariivchlal]);

  const lineChart = useLineChart(
    "orlogiinChartSalbarKhugatsaagaarAvya",
    token,
    query
  );
  const avlagiinChartSalbaraarAvya = useAvlagiinChartSalbaraar(
    "avlagiinChartSalbaraarAvya",
    token,
    query
  );

  const orlogiinChartSalbaraarAvya = useOrlogiinChartSalbaraarAvya(
    "orlogiinChartSalbaraarAvya",
    token,
    query
  );

  const avalgiinChartUngu =
    avlagiinChartSalbaraarAvya?.data?.backgroundColor?.map((a) => a) || [];

  const orolgiinChartUngu =
    orlogiinChartSalbaraarAvya?.data?.backgroundColor?.map((a) => a) || [];

  const avlaga = useMemo(() => {
    return {
      labels:
        avlagiinChartSalbaraarAvya?.data?.options.labels.map((a) => a) || [],
      datasets: [
        {
          data:
            avlagiinChartSalbaraarAvya?.data?.series.map((a) => Number(a)) ||
            [],
          backgroundColor: avalgiinChartUngu,
        },
      ],
      options: {
        legend: {
          display: false,
          position: "bottom",
          pointStyle: "circle",
        },
        tooltips: {
          callbacks: {
            label: function (tooltipitem, data) {
              var dataLabel = data.labels[tooltipitem.index];
              var value =
                ": " +
                data.datasets[tooltipitem.datasetIndex].data[
                  tooltipitem.index
                ].toLocaleString();
              if (Array.isArray(dataLabel)) {
                dataLabel = dataLabel.slice();
                dataLabel[0] += value;
              } else {
                dataLabel += value;
              }
              return dataLabel;
            },
          },
        },
      },
    };
  }, [avlagiinChartSalbaraarAvya]);

  const orlogo = useMemo(() => {
    return {
      labels:
        orlogiinChartSalbaraarAvya?.data?.options.labels.map((a) => a) || [],
      datasets: [
        {
          data:
            orlogiinChartSalbaraarAvya?.data?.series.map((a) => Number(a)) ||
            [],
          backgroundColor: orolgiinChartUngu,
        },
      ],
      options: {
        legend: {
          display: false,
          position: "bottom",
          pointStyle: "circle",
        },
        tooltips: {
          callbacks: {
            label: function (tooltipitem, data) {
              var dataLabel = data.labels[tooltipitem.index];
              var value =
                ": " +
                data.datasets[tooltipitem.datasetIndex].data[
                  tooltipitem.index
                ].toLocaleString();

              if (Array.isArray(dataLabel)) {
                dataLabel = dataLabel.slice();
                dataLabel[0] += value;
              } else {
                dataLabel += value;
              }
              return dataLabel;
            },
          },
        },
      },
    };
  }, [orlogiinChartSalbaraarAvya]);

  return (
    <Admin
      khuudasniiNer="barilgaBurtgel"
      title="Хяналтын цонх"
      className="p-2 md:px-4"
      tsonkhniiId={"61c2c6271c2830c4e6f90c85"}
    >
      <div
        className="col-span-12 flex flex-col xl:col-span-9"
        style={{ height: "calc(100vh - 6rem)", overflow: "hidden" }}
      >
        <div className="col-span-12 flex flex-1 flex-col space-y-2 overflow-hidden px-2 md:px-0">
          <div className="mt-2 grid flex-shrink-0 grid-cols-12 gap-3">
            {khyanaltiinDun.map((mur, index) => {
              return (
                <div
                  key={"index" + index}
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                  data-aos-delay={1 + index + "00"}
                  className="col-span-12 sm:col-span-6 xl:col-span-3"
                >
                  <div className="report-box zoom-in">
                    <div className="box rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <div className="flex items-center dark:text-gray-100">
                        {mur.icon}
                        <div className="ml-auto">
                          <div
                            className={`report-box__indicator ${
                              mur.khuvi > 0 ? "bg-theme-9" : "bg-theme-6"
                            } tooltip cursor-pointer `}
                          >
                            {" "}
                            {mur.khuvi}%{" "}
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
                              className="feather feather-chevron-up ml-0.5 h-4 w-4"
                            >
                              <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>{" "}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-2xl font-bold leading-8 dark:text-gray-200 sm:text-xl">
                        {mur.too}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {t(mur.utga)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className=" col-span-12 hidden md:block">
              <CardList
                keyValue="barilga"
                className="block overflow-auto md:hidden"
                jagsaalt={baiguullaga?.barilguud}
                Component={BarilgaTile}
                pagination={{ pageSize: 100 }}
              />
            </div>
          </div>
          <div className="mb-3 flex flex-shrink-0 gap-2">
            <div className="">
              <DatePicker.RangePicker
                locale={local}
                value={lineOgnoo}
                onChange={setLineOgnoo}
              />
            </div>
            <div className="w-full lg:w-[200px]">
              <Select
                placeholder="График төрөл сонгох"
                value={nariivchlal}
                onChange={setNariivchlal}
              >
                {[
                  { val: "day", lab: "Өдөр" },
                  { val: "month", lab: "Сар" },
                  { val: "year", lab: "Жил" },
                ].map((a) => (
                  <Select.Option key={a.val} value={a.val}>
                    {t(a.lab)}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div
            className="grid min-h-0 flex-1 grid-cols-12 gap-4"
            style={{ height: "100%" }}
          >
            <div className="col-span-12 flex min-h-0 flex-col md:col-span-6">
              <div className="mb-3 flex flex-shrink-0 items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t("Орлогын тайлан салбараар")}
              </div>
              <div className="box flex min-h-0 flex-1 items-center justify-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div
                  className="chart-container h-full w-full"
                  style={{ minHeight: 0 }}
                >
                  <Line
                    data={lineChart.data || { labels: [], datasets: [] }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: "bottom",
                          labels: {
                            usePointStyle: true,
                            pointStyle: "circle",
                            padding: 20,
                            font: {
                              size: 13,
                              weight: "500",
                              family:
                                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            },
                            color: isDark ? "#e5e7eb" : "#1d1d1f",
                            boxWidth: 10,
                            boxHeight: 10,
                          },
                        },
                        tooltip: {
                          backgroundColor: isDark
                            ? "rgba(28, 28, 30, 0.95)"
                            : "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(20px) saturate(180%)",
                          padding: 16,
                          titleFont: {
                            size: 13,
                            weight: "600",
                            family:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          },
                          bodyFont: {
                            size: 12,
                            weight: "400",
                            family:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          },
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)",
                          borderWidth: 0.5,
                          cornerRadius: 12,
                          displayColors: true,
                          boxPadding: 6,
                          titleColor: isDark ? "#ffffff" : "#1d1d1f",
                          bodyColor: isDark ? "#ebebf5" : "#6e6e73",
                          titleSpacing: 6,
                          bodySpacing: 4,
                          boxWidth: 10,
                          boxHeight: 10,
                          callbacks: {
                            label: function (context) {
                              let label = context.dataset.label || "";
                              if (label) {
                                label += ": ";
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat().format(
                                  context.parsed.y
                                );
                              }
                              return label;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                          },
                          ticks: {
                            color: isDark ? "#8e8e93" : "#8e8e93",
                            font: {
                              size: 12,
                              weight: "400",
                              family:
                                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            },
                            padding: 8,
                          },
                          border: {
                            display: false,
                          },
                        },
                        y: {
                          grid: {
                            color: isDark
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.04)",
                            lineWidth: 1,
                            drawBorder: false,
                          },
                          ticks: {
                            color: isDark ? "#8e8e93" : "#8e8e93",
                            font: {
                              size: 12,
                              weight: "400",
                              family:
                                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            },
                            padding: 12,
                            callback: function (value) {
                              return new Intl.NumberFormat().format(value);
                            },
                          },
                          border: {
                            display: false,
                          },
                        },
                      },
                      animation: {
                        duration: 1200,
                        easing: "easeOutQuart",
                      },
                      elements: {
                        point: {
                          radius: 5,
                          hoverRadius: 8,
                          borderWidth: 3,
                          hoverBorderWidth: 4,
                          backgroundColor: isDark ? "#1d1d1f" : "#ffffff",
                        },
                        line: {
                          tension: 0.5,
                          borderWidth: 3.5,
                          borderCapStyle: "round",
                          borderJoinStyle: "round",
                          fill: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 flex min-h-0 flex-col md:col-span-3">
              <div className="mb-3 flex flex-shrink-0 items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t("Авлагын тайлан")}
              </div>
              <div className="box flex min-h-0 flex-1 flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div
                  className="flex min-h-0 flex-1 items-center justify-center"
                  style={{ minHeight: 0 }}
                >
                  <Pie
                    data={
                      avlaga?.datasets ? avlaga : { labels: [], datasets: [] }
                    }
                    options={{
                      ...(avlaga?.options || {}),
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: isDark
                            ? "rgba(28, 28, 30, 0.95)"
                            : "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(20px) saturate(180%)",
                          padding: 16,
                          titleFont: {
                            size: 13,
                            weight: "600",
                            family:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          },
                          bodyFont: {
                            size: 12,
                            weight: "400",
                            family:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          },
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)",
                          borderWidth: 0.5,
                          cornerRadius: 12,
                          displayColors: true,
                          boxPadding: 6,
                          titleColor: isDark ? "#ffffff" : "#1d1d1f",
                          bodyColor: isDark ? "#ebebf5" : "#6e6e73",
                          titleSpacing: 6,
                          bodySpacing: 4,
                          boxWidth: 10,
                          boxHeight: 10,
                          callbacks: {
                            label: function (context) {
                              const label = context.label || "";
                              const value = context.parsed || 0;
                              return label + ": " + formatNumber(value, 2);
                            },
                          },
                        },
                      },
                      animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1200,
                        easing: "easeOutQuart",
                      },
                      elements: {
                        arc: {
                          borderWidth: 0,
                          hoverBorderWidth: 0,
                          hoverOffset: 8,
                          borderRadius: 2,
                        },
                      },
                    }}
                  />
                </div>
                <div className="mt-4 flex h-auto flex-shrink-0 items-start justify-between border-t border-gray-200/60 pt-4 dark:border-gray-600/40">
                  <div className="flex-1 space-y-3">
                    {avlaga?.labels?.map((a, index) => (
                      <div className="flex items-center space-x-3" key={index}>
                        <div
                          className="h-3 w-3 flex-shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              avlaga?.datasets?.[0]?.backgroundColor?.[index],
                            boxShadow: `0 2px 4px ${avlaga?.datasets?.[0]?.backgroundColor?.[index]}40`,
                          }}
                        />
                        <span
                          className="text-sm font-medium dark:text-gray-200"
                          style={{ color: isDark ? "#ebebf5" : "#1d1d1f" }}
                        >
                          {a}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 text-right">
                    {avlaga?.datasets?.[0]?.data?.map((a, index) => (
                      <div
                        key={index}
                        className="flex justify-end text-sm font-semibold"
                        style={{
                          color:
                            avlaga?.datasets?.[0]?.backgroundColor?.[index],
                        }}
                      >
                        {formatNumber(a, 2)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 flex min-h-0 flex-col md:col-span-3">
              <div className="mb-3 flex flex-shrink-0 items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t("Орлогын тайлан")}
              </div>
              <div className="box flex min-h-0 flex-1 flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div
                  className="flex min-h-0 flex-1 items-center justify-center"
                  style={{ minHeight: 0 }}
                >
                  <Doughnut
                    data={
                      orlogo?.datasets ? orlogo : { labels: [], datasets: [] }
                    }
                    options={{
                      ...(orlogo?.options || {}),
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          backgroundColor: isDark
                            ? "rgba(28, 28, 30, 0.95)"
                            : "rgba(255, 255, 255, 0.95)",
                          backdropFilter: "blur(20px) saturate(180%)",
                          padding: 16,
                          titleFont: {
                            size: 13,
                            weight: "600",
                            family:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          },
                          bodyFont: {
                            size: 12,
                            weight: "400",
                            family:
                              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          },
                          borderColor: isDark
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(0, 0, 0, 0.05)",
                          borderWidth: 0.5,
                          cornerRadius: 12,
                          displayColors: true,
                          boxPadding: 6,
                          titleColor: isDark ? "#ffffff" : "#1d1d1f",
                          bodyColor: isDark ? "#ebebf5" : "#6e6e73",
                          titleSpacing: 6,
                          bodySpacing: 4,
                          boxWidth: 10,
                          boxHeight: 10,
                          callbacks: {
                            label: function (context) {
                              const label = context.label || "";
                              const value = context.parsed || 0;
                              return label + ": " + formatNumber(value, 2);
                            },
                          },
                        },
                      },
                      animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1200,
                        easing: "easeOutQuart",
                      },
                      elements: {
                        arc: {
                          borderWidth: 0,
                          hoverBorderWidth: 0,
                          hoverOffset: 8,
                          borderRadius: 2,
                        },
                      },
                      cutout: "70%",
                    }}
                  />
                </div>
                <div className="mt-3 flex h-auto flex-shrink-0 items-start justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                  <div className="flex-1 space-y-2">
                    {orlogo?.labels?.map((a, index) => (
                      <div className="flex items-center space-x-2" key={index}>
                        <PieChartFilled
                          style={{
                            color:
                              orlogo?.datasets?.[0]?.backgroundColor?.[index],
                            fontSize: "14px",
                          }}
                        />
                        <span className="text-sm dark:text-gray-200">{a}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 text-right">
                    {orlogo?.datasets?.[0]?.data?.map((a, index) => (
                      <div
                        key={index}
                        className="flex justify-end text-sm font-semibold"
                        style={{
                          color:
                            orlogo?.datasets?.[0]?.backgroundColor?.[index],
                        }}
                      >
                        {formatNumber(a, 2)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="col-span-12 space-y-2 p-2 md:p-5 xl:col-span-3"
        data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <div className="xxl:col-span-12 col-span-12 md:col-span-12 xl:col-span-4">
          <div className="glossy-calendar-container">
            <Calendar
              fullscreen={false}
              mode="month"
              locale={i18n.language === "mn" && locale}
              onChange={setOgnoo}
            />
          </div>
          <div className="glossy-summary-container p-4">
            <div className="flex w-full items-center justify-between space-x-3">
              <div className=" flex items-center space-x-2">
                <div className="flex items-center">
                  <CheckCircleFilled className="text-lg text-green-500 " />
                </div>
                <div>{t("Дууссан ажил")}</div>
              </div>
              <div>33</div>
            </div>
            <div className="flex w-full items-center justify-between space-x-3">
              <div className=" flex items-center space-x-2">
                <div className="flex items-center">
                  <ClockCircleFilled className="text-lg text-yellow-500 " />
                </div>
                <div>{t("Идэвхтэй ажил")}</div>
              </div>
              <div>18</div>
            </div>
            <div className="flex w-full items-center justify-between space-x-3">
              <div className=" flex items-center space-x-2">
                <div className="flex items-center">
                  <CloseCircleFilled className="text-lg text-red-500 " />
                </div>
                <div>{t("Цуцлагдсан")}</div>
              </div>
              <div>10</div>
            </div>
          </div>
        </div>
        <div
          className="overflow-y-scroll lg:h-[33vh] "
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          {baiguullaga?.barilguud.map((a) => (
            <div
              key={a._id}
              className="glossy-building-card my-2 grid grid-cols-12 space-x-3 md:p-5 md:py-2"
            >
              <div className="col-span-2 flex items-center justify-start">
                <img
                  className="h-10 w-10"
                  alt={baiguullaga?.ner}
                  src={
                    baiguullaga?.zurgiinNer
                      ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                      : "/favicon.ico"
                  }
                />
              </div>
              <div className="col-span-5 flex flex-col space-y-2">
                <div className="font-bold">{a.ner}</div>
                <div>{a.register}</div>
              </div>
              <div className="col-span-4  flex items-center justify-center ">
                {formatNumber(a?.niitTalbai)}м<sup> 2</sup>
              </div>

              <div className=" col-span-1 ml-auto flex items-center justify-end">
                <Popover
                  content={() => (
                    <div className="flex w-24 flex-col space-y-2">
                      <a
                        className="ant-dropdown-link flex items-center justify-between rounded-lg  p-2 hover:bg-green-100  dark:text-white dark:hover:bg-gray-700   "
                        onClick={() =>
                          barilgaBurtgel(
                            baiguullaga.barilguud.findIndex(
                              (mur) => mur._id === a._id
                            )
                          )
                        }
                      >
                        <EditOutlined className="text-xl text-green-400" />
                        <label className="hover:text-black">
                          {" "}
                          {t("Засах")}
                        </label>
                      </a>
                    </div>
                  )}
                  placement="bottom"
                  trigger="click"
                >
                  <a className="flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    <MoreOutlined style={{ fontSize: "18px" }} />
                  </a>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default BarilgaBurtgel;
