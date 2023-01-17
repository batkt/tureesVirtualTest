import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
} from "antd";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import moment from "moment";
import _ from "lodash";

import Admin from "components/Admin";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileExcelOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";

import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useAuth } from "services/auth";
import useJagsaalt from "hooks/useJagsaalt";
import { modal } from "components/ant/Modal";
import AnketBurtgel from "components/pageComponents/anket/[id]";
import AnketIlgeekh from "components/pageComponents/anket/AnketIlgeekh";
import CardList from "components/cardList";
import AnketTile from "components/pageComponents/anket/AnketTile";

function Khariultuud(record) {
  const query = useMemo(() => {
    let asuultiinId = record.record._id;
    return { asuultiinId };
  }, [record, khariult]);
  const khariult = useJagsaalt("/khariult", query);

  const columns2 = useMemo(() => {
    let returnValue = [
      {
        title: "№",
        width: "3rem",
        align: "center",
        render: (text, record, index) =>
          (khariult?.khuudasniiDugaar || 0) *
          (khariult?.khuudasniiKhemjee || 0) -
          (khariult?.khuudasniiKhemjee || 0) +
          index +
          1,
      },
    ];

    record?.record?.asuultuud?.forEach((mur) =>
      returnValue.push({ title: mur.asuult, dataIndex: mur.asuult, width: "15rem" })
    );
    returnValue.push({
      title: "Анкет ирсэн огноо",
      width: "12rem",
      align: "center",
      dataIndex: "createdAt",
      render: (data) =>
        moment(data).format("YYYY-MM-DD HH:mm")
    })

    return returnValue;
  }, [khariult]);

  const dataSource = useMemo(() => {
    let returnValue = [];
    khariult?.jagsaalt.forEach((mur, index) => {
      let murObject = {};
      mur.khariultuud.forEach((khariult) => {
        murObject[khariult.asuult] = khariult.khariult;
      });
      returnValue.push(murObject);
    });
    return returnValue;
  }, [khariult]);

  return (
    <div className="col-span-12 rounded-md bg-white p-5 dark:bg-gray-900">
      <Table
        scroll={{ x: "calc(100vw - 15rem)" }}
        dataSource={dataSource}
        bordered
        size="small"
        columns={columns2}
        tableLayout={"fixed"}
        rowKey={(row) => row._id}
        pagination={{
          current: khariult?.khuudasniiDugaar,
          pageSize: khariult?.khuudasniiKhemjee,
          total: khariult?.niitMur,
          showSizeChanger: true,
          onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
            khariult.setKhuudaslalt((kh) => ({
              ...kh,
              khuudasniiDugaar,
              khuudasniiKhemjee,
            })),
        }}
      />
    </div>
  );
}

const { TabPane } = Tabs;
const str = "A";

