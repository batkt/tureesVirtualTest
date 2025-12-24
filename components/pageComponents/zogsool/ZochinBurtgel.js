import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Form, Input, message, Modal, Select, InputNumber } from "antd";
import uilchilgee from "services/uilchilgee";
import compareFields from "tools/function/compareFields";
import { t } from "i18next";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";
import useZochin from "hooks/useZochin";
const order = { createdAt: -1 };

function ZochinBurtgel(
  {
    data,
    barilgiinId,
    token,
    destroy,
    onRefresh,
    zochinBurtgekhButtonId,
    baiguullagiinId,
    dotorGadnaTsagEsekh,
    ajiltan,
  },
  ref
) {
  const [form] = Form.useForm();
  const [geree, setGeree] = useState(null);
  const [turulShalgah, setTurulShalgah] = useState(
    data?.zochinTurul ? data?.zochinTurul : undefined
  );
  const [isLoadingSequence, setIsLoadingSequence] = useState(false);

  const query = React.useMemo(() => {
    return { tuluv: { $nin: [-1] }, barilgiinId };
  }, [barilgiinId]);

  const { gereeniiMedeelel, setGereeniiKhuudaslalt } = useGereeniiJagsaalt(
    token,
    baiguullagiinId,
    undefined,
    query,
    undefined,
    undefined,
    order
  );

  const {
    zochinHadgalya,
    khariltsagchHadgalya,
    mashinHadgalya,
    isLoading: isZochinLoading,
    zochinMutate,
  } = useZochin(token, baiguullagiinId, 10, query, order);

  const dataOrjIrsenEsekh = !!data ? true : false;

  const getNextSequenceNumber = useCallback(async () => {
    if (!data?._id) {
      setIsLoadingSequence(true);
      try {
        const response = await uilchilgee(token).get("/khariltsagch", {
          params: {
            query: {
              baiguullagiinId,
              barilgiinId,
              register: { $regex: "^ЗЧ\\d{8}$" },
            },
            order: { register: -1 },
            khuudasniiKhemjee: 1,
          },
        });

        let sequence = 1;
        if (response?.data?.jagsaalt?.length > 0) {
          const lastRecord = response.data.jagsaalt[0];
          if (lastRecord.register && lastRecord.register.startsWith("ЗЧ")) {
            const currentSequence = parseInt(
              lastRecord.register.replace("ЗЧ", ""),
              10
            );
            sequence = currentSequence + 1;
          }
        }

        const generatedRegister = `ЗЧ${sequence.toString().padStart(8, "0")}`;

        form.setFieldsValue({
          register: generatedRegister,
          turul: "Иргэн",
        });
      } catch (error) {
        const generatedRegister = `ЗЧ00000001`;
        form.setFieldsValue({
          register: generatedRegister,
          turul: "Иргэн",
        });
      }
      setIsLoadingSequence(false);
    }
  }, [data, token, baiguullagiinId, barilgiinId, form]);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        form.submit();
      },
      khaaya() {
        destroy();
      },
    }),
    [form]
  );

  function garya() {
    const values = form.getFieldsValue();
    if (
      compareFields(values, data, [
        "zochinTurul",
        "utas",
        "mashiniiDugaar",
        "ner",
        "ovog",
        "zochinTailbar",
        "zochinErkhiinToo",
        "zochinNiitUneguiMinut",
        "zochinTusBurUneguiMinut",
        "davtamjiinTurul",
        "zochinUrikhEsekh",
        "register",
        "ezenToot",
      ])
    )
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  async function onFinish() {
    const formData = form.getFieldsValue();

    try {
      const processedData = {
        ...formData,
        barilgiinId,
        baiguullagiinId,
        turul: "Иргэн",
        idevkhiteiEsekh: true,
      };

      if (processedData.utas) {
        if (Array.isArray(processedData.utas)) {
          processedData.utas = processedData.utas.map((phone) =>
            phone.toString()
          );
        } else {
          processedData.utas = [processedData.utas.toString()];
        }
      }

      if (processedData.ezenToot) {
        processedData.ezenToot = String(processedData.ezenToot);
      }

      if (processedData.zochinErkhiinToo) {
        processedData.zochinErkhiinToo = parseInt(
          processedData.zochinErkhiinToo,
          10
        );
      }
      if (processedData.zochinNiitUneguiMinut) {
        processedData.zochinNiitUneguiMinut = parseInt(
          processedData.zochinNiitUneguiMinut,
          10
        );
      }
      if (processedData.zochinTusBurUneguiMinut) {
        processedData.zochinTusBurUneguiMinut = parseInt(
          processedData.zochinTusBurUneguiMinut,
          10
        );
      }

      if (processedData.zochinUrikhEsekh === undefined) {
        processedData.zochinUrikhEsekh = true;
      }

      if (!data?._id) {
        try {
          const response = await uilchilgee(token).get("/khariltsagch", {
            params: {
              query: {
                baiguullagiinId,
                barilgiinId,
                register: { $regex: "^ЗЧ\\d{8}$" },
              },
              order: { register: -1 },
              khuudasniiKhemjee: 1,
            },
          });

          let sequence = 1;
          if (response?.data?.jagsaalt?.length > 0) {
            const lastRecord = response.data.jagsaalt[0];
            if (lastRecord.register && lastRecord.register.startsWith("ЗЧ")) {
              const currentSequence = parseInt(
                lastRecord.register.replace("ЗЧ", ""),
                10
              );
              sequence = currentSequence + 1;
            }
          }

          processedData.register = `ЗЧ${sequence.toString().padStart(8, "0")}`;
        } catch (error) {
          const timestamp = Date.now().toString().slice(-6);
          processedData.register = `ЗЧ${timestamp.padStart(8, "0")}`;
        }
      }

      const khariltsagchMedeelel = {
        _id: data?._id,
        ner: processedData.ner,
        ovog: processedData.ovog,
        register: processedData.register,
        utas: processedData.utas,
        turul: processedData.turul,
        idevkhiteiEsekh: processedData.idevkhiteiEsekh,
        zochinTurul: processedData.zochinTurul,
        zochinTailbar: processedData.zochinTailbar,
        zochinErkhiinToo: processedData.zochinErkhiinToo,
        zochinNiitUneguiMinut: processedData.zochinNiitUneguiMinut,
        zochinTusBurUneguiMinut: processedData.zochinTusBurUneguiMinut,
        davtamjiinTurul: processedData.davtamjiinTurul,
        zochinUrikhEsekh: processedData.zochinUrikhEsekh,
        mashiniiDugaar: processedData.mashiniiDugaar,
        ezenToot: processedData.ezenToot,
        barilgiinId,
        baiguullagiinId,
      };

      let mashinMedeelel = null;
      if (processedData.mashiniiDugaar) {
        mashinMedeelel = {
          dugaar: processedData.mashiniiDugaar,
          ezemshigchiinNer: processedData.ner,
          ezemshigchiinRegister: processedData.register,
          ezemshigchiinUtas: Array.isArray(processedData.utas)
            ? processedData.utas[0]
            : processedData.utas,
          turul: processedData.zochinTurul,
          barilgiinId,
          baiguullagiinId,
        };
      }

      const ezemshigchiinUtas = Array.isArray(processedData.utas)
        ? processedData.utas[0]
        : processedData.utas;

      let result;

      if (processedData.mashiniiDugaar) {
        result = await zochinHadgalya({
          _id: data?._id,
          mashiniiDugaar: processedData.mashiniiDugaar,
          ezemshigchiinUtas,
          khariltsagchMedeelel,
          mashinMedeelel,
        });
      } else {
        result = await khariltsagchHadgalya(
          khariltsagchMedeelel,
          ezemshigchiinUtas
        );
      }

      if (result === "Amjilttai" || result?.success) {
        toast.success(t("Амжилттай хадгаллаа"));

        if (onRefresh) {
          onRefresh();
        }

        await zochinMutate();

        destroy();
      } else {
        throw new Error("Хадгалахад алдаа гарлаа");
      }

      if (
        ajiltan?.erkh === "Admin" ||
        ajiltan?.tokhirgoo?.zochinUrikhUneguiMinut
      ) {
        try {
          await uilchilgee(token).post(`/zochinHadgalya`, {});
          toast.success(
            t("Зогсоолд орсон машины мэдээлэл амжилттай өөрчлөгдсөн")
          );
        } catch (error) {
          console.error("Зогсоолын мэдээлэл шинэчлэхэд алдаа гарлаа:", error);
        }
      }
    } catch (error) {
      console.error("Хадгалахад алдаа гарлаа:", error);

      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error(t("Хадгалахад алдаа гарлаа"));
      }
    }
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    form.getFieldInstance("zochinTurul").focus();
    document.addEventListener("keyup", keyUp);

    getNextSequenceNumber();

    return () => document.removeEventListener("keyup", keyUp);
  }, [getNextSequenceNumber]);

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "utas":
          form.getFieldInstance("mashiniiDugaar").focus();
          break;
        case "mashiniiDugaar":
          form.getFieldInstance("ner").focus();
          break;
        case "ner":
          form.getFieldInstance("ovog").focus();
          break;
        case "ovog":
          form.getFieldInstance("zochinErkhiinToo").focus();
          break;
        case "zochinErkhiinToo":
          form.getFieldInstance("zochinNiitUneguiMinut").focus();
          break;
        case "zochinNiitUneguiMinut":
          form.getFieldInstance("zochinTusBurUneguiMinut").focus();
          break;
        case "zochinTusBurUneguiMinut":
          form.getFieldInstance("davtamjiinTurul").focus();
          break;
        case "davtamjiinTurul":
          form.getFieldInstance("zochinTailbar").focus();
          break;
        case "ezenToot":
          form.getFieldInstance("ezenToot").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  function gereeAvya({ target }) {
    if (target.value?.length > 7)
      uilchilgee(token)
        .post("/utasniiDugaaraarGereeAvya", { utas: target.value })
        .then(({ data }) => {
          if (!!data) setGeree({ ...data });
        });
  }

  // Show loading state when saving
  const isLoading = isLoadingSequence || isZochinLoading;

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{
        ...data,
        utas: data?.utas
          ? Array.isArray(data.utas)
            ? data.utas[0]
            : data.utas
          : undefined,
        zochinUrikhEsekh:
          data?.zochinUrikhEsekh !== undefined ? data.zochinUrikhEsekh : true,
      }}
      className="space-y-2"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item
        label={t("Зочны төрөл")}
        name="zochinTurul"
        requiredMark={"required"}
        rules={[
          {
            required: true,
            message: t("Зочны төрөл сонгоно уу!"),
          },
        ]}
      >
        <Select
          onChange={(e) => {
            form.getFieldInstance("utas").focus();
            setTurulShalgah(e);
          }}
          placeholder={t("Зочны төрөл")}
          disabled={isLoading}
        >
          {["Түрээслэгч", "Оршин суугч"].map((a) => (
            <Select.Option key={a} value={a}>
              {t(a === "Түрээслэгч" ? "Түрээслэгч" : "Оршин суугч")}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        requiredMark={"required"}
        normalize={(input) => {
          const too = input.replace(/[^0-9]+/g, "").slice(0, 8);
          return too;
        }}
        rules={[
          {
            required: true,
            message: t("Утасны дугаар бүртгэнэ үү!"),
          },
          {
            required: true,
            len: 8,
            validator: async (_, names) => {
              if (names?.length < 8 && names?.length > 0) {
                return Promise.reject(
                  new Error("Утасны дугаар аа шалгана уу!")
                );
              }
            },
          },
        ]}
        label={t("Утас")}
        name="utas"
      >
        <Input
          maxLength={8}
          onKeyUp={focuser}
          placeholder={t("Утас")}
          onChange={gereeAvya}
          disabled={isLoading}
          requiredMark={"required"}
        />
      </Form.Item>

      <Form.Item
        normalize={(input) => {
          if (!input) return input;
          const too = input.replace(/[^0-9]/g, "").slice(0, 4);
          const useg = Array.from(input)
            .filter((a) => /[А-Яа-яөӨүҮ]/.test(a))
            .slice(0, 3)
            .join("");
          return `${too}${useg}`.toUpperCase();
        }}
        rules={[
          {
            required: false,
            min: 6,
            max: 7,
            pattern: new RegExp(
              "[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{3}|[0-9]{4}[А-Я|а-я|ө|Ө|ү|Ү]{2}"
            ),
            message: t("Машины дугаар 4 тоо 2 эсвэл 3 үсэг байх ёстой"),
          },
        ]}
        label={t("Машины дугаар")}
        name="mashiniiDugaar"
      >
        <Input
          onKeyUp={focuser}
          placeholder={t("Машины дугаар (сонголттой)")}
          disabled={isLoading}
          style={{ marginBottom: 8 }}
        />
        {/* <Input
          onKeyUp={focuser}
          placeholder={t("Машины дугаар (сонголттой)")}
          disabled={isLoading}
        /> */}
      </Form.Item>

      <Form.Item label={t("Овог")} name="ovog">
        <Input
          onKeyUp={focuser}
          placeholder={t("Овог (сонголттой)")}
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item
        requiredMark={"required"}
        rules={[
          {
            required: true,
            message: t("Нэр бүртгэнэ үү!"),
          },
        ]}
        label={t("Нэр")}
        name="ner"
      >
        <Input onKeyUp={focuser} placeholder={t("Нэр")} disabled={isLoading} />
      </Form.Item>

      <Form.Item
        label={t("Давтамжийн хугацаа")}
        name="davtamjiinTurul"
        requiredMark={"required"}
        rules={[
          {
            required: true,
            message: t("Давтамжийн хугацаа сонгоно уу!"),
          },
        ]}
      >
        <Select placeholder={t("Давтамжийн хугацаа")} disabled={isLoading}>
          <Select.Option key={"dolooKhonogoor"} value={"dolooKhonogoor"}>
            {t("7 хоногоор")}
          </Select.Option>
          <Select.Option key={"saraar"} value={"saraar"}>
            {" "}
            {t("Сараар")}
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        requiredMark={"required"}
        rules={[
          {
            required: true,
            message: t("Эрхийн тоо бүртгэнэ үү!"),
          },
        ]}
        label={t("Эрхийн тоо")}
        name="zochinErkhiinToo"
      >
        <InputNumber
          min={1}
          style={{ width: "100%" }}
          onKeyUp={focuser}
          placeholder={t("Эрхийн тоо")}
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item
        requiredMark={"required"}
        rules={[
          {
            required: true,
            message: t("Үнэгүй минут нэмнэ үү!"),
          },
        ]}
        label={t("Үнэгүй минут")}
        name="zochinTusBurUneguiMinut"
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          onKeyUp={focuser}
          placeholder={t("Үнэгүй минут")}
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item
        requiredMark={"required"}
        rules={[
          {
            required: true,
            message: t("Оршин суугчийн тоот оруулна уу!"),
          },
        ]}
        label={t("Тоот")}
        name="ezenToot"
      >
        <InputNumber
          min={0}
          style={{ width: "100%" }}
          onKeyUp={focuser}
          placeholder={t("Тоот")}
          disabled={isLoading}
        />
      </Form.Item>

      <Form.Item label={t("Тайлбар")} name="zochinTailbar">
        <Input.TextArea
          rows={3}
          onKeyUp={focuser}
          placeholder={t("Тайлбар (сонголттой)")}
          disabled={isLoading}
        />
      </Form.Item>

      {isLoading && (
        <div className="text-center text-black dark:text-white">
          <span>{t("Хадгалж байна...")}</span>
        </div>
      )}
    </Form>
  );
}

export default React.forwardRef(ZochinBurtgel);
