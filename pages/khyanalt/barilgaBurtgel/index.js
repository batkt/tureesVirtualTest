import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useMemo, useEffect, useState } from "react";
import { aldaaBarigch, url } from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Button, Popover, Calendar, Select, DatePicker } from "antd";
import { PlusOutlined, MoreOutlined, EditOutlined } from "@ant-design/icons";
import _ from "lodash";
import router from "next/router";
import CardList from "components/cardList";
import BarilgaTile from "components/pageComponents/barilga/BarilgaTile";
import Aos from "aos";
import useSWR from "swr";
import createMethod from "tools/function/crud/createMethod";
import moment from "moment";
import React from "react";
import Chart from "chart.js";
import { Pie, Doughnut, Line } from "react-chartjs-2";
import useAvlagiinChartSalbaraar from "hooks/tailan/useAvlagiinChartSalbaraar";
import useOrlogiinChartSalbaraarAvya from "hooks/tailan/useOrlogiinChartSalbaraarAvya";
import useLineChart from "hooks/tailan/useLineChart";
import locale from "antd/lib/date-picker/locale/mn_MN";
import { GoPrimitiveDot } from "react-icons/go";
import formatNumber from "tools/function/formatNumber";
import local from "antd/lib/date-picker/locale/mn_MN";
import { useTranslation } from "react-i18next";
function BarilgaBurtgel({ token }) {
  const { t, i18n } = useTranslation()
  const { baiguullaga, barilgiinId } = useAuth();
  const [ognoo, setOgnoo] = useState(new Date());
  const [nariivchlal, setNariivchlal] = useState("day");

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
    avlagiinChartSalbaraarAvya?.data?.backgroundColor.map((a) => a);

  const orolgiinChartUngu =
    orlogiinChartSalbaraarAvya?.data?.backgroundColor.map((a) => a);

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
              if (Chart.helpers.isArray(dataLabel)) {
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

              if (Chart.helpers.isArray(dataLabel)) {
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
      <div className="col-span-12 xl:col-span-9">
        <div className="col-span-12 space-y-4 px-2 md:px-0 ">
          <div className="mt-5 grid grid-cols-12 gap-6">
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
                    <div className="box p-5">
                      <div className="flex dark:text-gray-100">
                        {mur.icon}
                        <div className="ml-auto">
                          <div
                            className={`report-box__indicator ${mur.khuvi > 0 ? "bg-theme-9" : "bg-theme-6"
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
                      <div className="mt-6 text-3xl font-bold leading-8 dark:text-gray-200">
                        {mur.too}
                      </div>
                      <div className="mt-1 text-base text-gray-600 dark:text-gray-200">
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
          <div className=" flex gap-2">
            <div className="">
              <DatePicker.RangePicker
                locale={local}
                value={lineOgnoo}
                onChange={setLineOgnoo}
              />
            </div>
            <div className=" ">
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
          <div className=" grid h-full grid-cols-12   md:space-x-6 ">
            <div className="col-span-12  space-y-2   md:col-span-6 ">
              <div className="  grid grid-cols-12 ">
                <div className="  col-span-6 flex items-center  text-xl text-gray-600  dark:text-gray-200  ">
                  {t("Орлогын тайлан салбараар")}
                </div>
              </div>
              <div className="box flex h-full items-center justify-start p-2 ">
                <div className="h-[80%] w-full ">
                  <Line
                    data={lineChart.data || []}
                    responsive={{
                      "height < 128": {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    animationEnabled={true}
                    maintainAspectRatio={true}
                    animations={{
                      tension: {
                        duration: 1000,
                        easing: "linear",
                        from: 1,
                        to: 0,
                        loop: true,
                      },
                    }}
                    title={{
                      display: false,
                      text: "Sales Charts",
                      fontColor: "black",
                    }}
                    legend={{
                      align: "end",
                      position: "bottom",
                    }}
                    options={{
                      tooltips: {
                        mode: "nearest",
                        intersect: false,
                        callbacks: {
                          label: function (tooltipitem, data) {
                            var dataLabel = data.labels[tooltipitem.index];
                            var value =
                              ": " +
                              data.datasets[tooltipitem.datasetIndex].data[
                                tooltipitem.index
                              ]
                                .toLocaleString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            if (Chart.helpers.isArray(dataLabel)) {
                              dataLabel = dataLabel.slice();
                              dataLabel[0] += value;
                            } else {
                              dataLabel += value;
                            }
                            return dataLabel;
                          },
                        },
                      }
                    }}
                    scales={{
                      xAxes: [
                        {
                          display: true,
                          scaleLabel: {
                            display: false,
                            labelString: "Month",
                            fontColor: "gray",
                          },
                          gridLines: {
                            display: false,
                            borderDash: [2],
                            borderDashOffset: [2],
                            zeroLineBorderDash: [2],
                            zeroLineBorderDashOffset: [2],
                          },
                        },
                      ],

                      yAxes: [
                        {
                          ticks: {
                            fontColor: "gray",
                            beginAtZero: true,
                            userCallback: function (value, index, values) {
                              value = value.toString();
                              value = value.split(/(?=(?:...)*$)/);
                              value = value.join(",");
                              return "" + value;
                            },
                          },

                          display: true,
                          scaleLabel: {
                            beginAtZero: true,
                            display: false,
                            labelString: "Value",
                            fontColor: "gray",
                          },
                          gridLines: {
                            beginAtZero: true,
                            borderDash: [3],
                            borderDashOffset: [3],
                            drawBorder: false,
                            color: "gray",
                            zeroLineColor: "gray",
                            zeroLineBorderDash: [2],
                            zeroLineBorderDashOffset: [2],
                          },
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12  space-y-2 md:col-span-3  ">
              <div className="  grid grid-cols-12 ">
                <div className=" col-span-12 flex  items-center justify-start text-xl">
                  {t("Авлагын тайлан")}
                </div>
              </div>
              <div className="box flex h-full flex-col justify-start p-4">
                <div>
                  <Pie
                    data={avlaga}
                    options={avlaga.options}
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex  h-full items-center justify-between ">
                  <div className="space-y-4">
                    {avlagiinChartSalbaraarAvya.data?.options?.labels.map(
                      (a, index) => (
                        <div className="flex items-center space-x-2">
                          <div key={index}>
                            <GoPrimitiveDot
                              style={{
                                color:
                                  avlagiinChartSalbaraarAvya?.data?.backgroundColor.find(
                                    (a, i) => i === index
                                  ),
                              }}
                            />
                          </div>
                          <div>{a}</div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="space-y-4">
                    {avlagiinChartSalbaraarAvya?.data?.series.map(
                      (a, index) => (
                        <div
                          key={index}
                          className="flex justify-end  font-bold text-green-700"
                          style={{
                            color:
                              avlagiinChartSalbaraarAvya?.data?.backgroundColor.find(
                                (a, i) => i === index
                              ),
                          }}
                        >
                          {formatNumber(a, 2)}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 space-y-2  md:col-span-3 ">
              <div className="  grid grid-cols-12 ">
                <div className=" col-span-12 flex items-center justify-start text-xl ">
                  {t("Орлогын тайлан")}
                </div>
              </div>
              <div className="box flex  h-full  flex-col justify-start p-4  ">
                <div>
                  <Doughnut
                    data={orlogo}
                    options={orlogo.options}
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex  h-full items-center justify-between  ">
                  <div className="space-y-4">
                    {orlogiinChartSalbaraarAvya.data?.options?.labels.map(
                      (a, index) => (
                        <div className="flex items-center space-x-2">
                          <div key={index}>
                            <GoPrimitiveDot
                            style={{
                              color:
                                avlagiinChartSalbaraarAvya?.data?.backgroundColor.find(
                                  (a, i) => i === index
                                ),
                            }}
                            />
                          </div>
                          <div>{a}</div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="space-y-4">
                    {orlogiinChartSalbaraarAvya?.data?.series.map(
                      (a, index) => (
                        <div
                          key={index}
                          className="flex justify-end  font-bold text-green-700"
                          style={{
                            color:
                              orlogiinChartSalbaraarAvya?.data?.backgroundColor.find(
                                (a, i) => i === index
                              ),
                          }}
                        >
                          {formatNumber(a, 2)}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="col-span-12 space-y-3 p-2 md:p-5 xl:col-span-3"
        data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <div className="xxl:col-span-12 col-span-12 md:col-span-12 xl:col-span-4">
          <div>
            <Calendar
              fullscreen={false}
              mode="month"
              locale={i18n.language === "mn" && locale}
              onChange={setOgnoo}
            />
          </div>
          <hr />
          <div className="space-y-4 bg-white p-4 dark:bg-gray-700">
            <div className="flex w-full items-center justify-between space-x-3">
              <div className=" flex items-center space-x-2">
                <div className="flex items-center">
                  <GoPrimitiveDot className="text-2xl text-green-500 " />
                </div>
                <div>{t("Дууссан ажил")}</div>
              </div>
              <div>33</div>
            </div>
            <div className="flex w-full items-center justify-between space-x-3">
              <div className=" flex items-center space-x-2">
                <div className="flex items-center">
                  <GoPrimitiveDot className="text-2xl text-yellow-500 " />
                </div>
                <div>{t("Идэвхтэй ажил")}</div>
              </div>
              <div>18</div>
            </div>
            <div className="flex w-full items-center justify-between space-x-3">
              <div className=" flex items-center space-x-2">
                <div className="flex items-center">
                  <GoPrimitiveDot className="text-2xl text-red-500 " />
                </div>
                <div>{t("Цуцлагдсан")}</div>
              </div>
              <div>10</div>
            </div>
          </div>
        </div>
        <div className=" flex items-center pr-2">
          <div className=" dark:text-theme-10 flex w-full  items-center justify-end text-blue-400 dark:text-gray-400">
            <Button
              type="primary"
              onClick={() => barilgaBurtgel("new")}
              icon={<PlusOutlined />}
            >
              {t("Нэмэх")}
            </Button>
          </div>
        </div>

        <div
          className="overflow-y-scroll lg:h-[33vh] "
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          {baiguullaga?.barilguud.map((a) => (
            <div className="my-2 grid grid-cols-12 space-x-3 rounded-md  bg-white hover:shadow-lg    dark:bg-gray-700  md:p-5 md:py-2  ">
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
                        <label className="hover:text-black"> {t("Засах")}</label>
                      </a>
                    </div>
                  )}
                  placement="bottom"
                  trigger="click"
                >
                  <a className="flex items-center justify-center rounded-full hover:bg-gray-200">
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
