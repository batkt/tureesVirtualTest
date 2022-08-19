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
import React, { useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";

const AnketIlgeekh = ({ data, token, barilgiinId }, ref) => {
  const [songogdsonAnket, setSongogdsonAnket] = useState();
  const [utasniiDugaar, setUtasniiDugaar] = useState();
  const [email, setEmail] = useState();
  const [value, setValue] = useState(1);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  function ilgeeye() {
    if (
      value === 2 &&
      utasniiDugaar !== undefined &&
      songogdsonAnket !== undefined
    ) {
      if (utasniiDugaar.length < 8) {
        notification.warning({ message: "Утасны дугаараа бүрэн оруулна уу!" });
        return;
      }
      uilchilgee(token)
        .post(`/msgIlgeeye`, {
          barilgiinId,
          msgnuud: [
            {
              to: utasniiDugaar,
              text: `Ta daraakh kholboosoor orj anket bogolnuu: https://turees.zevtabs.mn/khyanalt/anket/${songogdsonAnket}`,
            },
          ],
        })
        .then(({ data }) => {
          if (data && data[0].Result === "SUCCESS") {
            notification.success({ message: "SMS Амжилттай илгээлээ" });
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else if (
      value === 1 &&
      email !== undefined &&
      songogdsonAnket !== undefined
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
          mailuud: [
            {
              mail: email,
              subject: "test",
              content: `Ta daraakh kholboosoor orj anket bogolnuu: <a href="https://turees.zevtabs.mn/khyanalt/anket/${songogdsonAnket}">https://turees.zevtabs.mn/khyanalt/anket/${songogdsonAnket}</a>`,
            },
          ],
        })
        .then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({ message: "И-мэйл Амжилттай илгээлээ" });
          }
        })
        .catch((e) => {
          aldaaBarigch(e);
        });
    } else notification.warning({ message: "мэдээллээ бүрэн оруулна уу!" });
  }
  function onchangeDugaar(e) {
    setUtasniiDugaar(e.target.value);
  }
  console.log();

  return (
    <div>
      <div className="flex w-full gap-5 py-3 ">
        <div>Илгээх төрөл:</div>
        <div>
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>И-мэйл</Radio>

            <Radio value={2}>Утас</Radio>
          </Radio.Group>
        </div>
      </div>
      <div className="flex w-full flex-col gap-1 py-3 ">
        <div>Анкетын загвар сонгох:</div>
        <Select
          className="w-full"
          placeholder="Анкетын загвар сонгох"
          onChange={setSongogdsonAnket}
          options={data.map((mur) => {
            return { label: mur.ner, value: mur._id };
          })}
        ></Select>
      </div>
      {value === 2 ? (
        <div className="flex w-full flex-col gap-1 py-3">
          <div>Анкет илгээх утасны дугаар:</div>
          <Input
            minlength="8"
            required
            placeholder="утасны дугаар оруулна уу"
            type={"number"}
            onChange={onchangeDugaar}
          />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-1 py-3">
          <div>Анкет илгээх И-мэйл:</div>
          <Input
            value={email}
            type="url"
            placeholder="И-мэйл оруулна уу"
            onChange={(v) => setEmail(v.target.value)}
          />
        </div>
      )}

      <div className="flex w-full gap-1 py-3">
        <Button
          style={{ backgroundColor: "#209669", color: "#ffffff" }}
          icon={<SendOutlined />}
          onClick={ilgeeye}
        >
          Анкет илгээх
        </Button>
      </div>
    </div>
  );
};

export default React.forwardRef(AnketIlgeekh);
