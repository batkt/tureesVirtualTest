import { Form, Select } from "antd";
import React from "react";

const AnketIlgeekh = (data, ref) => {
  return (
    <div>
      <div>
        <Form.Item>
          <Select
            placeholder="Анкетын загвар сонгох"
            options={data.data.map((mur, i) => {
              return { label: mur.ner, value: mur._id };
            })}
          ></Select>
        </Form.Item>
      </div>
    </div>
  );
};

export default React.forwardRef(AnketIlgeekh);
