import React, { useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import readMethod from "tools/function/crud/readMethod";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { Button, Form, Input, message, Modal, Switch } from "antd";
import { useAuth } from "services/auth";
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { modal } from "components/ant/Modal";
import ZaaltZasvar from "components/pageComponents/geree/zagvar/ZaaltZasvar";
import _ from "lodash";
import { aldaaBarigch } from "services/uilchilgee";

function ZakhialgaNemekh({ token }) {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const { baiguullaga, barilgiinId } = useAuth();
  const [gereeniiZagvar, setGereeniiZagvar] = React.useState({
    dedKhesguud: [{ zaalt: "new" }],
  });
  const [towchTuluv, setTowchTuluv] = useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    if (id !== "new")
      readMethod("gereeniiZagvar", token, id).then(({ data }) => {
        if (data) {
          form.setFieldsValue(data);
          setGereeniiZagvar({ ...data });
        }
      });
  }, [id]);

  function onFinish(values) {
    setTowchTuluv(true);
    if (!gereeniiZagvar?._id) {
      values["baiguullagiinNer"] = baiguullaga.ner;
      values["baiguullagiinId"] = baiguullaga._id;
      values["dedKhesguud"] = gereeniiZagvar.dedKhesguud;
      values["barilgiinId"] = barilgiinId;
      createMethod("gereeniiZagvar", token, values)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success("Амжилттай хадгаллаа");
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setTowchTuluv(false);
        });
    } else if (!!gereeniiZagvar?._id) {
      gereeniiZagvar.ner = values.ner;
      updateMethod("gereeniiZagvar", token, gereeniiZagvar)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success("Амжилттай хадгаллаа");
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setTowchTuluv(false);
        });
    }
  }

  function docZasya(key, value) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => ref.current.khadgalya()}
      >
        Хадгалах
      </Button>,
    ];

    function change(utga) {
      _.set(gereeniiZagvar, key, utga);
      let value = _.cloneDeep(gereeniiZagvar);
      setGereeniiZagvar(value);
    }
    modal({
      title: "Заалт засах",
      icon: <FileExcelOutlined />,
      content: (
        <ZaaltZasvar ref={ref} token={token} value={value} change={change} />
      ),
      footer,
    });
  }

  function docUstgaya(key, mur) {
    Modal.confirm({
      content: (
        <div>
          <div dangerouslySetInnerHTML={{ __html: mur.zaalt }} />
          <span className="font-medium">
            Заалтыг гэрээний загвараас устгахдаа итгэлтэй байна уу?
          </span>
        </div>
      ),
      okText: "Тийм",
      cancelText: "Үгүй",
      onOk: () => {
        gereeniiZagvar.dedKhesguud.splice(key, 1);
        let value = _.cloneDeep(gereeniiZagvar);
        setGereeniiZagvar(value);
      },
    });
  }

  function docNemekh(key, mur) {
    mur.zaalt = "<b>Шинэ заалт</b>";
    gereeniiZagvar.dedKhesguud.splice(key + 1, 0, mur);
    let value = _.cloneDeep(gereeniiZagvar);
    setGereeniiZagvar(value);
  }

  return (
    <Admin
      khuudasniiNer="zakhialgiinKhyanalt"
      title="Гэрээний загвар угсрах"
      hideSearch
      dedKhuudas
      className="p-4"
    >
      <div className="box col-span-12 p-4 lg:col-span-9 xl:col-span-10">
        <div className="flex w-full flex-col space-y-1">
          <div className="flex w-full flex-row justify-between">
            <div className="group relative">
              <div
                className="rounded-md border border-dashed border-gray-600 p-2"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.zuunTolgoi ||
                    "Гэрээний загварын баруун толгой",
                }}
              />
              <div
                className="absolute -top-2 -right-2 hidden group-hover:block"
                onClick={() =>
                  docZasya("zuunTolgoi", gereeniiZagvar.zuunTolgoi || "")
                }
              >
                <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-800" />
              </div>
            </div>
            <div className="group relative">
              <div
                className="rounded-md border border-dashed border-gray-600 p-2"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.baruunTolgoi ||
                    "Гэрээний загварын зүүн толгой",
                }}
              />
              <div
                className="absolute -top-2 -right-2 hidden group-hover:block"
                onClick={() =>
                  docZasya("baruunTolgoi", gereeniiZagvar.baruunTolgoi || "")
                }
              >
                <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-800" />
              </div>
            </div>
          </div>
          {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
            return (
              <div
                key={mur._id}
                className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {mur.kharagdakhDugaar ? (
                  <>
                    <div className="text-center">{mur.kharagdakhDugaar}</div>
                    <div
                      className={`${
                        mur.zaalt?.includes("table")
                          ? "sun-editor-editable"
                          : ""
                      } ml-5 w-full p-0`}
                      dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                    />
                  </>
                ) : (
                  <div
                    className="w-full text-center"
                    dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                  />
                )}
                <div className="absolute -top-2 -right-2 hidden flex-row space-x-2 group-hover:flex">
                  <div onClick={() => docZasya(`dedKhesguud.${index}`, mur)}>
                    <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-800" />
                  </div>
                  <div onClick={() => docUstgaya(index, mur)}>
                    <DeleteOutlined className="cursor-pointer rounded-full border bg-white fill-current p-1 hover:bg-red-400 dark:bg-black dark:hover:bg-gray-800" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 hidden flex-row space-x-2 group-hover:flex">
                  <div onClick={() => docNemekh(index, _.cloneDeep(mur))}>
                    <FileAddOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-green-400 dark:bg-black dark:hover:bg-gray-800" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3 xl:col-span-2">
        <div className="box p-5">
          <Form form={form} autoComplete={"off"} onFinish={onFinish}>
            <Form.Item
              name="ner"
              rules={[
                {
                  required: true,
                  message: "Гэрээний загварын нэр оруулна уу",
                },
              ]}
            >
              <Input placeholder="Гэрээний загварын нэр" />
            </Form.Item>
            <div className="flex justify-end">
              <Form.Item
                name="turGereeEsekh"
                label="Түр гэрээ эсэх"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                className="w-full"
                type="primary"
                onClick={() => form.submit()}
                loading={towchTuluv}
              >
                Хадгалах
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ZakhialgaNemekh;
