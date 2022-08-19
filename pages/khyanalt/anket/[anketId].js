import { SendOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { parseCookies } from "nookies";
import readMethod from "tools/function/crud/readMethod";

function AnketBuglukh({ data, token }) {
  console.log(data, token);
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-200 py-5  md:py-12  lg:py-20 ">
      <div className="relative block h-full w-11/12 rounded-lg bg-white pt-3 shadow-2xl sm:w-10/12 sm:p-5 md:w-8/12 lg:w-6/12 2xl:w-4/12">
        <header className="border-b-2 px-3 text-xl font-medium uppercase">
          {data.ner}
        </header>
        <Form className="block h-5/6 overflow-y-auto pt-5">
          {data?.asuultuud?.map((a, i) => {
            return (
              <div className="px-6 pb-3">
                <div className="flex gap-1 text-base">
                  <p className="font-medium">{i + 1}.</p>
                  {a.asuult}
                </div>
                <div className="flex flex-wrap gap-2 py-2 sm:px-10">
                  {a.turul === "songokh" ? (
                    a.khariultuud.map((a) => {
                      return (
                        <Form.Item>
                          <Checkbox>{a}</Checkbox>
                        </Form.Item>
                      );
                    })
                  ) : (
                    <Form.Item className="w-full">
                      <Input placeholder="Хариултаа энд бичнэ үү" />
                    </Form.Item>
                  )}
                </div>
              </div>
            );
          })}
        </Form>
        <footer className="absolute bottom-0 right-0 flex w-full justify-end border-t-2 px-3 pt-2 pb-5">
          <Button
            style={{ backgroundColor: "#209669", color: "#ffffff" }}
            icon={<SendOutlined />}
          >
            Илгээх
          </Button>
        </footer>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx, ugudulAvchirya) => {
  try {
    let session = await parseCookies(ctx);
    let data = null;
    if (!!ctx?.query?.anketId)
      data = await readMethod(
        "asuult",
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
