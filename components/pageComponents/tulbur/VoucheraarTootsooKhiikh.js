import { InputNumber } from "antd";
import _ from "lodash";
import React from "react";

function VoucheraarTootsooKhiikh({ onFinish, destroy }, ref) {
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
    []
  );

  return (
    <div className="flex flex-col space-y-2">
      <label className="">Ваучераар тооцоо хийх</label>
      <InputNumber placeholder="Ваучер дүн" style={{ width: "100%" }} />
    </div>
  );
}

export default React.forwardRef(VoucheraarTootsooKhiikh);
