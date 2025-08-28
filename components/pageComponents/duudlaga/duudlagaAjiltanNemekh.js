import React, { useState } from "react";
import moment from "moment";
import {
  FileExcelOutlined,
  FileImageOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, notification, Upload } from "antd";
import { modal } from "components/ant/Modal";
import { useAuth } from "services/auth";
import DuudlagaAjiltanNemekh from "./duudlagaAjiltanNemekh"; 
import uilchilgee, { aldaaBarigch, url } from "services/uilchilgee";
import TextArea from "antd/lib/input/TextArea";

const ognoonuud = new Array(30)
  .fill("")
  .map((v, i) => moment().add(i, "d").format("YYYY-MM-DD 23:59:59"));

function DuudlagaNemekh({
  className,
  token,
  onRefresh,
  data,
  onClose,
  t,
  i18n,
}) {
  const ajitanRef = React.useRef(null);
  const { barilgiinId, baiguullaga } = useAuth();
  const [duudlaga, setDuudlaga] = React.useState({});
  const [zuragnuud, setZuragnuud] = useState([]);

  function onChange(k, v) {
    setDuudlaga((a) => ({ ...a, [k]: v }));
  }

  function ajiltanSongokh() {
    const footer = [
      <Button onClick={() => ajitanRef.current.khaaya()}>{t("Хаах")}</Button>,
      <Button
        type="primary"
        id="ajiltanSongokhButton"
        onClick={() => ajitanRef.current.khadgalya()}
      >
        {t("Cонгох")}
      </Button>,
    ];
    modal({
      title: t("Ажилтан сонгох"),
      icon: <FileExcelOutlined />,
      content: (
        <DuudlagaAjiltanNemekh
          t={t}
          duudlaga={duudlaga}
          ref={ajitanRef}
          token={token}
          onFinish={onRefresh}
          barilgiinId={barilgiinId}
          onChange={onChange}
          baiguullaga={baiguullaga}
          setDuudlaga={setDuudlaga}
        />
      ),
      footer,
    });
  }

  function khadgalakh() {
    if (!duudlaga.duusakhOgnoo) {
      notification.warn({
        description: t("Дуусах Огноо сонгоно уу !"),
        message: t("Анхаар"),
      });
      return;
    }
    if (!duudlaga.ajiltniiNer) {
      notification.warn({
        description: t("Ажилтан сонгоно уу !"),
        message: t("Анхаар"),
      });
      return;
    }
    if (!duudlaga.tailbar) {
      notification.warn({
        description: t("Дуудлага хэсэгт сэтгэгдэлээ оруулна уу !"),
        message: t("Анхаар"),
      });
      return;
    }

    duudlaga.baiguullagiinId = baiguullaga?._id;
    duudlaga.barilgiinId = barilgiinId;
    duudlaga.tuluv = 0;
    uilchilgee(token)
      .post("/duudlagaOruulya", duudlaga)
      .then(({ data }) => {
        if (data === "Amjilttai") {
          notification.success({
            message: t("Дуудлага амжилттай бүртгэгдлээ"),
          });
          setDuudlaga({});
          setZuragnuud([]);
          onRefresh();
          onClose();
        }
      })
      .catch(aldaaBarigch);
  }

  return (
    <div
      data-aos="fade-right"
      data-aos-delay="200"
      data-aos-anchor-placement="top-bottom"
      className={`relative col-span-12 space-y-10 rounded-2xl bg-white p-8 dark:bg-gray-900 md:rounded-none md:rounded-r-2xl xl:col-span-7 xl:px-12 2xl:px-28 ${className}`}
    >
      <div className="text-left text-xl font-medium">
        {t("Дуудлагын хугацааг сонгоно уу.")}
      </div>
      <div className="flex justify-between gap-2 overflow-x-scroll p-2 lg:justify-center xl:justify-between">
        {ognoonuud.map((ognoo) => (
          <div
            key={ognoo}
            onClick={() => onChange("duusakhOgnoo", ognoo)}
            className={`w-16 cursor-pointer rounded-2xl ${
              ognoo === duudlaga.duusakhOgnoo
                ? "bg-green-400 text-white dark:bg-green-400 dark:text-opacity-95"
                : ""
            } bg-gray-200 py-2 text-center font-bold transition-colors duration-500 hover:bg-green-400 dark:bg-gray-800 dark:text-white dark:text-opacity-40 dark:hover:bg-green-800 dark:hover:text-opacity-100`}
          >
            <div className="text-xl">{moment(ognoo).format("DD")}</div>
            <div className="w-16">
              {moment(ognoo).format(i18n.language === "mn" ? "MM" : "MMM")}{" "}
              {i18n.language === "mn" && "сар"}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xl font-medium">{t("Ажилтан сонгоно уу.")}</div>
      <div className="flex flex-col gap-5">
        <div
          onClick={ajiltanSongokh}
          className="flex cursor-pointer justify-between rounded-xl bg-gray-200 p-5 transition-colors duration-500 hover:bg-green-400 hover:text-white dark:bg-gray-800 dark:hover:bg-green-600 xl:w-2/3"
        >
          <div className="flex gap-5">
            <UserOutlined className="text-xl" />
            <div>
              <div className="text-lg font-medium">
                {t("Ажилтан")}
                {duudlaga?.ajiltniiNer && `: ${duudlaga?.ajiltniiNer}`}
              </div>
              <div>{t("Дуудлага илгээх ажилтан сонгоно уу")}</div>
            </div>
          </div>
          <div>
            <RightOutlined className="items-end self-center" />
          </div>
        </div>

        <Upload
          multiple={true}
          name="file"
          listType="picture"
          action={`${url}/zuragKhadgalya`}
          method="POST"
          fileList={zuragnuud}
          data={{ turul: "jpg" }}
          headers={{ Authorization: `bearer ${token}` }}
          onChange={(v) => {
            setZuragnuud(v.fileList);
            onChange(
              "zurguud",
              v.fileList.map((v) => v.response?.id)
            );
          }}
          className="flex w-2/3 flex-col rounded-full"
        >
          <div className="flex w-full cursor-pointer justify-between rounded-xl bg-gray-200 p-5 transition-colors duration-500 hover:bg-green-400 hover:text-white dark:bg-gray-800 dark:hover:bg-green-600">
            <div className="flex gap-5">
              <FileImageOutlined className="text-xl" />
              <div>
                <div className="text-lg font-medium">{t("Зураг")}</div>
                <div>{t("Та зураг сонгоно уу")}</div>
              </div>
            </div>
            <div>
              <RightOutlined className="items-end self-center" />
            </div>
          </div>
        </Upload>
      </div>
      <div>
        <TextArea
          id="DuudlagaNemekhTextArea"
          autoSize={{
            minRows: 1,
            maxRows: 4,
          }}
          value={duudlaga.tailbar}
          className="mt-10 h-24 w-full border-2 p-3 "
          placeholder={t("Дуудлага")}
          type="text"
          onChange={(e) => onChange("tailbar", e.target.value)}
        ></TextArea>
      </div>
      <div className="flex w-full justify-center">
        <button
          className="rounded-xl bg-green-500 px-24 py-1 text-lg font-medium text-white"
          onClick={khadgalakh}
        >
          {t("Хадгалах")}
        </button>
      </div>
    </div>
  );
}

export default DuudlagaNemekh;