function Anket({ token }) {
  const { ajiltan, barilgiinId } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ]);
  const query = { barilgiinId: barilgiinId };

  const [form] = Form.useForm();
  const asuult = useJagsaalt(ajiltan && "/asuult", query);

  const formRef = useRef();
  const anketRef = React.useRef(null);
  const ilgeekhRef = React.useRef();
  const [anketIlgeekh, setAnketIlgeekh] = useState(false);
  const [hide, setHide] = React.useState(true);

  const khariult = useJagsaalt(ajiltan && "/khariult");

  const columns = useMemo(() => [
    {
      title: "№",
      width: "3rem",
      align: "center",
      render: (text, record, index) =>
        (khariult?.khuudasniiDugaar || 0) * (khariult?.khuudasniiKhemjee || 0) -
        (khariult?.khuudasniiKhemjee || 0) +
        index +
        1,
    },
    {
      title: "Асуултын нэр",
      dataIndex: "ner",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Асуултын төрөл",
      dataIndex: "turul",
      ellipsis: true,
      align: "center",
    },
    {
      title: "Огноо",
      dataIndex: "createdAt",
      ellipsis: true,
      align: "center",
      render: (a) => {
        return moment(a).format("YYYY-MM-DD");
      },
    },
  ]);

  useEffect(() => {
    Aos.init({ once: true });
  });

  function anketBurtgey(v) {
    v.barilgiinId = barilgiinId;
    uilchilgee(token)
      .post("/asuult", v)
      .then(({ data }) => {
        if (data !== undefined) {
          message.success("Анкет амжилттай хийгдлээ");
          formRef.current.resetFields();
          asuult.mutate();
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  function anketUstgay(data) {
    uilchilgee(token)
      .delete("/asuult/" + data._id)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          asuult.mutate();
          message.success("Устгагдлаа");
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  function anketZagvar(data) {
    const footer = [
      <Space className="flex justify-end">
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          onClick={() => anketRef.current.khaaya()}
        >
          Хаах
        </Button>
      </Space>,
    ];
    modal({
      width: "80vw",
      title: "",
      icon: <FileExcelOutlined />,
      content: <AnketBurtgel ref={anketRef} data={data} />,
      footer,
    });
  }

  useEffect(() => {
    form.getFieldInstance("ner").focus();
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "dynamic_form_item_ner":
          form.getFieldInstance("turul").focus();
          break;
        case "dynamic_form_item_turul":
          document.getElementById("asuultNemekhButton").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <Admin
      title="Анкетын асуулга бэлдэх"
      khuudasniiNer="anket"
      tsonkhniiId={"62ea0d2b7c54f8189bdca54c"}
    >
      <div className="col-span-12 p-3 pt-0 md:p-5 lg:py-0">
        <Drawer
          title={"Анкет илгээх"}
          width={global.innerWidth < 768 ? "90vw" : "50vw"}
          onClose={() => setAnketIlgeekh(false)}
          visible={anketIlgeekh === true}
        >
          {anketIlgeekh === true && (
            <AnketIlgeekh
              ref={ilgeekhRef}
              token={token}
              data={asuult.jagsaalt}
              barilgiinId={barilgiinId}
            />
          )}
        </Drawer>
        <div className="absolute top-3 right-3 z-50 hidden lg:flex">
          <Button
            style={{ backgroundColor: "#209669", color: "#ffffff" }}
            icon={<SendOutlined />}
            onClick={() => {
              setAnketIlgeekh(true);
            }}
          >
            Анкет илгээх
          </Button>
        </div>
        <Tabs>
          <TabPane
            key="1"
            tab={
              <span
                className="text-base font-medium"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                Асуумж
              </span>
            }
          >
            <div className="flex grid-cols-12 flex-col-reverse gap-5 md:grid">
              <div
                className="box relative col-span-12 p-4 py-5 pt-3 md:col-span-4 xl:col-span-3"
                style={{ height: "80vh" }}
                data-aos="fade-right"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <span className="font-medium dark:text-gray-100">
                  Анкетын загварууд
                </span>
                <div className="mt-5 flex flex-col gap-5">
                  {asuult?.data?.jagsaalt?.map((a) => {
                    return (
                      <div
                        key={a._id}
                        className="flex w-full items-center justify-between rounded-xl border border-green-600 bg-green-600 bg-opacity-5 p-2 shadow-lg dark:text-gray-200 md:block lg:flex"
                      >
                        <div>{a.ner}</div>
                        <div className="flex justify-end gap-2">
                          <Button
                            className="bg-white text-blue-400 hover:text-blue-600 dark:bg-gray-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              anketZagvar(a);
                            }}
                            icon={<EyeOutlined />}
                          />
                          <Popconfirm
                            placement="right"
                            title={"Та анкетын загвар устгах гэж байна!"}
                            onConfirm={(e) => {
                              e.stopPropagation();
                              anketUstgay(a);
                            }}
                            okText="Тийм"
                            cancelText="Үгүй"
                          >
                            <Button
                              className="bg-white text-red-400 hover:text-red-600 dark:bg-gray-900"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className="box col-span-12 overflow-auto p-5 py-5 pt-3 md:col-span-8 xl:col-span-9"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <span className=" font-medium dark:text-gray-100 lg:px-5">
                  Анкетын загвар үүсгэх
                </span>
                <Form
                  ref={formRef}
                  form={form}
                  className="pt-5 lg:px-5"
                  name="dynamic_form_item"
                  autoComplete={"off"}
                  onFinish={(v) => {
                    anketBurtgey(v);
                  }}
                >
                  <div>
                    <div className="grid-cols-2 gap-5 lg:grid">
                      <Form.Item name="_id" hidden></Form.Item>
                      <Form.Item name="barilgiinId" hidden></Form.Item>
                      <Form.Item
                        className="w-full"
                        name="ner"
                        rules={[
                          {
                            required: true,
                            message: "Нэр оруулна уу!",
                          },
                        ]}
                      >
                        <Input
                          autoFocus={true}
                          onKeyUp={focuser}
                          placeholder="Анкетын нэр"
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-full"
                        name="turul"
                        rules={[
                          {
                            required: true,
                            message: "Төрөл сонгоно уу!",
                          },
                        ]}
                      >
                        <Input onKeyUp={focuser} placeholder="Төрөл" />
                      </Form.Item>
                    </div>
                    <Form.List
                      rules={[
                        {
                          required: true,
                          message: "Асуулт оруулна уу!",
                        },
                      ]}
                      name="asuultuud"
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          <Form.Item className=" pb-3">
                            <Button
                              type="dashed"
                              id="asuultNemekhButton"
                              onClick={() => {
                                add();
                                let div =
                                  document?.getElementById("form-container");
                                div?.lastElementChild?.scrollIntoView({
                                  behavior: "smooth",
                                });
                              }}
                              className="dark:bg-gray-800 dark:text-white"
                              style={{ width: "100%" }}
                              icon={<PlusOutlined />}
                            >
                              Асуулт нэмэх
                            </Button>
                          </Form.Item>
                          <div
                            className="hideScroll -my-8 grid w-full gap-2 overflow-y-auto py-5 pl-1 pr-1 lg:grid-cols-2 lg:gap-5 lg:pl-5 lg:pr-8 xl:grid-cols-3 2xl:grid-cols-4"
                            style={{ maxHeight: "50vh" }}
                            id={"form-container"}
                          >
                            {fields.map((key, name, fieldKey, ...restField) => (
                              <Form.Item
                                className="rounded-md border py-4 px-2 shadow-lg "
                                key={fieldKey.key}
                              >
                                <div className="relative space-y-3">
                                  <Form.Item
                                    name={[name, "asuult"]}
                                    fieldKey={[fieldKey, "asuult"]}
                                    {...restField}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Асуулт оруулна уу!",
                                      },
                                    ]}
                                  //validateTrigger={["onChange", "onBlur"]}
                                  >
                                    <Input
                                      placeholder={`Асуулт ${name + 1}`}
                                      style={{ width: "100%" }}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    rules={[
                                      {
                                        required: true,
                                        message: "Төрөл сонгоно уу!",
                                      },
                                    ]}
                                    name={[name, "turul"]}
                                    fieldKey={[fieldKey, "turul"]}
                                    {...restField}
                                  >
                                    <Select
                                      placeholder="Хариултын төрөл"
                                      options={[
                                        { label: "Бөглөх", value: "boglokh" },
                                        { label: "Сонгох", value: "songokh" },
                                      ]}
                                      onChange={(e) =>
                                        e === "songokh"
                                          ? setHide(false)
                                          : setHide(true)
                                      }
                                    />
                                  </Form.Item>
                                  {fields.length > 1 ? (
                                    <div className="absolute -top-11 -right-3 rounded-full bg-white dark:bg-gray-900 lg:-top-10 lg:-right-6">
                                      <CloseCircleOutlined
                                        className="dynamic-delete-button text-3xl text-black text-opacity-60 dark:text-white dark:text-opacity-50"
                                        onClick={() => remove(name)}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                                <Form.List
                                  name={[name, "khariultuud"]}
                                  fieldKey={[fieldKey, "khariultuud"]}
                                  noStyle
                                >
                                  {(fields, { add, remove }, { errors }) => (
                                    <>
                                      {fields.map(
                                        (
                                          key,
                                          khname,
                                          khfieldKey,
                                          ...restField
                                        ) => (
                                          <Form.Item
                                            key={khfieldKey.key}
                                            rules={[{ required: true }]}
                                            fieldKey={[khfieldKey]}
                                            name={[khname]}
                                            noStyle
                                            {...restField}
                                          >
                                            <div className="relative py-2 pr-8">
                                              <Input
                                                placeholder={`Хариулт ${String.fromCharCode(
                                                  str.charCodeAt(
                                                    str.length - 1
                                                  ) + khname
                                                )}`}
                                                style={{ width: "100%" }}
                                              />
                                              <MinusCircleOutlined
                                                className="dynamic-delete-button absolute right-2 top-0 text-xl text-black text-opacity-50 dark:text-white dark:text-opacity-50"
                                                onClick={() => remove(name)}
                                              />
                                            </div>
                                          </Form.Item>
                                        )
                                      )}
                                      <Button
                                        className="mt-3 dark:bg-gray-800 dark:text-white "
                                        style={{ width: "100%" }}
                                        onClick={() => add([name])}
                                        icon={<PlusOutlined />}
                                      >
                                        Хариулт оруулах
                                      </Button>
                                    </>
                                  )}
                                </Form.List>
                              </Form.Item>
                            ))}
                          </div>
                        </>
                      )}
                    </Form.List>
                  </div>
                  <Form.Item className="flex justify-end">
                    <Button
                      type="primary"
                      onClick={() => form.submit()}
                      className="w-full"
                    >
                      Хадгалах
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <div className="box col-span-12 p-5 lg:hidden">
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  icon={<SendOutlined />}
                  onClick={() => {
                    setAnketIlgeekh(true);
                  }}
                >
                  Анкет илгээх
                </Button>
              </div>
            </div>
          </TabPane>
          <TabPane
            key="2"
            tab={
              <span
                className="text-base font-medium"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                Жагсаалт
              </span>
            }
          >
            <div className="box col-span-12 mb-5 p-5 lg:hidden">
              <Button
                type="primary"
                style={{ width: "100%" }}
                icon={<SendOutlined />}
                onClick={() => {
                  setAnketIlgeekh(true);
                }}
              >
                Анкет илгээх
              </Button>
            </div>
            <div className="box col-span-12 px-2 py-2 lg:px-5">
              <div className="text-md px-1 pb-4 font-medium lg:px-0">
                Анкетын хариултын жагсаалт
              </div>

              <div className="dark:bg-gray-900 lg:p-5">
                <Table
                  className="hidden lg:block"
                  dataSource={asuult?.jagsaalt}
                  bordered
                  size="small"
                  columns={columns}
                  expandable={{
                    expandedRowRender: (record) => (
                      <Khariultuud record={record} />
                    ),
                    rowExpandable: (record) => record.name !== "Not Expandable",
                  }}
                  rowKey={(row) => row._id}
                  pagination={{
                    current: khariult?.khuudasniiDugaar,
                    pageSize: khariult?.khuudasniiKhemjee,
                    total: khariult?.niitMur,
                    showSizeChanger: true,
                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                      khariult.setKhuudaslalt((kh) => ({
                        ...kh,
                        khuudasniiDugaar,
                        khuudasniiKhemjee,
                      })),
                  }}
                />
                <CardList
                  keyValue="anket"
                  className="block overflow-auto px-2 lg:hidden"
                  jagsaalt={asuult?.jagsaalt}
                  Component={AnketTile}
                  pagination={{
                    current: asuult?.khuudasniiDugaar,
                    pageSize: asuult?.khuudasniiKhemjee,
                    total: asuult?.niitMur,
                    showSizeChanger: true,
                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                      asuult?.setKhuudaslalt((kh) => ({
                        ...kh,
                        khuudasniiDugaar,
                        khuudasniiKhemjee,
                      })),
                  }}
                />
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default Anket;
