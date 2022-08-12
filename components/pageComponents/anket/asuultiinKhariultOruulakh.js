import React, { useState } from "react";
import _ from "lodash";
import { Button, Form, Input, Select, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const areas = [
  { label: "Бөглөх", value: "boglokh" },
  { label: "Сонгох", value: "songokh" },
];

function asuultiinKhariultOruulakh(
  { token, destroy, onChange, baiguullaga, setDaalgavar },
  ref
) {
  React.useImperativeHandle(ref, () => ({
    khaaya() {
      destroy();
    },
    khadgalya() {
      destroy();
    },
  }));
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form:", values);
  };
  const [khariultNemekh, setKhariultNemekh] = useState("hidden");

  const handleChange = (value) => {
    if (value === "songokh") {
      setKhariultNemekh("");
    } else setKhariultNemekh("hidden");
  };
  const str = "a";

  return (
    <div className="flex w-full justify-center">
      <Form
        form={form}
        name="khariult-songokh"
        onFinish={onFinish}
        autoComplete="off"
        className="w-full"
      >
        <Form.Item
          name="area"
          label="Хариултын төрөл"
          rules={[{ required: true, message: "Missing area" }]}
        >
          <Select
            defaultValue="boglokh"
            options={areas}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.List name="sights">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space key={field.key} className="flex w-full" align="baseline">
                  <Form.Item
                    {...field}
                    label={String.fromCharCode(
                      str.charCodeAt(str.length - 1) + field.name
                    )}
                    name={[field.name, "price"]}
                    rules={[{ required: true, message: "Missing price" }]}
                  >
                    <Input className="w-96" />
                  </Form.Item>

                  <MinusCircleOutlined
                    className="dynamic-delete-button text-xl text-black text-opacity-50 dark:text-white dark:text-opacity-50"
                    onClick={() => remove(field.name)}
                  />
                </Space>
              ))}

              <Form.Item style={{ visibility: khariultNemekh }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Хариулт нэмэх
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
}

export default React.forwardRef(asuultiinKhariultOruulakh);
