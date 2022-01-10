import {
  DatePicker,
  Divider,
  Input,
  InputNumber,
  notification,
  Radio,
} from "antd";
import _ from "lodash";
import React, { useState } from "react";
import uilchilgee from "services/uilchilgee";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/mn_MN";

function GuilgeeKhiikh({ data, token, onFinish, destroy }, ref) {
  const [dun, setDun] = useState(0);
  const [ognoo, setOgnoo] = useState(moment().add(1, "month").startOf("month"));
  const [turul, setTurul] = useState("voucher");
  const [tailbar, setTailbar] = useState("");

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        if (!dun) {
          notification.warning({ message: "Та гэрээгээ сонгоно уу" });
          return;
        }
        uilchilgee(token)
          .post("/gereeniiGuilgeeKhadgalya", {
            guilgee: {
              turul: turul,
              tulsunDun: turul === "voucher" ? dun : 0,
              tulsunDun: turul === "barter" ? dun : 0,
              tulukhDun: turul === "avlaga" ? dun : 0,
              ognoo:
                turul === "avlaga"
                  ? moment(ognoo).startOf("month").format("YYYY-MM-DD 00:00:00")
                  : new Date(),
              gereeniiId: data?._id,
              tailbar,
            },
          })
          .then(() => {
            notification.success({
              placement: "bottomRight",
              message: "Амжилттай",
            });
            _.isFunction(onFinish) && onFinish();
            destroy();
          });
      },
    }),
    [dun, turul, tailbar]
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
        text = "Бартераар тооцоо хийх";
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
          <Radio value={"barter"}>Бартераар </Radio>
        </Radio.Group>
      </div>
      <Divider />
      <label>{labelTurul(turul)}</label>
      {turul === "avlaga" && (
        <DatePicker.MonthPicker locale={locale} value={ognoo} onChange={setOgnoo} />
      )}
      <InputNumber
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        placeholder="Дүн"
        style={{ width: "100%" }}
        onChange={setDun}
      />
      {(turul === "avlaga" || turul === "barter") && (
        <Input.TextArea
          placeholder="Тайлбар"
          value={tailbar}
          onChange={(e) => setTailbar(e.target.value)}
        />
      )}
    </div>
  );
}

export default React.forwardRef(GuilgeeKhiikh);
