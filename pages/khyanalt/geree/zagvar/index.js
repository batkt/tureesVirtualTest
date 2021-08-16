import React from "react";
import Admin from "components/Admin";
import { Button, Dropdown, Menu } from "antd";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import deleteMethod from "tools/function/crud/deleteMethod";
import _ from "lodash";
import router from "next/router";
import { FileExcelOutlined, UserAddOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import ZaaltOruulakh from "components/pageComponents/geree/zagvar/ZaaltOruulakh";
import ZaaltExceleesOruulakh from "components/pageComponents/geree/zagvar/ZaaltExceleesOruulakh";

function index({ token }) {
  const { baiguullaga } = useAuth();
  const ref = React.useRef();
  const excelref = React.useRef();
  const { gereeniiZagvarGaralt, gereeniiZagvarMutate } = useGereeniiZagvar(
    token,
    baiguullaga?._id
  );

  function zaaltOruulakh() {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Бүртгэл нэмэх
      </Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ZaaltOruulakh ref={ref} token={token} baiguullaga={baiguullaga} />
      ),
      footer,
    });
  }

  function zaaltOruulakhExcel() {
    const footer = [
      <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: <ZaaltExceleesOruulakh ref={excelref} token={token} />,
      footer,
    });
  }

  return (
    <Admin khuudasniiNer="gereeniiZagvar" className="p-4">
      <div className="col-span-12 lg:col-span-3 xl:col-span-2">
        <h2 className="intro-y text-lg font-medium mr-auto mt-2">
          Гэрээний загвар
        </h2>
        <div className="intro-y box p-5 mt-6">
          <div className="mt-1">
            <a
              href=""
              className="flex items-center px-3 py-2 rounded-md bg-theme-1 text-white font-medium"
            >
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
                className="feather feather-image w-4 h-4 mr-2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              Гэрээний загвар
            </a>
            <a href="" className="flex items-center px-3 py-2 mt-2 rounded-md">
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
                className="feather feather-video w-4 h-4 mr-2"
              >
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              Гэрээний заалт
            </a>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-9 xl:col-span-10">
        <div className="intro-y flex flex-col-reverse sm:flex-row items-center">
          <div className="w-full sm:w-auto relative mr-auto mt-3 sm:mt-0">
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
              className="feather feather-search w-4 h-4 absolute my-auto inset-y-0 ml-3 left-0 z-10 text-gray-700 dark:text-gray-300"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="form-control w-full sm:w-64 box px-10 text-gray-700 dark:text-gray-300 placeholder-theme-13 p-2"
              placeholder="Search files"
            />
            <Dropdown
              trigger="click"
              overlay={
                <div className="inbox-filter__dropdown-menu dropdown-menu pt-2">
                  <div className="dropdown-menu__content box p-5">
                    <div className="grid grid-cols-12 gap-4 gap-y-3">
                      <div className="col-span-6">
                        <label
                          for="input-filter-1"
                          className="form-label text-xs"
                        >
                          File Name
                        </label>
                        <input
                          id="input-filter-1"
                          type="text"
                          className="form-control flex-1"
                          placeholder="Type the file name"
                        />
                      </div>
                      <div className="col-span-6">
                        <label
                          for="input-filter-2"
                          className="form-label text-xs"
                        >
                          Shared With
                        </label>
                        <input
                          id="input-filter-2"
                          type="text"
                          className="form-control flex-1"
                          placeholder="example@gmail.com"
                        />
                      </div>
                      <div className="col-span-6">
                        <label
                          for="input-filter-3"
                          className="form-label text-xs"
                        >
                          Created At
                        </label>
                        <input
                          id="input-filter-3"
                          type="text"
                          className="form-control flex-1"
                          placeholder="Important Meeting"
                        />
                      </div>
                      <div className="col-span-6">
                        <label
                          for="input-filter-4"
                          className="form-label text-xs"
                        >
                          Size
                        </label>
                        <select
                          id="input-filter-4"
                          className="form-select flex-1"
                        >
                          <option>10</option>
                          <option>25</option>
                          <option>35</option>
                          <option>50</option>
                        </select>
                      </div>
                      <div className="col-span-12 flex items-center mt-3">
                        <button className="btn btn-secondary w-32 ml-auto">
                          Create Filter
                        </button>
                        <button className="btn btn-primary w-32 ml-2">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <div
                className="inbox-filter dropdown absolute inset-y-0 mr-3 right-0 flex items-center"
                data-placement="bottom-start"
              >
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
                  className="feather feather-chevron-down dropdown-toggle w-4 h-4 cursor-pointer text-gray-700 dark:text-gray-300"
                  role="button"
                  aria-expanded="false"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </Dropdown>
          </div>
          <div className="w-full sm:w-auto flex">
            <button
              className="btn bg-theme-1 text-white font-medium shadow-md mr-2"
              onClick={() => router.push("/khyanalt/geree/zagvar/new")}
            >
              Шинэ гэрээний загвар үүсгэх
            </button>
            <Dropdown
              overlay={
                <Menu className="p-2">
                  <Menu.Item
                    key="Заалт нэмэх"
                    className="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md space-x-2"
                    onClick={zaaltOruulakh}
                  >
                    <UserAddOutlined />
                    <span>Заалт нэмэх</span>
                  </Menu.Item>
                  <Menu.Item
                    key="Заалт Excel-ээс оруулах"
                    className="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md space-x-2"
                    onClick={zaaltOruulakhExcel}
                  >
                    <UserAddOutlined />
                    <span>Заалт Excel-ээс оруулах</span>
                  </Menu.Item>
                </Menu>
              }
              trigger="click"
              className="cursor-pointer"
            >
              <button
                className="dropdown-toggle btn px-2 box text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 w-full md:w-auto mt-4 md:mt-0"
                aria-expanded="false"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {" "}
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
                    className="feather feather-plus w-4 h-4"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>{" "}
                </span>
                Заалт
              </button>
            </Dropdown>
          </div>
        </div>
        <div className="intro-y grid grid-cols-12 gap-3 sm:gap-6 mt-5">
          {gereeniiZagvarGaralt?.jagsaalt?.map((a, i) => {
            return (
              <div
                key={a._id}
                className="intro-y col-span-6 sm:col-span-4 md:col-span-3 xl:col-span-2"
              >
                <div className="file box rounded-md px-5 pt-8 pb-5 px-3 sm:px-5 relative zoom-in">
                  <div className="absolute left-0 top-0 mt-3 ml-3">
                    <input
                      className="form-check-input border border-gray-500"
                      type="checkbox"
                    />
                  </div>
                  <a
                    href=""
                    className="w-3/5 file__icon file__icon--file mx-auto"
                  >
                    <div className="file__icon__file-name"></div>
                  </a>
                  <a
                    href=""
                    className="block font-medium mt-4 text-center truncate"
                  >
                    {a.ner}
                  </a>
                  <div className="text-gray-600 text-xs text-center mt-0.5">
                    1 KB
                  </div>
                  <div className="absolute top-0 right-0 mr-2 mt-2 dropdown ml-auto">
                    <Dropdown
                      trigger="click"
                      overlay={
                        <div className="dropdown-menu w-40">
                          <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
                            <div
                              onClick={() =>
                                router.push(`/khyanalt/geree/zagvar/${a._id}`)
                              }
                              className="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                            >
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
                                className="feather feather-users w-4 h-4 mr-2"
                              >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              Засах
                            </div>
                            <div
                              onClick={() =>
                                deleteMethod(
                                  "gereeniiZagvar",
                                  token,
                                  a._id
                                ).then(() => gereeniiZagvarMutate())
                              }
                              className="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                            >
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
                                className="feather feather-trash w-4 h-4 mr-2"
                              >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              Устгах
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <a
                        className="dropdown-toggle w-5 h-5 block"
                        href="javascript:;"
                        aria-expanded="false"
                      >
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
                          className="feather feather-more-vertical w-5 h-5 text-gray-600"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </a>
                    </Dropdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default index;
