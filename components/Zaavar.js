import React from "react";
import useZaavar from "../hooks/useZaavar";
import { Modal, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

function Zaavar({ token, id }) {
  const { tsonkh } = useZaavar(token, id);
  const { t, i18n } = useTranslation();

  const getContent = () => {
    if (i18n.language === "mn") {
      return tsonkh?.zaavar || tsonkh?.zaavarEN || "No content available";
    }
    return tsonkh?.zaavarEN || tsonkh?.zaavar || "No content available";
  };

  const getTitle = () => {
    if (i18n.language === "mn") {
      return tsonkh?.ner || tsonkh?.nerEN || "Information";
    }
    return tsonkh?.nerEN || tsonkh?.ner || "Information";
  };

  const zaavarKharya = () => {
    const content = getContent();
    const title = getTitle();

    Modal.info({
      className: "p-0",
      title: t(title),
      content: (
        <div
          className="sun-editor-editable"
          style={{ maxHeight: "60vh", overflowY: "auto", padding: "1rem" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ),
      okText: t("Хаах"),
      style: { minWidth: "50vw" },
    });
  };

  const hasContent = !!(tsonkh?.zaavar || tsonkh?.zaavarEN);

  if (hasContent) {
    return (
      <div className="cursor-pointer" style={{ lineHeight: 0 }}>
        <Tooltip title={t("Цонхны заавар")} onClick={zaavarKharya}>
          {id === "66ab276bd5a5012b78e05f9e" ? (
            <img
              className="color-black h-16"
              src="/infoRently.png"
              alt="Info"
            />
          ) : (
            <img className="h-5" src="/infoRently.png" alt="Info" />
          )}
        </Tooltip>
      </div>
    );
  } else {
    return null;
  }
}

export default Zaavar;
