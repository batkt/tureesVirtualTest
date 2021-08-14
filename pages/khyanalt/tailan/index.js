import {
  Button,
  Input,
  message,
  Select,
  Table,
  Space,
  DatePicker,
  Divider,
  Upload,
  Form,
  Popconfirm,
  Popover,
  Empty,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  SolutionOutlined,
  MailOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import shalgaltKhiikh from "../../../services/shalgaltKhiikh";

import Admin from "../../../components/Admin";
import uilchilgee, { aldaaBarigch, url } from "../../../services/uilchilgee";
import { useAuth } from "../../../services/auth";
import React, { useState, useRef } from "react";
import moment from "moment";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import getBase64 from "tools/function/getBase64";

const iconColor = { fontSize: "18px" };

function AjiltanBurtgel({ token }) {
  const formRef = useRef();
  const zurag = useRef();
  const empty = useRef();

  const { ajiltan, baiguullaga } = useAuth();
  const { ajilchdiinGaralt, setAjiltniiKhuudaslalt, ajiltniiJagsaaltMutate } =
    useAjiltniiJagsaalt(token, baiguullaga?._id);

  const [ajiltanState, setAjiltanState] = useState({
    ner: undefined,
    ovog: undefined,
    register: undefined,
    khayag: undefined,
    utas: undefined,
    albanTushaal: undefined,
    baiguullagiinId: ajiltan?.baiguullagiinId,
  });

  const { Option } = Select;

  function onChange(talbar, utga) {
    setAjiltanState((a) => ({ ...a, [talbar]: utga }));
  }
  function ajiltanBurtgekh() {
    if (ajiltanState.nuutsUg && ajiltanState.nuutsUg.length < 2) {
      message.warning("Нууц үг буруу оруулсан байна.");
      return;
    }

    var form_data = new FormData();
    ajiltanState.baiguullagiinId = ajiltan?.baiguullagiinId;
    switch (ajiltanState.albanTushaal) {
      case "Админ":
        ajiltanState.erkh = "Admin";
        break;
      case "Зохион байгуулагч":
        ajiltanState.erkh = "ZokhionBaiguulagch";
        break;
      case "Санхүү":
        ajiltanState.erkh = "Sankhuu";
        break;
      default:
        break;
    }
    for (var key in ajiltanState) {
      form_data.append(key, ajiltanState[key]);
    }
    uilchilgee(token)
      .post("/ajiltan", form_data)
      .then(({ data }) => {
        if (data !== undefined) {
          message.success("Бүртгэл амжилттай хийгдлээ");
          formRef.current.resetFields();
          ajiltniiJagsaaltMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
        }
      })
      .catch(aldaaBarigch);
  }

  function zasya(data) {
    data.zasakhEsekh = true;
    if (!!data.zurgiinNer) {
      zurag.current.src = `${url}/ajiltniiZuragAvya/${data.baiguullagiinId}/${data.zurgiinNer}`;
      zurag.current.classList.remove("hidden");
      empty.current.classList.add("hidden");
    }
    data.ajildOrsonOgnoo = moment(data.ajildOrsonOgnoo);
    formRef.current.setFieldsValue({ ...data });
    setAjiltanState(data);
  }

  function ajiltanUstgay(mur) {
    if (ajiltan._id === mur._id) {
      message.warning("Та өөрийгөө устгаж болохгүй!");
      return;
    }
    uilchilgee(token)
      .post("/ajiltanUstgay", { id: mur._id })
      .then(({ data }) => {
        if (data === "Amjilttai") {
          ajiltniiJagsaaltMutate((s) => ({ ...s, jagsaalt: s.jagsaalt }), true);
          message.success("Устгагдлаа");
        }
      });
  }

  const props = {
    listType: "picture",
    showUploadList: false,
    className: "avatar-uploader",
    name: "avatar",
    multiple: false,
    beforeUpload: (file) => {
      getBase64(file, (img) => (zurag.current.src = img));
      zurag.current.classList.remove("hidden");
      empty.current.classList.add("hidden");
      onChange("zurag", file);
      return false;
    },
  };

  function onFinish() {
    ajiltanBurtgekh();
  }
  function checkRegister() {
    var value1 = ajiltanState.register.substring(0, 2);
    var value2 = ajiltanState.register.substring(2, 10);
    var error = 0;
    for (var i = 0; i < 2; i++) {
      var c = value1.charCodeAt(i);
      if (c) {
        var alp = value1.charAt(i);
        if (
          c !== 32 &&
          c !== 45 &&
          c !== 46 &&
          (c < 65 || (c < 97 && c > 90) || c > 122) &&
          (c < 1024 || c > 1535)
        ) {
          value1 = value1.replace(alp, "");
          error++;
        }
      }
    }
    for (i = 0; i < 8; i++) {
      c = value2.charCodeAt(i);
      if (c) {
        alp = value2.charAt(i);
        if (c < 48 || c > 57) {
          value2 = value2.replace(alp, "");
          error++;
        }
      }
    }
    if (
      ajiltanState.register.length <= 2 ||
      ajiltanState.register.length > 10 ||
      error > 0
    ) {
      ajiltanState.register = value1.toUpperCase() + value2;
    }
    if (ajiltanState.register.length === 10) {
      var year = parseInt(ajiltanState.register.substring(2, 4));
      var month = parseInt(ajiltanState.register.substring(4, 6));
      month = month - 1;
      var day = parseInt(ajiltanState.register.substring(6, 8));
      var nowYear = new Date().getFullYear().toString().substring(2, 4);
      if (month > 32 || (12 < month && month < 21)) {
        message.warning("Регистерийн дугаарын сар буруу байна!");
        ajiltanState.register = "";
        return;
      } else if (year > nowYear && 21 <= month && month <= 32) {
        message.warning("Регистерийн дугаарын жил, сарын хослол буруу байна!");
        ajiltanState.register = "";
        return;
      }

      var jil = month <= 32 && month >= 21 ? 2000 + year : 1900 + year;
      var sar = month <= 32 && month >= 21 ? month - 20 : month;
      var shineDate = new Date(jil, sar, 1);
      var shine = new Date(shineDate - 1);
      var nowDay = shine.getDate();
      if (nowDay < day) {
        message.warning("Регистерийн дугаарын өдөр буруу байна!");
        return;
      }
    }
  }
  return (
    <Admin title="Тайлан" khuudasniiNer="tailan" className="p-0 md:p-4"></Admin>
  );
}

export const getServerSideProps = shalgaltKhiikh;

export default AjiltanBurtgel;
