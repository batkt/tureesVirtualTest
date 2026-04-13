import React, { useEffect, useState } from "react";
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
  FileOutlined,
} from "@ant-design/icons";

import { modal } from "components/ant/Modal";
import ZaaltZasvar from "components/pageComponents/geree/zagvar/ZaaltZasvar";
import _ from "lodash";
import { aldaaBarigch } from "services/uilchilgee";
import compareFields from "tools/function/compareFields";
import { t } from "i18next";
import useJagsaalt from "../../../../../hooks/useJagsaalt";
import { toast } from "sonner";

var defaultUtga = {
  dedKhesguud: [{ zaalt: "new" }],
  ner: undefined,
  turGereeEsekh: undefined,
};

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
  const ashiglaltiinZardal = useJagsaalt("/ashiglaltiinZardluud", {
    barilgiinId: barilgiinId,
  });
  React.useEffect(() => {
    if (id !== "new")
      readMethod("gereeniiZagvar", token, id).then(({ data }) => {
        if (data) {
          defaultUtga = data;
          form.setFieldsValue(data);
          setGereeniiZagvar({ ...data });
        }
      });
  }, [id]);
  console.log(gereeniiZagvar);
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
            toast.success(t("Амжилттай хадгаллаа"));
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setTowchTuluv(false);
        });
    } else if (!!gereeniiZagvar?._id) {
      gereeniiZagvar.ner = values.ner;
      gereeniiZagvar.turGereeEsekh = values.turGereeEsekh;
      updateMethod("gereeniiZagvar", token, gereeniiZagvar)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            toast.success(t("Амжилттай хадгаллаа"));
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
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button
        style={{ backgroundColor: "#209669", color: "#ffffff" }}
        onClick={() => ref.current.khadgalya()}
      >
        {t("Хадгалах")}
      </Button>,
    ];

    function change(utga) {
      _.set(gereeniiZagvar, key, utga);
      let value = _.cloneDeep(gereeniiZagvar);
      setGereeniiZagvar(value);
    }
    modal({
      width: "300mm",
      title: t("Заалт засах"),
      icon: <FileExcelOutlined />,
      content: (
        <ZaaltZasvar
          ref={ref}
          token={token}
          value={value}
          change={change}
          zardal={ashiglaltiinZardal}
        />
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
      okText: t("Тийм"),
      cancelText: t("Үгүй"),
      onOk: () => {
        gereeniiZagvar.dedKhesguud.splice(key, 1);
        let value = _.cloneDeep(gereeniiZagvar);
        setGereeniiZagvar(value);
      },
    });
  }
  function garya() {
    const values = form.getFieldsValue();
    if (
      defaultUtga.dedKhesguud !== gereeniiZagvar.dedKhesguud ||
      compareFields(defaultUtga, values, ["turGereeEsekh", "ner"])
    )
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: router.back,
      });
    else router.back();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [gereeniiZagvar, defaultUtga]);

  function nemekh() {
    const newMur = {
      zaalt: "<b>{t(Шинэ заалт)}</b>",
    };

    gereeniiZagvar.dedKhesguud.push(newMur);
    let value = _.cloneDeep(gereeniiZagvar);
    setGereeniiZagvar(value);
  }

  function docNemekh(key, mur) {
    mur.zaalt = "<b>{t(Шинэ заалт)}</b>";
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
      <div className="col-span-12 flex justify-center p-4 lg:col-span-9 xl:col-span-10">
        <div
          className="flex w-full flex-col space-y-1 overflow-x-auto bg-white p-[15mm] pl-[24mm] pr-[14mm] text-gray-900 dark:bg-gray-700 dark:text-white"
          style={{ width: "300mm" }}
        >
          <div className="grid grid-cols-2 gap-4 pb-5">
            <div className="group relative">
              <div
                className="sun-editor-editable rounded-md border border-dashed border-gray-600 p-2 text-black dark:border-gray-300 dark:bg-gray-700 dark:text-white [&_*]:text-black dark:[&_*]:text-white"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.zuunTolgoi ||
                    t("Гэрээний загварын зүүн толгой"),
                }}
              />
              <div
                className="absolute -right-2 -top-2 z-10"
                onClick={() =>
                  docZasya("zuunTolgoi", gereeniiZagvar.zuunTolgoi || "")
                }
              >
                <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-800" />
              </div>
            </div>

            <div className="group relative">
              <div
                className="sun-editor-editable rounded-md border border-dashed border-gray-600 p-2 text-gray-900 dark:border-gray-300 dark:bg-gray-700 dark:text-white [&_*]:text-gray-900 dark:[&_*]:text-white"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.baruunTolgoi ||
                    t("Гэрээний загварын баруун толгой"),
                }}
              />
              <div
                className="absolute -right-2 -top-2 z-10"
                onClick={() =>
                  docZasya("baruunTolgoi", gereeniiZagvar.baruunTolgoi || "")
                }
              >
                <EditOutlined className="cursor-pointer rounded-full border border-gray-600 bg-white p-1 text-gray-700 hover:bg-gray-200 dark:border-gray-300 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-800" />
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-6 pb-5">
            {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
              return (
                <div
                  key={mur._id || `clause-${index}`}
                  className="group relative flex w-full flex-row rounded-lg border border-dashed border-gray-600 p-1 text-gray-900 hover:bg-gray-100 dark:border-gray-300 dark:text-white dark:hover:bg-gray-700"
                >
                  <div className="absolute -right-2 -top-2 z-10 flex flex-col space-y-1">
                    <div onClick={() => docZasya(`dedKhesguud.${index}`, mur)}>
                      <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200   dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-500" />
                    </div>
                    <div onClick={() => docUstgaya(index, mur)}>
                      <DeleteOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-red-400 dark:bg-gray-500  dark:text-gray-200 dark:hover:bg-gray-800" />
                    </div>
                  </div>

                  <div className="absolute -left-2 -top-2 z-10">
                    <div onClick={() => docNemekh(index, _.cloneDeep(mur))}>
                      <FileAddOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-green-400 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-800" />
                    </div>
                  </div>

                  <div
                    className="sun-editor-editable w-full overflow-x-auto text-gray-900 dark:border-gray-300 dark:bg-gray-700 dark:text-white [&_*]:text-gray-900 dark:[&_*]:text-white"
                    dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                  />
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <div
                className="rounded-md border border-dashed border-gray-600 p-2 text-gray-900 dark:border-gray-300 dark:bg-gray-800 dark:text-white [&_*]:!text-gray-900 dark:[&_*]:!text-white"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.zuunKhul || t("Гэрээний загварын зүүн хөл"),
                }}
              />
              <div
                className="absolute -right-2 -top-2  group-hover:block"
                onClick={() =>
                  docZasya("zuunKhul", gereeniiZagvar.zuunKhul || "")
                }
              >
                <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-800" />
              </div>
            </div>
            <div className="group relative">
              <div
                className="rounded-md border border-dashed border-gray-600 p-2 text-gray-900 dark:border-gray-300 dark:bg-gray-800 dark:text-white [&_*]:!text-gray-900 dark:[&_*]:!text-white"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.baruunKhul ||
                    t("Гэрээний загварын баруун хөл"),
                }}
              />
              <div
                className="absolute -right-2 -top-2  group-hover:block"
                onClick={() =>
                  docZasya("baruunKhul", gereeniiZagvar.baruunKhul || "")
                }
              >
                <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200 dark:bg-gray-500 dark:text-gray-200 dark:hover:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3 xl:col-span-2">
        <div className="box p-5 dark:bg-gray-700">
          <Form form={form} autoComplete={"off"} onFinish={onFinish}>
            <Form.Item
              name="ner"
              rules={[
                {
                  required: true,
                  message: t("Гэрээний загварын нэр оруулна уу"),
                },
              ]}
            >
              <Input placeholder={t("Гэрээний загварын нэр")} />
            </Form.Item>
            <div className="flex justify-end gap-2">
              <p className="mt-1 text-gray-900 dark:text-white">
                {t("Түр гэрээ эсэх")} :
              </p>
              <Form.Item name="turGereeEsekh" valuePropName="checked">
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
                {t("Хадгалах")}
              </Button>
              <Button
                className="mt-4 w-full"
                type="primary"
                onClick={() => nemekh()}
              >
                <FileAddOutlined />
                {t("Гэрээний заалт нэмэх")}
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
