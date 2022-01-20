import {
  Button,
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
import BaritsaaKhuulga from "./BaritsaaKhuulga"
import { OrderedListOutlined } from "@ant-design/icons"
import { modal } from "components/ant/Modal"

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

function BaritsaaUdirdlaga({ data, token, onFinish, destroy }, ref) {
  const khuulgaRef = React.useRef(null)
  const [dun, setDun] = useState(0);
  const [ognoo, setOgnoo] = useState(moment());
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
        if (!dun) {
          notification.warning({ message: "Та гэрээгээ сонгоно уу" });
          return;
        }

        if(turul === 'ashiglakh' && dun >  data?.baritsaaniiUldegdel){
          notification.warning({ message: "Барьцаа үлдэгдлээс их дүнгээр гүйлгээ хийж болохгүй!" });
          setDun(data?.baritsaaniiUldegdel)
          return;
        }

        if(turul === 'tululkh' && dun > ((data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0))){
          notification.warning({ message: "Барьцаа төлөх дүнгээс их дүнгээр гүйлгээ хийж болохгүй!" });
          setDun((data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0))
          return;
        }

        if(turul === 'ashiglakh' && !tailbar){
          notification.warning({ message: "Тайлбар оруулна уу!" });
          return;
        }

        const baritsaaniiGuilgee = {
          "gereeniiId": data?._id,
          ognoo,
          orlogo:0,
          zarlaga:0,
          tailbar 
        }
        if(turul === 'ashiglakh')
          baritsaaniiGuilgee['zarlaga'] = dun
        else baritsaaniiGuilgee['orlogo'] = dun

        uilchilgee(token)
          .post("/baritsaaniiGuilgeeKhiie", baritsaaniiGuilgee)
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
    [dun, turul, tailbar,ognoo]
  );

  function tuukhKharya() {
    const footer = [
      <Button onClick={() => khuulgaRef.current.khaaya()}>Хаах</Button>,
    ]
    modal({
      title: "Барьцаа төлбөрийн хуулга",
      width: "40vw",
      icon: <OrderedListOutlined />,
      content: (
        <BaritsaaKhuulga
          data={data}
          ref={khuulgaRef}
          token={token}
          onFinish={onFinish}
        />
      ),
      footer,
    })
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
        <div className="ml-auto">{formatNumber(turul === 'ashiglakh' ? data.baritsaaniiUldegdel : ((data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0)))}</div>
      </div>
      {turul === "ashiglakh" && (
        <DatePicker locale={locale} value={ognoo} onChange={setOgnoo} />
      )}
      <InputNumber
        value={dun}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
        placeholder="Дүн"
        style={{ width: "100%" }}
        onChange={setDun}
        onDoubleClick={()=>setDun(turul === 'ashiglakh' ? data.baritsaaniiUldegdel : ((data.baritsaaAvakhDun || 0) - (data.baritsaaniiUldegdel || 0)))}
      />
      <Input.TextArea
        placeholder="Тайлбар"
        value={tailbar}
        onChange={(e) => setTailbar(e.target.value)}
      />
      <div onClick={tuukhKharya}>
        <a>Барьцааны хуулга</a>
      </div>
    </div>
  );
}

export default React.forwardRef(BaritsaaUdirdlaga);
