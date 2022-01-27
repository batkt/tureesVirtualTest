import React from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import readMethod from "tools/function/crud/readMethod";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import { Button, Form, Input, message, Modal } from "antd";
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

function ZakhialgaNemekh({ token }) {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const { baiguullaga,barilgiinId } = useAuth();
  const [gereeniiZagvar, setGereeniiZagvar] = React.useState({dedKhesguud:[{zaalt:'new'}]});
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
    if (!gereeniiZagvar?._id) {
      values["baiguullagiinNer"] = baiguullaga.ner;
      values["baiguullagiinId"] = baiguullaga._id;
      values["dedKhesguud"] = gereeniiZagvar.dedKhesguud
      values["barilgiinId"] = barilgiinId
      createMethod("gereeniiZagvar", token, values).then(({ data }) => {
        if (data === "Amjilttai") {
          message.success("Амжилттай хадгаллаа");
          router.back();
        }
      });
    } else if (!!gereeniiZagvar?._id) {
      gereeniiZagvar.ner = values.ner;
      updateMethod("gereeniiZagvar", token, gereeniiZagvar).then(({ data }) => {
        if (data === "Amjilttai") {
          message.success("Амжилттай хадгаллаа");
          router.back();
        }
      });
    }
  }

  function docZasya(key, value) {
    console.log(value)
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button onClick={() => ref.current.khadgalya()}>Хадгалах</Button>,
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
      <div className="col-span-12 lg:col-span-9 xl:col-span-10 box p-4">
        <div className="flex flex-col w-full space-y-1">
          <div className="w-full flex flex-row justify-between">
            <div className="relative group">
              <div
                className="border border-dashed border-gray-600 rounded-md p-2"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.zuunTolgoi ||
                    "Гэрээний загварын баруун толгой",
                }}
              />
              <div
                className="absolute hidden -top-2 -right-2 group-hover:block"
                onClick={() =>
                  docZasya("zuunTolgoi", gereeniiZagvar.zuunTolgoi || '')
                }
              >
                <EditOutlined className="rounded-full p-1 bg-white border cursor-pointer hover:bg-gray-200" />
              </div>
            </div>
            <div className="relative group">
              <div
                className="border border-dashed border-gray-600 rounded-md p-2"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.baruunTolgoi ||
                    "Гэрээний загварын зүүн толгой",
                }}
              />
              <div
                className="absolute hidden -top-2 -right-2 group-hover:block"
                onClick={() =>
                  docZasya("baruunTolgoi", gereeniiZagvar.baruunTolgoi || '')
                }
              >
                <EditOutlined className="rounded-full p-1 bg-white border cursor-pointer hover:bg-gray-200" />
              </div>
            </div>
          </div>
          {gereeniiZagvar?.dedKhesguud?.map((mur, index) => {
            return (
              <div
                key={mur._id}
                className="flex flex-row w-full p-1 relative group hover:bg-gray-100 rounded-md"
              >
                {mur.kharagdakhDugaar ? (
                  <>
                    <div className="text-center">{mur.kharagdakhDugaar}</div>
                    <div
                      className={`${mur.zaalt?.includes('table') ? "sun-editor-editable" : ""} w-full ml-5 p-0`}
                      dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                    />
                  </>
                ) : (
                  <div
                    className="w-full text-center"
                    dangerouslySetInnerHTML={{ __html: mur.zaalt }}
                  />
                )}
                <div className="absolute hidden -top-2 -right-2 group-hover:flex flex-row space-x-2">
                  <div
                    onClick={() =>
                      docZasya(`dedKhesguud.${index}`, mur)
                    }
                  >
                    <EditOutlined className="rounded-full p-1 bg-white border cursor-pointer hover:bg-gray-200" />
                  </div>
                  <div onClick={() => docUstgaya(index, mur)}>
                    <DeleteOutlined className="rounded-full p-1 fill-current bg-white border cursor-pointer hover:bg-red-400" />
                  </div>
                </div>
                <div className="absolute hidden -bottom-2 -right-2 group-hover:flex flex-row space-x-2">
                  <div onClick={() => docNemekh(index, _.cloneDeep(mur))}>
                    <FileAddOutlined className="rounded-full p-1 bg-white border cursor-pointer hover:bg-green-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3 xl:col-span-2">
        <div className="box p-5">
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="ner">
              <Input placeholder="Гэрээний загварын нэр" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
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
