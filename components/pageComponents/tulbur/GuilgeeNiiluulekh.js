import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import {
  Divider,
  Input,
  notification,
  Popconfirm,
  Popover,
  Switch,
  Tooltip,
} from "antd";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import { formatter, parser } from "tools/function/inputFormatter";
import {
  CloseCircleOutlined,
  CloseOutlined,
  FormOutlined,
} from "@ant-design/icons";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

var timeout = null;

function guilgeeBurduulya(gereenuud, dans, guilgee) {
  let baritsaa = [];
  let undsenGuilgee = [];
  let aldaa = [];
  gereenuud.forEach((mur) => {
    if (mur.tureesiinTulbur > 0 || mur.tulsunAldangi > 0) {
      let guilgeeniiMur = {
        turul: "bank",
        tulsunDun: mur.tureesiinTulbur || 0,
        guilgeeniiId: guilgee._id,
        gereeniiId: mur._id,
        dansniiDugaar: guilgee.dansniiDugaar,
        tulukhAldangi: mur.aldangiinUldegdel,
        tulsunAldangi: mur.tulsunAldangi,
      };

      switch (dans.bank) {
        case "tdb":
          guilgeeniiMur.ognoo = guilgee.TxDt;
          guilgeeniiMur.tulsunDans = guilgee.CtAcntOrg;
          break;
        case "khanbank":
          guilgeeniiMur.ognoo = guilgee.tranDate;
          guilgeeniiMur.tulsunDans = guilgee.relatedAccount;
          break;
        default:
          aldaa.push(
            `${mur.talbainDugaar} талбайн холбох гүйлгээний данс тодорхоогүй байна`
          );
          break;
      }
      undsenGuilgee.push(guilgeeniiMur);
    }
    if (mur.baritsaaTulbur > 0) {
      let baritsaaniiMur = {
        gereeniiId: mur._id,
        guilgeeniiId: guilgee._id,
        orlogo: mur.baritsaaTulbur,
        zarlaga: 0,
      };
      switch (dans.bank) {
        case "tdb":
          baritsaaniiMur.ognoo = guilgee.TxDt;
          break;
        case "khanbank":
          baritsaaniiMur.ognoo = guilgee.tranDate;
          break;
        default:
          break;
      }
      if (
        (mur?.baritsaaAvakhDun || 0) - (mur?.baritsaaniiUldegdel || 0) <
        mur.baritsaaTulbur
      )
        aldaa.push(
          `${mur.talbainDugaar} талбайн холбох гүйлгээний барьцааны дүн хэтэрсэн байна`
        );
      baritsaa.push(baritsaaniiMur);
    }
    if (
      mur.aldangiinUldegdel > (mur.tulsunAldangi || 0) &&
      (mur.tulsunAldangi || 0) <
        (dans.bank === "tdb" ? guilgee.Amt : guilgee.amount)
    ) {
      aldaa.push(
        `${mur.talbainDugaar} талбайн холбох гүйлгээний алдангийн дүн оруулаагүй байна`
      );
    }
  });

  return {
    baritsaa,
    undsenGuilgee,
    aldaa,
  };
}

async function baritsaaniiGuilgeeKhiiya(token, guilgeenuud) {
  let aldaa = [];
  for await (const geree of guilgeenuud) {
    const khariu = await uilchilgee(token)
      .post("/baritsaaniiGuilgeeKhiie", geree)
      .then(({ data }) => data)
      .catch((e) => {
        aldaaBarigch(e);
        aldaa.push(`${e.message}`);
      });
    if (khariu !== "Amjilttai") break;
    break;
  }
  return { aldaa };
}

