import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import { useMemo, useEffect } from "react";
import { aldaaBarigch, url } from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Button, Table, Popover } from "antd";
import {
  PlusOutlined,
  SettingOutlined,
  MoreOutlined,
  EditOutlined,
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

function BarilgaBurtgel({ token }) {
  useEffect(() => {
    Aos.init({once: true});
  });
  const { baiguullaga, barilgiinId } = useAuth();
  const barilga = baiguullaga?.barilguud?.find((a) => a._id === barilgiinId);

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
                    className="ant-dropdown-link flex items-center justify-between rounded-lg p-2 hover:bg-green-100"
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

  return (
    <Admin
      khuudasniiNer="barilgaBurtgel"
      className="px-4"
      tsonkhniiId={"61c2c6271c2830c4e6f90c85"}
    >
      <div className="col-span-12 xl:col-span-9">
        <div className="col-span-12 mt-3 px-2">
          <div className="mt-5 grid grid-cols-12 gap-6">
            {khyanaltiinDun.map((mur, index) => {
              return (
                <div
                  key={"index" + index}
                  data-aos="zoom-in-up"
                  data-aos-duration="1000"
                  data-aos-delay={1 + index + "00"}
                  className="intro-y col-span-12 sm:col-span-6 xl:col-span-3"
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
                        {mur.utga}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="col-span-12">
              <div className="intro-y mt-8 flex h-10 items-center">
                <h2
                  className="mr-5 text-lg font-medium dark:text-gray-300"
                  data-aos="zoom-in-right"
                  data-aos-duration="1000"
                  data-aos-delay="200"
                >
                  Барилга жагсаалт
                </h2>
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
                className="hidden md:block"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="400"
              >
                <Table
                  tableLayout={
                    baiguullaga?.barilguud?.length > 0 ? "auto" : "fixed"
                  }
                  size="small"
                  bordered
                  scroll={{ y: "calc(100vh - 31rem)" }}
                  rowKey={(row) => row._id}
                  columns={columns}
                  loading={!baiguullaga}
                  dataSource={baiguullaga?.barilguud}
                />
              </div>
              <CardList
                keyValue="barilga"
                className="block overflow-auto md:hidden"
                jagsaalt={baiguullaga?.barilguud}
                Component={BarilgaTile}
                pagination={{ pageSize: 100 }}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="col-span-12 xl:col-span-3"
        data-aos="fade-left"
        data-aos-duration="1000"
        data-aos-delay="300"
      >
        <div className="xxl:col-span-12 col-span-12 mt-5 md:col-span-12 xl:col-span-4">
          <div className="h-0md:mt-5 bg-white p-2 dark:bg-gray-900">
            <div className="flex cursor-pointer flex-row rounded-md bg-white p-3 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800">
              <img
                className="h-14 w-14"
                alt={baiguullaga?.ner}
                src={
                  baiguullaga?.zurgiinNer
                    ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                    : "/favicon.ico"
                }
              />
              <div className="ml-3 flex flex-col">
                <span className="md:w-20">Барилгын нэр</span>
                <span className="mt-1 font-medium text-gray-600">
                  {barilga?.ner}
                </span>
              </div>
            </div>
            <div className="flex cursor-pointer items-center rounded-md bg-white p-3 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800">
              <div className="flex flex-row items-center">
                <span className="md:w-20">Регистр:</span>
                <span className="font-medium text-gray-600">
                  {barilga?.register}
                </span>
              </div>
            </div>
            <div className="flex cursor-pointer items-center rounded-md bg-white p-3 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800">
              <div className="flex flex-row items-center">
                <span className="md:w-20">Хаяг:</span>
                <span className="font-medium text-gray-600">
                  {barilga?.khayag}
                </span>
              </div>
            </div>
            <div className="flex cursor-pointer items-center rounded-md bg-white p-3 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800">
              <div className="flex flex-row items-center">
                <span className="md:w-20">Давхар:</span>
                <span className="font-medium text-gray-600">
                  {barilga?.davkhar}
                </span>
              </div>
            </div>
            <div className="flex cursor-pointer items-center rounded-md bg-white p-3 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800">
              <div className="flex flex-row items-center">
                <span className="md:w-20">Талбай:</span>
                <span className="font-medium text-gray-600">
                  {barilga?.talbai}
                </span>
              </div>
            </div>
            <div className="flex cursor-pointer items-center rounded-md bg-white p-3 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800">
              <div className="flex flex-row items-center">
                <span className="md:w-20">Утас:</span>
                <span className="font-medium text-gray-600">
                  {barilga?.utas}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default BarilgaBurtgel;
