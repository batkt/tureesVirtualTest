import { SendOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Radio } from "antd";
import { parseCookies } from "nookies";
import { useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import readMethod from "tools/function/crud/readMethod";

function AnketBuglukh({ data, token }) {
  const [form] = Form.useForm();
  const [garakhScreen, setGarakhScreen] = useState(false);

  const onFinish = (values) => {
    const khariult = {
      asuultiinId: data._id,
      baiguullagiinId: data.baiguullagiinId,
      barilgiinId: data.barilgiinId,
      asuultiinNer: data.ner,
      asuultiinTurul: data.turul,
      ognoo: new Date(),
      khariultuud: values.asuultuud.map(({ asuult, khariult }) => ({
        asuult,
        khariult,
      })),
    };
    anketIlgeeye(khariult);
  };
  function anketIlgeeye(khariult) {
    uilchilgee(token)
      .post("/surveyKhadgalya", khariult)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          setGarakhScreen(true);
          notification.success({ message: "Анкет Амжилттай илгээлээ" });
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-200 py-5  md:py-12  lg:py-20 ">
      {!garakhScreen && (
        <div className="relative block h-full w-11/12 rounded-lg bg-white pt-3 shadow-2xl sm:w-10/12 sm:p-5 md:w-8/12 lg:w-6/12 2xl:w-4/12">
          <header className="border-b-2 px-3 text-xl font-medium uppercase">
            {data.ner}
          </header>
          <Form
            form={form}
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            autoComplete={"off"}
            initialValues={data}
            className="block h-5/6 overflow-y-auto pt-5"
            layout="vertical"
          >
            <Form.List name="asuultuud">
              {(fields) => (
                <div className="flex flex-col">
                  {fields.map((field) => (
                    <div className="px-6 pb-3" key={field.key}>
                      <div className="flex gap-1 text-base">
                        <p className="font-medium">{field.name + 1}.</p>
                        {data.asuultuud[field.name].asuult}
                      </div>
                      <div className="flex flex-wrap gap-2 py-2 sm:px-10">
                        <Form.Item
                          {...field}
                          hidden
                          name={[field.name, "asuult"]}
                          noStyle
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "khariult"]}
                          rules={[
                            {
                              required: true,
                              message: "Анкетаа бүрэн бөгөлнө үү",
                            },
                          ]}
                          noStyle
                        >
                          {data.asuultuud[field.name].turul === "songokh" ? (
                            <Radio.Group>
                              {data.asuultuud[field.name].khariultuud?.map(
                                (a) => (
                                  <Radio key={a + field.name} value={a}>
                                    {a}
                                  </Radio>
                                )
                              )}
                            </Radio.Group>
                          ) : (
                            <Input placeholder="Энд хариултаа бичинэ үү" />
                          )}
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>
            <footer className="absolute bottom-0 right-0 flex w-full justify-end border-t-2 px-3 pt-2 pb-5">
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#209669", color: "#ffffff" }}
                icon={<SendOutlined />}
              >
                Илгээх
              </Button>
            </footer>
          </Form>
        </div>
      )}
      {garakhScreen ? (
        <div className="absolute flex h-full w-full items-center justify-center pt-3  ">
          <div className="relative flex h-3/6 w-10/12 flex-col items-center justify-center rounded-xl bg-white bg-opacity-80 shadow-2xl lg:w-8/12 2xl:w-6/12">
            <div className="h-40 w-40 animate-bounce">
              <img src="/success.png"></img>
            </div>
            <p className="px-5 text-xl font-medium">
              Таны мэдээлэл амжилттай илгээгдлээ, баярлалаа
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const getServerSideProps = async (ctx, ugudulAvchirya) => {
  try {
    let session = await parseCookies(ctx);
    let data = null;
    if (!!ctx?.query?.anketId)
      data = await readMethod(
        "asuultAvya",
        session?.tureestoken,
        ctx.query.anketId
      ).then((a) => a.data);

    return {
      props: { token: session.tureestoken, data },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    };
  }
};

export default AnketBuglukh;
