import React, { useCallback, useEffect } from "react";
import { Form, Input, Select } from "antd";
import createMethod from "tools/function/crud/createMethod";
import { aldaaBarigch } from "services/uilchilgee";
import _ from "lodash";
import compareFields from "tools/function/compareFields";
import dynamic from "next/dynamic";
import { formatting } from "./ZaaltZasvar";
import { t } from "i18next";
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const talbaruud = [
  { ner: t("Овог"), talbar: "ovog" },
  { ner: t("Нэр"), talbar: "ner" },
  { ner: t("Байгууллага нэр"), talbar: "baiguullagiinNer" },
  { ner: t("Гэрээний дугаар"), talbar: "gereeniiDugaar" },
  { ner: t("Гэрээний огноо"), talbar: "gereeniiOgnoo" },
  { ner: t("Төрөл"), talbar: "turul" },
  { ner: t("Регистр"), talbar: "register" },
  { ner: t("Албан тушаал"), talbar: "albanTushaal" },
  { ner: t("Захиралын овог"), talbar: "zakhirliinOvog" },
  { ner: t("Захиралын нэр"), talbar: "zakhirliinNer" },
  { ner: t("Утас"), talbar: "utas" },
  { ner: t("Хаяг"), talbar: "khayag" },
  { ner: t("Хугацаа"), talbar: "khugatsaa" },
  { ner: t("Төлөлт хийгдэх огноо"), talbar: "tulukhUdur" },
  { ner: t("Хөнгөлөх хугацаа"), talbar: "khungulukhKhugatsaa" },
  { ner: t("Сарын түрээс"), talbar: "sariinTurees" },
  { ner: t("Эхлэх он"), talbar: "ekhlekhOn" },
  { ner: t("Эхлэх сар"), talbar: "ekhelkhSar" },
  { ner: t("Эхлэх өдөр"), talbar: "ekhlekhUdur" },
  { ner: t("Дуусах он"), talbar: "duusakhOn" },
  { ner: t("Дуусах сар"), talbar: "duusakhSar" },
  { ner: t("Дуусах өдөр"), talbar: "duusakhUdur" },
  { ner: t("Талбайн дугаар"), talbar: "talbainDugaar" },
  { ner: t("Талбайн нэгж үнэ"), talbar: "talbainNegjUne" },
  { ner: t("Талбайн нийт үнэ"), talbar: "talbainNiitUne" },
  { ner: t("Талбайн хэмжээ"), talbar: "talbainKhemjee" },
  { ner: t("Түрээсийн талбайн давхар"), talbar: "davkhar" },
  { ner: t("Барьцаа авах дүн"), talbar: "baritsaaAvakhDun" },
  {
    ner: t("Барьцаа байршуулах хугацаа"),
    talbar: "baritsaaBairshuulakhKhugatsaa",
  },
];

