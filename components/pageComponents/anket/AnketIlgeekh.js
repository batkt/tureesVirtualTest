import { SendOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Select,
} from "antd";
import FormLavlakh from "components/FormLavlakh";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

const AnketIlgeekh = ({ data, token, barilgiinId, baiguullaga, destroy }, ref) => {
  const { t } = useTranslation()
  const [utasniiDugaar, setUtasniiDugaar] = useState();
  const [email, setEmail] = useState();
  const [value, setValue] = useState(1);
  React.useImperativeHandle(
    ref,
    () => ({
      ilgeekh(){
        if (
          value === 2 &&
          utasniiDugaar !== undefined
        ) {
          if (utasniiDugaar.length < 8) {
            notification.warning({ message: "Утасны дугаараа бүрэн оруулна уу!" });
            return;
          }
          uilchilgee(token)
            .post(`/msgIlgeeye`, {
              barilgiinId,
              baiguullagiinId: baiguullaga?._id,
              msgnuud: [
                {
                  to: utasniiDugaar,
                  text: `Ta daraakh kholboosoor orj anket bogolnuu: https://turees.zevtabs.mn/khyanalt/anket/${baiguullaga?._id
                    }/${data._id}`,
                },
              ],
            })
            .then(({ data }) => {
              if (data && data[0].Result === "SUCCESS") {
                notification.success({ message: t("SMS Амжилттай илгээлээ") });
                setEmail("");
                setUtasniiDugaar("");
                destroy();
              }
            })
            .catch((e) => {
              aldaaBarigch(e);
            });
        } else if (
          value === 1 &&
          email !== undefined
        ) {
          var filter =
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
          if (!filter.test(email)) {
            notification.warning({
              message: "email хаягаа шалгаад дахин оролдоно уу!",
            });
            return;
          }
          uilchilgee(token)
            .post(`/mailOlnoorIlgeeye`, {
              baiguullagiinId: baiguullaga._id,
              mailuud: [
                {
                  mail: email,
                  subject: "Анкет",
                  content: `Та <a style="text-decoration: underline; font-size:20px" href="https://turees.zevtabs.mn/khyanalt/anket/${baiguullaga?._id}/${data._id}">энд</a> дарж анкет илгээнэ үү.`,
                },
              ],
            })
            .then(({ data }) => {
              if (data === "Amjilttai") {
                notification.success({ message: t("И-мэйл Амжилттай илгээлээ") });
                setEmail("");
                setUtasniiDugaar("");
                destroy();
              }
            })
            .catch((e) => {
              aldaaBarigch(e);
            });
        } else notification.warning({ message: t("мэдээллээ бүрэн оруулна уу!") });
      },
      khaaya() {
        destroy();
      },
    }),
    [value, utasniiDugaar, baiguullaga, data, email]
  );
  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        destroy();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);


  function onchangeDugaar(e) {
    setUtasniiDugaar(e.target.value);
  }

  useEffect(() => {
    document.getElementById("zagvarSongokhInput").focus();
  }, []);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "input1":
          document.getElementById("anketIlgeekhButton").focus();
          break;
        case "input2":
          document.getElementById("anketIlgeekhButton").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  return (
    <div>
      <div className="flex w-full gap-5 py-3 ">
        <div>{t("Илгээх төрөл")}:</div>
        <div>
          <Radio.Group onChange={(v)=> setValue(v.target.value)} value={value}>
            <Radio value={1}>{t("И-мэйл")}</Radio>

            <Radio value={2}>{t("Утас")}</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1 py-3 ">
        <div>{t("Анкетын загвар сонгох")}:</div>
        <Select
          id="zagvarSongokhInput"
          className="w-full"
          placeholder="Анкетын загвар сонгoно уу"
          disabled={true}
          value={data._id}
        options={[{ label: data.ner, value: data._id }]}
        ></Select>
      </div>
      {value === 2 ? (
        <div className="flex w-full flex-col gap-1 py-3">
          <div>{t("Анкет илгээх утасны дугаар")}:</div>
          <Input
            id="input2"
            value={utasniiDugaar}
            minlength="8"
            required
            placeholder="Утасны дугаар оруулна уу"
            type={"number"}
            onChange={onchangeDugaar}
            onKeyUp={focuser}
          />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1 py-3">
          <div>{t("Анкет илгээх И-мэйл")}:</div>
          <Input
            id="input1"
            value={email}
            type="url"
            placeholder="И-мэйл оруулна уу"
            onChange={(v) => setEmail(v.target.value)}
            onKeyUp={focuser}
          />
        </div>
      )}
    </div>
  );
};

export default React.forwardRef(AnketIlgeekh);
