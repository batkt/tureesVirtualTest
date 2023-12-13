import React from "react";
import sorterCompare from "./sorterCompare";
export default function useOrder(defaultValue) {
  const [order, setOrder] = React.useState(defaultValue || {});
  React.useEffect(() => {
    async function fetchData() {
      const order = await localStorage.getItem("order-" + window.location.href);
      if (!!order) {
        let orderUtga = JSON.parse(order);

        setOrder(orderUtga);
      }
    }
    fetchData();
  }, []);
  function onChangeTable(r, o, s) {
    sorterCompare(s, setOrder, defaultValue);
  }
  return { order, onChangeTable, setOrder };
}
