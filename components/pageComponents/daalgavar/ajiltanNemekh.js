import React from "react";
import { message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { url } from "services/uilchilgee";
import _ from "lodash";

function ajiltanNemekh(
  { token, destroy, zam, garchig, tailbar, zagvariinZam, onFinish,barilgiinId },
  ref
) {

  const [aldaa, setAldaa] = React.useState(null);
  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        _.isFunction(onFinish) && onFinish();
        destroy();
      },
    }),
    []
  );

  return (
    <div>
        ajiltan nemekh
      </div>
  );
}

export default React.forwardRef(ajiltanNemekh);
