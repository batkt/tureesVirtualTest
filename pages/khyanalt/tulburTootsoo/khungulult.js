import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  notification,
  Popconfirm,
  Popover,
  Select,
  Table,
  Tabs,
  Switch,
} from "antd";
import { toast } from "sonner";
import Admin from "components/Admin";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import useKhungulultTuukh from "hooks/tulburTootsoo/useKhungulultTuukh";
import _ from "lodash";
import moment from "moment";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "services/auth";
import shalgaltKhiikh from "services/shalgaltKhiikh";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import createMethod from "tools/function/crud/createMethod";
import formatNumber from "tools/function/formatNumber";
import Aos from "aos";
import { modal } from "components/ant/Modal";
import { useTranslation } from "react-i18next";
import useJagsaalt from "hooks/useJagsaalt";

const Tailbar = React.forwardRef(({ destroy, confirm }, ref) => {
  const [tailbar, setTailbar] = useState("");
  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        confirm(tailbar);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [tailbar]
  );
  return (
    <div>
      <Input.TextArea
        value={tailbar}
        onChange={({ target }) => setTailbar(target?.value)}
      />
    </div>
  );
});

function tulburTootsoo() {
  useEffect(() => {
    Aos.init({ once: true });
  });
  const { t, i18n } = useTranslation();
  const { token, baiguullaga, barilgiinId, ajiltan } = useAuth();
  const [ekhlekhOgnoo, setEkhlekhOgnoo] = useState([moment(), moment()]);
  const formRef = useRef();
  const [songogdsonGereenuud, setSongogdsonGereenuud] = useState([]);
  const [ognoonuud, setOgnoonuud] = useState([]);
  const [khonogTootsokhEsekh, setKhonogTootsokhEsekh] = useState(false);
  const [turul, setTurul] = useState("turees");
  const tailbarRef = React.useRef(null);
  const [shuult, setShuult] = React.useState({
    query: { tuluv: { $ne: -1 } },
  });
  const [songogdsonNuur, setSongogdsonNuur] = useState("1");

  const [form] = Form.useForm();

  const query = useMemo(() => {
    return {
      createdAt: ekhlekhOgnoo
        ? {
            $gte: moment(ekhlekhOgnoo[0]).format("YYYY-MM-DD 00:00:00"),
            $lte: moment(ekhlekhOgnoo[1]).format("YYYY-MM-DD 23:59:59"),
          }
        : undefined,
    };
  }, [ekhlekhOgnoo]);
  const select = {
    _id: 1,
    gereeniiDugaar: 1,
    aktiinZagvariinId: 1,
    gereeniiOgnoo: 1,
    turul: 1,
    ovog: 1,
    ner: 1,
    register: 1,
    customerTin: 1,
    albanTushaal: 1,
    zakhirliinOvog: 1,
    zakhirliinNer: 1,
    utas: 1,
    mail: 1,
    khayag: 1,
    khugatsaa: 1,
    duusakhOgnoo: 1,
    sariinTurees: 1,
    zuvshuurliinZurag: 1,
    talbainDugaar: 1,
    talbainNegjUne: 1,
    talbainNiitUne: 1,
    talbainKhemjee: 1,
    talbainKhemjeeMetrKube: 1,
    davkhar: 1,
    baritsaaAvakhDun: 1,
    baritsaaBairshuulakhKhugatsaa: 1,
    baritsaaAvakhKhugatsaa: 1,
    baiguullagiinId: 1,
    baiguullagiinNer: 1,
    barilgiinId: 1,
    gereeniiZagvariinId: 1,
    tulukhUdur: 1,
    tuluv: 1,
    dans: 1,
    gereeniiTuukhuud: 1,
    createdAt: 1,
    aldangiinUldegdel: 1,
    segmentuud: 1,
    turGereeEsekh: 1,
    talbainIdnuud: 1,
    zardluud: 1,
    zoriulalt: 1,
    zurguud: 1,
    tusgaiZoriulalt: 1,
    avlaga: 1,
  };

  const { gereeniiMedeelel, setGereeniiKhuudaslalt, isValidating } =
    useGereeniiJagsaalt(
      songogdsonNuur === "1" && token,
      baiguullaga?._id,
      undefined,
      shuult?.query,
      undefined,
      1000,
      undefined,
      select
    );
  const {
    khungulultTuukh,
    khungulultTuukhMutate,
    setKhuudaslalt,
    isValidating2,
  } = useKhungulultTuukh(
    songogdsonNuur === "2" && token,
    baiguullaga?._id,
    query
  );

  const [tootsoolol, setTootsoolol] = useState({
    niitTalbai: 0,
    niitSariinTurees: 0,
    khunglugdsunDun: 0,
    niitTulukhDun: 0,
    khungulukhKhuvi: 0,
  });
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [waiting, setWaiting] = useState(false);
  const [khungulukh, setKhungulukh] = useState("khuvi");
  const [songogdsonZardal, setSongogdsonZardal] = useState({});

  const { Option } = Select;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const qZardal = useMemo(
    () => ({
      barilgiinId,
    }),
    [barilgiinId]
  );

  const zardal = useJagsaalt(
    "/ashiglaltiinZardluud",
    qZardal,
    undefined,
    undefined,
    undefined,
    token
  );

  const isSelectedUtilityExpense = useMemo(() => {
    const zardliinId = form.getFieldValue("zardliinId");
    const khungulukhTurul = form.getFieldValue("khungulukhTurul");

    if (khungulukhTurul !== "zardal" || !zardliinId) {
      return false;
    }

    const selectedZardal = zardal?.jagsaalt?.find((z) => z._id === zardliinId);
    return (
      selectedZardal?.ner === "Халуун ус" ||
      selectedZardal?.ner === "Хүйтэн ус" ||
      selectedZardal?.ner === "Цахилгаан"
    );
  }, [
    form.getFieldValue("zardliinId"),
    form.getFieldValue("khungulukhTurul"),
    zardal?.jagsaalt,
  ]);

  const filteredGereeniiJagsaalt = useMemo(() => {
    const zardliinId = form.getFieldValue("zardliinId");
    const khungulukhTurul = form.getFieldValue("khungulukhTurul");

    if (!gereeniiMedeelel?.jagsaalt) return [];

    if (khungulukhTurul !== "zardal" || !zardliinId) {
      return gereeniiMedeelel.jagsaalt;
    }

    const selectedZardal = zardal?.jagsaalt?.find((z) => z._id === zardliinId);

    const isUtilityExpense =
      selectedZardal?.ner === "Халуун ус" ||
      selectedZardal?.ner === "Хүйтэн ус" ||
      selectedZardal?.ner === "Цахилгаан";

    if (!isUtilityExpense) {
      return gereeniiMedeelel.jagsaalt;
    }

    return gereeniiMedeelel.jagsaalt.filter((geree) => {
      const zardliinData = geree?.zardluud?.find((z) => z._id === zardliinId);
      if (zardliinData && (zardliinData.tulukhDun || 0) !== 0) {
        return true;
      }

      const hasAvlagaData = geree?.avlaga?.guilgeenuud?.some((guilgee) => {
        return (
          guilgee.tailbar === selectedZardal?.ner &&
          (guilgee.tulukhDun || 0) !== 0
        );
      });

      return hasAvlagaData;
    });
  }, [
    gereeniiMedeelel?.jagsaalt,
    form.getFieldValue("zardliinId"),
    form.getFieldValue("khungulukhTurul"),
    zardal?.jagsaalt,
  ]);

  useEffect(() => {
    if (form.getFieldValue("turul") === "Бүгд") {
      onSelectChange(
        filteredGereeniiJagsaalt.map((r) => r._id),
        filteredGereeniiJagsaalt
      );
    }
  }, [shuult, form, filteredGereeniiJagsaalt]);

  useEffect(() => {
    khungulukhDunTootsoolyo();
  }, [songogdsonGereenuud]);

  function disabledDate(current) {
    return ajiltan?.erkh == "Admin" ||
      _.get(ajiltan, `tokhirgoo.umkhunSaraarKhungulultEsekh`)?.find(
        (a) => a === barilgiinId
      )
      ? false
      : current && current < moment().startOf("day");
  }

  function handleChange(value) {
    if (value.length > 0) {
      setShuult({
        query: { davkhar: value, tuluv: { $nin: -1 } },
      });
    } else {
      setShuult({ query: { tuluv: { $ne: -1 } } });
      setRowKeys([]);
      setSongogdsonGereenuud([]);
    }
  }
  function nukhtulSongokh(value) {
    if (value === "Бүгд") {
      setShuult((prev) => ({
        ...prev,
        tuluv: { $ne: -1 },
      }));
      form.setFieldValue("davkhar", []);
    } else {
      setRowKeys([]);
      setSongogdsonGereenuud([]);
    }
  }

  function dundakhSaruudAvya(ekhlekhOgnoo, duusakhOgnoo) {
    const months = [];
    let odooginOgnoo = moment(ekhlekhOgnoo).startOf("month");

    while (odooginOgnoo.isSameOrBefore(moment(duusakhOgnoo).startOf("month"))) {
      months.push(odooginOgnoo.format("YYYY-MM-01 00:00:00"));
      odooginOgnoo.add(1, "months");
    }

    return months;
  }

  function khungulultKhadgalya() {
    setWaiting(true);
    if (
      ajiltan?.erkh !== "Admin" &&
      !_.get(ajiltan, `tokhirgoo.khungulultUzuulekhEsekh`)?.find(
        (a) => a === barilgiinId
      )
    ) {
      setWaiting(false);
      notification.warning({
        message: t("Таньд гэрээ хөнгөлөх эрх байхгүй байна."),
      });
      return;
    }
    if (baiguullaga.tokhirgoo.bukhAjiltanKhungulultOruulakhEsekh === false) {
      setWaiting(false);
      notification.warning({
        message: t("Хөнгөлөлт оруулах эрх хаагдсан байна."),
      });
      return;
    }
    if (songogdsonGereenuud.length > 0) {
      var ugugdul = form.getFieldsValue();
      if (!ugugdul.khonogTootsokhEsekh)
        ugugdul.ognoonuud = dundakhSaruudAvya(ognoonuud[0], ognoonuud[1]);
      ugugdul.barilgiinId = barilgiinId;
      ugugdul.tulukhDun = tootsoolol.niitSariinTurees;
      ugugdul.khungulsunDun = tootsoolol.niitTulukhDun;
      ugugdul.khungulultiinDun = tootsoolol.khunglugdsunDun;
      ugugdul.khamaataiGereenuud = songogdsonGereenuud.map((x) => {
        var zardliinData = x?.zardluud?.find(
          (e) => e?._id === form.getFieldValue("zardliinId")
        );

        if (turul === "zardal") {
          ugugdul.tailbar = songogdsonZardal.ner;

          var khymdraaguiDun;
          const isUtilityExpense =
            zardliinData?.ner === "Халуун ус" ||
            zardliinData?.ner === "Хүйтэн ус" ||
            zardliinData?.ner === "Цахилгаан" ||
            songogdsonZardal?.ner === "Халуун ус" ||
            songogdsonZardal?.ner === "Хүйтэн ус" ||
            songogdsonZardal?.ner === "Цахилгаан";

          if (isUtilityExpense) {
            if (zardliinData && (zardliinData.tulukhDun || 0) !== 0) {
              khymdraaguiDun = zardliinData?.tulukhDun || 0;
            } else {
              const avlagaData = x?.avlaga?.guilgeenuud?.find(
                (guilgee) =>
                  guilgee.tailbar ===
                    (zardliinData?.ner || songogdsonZardal?.ner) &&
                  (guilgee.tulukhDun || 0) !== 0
              );
              khymdraaguiDun = avlagaData?.tulukhDun || 0;
            }
          } else if (zardliinData) {
            var urjuulekhData =
              zardliinData?.turul === "1м3/талбай"
                ? x.talbainKhemjeeMetrKube || 1
                : zardliinData?.turul === "1м2"
                ? x?.talbainKhemjee
                : zardliinData?.turul === "Тогтмол" && 1;

            khymdraaguiDun =
              zardliinData?.turul === "Дурын"
                ? zardliinData.dun
                : zardliinData?.tariff * urjuulekhData;
          } else {
            khymdraaguiDun = 0;
          }
          if (
            khonogTootsokhEsekh &&
            baiguullaga?.tokhirgoo?.khonogKhungulultOruulakhEsekh
          ) {
            var guchHonogOruulahEsehZardal = x.guchKhonogOruulakhEsekh;

            if (
              !guchHonogOruulahEsehZardal &&
              ugugdul.khungulultKhuvi &&
              ugugdul.khungulultKhuvi > 0
            ) {
              const ehlel = ognoonuud?.[0];
              const duusah = ognoonuud?.[1];

              const ehlelMonth = moment(ehlel).format("YYYY-MM");
              const duusahMonth = moment(duusah).format("YYYY-MM");
              const isSameMonth = ehlelMonth === duusahMonth;

              if (isSameMonth) {
                const totalDaysInMonth = moment(ehlel).daysInMonth();
                var NegOdriinTolokh = khymdraaguiDun / totalDaysInMonth;
                const dailyDiscount =
                  (NegOdriinTolokh * ugugdul.khungulultKhuvi) / 100;
                var khymdarsanDun = dailyDiscount * ugugdul.khungulultKhonog;
              } else {
                const ehlelMonthEnd = moment(ehlel).endOf("month");
                const duusahMonthStart = moment(duusah).startOf("month");

                const firstMonthDays =
                  moment(ehlelMonthEnd).diff(moment(ehlel), "days") + 1;
                const firstMonthTotalDays = moment(ehlel).daysInMonth();
                const firstMonthDailyRate =
                  khymdraaguiDun / firstMonthTotalDays;
                const firstMonthDiscount =
                  (firstMonthDailyRate * ugugdul.khungulultKhuvi) / 100;
                const firstMonthTotal = firstMonthDiscount * firstMonthDays;

                const secondMonthDays =
                  moment(duusah).diff(duusahMonthStart, "days") + 1;
                const secondMonthTotalDays = moment(duusah).daysInMonth();
                const secondMonthDailyRate =
                  khymdraaguiDun / secondMonthTotalDays;
                const secondMonthDiscount =
                  (secondMonthDailyRate * ugugdul.khungulultKhuvi) / 100;
                const secondMonthTotal = secondMonthDiscount * secondMonthDays;

                var khymdarsanDun = firstMonthTotal + secondMonthTotal;
              }
            } else if (ugugdul.khungulultKhuvi && ugugdul.khungulultKhuvi > 0) {
              var khymdarsanDun =
                ugugdul.khungulultKhonog *
                ((ugugdul.khungulultKhuvi * khymdraaguiDun) / 100);
            } else {
              var khymdarsanDun =
                (ugugdul.khungulultKhonog * khymdraaguiDun) /
                (parseFloat(moment(ognoonuud[0]).endOf("month").format("DD")) ||
                  1);
            }
          } else if (khungulukh === "khuvi") {
            var khymdarsanDun =
              khymdraaguiDun * (parseFloat(tootsoolol?.khungulukhKhuvi) / 100);
          } else {
            var khymdarsanDun = parseFloat(tootsoolol?.khunglugdsunDun);
          }
        } else {
          ugugdul.tailbar = "Хөнгөлөлт";
          var khymdraaguiDun = x.sariinTurees;
          var guchHonogOruulahEseh = x.guchKhonogOruulakhEsekh;

          if (
            khonogTootsokhEsekh &&
            baiguullaga?.tokhirgoo?.khonogKhungulultOruulakhEsekh
          ) {
            if (
              !guchHonogOruulahEseh &&
              ugugdul.khungulultKhuvi &&
              ugugdul.khungulultKhuvi > 0
            ) {
              const ehlel = ognoonuud?.[0];
              const duusah = ognoonuud?.[1];

              const ehlelMonth = moment(ehlel).format("YYYY-MM");
              const duusahMonth = moment(duusah).format("YYYY-MM");
              const isSameMonth = ehlelMonth === duusahMonth;

              if (isSameMonth) {
                const totalDaysInMonth = moment(ehlel).daysInMonth();

                var NegOdriinTolokh = khymdraaguiDun / totalDaysInMonth;
                const dailyDiscount =
                  (NegOdriinTolokh * ugugdul.khungulultKhuvi) / 100;
                var khymdarsanDun = dailyDiscount * ugugdul.khungulultKhonog;
              } else {
                const ehlelMonthEnd = moment(ehlel).endOf("month");
                const duusahMonthStart = moment(duusah).startOf("month");

                const firstMonthDays =
                  moment(ehlelMonthEnd).diff(moment(ehlel), "days") + 1;
                const firstMonthTotalDays = moment(ehlel).daysInMonth();
                const firstMonthDailyRate =
                  khymdraaguiDun / firstMonthTotalDays;
                const firstMonthDiscount =
                  (firstMonthDailyRate * ugugdul.khungulultKhuvi) / 100;
                const firstMonthTotal = firstMonthDiscount * firstMonthDays;

                const secondMonthDays =
                  moment(duusah).diff(duusahMonthStart, "days") + 1;
                const secondMonthTotalDays = moment(duusah).daysInMonth();
                const secondMonthDailyRate =
                  khymdraaguiDun / secondMonthTotalDays;
                const secondMonthDiscount =
                  (secondMonthDailyRate * ugugdul.khungulultKhuvi) / 100;
                const secondMonthTotal = secondMonthDiscount * secondMonthDays;

                var khymdarsanDun = firstMonthTotal + secondMonthTotal;
              }
            } else {
              var negOdriinTolokh = khymdraaguiDun / 30;

              var khymdarsanDun =
                ((negOdriinTolokh * ugugdul.khungulultKhuvi) / 100) *
                ugugdul.khungulultKhonog;
            }
          } else if (khungulukh === "khuvi") {
            var khymdarsanDun =
              khymdraaguiDun * (parseFloat(tootsoolol?.khungulukhKhuvi) / 100);
          } else {
            var khymdarsanDun = parseFloat(tootsoolol?.khunglugdsunDun);
          }
        }

        return {
          gereeniiId: x._id,
          gereeniiDugaar: x.gereeniiDugaar,
          ner: x.ner,
          khymdarsanDun,
        };
      });

      if (
        khungulukh === "khuvi" &&
        baiguullaga.tokhirgoo.deedKhungulultiinKhuvi < ugugdul.khungulukhKhuvi
      ) {
        setWaiting(false);
        notification.warning({
          message: "Тохируулсан хөнгөлөх хувиас хэтэрсэн байна!",
        });
        return;
      }

      createMethod("khungulultKhadgalya", token, ugugdul)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            setWaiting(false);
            toast.success("Хөнгөлөлт амжилттай хийгдлээ");
            formRef.current.resetFields();
            setTootsoolol({});
            setOgnoonuud([]);
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
          setWaiting(false);
        });
    } else {
      setWaiting(false);
      toast.warning("Хөнгөлөх талбай сонгоно уу");
    }
  }

  const gereeniiColumn = useMemo(() => {
    let column = [
      {
        title: t("Түрээслэгч"),
        dataIndex: "ner",
        className: "text-center",
        align: "center",
        width: "5rem",
        showSorterTooltip: false,
        sorter: (a, b) => a.ner?.localeCompare(b.ner),
      },
      {
        title: t("Гэрээ"),
        dataIndex: "gereeniiDugaar",
        className: "text-center",
        align: "center",
        width: "7rem",
        showSorterTooltip: false,
        sorter: (a, b) => a.gereeniiDugaar?.localeCompare(b.gereeniiDugaar),
      },
      {
        title: t("Талбай"),
        dataIndex: "talbainDugaar",
        className: "text-center",
        align: "center",
        width: "7rem",
        showSorterTooltip: false,
        sorter: (a, b) => a.talbainDugaar?.localeCompare(b.talbainDugaar),
      },
      {
        title: t("Давхар"),
        dataIndex: "davkhar",
        align: "center",
        width: "5rem",
        className: "text-center",
        showSorterTooltip: false,
        sorter: (a, b) => Number(a.davkhar || 0) - Number(b.davkhar || 0),
      },
      {
        title: t("Талбай /м2/"),
        dataIndex: "talbainKhemjee",
        align: "center",
        width: "7rem",
        className: "text-center",
        render: (talbainKhemjee) => {
          return `${talbainKhemjee} м2`;
        },
        showSorterTooltip: false,

        sorter: (a, b) =>
          Number(a.talbainKhemjee || 0) - Number(b.talbainKhemjee || 0),
      },
      {
        title: t("Төлбөр"),
        dataIndex: "sariinTurees",
        className: "text-center",
        width: "7rem",
        align: "center",
        render: (sariinTurees) => {
          return formatNumber(sariinTurees || 0);
        },
        showSorterTooltip: false,
        sorter: (a, b) =>
          Number(a.sariinTurees || 0) - Number(b.sariinTurees || 0),
      },
    ];

    if (
      !!form.getFieldValue("zardliinId") &&
      form.getFieldValue("khungulukhTurul") === "zardal"
    ) {
      column.push({
        title: zardal?.jagsaalt?.find(
          (e) => e?._id === form.getFieldValue("zardliinId")
        )?.ner,
        dataIndex: "data",
        className: "data",
        width: "7rem",
        align: "center",
        render: (e, data) => {
          var zardliinData = data?.zardluud?.find(
            (e) => e?._id === form.getFieldValue("zardliinId")
          );

          const selectedZardal = zardal?.jagsaalt?.find(
            (e) => e?._id === form.getFieldValue("zardliinId")
          );

          const isUtilityExpense =
            selectedZardal?.ner === "Халуун ус" ||
            selectedZardal?.ner === "Хүйтэн ус" ||
            selectedZardal?.ner === "Цахилгаан";

          if (isUtilityExpense) {
            if (zardliinData && (zardliinData.tulukhDun || 0) !== 0) {
              return formatNumber(zardliinData?.tulukhDun || 0, 2);
            }

            const avlagaData = data?.avlaga?.guilgeenuud?.find(
              (guilgee) =>
                guilgee.tailbar === selectedZardal?.ner &&
                (guilgee.tulukhDun || 0) !== 0
            );

            if (avlagaData) {
              return formatNumber(avlagaData.tulukhDun || 0, 2);
            }
          }

          if (zardliinData) {
            var urjuulekhData =
              zardliinData?.turul === "1м3/талбай"
                ? data.talbainKhemjeeMetrKube || 1
                : zardliinData?.turul === "1м2"
                ? data?.talbainKhemjee
                : zardliinData?.turul === "Тогтмол" && 1;

            var kharuulakhData = formatNumber(
              zardliinData?.tariff * urjuulekhData,
              2
            );

            return zardliinData?.turul === "Дурын"
              ? zardliinData?.dun || 0
              : kharuulakhData || 0;
          } else return 0;
        },
      });
    }

    return column;
  }, [form.getFieldValue("zardliinId"), zardal?.jagsaalt]);

  function ustgaya(mur) {
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        {t("Устгах")}
      </Button>,
    ];
    modal({
      title: "Хөнгөлөлт устгах шалтгаан",
      icon: <DeleteOutlined />,
      content: (
        <Tailbar
          ref={tailbarRef}
          confirm={(tailbar) =>
            uilchilgee(token)
              .post("/khungulultUstgaya", {
                id: mur?._id,
                tailbar,
              })
              .then(({ data }) => {
                if (data !== undefined) {
                  khungulultTuukhMutate(
                    (s) => ({ ...s, jagsaalt: s.jagsaalt }),
                    true
                  );
                  toast.success(t("Устгагдлаа"));
                }
              })
          }
        />
      ),
      footer,
    });
  }
  function tseverlekh() {
    formRef.current.resetFields();
    setShuult({ query: { tuluv: { $ne: -1 } } });
    setRowKeys([]);
  }

  const columns = useMemo(() => {
    return [
      {
        title: t("Огноо"),
        dataIndex: "createdAt",
        ellipsis: true,
        align: "center",
        width: "8rem",
        render: (data) => {
          return moment(data).format("YYYY-MM-DD hh:mm:ss");
        },
      },
      {
        title: t("Хөнгөлөлт %"),
        dataIndex: "khungulukhKhuvi",
        ellipsis: true,
        width: "7rem",
        align: "center",
      },
      {
        title: t("Гэрээнүүд"),
        dataIndex: "khamaataiGereenuud",
        ellipsis: true,
        width: "6rem",
        align: "center",
        render: (data) => {
          return (
            <Popover
              content={
                <div>
                  {data?.map((mur, index) => {
                    return (
                      <div>
                        {mur?.gereeniiDugaar}
                        {index < data?.length - 1 && ","}
                      </div>
                    );
                  })}
                </div>
              }
            >
              {data?.length === 1 &&
                data?.map((mur) => {
                  return mur?.gereeniiDugaar;
                })}
              {data?.length > 1 && <EyeOutlined />}
            </Popover>
          );
        },
      },
      {
        title: t("Түрээслэгчид"),
        dataIndex: "khamaataiGereenuud",
        ellipsis: true,
        width: "7rem",
        align: "center",
        render: (data) => {
          return (
            <Popover
              content={
                <div>
                  {data?.map((mur, index) => {
                    return (
                      <div>
                        {mur?.ner}
                        {index < data?.length - 1 && ","}
                      </div>
                    );
                  })}
                </div>
              }
            >
              {data?.length === 1 &&
                data?.map((mur) => {
                  return mur?.ner;
                })}
              {data?.length > 1 && <EyeOutlined />}
            </Popover>
          );
        },
      },
      {
        title: t("Эхлэх хугацаа"),
        width: "7rem",
        dataIndex: "ognoonuud",
        ellipsis: true,
        align: "center",
        render: (data) => {
          return moment(data && data[0]).format("YYYY-MM-DD");
        },
      },
      {
        title: t("Дуусах хугацаа"),
        width: "7rem",
        dataIndex: "ognoonuud",
        ellipsis: true,
        align: "center",
        render: (data) => {
          return moment(data && data[data?.length - 1]).format("YYYY-MM-DD");
        },
      },
      {
        title: t("Хоног"),
        width: "4rem",
        dataIndex: "khungulultKhonog",
        ellipsis: true,
        align: "center",
        render: (data) => {
          return data;
        },
      },
      {
        title: t("Төрөл"),
        dataIndex: "khungulukhTurul",
        ellipsis: true,
        width: "5rem",
        align: "center",
        render: (data) => {
          switch (data) {
            case "turees":
              return (
                <div className="flex items-center justify-center rounded-lg bg-green-400 px-2 py-1 dark:bg-green-700 dark:text-gray-200 ">
                  Түрээс
                </div>
              );
            case "zardal":
              return (
                <div className="flex items-center justify-center rounded-lg bg-yellow-400 px-2 py-1 dark:bg-yellow-700 dark:text-gray-200 ">
                  Зардал
                </div>
              );
            default:
              return data;
          }
        },
      },
      {
        title: t("Төлөх дүн"),
        summary: true,
        width: "7rem",
        dataIndex: "tulukhDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: t("Хөнгөлөх дүн"),
        summary: true,
        width: "7rem",
        dataIndex: "khungulultiinDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: t("Төлсөн дүн"),
        width: "7rem",
        summary: true,
        dataIndex: "khungulsunDun",
        align: "right",
        render: (data) => {
          return formatNumber(data) + "₮";
        },
      },
      {
        title: t("Төрөл"),
        width: "5rem",
        dataIndex: "turul",
        ellipsis: true,
        align: "center",
      },
      {
        title: t("Шалтгаан"),
        width: "13rem",
        dataIndex: "shaltgaan",
        ellipsis: true,
        align: "center",
      },
      {
        title: t("Ажилтан"),
        width: "6rem",
        dataIndex: "guilgeeKhiisenAjiltniiNer",
        align: "center",
        showSorterTooltip: false,
        sorter: true,
      },
      {
        title: () => <SettingOutlined />,
        width: "40px",
        align: "center",
        render(data) {
          return (
            <Popconfirm
              title={t("Хөнгөлөлт устгах уу?")}
              okText={t("Тийм")}
              cancelText={t("Үгүй")}
              onConfirm={() => ustgaya(data)}
            >
              <Button
                danger
                size="small"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          );
        },
      },
    ];
  });

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "control-ref_davkhar":
          formRef.current.getFieldInstance("khungulukhKhuvi").focus();
          break;
        case "control-ref_khungulukhDun":
          formRef.current.getFieldInstance("shaltgaan").focus();
          break;
        case "control-ref_shaltgaan":
          document.getElementById("khungulultKhadgalya").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  function onSelectChange(selectedRowKeys, selectedRows) {
    setRowKeys(selectedRowKeys);
    setSongogdsonGereenuud(selectedRows);
  }

  function khungulukhDunTootsoolyo() {
    let dun = form?.getFieldValue("khungulukhKhuvi");
    if (turul === "turees")
      tootsoolol.niitSariinTurees = songogdsonGereenuud?.reduce(
        (a, b) => a + Number(b?.sariinTurees || 0),
        0
      );
    else {
      tootsoolol.niitSariinTurees = 0;
      const fVal = form.getFieldValue("zardliinId");
      songogdsonGereenuud?.map((e) => {
        const gereeZardal = e?.zardluud.find((a) => a._id === fVal);
        const selectedZardal = zardal.jagsaalt?.find((z) => z._id === fVal);
        setSongogdsonZardal(gereeZardal || selectedZardal);

        const isUtilityExpense =
          gereeZardal?.ner === "Халуун ус" ||
          gereeZardal?.ner === "Хүйтэн ус" ||
          gereeZardal?.ner === "Цахилгаан" ||
          selectedZardal?.ner === "Халуун ус" ||
          selectedZardal?.ner === "Хүйтэн ус" ||
          selectedZardal?.ner === "Цахилгаан";

        if (isUtilityExpense) {
          if (gereeZardal && (gereeZardal.tulukhDun || 0) !== 0) {
            tootsoolol.niitSariinTurees =
              tootsoolol.niitSariinTurees + (gereeZardal.tulukhDun || 0);
          } else {
            const avlagaData = e?.avlaga?.guilgeenuud?.find(
              (guilgee) =>
                guilgee.tailbar === (gereeZardal?.ner || selectedZardal?.ner) &&
                (guilgee.tulukhDun || 0) !== 0
            );
            if (avlagaData) {
              tootsoolol.niitSariinTurees =
                tootsoolol.niitSariinTurees + (avlagaData.tulukhDun || 0);
            }
          }
        } else if (!!gereeZardal) {
          if (gereeZardal.turul === "1м2")
            tootsoolol.niitSariinTurees =
              tootsoolol.niitSariinTurees +
              e.talbainKhemjee * gereeZardal.tariff;
          else if (gereeZardal.turul === "1м3/талбай")
            tootsoolol.niitSariinTurees =
              tootsoolol.niitSariinTurees +
              e.talbainKhemjeeMetrKube * gereeZardal.tariff;
          else if (gereeZardal.turul === "Дурын")
            tootsoolol.niitSariinTurees =
              tootsoolol.niitSariinTurees + gereeZardal.dun;
          else
            tootsoolol.niitSariinTurees =
              gereeZardal.tariff + tootsoolol.niitSariinTurees;
        }
      });
    }
    if (khungulukh === "khuvi" && dun > 100) {
      form.setFieldsValue({ khungulukhKhuvi: 100 });
      dun = 100;
    }
    tootsoolol.niitTalbai = songogdsonGereenuud?.length;

    let totalKhunglugdsunDun = 0;

    if (
      khonogTootsokhEsekh &&
      baiguullaga?.tokhirgoo?.khonogKhungulultOruulakhEsekh
    ) {
      var khungulultKhuvi = form.getFieldValue("khungulultKhuvi");

      songogdsonGereenuud?.forEach((geree) => {
        let gereeKhunglugdsunDun = 0;
        let khymdraaguiDun = 0;

        if (turul === "turees") {
          khymdraaguiDun = geree.sariinTurees;
        } else {
          const zardal = geree?.zardluud?.find(
            (a) => a._id === form.getFieldValue("zardliinId")
          );

          const selectedZardal = zardal.jagsaalt?.find(
            (z) => z._id === form.getFieldValue("zardliinId")
          );

          const isUtilityExpense =
            zardal?.ner === "Халуун ус" ||
            zardal?.ner === "Хүйтэн ус" ||
            zardal?.ner === "Цахилгаан" ||
            selectedZardal?.ner === "Халуун ус" ||
            selectedZardal?.ner === "Хүйтэн ус" ||
            selectedZardal?.ner === "Цахилгаан";

          if (isUtilityExpense) {
            if (zardal && (zardal.tulukhDun || 0) !== 0) {
              khymdraaguiDun = zardal.tulukhDun || 0;
            } else {
              const avlagaData = geree?.avlaga?.guilgeenuud?.find(
                (guilgee) =>
                  guilgee.tailbar === (zardal?.ner || selectedZardal?.ner) &&
                  (guilgee.tulukhDun || 0) !== 0
              );
              khymdraaguiDun = avlagaData?.tulukhDun || 0;
            }
          } else if (zardal) {
            if (zardal.turul === "1м2")
              khymdraaguiDun = geree.talbainKhemjee * zardal.tariff;
            else if (zardal.turul === "1м3/талбай")
              khymdraaguiDun = geree.talbainKhemjeeMetrKube * zardal.tariff;
            else if (zardal.turul === "Дурын") khymdraaguiDun = zardal.dun;
            else khymdraaguiDun = zardal.tariff;
          }
        }

        if (
          !geree.guchKhonogOruulakhEsekh &&
          khungulultKhuvi &&
          khungulultKhuvi > 0
        ) {
          const ehlel = ognoonuud?.[0];
          const duusah = ognoonuud?.[1];

          if (ehlel && duusah) {
            const ehlelMonth = moment(ehlel).format("YYYY-MM");
            const duusahMonth = moment(duusah).format("YYYY-MM");
            const isSameMonth = ehlelMonth === duusahMonth;

            if (isSameMonth) {
              const totalDaysInMonth = moment(ehlel).daysInMonth();
              const actualDays = moment(duusah).diff(moment(ehlel), "days") + 1;
              const dailyRate = khymdraaguiDun / totalDaysInMonth;
              const dailyDiscount = (dailyRate * khungulultKhuvi) / 100;
              gereeKhunglugdsunDun = dailyDiscount * actualDays;
            } else {
              const ehlelMonthEnd = moment(ehlel).endOf("month");
              const duusahMonthStart = moment(duusah).startOf("month");

              const firstMonthDays =
                moment(ehlelMonthEnd).diff(moment(ehlel), "days") + 1;
              const firstMonthTotalDays = moment(ehlel).daysInMonth();
              const firstMonthDailyRate = khymdraaguiDun / firstMonthTotalDays;
              const firstMonthDiscount =
                (firstMonthDailyRate * khungulultKhuvi) / 100;
              const firstMonthTotal = firstMonthDiscount * firstMonthDays;

              const secondMonthDays =
                moment(duusah).diff(duusahMonthStart, "days") + 1;
              const secondMonthTotalDays = moment(duusah).daysInMonth();
              const secondMonthDailyRate =
                khymdraaguiDun / secondMonthTotalDays;
              const secondMonthDiscount =
                (secondMonthDailyRate * khungulultKhuvi) / 100;
              const secondMonthTotal = secondMonthDiscount * secondMonthDays;

              gereeKhunglugdsunDun = firstMonthTotal + secondMonthTotal;
            }
          } else {
            gereeKhunglugdsunDun =
              khungulukh === "khuvi"
                ? (Number(khymdraaguiDun) * dun) / 100
                : dun;
          }
        } else if (khungulultKhuvi && khungulultKhuvi > 0) {
          var negOdriinTolokh = khymdraaguiDun / 30;
          gereeKhunglugdsunDun =
            ((negOdriinTolokh * khungulultKhuvi) / 100) *
            form.getFieldValue("khungulultKhonog");
        } else {
          gereeKhunglugdsunDun =
            (form.getFieldValue("khungulultKhonog") * khymdraaguiDun) /
            (parseFloat(moment(ognoonuud[0]).endOf("month").format("DD")) || 1);
        }

        totalKhunglugdsunDun += gereeKhunglugdsunDun;
      });
    } else {
      if (turul === "zardal") {
        songogdsonGereenuud?.forEach((geree) => {
          let gereeKhunglugdsunDun = 0;
          let khymdraaguiDun = 0;

          const zardal = geree?.zardluud?.find(
            (a) => a._id === form.getFieldValue("zardliinId")
          );

          const selectedZardal = zardal.jagsaalt?.find(
            (z) => z._id === form.getFieldValue("zardliinId")
          );

          const isUtilityExpense =
            zardal?.ner === "Халуун ус" ||
            zardal?.ner === "Хүйтэн ус" ||
            zardal?.ner === "Цахилгаан" ||
            selectedZardal?.ner === "Халуун ус" ||
            selectedZardal?.ner === "Хүйтэн ус" ||
            selectedZardal?.ner === "Цахилгаан";

          if (isUtilityExpense) {
            if (zardal && (zardal.tulukhDun || 0) !== 0) {
              khymdraaguiDun = zardal.tulukhDun || 0;
            } else {
              const avlagaData = geree?.avlaga?.guilgeenuud?.find(
                (guilgee) =>
                  guilgee.tailbar === (zardal?.ner || selectedZardal?.ner) &&
                  (guilgee.tulukhDun || 0) !== 0
              );
              khymdraaguiDun = avlagaData?.tulukhDun || 0;
            }
          } else if (zardal) {
            if (zardal.turul === "1м2")
              khymdraaguiDun = geree.talbainKhemjee * zardal.tariff;
            else if (zardal.turul === "1м3/талбай")
              khymdraaguiDun = geree.talbainKhemjeeMetrKube * zardal.tariff;
            else if (zardal.turul === "Дурын") khymdraaguiDun = zardal.dun;
            else khymdraaguiDun = zardal.tariff;
          }

          if (!geree.guchKhonogOruulakhEsekh && dun && dun > 0) {
            const ehlel = ognoonuud?.[0];
            const duusah = ognoonuud?.[1];

            if (ehlel && duusah) {
              const ehlelMonth = moment(ehlel).format("YYYY-MM");
              const duusahMonth = moment(duusah).format("YYYY-MM");
              const isSameMonth = ehlelMonth === duusahMonth;

              if (isSameMonth) {
                const totalDaysInMonth = moment(ehlel).daysInMonth();
                const actualDays =
                  moment(duusah).diff(moment(ehlel), "days") + 1;
                const dailyRate = khymdraaguiDun / totalDaysInMonth;
                const dailyDiscount = (dailyRate * dun) / 100;
                gereeKhunglugdsunDun = dailyDiscount * actualDays;
              } else {
                const ehlelMonthEnd = moment(ehlel).endOf("month");
                const duusahMonthStart = moment(duusah).startOf("month");

                const firstMonthDays =
                  moment(ehlelMonthEnd).diff(moment(ehlel), "days") + 1;
                const firstMonthTotalDays = moment(ehlel).daysInMonth();
                const firstMonthDailyRate =
                  khymdraaguiDun / firstMonthTotalDays;
                const firstMonthDiscount = (firstMonthDailyRate * dun) / 100;
                const firstMonthTotal = firstMonthDiscount * firstMonthDays;

                const secondMonthDays =
                  moment(duusah).diff(duusahMonthStart, "days") + 1;
                const secondMonthTotalDays = moment(duusah).daysInMonth();
                const secondMonthDailyRate =
                  khymdraaguiDun / secondMonthTotalDays;
                const secondMonthDiscount = (secondMonthDailyRate * dun) / 100;
                const secondMonthTotal = secondMonthDiscount * secondMonthDays;

                gereeKhunglugdsunDun = firstMonthTotal + secondMonthTotal;
              }
            } else {
              gereeKhunglugdsunDun =
                khungulukh === "khuvi"
                  ? (Number(khymdraaguiDun) * dun) / 100
                  : dun;
            }
          } else {
            gereeKhunglugdsunDun =
              khungulukh === "khuvi"
                ? (Number(khymdraaguiDun) * dun) / 100
                : dun;
          }

          totalKhunglugdsunDun += gereeKhunglugdsunDun;
        });
      } else {
        songogdsonGereenuud?.forEach((geree) => {
          let gereeKhunglugdsunDun = 0;
          let khymdraaguiDun = 0;

          if (turul === "turees") {
            khymdraaguiDun = geree.sariinTurees;
          } else {
            const zardal = geree?.zardluud?.find(
              (a) => a._id === form.getFieldValue("zardliinId")
            );
            if (zardal) {
              if (zardal.turul === "1м2")
                khymdraaguiDun = geree.talbainKhemjee * zardal.tariff;
              else if (zardal.turul === "1м3/талбай")
                khymdraaguiDun = geree.talbainKhemjeeMetrKube * zardal.tariff;
              else if (zardal.turul === "Дурын") khymdraaguiDun = zardal.dun;
              else khymdraaguiDun = zardal.tariff;
            }
          }

          gereeKhunglugdsunDun =
            khungulukh === "khuvi" ? (Number(khymdraaguiDun) * dun) / 100 : dun;

          totalKhunglugdsunDun += gereeKhunglugdsunDun;
        });
      }
    }

    tootsoolol.khunglugdsunDun = totalKhunglugdsunDun;
    tootsoolol.niitTulukhDun =
      Number(tootsoolol.niitSariinTurees) - Number(tootsoolol.khunglugdsunDun);

    if (khungulukh === "khuvi") {
      tootsoolol.khungulukhKhuvi = form.getFieldValue("khungulukhKhuvi");
    }

    setTootsoolol({ ...tootsoolol });
  }

  return (
    <Admin
      title="Хөнгөлөлт"
      khuudasniiNer="khungulult"
      className="p-0 px-3 pb-12 md:p-4 md:px-4 md:pb-0"
      onSearch={(search) => {
        setKhuudaslalt((a) => ({ ...a, search, khuudasniiDugaar: 1 }));
        setGereeniiKhuudaslalt((a) => ({
          ...a,
          search,
          khuudasniiDugaar: 1,
        }));
      }}
      loading={waiting || isValidating || isValidating2}
      tsonkhniiId="61c2c6eb1c2830c4e6f90cc5"
    >
      <div className="col-span-12">
        <Tabs size="large" onChange={(v) => setSongogdsonNuur(v)}>
          <Tabs.TabPane tab={t("Хөнгөлөлт оруулах")} key="1">
            <div className="grid w-full grid-cols-12 gap-6">
              <div
                className="col-span-12 rounded-md border border-solid border-green-300 bg-white p-5 dark:bg-gray-900 md:col-span-8 xl:col-span-3"
                data-aos="fade-right"
                data-aos-duration="1000"
              >
                <Form
                  onFinish={khungulultKhadgalya}
                  form={form}
                  autoComplete={"off"}
                  ref={formRef}
                  name="control-ref"
                  initialValues={{ remember: true }}
                  labelCol={{
                    span: 12,
                  }}
                  wrapperCol={{
                    span: 30,
                  }}
                  layout="horizontal"
                >
                  <Form.Item
                    name="khungulukhTurul"
                    label={t("Төрөл")}
                    labelAlign="left"
                  >
                    <Select
                      className="ml-1 mr-3 flex-1"
                      defaultValue="turees"
                      onChange={(e) => {
                        setTurul(e);
                        if (e === "turees") {
                          setShuult({
                            query: !!shuult?.query?.davkhar
                              ? {
                                  davkhar: shuult.query.davkhar,
                                  tuluv: shuult.query.tuluv,
                                }
                              : { tuluv: shuult.query.tuluv },
                          });
                          form.setFieldsValue({ zardliinId: undefined });
                        }
                        setRowKeys([]);
                        setTootsoolol({
                          niitTalbai: 0,
                          niitSariinTurees: 0,
                          khunglugdsunDun: 0,
                          niitTulukhDun: 0,
                        });
                      }}
                    >
                      <Select.Option value={"turees"}>Түрээс</Select.Option>
                      <Select.Option value={"zardal"}>Зардал</Select.Option>
                    </Select>
                  </Form.Item>
                  {turul === "zardal" &&
                    zardal &&
                    zardal?.jagsaalt.length > 0 && (
                      <Form.Item
                        labelAlign="left"
                        name="zardliinId"
                        label={t("Зардал сонгох")}
                        rules={[
                          {
                            required: true,
                            message: t("Зардал сонгоно уу!"),
                          },
                        ]}
                      >
                        <Select
                          className="ml-1 mr-3 flex-1"
                          onChange={(e) => {
                            setShuult({
                              query: !!shuult?.query?.davkhar
                                ? {
                                    davkhar: shuult.query.davkhar,
                                    tuluv: shuult.query.tuluv,
                                    "zardluud._id": e,
                                  }
                                : {
                                    tuluv: shuult.query.tuluv,
                                    "zardluud._id": e,
                                  },
                            });
                          }}
                        >
                          {zardal?.jagsaalt?.map((z) => (
                            <Select.Option value={z._id}>{z.ner}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}

                  {baiguullaga?.tokhirgoo?.khonogKhungulultOruulakhEsekh ? (
                    <Form.Item
                      name="khonogTootsokhEsekh"
                      label={t("Хоногийн хөнгөлөлт эсэх")}
                      labelAlign="left"
                    >
                      <Switch
                        checked={khonogTootsokhEsekh}
                        onChange={(v) => {
                          if (v) {
                            form.setFieldValue("khungulultKhuvi", undefined);
                            form.setFieldValue("khungulultKhonog", undefined);
                          } else {
                            form.setFieldValue("khungulultKhuvi", 0);
                            form.setFieldValue("khungulultKhonog", 0);
                          }
                          setKhonogTootsokhEsekh(v);
                          khungulukhDunTootsoolyo();
                        }}
                      />
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  {!isSelectedUtilityExpense && khonogTootsokhEsekh ? (
                    <Form.Item
                      labelAlign="left"
                      name="ognoonuud"
                      label={t("Хөнгөлөх өдөр")}
                      rules={[
                        {
                          required: true,
                          message: t("Хөнгөлөх өдөр бүртгэнэ үү!"),
                        },
                      ]}
                    >
                      <DatePicker.RangePicker
                        style={{ width: "100%" }}
                        disabledDate={disabledDate}
                        placeholder={[t("Эхлэх өдөр"), t("Дуусах өдөр")]}
                        onChange={(v) => {
                          setOgnoonuud(v);
                          form.setFieldValue(
                            "khungulultKhonog",
                            moment(v[1]).diff(v[0], "d") + 1
                          );
                          khungulukhDunTootsoolyo();
                        }}
                      />
                    </Form.Item>
                  ) : !isSelectedUtilityExpense ? (
                    <Form.Item
                      labelAlign="left"
                      name="ognoonuud"
                      label={t("Хөнгөлөх сар")}
                      rules={[
                        {
                          required: true,
                          message: t("Хөнгөлөх сар бүртгэнэ үү!"),
                        },
                      ]}
                    >
                      <DatePicker.RangePicker
                        allowClear={false}
                        style={{ width: "100%" }}
                        disabledDate={disabledDate}
                        picker="month"
                        placeholder={[t("Эхлэх сар"), t("Дуусах сар")]}
                        onChange={(v) => {
                          setOgnoonuud(v);
                        }}
                      />
                    </Form.Item>
                  ) : null}
                  {khonogTootsokhEsekh ? (
                    <Form.Item
                      label={t("Хөнгөлөх хоног")}
                      name="khungulultKhonog"
                      labelAlign="left"
                    >
                      <Input
                        type={"number"}
                        placeholder={t("Хөнгөлөх хоног")}
                      />
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  {khonogTootsokhEsekh ? (
                    <Form.Item
                      label={"Хөнгөлөх хувь"}
                      name="khungulultKhuvi"
                      labelAlign="left"
                      rules={[
                        {
                          required: true,
                          message: t("Хөнгөлөх хувь бүртгэнэ үү!"),
                        },
                        {
                          validator: (_, value) => {
                            if (
                              value === undefined ||
                              value === null ||
                              value === ""
                            ) {
                              return Promise.reject(
                                new Error(t("Хөнгөлөх хувь оруулна уу!"))
                              );
                            }
                            if (Number(value) <= 0) {
                              return Promise.reject(
                                new Error(
                                  t("Хөнгөлөх хувь 0-ээс их байх ёстой!")
                                )
                              );
                            }
                            if (Number(value) > 100) {
                              return Promise.reject(
                                new Error(
                                  t("Хөнгөлөх хувь 100-аас бага байх ёстой!")
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        placeholder="Хөнгөлөх хувь"
                        onChange={khungulukhDunTootsoolyo}
                      />
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  <Form.Item name="turul" label={t("Нөхцөл")} labelAlign="left">
                    <Select
                      placeholder={t("Нөхцөл")}
                      onChange={(v) => {
                        nukhtulSongokh(v);
                        formRef.current.getFieldInstance("davkhar").focus();
                      }}
                    >
                      <Option value="Давхраар">{t("Давхраар")}</Option>
                      <Option value="Бүгд">{t("Бүгд")}</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="davkhar"
                    label={t("Давхар")}
                    labelAlign="left"
                  >
                    <Select
                      mode="multiple"
                      placeholder={t("Давхар")}
                      onChange={handleChange}
                      disabled={
                        form?.getFieldValue("turul") === "Бүгд" ? true : false
                      }
                    >
                      {baiguullaga?.barilguud
                        ?.find((b) => b._id === barilgiinId)
                        ?.davkharuud.map((a) => (
                          <Select.Option key={a.davkhar} value={a.davkhar}>
                            {a.davkhar}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                  {!khonogTootsokhEsekh ? (
                    <Form.Item label={t("Хөнгөлөх төрөл")} labelAlign="left">
                      <Select
                        placeholder="Хөнгөлөх төрөл"
                        className="w-32"
                        value={khungulukh}
                        onChange={(v) => {
                          setKhungulukh(v);
                          form.setFieldsValue({ khungulukhKhuvi: null });
                          if (v === "khuvi") {
                            setTootsoolol((prev) => ({
                              ...prev,
                              khungulukhKhuvi: 0,
                            }));
                          }
                        }}
                      >
                        <Select.Option key={"khuvi"}>Хувь</Select.Option>
                        <Select.Option key={"mungunDun"}>
                          Мөнгөн дүн
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  {!khonogTootsokhEsekh ? (
                    <Form.Item
                      label={
                        khungulukh === "khuvi"
                          ? "Хөнгөлөх хувь"
                          : "Хөнгөлөх дүн"
                      }
                      name="khungulukhKhuvi"
                      labelAlign="left"
                    >
                      <Input
                        onKeyDown={focuser}
                        type={"number"}
                        placeholder={
                          khungulukh === "khuvi"
                            ? "Хөнгөлөх хувь"
                            : "Хөнгөлөх дүн"
                        }
                        onChange={khungulukhDunTootsoolyo}
                      />
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  <Form.Item
                    label={t("Шалтгаан")}
                    name="shaltgaan"
                    labelAlign="left"
                  >
                    <Input.TextArea
                      onKeyDown={focuser}
                      placeholder={t("Шалтгаан")}
                    />
                  </Form.Item>
                  <div className="flex-column mt-12 grid text-base dark:text-gray-50">
                    <div className="flex justify-between">
                      {t("Нийт талбайн тоо")} :<a>{tootsoolol.niitTalbai}</a>
                    </div>
                    <div className="flex justify-between">
                      {turul === "turees"
                        ? t("Нийт түрээсийн орлого")
                        : "Нийт зардлын дүн"}{" "}
                      :<a>{formatNumber(tootsoolol.niitSariinTurees || 0)}</a>
                    </div>
                    <div className="flex justify-between">
                      {t("Нийт хөнгөлөгдсөн дүн")} :
                      <a className="text-red-400">
                        {formatNumber(tootsoolol.khunglugdsunDun || 0)}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      {t("Нийт төлөх дүн")} :
                      <a className="text-green-500">
                        {formatNumber(tootsoolol.niitTulukhDun || 0)}
                      </a>
                    </div>
                  </div>
                  <div className="mt-10 flex flex-row justify-between">
                    <Form.Item>
                      <Button
                        htmlType="submit"
                        onClick={tseverlekh}
                        className="border-red-400 dark:border-red-400 dark:bg-gray-900 "
                      >
                        <span className="text-red-400 dark:text-red-400">
                          {t("Цэвэрлэх")}
                        </span>
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        id="khungulultKhadgalya"
                        onClick={() => form.submit()}
                        type="primary"
                      >
                        <span className="text-white">{t("Хадгалах")}</span>
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>

              <div
                className="box col-span-12 overflow-auto p-5 md:col-span-3 xl:col-span-9"
                data-aos="fade-right"
                data-aos-duration="1000"
                data-aos-delay="300"
              >
                <Table
                  rowSelection={rowSelection}
                  bordered
                  scroll={{ y: "calc(100vh - 20rem)" }}
                  size="small"
                  loading={!gereeniiMedeelel}
                  rowKey={(row) => row._id}
                  dataSource={filteredGereeniiJagsaalt}
                  columns={gereeniiColumn}
                  pagination={false}
                />
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t("Хөнгөлөлт түүх")} key="2">
            <div className="grid w-full grid-cols-12 gap-6">
              <div className="box col-span-12 p-5 md:col-span-8 xl:col-span-12">
                <div className="mt-5 flex w-full flex-row justify-between">
                  <DatePicker.RangePicker
                    style={{ marginBottom: "20px" }}
                    size="middle"
                    value={ekhlekhOgnoo}
                    onChange={setEkhlekhOgnoo}
                  />
                </div>

                <Table
                  bordered
                  tableLayout={"fixed"}
                  size="small"
                  rowClassName="hover:bg-blue-100"
                  dataSource={khungulultTuukh?.jagsaalt}
                  summary={() => (
                    <Table.Summary fixed>
                      {" "}
                      {!!columns && !!khungulultTuukh && (
                        <Table.Summary.Row>
                          {columns?.map((mur, index) => (
                            <Table.Summary.Cell
                              className={`${
                                mur.summary !== true
                                  ? "border-none"
                                  : "font-bold"
                              }`}
                              index={index}
                              align="right"
                            >
                              {mur.summary
                                ? formatNumber(
                                    khungulultTuukh?.jagsaalt?.reduce(
                                      (a, b) => a + (b[mur.dataIndex] || 0),
                                      0
                                    )
                                  )
                                : ""}
                              {mur.summary && "₮"}
                            </Table.Summary.Cell>
                          ))}
                        </Table.Summary.Row>
                      )}
                    </Table.Summary>
                  )}
                  pagination={{
                    current: khungulultTuukh?.khuudasniiDugaar,
                    pageSize: 100,
                    total: khungulultTuukh?.niitMur,
                    showSizeChanger: true,
                    onChange: (khuudasniiDugaar, khuudasniiKhemjee) =>
                      setKhuudaslalt((kh) => ({
                        ...kh,
                        khuudasniiDugaar,
                        khuudasniiKhemjee,
                      })),
                  }}
                  scroll={{ y: "calc(100vh - 26rem)" }}
                  rowKey={(row) => row._id}
                  className="t-head"
                  columns={columns}
                />
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default tulburTootsoo;
