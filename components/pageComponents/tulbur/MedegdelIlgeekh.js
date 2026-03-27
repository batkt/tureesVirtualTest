import { Button, message, notification, Select } from "antd";
import _ from "lodash";
import React, { useMemo, useState } from "react";
import uilchilgee, { aldaaBarigch } from "services/uilchilgee";
import { useMailiinZagvarWithoutAuth } from "hooks/useMailiinZagvar";
import { t } from "i18next";
import { toast } from "sonner";

function GuilgeeKhiikh({ data, token, onFinish, destroy }, ref) {
  const [turul, setTurul] = useState("SMS");
  const [barimt, setBarimt] = React.useState();
  const [title, setTitle] = useState("");
  const [msj, onTextChange] = useState("");
  const { mailiinZagvarGaralt } = useMailiinZagvarWithoutAuth(
    token,
    turul,
    data.barilgiinId,
    data.baiguullagiinId
  );

  function khaaya() {
    destroy();
  }

  function send() {
    switch (turul) {
      case "App":
        appIlgeeye();
        break;
      case "Mail":
        mailIlgeeye();
        break;
      default:
        msgIlgeeye();
        break;
    }
  }
  async function mailIlgeeye() {
    if (!data?.mail) {
      notification.warning({
        message: t("Гэрээнд и-мэйл бүртгэгдээгүй байна"),
      });
      return;
    }
    const mailuud = [];
    var zagvar = barimt;
    for (const [key, value] of Object.entries(barimt)) {
      zagvar = barimt?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
    }
    mailuud.push({
      mail: "csodhuu@gmail.com",
      content: zagvar,
    });

    uilchilgee(token)
      .post(`/mailOlnoorIlgeeye`, { mailuud, subject: "Mail мэдэгдэл" })
      .then(({ data }) => {
        if (data === "Amjilttai" || data?.result === "Amjilttai") {
          if (data?.failedMails && data.failedMails.length > 0) {
            notification.error({
              message: t("И-мэйл илгээхэд алдаа гарлаа"),
              description: data.failedMails
                .map((a) => `${a.mail}: ${a.aldaa}`)
                .join(", "),
            });
          } else {
            notification.success({ message: t("И-мэйл Амжилттай илгээлээ") });
          }
          setContent("");
          setTitle("");
        } else {
          notification.error({ message: t("И-мэйл илгээхэд алдаа гарлаа") });
        }
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  async function msgIlgeeye() {
    var msgnuud = [];
    var text = barimt;
    for (const [key, value] of Object.entries(barimt)) {
      text = barimt?.replace(new RegExp(`&lt;${key}&gt;`, "g"), value);
    }

    if (!!data) {
      if (_.isArray(data?.utas))
        data?.utas.map((to) =>
          msgnuud.push({
            to: "80780740",
            text: text,
          })
        );
      else
        msgnuud.push({
          to: "80780740",
          text: text,
        });
    } else {
      toast.warning(t("Та SMS илгээх гэрээгээ сонгоно уу"));
      return;
    }
    uilchilgee(token)
      .post(`/msgIlgeeye`, { msgnuud })
      .then(({ data }) => {
        notification.success({ message: t("SMS Амжилттай илгээлээ") });
        setContent("");
        setTitle("");
      })
      .catch((e) => {
        aldaaBarigch(e);
      });
  }

  React.useImperativeHandle(
    ref,
    () => ({
      khaaya() {
        destroy();
      },
      khadgalya() {
        uilchilgee(token)
          .then(() => {
            notification.success({
              message: t("Амжилттай"),
            });
            destroy();
          })
          .catch(aldaaBarigch);
      },
    }),

    []
  );
  return (
    <div className="flex flex-col space-y-3 ">
      <div className="pr-1" data-aos="fade-right" data-aos-duration="1000">
        <div className="box p-2">
          <div className="grid grid-cols-3 gap-1 font-medium" role="tablist">
            {["SMS", "App", "Mail"].map((mur) => (
              <div
                key={mur}
                className={`flex-1 cursor-pointer rounded-md py-2 text-center ${
                  turul === mur ? "bg-green-500 text-white" : ""
                }`}
                onClick={() => setTurul(mur)}
              >
                {mur}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div data-aos="fade-right" data-aos-duration="1000">
        <Select
          placeholder={t("Загварын төрөл")}
          onChange={setBarimt}
          className="w-full rounded-md"
        >
          {mailiinZagvarGaralt?.jagsaalt?.map((a) => (
            <Select.Option key={a._id} value={a.mail}>
              {a.ner}
            </Select.Option>
          ))}
        </Select>
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          className="flex w-full flex-row justify-end "
        >
          <div className="space-x-3 space-y-3">
            <Button onClick={khaaya}>{t("Хаах")}</Button>
            <Button type="primary" onClick={send}>
              {t("Илгээх")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(GuilgeeKhiikh);