export var customPlugin = ({
  name = "custom_example",
  title = t("Талбарийн нэр"),
  button = "T",
  songokhTalbaruud = talbaruud,
}) => ({
  // @Required @Unique
  name: name,
  // @Required
  display: "container" || "command" || "submenu" || "dialog",

  // @options
  // * You can also set from the button list
  // HTML title attribute (tooltip) - default: plugin's name
  title: title,
  // HTML to be append to button (icon)
  // Recommend using the inline svg icon. - default: "<span class="se-icon-text">!</span>"

  innerHTML: `<span style="padding:5px;">${button}</span>`,
  // The class of the button. - default: "se-btn"
  // "se-code-view-enabled": It is not disable when on code view mode.
  // "se-resizing-enabled": It is not disable when on using resizing module.
  buttonClass: "",

  // @Required
  add: function (core, targetElement) {
    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu.call(core);

    // You must bind "core" object when registering an event.
    /** add event listeners */
    var self = this;
    listDiv.querySelectorAll(".se-btn-list").forEach(function (btn) {
      btn.addEventListener("click", self.onClick.bind(core));
    });

    // @Required
    // You must add the "submenu" element using the "core.initMenuTarget" method.
    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);
  },

  setSubmenu: function () {
    const listDiv = this.util.createElement("DIV");
    // @Required
    // A "se-submenu" class is required for the top level element.
    listDiv.className = "se-submenu se-list-layer";
    listDiv.innerHTML =
      '<div class="se-list-inner se-list-font-size"><ul class="se-list-basic">' +
      songokhTalbaruud
        .map(
          (a) =>
            `<li><button type="button" class="se-btn-list" value="&lt;${a.talbar}&gt;">{${a.ner}}</button></li>`
        )
        .join("") +
      "</ul></div>";

    return listDiv;
  },
  onClick: function (e) {
    const value = e.target.value;
    const node = this.util.createElement("span");
    this.util.addClass(node, "se-custom-tag");
    node.textContent = value;

    this.insertNode(node);
    const zeroWidthSpace = this.util.createTextNode(this.util.zeroWidthSpace);
    node.parentNode.insertBefore(zeroWidthSpace, node.nextSibling);
    this.submenuOff();
  },
});

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

function index({ token, baiguullaga, destroy }, ref) {
  const editorRef = React.useRef();
  const plugins = React.useMemo(
    () => require("suneditor/src/plugins")?.default || {},
    []
  );
  const [form] = Form.useForm();
  const [zaalt, setZaalt] = React.useState("");

  function garya() {
    const values = form.getFieldsValue();
    if (compareFields(values, {}, ["kharagdakhDugaar"]))
      Modal.confirm({
        content: t("Та хадгалахгүй гарахдаа итгэлтэй байна уу?"),
        okText: t("Тийм"),
        cancelText: t("Үгүй"),
        onOk: destroy,
      });
    else destroy();
  }

  useEffect(() => {
    function keyUp(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        garya();
      }
    }
    form.getFieldInstance("kharagdakhDugaar").focus();
    document.addEventListener("keyup", keyUp);
    return () => document.removeEventListener("keyup", keyUp);
  }, []);

  const onFinish = (values) => {
    if (zaalt === "") return;
    values["zaalt"] = zaalt;
    values["baiguullagiinNer"] = baiguullaga.ner;
    values["baiguullagiinId"] = baiguullaga._id;
    createMethod("gereeniiZaalt", token, values)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          form.resetFields();
          destroy();
        }
      })
      .catch(aldaaBarigch);
  };

  const focuser = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      switch (e.target.id) {
        case "kharagdakhDugaar":
          form.getFieldInstance("khamaarakhKheseg").focus();
          break;
        default:
          break;
      }
    }
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        onFinish(form.getFieldsValue());
      },
      khaaya() {
        destroy();
      },
    }),
    [form, zaalt]
  );

  const plugin = React.useMemo(
    () => customPlugin({ songokhTalbaruud: talbaruud }),
    []
  );

  return (
    <Form form={form} {...formItemLayout}>
      <Form.Item label={t("Харагдах дугаар")} name="kharagdakhDugaar">
        <Input onKeyUp={focuser} />
      </Form.Item>
      <Form.Item label={t("Хамаарагдах хэсэг")} name="khamaarakhKheseg">
        <Select>
          {[
            "Ерөнхий мэдээлэл",
            "Гэрээний хугацаа",
            "Түрээсийн талбай",
            "Барьцаа бүртгэл",
            "Төлбөр тооцоо",
          ].map((a) => (
            <Select.Option value={a}>{t(a)}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <SunEditor
        onChange={setZaalt}
        defaultValue={zaalt}
        setOptions={{
          plugins: { ...plugins, ...plugin },
          height: 200,
          buttonList: [...formatting],
        }}
        showToolbar={true}
        ref={editorRef}
      />
    </Form>
  );
}

export default React.forwardRef(index);
