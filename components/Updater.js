import { Button, notification } from "antd";
import socketIOClient from "socket.io-client";
import { useEffect, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { t } from "i18next";

export const url = "https://zevtabs.mn";

export const socket = () => socketIOClient(url, { transports: ["websocket"] });

const refreshPage = () => {
  window.location.reload();
};

var medegdelIrsenEsekh = null;

function Updater() {
  const [medegdel, setMedegdel] = useState(null);

  useEffect(() => {
    socket().on("tureesFront", (medegdel) => {
      if (!medegdel?.err && !medegdelIrsenEsekh) {
        medegdelIrsenEsekh = true;
        let notif = {
          icon: (
            <div className="text-yellow-500">
              <InfoCircleOutlined />
            </div>
          ),
          message: t("Мэдэгдэл"),
          description: (
            <div style={{ maxWidth: "20rem" }} className="break-words">
              {t("Системд шинэчлэлт хийгдсэн байна. Та шинэчлэлт хийх үү!")}
              <div>
                <Button
                  style={{ marginTop: 0, marginLeft: "auto" }}
                  size="small"
                  type="primary"
                  onClick={refreshPage}
                >
                  {t("Тийм")}
                </Button>
              </div>
            </div>
          ),
        };
        notification.info(t(notif));
        //setMedegdel(notif)
      }
    });
    return () => {
      socket().off("tureesFront");
    };
  }, []);

  if (medegdel)
    return (
      <div className="flex flex-row space-x-2 rounded-md bg-gray-100 p-2">
        <div className="text-xl">{medegdel.icon}</div>
        <div>
          <div>{t(medegdel.message)}</div>
          {t(medegdel.description)}
        </div>
      </div>
    );
  return null;
}

export default Updater;
