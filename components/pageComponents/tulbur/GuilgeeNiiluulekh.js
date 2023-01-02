import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";
import {
  Divider,
  Dropdown,
  Input,
  Modal,
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
        Number(dans.bank === "tdb" ? guilgee.Amt : guilgee.amount) -
          guilgee.kholbosonDun
    ) {
      aldaa.push(
        `${mur.talbainDugaar} талбайн холбох гүйлгээний алдангийн дүнг түрүүлж төлнө үү`
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
    5
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
        if (undsenGuilgee.length === 0 && baritsaa.length === 0) {
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

  function garya() {
    if (
      gereenuud.length > 0 ||
      khaagdsanGereeEsekh === true ||
      guilgeeniiTailbar !== data.description
    )
      Modal.confirm({
        content: `Та хадгалахгүй гарахдаа итгэлтэй байна уу?`,
        okText: "Тийм",
        cancelText: "Үгүй",
        onOk: destroy,
      });
    else destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }

    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, [gereenuud, khaagdsanGereeEsekh, guilgeeniiTailbar]);

  useEffect(() => {
    document.getElementById("gereeSongokh").focus();
  }, []);

  const content = useMemo(
    () => (
      <div className="relative w-[21rem] space-y-1 bg-white p-3 shadow-xl drop-shadow-xl dark:bg-gray-900 dark:text-gray-200">
        {gereeniiMedeelel?.jagsaalt?.map((mur, i) => (
          <div
            className="grid cursor-pointer grid-cols-3 gap-2 rounded-md border border-gray-400 p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <div className="truncate px-2">{mur.talbainDugaar}</div>
            <div className="px-2">{mur.register}</div>
            <div className="px-2">{mur.ner}</div>
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

    if (
      "baritsaaTulbur" === talbar &&
      guilgeeniiDun - sum >
        (gereenuud[index]?.baritsaaAvakhDun || 0) -
          (gereenuud[index]?.baritsaaniiUldegdel || 0)
    ) {
      let baritsaadun =
        (gereenuud[index]?.baritsaaAvakhDun || 0) -
        (gereenuud[index]?.baritsaaniiUldegdel || 0);
      sum += guilgeeniiDun - sum - baritsaadun;
    }

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
      <div className="space-y-2 ">
        <div className="flex justify-between">
          <span className="text-sm font-medium dark:text-gray-100 lg:text-xl">
            Гүйлгээний мэдээлэл
          </span>
          <span className="dark:text-gray-200">
            {moment().format("YYYY-MM-DD")}
          </span>
        </div>
        <div className="grid w-full grid-cols-4 rounded-md border border-gray-400 bg-gray-100 p-2">
          <div className="col-span-4 lg:col-span-1">
            {data.CtAcct || data.relatedAccount}
          </div>
          <div className="col-span-4 lg:col-span-1">{data.CtActnName}</div>
          <div className="col-span-2 text-center lg:col-span-1">
            {moment(data.TxDt || data.tranDate).format("YYYY-MM-DD")}
          </div>
          <div className="col-span-2 text-right text-red-600 lg:col-span-1">
            {formatNumber(guilgeeniiDun)}
          </div>
          <div className="relative col-span-4 mt-2 flex justify-between rounded-md lg:mt-0">
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
        <div className="font-medium dark:text-gray-200 lg:text-xl">
          Гүйлгээ холбох
        </div>
        <div className="flex grid-cols-2 flex-col-reverse gap-3 lg:grid ">
          <Dropdown
            className="w-[100%]"
            placement="bottom"
            title="Гэрээний жагсаалт"
            overlay={content}
            open={visible}
            trigger="click"
            onOpenChange={(v) => setVisible(v)}
          >
            <input
              autoComplete="off"
              id="gereeSongokh"
              onFocus={() =>
                setTimeout(() => {
                  setVisible(true);
                }, 300)
              }
              className=" rounded-md border border-gray-400 p-1 px-2 dark:text-gray-200 lg:w-[114%]"
              placeholder="Гэрээ сонгох"
              onChange={onChange}
            />
          </Dropdown>
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
            <div className="flex w-full justify-between text-right text-base font-medium dark:text-gray-200 lg:text-xl">
              <span>
                {geree?.talbainDugaar} -- {geree?.register} -- {geree?.ner}
              </span>
              <Popconfirm
                title={`${geree?.talbainDugaar} талбайн мөр бичилт устгах уу?`}
                okText="Тийм"
                cancelText="Үгүй"
                trigger={"click"}
                onConfirm={() =>
                  setGereenuud((a) => {
                    a.splice(index, 1);
                    return [...a];
                  })
                }
              >
                <span className="h-10 w-10 p-1 text-2xl text-red-500">
                  <CloseCircleOutlined />
                </span>
              </Popconfirm>
            </div>
            {(geree?.aldangiinUldegdel || 0) > 0 && (
              <div className="grid w-full grid-cols-3 rounded-md border border-gray-400 bg-gray-100 p-1">
                <div className="col-span-4">Алдангийн үлдэгдэл</div>
                <div>{formatNumber(geree?.aldangiinUldegdel || 0, 2)}</div>
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
                      (geree.baritsaaniiUldegdel || 0),
                    2
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
                  {formatNumber(geree.uldegdel, 2)}
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
        <div className="flex flex-col justify-between pr-2 lg:flex-row">
          <div className="dark:text-gray-200">Холбосон дүн:</div>
          <div className="text-right text-xl text-green-600">
            {formatNumber(guilgeeniiDun - zuruuDun)}
          </div>
        </div>
        <div className="flex flex-col justify-between pl-2 lg:flex-row">
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
