import { Form, InputNumber, notification } from "antd";
import React, { useEffect, useImperativeHandle, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { tulburBodoy } from "tools/function/tulburBodyo";

function KhungulultTsonkh(
  {
    token,
    uilchluulegchiinId,
    data,
    destroy,
    songogdsonZogsool,
    mutate,
    baiguullaga,
    barilgiinId,
    ajiltan,
  },
  ref
) {
  const [dunOruuljBuiEsekh, setDunOruuljBuiEsekh] = useState("");
  const [form] = Form.useForm();
  useImperativeHandle(
    ref,
    () => ({
      async khadgalya() {
        form.submit();
      },
      khaaya() {
        destroy();
      },
    }),
    [token, uilchluulegchiinId]
  );

  function garya() {
    destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  async function khadgalakh(v) {
    const garaasDunOruulsan = v.garaasOruulsanDun;
    const zuruuMinut = v.garaasOruulsanMinut;
    {
      if (!garaasDunOruulsan && !zuruuMinut) {
        return notification.warn({
          message: "Хөнгөлөлт оруулна уу",
          duration: 2,
        });
      }
      const odoo = new Date();
      var bodsonTulbur = 0;
      if (!garaasDunOruulsan) {
        bodsonTulbur = await tulburBodoy(
          songogdsonZogsool?.tulburuud,
          odoo.getTime(),
          new Date(data?.tuukh[0].tsagiinTuukh[0].orsonTsag).getTime(),
          songogdsonZogsool?.undsenUne,
          songogdsonZogsool?.undsenMin,
          0,
          zuruuMinut
        );
      } else {
        bodsonTulbur = garaasDunOruulsan;
      }
      const yavuulakhTulbur = {
        ognoo: new Date(),
        turul: "khungulult",
        dun: bodsonTulbur,
        baiguullagiinId: baiguullaga?._id,
        barilgiinId: barilgiinId,
        burtgesenAjiltaniiId: ajiltan._id,
        burtgesenAjiltaniiNer: ajiltan.ner,
        zogsooliinId: songogdsonZogsool?._id,
      };
      await uilchilgee(token)
        .post("/zogsooliinTulburTulye", {
          tulbur: [yavuulakhTulbur],
          id: uilchluulegchiinId,
          urdchilsan: true,
        })
        .then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({
              message: "Амжилттай хөнгөллөө",
              duration: 2,
            });
          }
          mutate();
          destroy();
        })
        .catch((err) => aldaaBarigch(err));
    }
  }

  function handleChange(turul, val) {
    if (val > 0) {
      if (turul === "min") {
        setDunOruuljBuiEsekh("ugui");
        form.setFieldValue("garaasDunOruulsan", null);
      }
      if (turul === "dun") {
        setDunOruuljBuiEsekh("tiim");
        form.setFieldValue("garaasOruulsanMinut", null);
      }
    } else {
      setDunOruuljBuiEsekh("");
    }
  }

  return (
    <Form
      onFinish={khadgalakh}
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 12 }}
    >
      <Form.Item name={"garaasOruulsanDun"} label={"Хөнгөлөх дүн"}>
        <InputNumber
          min={0}
          onChange={(v) => handleChange("dun", v)}
          disabled={dunOruuljBuiEsekh === "ugui"}
          className="!w-full"
        />
      </Form.Item>
      <Form.Item name={"garaasOruulsanMinut"} label={"Хөнгөлөх минут"}>
        <InputNumber
          min={0}
          onChange={(v) => handleChange("min", v)}
          disabled={dunOruuljBuiEsekh === "tiim"}
          className="!w-full"
        />
      </Form.Item>
    </Form>
  );
}

export default React.forwardRef(KhungulultTsonkh);
