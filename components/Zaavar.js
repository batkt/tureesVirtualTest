import React, { useMemo } from "react";
import useZaavar from "../hooks/useZaavar";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

function Zaavar({ token, id }) {
  const { tsonkh } = useZaavar(token, id);
  const { t, i18n } = useTranslation();

  const zaavarKharya = () => {
    Modal.info({
      className: "p-0",
      title: t(tsonkh?.ner),
      content: (
        <div
          className="sun-editor-editable"
          dangerouslySetInnerHTML={
            i18n.language === "mn"
              ? { __html: tsonkh?.zaavar }
              : { __html: tsonkh?.zaavarEN }
          }
        />
      ),
      okText: t("Хаах"),
      style: { minWidth: "50vw" },
    });
  };
  if (!!tsonkh?.zaavar)
    return (
      <div className="cursor-pointer" style={{ lineHeight: 0 }}>
        <Tooltip title={t("Цонхны заавар")} onClick={zaavarKharya}>
          {id === "66ab276bd5a5012b78e05f9e" ?
            (<img className="h-16 color-black" src="/infoRently.png" />)
            :
            <img className="h-5" src="/infoRently.png" />
          }
        </Tooltip>
      </div>
    );
  else return null;
}

export default Zaavar;
