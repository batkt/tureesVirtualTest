import React, { useState } from "react";
import _ from "lodash";
import { useAjiltniiJagsaalt } from "hooks/useAjiltan";
import { Select, notification } from "antd";

function ajiltanNemekh(
  { token, destroy, onChange, baiguullaga, setDaalgavar },
  ref
) {
  const { ajilchdiinGaralt } = useAjiltniiJagsaalt(token, baiguullaga?._id);

 const [songogdsonAjiltan, setSongogdsonAjiltan] = useState()

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      khadgalya() {
        if (!songogdsonAjiltan){
          notification.warn({
            description: "Ажилтан сонгоно уу !",
            message: "Анхаар",
          });
          return;
        }
        setDaalgavar((v) => ({
          ...v,
          ["ajiltniiId"]: songogdsonAjiltan._id,
          ["ajiltniiNer"]: songogdsonAjiltan.ner,
        }))
        destroy();
      },
    }),
    [songogdsonAjiltan]
  );

  return (
    <Select placeholder="Ажилтан" style={{ width: "100%" }}>
      {ajilchdiinGaralt?.jagsaalt?.map((mur) => (
        <Select.Option key={`${mur._id}ajiltan`} value={mur._id}>
          <div
            className="flex flex-row justify-between"
            onClick={() =>
              setSongogdsonAjiltan(mur)
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
