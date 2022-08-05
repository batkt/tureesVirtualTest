import React, { useState } from "react";
import _ from "lodash";

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

  return <div></div>;
}

export default React.forwardRef(asuultiinKhariultOruulakh);
