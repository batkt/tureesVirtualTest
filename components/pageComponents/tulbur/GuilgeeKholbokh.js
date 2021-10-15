import { Select } from "antd";
import _ from "lodash";
import React from "react";
import useGereeniiJagsaalt from "hooks/useGereeniiJagsaalt";

function GuilgeeKholbokh({ token, baiguullagiinId, onFinish, destroy }, ref) {
  const [geree, setGeree] = React.useState(null);
  const { gereeniiMedeelel, setGereeniiKhuudaslalt } = useGereeniiJagsaalt(
    token,
    baiguullagiinId
  );
  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
      khadgalya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
    }),
    [geree]
  );

  return (
    <div className="flex flex-col space-y-2">
      <label className="">Гүйлгээнд гэрээ холбох</label>
      <Select
        placeholder="Гэрээ"
        onSearch={(search) => setGereeniiKhuudaslalt((a) => ({ ...a, search }))}
        onChange={setGeree}
      >
        {gereeniiMedeelel?.jagsaalt?.map((mur) => {
          return (
            <Select.Option key={mur._id} value={mur._id}>
              {mur.gereeniiDugaar}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
}

export default React.forwardRef(GuilgeeKholbokh);
