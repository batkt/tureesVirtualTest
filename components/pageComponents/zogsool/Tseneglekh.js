import React, { useEffect, useImperativeHandle, useState } from "react";
import { Form, InputNumber, Table, Tabs, notification } from "antd";
import { t } from "i18next";
import uilchilgee from "services/uilchilgee";
import moment from "moment";
import formatNumber from "tools/function/formatNumber";

function Tseneglekh({ data, destroy, token, barilgiinId, mutate }, ref) {
  const [form] = Form.useForm();
  const [activeKhuudas, setActiveKhuudas] = useState(1);

  useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        if (activeKhuudas === 2) {
          setActiveKhuudas(1);
        } else {
          form.submit();
        }
      },
      khaaya() {
        destroy();
      },
    }),
    [form, activeKhuudas]
  );

  function khadgalya(formData) {
    const yavuulakhData = {
      barilgiinId: barilgiinId,
      mashiniiId: formData._id,
      dun: formData.dun,
    };
    if (yavuulakhData.mashiniiId && yavuulakhData.dun) {
      uilchilgee(token)
        .post("/tsenegleltKhiiy", yavuulakhData)
        .then(({ data }) => {
          if (data === "Amjilttai") {
            notification.success({
              message: "Амжилттай хадгалагдлаа",
              duration: 2,
            });
            mutate();
            destroy();
          }
        });
    } else {
      return notification.warn({ message: "Талбар дутуу байна", duration: 2 });
    }
  }

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

  function turulUurchilyu(turul) {
    switch (turul) {
      case "orlogo":
        return "Орлого";
      case "zarlaga":
        return "Зарлага";
      default:
        return turul;
    }
  }
  const khuudsuud = [
    {
      key: 1,
      label: "Цэнэглэх",
      children: (
        <Form
          form={form}
          onFinish={khadgalya}
          initialValues={data}
          className="space-y-2"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item hidden name={"_id"} />
          <Form.Item
            rules={[
              {
                required: true,
                message: "Цэнэглэх дүн оруулна уу",
              },
            ]}
            name={"dun"}
            label={"Цэнэглэх дүн:"}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              min={0}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder={t("Цэнэглэх дүн оруулна уу...")}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 2,
      label: "Түүх",
      children: (
        <Table
          tableLayout="fixed"
          columns={[
            {
              title: "№",
              key: "index",
              align: "center",
              className: "text-center",
              width: "3rem",
              render: (a, b, index) => {
                return index + 1;
              },
            },
            {
              title: t("Огноо"),
              dataIndex: "ognoo",
              ellipsis: true,
              width: "9rem",
              align: "center",
              render(ognoo) {
                return moment(ognoo).format("YYYY-MM-DD HH:mm");
              },
            },
            {
              title: t("Төрөл"),
              dataIndex: "turul",
              ellipsis: true,
              align: "center",
              render(turul) {
                return turulUurchilyu(turul);
              },
            },
            {
              title: [t("Дүн"), "(₮)"],
              dataIndex: "dun",
              ellipsis: true,
              align: "center",
              showSorterTooltip: false,
              render(dun) {
                return formatNumber(dun || 0, 0) + "₮";
              },
            },
            {
              title: t("Үлдэгдэл"),
              dataIndex: "uldegdel",
              ellipsis: true,
              align: "center",
              showSorterTooltip: false,
              render(uldegdel) {
                return formatNumber(uldegdel || 0, 0) + "₮";
              },
            },
          ]}
          dataSource={data?.tsenegleltTuukh || []}
          pagination={false}
        />
      ),
    },
  ];

  return (
    <Tabs
      activeKey={activeKhuudas}
      items={khuudsuud}
      onChange={(v) => setActiveKhuudas(v)}
    />
  );
}

export default React.forwardRef(Tseneglekh);
