import { DatePicker, Form, Button, message, Select, Input, Switch, Divider, InputNumber, notification, Table } from "antd";
import { ArrowLeftOutlined, SaveOutlined, PlusOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import AvlagiinKhuvaariUusgekh from "components/pageComponents/gereebaiguulakh/AvlagaiinKhuvaariUusgekh";
import KhungulultiinKhuvaariUusgekh from "components/pageComponents/gereebaiguulakh/KhungulultiinKhuvaariUusgekh";
import formatNumber from "tools/function/formatNumber";
import { useCallback, useEffect, useState, useMemo } from "react";
import Aos from "aos";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import { t } from "i18next";

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
  const [ognoonuud, setOgnoonuud] = useState(value.ognoonuud || []);
  const [khungulultKhuvaari, setKhungulultKhuvaari] = useState(value.khungulultuud || []);
  
  useEffect(() => {
    form.getFieldInstance("baritsaaBairshuulakhKhugatsaa")?.focus();
  }, []);

  useEffect(() => {
    if ((!!value.khugatsaa && (!!value.zardluud || !!value.talbainuud) && value.duusakhOgnoo > moment().startOf("month")) || !!value._id)
      khuvaariUusgey();
  }, []);

  function onFinish() {
    next(value);
  }

  function khuvaariUusgey() {
    const zardluud = value.zardluud?.filter(function (item) {
      return (
        item.turul === "Дурын" ||
        item.turul === "1м2" ||
        item.turul === "1м3/талбай" ||
        item.turul === "Тогтмол"
      );
    });
    uilchilgee(token)
      .post(`/khuvaariUusgey`, {
        dun: value.talbainNiitUne,
        khugatsaa: value.khugatsaa,
        tulukhUdruud: value.tulukhUdur,
        ekhlekhOgnoo: moment(gereeniiZagvar?.turGereeEsekh ? value.gereeniiOgnoo : moment(value.gereeniiOgnoo).startOf("month")).format("YYYY-MM-DD 00:00:00"),
        duusakhOgnoo: moment(value.duusakhOgnoo).format("YYYY-MM-DD 00:00:00"),
        zardluud: zardluud,
        khungulultuud: khungulultKhuvaari,
        mk: value.talbainKhemjee,
        metrKube: value.talbainKhemjeeMetrKube,
        turGereeEsekh: gereeniiZagvar?.turGereeEsekh,
        shineGereeEsekh: !value._id,
        guchKhonogOruulakhEsekh: value.guchKhonogOruulakhEsekh,
        garaasKhonogOruulakhEsekh: value.garaasKhonogOruulakhEsekh,
        ekhniiSariinKhonog: value.ekhniiSariinKhonog,
        gereeniiOgnoo: value.gereeniiOgnoo,
      })
      .then(({ data }) => {
        setKhuvaari(data);
        _.set(value, "avlaga.guilgeenuud", data);
        onChange({ ...value });
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  function khungulultOruulakh(){
    if(!value.sariinTurees || value.sariinTurees === 0)
    {
      notification.warning({ message: "Сарын түрээс оруулна уу!", });
      return;
    }
    if(!value.khungulukhKhuvi || value.khungulukhKhuvi === 0)
    {
      notification.warning({ message: "Хөнгөлөлтийн хувь оруулна уу!", });
      return;
    }
    if(ognoonuud?.length === 0)
    {
      notification.warning({ message: "Огноо сонгоно уу!", });
      return;
    }
    if(moment(ognoonuud[0]) < moment(value.gereeniiOgnoo) || (moment(ognoonuud[0]) < moment().startOf("month") && !!value._id))
    {
      notification.warning({ message: "Эхлэх огноог авлага үүсэх хойш огноо сонгоно уу!", });
      return;
    }
    if(moment(ognoonuud[1]) < moment(value.gereeniiOgnoo) || (moment(ognoonuud[1]) < moment().startOf("month") && !!value._id))
    {
      notification.warning({ message: "Дуусах огноог авлага үүсэх хойш огноо сонгоно уу!", });
      return;
    }
    var key = moment(ognoonuud[0]).format("YYYY-MM") + moment(ognoonuud[1]).format("YYYY-MM") + "turees" + "khuvi" + formatNumber(value.khungulukhKhuvi, 0);
    var filtered = khungulultKhuvaari?.filter((a) => a.key == key);
    if(filtered?.length > 0)
    {
      notification.warning({ message: "Хөнгөлөлт оруулсан байна!", });
      return;
    }
    var addRow = {
      key: key,
      ognoonuud: [moment(ognoonuud[0]).set("date", value.tulukhUdur[0]), moment(ognoonuud[1]).set("date", value.tulukhUdur[0])],
      turul: "turees",
      khungulukhTurul: "khuvi",
      khungulukhKhuvi: value.khungulukhKhuvi,
      tulukhDun: value.sariinTurees,
      khungulultiinDun: Math.round((((value.sariinTurees * value.khungulukhKhuvi) / 100) + Number.EPSILON) * 10000)/ 10000, 
    }
    setKhungulultKhuvaari((pre) => { return [...pre, addRow]});
    khungulultKhuvaari.push(addRow);
    value.khungulultuud = khungulultKhuvaari;
    onChange({ ...value });
    khuvaariUusgey();
  }

  useEffect(() => {
    if(!!value.sariinTurees && value.talbainIdnuud?.length > 0 && khungulultKhuvaari?.length > 0)
    {
      setKhungulultKhuvaari((pre) => {
        pre.forEach((a) => {
          a.tulukhDun = value.sariinTurees || 2;
          a.khungulultiinDun = Math.round((((value.sariinTurees * a.khungulukhKhuvi) / 100) + Number.EPSILON) * 10000)/ 10000;
        });
        value.khungulultuud = pre;
        onChange({ ...value });
        khuvaariUusgey();
        return [...pre]
      });
    }
  }, [value.sariinTurees, value.talbainIdnuud]);

  function hungulultUstgakh(e){
    setKhungulultKhuvaari((pre) => { return pre.filter((a) => a.key !== e)});
    value.khungulultuud = value.khungulultuud.filter((a) => a.key != e);
    onChange({ ...value });
    khuvaariUusgey();
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
      <div className="flex justify-between">
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
          <Form.Item
          labelAlign="left"
          name="ognoonuud"
          label={t("Хөнгөлөх сар")}
          >
            <DatePicker.RangePicker
              className="flex-end w-full rounded-md md:w-auto"
              allowClear={false}
              style={{ width: "100%" }}
              picker="month"
              placeholder={[t("Эхлэх сар"), t("Дуусах сар")]}
              onChange={(v) => {
                setOgnoonuud(v);
              }}
            />
          </Form.Item>
        </div>
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
          <Form.Item
          name="khungulukhKhuvi"
          labelAlign="left"
          >
            <Input
              className="flex ml-1 flex-end w-full rounded-md md:w-auto"
              onKeyDown={focuser}
              type={"number"}
              placeholder={"Хөнгөлөх хувь"}
            />
          </Form.Item>
        </div>  
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
          <Form.Item >
            <Button
              className="flex ml-1"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                khungulultOruulakh();
              }}
            >
            </Button>    
          </Form.Item>
        </div>  
      </div>
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="400">
        <Form.Item noStyle>
          <KhungulultiinKhuvaariUusgekh t={t} ugugdul={khungulultKhuvaari} hungulultUstgakh={hungulultUstgakh}/>
        </Form.Item>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000">
        <Form.Item label={t("Нийт хөнгөлөлт")}>
          <div className="text-right text-lg font-medium dark:text-gray-100">
            {formatNumber(value.khungulultuud?.reduce((a, b) => a + b.khungulultiinDun || 0, 0))}
          </div>
        </Form.Item>
      </div>
      <div>
        <Form.Item label={t("Түрээсийн төлбөр")}>
          <div className="text-right text-lg font-medium dark:text-gray-100">
            {formatNumber(value.sariinTurees)}
          </div>
        </Form.Item>
      </div>  
      <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="200">
        <Form.Item label={t("Нийт дүн")} style={{ marginBottom: 1 }}>
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
              className="text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
            >
              {t("Зардал бүртгэл")}
            </Button>
            {!zasvar && (
              <Button
                type="primary"gereeniiZagvar
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
