import { InputNumber, Modal, notification, Select, Switch, Tooltip } from "antd";
import _ from "lodash";
import React from "react";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import formatNumber from "../../../tools/function/formatNumber";
import getListMethod from "../../../tools/function/crud/getListMethod";
import uilchilgee from "../../../services/uilchilgee";
import moment from "moment";

function GuilgeeKholbokh(
  { data, token, baiguullagiinId, onFinish, destroy },
  ref
) {
  const [geree, setGeree] = React.useState(null);
  const [olnoorKholbokhEsekh, setOlnoorKholbokhEsekh] = React.useState(false);
  const [magadlaltaiGereenuud, setMagadlaltaiGereenuud] = React.useState([]);
  const [tulult, setTulult] = React.useState([{}]);

  const { gereeniiMedeelel, setGereeniiKhuudaslalt } = useGereeniiJagsaalt(
    token,
    baiguullagiinId
  );

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        if (!tulult.filter((a) => !!a.gereeniiId)) {
          notification.warning({ message: "Та гэрээгээ сонгоно уу" });
          return;
        }
        let niitDun = data?.kholbosonDun || 0
        a.forEach((a, i) => {
          i !== index && !!a.tulsunDun && (niitDun += a.tulsunDun);
        });
        if(niitDun > data?.amount)
        {
          notification.warning({ message: "Таны оруулсан дүн гүйлгээний дүнгээс илүү гарсан байна" });
          return;
        }

        Modal.confirm({
          content: `${data.dansniiDugaar} гүйлгээг холбохдоо итгэлтэй байна уу?`,
          okText: "Тийм",
          cancelText: "Үгүй",
          onOk: () => {
            let guilgeenuud = []
            if(olnoorKholbokhEsekh)
              guilgeenuud = tulult.filter((a) => !!a.gereeniiId);
            else 
              guilgeenuud = [{
                turul:'bank',
                tulsunDun:data.amount - (data?.kholbosonDun || 0),
                ognoo:moment(data.tranDate).set('hour',data.time.substring(0, 2)).set('minute',data.time.substring(2, 4)),
                guilgeeniiId:data._id,
                gereeniiId:geree,
                dansniiDugaar:data.dansniiDugaar,
                tulsunDans:data.relatedAccount
              }]
            uilchilgee(token)
              .post("/tulultOlnoorKhadgalya", { guilgeenuud })
              .then(({ data }) => {
                if (data === "Amjilttai") {
                  notification.success({
                    placement: "bottomRight",
                    message: "Амжилттай",
                  });
                  _.isFunction(onFinish) && onFinish();
                  destroy();
                }
              });
          },
        });
      },
    }),
    [geree, tulult]
  );

  React.useEffect(() => {
    getListMethod("geree", token, {
      query: { _id: data?.magadlaltaiGereenuud },
    }).then(({ data }) => {
      setMagadlaltaiGereenuud(data?.jagsaalt);
    });
  }, []);

  function onChange(index, key, v) {
    if (key === "gereeniiId") {
      setTulult((a) => {
        const i = a.indexOf((a) => a.gereeniiId === v);
        if (i === -1 && a.length === index + 1) a.push({});
        _.set(a, `${index}.${key}`, v);
        _.set(a, `${index}.turul`, "bank");
        _.set(
          a,
          `${index}.ognoo`,
          moment(data.tranDate)
            .set("hour", data.time.substring(0, 2))
            .set("minute", data.time.substring(2, 4))
        );
        _.set(a, `${index}.guilgeeniiId`, data._id);
        _.set(a, `${index}.dansniiDugaar`, data.dansniiDugaar);
        _.set(a, `${index}.tulsunDans`, data.relatedAccount);

        return [...a];
      });
    } else
      setTulult((a) => {
        _.set(a, `${index}.${key}`, v);
        return [...a];
      });
  }

  function tooBugluyu(index) {
    setTulult((a) => {
      let sum = 0;
      a.forEach((a, i) => {
        i !== index && !!a.tulsunDun && (sum += a.tulsunDun);
      });
      if (!!data?.kholbosonDun) sum += data?.kholbosonDun;
      _.set(a, `${index}.tulsunDun`, data.amount - sum);
      return [...a];
    });
  }

  return (
    <div className="flex flex-col space-y-4">
      {magadlaltaiGereenuud?.length > 0 && (
        <div>
          <div className="text-lg font-medium py-2">Санал болгох гэрээ сонгох</div>
          {magadlaltaiGereenuud.map((a, i) => (
            <div
              className={`border-l border-r border-b p-2 grid grid-cols-12 gap-1 zoom-in ${
                i === 0 ? "border-t" : ""
              } ${a?._id === geree ? "bg-green-100" : ""}`}
              key={a?._id}
              onClick={() => setGeree(a?._id)}
            >
              <div className="col-span-3 font-medium">{a?.gereeniiDugaar}</div>
              <div className="col-span-3">{a?.ner}</div>
              <div className="col-span-2 font-medium">{a?.utas}</div>
              <div className="col-span-2">{a?.talbainDugaar}</div>
              <div className="col-span-2">{formatNumber(a?.uldegdel,2)}₮</div>
            </div>
          ))}
        </div>
      )}
      <label className="text-lg font-medium">Гүйлгээний мэдээлэл</label>
      <div className="grid grid-cols-2">
        <div className="space-x-2 p-2">
          <span className="font-medium">Данс:</span>
          <span>{data?.dansniiDugaar}</span>
        </div>
        <div className="space-x-2 p-2">
          <span className="font-medium">Гүйлгээний дүн:</span>
          <span>{formatNumber(data?.amount,2)}₮</span>
        </div>
        <div className="col-span-2 flex flex-row space-x-2 border-t p-2">
          <div className="font-medium">Тайлбар:</div>
          <div>{data?.description}</div>
        </div>
        {!!data?.kholbosonDun && (
          <div className="col-span-2 flex flex-row space-x-2 border-t p-2">
            <div className="font-medium">Холбогдсон дүн:</div>
            <div>{formatNumber(data?.kholbosonDun,2)}</div>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between items-center">
        <label className="text-lg font-medium">Гүйлгээнд талбай холбох</label>
        <Tooltip title='Олон гэрээнд холбох эсэх?'>
          <Switch checked={olnoorKholbokhEsekh} onChange={setOlnoorKholbokhEsekh} title="Олон гэрээнд холбох эсэх?"/>
        </Tooltip>          
      </div>
      {!olnoorKholbokhEsekh &&
        <Select
          placeholder="Талбай"
          onSearch={(search) => setGereeniiKhuudaslalt((a) => ({ ...a, search ,khuudasniiDugaar:1}))}
          onChange={setGeree}
          filterOption={o=>o}
          showSearch
        >
          {gereeniiMedeelel?.jagsaalt?.map((mur) => {
            return (
              <Select.Option key={mur._id} value={mur._id}>
                <div className='flex flex-row justify-between'>
                  <div className='flex flex-row space-x-2'>
                    <label>Талбай:</label>
                    <div>{mur.talbainDugaar}</div>
                  </div>
                  <div className='flex flex-row'>
                    <div>{formatNumber(mur.uldegdel)}₮</div>
                  </div>
                </div>
              </Select.Option>
            );
          })}
        </Select>
      }
      {olnoorKholbokhEsekh && tulult?.map((a, i) => (
        <div className="grid grid-cols-3" key={`geree-${i}`}>
          <div className="col-span-2">
            <Select
              placeholder="Талбай"
              onSearch={(search) =>
                setGereeniiKhuudaslalt((a) => ({
                  ...a,
                  search,
                  khuudasniiDugaar: 1,
                }))
              }
              value={a.gereeniiId}
              onChange={(v) => onChange(i, "gereeniiId", v)}
              filterOption={(o) => o}
              style={{ width: "100%" }}
              showSearch
            >
              {gereeniiMedeelel?.jagsaalt?.map((mur) => {
                return (
                  <Select.Option key={mur._id} value={mur._id}>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row space-x-2">
                        <label>Талбай:</label>
                        <div>{mur.talbainDugaar}</div>
                      </div>
                      <div className="flex flex-row">
                        <div>{formatNumber(mur.uldegdel)}₮</div>
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </div>
          <div>
            <InputNumber
              style={{ width: "100%" }}
              value={a.tulsunDun || 0}
              onChange={(v) => onChange(i, "tulsunDun", v)}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              onDoubleClick={() => tooBugluyu(i)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.forwardRef(GuilgeeKholbokh);
