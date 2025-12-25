import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useMemo, useEffect, useState } from "react";
import { aldaaBarigch, url } from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Button, Popover, Calendar, Select, DatePicker, Card, Space, Tag, Switch, Empty, Badge } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  PieChartFilled,
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  BarChartOutlined,
  SwapOutlined,
  RiseOutlined,
  ReloadOutlined,
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
import { Pie, Doughnut, Line, Bar } from "react-chartjs-2";
import useAvlagiinChartSalbaraar from "hooks/tailan/useAvlagiinChartSalbaraar";
import useOrlogiinChartSalbaraarAvya from "hooks/tailan/useOrlogiinChartSalbaraarAvya";
import useLineChart from "hooks/tailan/useLineChart";
import locale from "antd/lib/date-picker/locale/mn_MN";
import formatNumber from "tools/function/formatNumber";
import local from "antd/lib/date-picker/locale/mn_MN";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function BarilgaBurtgel({ token }) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { baiguullaga, barilgiinId } = useAuth();
  const [ognoo, setOgnoo] = useState(new Date());
  const [nariivchlal, setNariivchlal] = useState("day");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedSalbars, setSelectedSalbars] = useState([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const isDark = theme === "dark";

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

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
          <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        ),
        khuvi: 100,
        utga: "Нийт Барилга",
        trend: "up",
        color: "blue",
      },
      {
        too: formatNumber(barilgaToololt?.data?.tulsunDun),
        icon: (
          <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </div>
        ),
        khuvi: 30,
        utga: "Түрээсийн орлого",
        trend: "up",
        color: "green",
      },
      {
        too: formatNumber(barilgaToololt?.data?.dutuu),
        icon: (
          <div className="rounded-lg bg-gradient-to-br from-red-500 to-rose-600 p-3 shadow-lg">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
          </div>
        ),
        khuvi: 100,
        utga: "Төлбөр дутуу",
        trend: "down",
        color: "red",
      },
      {
        too:
          (barilgaToololt?.data?.khariu?.find((a) => a._id === true)?.too || 0) +
          "/" +
          (barilgaToololt?.data?.khariu?.reduce((a, b) => a + b.too, 0) || 0),
        icon: (
          <div className="rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-3 shadow-lg">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        ),
        khuvi: (
          ((barilgaToololt?.data?.khariu?.find((a) => a._id === true)?.too || 0) /
            (barilgaToololt?.data?.khariu?.reduce((a, b) => a + b.too, 0) || 1)) *
          100
        )?.toFixed(0),
        utga: "Түрээслэгч",
        trend: "up",
        color: "purple",
      },
    ];
  }, [barilgaToololt, baiguullaga]);

  function barilgaBurtgel(id) {
    router.push(`/khyanalt/barilgaBurtgel/${id}`);
  }

  useEffect(() => {
    Aos.init({ 
      once: false,
      duration: 800,
      easing: 'ease-out-cubic',
      offset: 50
    });
  }, []);

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

  // Get available salbars for comparison
  const availableSalbars = useMemo(() => {
    const avlagaLabels = avlagiinChartSalbaraarAvya?.data?.options?.labels || [];
    const orlogoLabels = orlogiinChartSalbaraarAvya?.data?.options?.labels || [];
    const allLabels = [...new Set([...avlagaLabels, ...orlogoLabels])];
    return allLabels.map((label, index) => ({
      label,
      value: label,
      color: avalgiinChartUngu[index] || orolgiinChartUngu[index] || `hsl(${index * 60}, 70%, 50%)`,
    }));
  }, [avlagiinChartSalbaraarAvya, orlogiinChartSalbaraarAvya]);

  const avlaga = useMemo(() => {
    const labels = avlagiinChartSalbaraarAvya?.data?.options?.labels || [];
    const series = avlagiinChartSalbaraarAvya?.data?.series || [];
    
    // Filter for comparison mode
    let filteredLabels = labels;
    let filteredSeries = series;
    let filteredColors = avalgiinChartUngu;
    
    if (compareMode && selectedSalbars.length > 0) {
      const indices = selectedSalbars.map(salbar => labels.indexOf(salbar));
      filteredLabels = labels.filter((_, idx) => indices.includes(idx));
      filteredSeries = series.filter((_, idx) => indices.includes(idx));
      filteredColors = avalgiinChartUngu.filter((_, idx) => indices.includes(idx));
    }

    return {
      labels: filteredLabels,
      datasets: [
        {
          data: filteredSeries.map((a) => Number(a)),
          backgroundColor: filteredColors,
          borderWidth: 0,
        },
      ],
      options: {
        legend: {
          display: false,
          position: "bottom",
          pointStyle: "circle",
        },
      },
    };
  }, [avlagiinChartSalbaraarAvya, compareMode, selectedSalbars]);

  const orlogo = useMemo(() => {
    const labels = orlogiinChartSalbaraarAvya?.data?.options?.labels || [];
    const series = orlogiinChartSalbaraarAvya?.data?.series || [];
    
    // Filter for comparison mode
    let filteredLabels = labels;
    let filteredSeries = series;
    let filteredColors = orolgiinChartUngu;
    
    if (compareMode && selectedSalbars.length > 0) {
      const indices = selectedSalbars.map(salbar => labels.indexOf(salbar));
      filteredLabels = labels.filter((_, idx) => indices.includes(idx));
      filteredSeries = series.filter((_, idx) => indices.includes(idx));
      filteredColors = orolgiinChartUngu.filter((_, idx) => indices.includes(idx));
    }

    return {
      labels: filteredLabels,
      datasets: [
        {
          data: filteredSeries.map((a) => Number(a)),
          backgroundColor: filteredColors,
          borderWidth: 0,
        },
      ],
      options: {
        legend: {
          display: false,
          position: "bottom",
          pointStyle: "circle",
        },
      },
    };
  }, [orlogiinChartSalbaraarAvya, compareMode, selectedSalbars]);

  // Comparison chart data for line chart
  const comparisonLineChart = useMemo(() => {
    if (!compareMode || !lineChart.data || selectedSalbars.length === 0) {
      return lineChart.data;
    }

    const originalData = lineChart.data;
    if (!originalData?.datasets) return originalData;

    // Filter datasets based on selected salbars
    const filteredDatasets = originalData.datasets.filter((dataset, index) => {
      const datasetLabel = dataset.label || `Dataset ${index}`;
      return selectedSalbars.some(salbar => datasetLabel.includes(salbar));
    });

    return {
      ...originalData,
      datasets: filteredDatasets,
    };
  }, [lineChart.data, compareMode, selectedSalbars]);

  const chartOptions = {
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
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          color: isDark ? "#e5e7eb" : "#1d1d1f",
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(17, 24, 39, 0.98)"
          : "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px) saturate(180%)",
        padding: 16,
        titleFont: {
          size: 13,
          weight: "600",
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        bodyFont: {
          size: 12,
          weight: "400",
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        borderColor: isDark
          ? "rgba(255, 255, 255, 0.15)"
          : "rgba(0, 0, 0, 0.08)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        boxPadding: 6,
        titleColor: isDark ? "#ffffff" : "#1d1d1f",
        bodyColor: isDark ? "#d1d5db" : "#6e6e73",
        titleSpacing: 6,
        bodySpacing: 4,
        boxWidth: 10,
        boxHeight: 10,
      },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
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
        hoverBorderWidth: 2,
        hoverBorderColor: isDark ? "#ffffff" : "#000000",
        hoverOffset: 8,
        borderRadius: 4,
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
  };

  const lineChartOptions = useMemo(() => ({
    ...chartOptions,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
          font: {
            size: windowWidth < 640 ? 10 : 12,
            weight: "400",
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          padding: windowWidth < 640 ? 4 : 8,
          maxRotation: windowWidth < 640 ? 45 : 0,
          minRotation: 0,
        },
      },
      y: {
        grid: {
          color: isDark
            ? "rgba(255, 255, 255, 0.06)"
            : "rgba(0, 0, 0, 0.04)",
          lineWidth: 1,
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
          font: {
            size: windowWidth < 640 ? 10 : 12,
            weight: "400",
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          padding: windowWidth < 640 ? 8 : 12,
          callback: function (value) {
            const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
            if (isMobile && value > 1000000) {
              return (value / 1000000).toFixed(1) + "M";
            }
            return new Intl.NumberFormat().format(value);
          },
        },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
    elements: {
      point: {
        radius: windowWidth < 640 ? 3 : 5,
        hoverRadius: windowWidth < 640 ? 6 : 8,
        borderWidth: windowWidth < 640 ? 2 : 3,
        hoverBorderWidth: windowWidth < 640 ? 3 : 4,
        backgroundColor: isDark ? "#111827" : "#ffffff",
      },
      line: {
        tension: 0.4,
        borderWidth: windowWidth < 640 ? 2 : 3,
        borderCapStyle: "round",
        borderJoinStyle: "round",
        fill: true,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        labels: {
          ...chartOptions.plugins.legend.labels,
          font: {
            ...chartOptions.plugins.legend.labels.font,
            size: windowWidth < 640 ? 11 : 13,
          },
          padding: windowWidth < 640 ? 12 : 20,
          boxWidth: windowWidth < 640 ? 8 : 10,
          boxHeight: windowWidth < 640 ? 8 : 10,
        },
      },
      tooltip: {
        ...chartOptions.plugins.tooltip,
        titleFont: {
          ...chartOptions.plugins.tooltip.titleFont,
          size: windowWidth < 640 ? 11 : 13,
        },
        bodyFont: {
          ...chartOptions.plugins.tooltip.bodyFont,
          size: windowWidth < 640 ? 10 : 12,
        },
        padding: windowWidth < 640 ? 12 : 16,
      },
    },
  }), [chartOptions, isDark, windowWidth]);

  return (
    <Admin
      khuudasniiNer="barilgaBurtgel"
      title="Хяналтын цонх"
      className="p-2 md:px-4"
      tsonkhniiId={"61c2c6271c2830c4e6f90c85"}
    >
      <div 
        className="col-span-12 flex flex-col xl:col-span-9"
        data-aos="fade-in"
        data-aos-duration="600"
        data-aos-easing="ease-out-cubic"
      >
        <div className="col-span-12 flex flex-1 flex-col space-y-4 px-2 md:px-0">
          {/* Modern Stats Cards */}
          <div className="mt-2 grid flex-shrink-0 grid-cols-12 gap-4">
            {khyanaltiinDun.map((mur, index) => {
              return (
                <div
                  key={"index" + index}
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                  data-aos-delay={1 + index + "00"}
                  className="col-span-12 sm:col-span-6 xl:col-span-3"
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:border dark:border-gray-700/50 dark:bg-gradient-to-br dark:from-gray-800/95 dark:to-gray-900/95 dark:shadow-xl dark:hover:border-gray-600/50 dark:hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-gray-800/50"></div>
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="transform transition-transform duration-300 group-hover:scale-110">
                          {mur.icon}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            count={mur.khuvi}
                            showZero
                            overflowCount={999}
                            style={{
                              backgroundColor: mur.color === "green" ? (isDark ? "#10b981" : "#10b981") : 
                                             mur.color === "red" ? (isDark ? "#ef4444" : "#ef4444") : 
                                             mur.color === "blue" ? (isDark ? "#3b82f6" : "#3b82f6") : (isDark ? "#8b5cf6" : "#8b5cf6"),
                              boxShadow: isDark ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "none",
                            }}
                          />
                        </div>
                      </div>
                      <div className="mb-2 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                        {mur.too}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t(mur.utga)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls Section */}
          <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200/50 bg-gradient-to-r from-gray-50 to-white p-4 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:from-gray-800/95 dark:to-gray-900/95 dark:shadow-xl">
            <div className="flex flex-wrap items-center gap-3">
              <DatePicker.RangePicker
                locale={local}
                value={lineOgnoo}
                onChange={setLineOgnoo}
                className="rounded-lg dark:border-gray-600"
              />
              <Select
                placeholder="График төрөл сонгох"
                value={nariivchlal}
                onChange={setNariivchlal}
                className="w-full lg:w-[200px]"
                style={{ borderRadius: "0.5rem" }}
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

            {/* Comparison Mode Toggle */}
            <div className="flex items-center gap-3">
              <Space>
                <SwapOutlined className="text-lg text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t("Салбар хооронд харьцуулах")}
                </span>
                <Switch
                  checked={compareMode}
                  onChange={setCompareMode}
                  checkedChildren="ON"
                  unCheckedChildren="OFF"
                />
              </Space>
            </div>
          </div>

         
          {compareMode && (
            <div className="flex-shrink-0 rounded-xl border border-blue-200/50 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm backdrop-blur-sm dark:border-blue-900/50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:shadow-xl">
              <div className="mb-2 flex items-center gap-2">
                <BarChartOutlined className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  {t("Салбар сонгох")} ({selectedSalbars.length}/{availableSalbars.length})
                </span>
              </div>
              <Select
                mode="multiple"
                placeholder={t("Харьцуулах салбаруудыг сонгоно уу")}
                value={selectedSalbars}
                onChange={setSelectedSalbars}
                className="w-full"
                maxTagCount="responsive"
                style={{ borderRadius: "0.5rem" }}
              >
                {availableSalbars.map((salbar) => (
                  <Select.Option key={salbar.value} value={salbar.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800"
                        style={{ backgroundColor: salbar.color }}
                      />
                      {salbar.label}
                    </div>
                  </Select.Option>
                ))}
              </Select>
              {selectedSalbars.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSalbars.map((salbar) => {
                    const salbarData = availableSalbars.find((s) => s.value === salbar);
                    return (
                      <Tag
                        key={salbar}
                        
                        style={{
                          backgroundColor: salbarData?.color || "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "0.5rem",
                          padding: "0.25rem 0.75rem",
                          boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                      >
                        {salbar}
                      </Tag>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        
          <div
            className="grid min-h-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
            style={{ height: "100%" }}
          >
            {/* Line Chart */}
            <div className="flex min-h-0 flex-col sm:col-span-2 lg:col-span-6">
              <Card
                className="rounded-2xl border-0 bg-white shadow-lg backdrop-blur-sm dark:border dark:border-gray-700/50 dark:bg-gradient-to-br dark:from-gray-800/95 dark:to-gray-900/95 dark:shadow-xl"
                bodyStyle={{ padding: "1rem" }}
              >
                <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <RiseOutlined className="text-lg text-green-600 dark:text-green-400 sm:text-xl" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-white sm:text-base">
                      {t("Орлогын тайлан салбараар")}
                    </span>
                  </div>
                  {compareMode && selectedSalbars.length > 0 && (
                    <Tag color="blue" className="dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/30 w-fit">
                      {selectedSalbars.length} {t("Салбар")}
                    </Tag>
                  )}
                </div>
                <div
                  className="chart-container relative flex items-center justify-center"
                  style={{ height: "250px", width: "100%", flexShrink: 0 }}
                >
                  {comparisonLineChart?.datasets?.length > 0 ? (
                    <div className="h-full w-full">
                      <Line
                        data={comparisonLineChart || { labels: [], datasets: [] }}
                        options={{
                          ...lineChartOptions,
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  ) : (
                    <Empty description={t("Өгөгдөл байхгүй")} className="dark:text-gray-400" />
                  )}
                </div>
              </Card>
            </div>

      
            <div className="flex min-h-0 flex-col sm:col-span-1 lg:col-span-3">
              <Card
                className="rounded-2xl border-0 bg-white shadow-lg backdrop-blur-sm dark:border dark:border-gray-700/50 dark:bg-gradient-to-br dark:from-gray-800/95 dark:to-gray-900/95 dark:shadow-xl"
                bodyStyle={{ padding: "1rem" }}
              >
                <div className="mb-3 flex items-center gap-2 sm:mb-4">
                  <PieChartFilled className="text-lg text-purple-600 dark:text-purple-400 sm:text-xl" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-white sm:text-base">
                    {t("Авлагын тайлан")}
                  </span>
                </div>
                <div
                  className="flex items-center justify-center"
                  style={{ height: "250px", width: "100%", flexShrink: 0 }}
                >
                  {avlaga?.datasets?.[0]?.data?.length > 0 ? (
                    <div style={{ height: "250px", width: "250px", maxWidth: "100%", flexShrink: 0 }}>
                      <Pie 
                        data={avlaga} 
                        options={{
                          ...pieChartOptions,
                          responsive: true,
                          maintainAspectRatio: true,
                        }} 
                      />
                    </div>
                  ) : (
                    <Empty description={t("Өгөгдөл байхгүй")} className="dark:text-gray-400" />
                  )}
                </div>
                <div className="mt-3 flex h-auto flex-shrink-0 flex-col space-y-2 border-t border-gray-200/60 pt-3 dark:border-gray-700/50 sm:mt-4">
                  {avlaga?.labels?.map((a, index) => (
                    <div className="flex items-center justify-between gap-2" key={index}>
                      <div className="flex min-w-0 flex-1 items-center space-x-2 sm:space-x-3">
                        <div
                          className="h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800 sm:h-3 sm:w-3"
                          style={{
                            backgroundColor: avlaga?.datasets?.[0]?.backgroundColor?.[index],
                          }}
                        />
                        <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-200 sm:text-sm">
                          {a}
                        </span>
                      </div>
                      <span
                        className="flex-shrink-0 text-xs font-semibold sm:text-sm"
                        style={{
                          color: avlaga?.datasets?.[0]?.backgroundColor?.[index],
                        }}
                      >
                        {formatNumber(avlaga?.datasets?.[0]?.data?.[index], 2)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

       
            <div className="flex min-h-0 flex-col sm:col-span-1 lg:col-span-3">
              <Card
                className="rounded-2xl border-0 bg-white shadow-lg backdrop-blur-sm dark:border dark:border-gray-700/50 dark:bg-gradient-to-br dark:from-gray-800/95 dark:to-gray-900/95 dark:shadow-xl"
                bodyStyle={{ padding: "1rem" }}
              >
                <div className="mb-3 flex items-center gap-2 sm:mb-4">
                  <PieChartFilled className="text-lg text-emerald-600 dark:text-emerald-400 sm:text-xl" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-white sm:text-base">
                    {t("Орлогын тайлан")}
                  </span>
                </div>
                <div
                  className="flex items-center justify-center"
                  style={{ height: "250px", width: "100%", flexShrink: 0 }}
                >
                  {orlogo?.datasets?.[0]?.data?.length > 0 ? (
                    <div style={{ height: "250px", width: "250px", maxWidth: "100%", flexShrink: 0 }}>
                      <Doughnut
                        data={orlogo}
                        options={{
                          ...pieChartOptions,
                          responsive: true,
                          maintainAspectRatio: true,
                          cutout: "70%",
                        }}
                      />
                    </div>
                  ) : (
                    <Empty description={t("Өгөгдөл байхгүй")} className="dark:text-gray-400" />
                  )}
                </div>
                <div className="mt-3 flex h-auto flex-shrink-0 flex-col space-y-2 border-t border-gray-200/60 pt-3 dark:border-gray-700/50">
                  {orlogo?.labels?.map((a, index) => (
                    <div className="flex items-center justify-between gap-2" key={index}>
                      <div className="flex min-w-0 flex-1 items-center space-x-2">
                        <div
                          className="h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800 sm:h-3 sm:w-3"
                          style={{
                            backgroundColor: orlogo?.datasets?.[0]?.backgroundColor?.[index],
                          }}
                        />
                        <span className="truncate text-xs text-gray-700 dark:text-gray-200 sm:text-sm">{a}</span>
                      </div>
                      <span
                        className="flex-shrink-0 text-xs font-semibold sm:text-sm"
                        style={{
                          color: orlogo?.datasets?.[0]?.backgroundColor?.[index],
                        }}
                      >
                        {formatNumber(orlogo?.datasets?.[0]?.data?.[index], 2)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
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
          <Card className="rounded-2xl border-0 bg-white shadow-lg backdrop-blur-sm dark:border dark:border-gray-700/50 dark:bg-gradient-to-br dark:from-gray-800/95 dark:to-gray-900/95 dark:shadow-xl">
            <Calendar
              fullscreen={false}
              mode="month"
              locale={i18n.language === "mn" && locale}
              onChange={setOgnoo}
              className="rounded-xl"
            />
            <div className="border-t border-gray-200/50 dark:border-gray-700/50 space-y-4"></div>
              
              <div className="flex items-center justify-between rounded-lg border border-gray-200/50 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80">
                <div className="flex items-center space-x-2">
                  <CheckCircleFilled className="text-lg text-green-500 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t("Дууссан ажил")}
                  </span>
                </div>
                <Badge count={33} showZero style={{ backgroundColor: "#10b981", boxShadow: isDark ? "0 2px 8px rgba(16, 185, 129, 0.3)" : "none" }} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200/50 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80">
                <div className="flex items-center space-x-2">
                  <ClockCircleFilled className="text-lg text-yellow-500 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t("Идэвхтэй ажил")}
                  </span>
                </div>
                <Badge count={18} showZero style={{ backgroundColor: "#eab308", boxShadow: isDark ? "0 2px 8px rgba(234, 179, 8, 0.3)" : "none" }} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200/50 bg-white/80 p-3 shadow-sm backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80">
                <div className="flex items-center space-x-2">
                  <CloseCircleFilled className="text-lg text-red-500 dark:text-red-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t("Цуцлагдсан")}
                  </span>
                </div>
                <Badge count={10} showZero style={{ backgroundColor: "#ef4444", boxShadow: isDark ? "0 2px 8px rgba(239, 68, 68, 0.3)" : "none" }} />
              </div>
          
          </Card>

          
           
           
        </div>

        <div
          className="overflow-y-auto lg:max-h-[33vh]"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          {baiguullaga?.barilguud?.map((a) => (
            <Card
              key={a._id}
              className="mb-3 rounded-xl border border-gray-200/50 bg-white shadow-md backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700/50 dark:bg-gradient-to-br dark:from-gray-800/95 dark:to-gray-900/95 dark:shadow-xl dark:hover:border-gray-600/50"
              bodyStyle={{ padding: "1rem" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-12 w-12 rounded-lg object-cover shadow-sm ring-2 ring-gray-100 dark:ring-gray-700"
                    alt={baiguullaga?.ner}
                    src={
                      baiguullaga?.zurgiinNer
                        ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                        : "/favicon.ico"
                    }
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {a.ner}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {a.register}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatNumber(a?.niitTalbai)}м<sup>2</sup>
                    </div>
                  </div>
                </div>

                <Popover
                  content={() => (
                    <div className="flex w-32 flex-col space-y-2">
                      <a
                        className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100 dark:text-white dark:hover:bg-gray-700"
                        onClick={() =>
                          barilgaBurtgel(
                            baiguullaga.barilguud.findIndex(
                              (mur) => mur._id === a._id
                            )
                          )
                        }
                      >
                        <EditOutlined className="text-xl text-green-400" />
                        <label className="hover:text-black dark:hover:text-white text-black">{t("Засах")}</label>
                      </a>
                    </div>
                  )}
                  placement="bottomRight"
                  trigger="click"
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                  />
                </Popover>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default BarilgaBurtgel;