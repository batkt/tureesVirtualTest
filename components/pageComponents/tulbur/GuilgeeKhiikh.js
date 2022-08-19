import {
  DatePicker,
  Divider,
  Input,
  InputNumber,
  notification,
  Radio,
  Switch,
  Select
} from "antd";
import _ from "lodash";
import React, { useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";


function GuilgeeKhiikh({ data, token, onFinish, destroy }, ref) {
  const [dun, setDun] = useState(0);
  const [ognoo, setOgnoo] = useState(moment().add(1, "month").startOf("month"));
  const [turul, setTurul] = useState("voucher");
  const [tailbar, setTailbar] = useState("");
  const [busadTurul, setBusadTurul] = useState();
  const [nekhemjlekhDeerKharagdakh, setNekhemjlekhDeerKharagdakh] =
    useState(false);

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

        var guilgee = {}
        if (turul === "busad") {
          if (!busadTurul) {
            notification.warning({ message: "Та гүйлгээний төрөлөө сонгоно уу" });
            return;
          }
          guilgee = {
            turul: busadTurul,
            tulsunDun: dun,
            tulukhDun: 0,
            ognoo: new Date(),
            gereeniiId: data?._id,
            tailbar,
          }
        }
        else {
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
          }
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
    [dun, turul, tailbar, nekhemjlekhDeerKharagdakh, busadTurul]
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
        <Radio.Group onChange={(e) => setTurul(e.target.value)} value={turul}>
          <Radio value={"voucher"}>Ваучераар</Radio>
          <Radio value={"avlaga"}>Авлага үүсгэх</Radio>
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
      {turul === "busad" && (
        <Select
          placeholder="Гүйлгээ хийх төрөл"
          onChange={setBusadTurul}>
          <Option value="barter">Бартер</Option>
          <Option value="zalruulga">Залруулга</Option>
        </Select>
      )}
      <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        placeholder="Дүн"
        style={{ width: "100%" }}
        onChange={setDun}
        min={0}
      />
      {(turul === "avlaga" || turul === "busad") && (
        <Input.TextArea
          placeholder="Тайлбар"
          value={tailbar}
          onChange={(e) => setTailbar(e.target.value)}
        />
      )}
      {turul === "avlaga" && (
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
