import React from "react";
import _ from "lodash";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { Select } from "antd";

function ajiltanNemekh(
  { token, destroy, onChange, baiguullaga, setDaalgavar },
  ref
) {
  const { ajilchdiinGaralt } = useAjiltniiJagsaalt(token, baiguullaga?._id);

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      khadgalya() {
        destroy();
      },
    }),
    []
  );

  return (
    <Select placeholder="Ажилтан" style={{ width: "100%" }}>
      {ajilchdiinGaralt?.jagsaalt?.map((mur) => (
        <Select.Option key={`${mur._id}ajiltan`} value={mur._id}>
          <div
            className="flex flex-row justify-between"
            onClick={() =>
              setDaalgavar((v) => ({
                ...v,
                ["ajiltniiId"]: mur._id,
                ["ajiltniiNer"]: mur.ner,
              }))
            }
          >
            <span>
              {mur.ovog[0]}.{mur.ner}
            </span>
            <span>{mur.register}</span>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

export default React.forwardRef(ajiltanNemekh);
