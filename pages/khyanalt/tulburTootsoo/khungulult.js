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
    [tailbar],
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
  }, []);
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
      100,
      undefined,
      select,
    );
  const {
    khungulultTuukh,
    khungulultTuukhMutate,
    setKhuudaslalt,
    isValidating2,
  } = useKhungulultTuukh(
    songogdsonNuur === "2" && token,
    baiguullaga?._id,
    query,
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
    [barilgiinId],
  );

  const zardal = useJagsaalt(
    "/ashiglaltiinZardluud",
    qZardal,
    undefined,
    undefined,
    undefined,
    token,
  );

  const isSelectedUtilityExpense = useMemo(() => {
    const zardliinId = form.getFieldValue("zardliinId");
    const khungulukhTurul = form.getFieldValue("khungulukhTurul");

    if (khungulukhTurul !== "zardal" || !zardliinId) {
      return false;
    }

    const selectedZardal = zardal?.jagsaalt?.find((z) => z._id === zardliinId);
    return (
      selectedZardal?.ner?.trim() === "Халаалт" ||
      selectedZardal?.ner?.trim() === "Дулаан" ||
      selectedZardal?.ner?.trim() === "Халуун ус" ||
      selectedZardal?.ner?.trim() === "Хүйтэн ус" ||
      selectedZardal?.ner?.trim() === "Цахилгаан" ||
      selectedZardal?.ner?.trim() === "Цахилгаан2"
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

    const zardluudMap = new Map(zardal?.jagsaalt?.map((z) => [z._id, z]));
    const selectedZardal = zardluudMap.get(zardliinId);

    const isUtilityExpense =
      selectedZardal?.ner?.trim() === "Халаалт" ||
      selectedZardal?.ner?.trim() === "Дулаан" ||
      selectedZardal?.ner?.trim() === "Халуун ус" ||
      selectedZardal?.ner?.trim() === "Хүйтэн ус" ||
      selectedZardal?.ner?.trim() === "Цахилгаан" ||
      selectedZardal?.ner?.trim() === "Цахилгаан2";

    if (!isUtilityExpense) {
      return gereeniiMedeelel.jagsaalt;
    }

    return gereeniiMedeelel.jagsaalt.filter((geree) => {
      const zardliinData = geree?.zardluud?.find((z) => z._id === zardliinId);
      if (zardliinData) {
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
        filteredGereeniiJagsaalt,
      );
    }
  }, [shuult, form, filteredGereeniiJagsaalt]);

  useEffect(() => {
    khungulukhDunTootsoolyo();
  }, [songogdsonGereenuud, zardal?.jagsaalt, form?.getFieldValue("khungulukhTurul"),
    ]);

  function disabledDate(current) {
    return ajiltan?.erkh == "Admin" ||
      _.get(ajiltan, `tokhirgoo.umkhunSaraarKhungulultEsekh`)?.find(
        (a) => a === barilgiinId,
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
        (a) => a === barilgiinId,
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
          (e) => e?._id === form.getFieldValue("zardliinId"),
        );

        if (turul === "zardal") {
          ugugdul.tailbar = songogdsonZardal.ner;

          var khymdraaguiDun;
          const isUtilityExpense =
            zardliinData?.ner === "Халаалт" ||
            zardliinData?.ner === "Дулаан" ||
            zardliinData?.ner === "Халуун ус" ||
            zardliinData?.ner === "Хүйтэн ус" ||
            zardliinData?.ner === "Цахилгаан" ||
            songogdsonZardal?.ner === "Халаалт" ||
            songogdsonZardal?.ner === "Дулаан" ||
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
                  (guilgee.tulukhDun || 0) !== 0,
              );
              khymdraaguiDun = avlagaData?.tulukhDun || 0;
            }
          } else if (zardliinData || songogdsonZardal) {
            const actingZardal = zardliinData || songogdsonZardal;
            var urjuulekhData =
              actingZardal?.turul === "1м3/талбай"
                ? x.talbainKhemjeeMetrKube || 1
                : actingZardal?.turul === "1м2" ||
                  actingZardal?.ner?.trim() === "Дулаан"
                ? x?.talbainKhemjee
                : 1;

            khymdraaguiDun =
              actingZardal?.turul === "Дурын"
                ? actingZardal.dun
                : (actingZardal?.tariff || 0) * (urjuulekhData || 1);
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
                const firstMonthDiscount =
                  khungulukh === "khuvi"
                    ? (firstMonthDailyRate * ugugdul.khungulultKhuvi) / 100
                    : ugugdul.khungulultKhuvi / firstMonthTotalDays;
                const firstMonthTotal = firstMonthDiscount * firstMonthDays;

                const secondMonthDays =
                  moment(duusah).diff(duusahMonthStart, "days") + 1;
                const secondMonthTotalDays = moment(duusah).daysInMonth();
                const secondMonthDailyRate =
                  khymdraaguiDun / secondMonthTotalDays;
                const secondMonthDiscount =
                  khungulukh === "khuvi"
                    ? (secondMonthDailyRate * ugugdul.khungulultKhuvi) / 100
                    : ugugdul.khungulultKhuvi / secondMonthTotalDays;
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
            var khymdarsanDun = parseFloat(x.khunglugdsunDun);
          }
        } else {
          ugugdul.tailbar = t("Хөнгөлөлт");
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
                  khungulukh === "khuvi"
                    ? (NegOdriinTolokh * ugugdul.khungulultKhuvi) / 100
                    : ugugdul.khungulultKhuvi / totalDaysInMonth;
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
            var khymdarsanDun = parseFloat(x.khunglugdsunDun);
          }
        }

        var durationMultiplier = 1;
        if (ognoonuud?.[0] && ognoonuud?.[1] && !khonogTootsokhEsekh) {
          const mDiff = moment(ognoonuud[1])
            .startOf("month")
            .diff(moment(ognoonuud[0]).startOf("month"), "months");
          durationMultiplier = mDiff >= 0 ? mDiff + 1 : 1;
        }

        return {
          gereeniiId: x._id,
          gereeniiDugaar: x.gereeniiDugaar,
          ner: x.ner,
          khymdarsanDun: (khungulukh === "khuvi" ? khymdarsanDun : parseFloat(form.getFieldValue("khungulukhKhuvi") || 0)) * durationMultiplier,
        };
      });

      if (
        khungulukh === "khuvi" &&
        baiguullaga.tokhirgoo.deedKhungulultiinKhuvi < ugugdul.khungulukhKhuvi
      ) {
        setWaiting(false);
        notification.warning({
          message: t("Тохируулсан хөнгөлөх хувиас хэтэрсэн байна!"),
        });
        return;
      }

      createMethod("khungulultKhadgalya", token, ugugdul)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            setWaiting(false);
            toast.success(t("Хөнгөлөлт амжилттай хийгдлээ"));
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
      toast.warning(t("Хөнгөлөх талбай сонгоно уу"));
    }
  }

  const gereeniiColumn = useMemo(() => {
    let durationMultiplier = 1;
    const zardliinId = form.getFieldValue("zardliinId");
    const currentOgnoonuud = ognoonuud && ognoonuud.length > 0 ? ognoonuud : form?.getFieldValue("ognoonuud");
    if (currentOgnoonuud && currentOgnoonuud[0] && currentOgnoonuud[1]) {
      const mDiff = moment(currentOgnoonuud[1]).startOf("month").diff(moment(currentOgnoonuud[0]).startOf("month"), "months");
      durationMultiplier = mDiff >= 0 ? mDiff + 1 : 1;
    }

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
          return `${talbainKhemjee} ${t("м2")}`;
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
          return formatNumber((sariinTurees || 0) * durationMultiplier);
        },
        showSorterTooltip: false,
        sorter: (a, b) =>
          Number((a.sariinTurees || 0) * durationMultiplier) - Number((b.sariinTurees || 0) * durationMultiplier),
      },
    ];

    if (
      !!form.getFieldValue("zardliinId") &&
      form.getFieldValue("khungulukhTurul") === "zardal"
    ) {
      column.push({
        title: zardal?.jagsaalt?.find(
          (e) => e?._id === zardliinId,
        )?.ner,
        dataIndex: "data",
        className: "data",
        width: "7rem",
        align: "center",
        render: (e, data) => {
          var zardliinData = data?.zardluud?.find(
            (e) => e?._id === zardliinId
          );

          const selectedZardal = zardal?.jagsaalt?.find(
            (e) => e?._id === zardliinId
          );

          const isUtilityExpense =
            selectedZardal?.ner?.trim() === "Халаалт" ||
            selectedZardal?.ner?.trim() === "Дулаан" ||
            selectedZardal?.ner?.trim() === "Халуун ус" ||
            selectedZardal?.ner?.trim() === "Хүйтэн ус" ||
            selectedZardal?.ner?.trim() === "Цахилгаан" ||
            selectedZardal?.ner?.trim() === "Цахилгаан2";

          if (isUtilityExpense) {
            if (zardliinData && (zardliinData.tulukhDun || 0) !== 0) {
              return formatNumber((zardliinData?.tulukhDun || 0) * durationMultiplier, 2);
            }

            const avlagaData = data?.avlaga?.guilgeenuud?.find(
              (guilgee) =>
                guilgee.tailbar === selectedZardal?.ner &&
                (guilgee.tulukhDun || 0) !== 0,
            );

            if (avlagaData) {
              return formatNumber((avlagaData.tulukhDun || 0) * durationMultiplier, 2);
            }
          }

          if (zardliinData || selectedZardal) {
            const actingZardal = zardliinData || selectedZardal;
            var urjuulekhData =
              actingZardal?.turul === "1м3/талбай"
                ? data.talbainKhemjeeMetrKube || 1
                : actingZardal?.turul === "1м2" ||
                  actingZardal?.ner?.trim() === "Дулаан"
                ? data?.talbainKhemjee
                : 1;

            var rawAmount =
              actingZardal?.turul === "Дурын"
                ? actingZardal?.dun || 0
                : (actingZardal?.tariff || 0) * (urjuulekhData || 1);

            return formatNumber(rawAmount * durationMultiplier, 2);
          } else return 0;
        },
      });
    }

    return column;
  }, [form.getFieldValue("zardliinId"), zardal?.jagsaalt, ognoonuud, form.getFieldValue("khungulukhTurul")]);

  function ustgaya(mur) {
    const footer = [
      <Button onClick={() => tailbarRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button type="primary" onClick={() => tailbarRef.current.khadgalya()}>
        {t("Устгах")}
      </Button>,
    ];
    modal({
      title: t("Хөнгөлөлт устгах шалтгаан"),
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
                    true,
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
                  {t("Түрээс")}
                </div>
              );
            case "zardal":
              return (
                <div className="flex items-center justify-center rounded-lg bg-yellow-400 px-2 py-1 dark:bg-yellow-700 dark:text-gray-200 ">
                  {t("Зардал")}
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
          return formatNumber(data);
        },
      },
      {
        title: t("Хөнгөлөх дүн"),
        summary: true,
        width: "7rem",
        dataIndex: "khungulultiinDun",
        align: "right",
        render: (data) => {
          return formatNumber(data);
        },
      },
      {
        title: t("Төлсөн дүн"),
        width: "7rem",
        summary: true,
        dataIndex: "khungulsunDun",
        align: "right",
        render: (data) => {
          return formatNumber(data);
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
    const rawDiscount = form?.getFieldValue("khungulukhKhuvi");
    let dun = Number(rawDiscount);
    if (isNaN(dun) || dun < 0) dun = 0;

    let durationMultiplier = 1;
    const currentOgnoonuud = ognoonuud && ognoonuud.length > 0 ? ognoonuud : form?.getFieldValue("ognoonuud");
    if (currentOgnoonuud && currentOgnoonuud[0] && currentOgnoonuud[1]) {
      const mDiff = moment(currentOgnoonuud[1]).startOf("month").diff(moment(currentOgnoonuud[0]).startOf("month"), "months");
      durationMultiplier = mDiff >= 0 ? mDiff + 1 : 1;
    }

    let niitSariinTurees = 0;
    let niitTalbai = songogdsonGereenuud?.length || 0;
    const fVal = form.getFieldValue("zardliinId");
    const khungulukhTurul = form.getFieldValue("khungulukhTurul") || "turees";

    if (khungulukhTurul === "turees") {
      niitSariinTurees = songogdsonGereenuud?.reduce(
        (a, b) => a + Number(b?.sariinTurees || 0),
        0,
      );
    } else {
      const selectedZardalMaster = zardal?.jagsaalt?.find((z) => z._id === fVal);
      if (selectedZardalMaster) {
        setSongogdsonZardal(selectedZardalMaster);
      }

      songogdsonGereenuud?.forEach((e) => {
        const gereeZardal = e?.zardluud?.find((a) => a._id === fVal);
        const selectedZardal = gereeZardal || selectedZardalMaster;

        const isUtilityExpense =
          selectedZardal?.ner?.trim() === "Халаалт" ||
          selectedZardal?.ner?.trim() === "Дулаан" ||
          selectedZardal?.ner?.trim() === "Халуун ус" ||
          selectedZardal?.ner?.trim() === "Хүйтэн ус" ||
          selectedZardal?.ner?.trim() === "Цахилгаан" ||
          selectedZardal?.ner?.trim() === "Цахилгаан2";

        if (isUtilityExpense) {
          if (gereeZardal && (gereeZardal.tulukhDun || 0) !== 0) {
            niitSariinTurees += Number(gereeZardal.tulukhDun || 0);
          } else {
            const avlagaData = e?.avlaga?.guilgeenuud?.find(
              (guilgee) =>
                guilgee.tailbar === selectedZardal?.ner &&
                (guilgee.tulukhDun || 0) !== 0,
            );
            if (avlagaData) {
              niitSariinTurees += Number(avlagaData.tulukhDun || 0);
            }
          }
        } else if (selectedZardal) {
          let sDun = 0;
          if (
            selectedZardal.turul === "1м2" ||
            selectedZardal.ner?.trim() === "Дулаан"
          )
            sDun = (e.talbainKhemjee || 0) * (selectedZardal.tariff || 0);
          else if (selectedZardal.turul === "1м3/талбай")
            sDun = (e.talbainKhemjeeMetrKube || 1) * (selectedZardal.tariff || 0);
          else if (selectedZardal.turul === "Дурын")
            sDun = Number(selectedZardal.dun || 0);
          else sDun = Number(selectedZardal.tariff || 0);
          niitSariinTurees += sDun;
        }
      });
    }

    niitSariinTurees = niitSariinTurees * durationMultiplier;

    if (khungulukh === "khuvi" && dun > 100) {
      form.setFieldsValue({ khungulukhKhuvi: 100 });
      dun = 100;
    }

    let totalKhunglugdsunDun = 0;

    if (
      khonogTootsokhEsekh &&
      baiguullaga?.tokhirgoo?.khonogKhungulultOruulakhEsekh
    ) {
      const khungulultKhuvi = form.getFieldValue("khungulultKhuvi");

      songogdsonGereenuud?.forEach((geree) => {
        let gereeKhunglugdsunDun = 0;
        let khymdraaguiDun = 0;

        if (khungulukhTurul === "turees") {
          khymdraaguiDun = geree.sariinTurees;
        } else {
          const gereeZardal = geree?.zardluud?.find((a) => a._id === fVal);
          const selectedZardal =
            gereeZardal || zardal?.jagsaalt?.find((z) => z._id === fVal);

          const isUtilityExpense =
            selectedZardal?.ner?.trim() === "Халаалт" ||
            selectedZardal?.ner?.trim() === "Дулаан" ||
            selectedZardal?.ner?.trim() === "Халуун ус" ||
            selectedZardal?.ner?.trim() === "Хүйтэн ус" ||
            selectedZardal?.ner?.trim() === "Цахилгаан" ||
            selectedZardal?.ner?.trim() === "Цахилгаан2";

          if (isUtilityExpense) {
            if (gereeZardal && (gereeZardal.tulukhDun || 0) !== 0) {
              khymdraaguiDun = gereeZardal.tulukhDun || 0;
            } else {
              const avlagaData = geree?.avlaga?.guilgeenuud?.find(
                (guilgee) =>
                  guilgee.tailbar === selectedZardal?.ner &&
                  (guilgee.tulukhDun || 0) !== 0,
              );
              khymdraaguiDun = avlagaData?.tulukhDun || 0;
            }
          } else if (selectedZardal) {
            if (
              selectedZardal.turul === "1м2" ||
              selectedZardal.ner?.trim() === "Дулаан"
            )
              khymdraaguiDun =
                (geree.talbainKhemjee || 0) * (selectedZardal.tariff || 0);
            else if (selectedZardal.turul === "1м3/талбай")
              khymdraaguiDun =
                (geree.talbainKhemjeeMetrKube || 1) *
                (selectedZardal.tariff || 0);
            else if (selectedZardal.turul === "Дурын")
              khymdraaguiDun = Number(selectedZardal.dun || 0);
            else khymdraaguiDun = Number(selectedZardal.tariff || 0);
          }
        }

        const ehlel = currentOgnoonuud?.[0];
        const duusah = currentOgnoonuud?.[1];

        const hasDailyDiscount = khungulultKhuvi && khungulultKhuvi > 0;

        if (!geree.guchKhonogOruulakhEsekh && hasDailyDiscount) {
          if (ehlel && duusah) {
            const ehlelMonth = moment(ehlel).format("YYYY-MM");
            const duusahMonth = moment(duusah).format("YYYY-MM");
            const isSameMonth = ehlelMonth === duusahMonth;

            if (isSameMonth) {
              const totalDaysInMonth = moment(ehlel).daysInMonth();
              const actualDays = moment(duusah).diff(moment(ehlel), "days") + 1;
              const dailyRate = khymdraaguiDun / totalDaysInMonth;
              const dailyDiscount =
                khungulukh === "khuvi"
                  ? (dailyRate * khungulultKhuvi) / 100
                  : khungulultKhuvi / totalDaysInMonth;
              gereeKhunglugdsunDun = dailyDiscount * actualDays;
            } else {
              const ehlelMonthEnd = moment(ehlel).endOf("month");
              const duusahMonthStart = moment(duusah).startOf("month");

              const firstMonthDays =
                moment(ehlelMonthEnd).diff(moment(ehlel), "days") + 1;
              const firstMonthTotalDays = moment(ehlel).daysInMonth();
              const firstMonthDailyRate = khymdraaguiDun / firstMonthTotalDays;
              const firstMonthDiscount =
                khungulukh === "khuvi"
                  ? (firstMonthDailyRate * khungulultKhuvi) / 100
                  : khungulultKhuvi / firstMonthTotalDays;
              const firstMonthTotal = firstMonthDiscount * firstMonthDays;

              const secondMonthDays =
                moment(duusah).diff(duusahMonthStart, "days") + 1;
              const secondMonthTotalDays = moment(duusah).daysInMonth();
              const secondMonthDailyRate =
                khymdraaguiDun / secondMonthTotalDays;
              const secondMonthDiscount =
                khungulukh === "khuvi"
                  ? (secondMonthDailyRate * khungulultKhuvi) / 100
                  : khungulultKhuvi / secondMonthTotalDays;
              const secondMonthTotal = secondMonthDiscount * secondMonthDays;

              gereeKhunglugdsunDun = firstMonthTotal + secondMonthTotal;
            }
          } else {
            gereeKhunglugdsunDun =
              khungulukh === "khuvi"
                ? (Number(khymdraaguiDun) * dun) / 100
                : dun;
          }
        } else if (hasDailyDiscount) {
          const negOdriinTolokh = khymdraaguiDun / 30;
          const dailyDiscount =
            khungulukh === "khuvi"
              ? (negOdriinTolokh * khungulultKhuvi) / 100
              : khungulultKhuvi / 30;
          gereeKhunglugdsunDun =
            dailyDiscount * (form.getFieldValue("khungulultKhonog") || 0);
        } else {
          gereeKhunglugdsunDun = 0;
        }

        totalKhunglugdsunDun += gereeKhunglugdsunDun;
      });
    } else {
      songogdsonGereenuud?.forEach((geree) => {
        let khymdraaguiDun = 0;

        if (khungulukhTurul === "turees") {
          khymdraaguiDun = geree.sariinTurees;
        } else {
          const gereeZardal = geree?.zardluud?.find((a) => a._id === fVal);
          const selectedZardal =
            gereeZardal || zardal?.jagsaalt?.find((z) => z._id === fVal);

          const isUtilityExpense =
            selectedZardal?.ner?.trim() === "Халаалт" ||
            selectedZardal?.ner?.trim() === "Дулаан" ||
            selectedZardal?.ner?.trim() === "Халуун ус" ||
            selectedZardal?.ner?.trim() === "Хүйтэн ус" ||
            selectedZardal?.ner?.trim() === "Цахилгаан" ||
            selectedZardal?.ner?.trim() === "Цахилгаан2";

          if (isUtilityExpense) {
            if (gereeZardal && (gereeZardal.tulukhDun || 0) !== 0) {
              khymdraaguiDun = gereeZardal.tulukhDun || 0;
            } else {
              const avlagaData = geree?.avlaga?.guilgeenuud?.find(
                (guilgee) =>
                  guilgee.tailbar === selectedZardal?.ner &&
                  (guilgee.tulukhDun || 0) !== 0,
              );
              khymdraaguiDun = avlagaData?.tulukhDun || 0;
            }
          } else if (selectedZardal) {
            if (
              selectedZardal.turul === "1м2" ||
              selectedZardal.ner?.trim() === "Дулаан"
            )
              khymdraaguiDun =
                (geree.talbainKhemjee || 0) * (selectedZardal.tariff || 0);
            else if (selectedZardal.turul === "1м3/талбай")
              khymdraaguiDun =
                (geree.talbainKhemjeeMetrKube || 1) *
                (selectedZardal.tariff || 0);
            else if (selectedZardal.turul === "Дурын")
              khymdraaguiDun = Number(selectedZardal.dun || 0);
            else khymdraaguiDun = Number(selectedZardal.tariff || 0);
          }
        }

        let gereeKhunglugdsunDun =
          khungulukh === "khuvi" ? (Number(khymdraaguiDun) * dun) / 100 : dun;
        gereeKhunglugdsunDun = gereeKhunglugdsunDun * durationMultiplier;
        totalKhunglugdsunDun += gereeKhunglugdsunDun;
      });
    }

    setTootsoolol({
      niitTalbai,
      niitSariinTurees,
      khunglugdsunDun: totalKhunglugdsunDun,
      niitTulukhDun: Number(niitSariinTurees) - Number(totalKhunglugdsunDun),
      khungulukhKhuvi: khungulukh === "khuvi" ? dun : 0,
    });
  }

  return (
    <Admin
      title={t("Хөнгөлөлт")}
      khuudasniiNer="khungulult"
      className="p-0 px-3 pb-12 md:p-4 md:px-4 md:pb-0"
      onSearch={(searchValue) => {
        setKhuudaslalt((a) => ({
          ...a,
          search: searchValue,
          khuudasniiDugaar: 1,
        }));
        setGereeniiKhuudaslalt((a) => ({
          ...a,
          search: searchValue,
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
                  initialValues={{ remember: true, khungulukhTurul: "turees" }}
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
                        form.setFieldsValue({
                          ognoonuud: undefined,
                          zardliinId: undefined,
                          khungulultKhonog: undefined,
                          khungulultKhuvi: undefined,
                        });
                        setOgnoonuud([]);
                        setRowKeys([]);
                        setSongogdsonGereenuud([]);
                        setTootsoolol({
                          niitTalbai: 0,
                          niitSariinTurees: 0,
                          khunglugdsunDun: 0,
                          niitTulukhDun: 0,
                          khungulukhKhuvi: 0,
                        });
                        if (e === "turees") {
                          setShuult({
                            query: !!shuult?.query?.davkhar
                              ? {
                                  davkhar: shuult.query.davkhar,
                                  tuluv: shuult.query.tuluv,
                                }
                              : { tuluv: shuult.query.tuluv },
                          });
                        }
                        setTimeout(() => {
                          khungulukhDunTootsoolyo();
                        }, 100);
                      }}
                    >
                      <Select.Option value={"turees"}>{t("Түрээс")}</Select.Option>
                      <Select.Option value={"zardal"}>{t("Зардал")}</Select.Option>
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
                            form.setFieldsValue({
                              ognoonuud: undefined,
                              khungulultKhonog: undefined,
                            });
                            setOgnoonuud([]);
                            setRowKeys([]);
                            setSongogdsonGereenuud([]);
                            setTootsoolol({
                              niitTalbai: 0,
                              niitSariinTurees: 0,
                              khunglugdsunDun: 0,
                              niitTulukhDun: 0,
                              khungulukhKhuvi: 0,
                            });
                            setTimeout(() => {
                              khungulukhDunTootsoolyo();
                            }, 100);
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
                          form.setFieldValue("ognoonuud", undefined);
                          setOgnoonuud([]);
                          setRowKeys([]);
                          setSongogdsonGereenuud([]);
                          setTootsoolol({
                            niitTalbai: 0,
                            niitSariinTurees: 0,
                            khunglugdsunDun: 0,
                            niitTulukhDun: 0,
                            khungulukhKhuvi: 0,
                          });
                          setKhonogTootsokhEsekh(v);
                          khungulukhDunTootsoolyo();
                        }}
                      />
                    </Form.Item>
                  ) : (
                    ""
                  )}
                  {khonogTootsokhEsekh ? (
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
                          if (v && v[0] && v[1]) {
                            const monthDiff = moment(v[1]).diff(
                              moment(v[0]),
                              "months",
                              true,
                            );
                            if (monthDiff > 1) {
                              notification.warning({
                                message: t(
                                  "Зөвхөн 1 сарыг хамарсан хөнгөлөлт сонгож болно",
                                ),
                              });
                              setOgnoonuud([]);
                              form.setFieldsValue({
                                ognoonuud: [],
                                khungulultKhonog: undefined,
                              });
                              setTootsoolol((prev) => ({
                                ...prev,
                                khunglugdsunDun: 0,
                              }));
                              return;
                            }
                          }

                          setOgnoonuud(v);
                          if (v && v[0] && v[1]) {
                            form.setFieldValue(
                              "khungulultKhonog",
                              moment(v[1]).diff(v[0], "d") + 1,
                            );
                          } else {
                            form.setFieldValue("khungulultKhonog", undefined);
                          }
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
  ) : (
   
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
        allowClear={false}
        style={{ width: "100%" }}
        disabledDate={disabledDate}
        placeholder={[t("Эхлэх өдөр"), t("Дуусах өдөр")]}
          onChange={(v) => {
            setOgnoonuud(v);
            if (v && v[0] && v[1] && khonogTootsokhEsekh) {
              form.setFieldValue(
                "khungulultKhonog",
                moment(v[1]).diff(v[0], "d") + 1,
              );
            }
            khungulukhDunTootsoolyo();
          }}
      />
    </Form.Item>
  )}
           
  {khonogTootsokhEsekh ? (
    <Form.Item
      label={t("Хөнгөлөх хоног")}
      name="khungulultKhonog"
      labelAlign="left"
    >
      <Input
        type={"number"}
        placeholder={t("Хөнгөлөх хоног")}
        
        readOnly={!!(ognoonuud && ognoonuud[0] && ognoonuud[1])}
        style={{
          borderRadius: '8px',
          backgroundColor:
            ognoonuud && ognoonuud[0] && ognoonuud[1]
              ? "#f5f5f5"
              : undefined,
          cursor:
            ognoonuud && ognoonuud[0] && ognoonuud[1]
              ? "not-allowed"
              : undefined,
        }}
        onChange={khungulukhDunTootsoolyo}
      />
    </Form.Item>
  ) : (
    ""
  )}
                  {khonogTootsokhEsekh ? (
                    <Form.Item
                      label={t("Хөнгөлөх хувь")}
                      name="khungulultKhuvi"
                      style={{borderRadius: '8px'}}
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
                                new Error(t("Хөнгөлөх хувь оруулна уу!")),
                              );
                            }
                            if (Number(value) <= 0) {
                              return Promise.reject(
                                new Error(
                                  t("Хөнгөлөх хувь 0-ээс их байх ёстой!"),
                                ),
                              );
                            }
                            if (Number(value) > 100) {
                              return Promise.reject(
                                new Error(
                                  t("Хөнгөлөх хувь 100-аас бага байх ёстой!"),
                                ),
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
                        
                        placeholder={t("Хөнгөлөх хувь")}
                        style={{borderRadius: '8px'}}
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
                        placeholder={t("Хөнгөлөх төрөл")}
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
                        <Select.Option key={"khuvi"}>{t("Хувь")}</Select.Option>
                        <Select.Option key={"mungunDun"}>
                         {t("Мөнгөн дүн")}
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
                          ? t("Хөнгөлөх хувь")
                          : t("Хөнгөлөх дүн")
                      }
                      name="khungulukhKhuvi"
                      labelAlign="left"
                    >
                      <Input
                        onKeyDown={focuser}
                        style={{borderRadius: '8px'}}
                        type={"number"}
                        placeholder={
                          khungulukh === "khuvi"
                            ? t("Хөнгөлөх хувь")
                            : t("Хөнгөлөх дүн")
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
                    style={{borderRadius: '8px'}}
                  >
                    <Input.TextArea
                      onKeyDown={focuser}
                      placeholder={t("Шалтгаан")}
                      style={{borderRadius: '8px'}}
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
                              key={index}
                              index={index}
                              align={mur.align || "center"}
                              className={`${
                                mur.summary === true
                                  ? "font-bold text-black dark:text-white text-xs whitespace-nowrap"
                                  : "border-none"
                              }`}
                            >
                              {mur.summary === true ? (
                                <span className="flex flex-col">
                                  <span>
                                    {formatNumber(
                                      khungulultTuukh?.jagsaalt?.reduce(
                                        (a, b) => a + (b[mur.dataIndex] || 0),
                                        0,
                                      ),
                                    )}
                                  </span>
                                </span>
                              ) : (
                                ""
                              )}
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
                  scroll={{ x: "max-content", y: "calc(100vh - 26rem)" }}
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
