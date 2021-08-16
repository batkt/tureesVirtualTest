import React from "react";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import Admin from "components/Admin";
import { useRouter } from "next/router";
import readMethod from "tools/function/crud/readMethod";
import createMethod from "tools/function/crud/createMethod";
import { Button, Divider, Form, Input, message, Select } from "antd";
import useGereeniiZaalt from "hooks/useGereeniiZaalt";
import { useAuth } from "services/auth";

const steps = [
  {
    title: "Ерөнхий мэдээлэл",
  },
  {
    title: "Барьцаа бүртгэл",
  },
  {
    title: "Хөрөнгийн бүртгэл",
  },
  {
    title: "Гэрээний хугацаа",
  },
  {
    title: "Төлбөр тооцоо",
  },
];

function ZakhialgaNemekh({ token }) {
  const router = useRouter();
  const { id } = router.query;
  const { baiguullaga } = useAuth();
  const { setGereeniiZaaltKhuudaslalt, gereeniiZaaltGaralt } = useGereeniiZaalt(
    token,
    baiguullaga?._id
  );
  const [gereeniiZagvar, setGereeniiZagvar] = React.useState({});
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (id !== "new")
      readMethod("gereeniiZagvar", token, id).then(({ data }) => {
        if (data) setGereeniiZagvar({ ...data });
      });
  }, [id]);

  function onChange(v) {
    let zaaltuud = gereeniiZagvar?.zaaltuud || [];
    let zaalt = gereeniiZaaltGaralt.jagsaalt.filter((a) => a._id === v);
    if (zaalt.length > 0) {
      // zaalt[0].khamaarakhKheseg = current;
      zaaltuud.push(zaalt[0]);
    }
    setGereeniiZagvar((a) => ({ ...a, zaaltuud }));
  }

  function onKeyDown(e, index) {
    let zaaltuud = gereeniiZagvar?.zaaltuud || [];
    let zaalt = zaaltuud[index];
    if (e.keyCode === 46) {
      zaaltuud.splice(index, 1);
      setGereeniiZagvar((a) => ({ ...a, zaaltuud }));
    }
    if (e.keyCode === 38 && index > 0) {
      zaaltuud.splice(index, 1);
      zaaltuud.splice(index - 1, 0, zaalt);
      setGereeniiZagvar((a) => ({ ...a, zaaltuud }));
    }
    if (e.keyCode === 40 && index < zaaltuud.length) {
      zaaltuud.splice(index, 1);
      zaaltuud.splice(index + 1, 0, zaalt);
      setGereeniiZagvar((a) => ({ ...a, zaaltuud }));
    }
  }

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

  return (
    <Admin
      khuudasniiNer="zakhialgiinKhyanalt"
      title="Гэрээний загвар угсрах"
      hideSearch
      dedKhuudas
      className="p-4"
    >
      <div className="col-span-12 lg:col-span-3 xl:col-span-2">
        <div className="box p-5">
          <Form onFinish={onFinish}>
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
      <div className="col-span-12 lg:col-span-9 xl:col-span-10 box p-4">
        <div className="flex flex-col w-full space-y-1">
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
        <Divider />
        <div className="flex flex-row w-full">
          <Select
            showSearch
            placeholder="Үйлчилгээ сонгох"
            className="w-full"
            placeholder="Үйлчилгээ сонгох"
            size="large"
            value={null}
            filterOption={(o) => o}
            onSearch={(search) =>
              setGereeniiZaaltKhuudaslalt((a) => ({ ...a, search }))
            }
            onChange={onChange}
          >
            {gereeniiZaaltGaralt?.jagsaalt?.map((mur) => {
              return (
                <Select.Option key={mur._id}>
                  <div className="flex flex-row">
                    <div>{mur.khamaarakhKheseg}</div>
                    <Divider type="vertical" />
                    <div>{mur.kharagdakhDugaar}</div>
                    <Divider type="vertical" />
                    <div dangerouslySetInnerHTML={{ __html: mur.zaalt }} />
                  </div>
                </Select.Option>
              );
            })}
          </Select>
        </div>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default ZakhialgaNemekh;
