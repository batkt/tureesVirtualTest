import React from "react";
import ReactDOM from "react-dom/client";
import { Modal as AntModal } from "antd";

const activeModalRoots = new Set();

export const modal = ({
  title,
  content,
  footer,
  onCancel,
  className,
  style,
  maskClosable = false,
  ...rest
}) => {
  const div = document.createElement("div");
  div.setAttribute("data-modal-container", "true");
  document.body.appendChild(div);

  const root = ReactDOM.createRoot(div);
  activeModalRoots.add(root);

  let isOpen = true;
  let isDestroyed = false;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closeModal();
  };

  const closeModal = () => {
    if (!isOpen || isDestroyed) return;
    isOpen = false;
    isDestroyed = true;

    activeModalRoots.delete(root);

    try {
      const renderContent = () => {
        if (React.isValidElement(content)) {
          return React.cloneElement(content, {
            destroy: closeModal,
            onClose: closeModal,
          });
        }
        return content;
      };

      root.render(
        <AntModal
          open={false}
          closable={false}
          title={title}
          footer={footer}
          onCancel={handleCancel}
          maskClosable={maskClosable}
          className={className}
          style={style}
          destroyOnClose
          {...rest}
        >
          {renderContent()}
        </AntModal>
      );
    } catch (error) {
      console.error("Error closing modal:", error);
      cleanup();
      return;
    }

    setTimeout(() => {
      cleanup();
    }, 300);
  };

  const cleanup = () => {
    try {
      if (activeModalRoots.has(root)) {
        root.unmount();
        activeModalRoots.delete(root);
      } else {
        try {
          root.unmount();
        } catch (e) {}
      }

      if (div && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    } catch (error) {
      console.error("Error unmounting modal:", error);
      try {
        if (div && div.parentNode) {
          div.parentNode.removeChild(div);
        }
      } catch (e) {}
      activeModalRoots.delete(root);
    }
  };

  const renderContent = () => {
    if (React.isValidElement(content)) {
      return React.cloneElement(content, {
        destroy: closeModal,
        onClose: closeModal,
      });
    }
    return content;
  };

  root.render(
    <AntModal
      open={isOpen}
      closable={false}
      title={title}
      footer={footer}
      onCancel={handleCancel}
      maskClosable={maskClosable}
      className={className}
      style={style}
      destroyOnClose
      {...rest}
    >
      {renderContent()}
    </AntModal>
  );

  return {
    destroy: closeModal,
    close: closeModal,
  };
};

export const destroyAll = () => {
  activeModalRoots.forEach((root) => {
    try {
      root.unmount();
    } catch (error) {
      console.error("Error destroying modal:", error);
    }
  });
  activeModalRoots.clear();

  try {
    const { Modal: AntModalStatic } = require("antd");
    if (typeof AntModalStatic?.destroyAll === "function") {
      AntModalStatic.destroyAll();
    }
  } catch (error) {}

  const modalContainers = document.querySelectorAll(
    "body > div[data-modal-container]"
  );
  modalContainers.forEach((container) => {
    try {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    } catch (error) {}
  });
};
