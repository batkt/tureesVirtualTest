import React from "react";
import sorterCompare from "./sorterCompare";
export default function useOrder(defaultValue) {
  const [order, setOrder] = React.useState(defaultValue || {});
  function onChangeTable(r, o, s) {
    sorterCompare(s, setOrder, defaultValue);
  }
  return { order, onChangeTable, setOrder };
}
