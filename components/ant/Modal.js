import * as React from "react";
import * as ReactDOM from "react-dom";
import { Modal as AntModal } from "antd";

export function modal({ content, onOk, onCancel, width = 800, ...config }) {
  const div = document.createElement("div");
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
  }

  const handleOk = async () => {
    if (onOk) await onOk();
    destroy();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    destroy();
  };

  const contentNode = React.isValidElement(content) ? (
    React.cloneElement(content, { destroy })
  ) : (
    <div>{content}</div>
  );

  ReactDOM.render(
    <AntModal
      open
      closable={false}
      destroyOnClose
      width={width}
      {...config}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {contentNode}
    </AntModal>,
    div
  );
}

export default modal;
