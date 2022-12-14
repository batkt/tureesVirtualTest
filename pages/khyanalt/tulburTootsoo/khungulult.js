import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  notification,
  Popconfirm,
  Select,
  Table,
  Tabs,
} from "antd";
import Admin from "components/Admin";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import useKhungulultTuukh from "hooks/tulburTootsoo/useKhungulultTuukh";
import _, { set } from "lodash";
import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import createMethod from "tools/function/crud/createMethod";
import formatNumber from "tools/function/formatNumber";
import Aos from "aos";
import { modal } from "components/ant/Modal";


const Tailbar = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tailbar, setTailbar] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tailbar);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [tailbar]
  );
  return (
    <div>
      <Input.TextArea
        value={tailbar}
        onChange={({ target }) => setTailbar(target?.value)}
      />
    </div>
  );
});

function tulburTootsoo() {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()]);
  const formRef = useRef();
  const [songogdsonGereenuud, setSongogdsonGereenuud] = useState([]);
  const tailbarRef = React.useRef(null);
  const [shuult, setShuult] = React.useState({
    query: { tuluv: { $ne: -1 } },
  });
  const [songogdsonNuur, setSongogdsonNuur] = useState("1");
  const query = useMemo(() => {
    return {
      createdAt: ekhlekhOgnoo
        ? {
          $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
          $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
        }
        : undefined,
    };
  }, [ekhlekhOgnoo]);
  const [form] = Form.useForm();
  const { gereeniiMedeelel, setGereeniiKhuudaslalt, isValidating } =
    useGereeniiJagsaalt(
      songogdsonNuur === "1" && token,
      baiguullaga?._id,
      undefined,
      shuult?.query,
      undefined,
      1000
    );
  const {
    khungulultTuukh,
    khungulultTuukhMutate,
    setKhuudaslalt,
    isValidating2,
  } = useKhungulultTuukh(
    songogdsonNuur === "2" && token,
    baiguullaga?._id,
    query
  );

  const [tootsoolol, setTootsoolol] = useState({
    niitTalbai: 0,
    niitSariinTurees: 0,
    khunglugdsunDun: 0,
    niitTulukhDun: 0,
  });
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [waiting, setWaiting] = useState(false);

  const { Option } = Select;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    if (form.getFieldValue("turul") === "Бүгд") {
      onSelectChange(gereeniiMedeelel?.jagsaalt.map((r) => r._id), gereeniiMedeelel?.jagsaalt)
    }
  }, [shuult, form])

  useEffect(() => {
    khungulukhDunTootsoolyo();
  }, [songogdsonGereenuud]);

  function disabledDate(current) {
    return current && current < moment().endOf("day");
  }
  function handleChange(value) {
    if (value.length > 0) {
      setShuult({
        query: { davkhar: value, tuluv: { $nin: -1 } },
      });
    } else {
      setShuult({ query: { tuluv: { $ne: -1 } } })
      setRowKeys([]);
      setSongogdsonGereenuud([]);
    }
  }
  function nukhtulSongokh(value) {
    if (value === "Бүгд") {
      setShuult({ query: { tuluv: { $ne: -1 } } });
      form.setFieldValue("davkhar", []);
    } else {
      setRowKeys([]);
      setSongogdsonGereenuud([]);
    }
  }
  function khungulultKhadgalya() {
    setWaiting(true);
    if (
      ajiltan?.erkh !== "Admin" &&
      !_.get(ajiltan, `tokhirgoo.khungulultUzuulekhEsekh`)?.find(
        (a) => a === barilgiinId
      )
    ) {
      setWaiting(false);
      notification.warning({
        message: "Таньд гэрээ хөнгөлөх эрх байхгүй байна.",
      });
      return;
    }
    if (songogdsonGereenuud.length > 0) {
      var ugugdul = form.getFieldsValue();
      ugugdul.ognoonuud = [
        moment(ugugdul.ognoonuud).format("YYYY-MM-01 00:00:00"),
      ];
      ugugdul.barilgiinId = barilgiinId;
      ugugdul.tulukhDun = tootsoolol.niitSariinTurees;
      ugugdul.khungulsunDun = tootsoolol.niitTulukhDun;
      ugugdul.khungulultiinDun = tootsoolol.khunglugdsunDun;
      ugugdul.khamaataiGereenuud = songogdsonGereenuud.map(
        (x) => (x._id = x._id)
      );

      createMethod("khungulultKhadgalya", token, ugugdul)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            setWaiting(false);
            message.success("Хөнгөлөлт амжилттай хийгдлээ");
            formRef.current.resetFields();
            setTootsoolol({});
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else {
      setWaiting(false);
      message.warning("Хөнгөлөх талбай сонгоно уу");
    }
  }
  function ustgaya(mur) {
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        Устгах
      </Button>,
    ];
    modal({
      title: "Төлөлт устгах шалтгаан",
      icon: <DeleteOutlined />,
      content: (
        <Tailbar
          ref={tailbarRef}
          confirm={(tailbar) =>
            uilchilgee(token)
              .post("/khungulultUstgaya", {
                id: mur?._id, tailbar
              })
              .then(({ data }) => {
                if (data !== undefined) {
                  khungulultTuukhMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
                  message.success("Устгагдлаа");
                }
              })
          }
        />
      ),
      footer,
    });
  }
  function tseverlekh() {
    formRef.current.resetFields();
    setShuult({ query: { tuluv: { $ne: -1 } } });
    setRowKeys([]);
  }

  const columns = useMemo(() => {
    return [
      {
        title: "Огноо",
        dataIndex: "createdAt",
        ellipsis: true,
        align: "center",
        width: "7rem",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD hh:mm:ss");
        },
      },
      {
        title: "Хөнгөлөлт %",
        dataIndex: "khungulukhKhuvi",
        ellipsis: true,
        width: "7rem",
        align: "center",
      },
      {
        title: "Хугацаа",
        width: "7rem",
        dataIndex: "ognoonuud",
        ellipsis: true,
        align: "center",
        render: (data) => {
          return moment(data && data[0])
            .add(-1, "d")
            .format("YYYY-MM-DD");
        },
      },
      {
        title: "Төлөх дүн",
        summary: true,
        width: "7rem",
        dataIndex: "tulukhDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: "Хөнгөлөх дүн",
        summary: true,
        width: "7rem",
        dataIndex: "khungulultiinDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: "Төлсөн дүн",
        width: "7rem",
        summary: true,
        dataIndex: "khungulsunDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: "Төрөл",
        width: "7rem",
        dataIndex: "turul",
        ellipsis: true,
        align: "center",
      },
      {
        title: "Шалтгаан",
        width: "7rem",
        dataIndex: "shaltgaan",
        ellipsis: true,
        align: "center",
      },
      {
        title: "Ажилтан",
        width: "7rem",
        dataIndex: "guilgeeKhiisenAjiltniiNer",
        align: "center",
        showSorterTooltip: false,
        sorter: true,
      },
      {
        title: () => <SettingOutlined />,
        width: "60px",
        align: "center",
        render(data) {
          return (
            <Popconfirm
              title="хөнгөлөлт устгах уу?"
              okText="Тийм"
              cancelText="Үгүй"
              onConfirm={() => ustgaya(data)}
            >
              <Button
                danger
                size="small"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          );
        },
      },
    ]
  })

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "control-ref_davkhar":
          formRef.current.getFieldInstance("khungulukhKhuvi").focus();
          break;
        case "control-ref_khungulukhKhuvi":
          formRef.current.getFieldInstance("shaltgaan").focus();
          break;
        case "control-ref_shaltgaan":
          document.getElementById("khungulultKhadgalya").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  function onSelectChange(selectedRowKeys, selectedRows) {
    setRowKeys(selectedRowKeys);
    setSongogdsonGereenuud(selectedRows);
  }

  function khungulukhDunTootsoolyo() {
    var khuvi = form?.getFieldValue("khungulukhKhuvi");
    if (khuvi > 100) {
      form.setFieldsValue({ khungulukhKhuvi: 100 });
      khuvi = 100;
    }
    tootsoolol.niitTalbai = songogdsonGereenuud?.length;
    tootsoolol.niitSariinTurees = songogdsonGereenuud?.reduce(
      (a, b) => a + Number(b?.sariinTurees || 0),
      0
    );
    tootsoolol.khunglugdsunDun =
      (Number(tootsoolol.niitSariinTurees) * khuvi) / 100;
    tootsoolol.niitTulukhDun =
      Number(tootsoolol.niitSariinTurees) - Number(tootsoolol.khunglugdsunDun);
    setTootsoolol({ ...tootsoolol });
  }

  return (
    <Admin
      title="Хөнгөлөлт"
      khuudasniiNer="khungulult"
      className="p-0 pb-12 px-3 md:px-4 md:pb-0 md:p-4"
      onSearch={(search) => {
        setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }));
        setGereeniiKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      }}
      loading={waiting || isValidating || isValidating2}
      tsonkhniiId="61c2c6eb1c2830c4e6f90cc5"
    >
      <div className="col-span-12">
        <Tabs size="large" onChange={(v) => setSongogdsonNuur(v)}>
          <Tabs.TabPane tab="Хөнгөлөлт оруулах" key="1">
            <div className="grid w-full grid-cols-12 gap-6">
              <div
                className="col-span-12 rounded-md border border-solid border-green-300 bg-white p-5 dark:bg-gray-900 md:col-span-8 xl:col-span-3"
                data-aos="fade-right"
                data-aos-duration="1000"
              >
                <Form
                  onFinish={khungulultKhadgalya}
                  form={form}
                  autoComplete={"off"}
                  ref={formRef}
                  name="control-ref"
                  initialValues={{ remember: true }}
                  labelCol={{
                    span: 9,
                  }}
                  wrapperCol={{
                    span: 14,
                  }}
                  layout="horizontal"
                >
                  <Form.Item
                    name="ognoonuud"
                    label="Хөнгөлөх сар"
                    rules={[
                      {
                        required: true,
                        message: "Хөнгөлөх сар бүртгэнэ үү!",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      disabledDate={disabledDate}
                      picker="month"
                      placeholder="Сар"
                      onChange={() =>
                        formRef.current.getFieldInstance("turul").focus()
                      }
                    />
                  </Form.Item>
                  <Form.Item name="turul" label="Нөхцөл">
                    <Select
                      placeholder="Нөхцөл"
                      onChange={(v) => {
                        nukhtulSongokh(v);
                        formRef.current.getFieldInstance("davkhar").focus();
                      }}
                    >
                      <Option value="Давхраар">Давхраар</Option>
                      <Option value="Бүгд">Бүгд</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="davkhar" label="Давхар">
                    <Select
                      mode="multiple"
                      placeholder="Давхар"
                      onChange={handleChange}
                      disabled={
                        form?.getFieldValue("turul") === "Бүгд" ? true : false
                      }
                    >
                      {baiguullaga?.barilguud
                        ?.find((b) => b._id === barilgiinId)
                        ?.davkharuud.map((a) => (
                          <Select.Option key={a.davkhar} value={a.davkhar}>
                            {a.davkhar}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="Хөнгөлөх хувь" name="khungulukhKhuvi">
                    <Input
                      onKeyDown={focuser}
                      type={"number"}
                      placeholder="Хөнгөлөх хувь"
                      onChange={khungulukhDunTootsoolyo}
                    />
                  </Form.Item>
                  <Form.Item label="Шалтгаан" name="shaltgaan">
                    <Input.TextArea
                      onKeyDown={focuser}
                      placeholder="Шалтгаан"
                    />
                  </Form.Item>
                  <div className="flex-column mt-12 grid text-base dark:text-gray-50">
                    <div className="flex justify-between">
                      Нийт талбайн тоо :<a>{tootsoolol.niitTalbai}</a>
                    </div>
                    <div className="flex justify-between">
                      Нийт түрээсийн орлого :
                      <a>{formatNumber(tootsoolol.niitSariinTurees || 0)}</a>
                    </div>
                    <div className="flex justify-between">
                      Нийт хөнгөлөгдсөн дүн :
                      <a className="text-red-400">
                        {formatNumber(tootsoolol.khunglugdsunDun || 0)}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      Нийт төлөх дүн :
                      <a className="text-green-500">
                        {formatNumber(tootsoolol.niitTulukhDun || 0)}
                      </a>
                    </div>
                  </div>
                  <div className="mt-10 flex flex-row justify-between  ">
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        onClick={tseverlekh}
                        //style={{ backgroundColor: "#209669", color: "#ffffff" }}
                        className="border-red-400 dark:border-red-400 dark:bg-gray-900 "
                      >
                        <span className="text-red-400 dark:text-red-400">
                          Цэвэрлэх
                        </span>
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        id="khungulultKhadgalya"
                        onClick={() => form.submit()}
                        type="primary"
                      >
                        <span className="text-white">Хадгалах</span>
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>

              <div
                className="box col-span-12 overflow-auto p-5 md:col-span-3 xl:col-span-9"
                data-aos="fade-right"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <Table
                  rowSelection={rowSelection}
                  bordered
                  scroll={{ y: "calc(100vh - 20rem)" }}
                  size="small"
                  loading={!gereeniiMedeelel}
                  rowKey={(row) => row._id}
                  dataSource={gereeniiMedeelel?.jagsaalt}
                  columns={[
                    {
                      title: "Гэрээ",
                      dataIndex: "gereeniiDugaar",
                      className: "text-center",
                      align: "center",
                      width: "7rem",
                      showSorterTooltip: false,
                      sorter: (a, b) =>
                        a.gereeniiDugaar?.localeCompare(b.gereeniiDugaar),
                    },
                    {
                      title: "Талбай",
                      dataIndex: "talbainDugaar",
                      className: "text-center",
                      align: "center",
                      width: "7rem",
                      showSorterTooltip: false,
                      sorter: (a, b) =>
                        a.talbainDugaar?.localeCompare(b.talbainDugaar),
                    },
                    {
                      title: "Давхар",
                      dataIndex: "davkhar",
                      align: "center",
                      width: "5rem",
                      className: "text-center",
                      showSorterTooltip: false,
                      sorter: (a, b) =>
                        Number(a.davkhar || 0) - Number(b.davkhar || 0),
                    },
                    {
                      title: "Талбай /м2/",
                      dataIndex: "talbainKhemjee",
                      align: "center",
                      width: "7rem",
                      className: "text-center",
                      render: (talbainKhemjee) => {
                        return `${talbainKhemjee} м2`;
                      },
                      showSorterTooltip: false,

                      sorter: (a, b) =>
                        Number(a.talbainKhemjee || 0) -
                        Number(b.talbainKhemjee || 0),
                    },
                    {
                      title: "Төлбөр",
                      dataIndex: "sariinTurees",
                      className: "text-center",
                      width: "7rem",
                      align: "center",
                      render: (sariinTurees) => {
                        return formatNumber(sariinTurees || 0);
                      },
                      showSorterTooltip: false,
                      sorter: (a, b) =>
                        Number(a.sariinTurees || 0) -
                        Number(b.sariinTurees || 0),
                    },
                  ]}
                  pagination={false}
                />
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Хөнгөлөлт түүх" key="2">
            <div className="grid w-full grid-cols-12 gap-6">
              <div className="box col-span-12 p-5 md:col-span-8 xl:col-span-12">
                <div className="mt-5 flex w-full flex-row justify-between">
                  <DatePicker.RangePicker
                    style={{ marginBottom: "20px" }}
                    size="middle"
                    value={ekhlekhOgnoo}
                    onChange={setEkhlekhOgnoo}
                  />
                </div>

                <Table
                  bordered
                  tableLayout={"fixed"}
                  size="small"
                  rowClassName="hover:bg-blue-100"
                  dataSource={khungulultTuukh?.jagsaalt}
                  summary={() => <Table.Summary fixed> {!!columns && !!khungulultTuukh && <Table.Summary.Row>
                    {columns?.map((mur, index) => <Table.Summary.Cell className={`${mur.summary !== true ? "border-none" : "font-bold"}`} index={index} align='right'>{mur.summary ? formatNumber(khungulultTuukh?.jagsaalt?.reduce((a, b) => a + (b[mur.dataIndex] || 0), 0)) : ''}{mur.summary && "₮"}</Table.Summary.Cell>)}
                  </Table.Summary.Row>}</Table.Summary>}
                  pagination={{
                    current: khungulultTuukh?.khuudasniiDugaar,
                    pageSize: 100,
                    total: khungulultTuukh?.niitMur,
                    showSizeChanger: true,
                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                      setKhuudaslalt((kh) => ({
                        ...kh,
                        khuudasniiDugaar,
                        khuudasniiKhemjee,
                      })),
                  }}
                  scroll={{ y: "calc(100vh - 26rem)" }}
                  rowKey={(row) => row._id}
                  className="t-head"
                  columns={columns}
                />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default tulburTootsoo;
