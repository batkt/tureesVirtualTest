import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useMemo, useEffect, useState } from "react";
import { aldaaBarigch, url } from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Button, Table, Popover, Calendar, Select, DatePicker } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  MoreOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import router from "next/router";
import CardList from "components/cardList";
import BarilgaTile from "components/pageComponents/barilga/BarilgaTile";
import Aos from "aos";
import formatNumber from "tools/function/formatNumber";
import useSWR from "swr";
import createMethod from "tools/function/crud/createMethod";
import moment from "moment";

import { VictoryChart, VictoryLine } from "victory";
import locale from "antd/lib/calendar/locale/mn_MN";
import dynamic from "next/dynamic";
const CustomLabel = dynamic(
  () => import("components/pageComponents/talbaiBurtgelChart/CustomLabel"),
  { ssr: false }
);
const CustomChart = dynamic(
  () => import("components/pageComponents/talbaiBurtgelChart/CustomChart"),
  { ssr: false }
);
moment.locale("mn");

function BarilgaBurtgel({ token }) {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const { baiguullaga, barilgiinId } = useAuth();
  const barilga = baiguullaga?.barilguud?.find((a) => a._id === barilgiinId);
  const [ognoo, setOgnoo] = useState(new Date());
  const barilgaToololt = useSWR(
    !!token ? ["khyanakhSambariinUgugdul", token] : null,
    (url, token) =>
      createMethod(url, token, {
        ekhlekhOgnoo: moment().startOf().format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment().endOf().format("YYYY-MM-DD 23:59:59"),
      })
        .then(({ data }) => data)
        .catch(aldaaBarigch),
    { revalidateOnFocus: false }
  );
  const columns = useMemo(
    () => [
      {
        title: "Нэр",
        dataIndex: "ner",
        key: "ner",
        render: (text) => <a>{text}</a>,
        ellipsis: true,
        align: "center",
      },
      {
        title: "Хаяг",
        dataIndex: "khayag",
        key: "khayag",
        ellipsis: true,
      },
      {
        title: "Давхар",
        dataIndex: "davkharuud",
        render: (a) => <>{a.length}</>,
        width: "6rem",
        align: "center",
      },
      {
        title: (
          <label>
            Талбай м <sup> 2</sup>
          </label>
        ),
        key: "burtgesen",
        dataIndex: "niitTalbai",
        render: (niitTalbai) => formatNumber(niitTalbai),
        width: "7rem",
        align: "center",
      },
      {
        title: "Бүртгэсэн",
        key: "burtgesen",
        dataIndex: "burtgesen",
        render: () => <>{"Админ"}</>,
        ellipsis: true,
        align: "center",
      },
      {
        title: () => <SettingOutlined />,
        fixed: "right",
        className: "text-center",
        align: "center",
        width: "3rem",
        render: (text, row, index) => (
          <div className="flex flex-row justify-center">
            <Popover
              content={() => (
                <div className="flex w-24 flex-col space-y-2">
                  <a
                    className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100  dark:text-white dark:hover:bg-gray-700  "
                    onClick={() => barilgaBurtgel(index)}
                  >
                    <EditOutlined style={{ fontSize: "18px" }} />
                    <label> Засах</label>
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
        ),
      },
    ],
    []
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
        utga: "Нийт байгууллага",
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
          barilgaToololt?.data?.khariu?.reduce((a, b) => a + b.too, 0) +
          "/" +
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
          (100 *
            barilgaToololt?.data?.khariu?.find((a) => a._id === true)?.too) /
          barilgaToololt?.data?.khariu?.reduce((a, b) => a + b.too, 0)
        ).toFixed(0),
        utga: "Түрээслэгч",
      },
    ];
  }, [barilgaToololt]);

  function barilgaBurtgel(id) {
    router.push(`/khyanalt/barilgaBurtgel/${id}`);
  }
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <Admin
      khuudasniiNer="barilgaBurtgel"
      title="Барилга"
      className="px-4"
      tsonkhniiId={"61c2c6271c2830c4e6f90c85"}
    >
      <div className="col-span-12 xl:col-span-9">
        <div className=" flex justify-between p-8 text-lg text-gray-400">
          <div>Dashboard</div>
          <div className="flex space-x-3 text-blue-500 ">
            <div>
              <ReloadOutlined />
            </div>
            <div>Дахин ачааллах</div>
          </div>
        </div>
        <div className="col-span-12 mt-3 space-y-4 px-2">
          <div className=" mb-10 grid grid-cols-12 gap-6 ">
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
                            className={`report-box__indicator ${
                              mur.khuvi > 0 ? "bg-theme-9" : "bg-theme-6"
                            } tooltip cursor-pointer `}
                          >
                            {mur.khuvi}%
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
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 text-3xl font-bold leading-8 dark:text-gray-200">
                        {mur.too}
                      </div>
                      <div className="mt-1 text-base text-gray-600 dark:text-gray-200">
                        {mur.utga}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="t-2 col-span-12">
              <CardList
                keyValue="barilga"
                className="block overflow-auto md:hidden"
                jagsaalt={baiguullaga?.barilguud}
                Component={BarilgaTile}
                pagination={{ pageSize: 100 }}
              />
            </div>
          </div>

          <div className=" grid grid-cols-12 space-x-6 ">
            <div className="col-span-6 space-y-4  ">
              <div className="mb-8 flex justify-between ">
                <div className="text-lg text-gray-700">Sales Report</div>
                <div>
                  <DatePicker />
                </div>
              </div>
              <div className=" box   flex flex-col p-4">
                <div className="grid h-[4rem] grid-cols-2">
                  <div className="flex justify-center space-x-3 ">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xl text-green-600">$15,000</div>
                      <div className="text-sm text-gray-500">This Month</div>
                    </div>
                    <div className="w-1 bg-gray-400 " />
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-xl text-gray-500">$15,000</div>
                      <div className="text-sm text-gray-500">Last Month</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end ">
                    <Select
                      className="rounded-2xl"
                      style={{ width: "70%" }}
                      placeholder="Select a person"
                      onChange={onChange}
                      options={[
                        {
                          value: "jack",
                          label: "Jack",
                        },
                        {
                          value: "lucy",
                          label: "Lucy",
                        },
                        {
                          value: "tom",
                          label: "Tom",
                        },
                      ]}
                    />
                  </div>
                </div>
                <div>
                  <VictoryChart height={275}>
                    <VictoryLine
                      interpolation="cardinal"
                      data={[
                        { x: 1, y: 1 },
                        { x: 2, y: 3 },
                        { x: 3, y: 6 },
                        { x: 4, y: 6 },
                        { x: 5, y: 7 },
                        { x: 6, y: 7 },
                        { x: 7, y: 9 },
                        { x: 8, y: 9 },
                        { x: 9, y: 11 },
                        { x: 10, y: 11 },
                      ]}
                      style={{ data: { stroke: "#c43a31" } }}
                    />
                    <VictoryLine
                      interpolation="cardinal"
                      style={{ data: { stroke: "green" } }}
                      data={[
                        { x: 1, y: 1 },
                        { x: 2, y: 3 },
                        { x: 3, y: 5 },
                        { x: 4, y: 2 },
                        { x: 5, y: 3 },
                        { x: 6, y: 4 },
                        { x: 7, y: 6 },
                        { x: 8, y: 7 },
                        { x: 9, y: 8 },
                        { x: 10, y: 12 },
                      ]}
                    />
                  </VictoryChart>
                </div>
              </div>
            </div>

            <div className="col-span-3  space-y-5  ">
              <div className="mb-8 flex items-center justify-between ">
                <div className="text-base font-bold text-gray-700">
                  Weekly Top Seller
                </div>
                <div className="text-sm text-blue-700">Show More</div>
              </div>

              <div className=" box h-[87%] w-full p-4">
                <div className="h-[59%] w-full p-4">
                  <CustomLabel chartID="pie-two" />
                </div>
                <div>asdas</div>
              </div>
            </div>

            <div className="col-span-3   space-y-5 ">
              <div className="mb-8 flex items-center justify-between ">
                <div className="text-base font-bold text-gray-700">
                  Weekly Top Seller
                </div>
                <div className="text-sm text-blue-700">Show More</div>
              </div>

              <div className=" box h-[87%] w-full p-4">
                <div className="h-[59%] w-full p-4">
                  {/* <CustomLabel chartID="pie-two" /> */}
                </div>
                <div>asdas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="col-span-12 space-y-3 xl:col-span-3 "
        data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <div className="xxl:col-span-12 col-span-12 mt-5 md:col-span-12 xl:col-span-4">
          <Calendar
            fullscreen={false}
            mode="month"
            locale={locale}
            onChange={setOgnoo}
          />
        </div>
        <div className="mt-8 flex h-10 items-center">
          <div
            className="text-theme-1 dark:text-theme-10 ml-auto flex items-center text-blue-400 dark:text-gray-400"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            <Button
              type="primary"
              onClick={() => barilgaBurtgel("new")}
              icon={<PlusOutlined />}
            >
              Нэмэх
            </Button>
          </div>
        </div>
        <div
          className="h-[45vh] space-y-3 overflow-scroll p-2"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          {baiguullaga?.barilguud.map((a) => (
            <div className="my-2 grid grid-cols-12  space-x-3  rounded-md bg-white py-2 px-4 hover:scale-110 hover:shadow-lg ">
              <div className="col-span-2 flex items-center justify-start">
                <img
                  className="h-14 w-14"
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
              <div className="col-span-3  flex items-center justify-center ">
                {formatNumber(a?.niitTalbai)}м<sup> 2</sup>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                {a?.davkharuud?.length}
              </div>
              <div className=" col-span-1 flex items-center justify-end">
                <Popover
                  content={() => (
                    <div className="flex w-24 flex-col space-y-2">
                      <a
                        className="ant-dropdown-link flex items-center justify-between rounded-lg  p-2 hover:bg-green-100  dark:text-white dark:hover:bg-gray-700  "
                        onClick={() => barilgaBurtgel(a._id)}
                      >
                        <EditOutlined className="text-xl text-green-400" />
                        <label className="hover:text-black"> Засах</label>
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
