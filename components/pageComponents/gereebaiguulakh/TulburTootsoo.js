import { Form, Button, Switch, Divider, InputNumber, notification } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import AvlagiinKhuvaariUusgekh from "components/pageComponents/gereebaiguulakh/AvlagaiinKhuvaariUusgekh";
import formatNumber from "tools/function/formatNumber";
import { useCallback, useEffect, useState } from "react";
import Aos from "aos";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import { t } from "i18next";
import { toWords } from "mon_num";

const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const Tulbur = ({
  value,
  onChange,
  next,
  prev,
  zasvar,
  token,
  gereeniiZagvar,
  formSubmit,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    Aos.init({ once: true });
  });
  const [khuvaari, setKhuvaari] = useState();

  const baritsaaChange = (e) => {
    if (e === true) {
      value.baritsaaAvakhEsekh = e;
      value.baritsaaAvakhDun = value.sariinTurees;
      value.baritsaaAvakhDunUsgeer = toWords(value.sariinTurees);
    } else {
      value.baritsaaAvakhDun = 0;
      value.baritsaaAvakhEsekh = e;
      value.baritsaaAvakhDunUsgeer = toWords(" ");
    }
    onChange({ ...value });
  };
  const baritsaaDunChange = (v) => {
    if (v && value.baritsaaAvakhEsekh === true) {
      value.baritsaaAvakhDun = v;
      value.baritsaaAvakhDunUsgeer = toWords(v);
    }
    onChange({ ...value });
  };
  useEffect(() => {
    form.getFieldInstance("baritsaaBairshuulakhKhugatsaa")?.focus();
  }, []);

  useEffect(() => {
    const zardluud = value.zardluud?.filter(function (item) {
      return (
        item.turul === "Дурын" ||
        item.turul === "1м2" ||
        item.turul === "1м3/талбай" ||
        item.turul === "Тогтмол"
      );
    });
    // console.log('000000000', value);
    if (!!value.khugatsaa && value.duusakhOgnoo > moment().startOf("month") || !!value._id)
      uilchilgee(token)
        .post(`/khuvaariUusgey`, {
          dun: value.talbainNiitUne,
          khugatsaa: value.khugatsaa,
          tulukhUdruud: value.tulukhUdur,
          ekhlekhOgnoo: moment(!value._id ? moment(value.gereeniiOgnoo).startOf("month") : moment().startOf("month")).format(
            "YYYY-MM-DD 00:00:00"
          ),
          duusakhOgnoo: moment(value.duusakhOgnoo).format(
            "YYYY-MM-DD 00:00:00"
          ),
          zardluud: zardluud,
          mk: value.talbainKhemjee,
          metrKube: value.talbainKhemjeeMetrKube,
          turGereeEsekh: gereeniiZagvar?.turGereeEsekh,
        })
        .then(({ data }) => {
          setKhuvaari(data);
          _.set(value, "avlaga.guilgeenuud", data);
          onChange({ ...value });
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
  }, []);

  function onFinish() {
    next(value);
  }

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "baritsaaBairshuulakhKhugatsaa":
          document.getElementById("khadgalakhButton").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <Form
      form={form}
      {...formItemLayout}
      initialValues={value}
      autoComplete={"off"}
      onValuesChange={(values) => onChange({ ...value, ...values })}
      onFinish={onFinish}
    >
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item label={t("Түрээсийн төлбөр")} style={{ marginBottom: 10 }}>
          <div className="text-right text-lg font-medium dark:text-gray-100">
            {formatNumber(value.sariinTurees)}
          </div>
        </Form.Item>
      </div>

      {gereeniiZagvar?.turGereeEsekh !== true ? (
        <div>
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            data-aos-delay="100"
            className="ml-auto"
          >
            <Form.Item
              label={t("Барьцаа хөрөнгө авах эсэх")}
              name="baritsaaAvakhEsekh"
            >
              <Switch
                checked={value.baritsaaAvakhEsekh}
                onChange={(e) => {
                  baritsaaChange(e);
                }}
              />
            </Form.Item>
          </div>
          {value.baritsaaAvakhEsekh === true && (
            <div data-aos="fade-right" data-aos-duration="1000">
              <Form.Item label={t("Барьцаа дүн")} name="baritsaaAvakhDun">
                <InputNumber
                  value={value.baritsaaAvakhDun}
                  placeholder={t("Барьцаа дүн")}
                  style={{ width: "100%" }}
                  onChange={(e) => baritsaaDunChange(e)}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </div>
          )}
          {value.baritsaaAvakhEsekh === true && (
            <div
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-delay="100"
            >
              <Form.Item
                name="baritsaaBairshuulakhKhugatsaa"
                label={t("Хугацаа")}
              >
                <InputNumber
                  onKeyUp={focuser}
                  placeholder={t("Барьцаа байршуулах хугацаа")}
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </div>
          )}
        </div>
      ) : null}
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <Form.Item label={t("Нийт дүн")} style={{ marginBottom: 10 }}>
          <div className="text-right text-lg font-medium dark:text-gray-100">
            {formatNumber(
              (value.sariinTurees || 0) * (value.buunTulult || 1) +
                (value.baritsaaAvakhDun || 0) *
                  (value.baritsaaAvakhKhugatsaa || 0) -
                (((value.sariinTurees || 0) * 12) / 365) *
                  (value.khungulukhKhugatsaa || 0) -
                (value.khyamdaral || 0)
            )}
          </div>
        </Form.Item>
      </div>

      <Divider />
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
        <Form.Item name="avlaga" noStyle>
          <AvlagiinKhuvaariUusgekh t={t} ugugdul={khuvaari} />
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="500">
        <Form.Item wrapperCol={{ span: 24 }}>
          <div className="mt-4 flex w-full flex-col justify-between gap-4 md:flex-row">
            <Button
              onClick={prev}
              icon={<ArrowLeftOutlined />}
              className="dark:text-gray-200 dark:hover:text-gray-800"
            >
              {t("Зардал бүртгэл")}
            </Button>
            {!zasvar && (
              <Button
                type="primary"
                id="khadgalakhButton"
                onClick={() => form.submit()}
                icon={<SaveOutlined />}
              >
                {t("Хадгалах")}
              </Button>
            )}
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default Tulbur;
