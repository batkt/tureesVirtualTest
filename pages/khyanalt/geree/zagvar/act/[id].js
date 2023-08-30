import React, { useEffect, useState } from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import _ from "lodash";
import dynamic from "next/dynamic";
import { Button, Checkbox, Form, Input, Modal, message } from "antd";
import { t } from "i18next";
import Image from "next/image";
import { useAuth } from "services/auth";
import readMethod from "tools/function/crud/readMethod";
import { useRouter } from "next/router";
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { modal } from "components/ant/Modal";
import ZaaltZasvar from "components/pageComponents/geree/zagvar/ZaaltZasvar";
import { aldaaBarigch } from "services/uilchilgee";
import compareFields from "tools/function/compareFields";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

var defaultUtga = {
  dedKhesguud: [{ zaalt: "new" }],
  ner: undefined,
};

function ZakhialgaNemekh({ token }) {
  const { baiguullaga, barilgiinId } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const [towchTuluv, setTowchTuluv] = useState(false);
  const [aktiinZagvar, setGereeniiZagvar] = React.useState({
    dedKhesguud: [{ zaalt: "new" }],
  });
  const [value, setValue] = useState("");
  const [hevteeBolgoh, setHevteeBolgoh] = useState(false);
  const hemjee = [
    { label: "A4", value: "A4", width: "210mm", height: "297mm" },
    { label: "A5", value: "A5", width: "148.5mm", height: "210mm" },
  ];
  const ref = React.useRef();
  function khadgalakh(values) {
    setTowchTuluv(true);
    if (!aktiinZagvar?._id) {
      values["baiguullagiinNer"] = baiguullaga.ner;
      values["baiguullagiinId"] = baiguullaga._id;
      values["dedKhesguud"] = aktiinZagvar.dedKhesguud;
      values["barilgiinId"] = barilgiinId;
      createMethod("aktiinZagvar", token, values)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
            router.back();
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setTowchTuluv(false);
        });
    } else if (!!aktiinZagvar?._id) {
      aktiinZagvar.ner = values.ner;
      updateMethod("aktiinZagvar", token, aktiinZagvar)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            message.success(t("Амжилттай хадгаллаа"));
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
      _.set(aktiinZagvar, key, utga);
      let value = _.cloneDeep(aktiinZagvar);
      setGereeniiZagvar(value);
    }
    modal({
      width: "182mm",
      title: t("Заалт засах"),
      icon: <FileExcelOutlined />,
      content: (
        <ZaaltZasvar ref={ref} token={token} value={value} change={change} />
      ),
      footer,
    });
  }

  React.useEffect(() => {
    if (id !== "new")
      readMethod("aktiinZagvar", token, id).then(({ data }) => {
        if (data) {
          defaultUtga = data;
          form.setFieldsValue(data);
          setGereeniiZagvar({ ...data });
        }
      });
  }, [id]);

  function garya() {
    const values = form.getFieldsValue();
    if (
      defaultUtga.dedKhesguud !== aktiinZagvar.dedKhesguud ||
      compareFields(defaultUtga, values, ["ner"])
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
  }, [aktiinZagvar, defaultUtga]);

  function docNemekh(key, mur) {
    mur.zaalt = "<b>{t(Шинэ заалт)}</b>";
    aktiinZagvar.dedKhesguud.splice(key + 1, 0, mur);
    let value = _.cloneDeep(aktiinZagvar);
    setGereeniiZagvar(value);
  }

  function docUstgaya(key, mur) {
    Modal.confirm({
      content: (
        <div>
          <div dangerouslySetInnerHTML={{ __html: mur.zaalt }} />
          <span className="font-medium">
            Заалтыг актын загвараас устгахдаа итгэлтэй байна уу?
          </span>
        </div>
      ),
      okText: t("Тийм"),
      cancelText: t("Үгүй"),
      onOk: () => {
        aktiinZagvar.dedKhesguud.splice(key, 1);
        let value = _.cloneDeep(aktiinZagvar);
        setGereeniiZagvar(value);
      },
    });
  }

  function handleChange(checkedValues) {
    setValue(checkedValues.target.value);
  }

  const selectedCategory = hemjee.find((item) => item.value === value);
  const height = hevteeBolgoh
    ? selectedCategory?.width || "210mm"
    : selectedCategory?.height || "297mm";
  const width = hevteeBolgoh
    ? selectedCategory?.height || "297mm"
    : selectedCategory?.width || "210mm";

  return (
    <Admin
      khuudasniiNer="actiinZagvarUgsrah"
      title="Актын загвар угсрах"
      hideSearch
      dedKhuudas
      className="p-4"
    >
      <div className="col-span-12 flex justify-center p-4 lg:col-span-9 xl:col-span-8">
        <div
          className="flex flex-col space-y-1 bg-white p-[15mm] pl-[24mm] pr-[14mm]"
          style={{ width: width, height: height }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <div
                className="rounded-md border border-dashed border-gray-600 p-2"
                dangerouslySetInnerHTML={{
                  __html:
                    aktiinZagvar.zuunTolgoi || t("Актын загварын зүүн толгой"),
                }}
              />
              <div
                className="absolute -right-2 -top-2 hidden group-hover:block"
                onClick={() =>
                  docZasya("zuunTolgoi", aktiinZagvar.zuunTolgoi || "")
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
                    aktiinZagvar.baruunTolgoi ||
                    t("Актын загварын баруун толгой"),
                }}
              />
              <div
                className="absolute -right-2 -top-2 hidden group-hover:block"
                onClick={() =>
                  docZasya("baruunTolgoi", aktiinZagvar.baruunTolgoi || "")
                }
              >
                <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-800" />
              </div>
            </div>
          </div>
          {aktiinZagvar?.dedKhesguud?.map((mur, index) => {
            return (
              <div
                key={mur._id}
                className="group relative flex w-full flex-row rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div
                  className="sun-editor-editable w-full"
                  dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                />
                <div className="absolute -right-2 -top-2 hidden flex-row space-x-2 group-hover:flex">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="group relative">
              <div
                className="rounded-md border border-dashed border-gray-600 p-2"
                dangerouslySetInnerHTML={{
                  __html: aktiinZagvar.zuunKhul || t("Актын загварын зүүн хөл"),
                }}
              />
              <div
                className="absolute -right-2 -top-2 hidden group-hover:block"
                onClick={() =>
                  docZasya("zuunKhul", aktiinZagvar.zuunKhul || "")
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
                    aktiinZagvar.baruunKhul || t("Актын загварын баруун хөл"),
                }}
              />
              <div
                className="absolute -right-2 -top-2 hidden group-hover:block"
                onClick={() =>
                  docZasya("baruunKhul", aktiinZagvar.baruunKhul || "")
                }
              >
                <EditOutlined className="cursor-pointer rounded-full border bg-white p-1 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3 xl:col-span-4 ">
        <div className="box p-9 lg:h-[800px]">
          <Form form={form} onFinish={khadgalakh} autoComplete={"off"}>
            <Form.Item name="ner">
              <Input placeholder={t("Нэр")} />
            </Form.Item>
          </Form>
          <div className="">
            <div className="col-sm-12 flex items-center justify-center px-3 py-2 lg:flex-col lg:justify-between lg:gap-3 xl:flex-row">
              <div className="flex lg:justify-center">
                {hemjee.map((item) => {
                  return (
                    <Checkbox
                      key={item.label}
                      onChange={handleChange}
                      checked={item.value == value}
                      value={item.value}
                    >
                      {item.value}
                    </Checkbox>
                  );
                })}
              </div>
              <div
                className="flex h-7 w-28 cursor-pointer items-center justify-center gap-3 rounded border duration-300 ease-out hover:border-blue-400"
                onClick={() => setHevteeBolgoh(!hevteeBolgoh)}
              >
                Landscape
                <div className="h-5 w-5">
                  <Image
                    src="/landscape-mode.png"
                    alt="Picture of the author"
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              type="primary"
              onClick={() => form.submit()}
              loading={towchTuluv}
            >
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ZakhialgaNemekh;
