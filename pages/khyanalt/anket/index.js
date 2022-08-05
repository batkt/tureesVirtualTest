import { Button, DatePicker, Form, Input, message, Table, Tabs } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import moment from "moment";
import useOrder from "tools/function/useOrder";
import _ from "lodash";
const garalt = {
  khuudasniiDugaar: 1,
  khuudasniiKhemjee: 10,
};

import Admin from "components/Admin";
import router from "next/router";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Aos from "aos";
import useJagsaalt from "hooks/useJagsaalt";
import {
  EditOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import AsuultiinKhariultOruulakh from "components/pageComponents/anket/asuultiinKhariultOruulakh";
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function Khabea({ token }) {
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([
    moment(new Date()).format("YYYY-MM-DD 00:00:00"),
    moment(new Date()).format("YYYY-MM-DD 23:59:59"),
  ]);

  const { order, onChangeTable } = useOrder({ createdAt: -1 });

  const query = useMemo(
    () => ({
      createdAt: !!ekhlekhOgnoo
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    }),
    [ekhlekhOgnoo]
  );

  const survey = useJagsaalt("/survey", undefined, order);
  const Ref = React.useRef(null);

  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "index",
        className: "text-center",
        width: "2rem",
        render: (text, record, index) => index + 1,
        sorter: () => 0,
      },
      {
        title: "Огноо",
        key: "createdAt",
        dataIndex: "createdAt",
        align: "center",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD HH:mm");
        },
        sorter: () => 0,
      },
      {
        title: "Нэр",
        key: "ner",
        dataIndex: "ner",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Утас",
        key: "utas",
        dataIndex: "utas",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "И-мэйл",
        key: "mail",
        dataIndex: "mail",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Чиглэл",
        key: "chiglel",
        dataIndex: "chiglel",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Хугацаа",
        key: "uilAjillagaa",
        dataIndex: "uilAjillagaa",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Ажилтан тоо",
        key: "ajiltniiToo",
        dataIndex: "ajiltniiToo",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Талбайн хэмжээ",
        key: "talbainKhemjee",
        dataIndex: "talbainKhemjee",
        align: "center",
        ellipsis: true,
        sorter: () => 0,
      },
      {
        title: "Давхар",
        align: "center",
        dataIndex: "",
        ellipsis: true,
        render: (data) => {
          var turul = Array.from(new Set(data?.davkhar)).toString();
          return turul;
        },
        sorter: () => 0,
      },
      {
        title: "Нэмэлт",
        key: "nemeltMedeelel",
        dataIndex: "nemeltMedeelel",
        ellipsis: true,
        align: "center",
        sorter: () => 0,
      },
    ],
    []
  );

  function onChangeOgnoo(date, dateString) {
    setEkhlekhOgnoo(date);
  }

  useEffect(() => {
    Aos.init({ once: true });
  });

  function asuultiinKhariultOruulakh() {
    const footer = [
      <Button onClick={() => Ref.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => Ref.current.khadgalya()}
      >
        сонгох
      </Button>,
    ];
    modal({
      title: "Асуултын хариулт оруулах",
      icon: <FileExcelOutlined />,
      content: <AsuultiinKhariultOruulakh ref={Ref} />,
      footer,
    });
  }

  return (
    <Admin
      title="Анкетын асуулга бэлдэх"
      khuudasniiNer="anket"
      tsonkhniiId={"62ea0d2b7c54f8189bdca54c"}
      onSearch={(search) =>
        setAsuulgiinKhuudaslalt((kh) => ({
          ...kh,
          khuudasniiDugaar: 1,
          search,
        }))
      }
    >
      <div className="col-span-12 p-0 md:p-5">
        <Tabs>
          <TabPane
            key="1"
            tab={
              <span>
                <FileDoneOutlined style={{ fontSize: "32px" }} />
                Анкет бүртгэл
              </span>
            }
          >
            <div className="grid grid-cols-12 gap-5">
              <div className="box relative col-span-12 p-5 pt-1 md:col-span-4 xl:col-span-2">
                <span className="font-medium">Анкетын загвар үүсгэх</span>
                <Form className="pt-5" name="dynamic_form_item">
                  <Form.Item>
                    <Input placeholder="Анкетын нэр" />
                  </Form.Item>
                  <Form.List name="asuulga">
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map((key, name, fieldKey, ...restField) => (
                          <Form.Item key={fieldKey.key}>
                            <Form.Item
                              name={[name, "asuult"]}
                              fieldKey={[fieldKey, "asuult"]}
                              {...restField}
                              //validateTrigger={["onChange", "onBlur"]}
                              rules={[
                                {
                                  required: true,
                                  whitespace: true,
                                  message: "",
                                },
                              ]}
                              noStyle
                            >
                              <Input
                                placeholder={`Асуулт ${name + 1}`}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>

                            {fields.length > 1 ? (
                              <MinusCircleOutlined
                                className="dynamic-delete-button absolute top-0 -right-6 text-xl text-black text-opacity-50 dark:text-white dark:text-opacity-50"
                                onClick={() => remove(name)}
                              />
                            ) : null}
                            <Button
                              onClick={() => asuultiinKhariultOruulakh()}
                              style={{ width: "100%" }}
                              className="rounded-t-md"
                            >
                              Хариултын төрөл оруулах
                            </Button>
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            htmlType="submit"
                            onClick={() => add()}
                            style={{ width: "100%" }}
                            icon={<PlusOutlined />}
                          >
                            Асуулт нэмэх
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Form>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="absolute bottom-2 right-2"
                >
                  Хадгалах
                </Button>
              </div>
              <div className="box col-span-12 overflow-auto p-5 md:col-span-8 xl:col-span-10">
                <div
                  className="flex justify-between"
                  data-aos="fade-right"
                  data-aos-duration="1000"
                >
                  <RangePicker
                    style={{ marginBottom: "15px" }}
                    size="large"
                    disabledTime
                    defaultValue={[
                      moment(new Date(), "YYYY-MM-DD"),
                      moment(new Date(), "YYYY-MM-DD"),
                    ]}
                    format={"YYYY-MM-DD"}
                    onChange={onChangeOgnoo}
                  />
                </div>
                <div
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="200"
                  data-aos-anchor-placement="top-bottom"
                >
                  <Table
                    bordered
                    size="small"
                    tableLayout="fixed"
                    scroll={{ y: "calc(100vh - 20rem)" }}
                    onChange={(a, b, c) => onChangeTable(a, b, c)}
                    rowClassName={(record, index) =>
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-600 h-0.5"
                        : "bg-gray-200 dark:bg-gray-800 h-0.5"
                    }
                    dataSource={survey?.jagsaalt}
                    columns={columns}
                  />
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane
            key="2"
            tab={
              <span>
                <EditOutlined style={{ fontSize: "32px" }} />
                Анкет ...
              </span>
            }
          ></TabPane>
        </Tabs>
      </div>
    </Admin>
  );
}
export const getServerSideProps = shalgaltKhiikh;

export default Khabea;
