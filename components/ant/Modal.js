import * as React from "react";
import * as ReactDOM from "react-dom";
import { Modal } from "antd";
export function modal({ content, ...config }) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  //   function keyUp(e) {
  //     if (e.key === "Escape") {
  //       destroy();
  //       document.removeEventListener("keyup", keyUp);
  //     }
  //   }

  //   document.addEventListener("keyup", keyUp);

  ReactDOM.render(
    <Modal visible closable={false} {...config}>
      {React.cloneElement(content, { destroy })}
    </Modal>,
    div
  );
}