function GuilgeeNiiluulekh(
  { data, dans, token, baiguullagiinId, destroy, onFinish, barilgiinId },
  ref
) {
  const [gereenuud, setGereenuud] = useState([]);
  const [visible, setVisible] = useState(false);
  const [khaagdsanGereeEsekh, setKhaagdsanGereeEsekh] = useState(false);
  const [guilgeeniiTailbar, setGuilgeeniiTailbar] = useState();
  const inputRef = React.useRef();

  const query = useMemo(() => {
    return { tuluv: khaagdsanGereeEsekh ? -1 : { $nin: [-1] }, barilgiinId };
  }, [khaagdsanGereeEsekh]);

  const { gereeniiMedeelel, setGereeniiKhuudaslalt } = useGereeniiJagsaalt(
    token,
    baiguullagiinId,
    undefined,
    query,
    undefined,
    10
  );
  useEffect(() => {
    inputRef.current.focus();
  }, [guilgeeniiTailbar]);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      async khadgalya() {
        const { aldaa, baritsaa, undsenGuilgee } = guilgeeBurduulya(
          gereenuud,
          dans,
          data
        );
        if (aldaa.length > 0) {
          notification.warning({
            message: "Анхаар",
            description: aldaa.join(","),
          });
          return;
        }
        if (undsenGuilgee.length === 0) {
          notification.warning({
            message: "Анхаар гүйлгээний дүн холбоно уу!",
            description: aldaa.join(","),
          });
          return;
        }
        if (baritsaa.length > 0) {
          const baritsaaniiGuilgee = await baritsaaniiGuilgeeKhiiya(
            token,
            baritsaa
          );
          if (baritsaaniiGuilgee.aldaa.length > 0) {
            notification.warning({
              message: "Анхаар",
              description: baritsaaniiGuilgee.aldaa.join(","),
            });
            return;
          }
          if (undsenGuilgee.length === 0) {
            notification.success({
              message: "Амжилттай",
              description: "Гүйлгээ амжилттай холбогдлоо",
            });
            _.isFunction(onFinish) && onFinish();
            destroy();
          }
        }
        if (!!guilgeeniiTailbar)
          undsenGuilgee?.forEach((mur) => {
            mur.tailbar = guilgeeniiTailbar;
          });

        if (undsenGuilgee.length > 0)
          uilchilgee(token)
            .post("/tulultOlnoorKhadgalya", { guilgeenuud: undsenGuilgee })
            .then(({ data }) => {
              if (data === "Amjilttai") {
                notification.success({
                  message: "Амжилттай",
                  description: "Гүйлгээ амжилттай холбогдлоо",
                });
                _.isFunction(onFinish) && onFinish();
                destroy();
              }
            })
            .catch(aldaaBarigch);
      },
    }),
    [gereenuud]
  );

  const content = useMemo(
    () => (
      <div className="relative w-80 space-y-1 dark:text-gray-200">
        <div
          onClick={() => setVisible(false)}
          className="absolute right-0 -top-10 text-xl dark:text-gray-200"
        >
          <CloseCircleOutlined />
        </div>
        {gereeniiMedeelel?.jagsaalt?.map((mur, i) => (
          <div
            className="grid cursor-pointer grid-cols-3 rounded-md border border-gray-400 p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            key={`gereeniisongolt${i}`}
            onClick={() => {
              if (gereenuud.find((a) => a._id === mur._id)) {
                notification.warning({
                  message: "Анхаар",
                  description: "Гэрээ сонгогдсон байна",
                });
                return;
              }
              uilchilgee(token)
                .post("/uldegdelBodyo", {
                  barilgiinId,
                  gereeniiDugaar: mur.gereeniiDugaar,
                })
                .then(({ data }) => {
                  if (!!data) {
                    mur.uldegdel = data.uldegdel;
                    setGereenuud((a) => {
                      a.push(mur);
                      return [...a];
                    });
                    setVisible(false);
                  }
                })
                .catch(aldaaBarigch);
            }}
          >
            <div>{mur.talbainDugaar}</div>
            <div>{mur.register}</div>
            <div>{mur.ner}</div>
          </div>
        ))}
      </div>
    ),
    [gereeniiMedeelel, gereenuud]
  );

  function zuruuZun(index, talbar) {
    let sum = gereenuud.reduce((a, b, currentIndex) => {
      let value = 0;
      if (currentIndex === index) {
        ["baritsaaTulbur", "tureesiinTulbur", "tulsunAldangi"]
          .filter((a) => a !== talbar)
          .forEach((mur) => {
            value += b[mur] || 0;
          });
      } else {
        value += b.baritsaaTulbur || 0;
        value += b.tureesiinTulbur || 0;
        value += b.tulsunAldangi || 0;
      }
      return _.toNumber(a + value);
    }, 0);
    return sum + (data.kholbosonDun || 0);
  }

  function onChange({ target }) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      setGereeniiKhuudaslalt((a) => ({ ...a, search: target.value }));
    }, 300);
  }

  const guilgeeniiDun = useMemo(() => {
    return dans.bank === "tdb" ? data.Amt : data.amount;
  }, [dans, data]);

  function onChangeKholbokhDun(target, index, talbar) {
    let sum = zuruuZun(index, talbar);
    if (sum + _.toNumber(parser(target.value)) > guilgeeniiDun) {
      target.value = formatter(guilgeeniiDun - sum);
      notification.warning({
        message: "Анхаар",
        description: "Гүйлгээний дүнгээс холбох дүн илүү гарсан байна",
      });
    }
    setGereenuud((a) => {
      _.set(a, `${index}.${talbar}`, _.toNumber(parser(target.value)));
      return [...a];
    });
  }

  function onDoubleClickKholbokhDun(target, index, talbar) {
    let sum = zuruuZun(index, talbar);
    if (
      "tulsunAldangi" === talbar &&
      guilgeeniiDun - sum > gereenuud[index].aldangiinUldegdel
    )
      sum = guilgeeniiDun - gereenuud[index].aldangiinUldegdel;

    if (sum < guilgeeniiDun) {
      target.value = formatter(guilgeeniiDun - sum);
      setGereenuud((a) => {
        _.set(a, `${index}.${talbar}`, _.toNumber(parser(target.value)));
        return [...a];
      });
    }
  }

  const zuruuDun = useMemo(() => {
    let sum = zuruuZun();
    return guilgeeniiDun - sum;
  }, [gereenuud]);

  function inputChange(e) {
    setGuilgeeniiTailbar(e.target.value);
  }

  return (
    <div className="flex w-full flex-col space-y-2">
      <div className="space-y-2 px-2">
        <div className="flex justify-between">
          <span className="text-xl dark:text-gray-100">
            Гүйлгээний мэдээлэл
          </span>
          <span className="dark:text-gray-200">
            {moment().format("YYYY-MM-DD")}
          </span>
        </div>
        <div className="grid w-full grid-cols-4 rounded-md border border-gray-400 bg-gray-100 p-2">
          <div>{data.CtAcct || data.relatedAccount}</div>
          <div>{data.CtActnName}</div>
          <div className="text-center ">
            {moment(data.TxDt || data.tranDate).format("YYYY-MM-DD")}
          </div>
          <div className="text-right text-red-600">
            {formatNumber(guilgeeniiDun)}
          </div>
          <div className="relative col-span-4 flex justify-between rounded-md">
            <Input
              ref={inputRef}
              className="rounded-md pr-7"
              value={
                guilgeeniiTailbar === undefined
                  ? data.TxAddInf?.split("-&gt;")[0] || data.description
                  : guilgeeniiTailbar
              }
              onChange={inputChange}
              disabled={guilgeeniiTailbar === undefined}
            />
            {guilgeeniiTailbar === undefined ? (
              <FormOutlined
                onClick={() =>
                  setGuilgeeniiTailbar(
                    data.TxAddInf?.split("-&gt;")[0] || data.description
                  )
                }
                className="absolute right-2 cursor-pointer text-lg hover:text-yellow-600"
              />
            ) : (
              <CloseOutlined
                onClick={() => setGuilgeeniiTailbar(undefined)}
                className="absolute right-2 cursor-pointer text-lg hover:text-green-600"
              />
            )}
          </div>
          {data.kholbosonDun > 0 && (
            <div className="col-span-4 flex justify-between">
              <span>
                Холбогдсон талбай:
                {data.kholbosonTalbainId &&
                  [...new Set(data.kholbosonTalbainId)].join(",")}
              </span>
              <span>Холбогдсон дүн:{formatNumber(data.kholbosonDun || 0)}</span>
            </div>
          )}
        </div>
        <div className="text-xl dark:text-gray-200">Гүйлгээ холбох</div>
        <div className="grid grid-cols-2 ">
          <Popover
            placement="bottom"
            title="Гэрээний жагсаалт"
            content={content}
            visible={visible}
            trigger="click"
            onVisibleChange={() => setVisible(true)}
          >
            <input
              className="rounded-md border border-gray-400 p-1 px-2 dark:text-gray-200"
              placeholder="Гэрээ сонгох"
              onChange={onChange}
            />
          </Popover>
          <div className="flex items-center justify-end">
            <label className="pr-2 text-sm font-bold text-gray-600">
              Хаагдсан гэрээ холбох эсэх{" "}
            </label>
            <Tooltip title="Хаагдсан гэрээ холбох эсэх">
              <Switch
                checked={khaagdsanGereeEsekh}
                onChange={setKhaagdsanGereeEsekh}
                title="Хаагдсан гэрээ холбох эсэх"
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="space-y-2 overflow-auto px-2" style={{ height: "25rem" }}>
        {gereenuud.map((geree, index) => (
          <div
            key={`${index}geree-kholbolt`}
            className="space-y-2 rounded-md border border-gray-400 p-2"
          >
            <div className="flex w-full justify-between text-right text-xl dark:text-gray-200">
              <span>
                {geree?.talbainDugaar} -- {geree?.register} -- {geree?.ner}
              </span>
              <Popconfirm
                title={`${geree?.talbainDugaar} талбайн мөр бичилт устгах уу?`}
                okText="Тийм"
                cancelText="Үгүй"
                onConfirm={() =>
                  setGereenuud((a) => {
                    a.splice(index, 1);
                    return [...a];
                  })
                }
              >
                <span className="h-10 w-10 p-1 text-red-500">
                  <CloseCircleOutlined />
                </span>
              </Popconfirm>
            </div>
            {(geree?.aldangiinUldegdel || 0) > 0 && (
              <div className="grid w-full grid-cols-3 rounded-md border border-gray-400 bg-gray-100 p-1">
                <div className="col-span-4">Алдангийн үлдэгдэл</div>
                <div>{formatNumber(geree?.aldangiinUldegdel || 0)}</div>
                <div>{geree.talbainDugaar}</div>
                <div className="text-right">
                  <input
                    className="w-full rounded-md border bg-gray-200 px-2 text-right"
                    placeholder="Барьцаа дүн"
                    value={formatter(geree.tulsunAldangi)}
                    onDoubleClick={({ target }) =>
                      onDoubleClickKholbokhDun(target, index, "tulsunAldangi")
                    }
                    onChange={({ target }) => {
                      onChangeKholbokhDun(target, index, "tulsunAldangi");
                    }}
                  />
                </div>
              </div>
            )}
            {(geree?.baritsaaAvakhDun || 0) -
              (geree?.baritsaaniiUldegdel || 0) >
              0 && (
              <div className="grid w-full grid-cols-3 rounded-md border border-gray-400 bg-gray-100 p-1">
                <div className="col-span-4">Барьцааны үлдэгдэл</div>
                <div>
                  {formatNumber(
                    (geree?.baritsaaAvakhDun || 0) -
                      (geree.baritsaaniiUldegdel || 0)
                  )}
                </div>
                <div>{geree.talbainDugaar}</div>
                <div className="text-right">
                  <input
                    className="w-full rounded-md border bg-gray-200 px-2 text-right"
                    placeholder="Барьцаа дүн"
                    value={formatter(geree.baritsaaTulbur)}
                    onDoubleClick={({ target }) =>
                      onDoubleClickKholbokhDun(target, index, "baritsaaTulbur")
                    }
                    onChange={({ target }) => {
                      onChangeKholbokhDun(target, index, "baritsaaTulbur");
                    }}
                  />
                </div>
              </div>
            )}
            {geree && (
              <div className="grid w-full grid-cols-3 rounded-md border border-gray-400 bg-gray-100 p-1">
                <div className="col-span-4">Түрээсийн үлдэгдэл</div>
                <div
                  className={`text-${geree.uldegdel > 0 ? "red" : "green"}-500`}
                >
                  {formatNumber(geree.uldegdel)}
                </div>
                <div>{geree.talbainDugaar}</div>
                <div className="text-right text-green-600">
                  <input
                    className="w-full rounded-md border bg-gray-200 px-2 text-right"
                    placeholder="Төлөх дүн"
                    value={formatter(geree.tureesiinTulbur)}
                    onDoubleClick={({ target }) =>
                      onDoubleClickKholbokhDun(target, index, "tureesiinTulbur")
                    }
                    onChange={({ target }) => {
                      onChangeKholbokhDun(target, index, "tureesiinTulbur");
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Divider />
      <div className="grid w-full grid-cols-2 divide-x-2 px-2">
        <div className="flex justify-between pr-2">
          <div className="dark:text-gray-200">Холбосон дүн:</div>
          <div className="text-right text-xl text-green-600">
            {formatNumber(guilgeeniiDun - zuruuDun)}
          </div>
        </div>
        <div className="flex justify-between pl-2">
          <div className="dark:text-gray-200">Холбоогүй дүн:</div>
          <div className="text-right text-xl text-red-600">
            {formatNumber(zuruuDun)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeNiiluulekh);
