import React from "react";
import Admin from "components/Admin";
import { Button, Drawer, Dropdown, Menu } from "antd";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import useGereeniiZagvar from "hooks/useGereeniiZagvar";
import deleteMethod from "tools/function/crud/deleteMethod";
import _ from "lodash";
import router from "next/router";
import { FileExcelOutlined, UserAddOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import ZaaltOruulakh from "components/pageComponents/geree/zagvar/ZaaltOruulakh";
import ExceleesOruulakh from "components/pageComponents/geree/zagvar/ExceleesOruulakh";
import GereeKharakh from "components/pageComponents/geree/Kharakh";
import Aos from "aos";
import { useEffect } from "react";

function index({ token }) {
  const { ajiltan, baiguullaga, barilgiinId } = useAuth();
  const [kharuulakhGeree, setKharuulakhGeree] = React.useState();
  const ref = React.useRef();
  const excelref = React.useRef();
  const { gereeniiZagvarGaralt, gereeniiZagvarMutate } = useGereeniiZagvar(
    token,
    ajiltan?.baiguullagiinId
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
      content: (
        <ExceleesOruulakh
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          zam="gereeniiZaaltTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Заалтын excel файл"
        />
      ),
      footer,
    });
  }

  function zagvarOruulakhExcel() {
    const footer = [
      <Button onClick={() => excelref.current.khaaya()}>Хаах</Button>,
    ];
    modal({
      title: "",
      icon: <FileExcelOutlined />,
      content: (
        <ExceleesOruulakh
          ref={excelref}
          token={token}
          barilgiinId={barilgiinId}
          zam="gereeniiZagvarTatya"
          garchig="Excel файл аа чирч оруулах эсвэл сонгоно уу"
          tailbar="Гэрээний загварын excel файл"
          onFinish={() => gereeniiZagvarMutate()}
        />
      ),
      footer,
    });
  }
  useEffect(() => {
    Aos.init();
  });

  return (
    <Admin
      khuudasniiNer="gereeniiZagvar"
      title="Гэрээний загвар"
      className="p-4"
      tsonkhniiId={"61c2c6101c2830c4e6f90c7d"}
    >
      <div className="col-span-12">
        <div className="intro-y flex flex-col-reverse items-center sm:flex-row">
          <Drawer
            title={kharuulakhGeree?.gereeniiDugaar}
            width={"50vw"}
            onClose={() => setKharuulakhGeree(null)}
            visible={!!kharuulakhGeree}
            footer={
              <Button type="primary" onClick={() => setKharuulakhGeree(null)}>
                Хаах
              </Button>
            }
          >
            {!!kharuulakhGeree && (
              <GereeKharakh data={{ ...kharuulakhGeree, geree: {} }} />
            )}
          </Drawer>
          <div
            className="flex w-full sm:w-auto"
            data-aos="fade-right"
            data-aos-delay="300"
          >
            <Button
              className="mr-2 font-medium text-white"
              onClick={() => router.push("/khyanalt/geree/zagvar/new")}
            >
              Шинэ гэрээний загвар үүсгэх
            </Button>
            <Dropdown
              overlay={
                <Menu className="p-2">
                  <Menu.Item
                    key="Заалт нэмэх"
                    className="dark:hover:bg-dark-2 block flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700"
                    onClick={zaaltOruulakh}
                  >
                    <UserAddOutlined />
                    <span>Заалт нэмэх</span>
                  </Menu.Item>
                  <Menu.Item
                    key="Заалт Excel-ээс оруулах"
                    className="dark:hover:bg-dark-2 block flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700"
                    onClick={zaaltOruulakhExcel}
                  >
                    <UserAddOutlined />
                    <span>Заалт Excel-ээс оруулах</span>
                  </Menu.Item>
                  <Menu.Item
                    key="Заалт Excel-ээс оруулах"
                    className="dark:hover:bg-dark-2 block flex items-center space-x-2 rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:bg-gray-700"
                    onClick={zagvarOruulakhExcel}
                  >
                    <UserAddOutlined />
                    <span>Гэрээний загвар Excel-ээс оруулах</span>
                  </Menu.Item>
                </Menu>
              }
              trigger="click"
              className="cursor-pointer"
            >
              <Button
                className="dropdown-toggle btn box focus:outline-none mt-4 w-full px-2 text-gray-700 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 dark:text-gray-300 md:mt-0 md:w-auto"
                aria-expanded="false"
                icon={
                  <span className="flex h-5 w-5 items-center justify-center">
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
                      className="feather feather-plus h-4 w-4"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                }
              ></Button>
            </Dropdown>
          </div>
        </div>
        <div className="intro-y mt-5 grid grid-cols-12 gap-3 sm:gap-6">
          {gereeniiZagvarGaralt?.jagsaalt?.map((a, i) => {
            return (
              <div
                key={a._id}
                className="intro-y col-span-6 sm:col-span-4 md:col-span-3 xl:col-span-2"
                onClick={() => setKharuulakhGeree(a)}
                data-aos="zoom-in-up"
                data-aos-duration="1000"
                data-aos-delay={1 + index + "00"}
              >
                <div className="file box zoom-in relative rounded-md px-5 px-3 pt-8 pb-5 sm:px-5">
                  <div className="absolute left-0 top-0 mt-3 ml-3">
                    <input
                      className="form-check-input border border-gray-500"
                      type="checkbox"
                    />
                  </div>
                  <div className="file__icon file__icon--file mx-auto w-3/5">
                    <div className="file__icon__file-name"></div>
                  </div>
                  <div className="mt-4 block text-center font-medium">
                    {a.ner}
                  </div>
                  <div className="mt-0.5 text-center text-xs text-gray-600">
                    1 KB
                  </div>
                  <div className="dropdown absolute top-0 right-0 mr-2 mt-2 ml-auto">
                    <Dropdown
                      trigger="click"
                      overlay={
                        <div className="dropdown-menu w-40">
                          <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/khyanalt/geree/zagvar/${a._id}`);
                              }}
                              className="dark:bg-dark-1 dark:hover:bg-dark-2 block flex items-center rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200"
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
                                className="feather feather-users mr-2 h-4 w-4"
                              >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              Засах
                            </div>
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                deleteMethod(
                                  "gereeniiZagvar",
                                  token,
                                  a._id
                                ).then(() => gereeniiZagvarMutate());
                              }}
                              className="dark:bg-dark-1 dark:hover:bg-dark-2 block flex items-center rounded-md bg-white p-2 transition duration-300 ease-in-out hover:bg-gray-200"
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
                                className="feather feather-trash mr-2 h-4 w-4"
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
                      <div
                        className="dropdown-toggle block h-5 w-5"
                        aria-expanded="false"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
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
                          className="feather feather-more-vertical h-5 w-5 text-gray-600"
                        >
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </div>
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
