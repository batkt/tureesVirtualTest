import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import formatNumber from "tools/function/formatNumber";
import { useCallback, useMemo, useRef } from "react";
import uilchilgee, { url } from "services/uilchilgee";
import { useAuth } from "services/auth";
import { Button, Space, Table } from "antd";
import { PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import BaiguullagaBurtgelAlkham from "./dedKheseg/barilgaBurtgekh";
import { Marker } from "@react-google-maps/api";
import useSalbar from "hooks/useSalbar";
import GazriinZurag from "components/gazriinZurag/GazriinZurag";
import { modal } from "components/ant/Modal";
import _ from "lodash";
import useKhyanakhSambar from "hooks/useKhyanakhSambar";

export function khariltsagchiinJagsaaltAvya(set, id, setLoadData, token) {
  if (id)
    uilchilgee(token)
      .post("/baiguullagiinJagsaaltAvya", {
        query: { $or: [{ tolgoinId: id }, { _id: id }] },
      })
      .then(({ data }) => {
        data.jagsaalt.forEach((x) => (x.ley = x._id));
        set([...data.jagsaalt]);
        setLoadData(false);
      });
}

function BarilgaBurtgel({ token }) {
  const ref = useRef(null);
  const burtgel = useRef(null);
  const { ajiltan, baiguullaga, baiguullagaMutate } = useAuth();
  const { salbariinGaralt, setKhuudaslalt, salbarMutate } = useSalbar(
    token,
    ajiltan?.baiguullagiinId
  );
  const { toololt } = useKhyanakhSambar(token);
  const bairshiluud = useMemo(() => {
    return (salbariinGaralt?.jagsaalt || []).map((mur) => {
      return {
        lat: mur?.bairshil?.coordinates[0] || 47.927094,
        lng: mur?.bairshil?.coordinates[1] || 106.887425,
      };
    });
  }, [salbariinGaralt]);

  const columns = useMemo(
    () => [
      {
        title: "Нэр",
        dataIndex: "ner",
        key: "ner",
        render: (text) => <a>{text}</a>,
        ellipsis: true,
      },
      {
        title: "Хаяг",
        dataIndex: "khayag",
        key: "khayag",
        ellipsis: true,
      },
      {
        title: "Утас",
        key: "utas",
        dataIndex: "utas",
        render: (text) => <>{text}</>,
        ellipsis: true,
      },
      {
        title: "Давхар",
        key: "burtgesen",
        dataIndex: "burtgesen",
        render: () => <>{"6"}</>,
      },
      {
        title: "Талбай /м2/",
        key: "burtgesen",
        dataIndex: "burtgesen",
        render: () => <>{"500"}</>,
      },
      {
        title: "Бүртгэсэн",
        key: "burtgesen",
        dataIndex: "burtgesen",
        render: () => <>{"Админ"}</>,
        ellipsis: true,
      },
      {
        title: "Үйлдэл",
        render: (text, row) => {
          return (
            <Space size="middle">
              <a
                className="text-yellow-500 hover:text-yellow-400"
                //onClick={() => zasakh(row)}
              >
                Засах
              </a>
              <a onClick={() => zasakh(row, true)}>Харах</a>
            </Space>
          );
        },
        ellipsis: true,
      },
    ],
    []
  );

  const khyanaltiinDun = useMemo(() => {
    return [
      {
        too: _.get(toololt, "0.baraa") || 15,
        icon: (
          <svg
            className="w-8 h-8 text-green-500"
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
        too: "10.2сая",
        icon: (
          <svg
            className="w-8 h-8 text-green-500"
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
        too: "1.5сая",
        icon: (
          <svg
            class="h-8 w-8 text-red-500"
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
        too: _.get(toololt, "0.khariltsagchiinToo") || 500,
        icon: (
          <svg
            class="h-8 w-8 text-green-500"
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
        khuvi: 100,
        utga: "Түрээслэгч",
      },
    ];
  }, [toololt]);

  const zasakh = (salbar, readonly) => {
    const footer = [
      <Button onClick={() => burtgel.current.khaaya()}>Хаах</Button>,
    ];
    if (!readonly) {
      footer.push(
        <Button
          type="primary"
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => burtgel.current.khadgalya()}
        >
          Хадгалах
        </Button>
      );
    }
    modal({
      style: { minWidth: "50vw" },
      title: "Барилга бүртгэл",
      icon: <UserAddOutlined />,
      content: (
        <BaiguullagaBurtgelAlkham
          token={token}
          ugugdul={salbar}
          baiguullagiinId={ajiltan?.baiguullagiinId}
          ref={burtgel}
          readonly={readonly}
          salbarMutate={salbarMutate}
          baiguullagaMutate={baiguullagaMutate}
        />
      ),
      footer,
    });
  };

  const afterLoadMap = useCallback(
    function callback() {
      ref.current && ref.current.fitBounds(bairshiluud);
    },
    [bairshiluud, ref]
  );

  return (
    <Admin
      khuudasniiNer="barilgaBurtgel"
      className="px-4"
      onSearch={(search) =>
        setKhuudaslalt((kh) => ({ ...kh, khuudasniiDugaar: 1, search }))
      }
    >
      <div className="col-span-12 xl:col-span-12">
        <div className="col-span-12 mt-3 px-2">
          <div className="grid grid-cols-12 gap-6 mt-5">
            {khyanaltiinDun.map((mur, index) => {
              return (
                <div
                  key={index}
                  className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
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
                              className="feather feather-chevron-up w-4 h-4 ml-0.5"
                            >
                              <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>{" "}
                          </div>
                        </div>
                      </div>
                      <div className="text-3xl font-bold leading-8 mt-6 dark:text-gray-200">
                        {mur.too}
                      </div>
                      <div className="text-base text-gray-600 mt-1 dark:text-gray-200">
                        {mur.utga}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="intro-y flex items-center h-10 mt-8">
            <h2 className="text-lg font-medium truncate mr-5 dark:text-gray-300">
              Байгууллагын жагсаалт
            </h2>
            <div className="ml-auto flex items-center text-theme-1 dark:text-theme-10 text-blue-400 dark:text-gray-400">
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#209669",
                  color: "#ffffff",
                }}
                onClick={() => zasakh()}
                icon={<PlusOutlined />}
              >
                Нэмэх
              </Button>
            </div>
          </div>
          <Table
            tableLayout={
              salbariinGaralt?.jagsaalt?.length > 0 ? "auto" : "fixed"
            }
            scroll={{ y: "calc(100vh - 31rem)" }}
            rowKey={(row) => row._id}
            columns={columns}
            loading={!salbariinGaralt}
            dataSource={salbariinGaralt?.jagsaalt}
            pagination={{
              current: salbariinGaralt?.khuudasniiDugaar,
              pageSize: salbariinGaralt?.khuudasniiKhemjee,
              total: salbariinGaralt?.niitMur,
              showSizeChanger: true,
              onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                setKhuudaslalt((kh) => ({
                  ...kh,
                  khuudasniiDugaar,
                  khuudasniiKhemjee,
                })),
            }}
          />
        </div>
      </div>
      {/* <div className="col-span-12 xl:col-span-3">
        <div className="col-span-12 md:col-span-6 xl:col-span-4 xxl:col-span-12 md:mt-3 xxl:mt-8">
          <div className="intro-x flex items-center md:h-10" />
          <div className="bg-white dark:bg-gray-900 p-2 h-0md:mt-5">
            <div className="flex flex-row p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-400 rounded-md">
              <img
                className="h-14 w-14"
                alt={baiguullaga?.ner}
                src={
                  baiguullaga?.zurgiinNer
                    ? `${url}/logoAvya/${baiguullaga?.zurgiinNer}`
                    : "/car.png"
                }
              />
              <div className="flex flex-col ml-3">
                <label>Барилгын нэр</label>
                <span className="text-gray-600 font-medium mt-1">
                  {baiguullaga?.ner}
                </span>
              </div>
            </div>
            <div className="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-400 rounded-md">
              <label>
                Хаяг:{" "}
                <span className="text-gray-600 font-medium">
                  {baiguullaga?.khayag}
                </span>
              </label>
            </div>
            <div className="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-400 rounded-md">
              <label>
                Давхар:{" "}
                <span className="text-gray-600 font-medium">
                  {baiguullaga?.utas}
                </span>
              </label>
            </div>
            <div className="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-400 rounded-md">
              <label>
                Талбай:{" "}
                <span className="text-gray-600 font-medium">
                  {baiguullaga?.utas}
                </span>
              </label>
            </div>
            <div className="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-400 rounded-md">
              <label>
                Повьлон тоо:{" "}
                <span className="text-gray-600 font-medium">
                  {baiguullaga?.utas}
                </span>
              </label>
            </div>
            <div className="flex items-center p-3 cursor-pointer transition duration-300 ease-in-out bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-400 rounded-md">
              <label>
                Сул повьлон тоо:{" "}
                <span className="text-gray-600 font-medium">
                  {baiguullaga?.utas}
                </span>
              </label>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4 xxl:col-span-12 mt-3 xxl:mt-8 h-72">
          <GazriinZurag
            ref={ref}
            center={bairshiluud[0]}
            zoom={13}
            afterLoadMap={afterLoadMap}
            useAfterLoadMap={bairshiluud?.length > 0}
            options={{
              fullscreenControlOptions: { position: 12 },
              disableDoubleClickZoom: true,
              fullscreenControl: true,
              zoomControl: false,
              mapTypeControl: false,
              streetViewControl: false,
              maxZoom: 19
            }}
          >
            {bairshiluud.map((mur, i) => (
              <Marker key={i} position={mur} />
            ))}
          </GazriinZurag>
        </div>
      </div> */}
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default BarilgaBurtgel;
