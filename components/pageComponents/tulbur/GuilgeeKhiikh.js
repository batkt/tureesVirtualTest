import {
  DatePicker,
  Divider,
  Input,
  InputNumber,
  notification,
  Radio,
  Switch,
  Select,
} from "antd";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";
import formatNumber from "tools/function/formatNumber";
import useJagsaalt from "hooks/useJagsaalt";

function GuilgeeKhiikh({ data, token, onFinish, destroy }, ref) {
  const [dun, setDun] = useState("");
  const [ognoo, setOgnoo] = useState(moment().add(1, "month").startOf("month"));
  const [turul, setTurul] = useState("voucher");
  const [tailbar, setTailbar] = useState("");
  const [negjUne, setNegjUne] = useState("");
  const [busadTurul, setBusadTurul] = useState();
  const [nekhemjlekhDeerKharagdakh, setNekhemjlekhDeerKharagdakh] =
    useState(false);

  const query = useMemo(()=>({ ner: {$in:data?.zardluud?.map((a)=>a.ner)}, tariff: { $exists: true } }),[data]);

  const zardal = useJagsaalt(
    "/ashiglaltiinZardluud",
    query,
    undefined,
    undefined,
    undefined,
    token
  );

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        if (!dun) {
          notification.warning({ message: "Та дүн оруулна уу" });
          return;
        }

        var guilgee = {};

        switch (turul) {
          case "busad":
            if (!busadTurul) {
              notification.warning({
                message: "Та гүйлгээний төрөлөө сонгоно уу",
              });
              return;
            }
            guilgee = {
              turul: busadTurul,
              tulsunDun: busadTurul === "aldangi" ? 0 : dun,
              tulukhDun: 0,
              tulsunAldangi: busadTurul === "aldangi" ? dun : 0,
              tulukhAldangi: 0,
              ognoo: new Date(),
              gereeniiId: data?._id,
              tailbar,
            };
            break;
          case "voucher":
          case "avlaga":
            guilgee = {
              turul: turul,
              tulsunDun: turul === "voucher" ? dun : 0,
              tulukhDun: turul === "avlaga" ? dun : 0,
              ognoo:
                turul === "avlaga"
                  ? moment(ognoo).startOf("month").format("YYYY-MM-DD 00:00:00")
                  : new Date(),
              gereeniiId: data?._id,
              tailbar,
              nekhemjlekhDeerKharagdakh:
                turul === "avlaga" ? nekhemjlekhDeerKharagdakh : false,
            };
            break;
          case "ahiglalt":
            guilgee = {
              turul: "avlaga",
              tulsunDun: 0,
              tulukhDun: negjUne * dun,
              ognoo: moment(ognoo)
                .startOf("month")
                .format("YYYY-MM-DD 00:00:00"),
              gereeniiId: data?._id,
              tailbar,
              nekhemjlekhDeerKharagdakh,
            };
            break;
          default:
            break;
        }

        uilchilgee(token)
          .post("/gereeniiGuilgeeKhadgalya", {
            guilgee: guilgee,
          })
          .then(() => {
            notification.success({
              message: "Амжилттай",
            });
            _.isFunction(onFinish) && onFinish();
            _.isFunction(data.mutate) && data.mutate();

            destroy();
          })
          .catch(aldaaBarigch);
      },
    }),
    [dun, turul, tailbar, nekhemjlekhDeerKharagdakh, busadTurul, negjUne]
  );
  function labelTurul(guilgeeTurul) {
    var text;
    switch (guilgeeTurul) {
      case "avlaga":
        text = "Авлага үүсгэх";
        break;
      case "voucher":
        text = "Ваучераар тооцоо хийх";
        break;
      case "barter":
        text = "Бусад";
        break;
      default:
        break;
    }
    return text;
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-center">
        <Radio.Group
          onChange={(e) => {
            setTurul(e.target.value), setDun("");
          }}
          value={turul}
        >
          <Radio value={"voucher"}>Ваучераар</Radio>
          <Radio value={"avlaga"}>Авлага</Radio>
          <Radio value={"ahiglalt"}>Ашиглалт</Radio>
          <Radio value={"busad"}>Бусад </Radio>
        </Radio.Group>
      </div>
      <Divider />
      <label>{labelTurul(turul)}</label>
      {turul === "avlaga" && (
        <DatePicker.MonthPicker
          locale={locale}
          value={ognoo}
          onChange={setOgnoo}
        />
      )}
      {turul === "ahiglalt" && (
        <DatePicker
          locale={locale}
          value={ognoo}
          onChange={setOgnoo}
        />
      )}
      {turul === "busad" && (
        <Select placeholder="Гүйлгээ хийх төрөл" onChange={setBusadTurul}>
          <Option value="barter">Бартер</Option>
          <Option value="zalruulga">Залруулга</Option>
          <Option value="aldangi">Алданги</Option>
        </Select>
      )}
      {busadTurul === "aldangi" && (
        <div>Алдангийн үлдэгдэл: {formatNumber(data?.aldangiinUldegdel)}</div>
      )}
      {turul === "ahiglalt" && (
        <Select placeholder="Зардлын төрөл" >
          {zardal.jagsaalt?.map((mur) => (
            <Select.Option key={mur._id} value={mur.ner}>
              <div onClick={() => setNegjUne(mur.tariff || 0)}>
                {mur.ner}/{mur.turul}
              </div>
            </Select.Option>
          ))}
        </Select>
      )}
      {negjUne && turul === "ahiglalt" && (
        <div className="p-2 dark:text-gray-100">
          Нэгж үнэ: {negjUne}
        </div>
      )}
      <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        placeholder={turul === "ahiglalt" ? "Нэгж" : "Дүн"}
        style={{ width: "100%", textAlign: "center" }}
        value={dun}
        onChange={(v) => setDun(v)}
        min={0}
      />
      {negjUne && turul === "ahiglalt" && (
        <div className="p-2 dark:text-gray-100">
          Нийт үнэ: {negjUne * dun || 0}
        </div>
      )}
      {(turul === "avlaga" || turul === "busad" || turul === "ahiglalt") && (
        <Input.TextArea
          placeholder="Тайлбар"
          value={tailbar}
          onChange={(e) => setTailbar(e.target.value)}
        />
      )}
      {(turul === "avlaga" || turul === "ahiglalt") && (
        <div className="flex flex-row justify-between">
          <div />
          <div className="space-x-2">
            <label>Нэхэмжлэх дээр харах эсэх:</label>
            <Switch
              checked={nekhemjlekhDeerKharagdakh}
              onChange={setNekhemjlekhDeerKharagdakh}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeKhiikh);
