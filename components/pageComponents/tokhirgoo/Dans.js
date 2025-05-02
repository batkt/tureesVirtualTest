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
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import deleteMethod from "tools/function/crud/deleteMethod";
import useDans from "hooks/useDans";
import { useAuth } from "services/auth";
import { modal } from "components/ant/Modal";
import DansBurtgel from "./DansBurtgel";
import updateMethod from "tools/function/crud/updateMethod";
import { useTranslation } from "react-i18next";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

function DansTile({ data, dansMutate, zasya, token, t }) {
  function ustgaya() {
    deleteMethod("dans", token, data?._id).then(
      ({ data }) => data === "Amjilttai" && dansMutate()
    );
  }

  return (
    <div className="box w-full">
      <div className="grid w-full grid-cols-6 items-center justify-between gap-2 p-5">
        <div className="col-span-2">
          <div className="font-medium">{t("Данс")}</div>
          <div>{data.dugaar}</div>
        </div>
        <div className="col-span-2">
          <div className="font-medium">{t("Дансны нэр")}</div>
          <div>{data.dansniiNer}</div>
        </div>
        <div className="">
          <div className="font-medium">{t("Валют")}</div>
          <div>{data.valyut}</div>
        </div>
        <div className="ml-auto flex space-x-2">
          <Popconfirm
            title={`${data.dugaar} данс устгах уу?`}
            okText={t("Тийм")}
            cancelText={t("Үгүй")}
            onConfirm={() => ustgaya()}
          >
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 fill-current p-2 text-white">
              <Tooltip title={t("Устгах")}>
                <DeleteOutlined size={20} />
              </Tooltip>
            </div>
          </Popconfirm>
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-yellow-500 fill-current p-2 text-white"
            onClick={() => zasya(data)}
          >
            <Tooltip title={t("Засах")}>
              <EditOutlined />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dans({ token, baiguullaga, setSongogdsonTsonkhniiIndex }) {
  const { t } = useTranslation();
  const { barilgiinId } = useAuth();
  const ref = React.useRef(null);
  const { dansGaralt, dansMutate } = useDans(token, baiguullaga?._id);
  const [tdbForm] = Form.useForm();
  const [khanbankCoprporate, setKhanBankCorporate] = useState(null);
  const [tdbCoprporate, setTdbCorporate] = useState(null);
  const [tdbMessage, setTdbMessage] = useState();
  const [unshijBaina, setUnshijBaina] = useState(false);

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
      <Button onClick={() => ref.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => ref.current.khadgalya()}>
        {t("Хадгалах")}
      </Button>,
    ];
    modal({
      title: t("Дансны бүртгэл"),
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
            notification.success({ message: t("Амжилттай хадгаллаа") });
            setSongogdsonTsonkhniiIndex(9);
          }
        })
      );
  }

  const shalgay = () => {
    setTdbMessage();
    setUnshijBaina(true);
    if (tdbCoprporate) {
      uilchilgee(token)
        .post("/tdbUldegdelShalgay", tdbCoprporate)
        .then((res) => {
          setTdbMessage(res?.data?.msg);
          setUnshijBaina(false);
        })
        .catch((err) => {
          aldaaBarigch(err);
          setUnshijBaina(false);
        });
    } else {
      notification.warn({ message: "Талбарууд бөглөнө үү", duration: 2 });
    }
  };

  return (
    <>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Дансны бүртгэл")}
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
              <Tooltip title={t("Нэмэх")}>
                <PlusOutlined />
              </Tooltip>
            </div>
          </div>
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Хаан банк")}
            </h2>
            <div className="space-x-2">
              <label className="mr-auto text-base font-semibold dark:text-gray-200">
                {t("Corporate ашиглах эсэх")}
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
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <Form
              initialValues={khanbankCoprporate}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              autoComplete={"off"}
            >
              <Form.Item
                hidden={khanbankCoprporate?.corporateAshiglakhEsekh !== true}
                label={t("Нэвтрэх нэр")}
                name="corporateNevtrekhNer"
              >
                <Input
                  placeholder={t("Нууцлагдсан мэдээлэл")}
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
                label={t("Нэвтрэх нууц үг")}
                name="corporateNuutsUg"
              >
                <Input.Password
                  placeholder={t("Нууцлагдсан мэдээлэл")}
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
                t={t}
                className="box"
                key={mur._id}
                data={mur}
                zasya={dansBurtgeye}
                dansMutate={dansMutate}
                token={token}
              />
            ))}
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pb-2 pt-2 ${
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
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
      <div className="xxl:col-span-4 col-span-12 mt-5 lg:col-span-6">
        <div className="box mt-5 lg:mt-0">
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Дансны бүртгэл")}
            </h2>
            <div
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 fill-current p-2 text-white"
              onClick={() =>
                dansBurtgeye({ ...(tdbCoprporate || {}), bank: "tdb" })
              }
            >
              <Tooltip title={t("Нэмэх")}>
                <PlusOutlined />
              </Tooltip>
            </div>
          </div>
          <div className="dark:border-dark-5 flex items-center border-b border-gray-200 px-5 pb-2 pt-5">
            <h2 className="mr-auto text-base font-medium dark:text-gray-200">
              {t("Худалдаа хөгжлийн банк")}
            </h2>
            <div className="space-x-2">
              <label className="mr-auto text-base font-semibold dark:text-gray-200">
                {t("Corporate ашиглах эсэх")}
              </label>
              <Switch
                checked={tdbCoprporate?.corporateAshiglakhEsekh || false}
                onChange={(corporateAshiglakhEsekh) => {
                  setTdbCorporate((a) => ({ ...a, corporateAshiglakhEsekh }));
                  if (corporateAshiglakhEsekh === false) {
                    setTdbMessage();
                  }
                }}
              />
            </div>
          </div>
          <div className="dark:border-dark-5 flex flex-col items-start justify-center border-b border-gray-200 px-5 pb-2 pt-5 transition-all duration-300 ease-in-out">
            {" "}
            <Form
              initialValues={tdbCoprporate}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              autoComplete={"off"}
              form={tdbForm}
            >
              <Form.Item
                hidden={tdbCoprporate?.corporateAshiglakhEsekh !== true}
                label={t("Нэвтрэх нэр")}
                name="corporateNevtrekhNer"
              >
                <Input
                  placeholder={t("Нууцлагдсан мэдээлэл")}
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
                label={t("Нэвтрэх нууц үг")}
                name="corporateNuutsUg"
              >
                <Input.Password
                  placeholder={t("Нууцлагдсан мэдээлэл")}
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
                label={t("Гүйлгээний нууц үг")}
                name="corporateGuilgeeniiNuutsUg"
              >
                <Input.Password
                  placeholder={t("Нууцлагдсан мэдээлэл")}
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
            {tdbCoprporate?.corporateAshiglakhEsekh === true && (
              <div className="flex w-full items-center justify-center gap-8 rounded-lg border border-dashed border-gray-600 px-4 py-2">
                <div>
                  Дансны холболт амжилттай хийгдсэн эсэхийг шалгах бол энд:
                </div>
                <Button type="tertiary" loading={unshijBaina} onClick={shalgay}>
                  Шалгах
                </Button>
              </div>
            )}
          </div>
          <div className="relative pt-8">
            {dansGaralt?.jagsaalt
              ?.filter((a) => a.bank === "tdb")
              .map((mur) => (
                <DansTile
                  t={t}
                  className="box"
                  key={mur._id}
                  data={mur}
                  zasya={dansBurtgeye}
                  dansMutate={dansMutate}
                  token={token}
                />
              ))}
            <div
              className={`absolute left-1 top-1 flex w-fit items-center justify-center gap-2 rounded-lg border border-sky-500 bg-sky-400 bg-opacity-40 px-4 py-2 opacity-70 transition-all duration-300 ease-in-out ${
                tdbMessage ? "scale-100" : "scale-0"
              }`}
            >
              <div className="text-sky-800">
                <InfoCircleFilled />
              </div>
              <div>
                {tdbMessage === "Нууц үг блоклогдсон байна."
                  ? tdbMessage +
                    " " +
                    "Та интернэт банкаар нэвтрэн блокоо гаргана уу."
                  : tdbMessage}
              </div>
            </div>
          </div>
          <div
            className={`dark:border-dark-5 flex items-center justify-end border-b border-gray-200 px-5 pb-2 pt-2 ${
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
              {t("Хадгалах")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dans;
