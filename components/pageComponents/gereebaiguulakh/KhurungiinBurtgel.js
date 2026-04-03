import {
  Form,
  Button,
  Input,
  Select,
  notification,
  Popconfirm,
  message,
  InputNumber,
  Switch,
} from "antd";
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useCallback, useEffect, useMemo } from "react";
import { toWords } from "mon_num";
import uilchilgee from "services/uilchilgee";
import _ from "lodash";
import Aos from "aos";
import useTalbai from "hooks/useTalbai";
import { useAuth } from "services/auth";
import formatNumber from "tools/function/formatNumber";
import getListMethod from "tools/function/crud/getListMethod";
import moment from "moment";
import { toast } from "sonner";
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};

const toWordsOrEmpty = (value) => {
  if (value === undefined || value === null || value === "") return "";
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue === 0) return "";
  return toWords(numericValue);
};

function TalbaiSongolt({ value, onChange, id, mode, gereeniiZagvar }) {
  const { token, baiguullaga } = useAuth();

  const query = useMemo(() => {
    return {
      niitiinTalbaiEsekh:
        gereeniiZagvar?.turGereeEsekh === true
          ? gereeniiZagvar.turGereeEsekh
          : { $ne: true },
    };
  }, [gereeniiZagvar]);

  const { talbainiiGaralt, setTalbaiKhuudaslalt } = useTalbai(
    token,
    baiguullaga?._id,
    query
  );
  function onValueChange(v) {
    if (!talbainiiGaralt?.jagsaalt) return;

    if (mode === "multiple") {
      const selectedItems = talbainiiGaralt.jagsaalt.filter(
        (a) => v && Array.isArray(v) && v.includes(a._id)
      );
      onChange(selectedItems.map((a) => _.cloneDeep(a)));
    } else {
      const selectedItem = talbainiiGaralt.jagsaalt.find((a) => a._id === v);
      if (selectedItem) {
        onChange(_.cloneDeep(selectedItem));
      } else if (v === undefined || v === null) {
        // Allow clearing selection
        onChange(undefined);
      }
    }
  }

  // Get the value for the Select - should be ID(s), not object(s)
  const selectValue = useMemo(() => {
    if (!value) return undefined;
    if (mode === "multiple") {
      return Array.isArray(value)
        ? value.map((v) => (typeof v === "string" ? v : v?._id))
        : [];
    } else {
      return typeof value === "string" ? value : value?._id;
    }
  }, [value, mode]);

  return (
    <Select
      id={id}
      placeholder="Талбай"
      filterOption={false}
      value={selectValue}
      mode={mode}
      showSearch
      onChange={onValueChange}
      loading={!talbainiiGaralt}
      onSearch={(search) => setTalbaiKhuudaslalt((a) => ({ ...a, search }))}
      getPopupContainer={(triggerNode) => {
        // Always render to body to avoid scroll/click issues
        return document.body;
      }}
      dropdownMatchSelectWidth={true}
      dropdownStyle={{
        zIndex: 1050,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(12px) saturate(180%)",
      }}
      dropdownClassName="ant-select-dropdown-opaque"
      virtual={false}
    >
      {talbainiiGaralt?.jagsaalt?.map((a) => {
        return (
          <Select.Option
            key={a._id}
            value={a._id}
            disabled={a?.sulKhemjee === 0}
          >
            <div
              className={`pointer-events-none flex ${
                gereeniiZagvar?.turGereeEsekh !== true && a.idevkhiteiEsekh
                  ? "opacity-50"
                  : "opacity-100"
              } `}
            >
              <p className="w-28 border-r-2 text-left">{a.kod}</p>
              <p className="w-24 border-r-2 text-center">
                {a.talbainKhemjee}м<sup>2</sup>
              </p>
              <p className="w-20 border-r-2 text-center">{a.davkhar}F</p>
              <p className="w-full text-right">
                {formatNumber(a.talbainNiitUne ? a.talbainNiitUne : 0)}₮
              </p>
            </div>
          </Select.Option>
        );
      })}
    </Select>
  );
}

