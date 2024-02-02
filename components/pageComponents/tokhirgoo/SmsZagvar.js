import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Form,
  Select,
  Input,
  Button,
  notification,
  InputNumber,
  Divider,
  TimePicker,
  Switch,
} from "antd";
import {
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import createMethod from "tools/function/crud/createMethod";
import updateMethod from "tools/function/crud/updateMethod";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useTranslation } from "react-i18next";
import axios from "axios";
import moment from "moment";
import StreamTokhirgoo from "./StreamTokhirgoo";
import { modal } from "components/ant/Modal";

function SmsZagvar(
  {
    data,
    jagsaalt,
    barilgiinId,
    destroy,
    token,
    baiguullagaMutate,
    baiguullaga,
  },
  ref
) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

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

  useImperativeHandle(
    ref,
    () => ({
      async khadgalya() {
        try {
          let tokhirgoo = form.getFieldsValue();
          // body.barilgiinId = barilgiinId;
          const response = await uilchilgee(token).post(
            "/baiguullagaTokhirgooZasya",
            {
              tokhirgoo,
            }
          );

          if (response.data === "Amjilttai") {
            baiguullagaMutate();
            notification.success({ message: t("Амжилттай хадгаллаа") });
            destroy();
          }
        } catch (e) {
          aldaaBarigch(e);
        }
      },

      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  return (
    <Form
      initialValues={{
        zogsoolMsgZagvar: baiguullaga?.tokhirgoo?.zogsoolMsgZagvar,
      }}
      form={form}
      autoComplete="off">
      <Form.Item name="zogsoolMsgZagvar">
        <Input.TextArea placeholder="Загвар" />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(SmsZagvar);
