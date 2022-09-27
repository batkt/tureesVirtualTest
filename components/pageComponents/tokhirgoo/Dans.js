import React, { useEffect, useState } from "react";
import {
  Tooltip,
  Popconfirm,
  Button,
  Switch,
  Form,
  Input,
  notification,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import deleteMethod from "tools/function/crud/deleteMethod";
import useDans from "hooks/useDans";
import { useAuth } from "services/auth";
import { modal } from "components/ant/Modal";
import DansBurtgel from "./DansBurtgel";
import updateMethod from "tools/function/crud/updateMethod";

function DansTile({ data, dansMutate, zasya, token }) {
  function ustgaya() {
    deleteMethod("dans", token, data?._id).then(
      ({ data }) => data === "Amjilttai" && dansMutate()
    );
  }

  return (
    <div className="box w-full">
      <div className="grid w-full grid-cols-4 items-center justify-between gap-2 p-5">
        <div className="">
          <div className="font-medium">Данс</div>
          <div>{data.dugaar}</div>
        </div>
        <div className="">
          <div className="font-medium">Дансны нэр</div>
          <div>{data.dansniiNer}</div>
        </div>
        <div className="">
          <div className="font-medium">Валют</div>
          <div>{data.valyut}</div>
        </div>
        <div className="ml-auto flex space-x-2">
          <Popconfirm
            title={`${data.dugaar} данс устгах уу?`}
            okText="Тийм"
            cancelText="Үгүй"
            onConfirm={() => ustgaya()}
          >
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 fill-current p-2 text-white">
              <Tooltip title="Устгах">
                <DeleteOutlined size={20} />
              </Tooltip>
            </div>
          </Popconfirm>
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-500 fill-current p-2 text-white"
            onClick={() => zasya(data)}
          >
            <Tooltip title="Засах">
              <EditOutlined />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dans({ token, baiguullaga }) {
  const { barilgiinId } = useAuth();
  const ref = React.useRef(null);
  const { dansGaralt, dansMutate } = useDans(token, baiguullaga?._id);

  const [khanbankCoprporate, setKhanBankCorporate] = useState(null);
  const [tdbCoprporate, setTdbCorporate] = useState(null);

  useEffect(() => {
    const tdb = dansGaralt?.jagsaalt?.find(
      (a) => a.bank === "tdb" && a.corporateAshiglakhEsekh === true
    );
    if (!!tdb) {
      const {
        corporateAshiglakhEsekh,
        bank,
        corporateNevtrekhNer,
        corporateNuutsUg,
        corporateGuilgeeniiNuutsUg,
        AnyBIC,
        RoleID,
      } = tdb;
      setTdbCorporate({
        corporateAshiglakhEsekh,
        bank,
        corporateNevtrekhNer,
        corporateNuutsUg,
        corporateGuilgeeniiNuutsUg,
        AnyBIC,
        RoleID,
      });
    }
    const khanbank = dansGaralt?.jagsaalt?.find(
      (a) => a.bank === "khanbank" && a.corporateAshiglakhEsekh === true
    );
    if (!!khanbank) {
      const {
        corporateAshiglakhEsekh,
        bank,
        corporateNevtrekhNer,
        corporateNuutsUg,
      } = khanbank;
      setKhanBankCorporate({
        corporateAshiglakhEsekh,
        bank,
        corporateNevtrekhNer,
        corporateNuutsUg,
      });
    }
  }, [dansGaralt]);

  function dansBurtgeye(data) {
    const footer = [
      <Button onClick={() => ref.current.khaaya()}>Хаах</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        Хадгалах
      </Button>,
    ];
    modal({
      title: "Дансны бүртгэл",
      icon: <PlusOutlined />,
      content: (
        <DansBurtgel
          ref={ref}
          data={data}
          token={token}
          barilgiinId={barilgiinId}
          baiguullagiinId={baiguullaga?._id}
          dansMutate={dansMutate}
        />
      ),
      footer,
    });
  }

  function dansKhadgalya(turul) {
    const corp = turul === "tdb" ? tdbCoprporate : khanbankCoprporate;
    dansGaralt?.jagsaalt
      ?.filter((a) => a.bank === turul)
      .map((mur, index, array) =>
        updateMethod("dans", token, { ...mur, ...corp }).then(({ data }) => {
          if (data === "Amjilttai" && array.length - 1 === index) {
            notification.success({ message: "Амжилттай хадгаллаа" });
          }
        })
      );
  }

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-4">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Дансны бүртгэл
            </h2>
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 fill-current p-2 text-white"
              onClick={() =>
                dansBurtgeye({
                  ...(khanbankCoprporate || {}),
                  bank: "khanbank",
                })
              }
            >
              <Tooltip title="Нэмэх">
                <PlusOutlined />
              </Tooltip>
            </div>
          </div>
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Хаан банк
            </h2>
            <div className="space-x-2">
              <label className="mr-auto text-base font-semibold dark:text-gray-200">
                Corporate ашиглах эсэх
              </label>
              <Switch
                checked={khanbankCoprporate?.corporateAshiglakhEsekh || false}
                onChange={(corporateAshiglakhEsekh) =>
                  setKhanBankCorporate((a) => ({
                    ...a,
                    corporateAshiglakhEsekh,
                  }))
                }
              />
            </div>
          </div>
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <Form
              initialValues={khanbankCoprporate}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              <Form.Item
                hidden={khanbankCoprporate?.corporateAshiglakhEsekh !== true}
                label="Нэвтрэх нэр"
                name="corporateNevtrekhNer"
              >
                <Input
                  placeholder="Нууцлагдсан мэдээлэл"
                  onChange={({ target }) =>
                    setKhanBankCorporate((a) => ({
                      ...a,
                      corporateNevtrekhNer: target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item
                hidden={khanbankCoprporate?.corporateAshiglakhEsekh !== true}
                label="Нэвтрэх нууц үг"
                name="corporateNuutsUg"
              >
                <Input.Password
                  placeholder="Нууцлагдсан мэдээлэл"
                  onChange={({ target }) =>
                    setKhanBankCorporate((a) => ({
                      ...a,
                      corporateNuutsUg: target.value,
                    }))
                  }
                />
              </Form.Item>
            </Form>
          </div>
          {dansGaralt?.jagsaalt
            ?.filter((a) => a.bank === "khanbank")
            .map((mur) => (
              <DansTile
                className="box"
                key={mur._id}
                data={mur}
                zasya={dansBurtgeye}
                dansMutate={dansMutate}
                token={token}
              />
            ))}
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${
              !!!!(
                khanbankCoprporate?.corporateNevtrekhNer ||
                khanbankCoprporate?.corporateNuutsUg ||
                khanbankCoprporate?.corporateGuilgeeniiNuutsUg
              )
                ? "flex"
                : "hidden"
            }`}
          >
            <Button type="primary" onClick={() => dansKhadgalya("khanbank")}>
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-5">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Дансны бүртгэл
            </h2>
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 fill-current p-2 text-white"
              onClick={() =>
                dansBurtgeye({ ...(tdbCoprporate || {}), bank: "tdb" })
              }
            >
              <Tooltip title="Нэмэх">
                <PlusOutlined />
              </Tooltip>
            </div>
          </div>
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              Худалдаа хөгжлийн банк
            </h2>
            <div className="space-x-2">
              <label className="mr-auto text-base font-semibold dark:text-gray-200">
                Corporate ашиглах эсэх
              </label>
              <Switch
                checked={tdbCoprporate?.corporateAshiglakhEsekh || false}
                onChange={(corporateAshiglakhEsekh) =>
                  setTdbCorporate((a) => ({ ...a, corporateAshiglakhEsekh }))
                }
              />
            </div>
          </div>
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pt-5 pb-2">
            <Form
              initialValues={tdbCoprporate}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              <Form.Item
                hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                label="Нэвтрэх нэр"
                name="corporateNevtrekhNer"
              >
                <Input
                  placeholder="Нууцлагдсан мэдээлэл"
                  onChange={({ target }) =>
                    setTdbCorporate((a) => ({
                      ...a,
                      corporateNevtrekhNer: target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item
                hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                label="Нэвтрэх нууц үг"
                name="corporateNuutsUg"
              >
                <Input.Password
                  placeholder="Нууцлагдсан мэдээлэл"
                  onChange={({ target }) =>
                    setTdbCorporate((a) => ({
                      ...a,
                      corporateNuutsUg: target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item
                hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                label="Гүйлгээний нууц үг"
                name="corporateGuilgeeniiNuutsUg"
              >
                <Input.Password
                  placeholder="Нууцлагдсан мэдээлэл"
                  onChange={({ target }) =>
                    setTdbCorporate((a) => ({
                      ...a,
                      corporateGuilgeeniiNuutsUg: target.value,
                    }))
                  }
                />
              </Form.Item>
              <Form.Item
                hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                label="AnyBIC"
                name="AnyBIC"
              >
                <Input
                  onChange={({ target }) =>
                    setTdbCorporate((a) => ({ ...a, AnyBIC: target.value }))
                  }
                />
              </Form.Item>
              <Form.Item
                hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                label="RoleID"
                name="RoleID"
              >
                <Input
                  onChange={({ target }) =>
                    setTdbCorporate((a) => ({ ...a, RoleID: target.value }))
                  }
                />
              </Form.Item>
            </Form>
          </div>
          {dansGaralt?.jagsaalt
            ?.filter((a) => a.bank === "tdb")
            .map((mur) => (
              <DansTile
                className="box"
                key={mur._id}
                data={mur}
                zasya={dansBurtgeye}
                dansMutate={dansMutate}
                token={token}
              />
            ))}
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pt-2 pb-2 ${
              !!(
                tdbCoprporate?.corporateNevtrekhNer ||
                tdbCoprporate?.corporateNuutsUg ||
                tdbCoprporate?.corporateGuilgeeniiNuutsUg
              )
                ? "flex"
                : "hidden"
            }`}
          >
            <Button type="primary" onClick={() => dansKhadgalya("tdb")}>
              Хадгалах
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dans;