const KhurungiinBurtgel = ({
  token,
  next,
  prev,
  onChange,
  value,
  gereeniiZagvar,
  barilgiinId,
  formSubmit,
  baiguullaga,
  t,
}) => {
  const [form] = Form.useForm();
  const baritsaaAvakhSar = baiguullaga?.tokhirgoo?.baritsaaAvakhSar || 0;
  const baritsaaAvakhEsekh =
    baiguullaga?.tokhirgoo?.baritsaaAvakhEsekh || false;

  useEffect(() => {
    if (
      value.baritsaaAvakhEsekh === undefined ||
      value.baritsaaAvakhEsekh === null
    ) {
      form.setFieldValue("baritsaaAvakhEsekh", baritsaaAvakhEsekh);
      onChange({ ...value, baritsaaAvakhEsekh });
    } else if (!baritsaaAvakhEsekh && value.baritsaaAvakhEsekh === true) {
      form.setFieldValue("baritsaaAvakhEsekh", false);
      onChange({ ...value, baritsaaAvakhEsekh: false });
    }
  }, [baritsaaAvakhEsekh]);

  useEffect(() => {
    if (
      value.baritsaaAvakhEsekh === true &&
      baritsaaAvakhEsekh &&
      baritsaaAvakhSar > 0
    ) {
      form.setFieldValue("baritsaaAvakhKhugatsaa", baritsaaAvakhSar);
    } else if (!baritsaaAvakhEsekh) {
      form.setFieldValue("baritsaaAvakhKhugatsaa", 0);
    }
  }, [baritsaaAvakhSar, value.baritsaaAvakhEsekh, baritsaaAvakhEsekh]);
  useEffect(() => {
    if (!!value.talbainIdnuud && !value.talbainuud) {
      getListMethod("talbai", token, {
        ...{
          khuudasniiDugaar: 1,
          khuudasniiKhemjee: 1000,
        },
        query: { _id: { $in: value.talbainIdnuud } },
      }).then(({ data }) => {
        value.talbainuud = data.jagsaalt;
        onChange({ ...value });
      });
    }
  }, [value]);

  useEffect(() => {
    if (
      (!!value.khugatsaa &&
        !!value.talbainIdnuud &&
        value.duusakhOgnoo > moment().startOf("month")) ||
      !!value._id
    )
      uilchilgee(token)
        .post(`/khuvaariUusgey`, {
          dun: value.sariinTurees,
          khugatsaa: value.khugatsaa,
          tulukhUdruud: value.tulukhUdur,
          ekhlekhOgnoo: moment(
            gereeniiZagvar?.turGereeEsekh
              ? value.gereeniiOgnoo
              : moment(value.gereeniiOgnoo).startOf("month")
          ).format("YYYY-MM-DD 00:00:00"),
          duusakhOgnoo: moment(value.duusakhOgnoo).format(
            "YYYY-MM-DD 00:00:00"
          ),
          zardluud: value.zardluud,
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
          _.set(value, "avlaga.guilgeenuud", data);
          onChange({ ...value });
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
  }, [value.talbainIdnuud]);

  const sulEsekh = (talbainDugaar, callback) => {
    uilchilgee(token)
      .get("/talbainSulEskhiigShalgay", {
        params: {
          talbainDugaar: talbainDugaar,
          barilgiinId: barilgiinId,
        },
      })
      .then(({ data }) => {
        if (data === "OK" || data === value.gereeniiDugaar) {
          callback(data);
        } else
          notification.warning({
            message: (
              <div>
                {talbainDugaar} {t("талбай нь")} {data}{" "}
                {t("гэрээн дээр холбогдсон байна.")}
              </div>
            ),
          });
      });
  };

  function talbainBurtgelBugulyu(talbainuud) {
    value.sariinTurees = talbainuud.reduce(
      (a, b) => a + Number(b.talbainNiitUne || 0),
      0
    );

    value.talbainNegjUne = talbainuud.reduce(
      (a, b) => a + Number(b.talbainNegjUne || 0),
      0
    );

    if (baritsaaAvakhSar > 0 && value.baritsaaAvakhEsekh === true) {
      value.baritsaaAvakhDun = value.sariinTurees * baritsaaAvakhSar;
      value.baritsaaAvakhDunUsgeer = toWords(value.baritsaaAvakhDun);
      value.baritsaaAvakhKhugatsaa = baritsaaAvakhSar;
    } else if (value.baritsaaAvakhEsekh !== true) {
      value.baritsaaAvakhDun = 0;
      value.baritsaaAvakhDunUsgeer = "";
      value.baritsaaAvakhKhugatsaa = 0;
    }

    if (gereeniiZagvar?.turGereeEsekh !== true) {
      value.talbainNiitUne = value.sariinTurees;
      value.talbainKhemjee = talbainuud.reduce(
        (a, b) => a + b.talbainKhemjee,
        0
      );
    } else {
      value.talbainNiitUne = talbainuud.reduce(
        (a, b) => a + Number(b.talbainNiitUne || 0),
        0
      );
      value.talbainKhemjee = talbainuud.reduce((a, b) => b.talbainKhemjee, 0);
    }

    value.talbainKhemjeeMetrKube = (talbainuud || []).reduce(
      (a, b) => a + Number(b.talbainKhemjeeMetrKube || 0),
      0
    );
    value.talbainNegjUneUsgeer = toWordsOrEmpty(value.talbainNegjUne);
    value.talbainNiitUneUsgeer = toWordsOrEmpty(value.talbainNiitUne);
    value.davkhar = [...new Set(talbainuud.map((a) => a.davkhar))].join(",");

    const newTalbainIdnuud = talbainuud.map((a) => a._id);
    if (!_.isEqual(value.talbainIdnuud, newTalbainIdnuud)) {
      value.talbainIdnuud = newTalbainIdnuud;
    }

    value.talbainDugaar = talbainuud.map((a) => a.kod).join(",");

    form.setFieldsValue(value);
  }

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "validate_other_khugatsaa":
          if (value?.turGereeEsekh === true) {
            form.getFieldInstance("duusakhOgnoo").focus();
          } else form.getFieldInstance("tulukhUdur").focus();
          break;
        default:
          break;
      }
    }
  }, []);
  function onChangeTalbai(v) {
    if (!!value.talbainuud?.find((a) => a.kod === v.kod)) {
      notification.warning({
        message: (
          <div>
            <b>{v.kod}</b> {t("талбай нь гэрээн дээр сонгогдсон байна.")}
          </div>
        ),
      });
      return;
    }
    function talbaiOruulya() {
      value.talbainuud = value.talbainuud || [];
      v.tooluuriinDugaar = v.tooluuriinDugaar || "";

      if (gereeniiZagvar?.turGereeEsekh === true) {
        v.talbainKhemjee = 0;
        v.talbainNiitUne = 0;
      }
      value.talbainuud.push(v);
      talbainBurtgelBugulyu(value.talbainuud);
      onChange({ ...value });
    }
    if (gereeniiZagvar?.turGereeEsekh) {
      talbaiOruulya();
    } else sulEsekh(v.kod, talbaiOruulya);
  }

  function talbaiUstgaya(index) {
    value.talbainuud.splice(index, 1);
    talbainBurtgelBugulyu(value.talbainuud);
    onChange({ ...value });
  }

  useEffect(() => {
    Aos.init({ once: true });
  });
  useEffect(() => {
    document.getElementById("talbaiSongolt").focus();
  }, []);

  function onFinish() {
    if (value.talbainuud === undefined) {
      toast.warning(t("Талбай бүртгэнэ үү!"));
      return;
    } else if (value.talbainuud.length <= 0) {
      toast.warning(t("Талбай бүртгэнэ үү!"));
      return;
    }
    if (value.talbainNiitUne === undefined) {
      toast.warning(t("Талбайн үнэ бүртгэнэ үү!"));
      return;
    }
    if (value.talbainKhemjee === undefined) {
      toast.warning(t("Талбайн хэмжээ бүртгэнэ үү!"));
      return;
    }
    next();
  }

  const onChangeM2 = useCallback(
    _.debounce((i, v) => {
      const talbai = value.talbainuud[i];

      if (
        talbai.originalTalbainKhemjeeMetrKube === undefined &&
        talbai.talbainKhemjeeMetrKube
      ) {
        _.set(
          value.talbainuud,
          `${i}.originalTalbainKhemjeeMetrKube`,
          talbai.talbainKhemjeeMetrKube
        );
      }

      _.set(value.talbainuud, `${i}.talbainKhemjee`, v || 0);

      if (
        talbai.originalTalbainKhemjeeMetrKube !== undefined &&
        talbai.sulKhemjee
      ) {
        const sulKhemjee = talbai.sulKhemjee ?? talbai.talbainKhemjee;
        if (sulKhemjee > 0) {
          if (v && v > 0) {
            const newMetrKube =
              talbai.originalTalbainKhemjeeMetrKube * (v / sulKhemjee);
            _.set(value.talbainuud, `${i}.talbainKhemjeeMetrKube`, newMetrKube);
          } else {
            _.set(
              value.talbainuud,
              `${i}.talbainKhemjeeMetrKube`,
              talbai.originalTalbainKhemjeeMetrKube
            );
          }
        }
      }

      talbainBurtgelBugulyu(value.talbainuud);
      onChange({ ...value });
    }, 500),
    [value]
  );

  const onChangeUne = useCallback(
    _.debounce((i, v) => {
      _.set(value.talbainuud, `${i}.talbainNiitUne`, v || 0);

      if (gereeniiZagvar?.turGereeEsekh === true) {
        value.talbainNiitUne = v || 0;
        value.sariinTurees = v || 0;
      }

      talbainBurtgelBugulyu(value.talbainuud);
      onChange({ ...value });
    }, 500),
    [value, gereeniiZagvar]
  );

  const baritsaaChange = (e) => {
    if (e === true) {
      value.baritsaaAvakhEsekh = e;

      value.baritsaaAvakhDun = value.sariinTurees * (baritsaaAvakhSar || 1);
      value.baritsaaAvakhDunUsgeer = toWords(value.baritsaaAvakhDun);

      value.baritsaaAvakhKhugatsaa = baritsaaAvakhSar;
    } else {
      value.baritsaaAvakhDun = 0;
      value.baritsaaAvakhEsekh = e;
      value.baritsaaAvakhDunUsgeer = toWords(" ");
      value.baritsaaAvakhKhugatsaa = 0;
    }

    form.setFieldsValue({
      baritsaaAvakhDun: value.baritsaaAvakhDun,
      baritsaaAvakhKhugatsaa: value.baritsaaAvakhKhugatsaa,
    });
    onChange({ ...value });
  };
  const baritsaaDunChange = (v) => {
    if (v && value.baritsaaAvakhEsekh === true) {
      value.baritsaaAvakhDun = v;
      value.baritsaaAvakhDunUsgeer = toWords(v);
    }
    onChange({ ...value });
  };

  return (
    <Form
      form={form}
      name="validate_other"
      {...formItemLayout}
      initialValues={value}
      onFinish={onFinish}
      autoComplete={"off"}
      onValuesChange={(values) => onChange({ ...value, ...values })}
    >
      <div data-aos="fade-right " data-aos-duration="1000">
        <Form.Item
          hidden={
            gereeniiZagvar?.turGereeEsekh === true &&
            value?.talbainuud?.length > 0
          }
          label={t("Талбай")}
        >
          <TalbaiSongolt
            value={""}
            id={"talbaiSongolt"}
            onChange={onChangeTalbai}
            gereeniiZagvar={gereeniiZagvar}
          />
        </Form.Item>
      </div>
      <div
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="100"
        className="max-h-[60vh] space-y-2 overflow-y-auto pb-4"
        style={{ maxHeight: "60vh", overflowY: "auto" }}
      >
        {value.talbainuud?.map((talbai, index) => {
          return (
            <div
              key={talbai?._id}
              className="group relative space-y-2 rounded-md border border-gray-400 bg-gray-50 p-2 pb-5 shadow-md dark:bg-gray-800 dark:text-gray-300"
            >
              <div className="text-xl font-medium">
                {t("Код")}:{talbai.kod}
              </div>
              <div className="divide-y-2 border">
                <div
                  className={`grid ${
                    gereeniiZagvar?.turGereeEsekh &&
                    talbai.talbainKhemjeeMetrKube
                      ? "grid-cols-5"
                      : gereeniiZagvar?.turGereeEsekh ||
                        talbai.talbainKhemjeeMetrKube
                      ? "grid-cols-4"
                      : "grid-cols-3"
                  } divide-x-2 py-1`}
                >
                  <div className="flex items-center justify-center text-center">
                    {t("Давхар")}
                  </div>
                  {gereeniiZagvar.turGereeEsekh && (
                    <div className="flex items-center justify-center text-center">
                      {t("сул м")}
                    </div>
                  )}
                  <div className="flex items-center justify-center text-center">
                    {t("м")}
                    <sup>2</sup>
                  </div>
                  {talbai.talbainKhemjeeMetrKube > 0 && (
                    <div className="flex items-center justify-center text-center">
                      {t("м")}
                      <sup>3</sup>
                    </div>
                  )}
                  <div className="flex items-center justify-center text-center">
                    {t("Түрээсийн төлбөр")}
                  </div>
                </div>
                <div
                  className={`grid ${
                    gereeniiZagvar?.turGereeEsekh &&
                    talbai.talbainKhemjeeMetrKube
                      ? "grid-cols-5"
                      : gereeniiZagvar?.turGereeEsekh ||
                        talbai.talbainKhemjeeMetrKube
                      ? "grid-cols-4"
                      : "grid-cols-3"
                  } divide-x-2 py-1`}
                >
                  <div className="text-center">{talbai.davkhar}</div>
                  <div className="text-center">
                    {gereeniiZagvar.turGereeEsekh
                      ? talbai.sulKhemjee ?? talbai.talbainKhemjee
                      : talbai.talbainKhemjee}
                  </div>
                  {gereeniiZagvar.turGereeEsekh && (
                    <div className="flex items-center justify-center text-center">
                      <InputNumber
                        size="small"
                        formatter={(v) =>
                          `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        max={value?._id ? undefined : talbai?.sulKhemjee}
                        parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                        value={value?.talbainKhemjee || 0}
                        onChange={(v) => onChangeM2(index, v)}
                      />
                    </div>
                  )}
                  {talbai.talbainKhemjeeMetrKube > 0 && (
                    <div className="text-center">
                      {talbai?.talbainKhemjeeMetrKube.toFixed(2)}
                    </div>
                  )}
                  <div className="pr-2 text-right">
                    {gereeniiZagvar.turGereeEsekh ? (
                      <InputNumber
                        size="small"
                        value={
                          gereeniiZagvar.turGereeEsekh &&
                          value.talbainuud?.length === 1
                            ? value.talbainNiitUne || 0
                            : talbai.talbainNiitUne || 0
                        }
                        formatter={(v) => {
                          if (!v) return "0";
                          return String(v).replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ","
                          );
                        }}
                        parser={(v) => {
                          const parsed = v.replace(/[^\d]/g, "");
                          return parsed ? Number(parsed) : 0;
                        }}
                        onChange={(v) => onChangeUne(index, v)}
                        style={{ width: "100%" }}
                      />
                    ) : (
                      formatNumber(talbai.talbainNiitUne || 0)
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute right-2 top-0 flex items-center justify-center rounded-full bg-gray-100 text-lg dark:bg-gray-800">
                <Popconfirm
                  title={`${talbai.kod} талбай устгах уу?`}
                  okText={t("Тийм")}
                  cancelText={t("Үгүй")}
                  onConfirm={() => talbaiUstgaya(index)}
                >
                  <div className="cursor-pointer text-3xl text-gray-400 transition-colors duration-300 hover:text-red-500 dark:text-gray-200 dark:hover:text-red-600">
                    <CloseCircleOutlined />
                  </div>
                </Popconfirm>
              </div>
            </div>
          );
        })}
      </div>
      <div
        data-aos="fade-right"
        data-aos-duration="1000"
        data-aos-delay="200"
        className="py-5 dark:text-gray-200"
      >
        <div className="divide-y-2 border">
          <div className="grid grid-cols-12 divide-x-2">
            <div className="col-span-4 text-center">{t("Давхар")}</div>
            <div className="col-span-4 text-center">
              {t("м")}
              <sup>2</sup>
            </div>
            <div className="col-span-4 text-center">{t("Нийт төлбөр")}</div>
          </div>
          <div className="grid grid-cols-12 divide-x-2">
            <div className="col-span-4 text-center text-base font-medium">
              {value.davkhar}
            </div>
            <div className="col-span-4 text-center text-base font-medium">
              {parseFloat(value.talbainKhemjee || 0).toFixed(2)}
            </div>
            <div className="col-span-4 pr-2 text-right text-base font-medium">
              {formatNumber(value.sariinTurees)}
            </div>
          </div>
        </div>
      </div>
      <Form.Item label={t("Зориулалт")} name={"zoriulalt"}>
        <Input placeholder={t("Ашиглах зориулалт")} />
      </Form.Item>
      <Form.Item label={t("Тусгай зориулалт")} name={"tusgaiZoriulalt"}>
        <Input placeholder={t("Ашиглах тусгай зориулалт")} />
      </Form.Item>
      <Form.Item
        label={t("Талбайн нэмэлт нөхцөл")}
        name={"talbaiNemeltNukhtsul"}
      >
        <Input placeholder={t("Талбайн нэмэлт нөхцөл")} />
      </Form.Item>
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
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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
                name="baritsaaAvakhKhugatsaa"
                label={t("Барьцаа авах хугацаа")}
              >
                <InputNumber
                  onKeyUp={focuser}
                  placeholder={t("Барьцаа авах хугацаа")}
                  style={{ width: "100%" }}
                  min={0}
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
                label={t("Барьцаа байршуулах хугацаа")}
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
      <Form.Item wrapperCol={{ span: 24 }}>
        <div
          className="mt-4 flex w-full flex-col justify-between gap-4 md:flex-row"
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="700"
        >
          <Button
            onClick={prev}
            icon={<ArrowLeftOutlined />}
            className="text-gray-400 dark:!border-white dark:!bg-gray-800 dark:!text-gray-400"
          >
            {t("Буцах")}
          </Button>
          <Button
            type="primary"
            id="zardalBurtgelButton"
            onClick={() => form.submit()}
            icon={<ArrowRightOutlined />}
          >
            {t("Үргэлжлүүлэх")}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default KhurungiinBurtgel;
