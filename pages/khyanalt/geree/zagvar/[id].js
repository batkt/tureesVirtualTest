import React from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import readMethod from "tools/function/crud/readMethod";
import createMethod from "tools/function/crud/createMethod";
import getListMethod from "tools/function/crud/getListMethod";
import { Button, Form, Input, message } from "antd";
import { useAuth } from "services/auth";
import { EditOutlined } from "@ant-design/icons";
import { modal } from "components/ant/Modal";

function ZakhialgaNemekh({ token }) {
  const router = useRouter();
  const { id } = router.query;
  const [form] = Form.useForm();
  const { baiguullaga } = useAuth();
  const [gereeniiZagvar, setGereeniiZagvar] = React.useState({});

  React.useEffect(() => {
    if (id !== "new")
      readMethod("gereeniiZagvar", token, id).then(({ data }) => {
        if (data) {
          getListMethod("gereeniiZaalt", token, {
            query: { _id: data.dedKhesguud },
          }).then((khariu) => {
            if (!!khariu.data) {
              data.zaaltuud = khariu.data.jagsaalt;
              setGereeniiZagvar({ ...data });
              form.setFieldsValue(data);
            }
          });
        }
      });
  }, [id]);

  function onFinish(values) {
    values["baiguullagiinNer"] = baiguullaga.ner;
    values["baiguullagiinId"] = baiguullaga._id;
    values["dedKhesguud"] = gereeniiZagvar.zaaltuud.map((a) => a._id);
    createMethod("gereeniiZagvar", token, values).then(({ data }) => {
      if (data === "Amjilttai") {
        message.success("Амжилттай хадгаллаа");
        router.back();
      }
    });
  }

  function docZasya(key, value) {
    modal({});
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
            <div className="relative">
              <div
                className="p-2 border border-dashed border-gray-600 rounded-md"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.zuunTolgoi ||
                    "Гэрээний загварын баруун толгой",
                }}
              />
              <EditOutlined className="absolute -top-2 -right-2 rounded-full p-1 bg-white border cursor-pointer hover:bg-gray-200" />
            </div>
            <div className="relative">
              <div
                className="p-2 border border-dashed border-gray-600 rounded-md"
                dangerouslySetInnerHTML={{
                  __html:
                    gereeniiZagvar.baruunTolgoi ||
                    "Гэрээний загварын зүүн толгой",
                }}
              />
              <EditOutlined className="absolute -top-2 -right-2 rounded-full p-1 bg-white border cursor-pointer hover:bg-gray-200" />
            </div>
          </div>
          {gereeniiZagvar?.zaaltuud?.map((mur, index) => {
            return (
              <div
                key={mur._id}
                className="flex flex-row w-full space-x-1 border-b p-1 focus-within:bg-blue-50"
              >
                <div className="text-center">{mur.khamaarakhKheseg}</div>
                <input
                  className="w-6 border text-center"
                  value={index + 1}
                  onKeyDown={(e) => onKeyDown(e, index)}
                />
                <div dangerouslySetInnerHTML={{ __html: mur.zaalt }} />
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
            <Form.Item name="baruunTolgoi">
              <Input.TextArea placeholder="Гэрээний загварын баруун толгой" />
            </Form.Item>
            <Form.Item name="zuunTolgoi">
              <Input.TextArea placeholder="Гэрээний загварын зүүн толгой" />
            </Form.Item>
            <Form.Item name="khul">
              <Input.TextArea placeholder="Гэрээний загварын хөл" />
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
