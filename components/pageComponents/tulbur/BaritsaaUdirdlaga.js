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
import formatNumber from "tools/function/formatNumber";

function BaritsaaUdirdlaga({ data, token, onFinish, destroy }, ref) {
  const [dun, setDun] = useState(0);
  const [ognoo, setOgnoo] = useState(moment().add(1, "month").startOf("month"));
  const [turul, setTurul] = useState("tululkh");
  const [tailbar, setTailbar] = useState("");

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        destroy();
        // if (!dun) {
        //   notification.warning({ message: "Та гэрээгээ сонгоно уу" });
        //   return;
        // }
        // uilchilgee(token)
        //   .post("/gereeniiGuilgeeKhadgalya", {
        //     guilgee: {
        //       turul: turul,
        //       tulsunDun: (turul === "voucher" || turul === "barter") ? dun : 0,
        //       tulukhDun: turul === "avlaga" ? dun : 0,
        //       ognoo:
        //         turul === "avlaga"
        //           ? moment(ognoo).startOf("month").format("YYYY-MM-DD 00:00:00")
        //           : new Date(),
        //       gereeniiId: data?._id,
        //       tailbar,
        //     },
        //   })
        //   .then(() => {
        //     notification.success({
        //       placement: "bottomRight",
        //       message: "Амжилттай",
        //     });
        //     _.isFunction(onFinish) && onFinish();
        //     destroy();
        //   });
      },
    }),
    [dun, turul, tailbar]
  );
  function labelTurul(guilgeeTurul) {
    var text;
    switch (guilgeeTurul) {
      case "ashiglakh":
        text = "Барьцаа ашиглах";
        break;
      default:
        text = "Барьцаа төлөх"
        break;
    }
    return text;
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-center">
        <Radio.Group onChange={(e) => setTurul(e.target.value)} value={turul}>
          <Radio value={"tululkh"}>Барьцаа төлөх</Radio>
          <Radio value={"ashiglakh"}>Барьцаа ашиглах</Radio>
        </Radio.Group>
      </div>
      <Divider />
      <div className="flex flex-row">
        <div>{labelTurul(turul)}</div>
        <div className="ml-auto">{formatNumber((data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0))}</div>
      </div>
      {turul === "ashiglakh" && (
        <DatePicker.MonthPicker locale={locale} value={ognoo} onChange={setOgnoo} />
      )}
      <InputNumber
        value={dun}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        placeholder="Дүн"
        style={{ width: "100%" }}
        onChange={setDun}
        onDoubleClick={()=>setDun((data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0))}
      />
      {(turul === "ashiglakh") && (
        <Input.TextArea
          placeholder="Тайлбар"
          value={tailbar}
          onChange={(e) => setTailbar(e.target.value)}
        />
      )}
    </div>
  );
}

export default React.forwardRef(BaritsaaUdirdlaga);
